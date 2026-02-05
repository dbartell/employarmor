-- Add quiz data columns to organizations table
-- These store onboarding quiz responses for compliance tracking

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS states TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quiz_tools TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quiz_risk_score INTEGER,
ADD COLUMN IF NOT EXISTS quiz_usages TEXT[] DEFAULT '{}';

-- Index for state-based queries
CREATE INDEX IF NOT EXISTS idx_organizations_states ON organizations USING GIN(states);
