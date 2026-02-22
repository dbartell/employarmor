// Maps each compliance section to the states/conditions that trigger it
// 'federal' = always applies, 'recommended' = not legally required but advised

export interface ComplianceSectionMeta {
  href: string
  requiredStates: string[] // state codes that make this required, or ['federal'] / ['recommended']
  alwaysApplies: boolean
  triggerLabel: string // e.g. "NYC", "Illinois, Texas, Washington"
}

export const complianceSections: ComplianceSectionMeta[] = [
  {
    href: '/candidate-notices',
    requiredStates: ['IL', 'NYC', 'CO', 'MD', 'CA'],
    alwaysApplies: false,
    triggerLabel: 'Illinois, NYC, Colorado, Maryland, California',
  },
  {
    href: '/employee-disclosures',
    requiredStates: [],
    alwaysApplies: true, // recommended for all
    triggerLabel: 'All states (recommended)',
  },
  {
    href: '/bias-audit',
    requiredStates: ['NYC'],
    alwaysApplies: false,
    triggerLabel: 'NYC (Local Law 144)',
  },
  {
    href: '/impact-assessment',
    requiredStates: ['CO'],
    alwaysApplies: false,
    triggerLabel: 'Colorado (SB24-205)',
  },
  {
    href: '/consent',
    requiredStates: ['CO', 'CA', 'MD'],
    alwaysApplies: false,
    triggerLabel: 'Colorado, California, Maryland',
  },
  {
    href: '/fcra',
    requiredStates: [],
    alwaysApplies: true, // federal
    triggerLabel: 'Federal (all states)',
  },
  {
    href: '/biometric',
    requiredStates: ['IL', 'TX', 'WA'],
    alwaysApplies: false,
    triggerLabel: 'Illinois (BIPA), Texas, Washington',
  },
  {
    href: '/data-privacy',
    requiredStates: ['CA', 'CO', 'CT'],
    alwaysApplies: false,
    triggerLabel: 'California (CCPA), Colorado, Connecticut',
  },
  {
    href: '/ada',
    requiredStates: [],
    alwaysApplies: true, // federal recommendation
    triggerLabel: 'Federal (ADA applies nationwide)',
  },
  {
    href: '/pay-transparency',
    requiredStates: ['CO', 'NYC', 'CA', 'WA', 'CT', 'MD', 'NV', 'RI'],
    alwaysApplies: false,
    triggerLabel: 'Colorado, NYC, California, Washington + 5 more states',
  },
]

/**
 * Check if a section applies to the given org states
 */
export function sectionApplies(href: string, orgStates: string[]): boolean {
  const section = complianceSections.find(s => s.href === href)
  if (!section) return true // unknown section, show as active
  if (section.alwaysApplies) return true
  return section.requiredStates.some(s => orgStates.includes(s))
}

/**
 * Get the trigger states label for a section (for "doesn't apply" messaging)
 */
export function getSectionTriggerLabel(href: string): string {
  const section = complianceSections.find(s => s.href === href)
  return section?.triggerLabel || ''
}

/**
 * Get states that would make a section apply (for "start hiring in X" messaging)
 */
export function getMissingStates(href: string): string[] {
  const section = complianceSections.find(s => s.href === href)
  if (!section || section.alwaysApplies) return []
  return section.requiredStates
}
