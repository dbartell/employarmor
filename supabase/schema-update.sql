-- HireShield Schema Updates
-- Run this in Supabase SQL Editor

-- ============================================
-- Create missing tables that the app expects
-- ============================================

-- Users table (app expects this separate from auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  company_name TEXT,
  company_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hiring states table (tracks which states an org hires in)
CREATE TABLE IF NOT EXISTS hiring_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, state_code)
);

-- ============================================
-- Add missing columns to existing tables
-- ============================================

-- consent_records additions
ALTER TABLE consent_records 
ADD COLUMN IF NOT EXISTS disclosure_date date,
ADD COLUMN IF NOT EXISTS consent_date date,
ADD COLUMN IF NOT EXISTS position text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- leads additions
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS company_size text;

-- audits - ensure org_id exists and works with auth.uid()
ALTER TABLE audits 
DROP CONSTRAINT IF EXISTS audits_org_id_fkey;

ALTER TABLE audits
ADD COLUMN IF NOT EXISTS org_id UUID;

-- documents - ensure org_id works
ALTER TABLE documents
DROP CONSTRAINT IF EXISTS documents_org_id_fkey;

-- hiring_tools - ensure org_id works  
ALTER TABLE hiring_tools
DROP CONSTRAINT IF EXISTS hiring_tools_org_id_fkey;

-- consent_records - ensure org_id works
ALTER TABLE consent_records
DROP CONSTRAINT IF EXISTS consent_records_org_id_fkey;

-- ============================================
-- Enable RLS on new tables
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_states ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Users table
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can insert own record" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;

CREATE POLICY "Users can view own record" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own record" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own record" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Hiring states
DROP POLICY IF EXISTS "Users can manage own hiring states" ON hiring_states;
CREATE POLICY "Users can manage own hiring states" ON hiring_states
    FOR ALL USING (auth.uid() = org_id);

-- Audits (use org_id = auth.uid() pattern)
DROP POLICY IF EXISTS "Users can manage own audits" ON audits;
CREATE POLICY "Users can manage own audits" ON audits
    FOR ALL USING (auth.uid() = org_id);

-- Audit findings
DROP POLICY IF EXISTS "Users can manage own audit findings" ON audit_findings;
CREATE POLICY "Users can manage own audit findings" ON audit_findings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_findings.audit_id AND audits.org_id = auth.uid())
    );

-- Documents
DROP POLICY IF EXISTS "Users can manage own documents" ON documents;
CREATE POLICY "Users can manage own documents" ON documents
    FOR ALL USING (auth.uid() = org_id);

-- Consent records
DROP POLICY IF EXISTS "Users can manage own consent records" ON consent_records;
CREATE POLICY "Users can manage own consent records" ON consent_records
    FOR ALL USING (auth.uid() = org_id);

-- Hiring tools
DROP POLICY IF EXISTS "Users can manage own hiring tools" ON hiring_tools;
CREATE POLICY "Users can manage own hiring tools" ON hiring_tools
    FOR ALL USING (auth.uid() = org_id);

-- Training completions
DROP POLICY IF EXISTS "Users can manage own training" ON training_completions;
CREATE POLICY "Users can manage own training" ON training_completions
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Auto-create user record on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
