import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateDripEmail, DripEmailType, UserDripContext } from '@/lib/emails/scheduler'

// Use admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verify cron secret for security
function verifyCronSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (!cronSecret) {
    console.warn('CRON_SECRET not set - allowing request in development')
    return process.env.NODE_ENV === 'development'
  }
  
  return authHeader === `Bearer ${cronSecret}`
}

export async function POST(req: NextRequest) {
  // Verify cron auth
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = { processed: 0, sent: 0, skipped: 0, errors: 0 }
    const now = new Date()

    // Get pending drip emails that are due
    const { data: pendingEmails, error: fetchError } = await supabaseAdmin
      .from('drip_email_events')
      .select(`
        id,
        org_id,
        email_type,
        scheduled_for,
        organizations (
          id,
          name,
          trial_started_at,
          subscription_status,
          documents_generated,
          quiz_tools,
          users!inner (id, email)
        )
      `)
      .is('sent_at', null)
      .is('skipped_at', null)
      .lte('scheduled_for', now.toISOString())
      .limit(50) // Process in batches

    if (fetchError) {
      console.error('Failed to fetch pending emails:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    for (const emailEvent of pendingEmails || []) {
      stats.processed++
      
      const org = emailEvent.organizations as unknown as {
        id: string
        name: string
        trial_started_at: string | null
        subscription_status: string | null
        documents_generated: number
        quiz_tools: string[] | null
        users: { id: string; email: string }[]
      }

      if (!org || !org.users?.[0]) {
        // Skip if no org or user
        await markEmailSkipped(emailEvent.id, 'no_org_or_user')
        stats.skipped++
        continue
      }

      // Check if user has converted (no need for drip)
      if (org.subscription_status === 'active') {
        await markEmailSkipped(emailEvent.id, 'already_subscribed')
        stats.skipped++
        continue
      }

      // Build context for email generation
      // In production, you'd fetch more data here (training stats, etc.)
      const context: UserDripContext = {
        userId: org.users[0].id,
        orgId: org.id,
        email: org.users[0].email,
        name: org.name.split(' ')[0] || 'there', // First word of company name as fallback
        company: org.name,
        trialStartedAt: org.trial_started_at ? new Date(org.trial_started_at) : new Date(),
        hasCompletedImpactAssessment: false, // Would fetch from documents table
        impactAssessmentProgress: 0, // Would calculate
        documentsGenerated: org.documents_generated || 0,
        teamInvitedCount: 0, // Would fetch
        teamCompletedCount: 0,
        teamPendingNames: [],
        completedTasks: org.documents_generated || 0, // Simplified
        totalTasks: 5, // Simplified
        progressPercent: Math.min(100, (org.documents_generated || 0) * 20),
        subscriptionStatus: org.subscription_status || 'none',
      }

      // Generate email content
      const emailContent = generateDripEmail(emailEvent.email_type as DripEmailType, context)

      if (!emailContent) {
        // Conditions not met for this email
        await markEmailSkipped(emailEvent.id, 'conditions_not_met')
        stats.skipped++
        continue
      }

      // Queue the email for sending
      const { error: queueError } = await supabaseAdmin.from('email_queue').insert({
        user_id: org.users[0].id,
        email_type: emailEvent.email_type,
        to_email: org.users[0].email,
        subject: emailContent.subject,
        html_body: emailContent.html,
        metadata: { drip_event_id: emailEvent.id },
        status: 'pending',
      })

      if (queueError) {
        console.error('Failed to queue email:', queueError)
        stats.errors++
        continue
      }

      // Mark as sent
      await supabaseAdmin
        .from('drip_email_events')
        .update({ sent_at: now.toISOString() })
        .eq('id', emailEvent.id)

      stats.sent++
    }

    return NextResponse.json({
      success: true,
      stats,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('Drip email cron error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function markEmailSkipped(eventId: string, reason: string) {
  await supabaseAdmin
    .from('drip_email_events')
    .update({ 
      skipped_at: new Date().toISOString(),
      skip_reason: reason,
    })
    .eq('id', eventId)
}

// Also support GET for manual testing
export async function GET(req: NextRequest) {
  return POST(req)
}
