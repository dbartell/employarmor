-- HireShield Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LEADS (Scorecard submissions - pre-signup)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company_name TEXT,
  company_size TEXT,
  states TEXT[], -- Array of states they hire in
  tools TEXT[], -- Array of AI tools they use
  risk_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ, -- When they became a customer
  source TEXT DEFAULT 'scorecard'
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ============================================
-- ORGANIZATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  size TEXT, -- '1-10', '11-50', '51-200', '201-500', '500+'
  industry TEXT,
  states TEXT[], -- States where they hire
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'free', -- 'free', 'starter', 'pro', 'enterprise'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_org ON profiles(org_id);

-- ============================================
-- HIRING TOOLS (tools used by org)
-- ============================================
CREATE TABLE IF NOT EXISTS hiring_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  tool_type TEXT, -- 'ats', 'assessment', 'screening', 'video', 'other'
  usage_description TEXT,
  triggers_compliance BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hiring_tools_org ON hiring_tools(org_id);

-- ============================================
-- AUDITS
-- ============================================
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  risk_score INTEGER, -- 0-100
  status TEXT DEFAULT 'draft', -- 'draft', 'completed'
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audits_org ON audits(org_id);

-- ============================================
-- AUDIT FINDINGS
-- ============================================
CREATE TABLE IF NOT EXISTS audit_findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  state_code TEXT NOT NULL, -- 'IL', 'CO', 'CA', 'NYC'
  finding_type TEXT NOT NULL, -- 'disclosure', 'consent', 'audit', 'training'
  severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  remediation TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_findings_audit ON audit_findings(audit_id);

-- ============================================
-- DOCUMENTS (generated compliance docs)
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- 'disclosure', 'consent', 'policy', 'assessment'
  title TEXT NOT NULL,
  content JSONB, -- Structured content
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_org ON documents(org_id);

-- ============================================
-- CONSENT RECORDS (audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  candidate_email TEXT NOT NULL,
  candidate_name TEXT,
  disclosure_sent_at TIMESTAMPTZ,
  consent_received_at TIMESTAMPTZ,
  consent_method TEXT, -- 'email', 'signature', 'checkbox'
  document_id UUID REFERENCES documents(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consent_org ON consent_records(org_id);
CREATE INDEX idx_consent_email ON consent_records(candidate_email);

-- ============================================
-- TRAINING COMPLETIONS
-- ============================================
CREATE TABLE IF NOT EXISTS training_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, -- 'ai-101', 'state-laws', 'compliance-checklist'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  quiz_score INTEGER,
  certificate_url TEXT
);

CREATE INDEX idx_training_user ON training_completions(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_completions ENABLE ROW LEVEL SECURITY;

-- Leads: Anyone can insert (public scorecard), only service role can read
CREATE POLICY "Anyone can submit leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can read leads" ON leads FOR SELECT USING (auth.role() = 'service_role');

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: Members can view their org
CREATE POLICY "Org members can view" ON organizations FOR SELECT 
  USING (id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Hiring tools: Org members can CRUD
CREATE POLICY "Org members can manage tools" ON hiring_tools FOR ALL 
  USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Audits: Org members can CRUD
CREATE POLICY "Org members can manage audits" ON audits FOR ALL 
  USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Audit findings: Accessible via audit ownership
CREATE POLICY "Org members can view findings" ON audit_findings FOR ALL 
  USING (audit_id IN (
    SELECT id FROM audits WHERE org_id IN (
      SELECT org_id FROM profiles WHERE id = auth.uid()
    )
  ));

-- Documents: Org members can CRUD
CREATE POLICY "Org members can manage documents" ON documents FOR ALL 
  USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Consent records: Org members can CRUD
CREATE POLICY "Org members can manage consent" ON consent_records FOR ALL 
  USING (org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Training: Users can manage their own completions
CREATE POLICY "Users can manage own training" ON training_completions FOR ALL 
  USING (user_id = auth.uid());

-- ============================================
-- HELPER FUNCTION: Create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
