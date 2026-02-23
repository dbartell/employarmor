'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserMembership } from '@/lib/permissions-server'

export interface NotificationPreferences {
  // Admin
  training_completed: boolean
  disclosure_signed: boolean
  tool_request_submitted: boolean
  employee_joined: boolean
  compliance_score_alert: boolean
  // Employee
  training_assigned: boolean
  training_reminder: boolean
  tool_request_decided: boolean
  disclosure_assigned: boolean
  // System
  renewal_reminders: boolean
  drip_emails: boolean
}

const ADMIN_DEFAULTS: NotificationPreferences = {
  training_completed: true,
  disclosure_signed: true,
  tool_request_submitted: true,
  employee_joined: true,
  compliance_score_alert: true,
  training_assigned: true,
  training_reminder: true,
  tool_request_decided: true,
  disclosure_assigned: true,
  renewal_reminders: true,
  drip_emails: true,
}

const EMPLOYEE_DEFAULTS: NotificationPreferences = {
  training_completed: false,
  disclosure_signed: false,
  tool_request_submitted: false,
  employee_joined: false,
  compliance_score_alert: false,
  training_assigned: true,
  training_reminder: true,
  tool_request_decided: true,
  disclosure_assigned: true,
  renewal_reminders: true,
  drip_emails: true,
}

export async function getNotificationPreferences(orgId: string): Promise<{
  preferences: NotificationPreferences
  error: string | null
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { preferences: EMPLOYEE_DEFAULTS, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .eq('organization_id', orgId)
    .single()

  if (data && !error) {
    const { id, user_id, organization_id, created_at, updated_at, ...prefs } = data
    return { preferences: prefs as NotificationPreferences, error: null }
  }

  // Create default row based on role
  const membership = await getUserMembership(user.id)
  const isAdmin = membership?.role === 'owner' || membership?.role === 'admin'
  const defaults = isAdmin ? ADMIN_DEFAULTS : EMPLOYEE_DEFAULTS

  const { error: insertError } = await supabase
    .from('notification_preferences')
    .insert({
      user_id: user.id,
      organization_id: orgId,
      ...defaults,
    })

  if (insertError) {
    console.error('Error creating notification preferences:', insertError)
  }

  return { preferences: defaults, error: null }
}

export async function updateNotificationPreferences(
  orgId: string,
  prefs: Partial<NotificationPreferences>
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Ensure row exists
  await getNotificationPreferences(orgId)

  const { error } = await supabase
    .from('notification_preferences')
    .update({ ...prefs, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('organization_id', orgId)

  if (error) {
    console.error('Error updating notification preferences:', error)
    return { error: error.message }
  }

  return { error: null }
}
