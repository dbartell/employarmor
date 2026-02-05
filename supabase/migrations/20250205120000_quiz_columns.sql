-- Add quiz data columns to organizations table
-- These store onboarding quiz responses for compliance tracking

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS states TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quiz_tools TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quiz_risk_score INTEGER,
ADD COLUMN IF NOT EXISTS quiz_usages TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';

-- Index for state-based queries
CREATE INDEX IF NOT EXISTS idx_organizations_states ON organizations USING GIN(states);
