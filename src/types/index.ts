// Database types

export interface Organization {
  id: string
  name: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  industry: string
  employee_count?: number
  seat_limit?: number
  seats_used?: number
  created_at: string
}

export type MemberRole = 'owner' | 'admin' | 'manager' | 'member'

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: MemberRole
  invited_by?: string
  joined_at: string
  last_active_at?: string
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    email: string
    full_name?: string
  }
}

export interface TeamInvite {
  id: string
  organization_id: string
  email: string
  role: Exclude<MemberRole, 'owner'>
  token: string
  invited_by?: string
  expires_at: string
  accepted_at?: string
  created_at: string
  // Joined data
  inviter?: {
    email: string
    full_name?: string
  }
  organization?: {
    name: string
  }
}

export interface User {
  id: string
  org_id: string
  email: string
  role: 'admin' | 'member'
  created_at: string
}

export interface HiringState {
  id: string
  org_id: string
  state_code: string
}

export interface HiringTool {
  id: string
  org_id: string
  tool_name: string
  tool_type: 'ats' | 'screening' | 'assessment' | 'interview' | 'other'
  usage_description: string
}

export interface Audit {
  id: string
  org_id: string
  created_at: string
  risk_score: number
  status: 'draft' | 'completed'
}

export interface AuditFinding {
  id: string
  audit_id: string
  state_code: string
  finding_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  remediation: string
}

export interface Document {
  id: string
  org_id: string
  doc_type: 'disclosure' | 'consent' | 'policy' | 'assessment'
  title: string
  content: string
  version: number
  created_at: string
}

export interface ConsentRecord {
  id: string
  org_id: string
  candidate_email: string
  candidate_name: string
  disclosure_date: string
  consent_date: string | null
  document_id: string
}

export interface TrainingCompletion {
  id: string
  user_id: string
  course_id: string
  completed_at: string
  score: number
  certificate_url: string | null
}

// App types

export interface StateRequirement {
  code: string
  name: string
  law: string
  effective: string
  requirements: string[]
  penalties: string
}

export interface AITool {
  id: string
  name: string
  category: string
  description: string
  commonUses: string[]
}

export interface AuditQuestion {
  id: string
  question: string
  type: 'select' | 'multiselect' | 'text' | 'boolean'
  options?: string[]
  stateRelevance?: string[]
}

export interface RiskFactor {
  factor: string
  weight: number
  stateCode?: string
}

// Compliance document types
export interface ComplianceDocument {
  id: string
  org_id: string
  document_type: 'bias_audit' | 'impact_assessment' | 'disclosure' | 'training_cert' | 'adverse_policy'
  title: string
  description?: string
  jurisdiction?: string
  issued_at: string
  expires_at: string
  status: 'active' | 'expiring_soon' | 'expired' | 'renewed'
  renewed_from_id?: string
  file_url?: string
  file_name?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface RenewalNotification {
  id: string
  document_id: string
  notification_type: 'day_90' | 'day_60' | 'day_30' | 'day_7' | 'day_0' | 'day_-30'
  sent_at: string
  email_to: string
  email_message_id?: string
  opened_at?: string
  clicked_at?: string
}

export const DOCUMENT_TYPE_LABELS: Record<ComplianceDocument['document_type'], string> = {
  bias_audit: 'Bias Audit',
  impact_assessment: 'Impact Assessment',
  disclosure: 'Candidate Disclosure',
  training_cert: 'Training Certificate',
  adverse_policy: 'Adverse Action Policy',
}

export const DOCUMENT_VALIDITY_YEARS: Record<ComplianceDocument['document_type'], number> = {
  bias_audit: 1,
  impact_assessment: 1,
  disclosure: 1,
  training_cert: 1,
  adverse_policy: 1,
}
