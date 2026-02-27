-- Video Interview Records (Illinois AI Video Interview Act)
CREATE TABLE IF NOT EXISTS video_interview_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT,
  date_received TIMESTAMPTZ NOT NULL,
  ai_tool TEXT,
  shared_with JSONB DEFAULT '[]', -- [{name, date, reason}]
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'deletion_requested', 'deleted')),
  deletion_requested_at TIMESTAMPTZ,
  deletion_deadline TIMESTAMPTZ, -- 30 days after request
  deleted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE video_interview_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own org video records" ON video_interview_records
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM employee_profiles WHERE user_id = auth.uid()
  ) OR organization_id = auth.uid());

CREATE INDEX idx_video_interview_records_org ON video_interview_records(organization_id);
CREATE INDEX idx_video_interview_records_status ON video_interview_records(status);

-- ADS Decision Log (California FEHA)
CREATE TABLE IF NOT EXISTS ads_decision_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  tool_name TEXT NOT NULL,
  decision_type TEXT NOT NULL CHECK (decision_type IN ('hire', 'reject', 'promote', 'terminate', 'discipline', 'other')),
  input_summary TEXT, -- what data went into the AI
  output_decision TEXT, -- what the AI recommended/decided
  criteria_used TEXT, -- what criteria/model was used
  bias_test_results TEXT, -- any bias testing done
  affected_person TEXT, -- applicant/employee name
  decision_date TIMESTAMPTZ NOT NULL,
  retention_expires TIMESTAMPTZ NOT NULL, -- decision_date + 4 years
  exported_at TIMESTAMPTZ, -- last audit export
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ads_decision_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own org ads decisions" ON ads_decision_log
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM employee_profiles WHERE user_id = auth.uid()
  ) OR organization_id = auth.uid());

CREATE INDEX idx_ads_decision_log_org ON ads_decision_log(organization_id);
CREATE INDEX idx_ads_decision_log_decision_date ON ads_decision_log(decision_date);
CREATE INDEX idx_ads_decision_log_retention ON ads_decision_log(retention_expires);
