-- Handbook policies table for AI use policy addendum
CREATE TABLE IF NOT EXISTS handbook_policies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  generated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  added_to_handbook boolean NOT NULL DEFAULT false,
  UNIQUE(org_id)
);

ALTER TABLE handbook_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own handbook policies"
  ON handbook_policies FOR ALL
  USING (auth.uid() = org_id)
  WITH CHECK (auth.uid() = org_id);
