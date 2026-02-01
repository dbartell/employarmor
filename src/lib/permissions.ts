import { createClient } from '@/lib/supabase/server'
import type { MemberRole } from '@/types'

export type Permission = 
  | 'manage_billing'
  | 'manage_team'
  | 'change_roles'
  | 'run_audit'
  | 'generate_docs'
  | 'view_team_progress'
  | 'complete_training'
  | 'view_certificates'
  | 'manage_integrations'
  | 'delete_organization'

const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  owner: [
    'manage_billing',
    'manage_team',
    'change_roles',
    'run_audit',
    'generate_docs',
    'view_team_progress',
    'complete_training',
    'view_certificates',
    'manage_integrations',
    'delete_organization',
  ],
  admin: [
    'manage_team',
    'change_roles',
    'run_audit',
    'generate_docs',
    'view_team_progress',
    'complete_training',
    'view_certificates',
    'manage_integrations',
  ],
  manager: [
    'run_audit',
    'generate_docs',
    'view_team_progress',
    'complete_training',
    'view_certificates',
  ],
  member: [
    'complete_training',
    'view_certificates',
  ],
}

export function hasPermission(role: MemberRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canChangeToRole(currentRole: MemberRole, targetRole: MemberRole): boolean {
  // Owners can set any role
  if (currentRole === 'owner') return true
  
  // Admins can set roles except owner
  if (currentRole === 'admin' && targetRole !== 'owner') return true
  
  return false
}

export interface UserMembership {
  organization_id: string
  role: MemberRole
  user_id: string
}

export async function getUserMembership(userId: string): Promise<UserMembership | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('organization_members')
    .select('organization_id, role, user_id')
    .eq('user_id', userId)
    .single()
  
  return data as UserMembership | null
}

export async function requirePermission(permission: Permission): Promise<{ 
  membership: UserMembership
  userId: string 
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const membership = await getUserMembership(user.id)
  
  if (!membership) {
    throw new Error('No organization membership')
  }
  
  if (!hasPermission(membership.role, permission)) {
    throw new Error('Insufficient permissions')
  }
  
  return { membership, userId: user.id }
}

export function getRoleLabel(role: MemberRole): string {
  const labels: Record<MemberRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    manager: 'Manager',
    member: 'Team Member',
  }
  return labels[role]
}

export function getRoleDescription(role: MemberRole): string {
  const descriptions: Record<MemberRole, string> = {
    owner: 'Full access including billing and organization deletion',
    admin: 'Full access except billing',
    manager: 'Run audits, generate docs, view team progress',
    member: 'Complete training, view own certificates',
  }
  return descriptions[role]
}
