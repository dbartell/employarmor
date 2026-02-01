/**
 * Compliance Engine for ATS Data
 * 
 * Detects regulated candidates, checks consent status,
 * and generates compliance flags and audit events.
 */

import type { CandidateLocation, ComplianceFlag, ConsentStatus, SyncedCandidate, SyncedApplication } from './mappers'

// ============================================
// JURISDICTION DETECTION
// ============================================

export interface RegulatedJurisdiction {
  code: string
  name: string
  law: string
  requirements: string[]
}

/**
 * Known regulated jurisdictions and their AI hiring laws.
 */
export const REGULATED_JURISDICTIONS: RegulatedJurisdiction[] = [
  {
    code: 'nyc',
    name: 'New York City',
    law: 'Local Law 144',
    requirements: [
      'Annual bias audit',
      'Public disclosure of audit summary',
      'Candidate notice 10 days before use',
    ],
  },
  {
    code: 'colorado',
    name: 'Colorado',
    law: 'Colorado AI Act (SB 21-169)',
    requirements: [
      'Impact assessment',
      'Consumer notification',
      'Right to opt out',
      'Human review for adverse decisions',
    ],
  },
  {
    code: 'illinois',
    name: 'Illinois',
    law: 'HB 3773 (Artificial Intelligence Video Interview Act)',
    requirements: [
      'Written notice before AI video interview',
      'Candidate consent required',
      'Explanation of AI evaluation',
      'Deletion upon request',
    ],
  },
  {
    code: 'california',
    name: 'California',
    law: 'CCPA ADMT Regulations',
    requirements: [
      'Pre-use notice',
      'Right to opt out',
      'Access to information about automated decision-making',
    ],
  },
  {
    code: 'maryland',
    name: 'Maryland',
    law: 'HB 1202',
    requirements: [
      'Consent required for facial recognition in interviews',
      'Waiver allowed',
    ],
  },
]

/**
 * Location patterns that indicate regulated jurisdictions.
 */
const JURISDICTION_PATTERNS: Record<string, RegExp[]> = {
  nyc: [
    /new york city/i,
    /nyc/i,
    /manhattan/i,
    /brooklyn/i,
    /bronx/i,
    /queens/i,
    /staten island/i,
    /\bny\b.*\b(10\d{3})\b/i, // NY with NYC zip codes
  ],
  colorado: [
    /colorado/i,
    /\bco\b/i,
    /denver/i,
    /boulder/i,
    /colorado springs/i,
    /aurora/i,
    /fort collins/i,
  ],
  illinois: [
    /illinois/i,
    /\bil\b/i,
    /chicago/i,
    /springfield/i,
    /naperville/i,
  ],
  california: [
    /california/i,
    /\bca\b/i,
    /los angeles/i,
    /san francisco/i,
    /san diego/i,
    /san jose/i,
    /oakland/i,
    /sacramento/i,
  ],
  maryland: [
    /maryland/i,
    /\bmd\b/i,
    /baltimore/i,
    /bethesda/i,
    /silver spring/i,
  ],
}

/**
 * Detect which regulated jurisdictions a candidate may be in.
 */
export function detectJurisdictions(locations: CandidateLocation[]): string[] {
  const jurisdictions: Set<string> = new Set()

  for (const location of locations) {
    // Check the raw location string
    const raw = location.raw.toLowerCase()
    
    for (const [code, patterns] of Object.entries(JURISDICTION_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(raw))) {
        jurisdictions.add(code)
      }
    }

    // Also check parsed state codes
    if (location.state) {
      const stateMap: Record<string, string> = {
        'NY': 'nyc', // Default NYC for NY (conservative)
        'CO': 'colorado',
        'IL': 'illinois',
        'CA': 'california',
        'MD': 'maryland',
      }
      
      const mapped = stateMap[location.state.toUpperCase()]
      if (mapped) {
        jurisdictions.add(mapped)
      }
    }
  }

  return Array.from(jurisdictions)
}

/**
 * Get the requirements for a set of jurisdictions.
 */
