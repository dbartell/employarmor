-- Migration: Hosted Disclosure Pages
-- Adds tables for public disclosure pages and analytics

-- ============================================
-- DISCLOSURE PAGES (public company disclosure pages)
-- ============================================
CREATE TABLE IF NOT EXISTS disclosure_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  slug TEXT UNIQUE NOT NULL,               -- URL slug (e.g., 'acme-corp')
  is_published BOOLEAN DEFAULT false,
  
  -- Branding
  logo_url TEXT,
  brand_color TEXT DEFAULT '#3B82F6',      -- Primary accent color
  custom_css TEXT,                         -- Enterprise only
  hide_powered_by BOOLEAN DEFAULT false,   -- Enterprise only
  
  -- Content
  header_text TEXT,                        -- Custom header (default: "How [Company] Uses AI in Hiring")
  intro_text TEXT,                         -- Intro paragraph
  contact_email TEXT NOT NULL,
  
  -- Rights section
  rights_section_enabled BOOLEAN DEFAULT true,
  rights_custom_text TEXT,                 -- Override default rights language
  
  -- Bias audit section
  bias_audit_section_enabled BOOLEAN DEFAULT true,
  bias_audit_url TEXT,                     -- Link to full audit report
  bias_audit_date DATE,
  bias_audit_auditor TEXT,
  
  -- AI Tools (can override tools from hiring_tools)
  custom_tools JSONB DEFAULT '[]',         -- Array of {name, purpose, evaluates, stages}
  use_audit_tools BOOLEAN DEFAULT true,    -- Pull from hiring_tools table
  
  -- Metadata
  last_published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISCLOSURE PAGE VIEWS (analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS disclosure_page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disclosure_page_id UUID REFERENCES disclosure_pages(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,                            -- SHA256 hash for privacy
  embed_type TEXT                          -- 'direct', 'compact', 'card', 'full'
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_disclosure_pages_slug ON disclosure_pages(slug);
CREATE INDEX idx_disclosure_pages_org ON disclosure_pages(organization_id);
CREATE INDEX idx_disclosure_views_page ON disclosure_page_views(disclosure_page_id, viewed_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE disclosure_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclosure_page_views ENABLE ROW LEVEL SECURITY;

-- Disclosure pages: Org members can CRUD, anyone can read published pages
CREATE POLICY "Org members can manage disclosure pages" ON disclosure_pages FOR ALL 
  USING (organization_id = auth.uid() OR organization_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Anyone can view published disclosure pages" ON disclosure_pages FOR SELECT 
  USING (is_published = true);

-- Disclosure page views: Org members can view their analytics, anyone can insert
CREATE POLICY "Org members can view their analytics" ON disclosure_page_views FOR SELECT 
  USING (disclosure_page_id IN (
    SELECT id FROM disclosure_pages 
    WHERE organization_id = auth.uid() 
    OR organization_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
  ));

CREATE POLICY "Anyone can log page views" ON disclosure_page_views FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_disclosure_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_disclosure_pages_updated_at
  BEFORE UPDATE ON disclosure_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_disclosure_pages_updated_at();
