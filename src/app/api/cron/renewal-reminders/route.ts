import { createClient } from '@supabase/supabase-js'
import { renewalReminderEmail, type RenewalUrgency } from '@/lib/email-templates'
import { NextRequest, NextResponse } from 'next/server'

// Notification tiers: days until expiry → notification type
const NOTIFICATION_TIERS = [
  { days: 90, type: 'day_90', urgency: 'heads_up' as RenewalUrgency },
  { days: 60, type: 'day_60', urgency: 'reminder' as RenewalUrgency },
  { days: 30, type: 'day_30', urgency: 'warning' as RenewalUrgency },
  { days: 7, type: 'day_7', urgency: 'urgent' as RenewalUrgency },
  { days: 0, type: 'day_0', urgency: 'expired' as RenewalUrgency },
  { days: -30, type: 'day_-30', urgency: 'lapsed' as RenewalUrgency },
]

interface DocumentWithOrg {
  id: string
  org_id: string
  document_type: string
  title: string
  jurisdiction: string | null
  expires_at: string
  organizations: {
    id: string
    name: string
    profiles: Array<{
      id: string
      email: string
      role: string
    }>
  }
}

// Send email via Resend (or log if not configured)
async function sendEmail(to: string[], subject: string, html: string): Promise<string | null> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.log('[RENEWAL REMINDER] Email would be sent (Resend not configured):')
    console.log(`  To: ${to.join(', ')}`)
    console.log(`  Subject: ${subject}`)
    return 'logged_' + Date.now()
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EmployArmor Compliance <compliance@employarmor.com>',
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[RENEWAL REMINDER] Resend API error:', error)
      return null
    }

    const data = await response.json()
    return data.id
  } catch (error) {
    console.error('[RENEWAL REMINDER] Failed to send email:', error)
    return null
  }
}

// Helper to get start and end of a day offset
function getDayRange(daysOffset: number): { start: Date; end: Date } {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + daysOffset)

  const end = new Date(start)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel Cron or manual trigger)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service role key for admin access
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
    details: [] as Array<{ document: string; tier: string; status: string }>,
  }

  // Process each notification tier
  for (const tier of NOTIFICATION_TIERS) {
    const { start, end } = getDayRange(tier.days)

    // Find documents expiring in this window that haven't been notified for this tier
    const { data: documents, error: queryError } = await supabase
      .from('compliance_documents')
      .select(`
        id,
        org_id,
        document_type,
        title,
        jurisdiction,
        expires_at,
        organizations!inner (
          id,
          name,
          profiles (
            id,
            email,
            role
          )
        )
      `)
      .gte('expires_at', start.toISOString())
      .lte('expires_at', end.toISOString())
      .neq('status', 'renewed')

    if (queryError) {
      console.error(`[RENEWAL REMINDER] Query error for tier ${tier.type}:`, queryError)
      results.errors++
      continue
    }

    if (!documents || documents.length === 0) {
      continue
    }

    for (const doc of documents as unknown as DocumentWithOrg[]) {
      results.processed++

      // Check if notification already sent for this tier
      const { data: existingNotification } = await supabase
        .from('renewal_notifications')
        .select('id')
        .eq('document_id', doc.id)
        .eq('notification_type', tier.type)
        .single()

      if (existingNotification) {
        results.details.push({
          document: doc.title,
          tier: tier.type,
          status: 'already_sent',
        })
        continue
      }

      // Get admin/owner emails from the org
      const adminEmails = doc.organizations.profiles
        ?.filter((p) => p.role === 'admin' || p.role === 'owner')
        .map((p) => p.email)
        .filter(Boolean) || []

      // Fallback: if no admins found, try to get any profile email
      if (adminEmails.length === 0 && doc.organizations.profiles?.length > 0) {
        adminEmails.push(doc.organizations.profiles[0].email)
      }

      if (adminEmails.length === 0) {
        results.details.push({
          document: doc.title,
          tier: tier.type,
          status: 'no_recipients',
        })
        continue
      }

      // Generate email
      const daysUntilExpiry = Math.round((new Date(doc.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      const email = renewalReminderEmail({
        name: doc.organizations.name,
        documentType: doc.document_type,
        documentTitle: doc.title,
        jurisdiction: doc.jurisdiction || undefined,
        expiresAt: new Date(doc.expires_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        daysUntilExpiry: Math.abs(daysUntilExpiry),
        urgency: tier.urgency,
      })

      // Send email
      const messageId = await sendEmail(adminEmails, email.subject, email.html)

      if (messageId) {
        // Record notification
        const { error: insertError } = await supabase
          .from('renewal_notifications')
          .insert({
            document_id: doc.id,
            notification_type: tier.type,
            email_to: adminEmails.join(','),
            email_message_id: messageId,
          })

        if (insertError) {
          console.error('[RENEWAL REMINDER] Failed to record notification:', insertError)
        }

        results.sent++
        results.details.push({
          document: doc.title,
          tier: tier.type,
          status: 'sent',
        })
      } else {
        results.errors++
        results.details.push({
          document: doc.title,
          tier: tier.type,
          status: 'send_failed',
        })
      }
    }
  }

  console.log('[RENEWAL REMINDER] Cron completed:', results)

  return NextResponse.json({
    success: true,
    ...results,
    timestamp: new Date().toISOString(),
  })
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