export function getJurisdictionRequirements(jurisdictions: string[]): RegulatedJurisdiction[] {
  return REGULATED_JURISDICTIONS.filter(j => jurisdictions.includes(j.code))
}

// ============================================
// CONSENT DETECTION
// ============================================

/**
 * Consent-related tag patterns in ATS data.
 */
const CONSENT_TAG_PATTERNS = {
  granted: [
    /ai consent/i,
    /ai disclosure acknowledged/i,
    /disclosure sent/i,
    /consent granted/i,
    /opted in/i,
    /ai notice accepted/i,
  ],
  denied: [
    /consent denied/i,
    /opted out/i,
    /ai opt-out/i,
    /declined ai/i,
  ],
  pending: [
    /consent pending/i,
    /awaiting consent/i,
    /disclosure pending/i,
  ],
}

const DISCLOSURE_TAG_PATTERNS = [
  /disclosure sent/i,
  /ai notice sent/i,
  /ll144 notice/i,
  /aedt notice/i,
]

export interface ConsentInfo {
  status: ConsentStatus
  grantedAt: string | null
  disclosureSentAt: string | null
  detectedFrom: string[]
}

/**
 * Check for consent indicators in candidate tags.
 */
export function checkConsentFromTags(tags: string[]): ConsentInfo {
  const detectedFrom: string[] = []
  let status: ConsentStatus = 'unknown'
  let grantedAt: string | null = null
  let disclosureSentAt: string | null = null

  for (const tag of tags) {
    // Check for granted consent
    if (CONSENT_TAG_PATTERNS.granted.some(p => p.test(tag))) {
      status = 'granted'
      grantedAt = new Date().toISOString() // We don't know exact time, use now
      detectedFrom.push(tag)
    }
    
    // Check for denied consent
    if (CONSENT_TAG_PATTERNS.denied.some(p => p.test(tag))) {
      status = 'denied'
      detectedFrom.push(tag)
    }
    
    // Check for pending consent
    if (status === 'unknown' && CONSENT_TAG_PATTERNS.pending.some(p => p.test(tag))) {
      status = 'pending'
      detectedFrom.push(tag)
    }
    
    // Check for disclosure sent
    if (DISCLOSURE_TAG_PATTERNS.some(p => p.test(tag))) {
      disclosureSentAt = new Date().toISOString()
      detectedFrom.push(tag)
    }
  }

  return { status, grantedAt, disclosureSentAt, detectedFrom }
}

/**
 * Scan activity text for consent/disclosure indicators.
 */
export function detectConsentFromActivity(body: string | null, subject: string | null): ConsentInfo | null {
  if (!body && !subject) return null

  const text = `${subject || ''} ${body || ''}`.toLowerCase()
  const detectedFrom: string[] = []
  let status: ConsentStatus = 'unknown'
  let grantedAt: string | null = null
  let disclosureSentAt: string | null = null

  // Disclosure patterns
  const disclosurePatterns = [
    /sent.*ai.*disclosure/i,
    /ai disclosure.*sent/i,
    /ll144.*notice/i,
    /aedt.*notice/i,
    /automated.*decision.*notice/i,
  ]

  // Consent patterns
  const consentPatterns = [
    /candidate.*consent/i,
    /received.*consent/i,
    /consent.*acknowledged/i,
    /agreed.*ai.*screening/i,
  ]

  for (const pattern of disclosurePatterns) {
    if (pattern.test(text)) {
      disclosureSentAt = new Date().toISOString()
      detectedFrom.push('activity_disclosure')
    }
  }

  for (const pattern of consentPatterns) {
    if (pattern.test(text)) {
      status = 'granted'
      grantedAt = new Date().toISOString()
      detectedFrom.push('activity_consent')
    }
  }

  if (detectedFrom.length === 0) return null

  return { status, grantedAt, disclosureSentAt, detectedFrom }
}

// ============================================
// COMPLIANCE FLAG GENERATION
// ============================================

/**
 * Generate compliance flags for a candidate.
 */
