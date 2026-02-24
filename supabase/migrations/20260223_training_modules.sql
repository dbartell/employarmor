-- Training Modules Migration
-- Creates comprehensive training module system with enrollments and invitations

-- Training modules table (system-wide training content)
create table if not exists training_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  audience text[] not null default '{}',
  icon text not null default 'GraduationCap',
  duration_minutes integer not null,
  lesson_count integer not null,
  content jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- Training enrollments (tracking individual progress)
create table if not exists training_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  org_id uuid references organizations(id) on delete cascade,
  module_id uuid references training_modules(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed', 'expired')),
  progress integer default 0,
  started_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  assigned_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(user_id, module_id)
);

-- Training invitations (for email-based assignment)
create table if not exists training_invitations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  invited_by uuid references auth.users(id),
  invited_email text not null,
  module_id uuid references training_modules(id) on delete cascade,
  sent_at timestamptz default now(),
  accepted_at timestamptz
);

-- Indexes for performance
create index if not exists idx_training_enrollments_user on training_enrollments(user_id);
create index if not exists idx_training_enrollments_org on training_enrollments(org_id);
create index if not exists idx_training_enrollments_module on training_enrollments(module_id);
create index if not exists idx_training_enrollments_status on training_enrollments(status);
create index if not exists idx_training_invitations_email on training_invitations(invited_email);
create index if not exists idx_training_invitations_org on training_invitations(org_id);

-- RLS Policies

-- Training modules: readable by all authenticated users
alter table training_modules enable row level security;

create policy "Anyone authenticated can view training modules"
  on training_modules for select
  using (auth.uid() is not null);

-- Training enrollments: users see their own, admins see all in org
alter table training_enrollments enable row level security;

create policy "Users can view their own enrollments"
  on training_enrollments for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from organizations o
      join profiles p on p.organization_id = o.id
      where o.id = training_enrollments.org_id
        and p.user_id = auth.uid()
        and p.role in ('owner', 'admin')
    )
  );

create policy "Admins can create enrollments"
  on training_enrollments for insert
  with check (
    exists (
      select 1 from organizations o
      join profiles p on p.organization_id = o.id
      where o.id = org_id
        and p.user_id = auth.uid()
        and p.role in ('owner', 'admin')
    )
  );

create policy "Users can update their own enrollments"
  on training_enrollments for update
  using (user_id = auth.uid());

create policy "Admins can update enrollments in their org"
  on training_enrollments for update
  using (
    exists (
      select 1 from organizations o
      join profiles p on p.organization_id = o.id
      where o.id = training_enrollments.org_id
        and p.user_id = auth.uid()
        and p.role in ('owner', 'admin')
    )
  );

create policy "Admins can delete enrollments in their org"
  on training_enrollments for delete
  using (
    exists (
      select 1 from organizations o
      join profiles p on p.organization_id = o.id
      where o.id = training_enrollments.org_id
        and p.user_id = auth.uid()
        and p.role in ('owner', 'admin')
    )
  );

-- Training invitations: admins only
alter table training_invitations enable row level security;

create policy "Admins can manage invitations in their org"
  on training_invitations for all
  using (
    exists (
      select 1 from organizations o
      join profiles p on p.organization_id = o.id
      where o.id = training_invitations.org_id
        and p.user_id = auth.uid()
        and p.role in ('owner', 'admin')
    )
  );

