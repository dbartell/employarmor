import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export type UserRole = 'owner' | 'admin' | 'manager' | 'employee'

export interface EmployeeProfile {
  id: string
  user_id: string
  organization_id: string
  email: string
  role: UserRole
  department: string | null
  manager_id: string | null
  invited_at: string | null
  joined_at: string | null
  created_at: string
}

/**
 * Get user's role for a specific organization (server-side)
 */
export async function getUserRole(userId: string, orgId: string): Promise<UserRole | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('employee_profiles')
    .select('role')
    .eq('user_id', userId)
    .eq('organization_id', orgId)
    .single()
  
  if (error || !data) return null
  return data.role as UserRole
}

/**
 * Get user's employee profile (server-side)
 */
export async function getEmployeeProfile(userId: string, orgId: string): Promise<EmployeeProfile | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('employee_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('organization_id', orgId)
    .single()
  
  if (error || !data) return null
  return data as EmployeeProfile
}

/**
 * Get user's employee profile (client-side)
 */
export async function getEmployeeProfileClient(userId: string, orgId: string): Promise<EmployeeProfile | null> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('employee_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('organization_id', orgId)
    .single()
  
  if (error || !data) return null
  return data as EmployeeProfile
}

/**
 * Create owner profile for existing org admin (auto-provision)
 * The user who creates the org (user.id === org.id) should ALWAYS get owner role.
 */
export async function ensureOwnerProfile(userId: string, orgId: string, userEmail: string): Promise<EmployeeProfile | null> {
  const supabase = await createServerClient()

  // Check if profile already exists
  const existing = await getEmployeeProfile(userId, orgId)
  if (existing) {
    // If the org creator has a non-owner role, upgrade to owner
    if (userId === orgId && existing.role !== 'owner') {
      const { data: updated, error: updateError } = await supabase
        .from('employee_profiles')
        .update({ role: 'owner' })
        .eq('user_id', userId)
        .eq('organization_id', orgId)
        .select()
        .single()

      if (updateError) {
        console.error('Error upgrading to owner:', updateError)
        return existing
      }
      return updated as EmployeeProfile
    }
    return existing
  }

  // Create owner profile
  const { data, error } = await supabase
    .from('employee_profiles')
    .insert({
      user_id: userId,
      organization_id: orgId,
      email: userEmail,
      role: 'owner',
      joined_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating owner profile:', error)
    return null
  }

  return data as EmployeeProfile
}

/**
 * Check if role is admin (owner or admin)
 */
export function isAdmin(role: UserRole | null): boolean {
  return role === 'owner' || role === 'admin'
}

/**
 * Check if role is manager or higher
 */
export function isManager(role: UserRole | null): boolean {
  return role === 'owner' || role === 'admin' || role === 'manager'
}

/**
 * Check if role can manage employees
 */
export function canManageEmployees(role: UserRole | null): boolean {
  return role === 'owner' || role === 'admin'
}

/**
 * Check if role can view all org data
 */
export function canViewOrgData(role: UserRole | null): boolean {
  return isManager(role)
}