export function generateCandidateFlags(candidate: SyncedCandidate): ComplianceFlag[] {
  const flags: ComplianceFlag[] = []
  const now = new Date().toISOString()

  // Flag: Regulated candidate without consent
  if (candidate.is_regulated && candidate.consent_status === 'unknown') {
    flags.push({
      type: 'missing_consent',
      severity: 'warning',
      message: `Candidate in regulated jurisdiction (${candidate.regulated_jurisdictions.join(', ')}) has unknown consent status`,
      detected_at: now,
    })
  }

  // Flag: Regulated candidate without disclosure
  if (candidate.is_regulated && !candidate.disclosure_sent_at) {
    flags.push({
      type: 'missing_disclosure',
      severity: 'warning',
      message: `Candidate in regulated jurisdiction has no record of AI disclosure being sent`,
      detected_at: now,
    })
  }

  // Flag: Consent denied but still in pipeline
  if (candidate.consent_status === 'denied') {
    flags.push({
      type: 'missing_consent',
      severity: 'critical',
      message: 'Candidate has denied consent for AI screening - should not proceed with automated evaluation',
      detected_at: now,
    })
  }

  return flags
}

/**
 * Generate compliance flags for an application.
 */
export function generateApplicationFlags(
  application: SyncedApplication,
  candidate: SyncedCandidate
): ComplianceFlag[] {
  const flags: ComplianceFlag[] = []
  const now = new Date().toISOString()

  // Flag: AI screening without consent
  if (application.is_ai_screened && candidate.consent_status !== 'granted' && candidate.is_regulated) {
    flags.push({
      type: 'ai_screen_without_consent',
      severity: 'critical',
      message: `Application in AI screening stage (${application.ai_screening_stage}) without confirmed consent`,
      detected_at: now,
    })
  }

  // Flag: Job in regulated location
  const jobJurisdictions = detectJurisdictionsFromOffices(application.job_offices)
  if (jobJurisdictions.length > 0) {
    flags.push({
      type: 'regulated_jurisdiction',
      severity: 'info',
      message: `Job is in regulated jurisdiction(s): ${jobJurisdictions.join(', ')}`,
      detected_at: now,
    })
  }

  return flags
}

/**
 * Detect jurisdictions from job office locations.
 */
function detectJurisdictionsFromOffices(offices: string[]): string[] {
  const jurisdictions: Set<string> = new Set()

  for (const office of offices) {
    const lower = office.toLowerCase()
    
    for (const [code, patterns] of Object.entries(JURISDICTION_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(lower))) {
        jurisdictions.add(code)
      }
    }
  }

  return Array.from(jurisdictions)
}

// ============================================
// COMPLIANCE CHECK SUMMARY
// ============================================

export interface ComplianceCheckResult {
  isCompliant: boolean
  issues: ComplianceIssue[]
  recommendations: string[]
}

export interface ComplianceIssue {
  severity: 'warning' | 'error' | 'critical'
  code: string
  message: string
  affectedCount: number
}

/**
 * Run a compliance check on all synced candidates for an org.
 */
