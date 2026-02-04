-- Migration: Onboarding UX Improvements
-- Adds trial tracking, quiz data storage, and paywall support

-- ============================================
-- ADD TRIAL FIELDS TO ORGANIZATIONS
-- ============================================

-- Trial tracking
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';

-- Quiz data storage (for ATS integration and personalization)
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS quiz_tools TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quiz_risk_score INTEGER,
ADD COLUMN IF NOT EXISTS quiz_usages TEXT[] DEFAULT '{}';

-- Paywall tracking
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS documents_generated INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS paywall_triggered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS paywall_reason TEXT;

-- ============================================
-- DRIP EMAIL TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS drip_email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL, -- 'drip_day_1_welcome', 'drip_day_2_incomplete', etc.
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  skipped_at TIMESTAMPTZ,
  skip_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drip_events_org ON drip_email_events(org_id);
CREATE INDEX idx_drip_events_type ON drip_email_events(email_type);
CREATE INDEX idx_drip_events_scheduled ON drip_email_events(scheduled_for) WHERE sent_at IS NULL AND skipped_at IS NULL;

-- ============================================
-- ANALYTICS EVENTS (for time-to-value tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_event ON analytics_events(event);
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_org ON analytics_events(org_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE drip_email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Drip emails: Service role only
CREATE POLICY "Service role manages drip events" ON drip_email_events FOR ALL 
  USING (auth.role() = 'service_role');

-- Analytics: Users can view their own, service role can manage all
CREATE POLICY "Users can view own analytics" ON analytics_events FOR SELECT 
  USING (user_id = auth.uid() OR org_id = auth.uid());
CREATE POLICY "Service role manages analytics" ON analytics_events FOR ALL 
  USING (auth.role() = 'service_role');

-- ============================================
-- HELPER FUNCTION: Calculate trial end date
-- ============================================
CREATE OR REPLACE FUNCTION get_trial_end_date(trial_start TIMESTAMPTZ)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN trial_start + INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- HELPER FUNCTION: Check if trial is active
-- ============================================
CREATE OR REPLACE FUNCTION is_trial_active(org_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  org_record RECORD;
BEGIN
  SELECT trial_started_at, subscription_status 
  INTO org_record
  FROM organizations 
  WHERE id = org_id_param;
  
  -- Has active subscription
  IF org_record.subscription_status IN ('active', 'trialing') THEN
    RETURN TRUE;
  END IF;
  
  -- Within trial period
  IF org_record.trial_started_at IS NOT NULL THEN
    RETURN NOW() < get_trial_end_date(org_record.trial_started_at);
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: Check paywall trigger
-- ============================================
CREATE OR REPLACE FUNCTION should_show_paywall(org_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  org_record RECORD;
  days_since_trial INTEGER;
BEGIN
  SELECT trial_started_at, documents_generated, subscription_status 
  INTO org_record
  FROM organizations 
  WHERE id = org_id_param;
  
  -- Has active subscription - no paywall
  IF org_record.subscription_status IN ('active', 'trialing') THEN
    RETURN FALSE;
  END IF;
  
  -- No trial started - no paywall
  IF org_record.trial_started_at IS NULL THEN
    RETURN FALSE;
  END IF;
  
  days_since_trial := EXTRACT(DAY FROM NOW() - org_record.trial_started_at)::INTEGER;
  
  -- Trigger 1: First document generated
  IF COALESCE(org_record.documents_generated, 0) >= 1 THEN
    RETURN TRUE;
  END IF;
  
  -- Trigger 2: Day 3+ of trial
  IF days_since_trial >= 3 THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Schedule drip emails on trial start
-- ============================================
CREATE OR REPLACE FUNCTION schedule_drip_emails()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when trial_started_at is first set
  IF NEW.trial_started_at IS NOT NULL AND OLD.trial_started_at IS NULL THEN
    -- Schedule welcome email (5 min after signup)
    INSERT INTO drip_email_events (org_id, email_type, scheduled_for)
    VALUES (NEW.id, 'drip_day_1_welcome', NEW.trial_started_at + INTERVAL '5 minutes');
    
    -- Schedule day 2 email
    INSERT INTO drip_email_events (org_id, email_type, scheduled_for)
    VALUES (NEW.id, 'drip_day_2_incomplete', NEW.trial_started_at + INTERVAL '1 day' + INTERVAL '10 hours');
    
    -- Schedule day 5 email
    INSERT INTO drip_email_events (org_id, email_type, scheduled_for)
    VALUES (NEW.id, 'drip_day_5_training', NEW.trial_started_at + INTERVAL '4 days' + INTERVAL '10 hours');
    
    -- Schedule day 10 email
    INSERT INTO drip_email_events (org_id, email_type, scheduled_for)
    VALUES (NEW.id, 'drip_day_10_trial_ending', NEW.trial_started_at + INTERVAL '9 days' + INTERVAL '10 hours');
    
    -- Schedule day 13 email
    INSERT INTO drip_email_events (org_id, email_type, scheduled_for)
    VALUES (NEW.id, 'drip_day_13_trial_ends_tomorrow', NEW.trial_started_at + INTERVAL '12 days' + INTERVAL '10 hours');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_trial_started ON organizations;
CREATE TRIGGER on_trial_started
  AFTER UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION schedule_drip_emails();

-- Also trigger on insert
CREATE TRIGGER on_org_created_with_trial
  AFTER INSERT ON organizations
  FOR EACH ROW
  WHEN (NEW.trial_started_at IS NOT NULL)
  EXECUTE FUNCTION schedule_drip_emails();

-- ============================================
-- TRIGGER: Increment documents_generated
-- ============================================
CREATE OR REPLACE FUNCTION increment_documents_generated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organizations 
  SET documents_generated = COALESCE(documents_generated, 0) + 1
  WHERE id = NEW.org_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_document_created ON documents;
CREATE TRIGGER on_document_created
  AFTER INSERT ON documents
  FOR EACH ROW EXECUTE FUNCTION increment_documents_generated();

-- ============================================
-- UPDATE EXISTING ORGANIZATIONS WITH TRIALS
-- ============================================
-- Set trial_started_at for existing free plan orgs based on created_at
UPDATE organizations 
SET trial_started_at = created_at
WHERE plan = 'free' 
  AND trial_started_at IS NULL 
  AND created_at IS NOT NULL;
