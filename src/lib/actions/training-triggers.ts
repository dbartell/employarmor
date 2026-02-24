"use server"

import { createClient } from '@/lib/supabase/server'

interface OrgProfile {
  states: string[]
  tools: string[]
  industry: string | null
  employeeCount: number
}

interface TriggeredModule {
  id: string
  title: string
  description: string
  trigger_type: string
  trigger_value: string | null
  tier: number
  reason: string
}

/**
 * Get organization profile (states, tools, industry, size)
 * This would integrate with your existing audit/scan data
 */
async function getOrgProfile(orgId: string): Promise<OrgProfile> {
  const supabase = await createClient()
  
  // Get organization details
  const { data: org } = await supabase
    .from('organizations')
    .select('industry, name')
    .eq('id', orgId)
    .single()
  
  // Get states from audit data (you'll need to adjust based on your schema)
  // For now, we'll check scans for state information
  const { data: scans } = await supabase
    .from('scans')
    .select('url, metadata')
    .eq('organization_id', orgId)
  
  // Extract unique states from scan data
  const states = new Set<string>()
  
  // Get team size
  const { count: employeeCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('organization_id', orgId)
  
  // Get registered tools (you may have a tools table or metadata field)
  // For now, we'll return empty and you can integrate with your tool registry
  const tools: string[] = []
  
  // Try to infer industry from org data or default to null
  const industry = org?.industry || null
  
  return {
    states: Array.from(states),
    tools,
    industry,
    employeeCount: employeeCount || 0
  }
}

/**
 * Get modules that match the organization's profile
 */
export async function getTriggeredModules(orgId: string): Promise<TriggeredModule[]> {
  const supabase = await createClient()
  const profile = await getOrgProfile(orgId)
  
  const { data: allModules } = await supabase
    .from('training_modules')
    .select('id, title, description, trigger_type, trigger_value, tier')
  
  if (!allModules) return []
  
  const triggered: TriggeredModule[] = []
  
  for (const module of allModules) {
    let reason = ''
    let isTriggered = false
    
    switch (module.trigger_type) {
      case 'core':
        // Core modules are always recommended
        isTriggered = true
        reason = 'Required for all teams'
        break
        
      case 'state':
        // Check if org operates in this state
        if (module.trigger_value && profile.states.includes(module.trigger_value)) {
          isTriggered = true
          reason = `Your team hires in ${getStateName(module.trigger_value)}`
        }
        break
        
      case 'tool':
        // Check if org uses this tool
        if (module.trigger_value && profile.tools.includes(module.trigger_value)) {
          isTriggered = true
          reason = `You use ${getToolName(module.trigger_value)}`
        }
        break
        
      case 'industry':
        // Check if org is in this industry
        if (module.trigger_value && profile.industry === module.trigger_value) {
          isTriggered = true
          reason = `Your industry: ${getIndustryName(module.trigger_value)}`
        }
        break
        
      case 'size':
        // Check if org meets size threshold
        if (module.trigger_value) {
          const threshold = parseInt(module.trigger_value)
          if (profile.employeeCount >= threshold) {
            isTriggered = true
            reason = `Your team size: ${profile.employeeCount}+ employees`
          }
        }
        break
    }
    
    if (isTriggered) {
      triggered.push({
        id: module.id,
        title: module.title,
        description: module.description,
        trigger_type: module.trigger_type,
        trigger_value: module.trigger_value,
        tier: module.tier,
        reason
      })
    }
  }
  
  // Sort by tier
  triggered.sort((a, b) => a.tier - b.tier)
  
  return triggered
}

/**
 * Get modules that are recommended but not yet assigned
 */
export async function getRecommendedModules(orgId: string) {
  const supabase = await createClient()
  
  // Get all triggered modules
  const triggered = await getTriggeredModules(orgId)
  
  // Get existing enrollments
  const { data: enrollments } = await supabase
    .from('training_enrollments')
    .select('module_id')
    .eq('org_id', orgId)
  
  const enrolledModuleIds = new Set(enrollments?.map(e => e.module_id) || [])
  
  // Filter to only modules not yet assigned
  const recommended = triggered.filter(module => !enrolledModuleIds.has(module.id))
  
  return { recommended, error: null }
}

/**
 * Main function: check org profile and optionally auto-create enrollments
 */
export async function checkAndTriggerModules(
  orgId: string,
  autoAssign: boolean = false
) {
  const supabase = await createClient()
  
  // Get recommended modules
  const { recommended } = await getRecommendedModules(orgId)
  
  if (!recommended || recommended.length === 0) {
    return { recommended: [], assigned: 0, error: null }
  }
  
  let assigned = 0
  
  if (autoAssign) {
    // Get all team members
    const { data: teamMembers } = await supabase
      .from('profiles')
      .select('id, user_id, role')
      .eq('organization_id', orgId)
    
    if (teamMembers && teamMembers.length > 0) {
      // Get module details including audience
      const { data: modules } = await supabase
        .from('training_modules')
        .select('id, audience')
        .in('id', recommended.map(r => r.id))
      
      const enrollmentsToCreate = []
      
      for (const module of modules || []) {
        // Determine which team members should get this module based on audience
        const relevantMembers = teamMembers.filter(member => 
          shouldAssignToRole(member.role, module.audience)
        )
        
        for (const member of relevantMembers) {
          enrollmentsToCreate.push({
            user_id: member.user_id,
            org_id: orgId,
            module_id: module.id,
            status: 'not_started' as const,
            progress: 0
          })
        }
      }
      
      if (enrollmentsToCreate.length > 0) {
        const { error } = await supabase
          .from('training_enrollments')
          .upsert(enrollmentsToCreate, { onConflict: 'user_id,module_id' })
        
        if (!error) {
          assigned = enrollmentsToCreate.length
        }
      }
    }
  }
  
  return { recommended, assigned, error: null }
}

/**
 * Called when a state is added to org's hiring scope
 */
export async function onStateAdded(orgId: string, stateCode: string) {
  const supabase = await createClient()
  
  // Find modules triggered by this state
  const { data: stateModules } = await supabase
    .from('training_modules')
    .select('id, title, audience')
    .eq('trigger_type', 'state')
    .eq('trigger_value', stateCode)
  
  if (!stateModules || stateModules.length === 0) {
    return { modulesTriggered: [], error: null }
  }
  
  // Get team members to assign to
  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('id, user_id, role')
    .eq('organization_id', orgId)
  
  const enrollmentsToCreate = []
  
  for (const module of stateModules) {
    const relevantMembers = teamMembers?.filter(member => 
      shouldAssignToRole(member.role, module.audience)
    ) || []
    
    for (const member of relevantMembers) {
      enrollmentsToCreate.push({
        user_id: member.user_id,
        org_id: orgId,
        module_id: module.id,
        status: 'not_started' as const,
        progress: 0
      })
    }
  }
  
  if (enrollmentsToCreate.length > 0) {
    await supabase
      .from('training_enrollments')
      .upsert(enrollmentsToCreate, { onConflict: 'user_id,module_id' })
  }
  
  return { 
    modulesTriggered: stateModules.map(m => ({ id: m.id, title: m.title })),
    error: null 
  }
}

/**
 * Called when a tool is added to org's stack
 */
export async function onToolAdded(orgId: string, toolSlug: string) {
  const supabase = await createClient()
  
  // Find modules triggered by this tool
  const { data: toolModules } = await supabase
    .from('training_modules')
    .select('id, title, audience')
    .eq('trigger_type', 'tool')
    .eq('trigger_value', toolSlug)
  
  if (!toolModules || toolModules.length === 0) {
    return { modulesTriggered: [], error: null }
  }
  
  // Get team members to assign to
  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('id, user_id, role')
    .eq('organization_id', orgId)
  
  const enrollmentsToCreate = []
  
  for (const module of toolModules) {
    const relevantMembers = teamMembers?.filter(member => 
      shouldAssignToRole(member.role, module.audience)
    ) || []
    
    for (const member of relevantMembers) {
      enrollmentsToCreate.push({
        user_id: member.user_id,
        org_id: orgId,
        module_id: module.id,
        status: 'not_started' as const,
        progress: 0
      })
    }
  }
  
  if (enrollmentsToCreate.length > 0) {
    await supabase
      .from('training_enrollments')
      .upsert(enrollmentsToCreate, { onConflict: 'user_id,module_id' })
  }
  
  return { 
    modulesTriggered: toolModules.map(m => ({ id: m.id, title: m.title })),
    error: null 
  }
}

/**
 * Helper: determine if a module audience matches a user role
 */
function shouldAssignToRole(userRole: string, moduleAudience: string[]): boolean {
  // Map user roles to module audiences
  const roleToAudience: { [key: string]: string[] } = {
    'owner': ['c_suite', 'all_employees'],
    'admin': ['hr_directors', 'compliance_officers', 'all_employees'],
    'manager': ['hiring_managers', 'managers', 'all_employees'],
    'recruiter': ['recruiters', 'talent_acquisition', 'all_employees'],
    'employee': ['all_employees']
  }
  
  const userAudiences = roleToAudience[userRole] || ['all_employees']
  
  return moduleAudience.some(aud => userAudiences.includes(aud))
}

/**
 * Helper: get friendly state name
 */
function getStateName(code: string): string {
  const stateNames: { [key: string]: string } = {
    'IL': 'Illinois',
    'NY': 'New York',
    'CO': 'Colorado',
    'CA': 'California',
    'MD': 'Maryland',
    'TX': 'Texas'
  }
  return stateNames[code] || code
}

/**
 * Helper: get friendly tool name
 */
function getToolName(slug: string): string {
  const toolNames: { [key: string]: string } = {
    'hirevue': 'HireVue',
    'greenhouse': 'Greenhouse',
    'linkedin-recruiter': 'LinkedIn Recruiter',
    'workday': 'Workday',
    '_generic': 'your ATS'
  }
  return toolNames[slug] || slug
}

/**
 * Helper: get friendly industry name
 */
function getIndustryName(slug: string): string {
  const industryNames: { [key: string]: string } = {
    'healthcare': 'Healthcare',
    'finance': 'Financial Services',
    'staffing': 'Staffing/Recruiting'
  }
  return industryNames[slug] || slug
}
