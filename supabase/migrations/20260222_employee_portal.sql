-- Employee Portal Phase 1 Migration
-- Creates multi-user support with roles, invites, and employee features

-- Employee profiles (extends auth.users)
create table if not exists employee_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  email text not null,
  role text not null default 'employee' check (role in ('owner', 'admin', 'manager', 'employee')),
  department text,
  manager_id uuid references employee_profiles(id),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, organization_id)
);

-- Invite tokens for employee onboarding
create table if not exists employee_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  email text not null,
  role text not null default 'employee' check (role in ('admin', 'manager', 'employee')),
  department text,
  token text unique not null,
  invited_by uuid references auth.users(id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  employee_profile_id uuid references employee_profiles(id),
  created_at timestamptz default now()
);

-- Tool access requests
create table if not exists tool_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  employee_id uuid references employee_profiles(id) on delete cascade,
  tool_name text not null,
  tool_url text,
  use_case text not null,
  data_types text[],
  status text default 'pending' check (status in ('pending', 'approved', 'denied', 'revoked')),
  reviewed_by uuid references employee_profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Disclosure acknowledgments
create table if not exists disclosure_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  employee_id uuid references employee_profiles(id) on delete cascade,
  document_id uuid,
  document_title text,
  signature_text text not null,
  signed_at timestamptz default now(),
  ip_address text,
  user_agent text
);

-- Training assignments
create table if not exists training_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  employee_id uuid references employee_profiles(id) on delete cascade,
  training_module_id uuid,
  training_title text,
  status text default 'assigned' check (status in ('assigned', 'in_progress', 'completed', 'overdue')),
  assigned_at timestamptz default now(),
  due_date timestamptz,
  completed_at timestamptz,
  score integer
);

-- Indexes for performance
create index if not exists idx_employee_profiles_user_org on employee_profiles(user_id, organization_id);
create index if not exists idx_employee_profiles_org on employee_profiles(organization_id);
create index if not exists idx_employee_invites_token on employee_invites(token);
create index if not exists idx_employee_invites_email on employee_invites(email);
create index if not exists idx_tool_requests_org on tool_requests(organization_id);
create index if not exists idx_tool_requests_employee on tool_requests(employee_id);
create index if not exists idx_disclosure_acks_employee on disclosure_acknowledgments(employee_id);
create index if not exists idx_training_assignments_employee on training_assignments(employee_id);

-- RLS Policies

-- Employee profiles: employees see their own org, admins see all in org
alter table employee_profiles enable row level security;

create policy "Employees can view profiles in their org"
  on employee_profiles for select
  using (
    organization_id in (
      select organization_id from employee_profiles where user_id = auth.uid()
    )
  );

create policy "Admins can insert employee profiles"
  on employee_profiles for insert
  with check (
    exists (
      select 1 from employee_profiles
      where user_id = auth.uid()
        and organization_id = employee_profiles.organization_id
        and role in ('owner', 'admin')
    )
    or user_id = auth.uid() -- Allow self-creation on invite acceptance
  );

create policy "Admins can update employee profiles"
  on employee_profiles for update
  using (
    exists (
      select 1 from employee_profiles ep
      where ep.user_id = auth.uid()
        and ep.organization_id = employee_profiles.organization_id
        and ep.role in ('owner', 'admin')
    )
  );

create policy "Admins can delete employee profiles"
  on employee_profiles for delete
  using (
    exists (
      select 1 from employee_profiles ep
      where ep.user_id = auth.uid()
        and ep.organization_id = employee_profiles.organization_id
        and ep.role in ('owner', 'admin')
    )
  );

-- Employee invites: only admins can manage
alter table employee_invites enable row level security;

create policy "Admins can manage invites"
  on employee_invites for all
  using (
    exists (
      select 1 from employee_profiles
      where user_id = auth.uid()
        and organization_id = employee_invites.organization_id
        and role in ('owner', 'admin')
    )
  );

create policy "Anyone can view valid invite by token"
  on employee_invites for select
  using (true); -- Token validation happens in application logic

-- Tool requests: employees see their own, admins see all in org
alter table tool_requests enable row level security;

create policy "Employees can view their own tool requests"
  on tool_requests for select
  using (
    employee_id in (
      select id from employee_profiles where user_id = auth.uid()
    )
    or exists (
      select 1 from employee_profiles
      where user_id = auth.uid()
        and organization_id = tool_requests.organization_id
        and role in ('owner', 'admin', 'manager')
    )
  );

create policy "Employees can create tool requests"
  on tool_requests for insert
  with check (
    employee_id in (
      select id from employee_profiles where user_id = auth.uid()
    )
  );

create policy "Admins can update tool requests"
  on tool_requests for update
  using (
    exists (
      select 1 from employee_profiles
      where user_id = auth.uid()
        and organization_id = tool_requests.organization_id
        and role in ('owner', 'admin', 'manager')
    )
  );

-- Disclosure acknowledgments: employees see their own, admins see all
alter table disclosure_acknowledgments enable row level security;

create policy "Employees can view their own acknowledgments"
  on disclosure_acknowledgments for select
  using (
    employee_id in (
      select id from employee_profiles where user_id = auth.uid()
    )
    or exists (
      select 1 from employee_profiles
      where user_id = auth.uid()
        and organization_id = disclosure_acknowledgments.organization_id
        and role in ('owner', 'admin', 'manager')
    )
  );

create policy "Employees can create acknowledgments"
  on disclosure_acknowledgments for insert
  with check (
    employee_id in (
      select id from employee_profiles where user_id = auth.uid()
    )
  );

-- Training assignments: employees see their own, admins see all
alter table training_assignments enable row level security;

create policy "Employees can view their own assignments"
  on training_assignments for select
  using (
    employee_id in (
      select id from employee_profiles where user_id = auth.uid()
    )
    or exists (
      select 1 from employee_profiles
      where user_id = auth.uid()
        and organization_id = training_assignments.organization_id
        and role in ('owner', 'admin', 'manager')
    )
  );

create policy "Employees can update their own assignments"
  on training_assignments for update
  using (
    employee_id in (
      select id from employee_profiles where user_id = auth.uid()
    )
  );

create policy "Admins can manage training assignments"
  on training_assignments for all
  using (
    exists (
      select 1 from employee_profiles
      where user_id = auth.uid()
        and organization_id = training_assignments.organization_id
        and role in ('owner', 'admin', 'manager')
    )
  );
