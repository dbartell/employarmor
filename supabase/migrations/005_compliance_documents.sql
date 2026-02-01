-- Migration: Compliance Documents & Renewal Reminders
-- Adds tables for tracking expirable compliance documents and renewal notifications

-- ============================================
-- COMPLIANCE DOCUMENTS (tracks expirable docs like bias audits, impact assessments)
-- ============================================
CREATE TABLE IF NOT EXISTS compliance_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Document details
  document_type TEXT NOT NULL, -- 'bias_audit', 'impact_assessment', 'disclosure', 'training_cert', 'adverse_policy'
  title TEXT NOT NULL,
  description TEXT,
  jurisdiction TEXT, -- 'nyc', 'colorado', 'illinois', 'california', 'all'
  
  -- Dates
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expiring_soon', 'expired', 'renewed')),
  
  -- Renewal chain
  renewed_from_id UUID REFERENCES compliance_documents(id),
  
  -- File storage
  file_url TEXT,
  file_name TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_docs_org ON compliance_documents(org_id);
CREATE INDEX idx_compliance_docs_expires ON compliance_documents(expires_at);
CREATE INDEX idx_compliance_docs_status ON compliance_documents(status);
CREATE INDEX idx_compliance_docs_type ON compliance_documents(document_type);

-- ============================================
-- RENEWAL NOTIFICATIONS (tracks which reminders have been sent)
-- ============================================
CREATE TABLE IF NOT EXISTS renewal_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES compliance_documents(id) ON DELETE CASCADE,
  
  -- Notification type: days before/after expiry
  notification_type TEXT NOT NULL, -- 'day_90', 'day_60', 'day_30', 'day_7', 'day_0', 'day_-30'
  
  -- Tracking
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_to TEXT NOT NULL,
  email_message_id TEXT, -- From email provider (Resend)
  
  -- Engagement tracking
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  -- Prevent duplicate notifications
  UNIQUE(document_id, notification_type)
);

CREATE INDEX idx_renewal_notifications_doc ON renewal_notifications(document_id);
CREATE INDEX idx_renewal_notifications_sent ON renewal_notifications(sent_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_notifications ENABLE ROW LEVEL SECURITY;

-- Compliance documents: Org members can manage their own docs
CREATE POLICY "Users can manage their org compliance docs" ON compliance_documents FOR ALL 
  USING (org_id = auth.uid() OR org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Renewal notifications: Users can view notifications for their docs
CREATE POLICY "Users can view their renewal notifications" ON renewal_notifications FOR SELECT
  USING (document_id IN (
    SELECT id FROM compliance_documents WHERE org_id = auth.uid()
  ));

-- ============================================
-- HELPER FUNCTION: Update document status based on expiry
-- ============================================
CREATE OR REPLACE FUNCTION update_compliance_document_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update status based on days until expiry
  IF NEW.expires_at < NOW() THEN
    NEW.status := 'expired';
  ELSIF NEW.expires_at < NOW() + INTERVAL '30 days' THEN
    NEW.status := 'expiring_soon';
  ELSE
    NEW.status := 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update status on insert/update
CREATE TRIGGER compliance_document_status_trigger
  BEFORE INSERT OR UPDATE ON compliance_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_document_status();

-- ============================================
-- CRON JOB SUPPORT: Function to get documents needing notification
-- ============================================
CREATE OR REPLACE FUNCTION get_documents_needing_notification(target_days INTEGER)
RETURNS TABLE (
  doc_id UUID,
  org_id UUID,
  document_type TEXT,
  title TEXT,
  jurisdiction TEXT,
  expires_at TIMESTAMPTZ,
  days_until_expiry INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cd.id as doc_id,
    cd.org_id,
    cd.document_type,
    cd.title,
    cd.jurisdiction,
    cd.expires_at,
    EXTRACT(DAY FROM cd.expires_at - NOW())::INTEGER as days_until_expiry
  FROM compliance_documents cd
  WHERE 
    -- Check expiry window (allow 1 day tolerance)
    cd.expires_at >= NOW() + (target_days - 1) * INTERVAL '1 day'
    AND cd.expires_at < NOW() + (target_days + 1) * INTERVAL '1 day'
    -- Not already renewed
    AND cd.status != 'renewed'
    -- Not already notified for this tier
    AND NOT EXISTS (
      SELECT 1 FROM renewal_notifications rn 
      WHERE rn.document_id = cd.id 
      AND rn.notification_type = 'day_' || target_days::TEXT
    );
END;
$$ LANGUAGE plpgsql;
