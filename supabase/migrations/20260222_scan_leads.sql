-- Create scan_leads table for public compliance scan lead magnet
create table if not exists scan_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  states text[] not null,
  employee_count text,
  tools text[],
  risk_score text,
  gaps jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table scan_leads enable row level security;

-- Public insert policy - anyone can submit a scan
create policy "Anyone can insert scan leads"
  on scan_leads
  for insert
  with check (true);

-- Authenticated users can read - for admin/analytics
create policy "Authenticated users can read scan leads"
  on scan_leads
  for select
  using (auth.role() = 'authenticated');

-- Create index on email for lookups
create index if not exists idx_scan_leads_email on scan_leads(email);

-- Create index on created_at for sorting
create index if not exists idx_scan_leads_created_at on scan_leads(created_at desc);
