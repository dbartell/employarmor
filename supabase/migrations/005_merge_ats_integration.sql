-- Migration: Merge.dev ATS Integration
-- Adds tables for ATS integrations, synced candidates/applications, and audit events

-- ============================================
-- ATS INTEGRATIONS (Merge.dev connected accounts)
-- ============================================
CREATE TABLE IF NOT EXISTS ats_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  merge_account_token TEXT NOT NULL,        -- X-Account-Token for API calls
  integration_slug TEXT NOT NULL,           -- 'greenhouse', 'lever', 'workday', etc.
  integration_name TEXT NOT NULL,           -- Display name: "Greenhouse"
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'disconnected', 'error')),
  last_sync_at TIMESTAMPTZ,
  sync_cursor TEXT,                         -- Pagination cursor for incremental sync
  sync_error TEXT,                          -- Last error message if any
  settings JSONB DEFAULT '{}',              -- Custom mapping rules, AI stage names, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ats_integrations_org ON ats_integrations(org_id);
CREATE UNIQUE INDEX idx_ats_integrations_unique ON ats_integrations(org_id, integration_slug);

-- ============================================
-- SYNCED CANDIDATES (from Merge.dev)
-- ============================================
CREATE TABLE IF NOT EXISTS synced_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES ats_integrations(id) ON DELETE CASCADE,
  merge_id TEXT NOT NULL,                   -- Merge's candidate ID (UUID string)
  remote_id TEXT,                           -- ATS's native candidate ID
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone_numbers JSONB DEFAULT '[]',         -- Array of phone numbers
  locations JSONB DEFAULT '[]',             -- Array of location objects for jurisdiction detection
  tags JSONB DEFAULT '[]',                  -- Tags from ATS
  
  -- Compliance fields
  is_regulated BOOLEAN DEFAULT false,       -- In NYC/CO/IL/CA/other regulated jurisdiction?
  regulated_jurisdictions TEXT[] DEFAULT '{}', -- ['nyc', 'colorado', 'illinois', 'california']
  consent_status TEXT DEFAULT 'unknown' CHECK (consent_status IN ('unknown', 'pending', 'granted', 'denied', 'not_required')),
  consent_granted_at TIMESTAMPTZ,
  disclosure_sent_at TIMESTAMPTZ,
  
  -- Raw data for debugging
  raw_data JSONB,
  
  -- Sync metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_synced_candidates_org ON synced_candidates(org_id);
CREATE INDEX idx_synced_candidates_integration ON synced_candidates(integration_id);
CREATE INDEX idx_synced_candidates_regulated ON synced_candidates(org_id, is_regulated) WHERE is_regulated = true;
CREATE INDEX idx_synced_candidates_consent ON synced_candidates(org_id, consent_status);
CREATE UNIQUE INDEX idx_synced_candidates_unique ON synced_candidates(org_id, merge_id);

-- ============================================
-- SYNCED APPLICATIONS (from Merge.dev)
-- ============================================
CREATE TABLE IF NOT EXISTS synced_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES ats_integrations(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES synced_candidates(id) ON DELETE CASCADE,
  merge_id TEXT NOT NULL,                   -- Merge's application ID
  remote_id TEXT,                           -- ATS's native application ID
  
  -- Job info
  job_merge_id TEXT,                        -- Merge's job ID
  job_name TEXT,
  job_offices TEXT[] DEFAULT '{}',          -- Office locations for jurisdiction detection
  
  -- Application state
  current_stage TEXT,
  current_stage_id TEXT,
  applied_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  
  -- Compliance tracking
  is_ai_screened BOOLEAN DEFAULT false,     -- Has this application been AI-screened?
  ai_screening_stage TEXT,                  -- Which stage used AI?
  compliance_flags JSONB DEFAULT '[]',      -- Array of warning/issue objects
  
  -- Raw data
  raw_data JSONB,
  
  -- Sync metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_synced_applications_org ON synced_applications(org_id);
CREATE INDEX idx_synced_applications_candidate ON synced_applications(candidate_id);
CREATE INDEX idx_synced_applications_integration ON synced_applications(integration_id);
CREATE INDEX idx_synced_applications_ai_screened ON synced_applications(org_id, is_ai_screened) WHERE is_ai_screened = true;
CREATE UNIQUE INDEX idx_synced_applications_unique ON synced_applications(org_id, merge_id);

-- ============================================
-- ATS AUDIT EVENTS (compliance trail from ATS activities)
-- ============================================
CREATE TABLE IF NOT EXISTS ats_audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES ats_integrations(id) ON DELETE SET NULL,
  candidate_id UUID REFERENCES synced_candidates(id) ON DELETE SET NULL,
  application_id UUID REFERENCES synced_applications(id) ON DELETE SET NULL,
  
  -- Event details
  event_type TEXT NOT NULL,                 -- 'ai_screen', 'consent_detected', 'disclosure_sent', 'stage_change', 'rejection'
  event_source TEXT,                        -- 'merge_webhook', 'merge_sync', 'manual'
  description TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ats_audit_events_org ON ats_audit_events(org_id);
CREATE INDEX idx_ats_audit_events_candidate ON ats_audit_events(candidate_id);
CREATE INDEX idx_ats_audit_events_application ON ats_audit_events(application_id);
CREATE INDEX idx_ats_audit_events_type ON ats_audit_events(org_id, event_type);
CREATE INDEX idx_ats_audit_events_occurred ON ats_audit_events(org_id, occurred_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE ats_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_audit_events ENABLE ROW LEVEL SECURITY;

-- ATS Integrations: Org members can manage
CREATE POLICY "Org members can manage ATS integrations" ON ats_integrations FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Synced Candidates: Org members can view/manage
CREATE POLICY "Org members can manage synced candidates" ON synced_candidates FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Synced Applications: Org members can view/manage  
CREATE POLICY "Org members can manage synced applications" ON synced_applications FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- ATS Audit Events: Org members can view/manage
CREATE POLICY "Org members can manage ATS audit events" ON ats_audit_events FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_ats_integrations_updated_at ON ats_integrations;
CREATE TRIGGER update_ats_integrations_updated_at
  BEFORE UPDATE ON ats_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_synced_candidates_updated_at ON synced_candidates;
CREATE TRIGGER update_synced_candidates_updated_at
  BEFORE UPDATE ON synced_candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_synced_applications_updated_at ON synced_applications;
CREATE TRIGGER update_synced_applications_updated_at
  BEFORE UPDATE ON synced_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
