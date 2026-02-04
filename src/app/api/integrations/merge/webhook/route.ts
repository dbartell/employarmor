import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { MergeClient, createMergeClient } from '@/lib/merge/client'
import {
  mapMergeCandidate,
  mapMergeApplication,
  createCandidateSyncEvent,
  createApplicationSyncEvent,
  isAIScreeningStage,
} from '@/lib/merge/mappers'
import { generateCandidateFlags, generateApplicationFlags } from '@/lib/merge/compliance-engine'

// Use admin client for webhooks (no user context)
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface MergeWebhookPayload {
  hook: {
    event: string
    target: string
  }
  linked_account: {
    id: string
    integration: string
    integration_slug: string
    end_user_origin_id: string
    end_user_organization_name: string
    end_user_email_address: string
    status: string
  }
  data?: {
    id?: string
    model?: string
    [key: string]: unknown
  }
}

/**
 * POST /api/integrations/merge/webhook
 * 
 * Handle incoming webhook events from Merge.dev.
 * Events include: sync.completed, candidate.created, application.created, etc.
 */
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-merge-signature')
    const payload = await req.text()

    // Verify webhook signature (implement proper verification for production)
    const webhookSecret = process.env.MERGE_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      const isValid = MergeClient.verifyWebhookSignature(payload, signature, webhookSecret)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const data: MergeWebhookPayload = JSON.parse(payload)
    const { hook, linked_account } = data

    console.log(`Received Merge webhook: ${hook.event} for ${linked_account.integration}`)

    const supabase = getAdminClient()

    // Find the integration by the end_user_origin_id (our org ID)
    const { data: integration } = await supabase
      .from('ats_integrations')
      .select('*')
      .eq('org_id', linked_account.end_user_origin_id)
      .eq('integration_slug', linked_account.integration_slug)
      .single()

    if (!integration) {
      console.error('Integration not found for webhook:', linked_account.end_user_origin_id)
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
    }

    // Handle different webhook events
    switch (hook.event) {
      case 'sync.completed':
        await handleSyncCompleted(supabase, integration)
        break

      case 'candidate.created':
        if (data.data?.id) {
          await handleCandidateChange(supabase, integration, data.data.id as string, true)
        }
        break

      case 'candidate.updated':
        if (data.data?.id) {
          await handleCandidateChange(supabase, integration, data.data.id as string, false)
        }
        break

      case 'application.created':
      case 'application.updated':
        if (data.data?.id) {
          await handleApplicationChange(supabase, integration, data.data.id as string)
        }
        break

      case 'linked_account.deleted':
        await handleAccountDeleted(supabase, integration)
        break

      default:
        console.log(`Unhandled webhook event: ${hook.event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleSyncCompleted(
  supabase: ReturnType<typeof getAdminClient>,
  integration: { id: string; org_id: string; merge_account_token: string }
) {
  // Update last sync timestamp
  await supabase
    .from('ats_integrations')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', integration.id)

  // Log the sync event
  await supabase.from('ats_audit_events').insert({
    org_id: integration.org_id,
    integration_id: integration.id,
    event_type: 'sync_completed',
    event_source: 'merge_webhook',
    description: 'Merge.dev sync completed',
    severity: 'info',
    metadata: {},
    occurred_at: new Date().toISOString(),
  })
}

async function handleCandidateChange(
  supabase: ReturnType<typeof getAdminClient>,
  integration: { id: string; org_id: string; merge_account_token: string; settings?: Record<string, unknown> },
  candidateMergeId: string,
  isNewCandidate: boolean = false
) {
  try {
    const mergeClient = createMergeClient(integration.merge_account_token)
    const candidate = await mergeClient.getCandidate(candidateMergeId)

    // Map to our format
    const syncedCandidate = mapMergeCandidate(candidate, integration.org_id, integration.id)
    const flags = generateCandidateFlags(syncedCandidate)

    // Upsert candidate
    const { data: savedCandidate } = await supabase
      .from('synced_candidates')
      .upsert(syncedCandidate, { onConflict: 'org_id,merge_id' })
      .select()
      .single()

    if (savedCandidate) {
      // Create audit event
      const auditEvent = createCandidateSyncEvent({
        ...syncedCandidate,
        id: savedCandidate.id,
      }, 'merge_webhook')
      
      await supabase.from('ats_audit_events').insert(auditEvent)

      // Log any compliance flags
      for (const flag of flags) {
        await supabase.from('ats_audit_events').insert({
          org_id: integration.org_id,
          integration_id: integration.id,
          candidate_id: savedCandidate.id,
          event_type: 'compliance_alert',
          event_source: 'merge_webhook',
          description: flag.message,
          severity: flag.severity,
          metadata: { flag_type: flag.type },
          occurred_at: new Date().toISOString(),
        })
      }

      // Auto-create consent record for new candidates (if enabled)
      if (isNewCandidate && integration.settings?.auto_consent_tracking) {
        const email = candidate.email_addresses?.[0]?.value
        const firstName = candidate.first_name || ''
        const lastName = candidate.last_name || ''
        
        if (email) {
          // Check if consent record already exists
          const { data: existingConsent } = await supabase
            .from('consent_records')
            .select('id')
            .eq('org_id', integration.org_id)
            .eq('candidate_email', email)
            .single()

          if (!existingConsent) {
            // Create a pending consent record for tracking
            await supabase.from('consent_records').insert({
              org_id: integration.org_id,
              candidate_name: `${firstName} ${lastName}`.trim() || 'Unknown',
              candidate_email: email,
              disclosure_date: new Date().toISOString().split('T')[0],
              status: 'pending',
              source: 'ats_sync',
            })

            // Log the auto-tracking event
            await supabase.from('ats_audit_events').insert({
              org_id: integration.org_id,
              integration_id: integration.id,
              candidate_id: savedCandidate.id,
              event_type: 'consent_tracking',
              event_source: 'merge_webhook',
              description: `Auto-created pending consent record for ${email}`,
              severity: 'info',
              metadata: { candidate_email: email },
              occurred_at: new Date().toISOString(),
            })
          }
        }
      }
    }
  } catch (error) {
    console.error('Error handling candidate change:', error)
  }
}

async function handleApplicationChange(
  supabase: ReturnType<typeof getAdminClient>,
  integration: { id: string; org_id: string; merge_account_token: string },
  applicationMergeId: string
) {
  try {
    const mergeClient = createMergeClient(integration.merge_account_token)
    const application = await mergeClient.getApplication(applicationMergeId)

    // Get the candidate from our database
    const { data: candidate } = await supabase
      .from('synced_candidates')
      .select('*')
      .eq('org_id', integration.org_id)
      .eq('merge_id', application.candidate)
      .single()

    if (!candidate) {
      console.log('Candidate not found for application, syncing candidate first')
      // Sync the candidate first
      await handleCandidateChange(supabase, integration, application.candidate)
      return // Will be processed again on next webhook
    }

    // Get job info if available
    let jobInfo: { name: string | null; offices: string[] } | undefined
    if (application.job) {
      try {
        const job = await mergeClient.getJob(application.job)
        jobInfo = {
          name: job.name,
          offices: job.offices || [],
        }
      } catch {
        // Job fetch failed, continue without it
      }
    }

    // Get stage info
    let stageInfo: { name: string | null; isAI: boolean } | undefined
    if (application.current_stage) {
      try {
        const stages = await mergeClient.getJobInterviewStages({ jobId: application.job || undefined })
        const stage = stages.results.find(s => s.id === application.current_stage)
        if (stage?.name) {
          stageInfo = {
            name: stage.name,
            isAI: isAIScreeningStage(stage.name),
          }
        }
      } catch {
        // Stage fetch failed, continue without it
      }
    }

    // Map to our format
    const syncedApplication = mapMergeApplication(
      application,
      integration.org_id,
      integration.id,
      candidate.id,
      jobInfo,
      stageInfo
    )

    // Add compliance flags
    const flags = generateApplicationFlags(syncedApplication, candidate)
    syncedApplication.compliance_flags = [...syncedApplication.compliance_flags, ...flags]

    // Upsert application
    const { data: savedApplication } = await supabase
      .from('synced_applications')
      .upsert(syncedApplication, { onConflict: 'org_id,merge_id' })
      .select()
      .single()

    if (savedApplication) {
      // Create audit event
      const auditEvent = createApplicationSyncEvent({
        ...syncedApplication,
        id: savedApplication.id,
      }, 'merge_webhook')
      
      await supabase.from('ats_audit_events').insert(auditEvent)
    }
  } catch (error) {
    console.error('Error handling application change:', error)
  }
}

async function handleAccountDeleted(
  supabase: ReturnType<typeof getAdminClient>,
  integration: { id: string; org_id: string }
) {
  // Mark integration as disconnected
  await supabase
    .from('ats_integrations')
    .update({ status: 'disconnected' })
    .eq('id', integration.id)

  // Log the disconnection
  await supabase.from('ats_audit_events').insert({
    org_id: integration.org_id,
    integration_id: integration.id,
    event_type: 'sync_completed',
    event_source: 'merge_webhook',
    description: 'ATS integration disconnected',
    severity: 'warning',
    metadata: { reason: 'linked_account.deleted' },
    occurred_at: new Date().toISOString(),
  })
}