-- Seed training modules
insert into training_modules (id, title, description, audience, icon, duration_minutes, lesson_count, content, sort_order) values
(
  'c0a80121-0000-0000-0000-000000000001',
  'AI Hiring Compliance Essentials',
  'Learn what AI in hiring means, your employee rights, and company obligations under new laws.',
  array['all_employees'],
  'Shield',
  10,
  4,
  '[
    {
      "title": "What is AI in Hiring?",
      "type": "lesson",
      "duration": 3,
      "content": "AI in hiring includes resume screening, video interview analysis, skills assessments, and any automated tool that helps make hiring decisions. Even simple keyword filters count as AI under new regulations."
    },
    {
      "title": "Your Rights as an Employee",
      "type": "lesson",
      "duration": 2,
      "content": "You have the right to know when AI is used in hiring decisions, request human review, and understand how AI affects your employment. Some states require companies to provide alternatives to AI screening."
    },
    {
      "title": "Company Obligations",
      "type": "lesson",
      "duration": 3,
      "content": "Companies must disclose AI use to candidates and employees, conduct bias audits, maintain documentation, and ensure AI tools comply with state-specific laws like NYC Local Law 144 and Illinois HB 3773."
    },
    {
      "title": "Knowledge Check",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "Which of these counts as AI in hiring?",
          "options": ["Resume keyword filtering", "Video interview analysis", "Skills assessments", "All of the above"],
          "correctAnswer": 3
        },
        {
          "question": "What must companies do before using AI in hiring?",
          "options": ["Get employee permission", "Disclose AI use to candidates", "Stop using AI entirely", "Nothing special"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  1
),
(
  'c0a80121-0000-0000-0000-000000000002',
  'Hiring Manager Certification',
  'Tool-specific compliance training covering disclosure requirements and when to escalate.',
  array['hiring_managers', 'recruiters'],
  'Users',
  20,
  6,
  '[
    {
      "title": "Your Role & Responsibilities",
      "type": "lesson",
      "duration": 3,
      "content": "As a hiring manager, you are the frontline of compliance. You must understand which tools use AI, ensure candidates receive proper disclosures, and know when to escalate concerns to HR or legal."
    },
    {
      "title": "Tool-Specific Compliance",
      "type": "lesson",
      "duration": 4,
      "content": "Each AI hiring tool has specific compliance requirements. Greenhouse, Lever, and Workday require different disclosures. Video interview platforms like HireVue need bias audit documentation. Skills assessments must be validated."
    },
    {
      "title": "Disclosure Requirements",
      "type": "lesson",
      "duration": 3,
      "content": "Disclosures must be provided before AI processing begins, written in plain language, and specify which AI tools are used. For NYC employers, additional notification about bias audits is required."
    },
    {
      "title": "When to Escalate",
      "type": "lesson",
      "duration": 3,
      "content": "Escalate to HR/legal when: a candidate requests human review, you suspect AI bias, a new tool is introduced, or you receive regulatory inquiries. Document all escalations."
    },
    {
      "title": "Real-World Scenarios",
      "type": "lesson",
      "duration": 5,
      "content": "Practice scenarios: handling candidate opt-out requests, responding to bias complaints, integrating new AI tools, and managing multi-state hiring compliance."
    },
    {
      "title": "Certification Quiz",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "When must you provide AI disclosure to candidates?",
          "options": ["After interview", "Before AI processing", "Only if asked", "Never"],
          "correctAnswer": 1
        },
        {
          "question": "What should you do if a candidate requests human review?",
          "options": ["Ignore it", "Escalate to HR", "Reject them", "Use AI anyway"],
          "correctAnswer": 1
        },
        {
          "question": "Which requires a bias audit in NYC?",
          "options": ["Any AI hiring tool", "Only resume screeners", "Video interviews only", "None"],
          "correctAnswer": 0
        }
      ]
    }
  ]'::jsonb,
  2
),
(
  'c0a80121-0000-0000-0000-000000000003',
  'HR & Compliance Deep Dive',
  'State-by-state requirements, bias audit process, documentation standards, and enforcement risks.',
  array['hr_directors', 'compliance_officers'],
  'BookOpen',
  30,
  8,
  '[
    {
      "title": "Regulatory Landscape Overview",
      "type": "lesson",
      "duration": 4,
      "content": "AI hiring laws vary dramatically by state. NYC Local Law 144 requires annual bias audits. Illinois HB 3773 mandates disclosure and alternatives. Colorado focuses on risk assessments. California is developing its own framework."
    },
    {
      "title": "State-by-State Requirements",
      "type": "lesson",
      "duration": 5,
      "content": "Detailed breakdown: NYC (bias audits + disclosure), Illinois (notice + alternatives), Colorado (impact assessments), Maryland (consent requirements), California (proposed regulations). Multi-state employers must comply with all applicable laws."
    },
    {
      "title": "Bias Audit Process",
      "type": "lesson",
      "duration": 4,
      "content": "Annual bias audits must test for disparate impact across protected classes. Requires independent auditor, statistical analysis of hiring outcomes, public disclosure of results, and remediation plan for identified biases."
    },
    {
      "title": "Documentation Requirements",
      "type": "lesson",
      "duration": 3,
      "content": "Maintain records of: AI tool vendors and contracts, bias audit results, candidate disclosures, opt-out requests, human review processes, and training completion. Retention period: 3-7 years depending on state."
    },
    {
      "title": "Vendor Management",
      "type": "lesson",
      "duration": 3,
      "content": "Vet AI vendors for compliance capabilities. Require contractual guarantees for bias audits, data privacy, and regulatory updates. Establish vendor audit rights and liability provisions."
    },
    {
      "title": "Enforcement & Penalties",
      "type": "lesson",
      "duration": 3,
      "content": "NYC fines: $500-$1,500 per violation. Illinois: private right of action. Federal EEOC investigations possible. Reputational damage and class action risk. Recent enforcement trends and case studies."
    },
    {
      "title": "Building a Compliance Program",
      "type": "lesson",
      "duration": 5,
      "content": "Step-by-step guide to building an AI hiring compliance program: tool inventory, risk assessment, policy development, training rollout, monitoring systems, and continuous improvement."
    },
    {
      "title": "Advanced Certification Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "How often must NYC employers conduct bias audits?",
          "options": ["Monthly", "Quarterly", "Annually", "Every 3 years"],
          "correctAnswer": 2
        },
        {
          "question": "Which state requires offering alternatives to AI screening?",
          "options": ["New York", "Illinois", "Colorado", "California"],
          "correctAnswer": 1
        },
        {
          "question": "What is the primary goal of bias audits?",
          "options": ["Reduce costs", "Identify disparate impact", "Speed up hiring", "Replace HR staff"],
          "correctAnswer": 1
        },
        {
          "question": "How long should AI hiring records be retained?",
          "options": ["1 year", "3-7 years", "Forever", "No requirement"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  3
),
(
  'c0a80121-0000-0000-0000-000000000004',
  'Candidate Disclosure Training',
  'Learn how to deliver AI notices, handle consent requirements, and manage candidate opt-outs.',
  array['recruiters', 'talent_acquisition'],
  'Mail',
  10,
  4,
  '[
    {
      "title": "Disclosure Timing & Delivery",
      "type": "lesson",
      "duration": 3,
      "content": "Provide AI disclosures before processing begins—not after the fact. Delivery methods: job postings, application forms, email notifications, or in-person notices. Make them conspicuous and easy to understand."
    },
    {
      "title": "What to Include in Disclosures",
      "type": "lesson",
      "duration": 2,
      "content": "Required elements: which AI tools are used, how they affect decisions, candidate rights (human review, opt-out), contact for questions. Avoid legal jargon—use plain language that a high school student could understand."
    },
    {
      "title": "Handling Opt-Out Requests",
      "type": "lesson",
      "duration": 3,
      "content": "When a candidate opts out: document the request, provide alternative screening method, ensure no retaliation, and complete the process manually. Never penalize candidates for exercising their rights."
    },
    {
      "title": "Scenario Practice",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "When should you provide AI disclosure?",
          "options": ["After hiring decision", "Before AI processing", "Only if candidate asks", "Never"],
          "correctAnswer": 1
        },
        {
          "question": "A candidate opts out of video AI analysis. What do you do?",
          "options": ["Reject them", "Offer live interview", "Ignore request", "Use AI anyway"],
          "correctAnswer": 1
        },
        {
          "question": "What language should disclosures use?",
          "options": ["Legal terminology", "Plain language", "Technical jargon", "Company acronyms"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  4
),
(
  'c0a80121-0000-0000-0000-000000000005',
  'Executive Briefing: AI Hiring Risk',
  'Board-level overview of liability, penalties, and strategic compliance considerations.',
  array['c_suite', 'legal'],
  'AlertTriangle',
  5,
  3,
  '[
    {
      "title": "Liability Landscape",
      "type": "lesson",
      "duration": 2,
      "content": "AI hiring creates new liability vectors: discrimination claims, privacy violations, regulatory fines, and reputational damage. The C-suite and board bear fiduciary responsibility for compliance oversight."
    },
    {
      "title": "Financial & Regulatory Penalties",
      "type": "lesson",
      "duration": 2,
      "content": "Direct costs: $500-$1,500 per violation (NYC), state fines, EEOC penalties. Indirect costs: class action settlements ($millions), legal fees, brand damage, talent acquisition impact. Recent case studies show settlements reaching 7-8 figures."
    },
    {
      "title": "Strategic Recommendations",
      "type": "lesson",
      "duration": 1,
      "content": "Board actions: 1) Ensure compliance program exists, 2) Review AI vendor contracts, 3) Allocate budget for audits and training, 4) Establish oversight committee, 5) Add AI hiring to enterprise risk register. Make this a standing agenda item."
    }
  ]'::jsonb,
  5
);
