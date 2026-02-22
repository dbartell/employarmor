"use server"

import { createClient } from '@/lib/supabase/server'

export interface SidebarComplianceData {
  score: number // 0-100
  sections: Record<string, SectionStatus>
}

export interface SectionStatus {
  hasAction: boolean // true = needs attention (shows notification dot)
  label?: string // e.g. "3 unsigned"
}

export async function getSidebarCompliance(): Promise<SidebarComplianceData | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const orgId = user.id

  // Parallel queries for speed
  const [
    { count: docsCount },
    { count: consentCount },
    { data: trainingCompletions },
    { data: employees },
    { count: toolsCount },
    { data: handbookPolicies },
    { data: latestAudit },
  ] = await Promise.all([
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('consent_records').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('training_completions').select('id').eq('user_id', user.id),
    supabase.from('employee_disclosures').select('id, status').eq('organization_id', orgId),
    supabase.from('hiring_tools').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('handbook_policies').select('id, status').eq('organization_id', orgId).limit(1),
    supabase.from('audits').select('id').eq('org_id', orgId).order('created_at', { ascending: false }).limit(1),
  ])

  // Calculate score (0-100)
  let score = 0
  const maxPoints = 100

  // Has audit (20 pts)
  const hasAudit = !!latestAudit?.length
  if (hasAudit) score += 20

  // Candidate notices generated (20 pts)
  const docs = docsCount || 0
  if (docs > 0) score += 20

  // Employee disclosures sent (20 pts)
  const totalEmployees = employees?.length || 0
  const signedEmployees = employees?.filter(e => e.status === 'signed').length || 0
  if (totalEmployees > 0 && signedEmployees === totalEmployees) {
    score += 20
  } else if (totalEmployees > 0) {
    score += Math.round((signedEmployees / totalEmployees) * 15) // Partial credit up to 15
  }

  // Handbook policy (15 pts)
  const hasHandbook = handbookPolicies && handbookPolicies.length > 0
  if (hasHandbook) score += 15

  // Training (15 pts)
  const completedCourses = trainingCompletions?.length || 0
  const totalCourses = 5
  score += Math.round((Math.min(completedCourses, totalCourses) / totalCourses) * 15)

  // Tools registered (10 pts)
  if ((toolsCount || 0) > 0) score += 10

  score = Math.min(score, maxPoints)

  // Section statuses (notification indicators)
  const unsignedCount = totalEmployees - signedEmployees
  const sections: Record<string, SectionStatus> = {
    '/candidate-notices': {
      hasAction: docs === 0,
      label: docs === 0 ? 'Not set up' : undefined,
    },
    '/employee-disclosures': {
      hasAction: totalEmployees === 0 || unsignedCount > 0,
      label: totalEmployees === 0 ? 'No employees' : unsignedCount > 0 ? `${unsignedCount} unsigned` : undefined,
    },
    '/handbook': {
      hasAction: !hasHandbook,
      label: !hasHandbook ? 'Not created' : undefined,
    },
    '/training': {
      hasAction: completedCourses < totalCourses,
      label: completedCourses < totalCourses ? `${completedCourses}/${totalCourses}` : undefined,
    },
    '/tools': {
      hasAction: (toolsCount || 0) === 0,
      label: (toolsCount || 0) === 0 ? 'No tools' : undefined,
    },
    '/audit': {
      hasAction: !hasAudit,
      label: !hasAudit ? 'No audit' : undefined,
    },
  }

  return { score, sections }
}