export function summarizeComplianceStatus(
  candidates: SyncedCandidate[],
  applications: SyncedApplication[]
): ComplianceCheckResult {
  const issues: ComplianceIssue[] = []
  const recommendations: string[] = []

  // Count regulated candidates
  const regulatedCandidates = candidates.filter(c => c.is_regulated)
  const missingConsent = regulatedCandidates.filter(c => c.consent_status === 'unknown')
  const missingDisclosure = regulatedCandidates.filter(c => !c.disclosure_sent_at)
  const deniedConsent = candidates.filter(c => c.consent_status === 'denied')

  // Count AI-screened applications
  const aiScreened = applications.filter(a => a.is_ai_screened)
  const aiScreenedWithoutConsent = aiScreened.filter(a => {
    const candidate = candidates.find(c => c.id === a.candidate_id)
    return candidate && candidate.consent_status !== 'granted' && candidate.is_regulated
  })

  // Generate issues
  if (missingConsent.length > 0) {
    issues.push({
      severity: 'warning',
      code: 'MISSING_CONSENT',
      message: 'Regulated candidates with unknown consent status',
      affectedCount: missingConsent.length,
    })
    recommendations.push('Review candidate records to confirm consent was obtained before AI screening')
  }

  if (missingDisclosure.length > 0) {
    issues.push({
      severity: 'warning',
      code: 'MISSING_DISCLOSURE',
      message: 'Regulated candidates with no disclosure record',
      affectedCount: missingDisclosure.length,
    })
    recommendations.push('Ensure AI disclosure notices are sent and tracked in your ATS')
  }

  if (deniedConsent.length > 0) {
    issues.push({
      severity: 'error',
      code: 'CONSENT_DENIED',
      message: 'Candidates who denied consent (should not be AI-screened)',
      affectedCount: deniedConsent.length,
    })
    recommendations.push('Remove candidates who denied consent from automated screening stages')
  }

  if (aiScreenedWithoutConsent.length > 0) {
    issues.push({
      severity: 'critical',
      code: 'AI_SCREEN_NO_CONSENT',
      message: 'Applications in AI screening without confirmed consent',
      affectedCount: aiScreenedWithoutConsent.length,
    })
    recommendations.push('URGENT: Review AI-screened applications and confirm consent before proceeding')
  }

  // Determine overall compliance
  const hasCritical = issues.some(i => i.severity === 'critical')
  const hasError = issues.some(i => i.severity === 'error')
  const isCompliant = !hasCritical && !hasError

  return {
    isCompliant,
    issues,
    recommendations,
  }
}

// ============================================
// JURISDICTION-SPECIFIC CHECKS
// ============================================

/**
 * Check if a candidate complies with NYC LL144 requirements.
 */
export function checkNYCCompliance(
  candidate: SyncedCandidate,
  hasPublishedAudit: boolean
): { isCompliant: boolean; issues: string[] } {
  const issues: string[] = []

  if (!candidate.regulated_jurisdictions.includes('nyc')) {
    return { isCompliant: true, issues: [] }
  }

  // NYC requires 10-day notice before AI use
  if (!candidate.disclosure_sent_at) {
    issues.push('No record of 10-day advance notice for NYC LL144')
  }

  // Check if bias audit is published
  if (!hasPublishedAudit) {
    issues.push('NYC LL144 requires published bias audit summary')
  }

  return {
    isCompliant: issues.length === 0,
    issues,
  }
}

/**
 * Check if a candidate complies with Colorado AI Act requirements.
 */
export function checkColoradoCompliance(
  candidate: SyncedCandidate,
  hasImpactAssessment: boolean
): { isCompliant: boolean; issues: string[] } {
  const issues: string[] = []

  if (!candidate.regulated_jurisdictions.includes('colorado')) {
    return { isCompliant: true, issues: [] }
  }

  // Colorado requires pre-use notification
  if (!candidate.disclosure_sent_at) {
    issues.push('Colorado requires consumer notification before AI use')
  }

  // Colorado requires impact assessment
  if (!hasImpactAssessment) {
    issues.push('Colorado AI Act requires impact assessment')
  }

  // Colorado allows opt-out - check consent status
  if (candidate.consent_status === 'denied') {
    issues.push('Candidate has opted out of AI screening (Colorado right to opt-out)')
  }

  return {
    isCompliant: issues.length === 0,
    issues,
  }
}

/**
 * Check if a candidate complies with Illinois HB 3773 requirements.
 */
export function checkIllinoisCompliance(
  candidate: SyncedCandidate
): { isCompliant: boolean; issues: string[] } {
  const issues: string[] = []

  if (!candidate.regulated_jurisdictions.includes('illinois')) {
    return { isCompliant: true, issues: [] }
  }

  // Illinois requires written notice + consent for video interviews
  if (!candidate.disclosure_sent_at) {
    issues.push('Illinois requires written notice before AI video interview')
  }

  if (candidate.consent_status !== 'granted') {
    issues.push('Illinois requires candidate consent for AI video interview analysis')
  }

  return {
    isCompliant: issues.length === 0,
    issues,
  }
}
