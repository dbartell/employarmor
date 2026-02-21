// State-specific compliance requirements
// Maps each regulated state to exactly what's needed

export type TaskPhase = 'today' | 'this_week' | 'setup_once'

export interface ComplianceRequirement {
  id: string
  title: string
  description: string
  type: 'document' | 'action' | 'ongoing'
  docType?: string // links to document type if applicable
  href: string
  estimatedTime?: string // Human-readable time estimate
  estimatedMinutes?: number // Machine-readable for calculations
  phase?: TaskPhase // Grouping for dashboard display
  priority?: number // Lower = higher priority within phase
}

export interface StateCompliance {
  code: string
  name: string
  law: string
  effectiveDate: string
  isActive: boolean
  requirements: ComplianceRequirement[]
}

export const stateCompliance: StateCompliance[] = [
  {
    code: 'IL',
    name: 'Illinois',
    law: 'HB 3773',
    effectiveDate: '2026-01-01',
    isActive: true,
    requirements: [
      {
        id: 'il-disclosure',
        title: 'Candidate Disclosure Notice',
        description: 'Notify candidates that AI is used in hiring decisions',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
      {
        id: 'il-employee-notice',
        title: 'Employee Notification',
        description: 'Notify employees when AI affects employment decisions',
        type: 'document',
        docType: 'disclosure-employee',
        href: '/documents?generate=disclosure-employee',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'this_week',
        priority: 3,
      },
    ],
  },
  {
    code: 'CO',
    name: 'Colorado',
    law: 'AI Act (SB24-205)',
    effectiveDate: '2026-02-01',
    isActive: false, // becomes active Feb 1
    requirements: [
      {
        id: 'co-impact',
        title: 'Impact Assessment',
        description: 'Annual assessment of AI system risks and safeguards',
        type: 'document',
        docType: 'impact-assessment',
        href: '/documents/impact-assessment',
        estimatedTime: '~20 min',
        estimatedMinutes: 20,
        phase: 'today',
        priority: 1,
      },
      {
        id: 'co-disclosure',
        title: 'Candidate Disclosure Notice',
        description: 'Pre-decision notification to candidates',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
      {
        id: 'co-consent',
        title: 'Consent Collection',
        description: 'Collect and track candidate consent',
        type: 'ongoing',
        href: '/consent',
        estimatedTime: '~10 min setup',
        estimatedMinutes: 10,
        phase: 'setup_once',
        priority: 1,
      },
    ],
  },
  {
    code: 'NYC',
    name: 'New York City',
    law: 'Local Law 144',
    effectiveDate: '2023-07-05',
    isActive: true,
    requirements: [
      {
        id: 'nyc-audit',
        title: 'Annual Bias Audit',
        description: 'Independent auditor must analyze tool for bias',
        type: 'action',
        href: '/audit',
        estimatedTime: 'varies',
        phase: 'setup_once',
        priority: 2,
      },
      {
        id: 'nyc-disclosure',
        title: 'Bias Audit Disclosure',
        description: 'Publish audit results on your website',
        type: 'document',
        docType: 'bias-audit-disclosure',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'this_week',
        priority: 2,
      },
      {
        id: 'nyc-notice',
        title: 'Candidate Notice (10 days)',
        description: 'Notify candidates 10 business days before AI use',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
    ],
  },
  {
    code: 'CA',
    name: 'California',
    law: 'CCPA ADMT Rules',
    effectiveDate: '2026-01-01',
    isActive: true,
    requirements: [
      {
        id: 'ca-disclosure',
        title: 'Pre-Use Notice',
        description: 'Explain ADMT purpose and opt-out rights',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
      {
        id: 'ca-consent',
        title: 'Opt-Out Mechanism',
        description: 'Allow candidates to opt out of AI processing',
        type: 'ongoing',
        href: '/consent',
        estimatedTime: '~10 min setup',
        estimatedMinutes: 10,
        phase: 'setup_once',
        priority: 1,
      },
    ],
  },
  {
    code: 'MD',
    name: 'Maryland',
    law: 'HB 1202',
    effectiveDate: '2020-10-01',
    isActive: true,
    requirements: [
      {
        id: 'md-consent',
        title: 'Facial Recognition Consent',
        description: 'Get consent before using facial recognition in interviews',
        type: 'document',
        docType: 'consent-form',
        href: '/documents?generate=consent-form',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
    ],
  },
]

// General requirements for all users
export const generalRequirements: ComplianceRequirement[] = [
  {
    id: 'training',
    title: 'Train Your Team',
    description: 'Certify recruiters and hiring managers on AI compliance',
    type: 'action',
    href: '/training',
    estimatedTime: '~15 min each',
    estimatedMinutes: 15,
    phase: 'this_week',
    priority: 1,
  },
  {
    id: 'disclosure-page',
    title: 'Public Disclosure Page',
    description: 'Publish your AI use disclosure on your careers site',
    type: 'action',
    href: '/disclosures',
    estimatedTime: '~5 min',
    estimatedMinutes: 5,
    phase: 'this_week',
    priority: 2,
  },
  {
    id: 'handbook',
    title: 'Employee Handbook Policy',
    description: 'Add AI use policy to your employee handbook',
    type: 'document',
    docType: 'handbook-policy',
    href: '/documents?generate=handbook-policy',
    estimatedTime: '~5 min',
    estimatedMinutes: 5,
    phase: 'setup_once',
    priority: 3,
  },
]

export interface ComplianceAction {
  id: string
  category: string // LawCategory
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  estimatedMinutes: number
  triggerUsages: string[] // which usages trigger this action
  triggerStates?: string[] // specific states, or empty = all
}

export const complianceActions: ComplianceAction[] = [
  // Biometric Privacy
  {
    id: 'bio-consent-form',
    category: 'biometric',
    title: 'Create Biometric Data Consent Form',
    description: 'Written consent form for candidates before collecting facial geometry, voice patterns, or other biometric identifiers',
    priority: 'critical',
    estimatedMinutes: 15,
    triggerUsages: ['facial-analysis', 'voice-analysis', 'video-recording'],
    triggerStates: ['IL', 'TX', 'WA'],
  },
  {
    id: 'bio-retention-policy',
    category: 'biometric',
    title: 'Establish Biometric Data Retention Policy',
    description: 'Written policy specifying how long biometric data is stored and when it will be destroyed',
    priority: 'high',
    estimatedMinutes: 30,
    triggerUsages: ['facial-analysis', 'voice-analysis', 'video-recording'],
    triggerStates: ['IL', 'TX', 'WA'],
  },
  // Wiretapping
  {
    id: 'wire-consent-mechanism',
    category: 'wiretapping',
    title: 'Implement Recording Consent Mechanism',
    description: 'Add explicit consent capture before recording any video/audio interview. Must be affirmative opt-in, not passive notice.',
    priority: 'critical',
    estimatedMinutes: 20,
    triggerUsages: ['video-recording'],
    triggerStates: ['CA', 'FL', 'IL', 'PA', 'MA', 'MD', 'WA', 'CT', 'NH', 'NV', 'DE', 'MI', 'MT'],
  },
  // Lie Detector
  {
    id: 'poly-tool-audit',
    category: 'lie-detector',
    title: 'Audit AI Tools for Integrity/Deception Scoring',
    description: 'Review all AI tools for features that assess honesty, integrity, or deception — these may violate EPPA and state polygraph laws',
    priority: 'critical',
    estimatedMinutes: 45,
    triggerUsages: ['integrity-scoring', 'facial-analysis'],
  },
  // FCRA
  {
    id: 'fcra-disclosure',
    category: 'fcra',
    title: 'Create FCRA Standalone Disclosure',
    description: 'Standalone written notice informing candidates that a consumer report will be obtained via AI screening',
    priority: 'high',
    estimatedMinutes: 15,
    triggerUsages: ['third-party-reports', 'background-check'],
  },
  {
    id: 'fcra-authorization',
    category: 'fcra',
    title: 'Create FCRA Authorization Form',
    description: 'Written authorization form for candidates to sign before AI screening reports are procured',
    priority: 'high',
    estimatedMinutes: 10,
    triggerUsages: ['third-party-reports', 'background-check'],
  },
  {
    id: 'fcra-adverse-action',
    category: 'fcra',
    title: 'Set Up FCRA Adverse Action Procedure',
    description: 'Pre-adverse action notice template + post-adverse action notice with rights summary',
    priority: 'high',
    estimatedMinutes: 30,
    triggerUsages: ['third-party-reports', 'background-check'],
  },
  // Pay Transparency
  {
    id: 'pay-posting-audit',
    category: 'pay-transparency',
    title: 'Audit Job Postings for Salary Ranges',
    description: 'Ensure all job postings include required salary ranges and AI tools do not filter by salary history',
    priority: 'high',
    estimatedMinutes: 30,
    triggerUsages: ['salary-filtering', 'compensation'],
    triggerStates: ['CO', 'CA', 'NY', 'WA', 'MA', 'IL', 'CT'],
  },
  {
    id: 'pay-history-ban',
    category: 'pay-transparency',
    title: 'Disable Salary History Filtering',
    description: 'Configure AI tools to not use salary history data for candidate screening or ranking',
    priority: 'critical',
    estimatedMinutes: 15,
    triggerUsages: ['salary-filtering'],
    triggerStates: ['CO', 'CA', 'NY', 'WA', 'MA', 'IL', 'CT'],
  },
  // Data Privacy
  {
    id: 'privacy-notice',
    category: 'data-privacy',
    title: 'Create Applicant Data Privacy Notice',
    description: 'Inform applicants what data AI tools collect, how it is processed, and their opt-out/deletion rights',
    priority: 'high',
    estimatedMinutes: 20,
    triggerUsages: ['screening', 'ranking', 'third-party-reports'],
    triggerStates: ['CA', 'VA', 'CO', 'CT'],
  },
  {
    id: 'privacy-opt-out',
    category: 'data-privacy',
    title: 'Implement Applicant Opt-Out Mechanism',
    description: 'Allow applicants to opt out of AI profiling and automated decision-making',
    priority: 'high',
    estimatedMinutes: 30,
    triggerUsages: ['screening', 'ranking', 'assessment-scoring'],
    triggerStates: ['CA', 'VA', 'CO', 'CT'],
  },
  // ADA
  {
    id: 'ada-alternatives',
    category: 'disability',
    title: 'Establish AI Assessment Accommodation Process',
    description: 'Create procedure for providing alternative assessments when candidates request disability accommodations',
    priority: 'high',
    estimatedMinutes: 20,
    triggerUsages: ['interview-analysis', 'assessment-scoring', 'video-recording'],
  },
]

// Helper: get applicable actions based on usages and states
export function getApplicableActions(usages: string[], states: string[]): ComplianceAction[] {
  return complianceActions.filter(action => {
    const usageMatch = action.triggerUsages.some(u => usages.includes(u))
    if (!usageMatch) return false
    if (!action.triggerStates || action.triggerStates.length === 0) return true // federal, applies everywhere
    return action.triggerStates.some(s => states.includes(s))
  }).sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 }
    return order[a.priority] - order[b.priority]
  })
}

// Get requirements for a list of state codes
export function getRequirementsForStates(stateCodes: string[]): {
  stateRequirements: { state: StateCompliance; requirements: ComplianceRequirement[] }[]
  generalRequirements: ComplianceRequirement[]
} {
  const stateReqs = stateCodes
    .map(code => stateCompliance.find(s => s.code === code))
    .filter((s): s is StateCompliance => s !== undefined)
    .map(state => ({
      state,
      requirements: state.requirements,
    }))

  return {
    stateRequirements: stateReqs,
    generalRequirements,
  }
}

// Phase display configuration
export const PHASE_CONFIG: Record<TaskPhase, { label: string; sublabel: string; color: string }> = {
  today: { 
    label: 'TODAY', 
    sublabel: 'Complete first',
    color: 'text-red-600 bg-red-50 border-red-200'
  },
  this_week: { 
    label: 'THIS WEEK', 
    sublabel: 'Important tasks',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  setup_once: { 
    label: 'SET UP ONCE', 
    sublabel: 'Configure and forget',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
}

// Group requirements by phase for dashboard display
export function getRequirementsByPhase(
  stateRequirements: { state: StateCompliance; requirements: ComplianceRequirement[] }[],
  general: ComplianceRequirement[]
): Record<TaskPhase, { requirement: ComplianceRequirement; state?: StateCompliance }[]> {
  const grouped: Record<TaskPhase, { requirement: ComplianceRequirement; state?: StateCompliance }[]> = {
    today: [],
    this_week: [],
    setup_once: [],
  }

  // Add state requirements
  for (const { state, requirements } of stateRequirements) {
    for (const req of requirements) {
      const phase = req.phase || 'setup_once'
      grouped[phase].push({ requirement: req, state })
    }
  }

  // Add general requirements
  for (const req of general) {
    const phase = req.phase || 'setup_once'
    grouped[phase].push({ requirement: req })
  }

  // Sort each phase by priority
  for (const phase of Object.keys(grouped) as TaskPhase[]) {
    grouped[phase].sort((a, b) => (a.requirement.priority || 99) - (b.requirement.priority || 99))
  }

  // Deduplicate by requirement ID (keep first occurrence)
  for (const phase of Object.keys(grouped) as TaskPhase[]) {
    const seen = new Set<string>()
    grouped[phase] = grouped[phase].filter(item => {
      if (seen.has(item.requirement.id)) return false
      seen.add(item.requirement.id)
      return true
    })
  }

  return grouped
}

// Calculate total time estimate for a phase
export function getPhaseTimeEstimate(
  items: { requirement: ComplianceRequirement }[]
): string {
  const totalMinutes = items.reduce((sum, item) => {
    return sum + (item.requirement.estimatedMinutes || 0)
  }, 0)

  if (totalMinutes === 0) return ''
  if (totalMinutes < 60) return `~${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (mins === 0) return `~${hours}h`
  return `~${hours}h ${mins}m`
}

// Calculate total requirements count
export function getTotalRequirements(stateCodes: string[]): number {
  const { stateRequirements, generalRequirements } = getRequirementsForStates(stateCodes)
  const stateCount = stateRequirements.reduce((sum, s) => sum + s.requirements.length, 0)
  return stateCount + generalRequirements.length
}
