"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface TrainingModule {
  id: string
  title: string
  description: string
  audience: string[]
  icon: string
  duration_minutes: number
  lesson_count: number
  content: any[]
  sort_order: number
  created_at: string
}

export interface TrainingEnrollment {
  id: string
  user_id: string
  org_id: string
  module_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'expired'
  progress: number
  started_at: string | null
  completed_at: string | null
  expires_at: string | null
  assigned_by: string | null
  created_at: string
  module?: TrainingModule
  user?: {
    id: string
    full_name?: string
    email?: string
  }
}

// Fetch all training modules
export async function getTrainingModules() {
  const supabase = await createClient()
  
  const { data: modules, error } = await supabase
    .from('training_modules')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching training modules:', error)
    return { modules: [], error: error.message }
  }
  
  return { modules: modules || [], error: null }
}

// Get all enrollments for an organization (admin view)
export async function getOrgEnrollments(orgId: string) {
  const supabase = await createClient()
  
  const { data: enrollments, error } = await supabase
    .from('training_enrollments')
    .select(`
      *,
      module:training_modules(id, title, description, icon, duration_minutes, lesson_count, audience),
      user:profiles!training_enrollments_user_id_fkey(id, full_name, email)
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching org enrollments:', error)
    return { enrollments: [], error: error.message }
  }
  
  return { enrollments: enrollments || [], error: null }
}

// Get enrollments for current user (personal view)
export async function getMyEnrollments(userId: string) {
  const supabase = await createClient()
  
  const { data: enrollments, error } = await supabase
    .from('training_enrollments')
    .select(`
      *,
      module:training_modules(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching my enrollments:', error)
    return { enrollments: [], error: error.message }
  }
  
  return { enrollments: enrollments || [], error: null }
}

// Assign a module to a user
export async function assignModule(
  userId: string,
  moduleId: string,
  orgId: string,
  assignedBy: string
) {
  const supabase = await createClient()
  
  // Check if enrollment already exists
  const { data: existing } = await supabase
    .from('training_enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single()
  
  if (existing) {
    return { error: 'User already enrolled in this module' }
  }
  
  const { data, error } = await supabase
    .from('training_enrollments')
    .insert({
      user_id: userId,
      org_id: orgId,
      module_id: moduleId,
      status: 'not_started',
      progress: 0,
      assigned_by: assignedBy
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error assigning module:', error)
    return { error: error.message }
  }
  
  revalidatePath('/training')
  revalidatePath('/portal/training')
  
  return { enrollment: data, error: null }
}

// Bulk assign modules to multiple users
export async function bulkAssignModules(
  assignments: { userId: string; moduleId: string }[],
  orgId: string,
  assignedBy: string
) {
  const supabase = await createClient()
  
  const enrollments = assignments.map(a => ({
    user_id: a.userId,
    org_id: orgId,
    module_id: a.moduleId,
    status: 'not_started' as const,
    progress: 0,
    assigned_by: assignedBy
  }))
  
  const { data, error } = await supabase
    .from('training_enrollments')
    .upsert(enrollments, { onConflict: 'user_id,module_id' })
  
  if (error) {
    console.error('Error bulk assigning modules:', error)
    return { error: error.message }
  }
  
  revalidatePath('/training')
  revalidatePath('/portal/training')
  
  return { error: null }
}

// Update progress on an enrollment
export async function updateProgress(enrollmentId: string, progress: number) {
  const supabase = await createClient()
  
  const updateData: any = {
    progress,
    status: progress > 0 ? 'in_progress' : 'not_started'
  }
  
  // Set started_at if not already set
  const { data: enrollment } = await supabase
    .from('training_enrollments')
    .select('started_at')
    .eq('id', enrollmentId)
    .single()
  
  if (enrollment && !enrollment.started_at) {
    updateData.started_at = new Date().toISOString()
  }
  
  const { error } = await supabase
    .from('training_enrollments')
    .update(updateData)
    .eq('id', enrollmentId)
  
  if (error) {
    console.error('Error updating progress:', error)
    return { error: error.message }
  }
  
  revalidatePath('/portal/training')
  
  return { error: null }
}

// Complete a module (marks as completed with 1-year expiration)
export async function completeModule(enrollmentId: string) {
  const supabase = await createClient()
  
  const completedAt = new Date()
  const expiresAt = new Date(completedAt)
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  
  const { error } = await supabase
    .from('training_enrollments')
    .update({
      status: 'completed',
      completed_at: completedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      progress: 100
    })
    .eq('id', enrollmentId)
  
  if (error) {
    console.error('Error completing module:', error)
    return { error: error.message }
  }
  
  revalidatePath('/training')
  revalidatePath('/portal/training')
  
  return { error: null }
}

// Create training invitation
export async function inviteToTraining(
  email: string,
  moduleId: string,
  orgId: string,
  invitedBy: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('training_invitations')
    .insert({
      org_id: orgId,
      invited_by: invitedBy,
      invited_email: email,
      module_id: moduleId
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating invitation:', error)
    return { error: error.message }
  }
  
  // TODO: Send invitation email
  
  return { invitation: data, error: null }
}

// Get team members for an organization (for assignment modal)
export async function getOrgTeamMembers(orgId: string) {
  const supabase = await createClient()
  
  const { data: members, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('organization_id', orgId)
    .order('full_name', { ascending: true })
  
  if (error) {
    console.error('Error fetching team members:', error)
    return { members: [], error: error.message }
  }
  
  return { members: members || [], error: null }
}

// Get module recommendations based on user role
export async function getRecommendedModules(userRole: string, allModules: TrainingModule[]): Promise<string[]> {
  const roleToAudience: { [key: string]: string[] } = {
    'owner': ['c_suite', 'all_employees'],
    'admin': ['hr_directors', 'compliance_officers', 'all_employees'],
    'manager': ['hiring_managers', 'all_employees'],
    'recruiter': ['recruiters', 'talent_acquisition', 'all_employees'],
    'employee': ['all_employees']
  }
  
  const relevantAudiences = roleToAudience[userRole] || ['all_employees']
  
  return allModules
    .filter(module => 
      module.audience.some(aud => relevantAudiences.includes(aud))
    )
    .map(m => m.id)
}

// Get enrollment statistics for org dashboard
export async function getEnrollmentStats(orgId: string) {
  const supabase = await createClient()
  
  // Get all enrollments
  const { data: enrollments } = await supabase
    .from('training_enrollments')
    .select('status, expires_at')
    .eq('org_id', orgId)
  
  // Get org team size
  const { data: team } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', orgId)
  
  const totalEnrolled = enrollments?.length || 0
  const completedCount = enrollments?.filter(e => e.status === 'completed').length || 0
  const overdueCount = enrollments?.filter(e => 
    e.status !== 'completed' && !e.expires_at
  ).length || 0
  
  // Upcoming expirations (next 30 days)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  const expiringCount = enrollments?.filter(e => {
    if (!e.expires_at) return false
    const expiresAt = new Date(e.expires_at)
    return expiresAt <= thirtyDaysFromNow && expiresAt > new Date()
  }).length || 0
  
  const completionRate = totalEnrolled > 0 
    ? Math.round((completedCount / totalEnrolled) * 100) 
    : 0
  
  return {
    totalEnrolled,
    completedCount,
    overdueCount,
    expiringCount,
    completionRate,
    teamSize: team?.length || 0
  }
}

// Acknowledgment System

/**
 * Record a legal acknowledgment for a training enrollment
 */
export async function recordAcknowledgment(
  enrollmentId: string,
  userId: string,
  acknowledgmentText: string,
  ipAddress?: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('training_acknowledgments')
    .insert({
      enrollment_id: enrollmentId,
      user_id: userId,
      acknowledgment_text: acknowledgmentText,
      ip_address: ipAddress || null,
      acknowledged_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error recording acknowledgment:', error)
    return { acknowledgment: null, error: error.message }
  }
  
  revalidatePath('/portal/training')
  revalidatePath('/training')
  
  return { acknowledgment: data, error: null }
}

/**
 * Get acknowledgment record for an enrollment
 */
export async function getAcknowledgmentForEnrollment(enrollmentId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('training_acknowledgments')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching acknowledgment:', error)
    return { acknowledgment: null, error: error.message }
  }
  
  return { acknowledgment: data, error: null }
}

/**
 * Export compliance report for audit purposes (Faragher/Ellerth defense)
 */
export async function exportComplianceReport(orgId: string) {
  const supabase = await createClient()
  
  // Get organization name
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', orgId)
    .single()
  
  // Get all enrollments with module and user details
  const { data: enrollments } = await supabase
    .from('training_enrollments')
    .select(`
      *,
      module:training_modules(id, title, requires_acknowledgment, certification_valid_days),
      user:profiles!training_enrollments_user_id_fkey(id, full_name, email)
    `)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
  
  if (!enrollments) {
    return { report: null, error: 'Failed to fetch enrollment data' }
  }
  
  // Get all acknowledgments for these enrollments
  const enrollmentIds = enrollments.map(e => e.id)
  const { data: acknowledgments } = await supabase
    .from('training_acknowledgments')
    .select('*')
    .in('enrollment_id', enrollmentIds)
  
  const acknowledgmentMap = new Map(
    acknowledgments?.map(ack => [ack.enrollment_id, ack]) || []
  )
  
  // Build report
  const reportDate = new Date().toISOString()
  const reportData = {
    header: {
      title: 'Training Compliance Report',
      subtitle: 'Prepared for audit purposes per Faragher/Ellerth defense requirements',
      organization: org?.name || 'Unknown Organization',
      generatedAt: reportDate,
      generatedBy: 'EmployArmor Training Management System'
    },
    summary: {
      totalEnrollments: enrollments.length,
      completedEnrollments: enrollments.filter(e => e.status === 'completed').length,
      pendingEnrollments: enrollments.filter(e => e.status === 'in_progress' || e.status === 'not_started').length,
      expiredEnrollments: enrollments.filter(e => e.status === 'expired' || (e.expires_at && new Date(e.expires_at) < new Date())).length,
      acknowledgedEnrollments: enrollments.filter(e => acknowledgmentMap.has(e.id)).length
    },
    enrollments: enrollments.map(enrollment => {
      const acknowledgment = acknowledgmentMap.get(enrollment.id)
      const module = enrollment.module as any
      const user = enrollment.user as any
      
      return {
        employee: {
          name: user?.full_name || 'Unknown',
          email: user?.email || 'Unknown'
        },
        module: {
          title: module?.title || 'Unknown Module',
          requiresAcknowledgment: module?.requires_acknowledgment || false,
          certificationValidDays: module?.certification_valid_days || 365
        },
        enrollment: {
          status: enrollment.status,
          progress: enrollment.progress,
          startedAt: enrollment.started_at,
          completedAt: enrollment.completed_at,
          expiresAt: enrollment.expires_at,
          assignedAt: enrollment.created_at
        },
        acknowledgment: acknowledgment ? {
          acknowledgedAt: acknowledgment.acknowledged_at,
          ipAddress: acknowledgment.ip_address,
          text: acknowledgment.acknowledgment_text
        } : null,
        complianceStatus: getComplianceStatus(enrollment, acknowledgment, module)
      }
    })
  }
  
  // Generate text report
  const textReport = generateTextReport(reportData)
  
  return { 
    report: reportData, 
    textReport,
    error: null 
  }
}

/**
 * Helper: determine compliance status for an enrollment
 */
function getComplianceStatus(enrollment: any, acknowledgment: any, module: any): string {
  if (enrollment.status !== 'completed') {
    return 'PENDING'
  }
  
  if (module?.requires_acknowledgment && !acknowledgment) {
    return 'INCOMPLETE - Missing Acknowledgment'
  }
  
  if (enrollment.expires_at && new Date(enrollment.expires_at) < new Date()) {
    return 'EXPIRED - Recertification Required'
  }
  
  return 'COMPLIANT'
}

/**
 * Helper: generate text version of compliance report
 */
function generateTextReport(data: any): string {
  let report = ''
  
  report += '═'.repeat(80) + '\n'
  report += data.header.title.toUpperCase() + '\n'
  report += data.header.subtitle + '\n'
  report += '═'.repeat(80) + '\n\n'
  
  report += `Organization: ${data.header.organization}\n`
  report += `Generated: ${new Date(data.header.generatedAt).toLocaleString()}\n`
  report += `System: ${data.header.generatedBy}\n\n`
  
  report += '─'.repeat(80) + '\n'
  report += 'SUMMARY\n'
  report += '─'.repeat(80) + '\n\n'
  
  report += `Total Enrollments: ${data.summary.totalEnrollments}\n`
  report += `Completed: ${data.summary.completedEnrollments}\n`
  report += `Pending: ${data.summary.pendingEnrollments}\n`
  report += `Expired: ${data.summary.expiredEnrollments}\n`
  report += `Acknowledged: ${data.summary.acknowledgedEnrollments}\n\n`
  
  report += '─'.repeat(80) + '\n'
  report += 'DETAILED RECORDS\n'
  report += '─'.repeat(80) + '\n\n'
  
  for (const enrollment of data.enrollments) {
    report += `Employee: ${enrollment.employee.name} (${enrollment.employee.email})\n`
    report += `Module: ${enrollment.module.title}\n`
    report += `Status: ${enrollment.enrollment.status.toUpperCase()} - ${enrollment.complianceStatus}\n`
    report += `Assigned: ${enrollment.enrollment.assignedAt ? new Date(enrollment.enrollment.assignedAt).toLocaleDateString() : 'N/A'}\n`
    
    if (enrollment.enrollment.completedAt) {
      report += `Completed: ${new Date(enrollment.enrollment.completedAt).toLocaleDateString()}\n`
    }
    
    if (enrollment.enrollment.expiresAt) {
      report += `Expires: ${new Date(enrollment.enrollment.expiresAt).toLocaleDateString()}\n`
    }
    
    if (enrollment.acknowledgment) {
      report += `Acknowledged: ${new Date(enrollment.acknowledgment.acknowledgedAt).toLocaleString()}\n`
      report += `IP Address: ${enrollment.acknowledgment.ipAddress || 'Not recorded'}\n`
      report += `Agreement Text: "${enrollment.acknowledgment.text}"\n`
    } else if (enrollment.module.requiresAcknowledgment) {
      report += `⚠️  ACKNOWLEDGMENT REQUIRED BUT NOT RECORDED\n`
    }
    
    report += '\n' + '·'.repeat(80) + '\n\n'
  }
  
  report += '═'.repeat(80) + '\n'
  report += 'END OF REPORT\n'
  report += '═'.repeat(80) + '\n'
  
  return report
}
