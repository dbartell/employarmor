-- Notification preferences per user per org
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Admin notifications
  training_completed boolean NOT NULL DEFAULT true,
  disclosure_signed boolean NOT NULL DEFAULT true,
  tool_request_submitted boolean NOT NULL DEFAULT true,
  employee_joined boolean NOT NULL DEFAULT true,
  compliance_score_alert boolean NOT NULL DEFAULT true,
  -- Employee notifications
  training_assigned boolean NOT NULL DEFAULT true,
  training_reminder boolean NOT NULL DEFAULT true,
  tool_request_decided boolean NOT NULL DEFAULT true,
  disclosure_assigned boolean NOT NULL DEFAULT true,
  -- System
  renewal_reminders boolean NOT NULL DEFAULT true,
  drip_emails boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notification_preferences_select" ON notification_preferences;
CREATE POLICY "notification_preferences_select" ON notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_preferences_insert" ON notification_preferences;
CREATE POLICY "notification_preferences_insert" ON notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_preferences_update" ON notification_preferences;
CREATE POLICY "notification_preferences_update" ON notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notification_preferences_delete" ON notification_preferences;
CREATE POLICY "notification_preferences_delete" ON notification_preferences
  FOR DELETE USING (auth.uid() = user_id);
