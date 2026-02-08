-- Agent API tables for AI agent integrations

-- Agent API keys table
CREATE TABLE IF NOT EXISTS agent_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL UNIQUE,
  api_key TEXT NOT NULL UNIQUE,
  name TEXT,
  org_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for API key lookups
CREATE INDEX IF NOT EXISTS idx_agent_keys_api_key ON agent_keys(api_key);

-- Add agent_id column to organizations for attribution
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS agent_id TEXT REFERENCES agent_keys(agent_id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS agent_created_at TIMESTAMPTZ;

-- Index for agent attribution queries
CREATE INDEX IF NOT EXISTS idx_organizations_agent_id ON organizations(agent_id);

-- Magic links table for handoff
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_org_id ON magic_links(org_id);

-- RLS policies
ALTER TABLE agent_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;

-- Agent keys are only accessible via service role (API endpoints use service role)
CREATE POLICY "agent_keys_service_only" ON agent_keys FOR ALL USING (false);

-- Magic links accessible only via service role
CREATE POLICY "magic_links_service_only" ON magic_links FOR ALL USING (false);

-- Comments
COMMENT ON TABLE agent_keys IS 'API keys for AI agent integrations';
COMMENT ON COLUMN agent_keys.agent_id IS 'Unique identifier for the agent (e.g., mcp-hireshield)';
COMMENT ON COLUMN agent_keys.api_key IS 'Bearer token for API authentication';
COMMENT ON COLUMN organizations.agent_id IS 'Agent that created this organization (for attribution)';
