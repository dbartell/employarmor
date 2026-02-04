-- Consent Links table for shareable consent collection
CREATE TABLE IF NOT EXISTS consent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  token VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  submissions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for token lookups
CREATE INDEX IF NOT EXISTS idx_consent_links_token ON consent_links(token);
CREATE INDEX IF NOT EXISTS idx_consent_links_org_id ON consent_links(org_id);

-- Add new columns to consent_records if they don't exist
ALTER TABLE consent_records 
ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS consent_link_id UUID REFERENCES consent_links(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

-- Index for consent_link_id lookups
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_link_id ON consent_records(consent_link_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_source ON consent_records(source);

-- RLS policies for consent_links
ALTER TABLE consent_links ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own org's consent links
CREATE POLICY "Users can view own org consent links" ON consent_links
  FOR SELECT USING (auth.uid() = org_id);

-- Policy: Users can insert consent links for their org
CREATE POLICY "Users can insert own org consent links" ON consent_links
  FOR INSERT WITH CHECK (auth.uid() = org_id);

-- Policy: Users can update their own org's consent links
CREATE POLICY "Users can update own org consent links" ON consent_links
  FOR UPDATE USING (auth.uid() = org_id);

-- Policy: Users can delete their own org's consent links
CREATE POLICY "Users can delete own org consent links" ON consent_links
  FOR DELETE USING (auth.uid() = org_id);

-- Policy: Anyone can read active, non-expired consent links by token (for public consent page)
-- This is done via service role in the API, so no public policy needed

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_consent_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS consent_links_updated_at ON consent_links;
CREATE TRIGGER consent_links_updated_at
  BEFORE UPDATE ON consent_links
  FOR EACH ROW
  EXECUTE FUNCTION update_consent_links_updated_at();
