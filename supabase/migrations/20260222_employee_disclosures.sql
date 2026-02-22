CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'employee',
  token UUID DEFAULT gen_random_uuid() UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, email)
);

CREATE TABLE IF NOT EXISTS employee_disclosures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  org_id UUID NOT NULL,
  disclosure_type TEXT NOT NULL DEFAULT 'ai_tool_use',
  status TEXT NOT NULL DEFAULT 'not_sent',
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signature_text TEXT,
  ip_address TEXT,
  user_agent TEXT,
  opted_out_tools JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_employees_org ON employees(org_id);
CREATE INDEX idx_employees_token ON employees(token);
CREATE INDEX idx_employee_disclosures_org ON employee_disclosures(org_id);
CREATE INDEX idx_employee_disclosures_employee ON employee_disclosures(employee_id);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_disclosures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their org employees" ON employees FOR ALL USING (org_id = auth.uid());
CREATE POLICY "Users can view their org disclosures" ON employee_disclosures FOR ALL USING (org_id = auth.uid());
