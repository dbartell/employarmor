import { createClient as createServiceClient } from '@supabase/supabase-js'

export type NotificationType =
  | 'training_completed'
  | 'disclosure_signed'
  | 'tool_request_submitted'
  | 'employee_joined'
  | 'compliance_score_alert'
  | 'training_assigned'
  | 'training_reminder'
  | 'tool_request_decided'
  | 'disclosure_assigned'
  | 'renewal_reminders'
  | 'drip_emails'

/**
 * Check if a user should receive a specific notification type.
 * Returns true by default if no preferences row exists (opt-out model).
 */
export async function shouldNotify(
  userId: string,
  orgId: string,
  notificationType: NotificationType
): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      // Can't check preferences, default to sending
      return true
    }

    const supabase = createServiceClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabase
      .from('notification_preferences')
      .select(notificationType)
      .eq('user_id', userId)
      .eq('organization_id', orgId)
      .single()

    if (error || !data) {
      // No preferences row = use defaults (send)
      return true
    }

    return (data as Record<string, boolean>)[notificationType] ?? true
  } catch {
    // On error, default to sending
    return true
  }
}

/**
 * Get admin/owner user IDs and emails for an organization.
 */
export async function getOrgAdmins(orgId: string): Promise<Array<{ userId: string; email: string; name: string }>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return []
  }

  const supabase = createServiceClient(supabaseUrl, serviceRoleKey)

  const { data: members } = await supabase
    .from('organization_members')
    .select('user_id, role')
    .eq('organization_id', orgId)
    .in('role', ['owner', 'admin'])

  if (!members?.length) return []

  const admins: Array<{ userId: string; email: string; name: string }> = []

  for (const member of members) {
    const { data: userData } = await supabase.auth.admin.getUserById(member.user_id)
    if (userData?.user?.email) {
      admins.push({
        userId: member.user_id,
        email: userData.user.email,
        name: userData.user.user_metadata?.full_name || userData.user.email.split('@')[0],
      })
    }
  }

  return admins
}
