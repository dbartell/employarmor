-- Migration: Compliance Workflow Tables
-- Adds tables for remediation tracking, impact assessments, adverse decision config, and compliance verification

-- ============================================
-- REMEDIATION ITEMS (tracks compliance checklist progress)
-- ============================================
CREATE TABLE IF NOT EXISTS remediation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
  state_code TEXT NOT NULL, -- 'IL', 'CO', 'CA', 'NYC'
  item_key TEXT NOT NULL, -- 'disclosure', 'impact_assessment', 'training', 'consent_tracking', 'adverse_decision', 'bias_audit'
  item_label TEXT NOT NULL,
  item_description TEXT,
  status TEXT DEFAULT 'incomplete', -- 'incomplete', 'in_progress', 'complete'
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  linked_document_id UUID REFERENCES documents(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_remediation_org ON remediation_items(org_id);
CREATE INDEX idx_remediation_audit ON remediation_items(audit_id);
CREATE INDEX idx_remediation_state ON remediation_items(state_code);
CREATE UNIQUE INDEX idx_remediation_unique ON remediation_items(org_id, state_code, item_key);

-- ============================================
-- IMPACT ASSESSMENTS (Colorado requirement)
-- ============================================
CREATE TABLE IF NOT EXISTS impact_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Step 1: AI System Details
  system_name TEXT NOT NULL,
  system_purpose TEXT,
  vendor_name TEXT,
  deployment_date DATE,
  ai_tools JSONB DEFAULT '[]', -- Array of tool names from audit
  
  -- Step 2: Data Inputs
  data_inputs JSONB DEFAULT '[]', -- Array of data type objects
  data_sources TEXT,
  data_retention_period TEXT,
  
  -- Step 3: Discrimination Risk Analysis
  affected_groups JSONB DEFAULT '[]', -- Protected groups that could be affected
  potential_harms TEXT,
  risk_level TEXT, -- 'low', 'medium', 'high'
  safeguards TEXT,
  bias_testing_date DATE,
  bias_testing_results TEXT,
  
  -- Step 4: Transparency Measures
  notification_method TEXT,
  appeal_process TEXT,
  human_reviewer_name TEXT,
  human_reviewer_role TEXT,
  human_reviewer_contact TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'draft', -- 'draft', 'complete'
  version INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Annual renewal required
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_impact_assessments_org ON impact_assessments(org_id);

-- ============================================
-- ADVERSE DECISION SETTINGS (Colorado requirement)
-- ============================================
CREATE TABLE IF NOT EXISTS adverse_decision_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  
  -- Appeal Configuration
  reviewer_name TEXT,
  reviewer_role TEXT,
  reviewer_email TEXT,
  reviewer_phone TEXT,
  
  -- Process Settings
  response_deadline_days INTEGER DEFAULT 5,
  
  -- Template for Statement of Reasons
  reasons_template TEXT,
  
  -- Additional settings
  appeal_instructions TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONSENT SETTINGS (onboarding config)
-- ============================================
CREATE TABLE IF NOT EXISTS consent_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  
  notification_template TEXT,
  data_retention_days INTEGER DEFAULT 365,
  onboarding_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPLIANCE VERIFICATIONS (final confirmation)
-- ============================================
CREATE TABLE IF NOT EXISTS compliance_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  state_code TEXT NOT NULL,
  
  -- Confirmation checkboxes
  confirmed_disclosure BOOLEAN DEFAULT false,
  confirmed_training BOOLEAN DEFAULT false,
  confirmed_consent_process BOOLEAN DEFAULT false,
  confirmed_appeal_process BOOLEAN DEFAULT false,
  confirmed_impact_assessment BOOLEAN DEFAULT false,
  confirmed_bias_audit BOOLEAN DEFAULT false,
  
  -- Certification
  is_compliant BOOLEAN DEFAULT false,
  compliant_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Annual renewal
  verified_by UUID REFERENCES profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_verifications_org ON compliance_verifications(org_id);
CREATE UNIQUE INDEX idx_compliance_verifications_unique ON compliance_verifications(org_id, state_code);

-- ============================================
-- HIRING STATES (if not exists - maps org to states)
-- ============================================
CREATE TABLE IF NOT EXISTS hiring_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  state_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hiring_states_org ON hiring_states(org_id);
CREATE UNIQUE INDEX idx_hiring_states_unique ON hiring_states(org_id, state_code);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE remediation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adverse_decision_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_states ENABLE ROW LEVEL SECURITY;

-- Remediation items: Org members can CRUD
CREATE POLICY "Org members can manage remediation" ON remediation_items FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Impact assessments: Org members can CRUD
CREATE POLICY "Org members can manage impact assessments" ON impact_assessments FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Adverse decision settings: Org members can CRUD
CREATE POLICY "Org members can manage adverse settings" ON adverse_decision_settings FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Consent settings: Org members can CRUD
CREATE POLICY "Org members can manage consent settings" ON consent_settings FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Compliance verifications: Org members can CRUD
CREATE POLICY "Org members can manage compliance verifications" ON compliance_verifications FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Hiring states: Org members can CRUD
CREATE POLICY "Org members can manage hiring states" ON hiring_states FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));
