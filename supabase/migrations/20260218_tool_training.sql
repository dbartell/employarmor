-- Tool training progress tracking
-- Tracks individual employee progress through tool-specific compliance training

CREATE TABLE IF NOT EXISTS tool_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  tool_name TEXT,
  section_number INTEGER NOT NULL DEFAULT 1,
  quiz_answers JSONB DEFAULT '{}',
  quiz_score INTEGER,
  passed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id, tool_slug, section_number)
);

-- Tool training certificates
-- Issued when an employee passes a tool-specific training quiz
CREATE TABLE IF NOT EXISTS tool_training_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  tool_name TEXT,
  certificate_number TEXT UNIQUE NOT NULL,
  quiz_score INTEGER,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,  -- 1 year from issue
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id, tool_slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tool_training_org ON tool_training_progress(organization_id);
CREATE INDEX IF NOT EXISTS idx_tool_training_user ON tool_training_progress(user_id, tool_slug);
CREATE INDEX IF NOT EXISTS idx_tool_training_passed ON tool_training_progress(organization_id, passed);
CREATE INDEX IF NOT EXISTS idx_tool_certs_org ON tool_training_certificates(organization_id);
CREATE INDEX IF NOT EXISTS idx_tool_certs_user ON tool_training_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_certs_expires ON tool_training_certificates(expires_at);
CREATE INDEX IF NOT EXISTS idx_tool_certs_number ON tool_training_certificates(certificate_number);

-- RLS Policies
ALTER TABLE tool_training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_training_certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own training progress
CREATE POLICY "Users can view own training progress" ON tool_training_progress
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert/update their own progress
CREATE POLICY "Users can update own training progress" ON tool_training_progress
  FOR ALL USING (user_id = auth.uid());

-- Admins can view all org training progress
CREATE POLICY "Admins can view org training progress" ON tool_training_progress
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON tool_training_certificates
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all org certificates
CREATE POLICY "Admins can view org certificates" ON tool_training_certificates
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'manager')
    )
  );

-- System can insert certificates (via API)
CREATE POLICY "System can create certificates" ON tool_training_certificates
  FOR INSERT WITH CHECK (user_id = auth.uid());
