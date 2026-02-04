// Drip email scheduling and trigger system
// Manages when to send onboarding emails based on user journey

import {
  welcomeDripEmail,
  incompleteDocumentEmail,
  teamTrainingReminderEmail,
  trialEndingSoonEmail,
  trialEndsTomorrowEmail,
} from './drip-templates'

// Email types for drip campaign
export type DripEmailType = 
  | 'drip_day_1_welcome'
  | 'drip_day_2_incomplete'
  | 'drip_day_5_training'
  | 'drip_day_10_trial_ending'
  | 'drip_day_13_trial_ends_tomorrow'

export interface DripEmailJob {
  type: DripEmailType
  userId: string
  orgId: string
  email: string
  scheduledFor: Date
  metadata?: Record<string, unknown>
}

// Calculate drip schedule based on trial start date
export function calculateDripSchedule(trialStartedAt: Date): Map<DripEmailType, Date> {
  const schedule = new Map<DripEmailType, Date>()
  
  // Day 1: Immediately (or shortly after signup)
  schedule.set('drip_day_1_welcome', new Date(trialStartedAt.getTime() + 1000 * 60 * 5)) // 5 min after signup
  
  // Day 2: Next day at 10am user's time (approximate)
  const day2 = new Date(trialStartedAt)
  day2.setDate(day2.getDate() + 1)
  day2.setHours(10, 0, 0, 0)
  schedule.set('drip_day_2_incomplete', day2)
  
  // Day 5
  const day5 = new Date(trialStartedAt)
  day5.setDate(day5.getDate() + 4)
  day5.setHours(10, 0, 0, 0)
  schedule.set('drip_day_5_training', day5)
  
  // Day 10 (4 days left)
  const day10 = new Date(trialStartedAt)
  day10.setDate(day10.getDate() + 9)
  day10.setHours(10, 0, 0, 0)
  schedule.set('drip_day_10_trial_ending', day10)
  
  // Day 13 (1 day left)
  const day13 = new Date(trialStartedAt)
  day13.setDate(day13.getDate() + 12)
  day13.setHours(10, 0, 0, 0)
  schedule.set('drip_day_13_trial_ends_tomorrow', day13)
  
  return schedule
}

// Check if an email should be sent based on conditions
export interface UserDripContext {
  userId: string
  orgId: string
  email: string
  name: string
  company: string
  trialStartedAt: Date
  hasCompletedImpactAssessment: boolean
  impactAssessmentProgress: number // 0-100
  documentsGenerated: number
  teamInvitedCount: number
  teamCompletedCount: number
  teamPendingNames: string[]
  completedTasks: number
  totalTasks: number
  progressPercent: number
  subscriptionStatus: string
}

export function shouldSendEmail(
  emailType: DripEmailType,
  context: UserDripContext
): boolean {
  // Don't send drip emails to paying customers
  if (context.subscriptionStatus === 'active') {
    return false
  }

  switch (emailType) {
    case 'drip_day_1_welcome':
      // Always send welcome email
      return true
    
    case 'drip_day_2_incomplete':
      // Only send if impact assessment is started but not complete
      return !context.hasCompletedImpactAssessment && context.impactAssessmentProgress > 0
    
    case 'drip_day_5_training':
      // Only send if team is invited but not all completed
      return context.teamInvitedCount > 0 && context.teamCompletedCount < context.teamInvitedCount
    
    case 'drip_day_10_trial_ending':
    case 'drip_day_13_trial_ends_tomorrow':
      // Always send trial reminders (unless converted)
      return true
    
    default:
      return false
  }
}

// Generate email content based on type and context
export function generateDripEmail(
  emailType: DripEmailType,
  context: UserDripContext
): { subject: string; html: string } | null {
  if (!shouldSendEmail(emailType, context)) {
    return null
  }

  const trialDaysLeft = Math.max(0, 14 - Math.floor(
    (Date.now() - context.trialStartedAt.getTime()) / (1000 * 60 * 60 * 24)
  ))

  switch (emailType) {
    case 'drip_day_1_welcome':
      return welcomeDripEmail({
        name: context.name,
        company: context.company,
      })
    
    case 'drip_day_2_incomplete':
      return incompleteDocumentEmail({
        name: context.name,
        progressPercent: context.impactAssessmentProgress,
        documentName: 'Impact Assessment',
      })
    
    case 'drip_day_5_training':
      return teamTrainingReminderEmail({
        name: context.name,
        totalInvited: context.teamInvitedCount,
        completedCount: context.teamCompletedCount,
        pendingNames: context.teamPendingNames,
      })
    
    case 'drip_day_10_trial_ending':
      return trialEndingSoonEmail({
        name: context.name,
        daysLeft: trialDaysLeft,
        progressPercent: context.progressPercent,
        completedTasks: context.completedTasks,
        totalTasks: context.totalTasks,
      })
    
    case 'drip_day_13_trial_ends_tomorrow':
      return trialEndsTomorrowEmail({
        name: context.name,
        progressPercent: context.progressPercent,
        completedTasks: context.completedTasks,
        totalTasks: context.totalTasks,
      })
    
    default:
      return null
  }
}

// Queue a drip email for sending
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queueDripEmail(
  supabaseAdmin: any,
  job: DripEmailJob,
  emailContent: { subject: string; html: string }
): Promise<string | null> {
  const { data, error } = await supabaseAdmin.from('email_queue').insert({
    user_id: job.userId,
    email_type: job.type,
    to_email: job.email,
    subject: emailContent.subject,
    html_body: emailContent.html,
    metadata: {
      ...job.metadata,
      scheduled_for: job.scheduledFor.toISOString(),
    },
    status: 'pending',
  }).select('id').single()

  if (error) {
    console.error('Failed to queue drip email:', error)
    return null
  }

  return data?.id || null
}

// Check and send due drip emails (called by cron)
// Note: This is a placeholder - actual drip processing is done via the cron API route
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processDripEmails(
  supabaseAdmin: any
): Promise<{ processed: number; sent: number; skipped: number }> {
  const stats = { processed: 0, sent: 0, skipped: 0 }

  // Get all organizations in trial with trial_started_at
  const { data: trialOrgs, error: orgsError } = await supabaseAdmin
    .from('organizations')
    .select(`
      id,
      name,
      trial_started_at,
      users!inner(id, email)
    `)
    .not('trial_started_at', 'is', null)
    .or('subscription_status.is.null,subscription_status.eq.trialing')

  if (orgsError || !trialOrgs) {
    console.error('Failed to fetch trial orgs:', orgsError)
    return stats
  }

  // Type the response
  type OrgWithUsers = {
    id: string
    name: string
    trial_started_at: string
    users: { id: string; email: string }[]
  }

  for (const org of trialOrgs as OrgWithUsers[]) {
    stats.processed++
    
    const trialStartedAt = new Date(org.trial_started_at)
    const schedule = calculateDripSchedule(trialStartedAt)
    const now = new Date()

    // Check each scheduled email
    for (const [emailType, scheduledFor] of schedule) {
      // Skip if not yet due
      if (scheduledFor > now) continue

      // Check if already sent
      const { count } = await supabaseAdmin
        .from('email_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', org.users[0]?.id)
        .eq('email_type', emailType)

      if ((count || 0) > 0) continue

      // Get full context and generate email
      // In production, you'd fetch all the context data here
      // For now, this is a placeholder that would be filled in
      
      stats.skipped++ // Would be stats.sent++ after actual sending
    }
  }

  return stats
}

export default {
  calculateDripSchedule,
  shouldSendEmail,
  generateDripEmail,
  queueDripEmail,
  processDripEmails,
}
