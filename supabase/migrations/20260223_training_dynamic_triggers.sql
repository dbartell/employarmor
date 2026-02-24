-- Training Modules: Dynamic Triggers & Expanded Catalog
-- Extends training system with state/tool/industry-based triggering

-- Add new columns to training_modules
alter table training_modules 
  add column if not exists trigger_type text default 'core' 
    check (trigger_type in ('core', 'state', 'tool', 'industry', 'size')),
  add column if not exists trigger_value text,
  add column if not exists tier integer default 1 check (tier between 1 and 5),
  add column if not exists requires_acknowledgment boolean default true,
  add column if not exists certification_valid_days integer default 365;

-- Create training_acknowledgments table
create table if not exists training_acknowledgments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references training_enrollments(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  acknowledged_at timestamptz default now(),
  ip_address text,
  acknowledgment_text text not null,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_training_modules_trigger on training_modules(trigger_type, trigger_value);
create index if not exists idx_training_acknowledgments_enrollment on training_acknowledgments(enrollment_id);
create index if not exists idx_training_acknowledgments_user on training_acknowledgments(user_id);

-- RLS Policies for acknowledgments
alter table training_acknowledgments enable row level security;

create policy "Users can view their own acknowledgments"
  on training_acknowledgments for select
  using (user_id = auth.uid());

create policy "Users can create their own acknowledgments"
  on training_acknowledgments for insert
  with check (user_id = auth.uid());

create policy "Admins can view org acknowledgments"
  on training_acknowledgments for select
  using (
    exists (
      select 1 from training_enrollments te
      join organizations o on o.id = te.org_id
      join profiles p on p.organization_id = o.id
      where te.id = training_acknowledgments.enrollment_id
        and p.user_id = auth.uid()
        and p.role in ('owner', 'admin')
    )
  );

-- Update existing modules to have tier=1 and trigger_type='core'
update training_modules 
set tier = 1, trigger_type = 'core', trigger_value = null
where tier is null;

-- Insert new Tier 1 Core modules (adding to existing 5)
insert into training_modules (id, title, description, audience, icon, duration_minutes, lesson_count, content, sort_order, tier, trigger_type, requires_acknowledgment) values
(
  'c0a80121-0000-0000-0000-000000000006',
  'Incident Response & Reporting',
  'Learn proper procedures for reporting workplace incidents, discrimination complaints, and compliance violations.',
  array['all_employees'],
  'AlertTriangle',
  10,
  3,
  '[
    {
      "title": "Recognizing Reportable Incidents",
      "type": "lesson",
      "duration": 3,
      "content": "Understand what constitutes a reportable incident: discrimination, harassment, retaliation, safety violations, data breaches, and compliance concerns. When in doubt, report it—better to over-report than miss a critical issue."
    },
    {
      "title": "How to Report Safely",
      "type": "lesson",
      "duration": 4,
      "content": "Multiple reporting channels: direct supervisor, HR hotline, anonymous reporting portal, or legal compliance officer. Choose the channel you trust most. Document the incident with dates, witnesses, and specific details. Your identity is protected under anti-retaliation laws."
    },
    {
      "title": "What Happens After You Report",
      "type": "lesson",
      "duration": 3,
      "content": "Investigation process: acknowledgment within 24-48 hours, confidential investigation, witness interviews, resolution timeline (typically 10-30 days), and outcome notification. You are legally protected from retaliation throughout this process."
    }
  ]'::jsonb,
  6,
  1,
  'core',
  true
),
(
  'c0a80121-0000-0000-0000-000000000007',
  'Data Privacy & AI Ethics',
  'Understand employee data rights, AI ethics principles, and your role in protecting candidate and employee privacy.',
  array['all_employees'],
  'Shield',
  15,
  4,
  '[
    {
      "title": "Your Data Rights",
      "type": "lesson",
      "duration": 3,
      "content": "Under GDPR, CCPA, and state privacy laws, you have the right to know what data is collected, how it is used, request deletion, and opt-out of certain processing. Employee data includes: performance reviews, biometric data, location tracking, and communication monitoring."
    },
    {
      "title": "AI Ethics in the Workplace",
      "type": "lesson",
      "duration": 4,
      "content": "AI ethics principles: fairness (no bias), transparency (explainable decisions), accountability (human oversight), privacy (data minimization), and safety (prevent harm). AI should augment human decisions, not replace human judgment entirely."
    },
    {
      "title": "Protecting Candidate Privacy",
      "type": "lesson",
      "duration": 4,
      "content": "Candidate data is sensitive: minimize collection to job-relevant info, secure storage with encryption, limit access to need-to-know basis, delete data after retention period, and never share candidate data with unauthorized third parties."
    },
    {
      "title": "Scenario Quiz",
      "type": "quiz",
      "duration": 4,
      "questions": [
        {
          "question": "What should you do if you discover candidate data exposed in a public folder?",
          "options": ["Ignore it", "Report to IT/HR immediately", "Move it yourself", "Email candidates"],
          "correctAnswer": 1
        },
        {
          "question": "Which principle requires AI decisions to be explainable?",
          "options": ["Fairness", "Transparency", "Privacy", "Safety"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  7,
  1,
  'core',
  true
),
(
  'c0a80121-0000-0000-0000-000000000008',
  'Anti-Retaliation Awareness',
  'Recognize, prevent, and respond to retaliation. Protect yourself and your team members who report concerns.',
  array['managers', 'hiring_managers'],
  'Shield',
  10,
  3,
  '[
    {
      "title": "What is Retaliation?",
      "type": "lesson",
      "duration": 3,
      "content": "Retaliation is any adverse action taken against an employee for engaging in protected activity: reporting discrimination, filing a complaint, participating in an investigation, or refusing an illegal order. Examples: demotion, termination, schedule changes, exclusion from projects, negative reviews."
    },
    {
      "title": "Your Legal Obligations",
      "type": "lesson",
      "duration": 4,
      "content": "As a manager, you MUST NOT retaliate and must prevent others from retaliating. Document performance issues objectively before any complaint arises. Treat employees consistently. Never reference their protected activity in performance discussions. Legal exposure: Title VII, whistleblower laws, state protections."
    },
    {
      "title": "Creating a Safe Reporting Culture",
      "type": "lesson",
      "duration": 3,
      "content": "Encourage reporting: publicly support those who raise concerns, thank them for speaking up, ensure confidentiality, investigate promptly, communicate outcomes, and follow up to ensure no retaliation occurred. A culture of safety reduces liability and improves retention."
    }
  ]'::jsonb,
  8,
  1,
  'core',
  true
);

-- Tier 2: State-Triggered Modules
insert into training_modules (id, title, description, audience, icon, duration_minutes, lesson_count, content, sort_order, tier, trigger_type, trigger_value, requires_acknowledgment) values
(
  'c0a80121-0000-0000-0000-000000000101',
  'Illinois HB 3773 Compliance',
  'Illinois AI in hiring law: disclosure requirements, candidate rights to alternatives, and employer obligations.',
  array['hiring_managers', 'recruiters', 'hr_directors'],
  'BookOpen',
  15,
  5,
  '[
    {
      "title": "Illinois HB 3773 Overview",
      "type": "lesson",
      "duration": 3,
      "content": "Effective January 1, 2026, Illinois requires employers to notify candidates when AI is used in hiring decisions. Candidates must be informed of data collection, AI analysis methods, and their right to request alternative evaluation methods."
    },
    {
      "title": "Disclosure Requirements",
      "type": "lesson",
      "duration": 3,
      "content": "Required disclosures: type of AI tool, data being analyzed, how AI affects hiring decisions. Timing: BEFORE AI processing begins. Format: written notice, plain language, conspicuous placement. Failure to disclose: $500-$5,000 per violation."
    },
    {
      "title": "Candidate Right to Alternatives",
      "type": "lesson",
      "duration": 3,
      "content": "Unique to Illinois: candidates can request alternative evaluation methods that do not involve AI. You must provide: live interview, traditional resume review, or other non-AI screening. Cannot penalize candidates for opting out."
    },
    {
      "title": "Documentation & Compliance",
      "type": "lesson",
      "duration": 3,
      "content": "Maintain records: disclosure delivery confirmations, opt-out requests, alternative evaluation documentation. Retention: 3 years. Regular compliance audits recommended. Train all hiring personnel before implementation."
    },
    {
      "title": "Illinois Compliance Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "When must you provide AI disclosure to Illinois candidates?",
          "options": ["After interview", "Before AI processing", "Only if they ask", "Within 30 days"],
          "correctAnswer": 1
        },
        {
          "question": "What is unique about Illinois law?",
          "options": ["Requires bias audits", "Offers alternative evaluation methods", "Bans AI entirely", "No penalties"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  101,
  2,
  'state',
  'IL',
  true
),
(
  'c0a80121-0000-0000-0000-000000000102',
  'NYC Local Law 144 Compliance',
  'New York City AI hiring law: annual bias audits, public disclosure, and notice requirements.',
  array['hiring_managers', 'recruiters', 'hr_directors', 'compliance_officers'],
  'BookOpen',
  15,
  5,
  '[
    {
      "title": "Local Law 144 Overview",
      "type": "lesson",
      "duration": 3,
      "content": "NYC Local Law 144 (effective July 2023) regulates automated employment decision tools (AEDT). Requires annual bias audits, candidate notification, and public disclosure of audit results. Applies to all NYC employers and those hiring NYC residents."
    },
    {
      "title": "Bias Audit Requirements",
      "type": "lesson",
      "duration": 4,
      "content": "Annual independent bias audit required: test for disparate impact across race, ethnicity, and sex. Auditor must analyze selection rates, calculate impact ratios, and identify statistically significant disparities. Results published on company website."
    },
    {
      "title": "Candidate Notice Requirements",
      "type": "lesson",
      "duration": 3,
      "content": "At least 10 business days before using AEDT, notify candidates: the job title, employer use of AEDT, data retention policy, and where to find audit results. Failure to notify: $500-$1,500 per violation."
    },
    {
      "title": "Public Disclosure Obligations",
      "type": "lesson",
      "duration": 3,
      "content": "Publish audit summary on website: date of audit, selection rates by category, impact ratios, and auditor information. Must be publicly accessible for at least 6 months after audit date. Link to disclosure in job postings."
    },
    {
      "title": "NYC Compliance Quiz",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "How often must NYC employers conduct bias audits?",
          "options": ["Monthly", "Quarterly", "Annually", "Every 3 years"],
          "correctAnswer": 2
        },
        {
          "question": "How many days notice must candidates receive?",
          "options": ["5 days", "10 days", "30 days", "No requirement"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  102,
  2,
  'state',
  'NY',
  true
),
(
  'c0a80121-0000-0000-0000-000000000103',
  'Colorado AI Act Compliance',
  'Colorado SB 24-205: AI system impact assessments, transparency, and consumer protection.',
  array['hr_directors', 'compliance_officers', 'legal'],
  'BookOpen',
  15,
  5,
  '[
    {
      "title": "Colorado AI Act Overview",
      "type": "lesson",
      "duration": 3,
      "content": "Colorado SB 24-205 (effective February 2026) regulates high-risk AI systems, including employment decision tools. Requires risk assessments, algorithmic transparency, and consumer notification. Enforced by Colorado Attorney General."
    },
    {
      "title": "High-Risk AI Definition",
      "type": "lesson",
      "duration": 3,
      "content": "High-risk AI in employment: systems that make or substantially assist in hiring, promotion, termination, or compensation decisions. Includes: resume screeners, video interview analysis, skills assessments, and performance prediction models."
    },
    {
      "title": "Impact Assessment Requirements",
      "type": "lesson",
      "duration": 4,
      "content": "Annual impact assessment required: purpose of AI system, intended benefits, known risks, mitigation measures, and data sources. Must evaluate for bias, discrimination, and disparate impact. Document safeguards and human oversight mechanisms."
    },
    {
      "title": "Transparency & Disclosure",
      "type": "lesson",
      "duration": 3,
      "content": "Disclose to candidates: AI system use, type of data processed, right to opt-out, right to appeal adverse decisions, and contact for questions. Make impact assessment summary available upon request."
    },
    {
      "title": "Colorado Compliance Quiz",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "What must be included in an impact assessment?",
          "options": ["Only benefits", "Purpose, benefits, risks, and mitigations", "Just data sources", "Nothing required"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  103,
  2,
  'state',
  'CO',
  true
),
(
  'c0a80121-0000-0000-0000-000000000104',
  'California CCPA ADMT Compliance',
  'California AI hiring under CCPA: automated decision-making technology disclosures and data rights.',
  array['hr_directors', 'compliance_officers', 'legal'],
  'BookOpen',
  15,
  5,
  '[
    {
      "title": "CCPA & Automated Decisions",
      "type": "lesson",
      "duration": 4,
      "content": "CCPA amendments expand to automated decision-making technology (ADMT) in employment. Applicants and employees have the right to know, delete, and opt-out. Upcoming CPRA regulations will impose stricter requirements on profiling and automated decisions."
    },
    {
      "title": "Data Collection & Disclosure",
      "type": "lesson",
      "duration": 3,
      "content": "Disclose: categories of data collected, sources, business purposes, third-party sharing. For AI hiring: disclose use of algorithms, scoring models, and predictive analytics. Provide privacy notice at or before collection."
    },
    {
      "title": "Employee & Applicant Rights",
      "type": "lesson",
      "duration": 4,
      "content": "Right to know: what data is collected and how AI uses it. Right to delete: with exceptions for legal compliance. Right to opt-out: of sale or sharing of data. Right to correct: inaccurate information. Right to limit sensitive data use."
    },
    {
      "title": "Vendor Contracts & Liability",
      "type": "lesson",
      "duration": 2,
      "content": "AI vendors must sign data processing agreements (DPAs). Employers remain liable for vendor CCPA violations. Ensure vendors: process data only per instructions, maintain security, support data subject requests, and delete data upon request."
    },
    {
      "title": "CCPA Quiz",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "What is a unique CCPA right?",
          "options": ["Right to know", "Right to bias audit", "Right to alternative evaluation", "Right to free training"],
          "correctAnswer": 0
        }
      ]
    }
  ]'::jsonb,
  104,
  2,
  'state',
  'CA',
  true
),
(
  'c0a80121-0000-0000-0000-000000000105',
  'Maryland AI Hiring Law',
  'Maryland HB 1202: AI hiring disclosures, consent requirements, and enforcement mechanisms.',
  array['hiring_managers', 'recruiters', 'hr_directors'],
  'BookOpen',
  10,
  4,
  '[
    {
      "title": "Maryland AI Law Overview",
      "type": "lesson",
      "duration": 3,
      "content": "Maryland requires employers using AI in hiring to provide clear notice and obtain consent. Effective October 2024, this law emphasizes transparency and candidate control over AI-based evaluations."
    },
    {
      "title": "Notice & Consent",
      "type": "lesson",
      "duration": 3,
      "content": "Provide written notice: type of AI tool, purpose, data analyzed, and impact on hiring decisions. Obtain affirmative consent before processing. Consent must be freely given, specific, and informed—not buried in terms of service."
    },
    {
      "title": "Opt-Out & Appeals",
      "type": "lesson",
      "duration": 2,
      "content": "Candidates can withdraw consent at any time. Must provide alternative evaluation method upon opt-out. Candidates can appeal adverse AI decisions and request human review. Document all opt-outs and appeals."
    },
    {
      "title": "Maryland Compliance Quiz",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "What must Maryland employers obtain before using AI?",
          "options": ["Bias audit", "Affirmative consent", "State license", "Nothing"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  105,
  2,
  'state',
  'MD',
  true
),
(
  'c0a80121-0000-0000-0000-000000000106',
  'Texas TRAIGA Compliance',
  'Texas Responsible AI Governance Act: transparency, accountability, and best practices for AI in hiring.',
  array['hiring_managers', 'hr_directors', 'compliance_officers'],
  'BookOpen',
  10,
  4,
  '[
    {
      "title": "TRAIGA Overview",
      "type": "lesson",
      "duration": 3,
      "content": "Texas TRAIGA establishes governance framework for AI systems. Focuses on transparency, human oversight, and accountability. Applies to state contractors and employers over 100 employees using high-impact AI."
    },
    {
      "title": "Governance & Oversight",
      "type": "lesson",
      "duration": 3,
      "content": "Establish AI governance committee: cross-functional team with HR, legal, IT, and compliance. Document AI use cases, risk assessments, and mitigation strategies. Maintain human-in-the-loop for final hiring decisions."
    },
    {
      "title": "Documentation Requirements",
      "type": "lesson",
      "duration": 2,
      "content": "Maintain records: AI system specifications, training data sources, validation testing, bias testing results, and incident reports. Make documentation available to state auditors upon request."
    },
    {
      "title": "Texas Quiz",
      "type": "quiz",
      "duration": 2,
      "questions": [
        {
          "question": "Who must be involved in final hiring decisions under TRAIGA?",
          "options": ["AI only", "Human oversight required", "Legal team", "No requirement"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  106,
  2,
  'state',
  'TX',
  true
);

-- Tier 3: Tool-Triggered Modules
insert into training_modules (id, title, description, audience, icon, duration_minutes, lesson_count, content, sort_order, tier, trigger_type, trigger_value, requires_acknowledgment) values
(
  'c0a80121-0000-0000-0000-000000000201',
  'HireVue Compliance Walkthrough',
  'HireVue video interview AI: compliance obligations, bias audit requirements, and candidate disclosure.',
  array['hiring_managers', 'recruiters', 'talent_acquisition'],
  'Users',
  10,
  3,
  '[
    {
      "title": "HireVue AI Features",
      "type": "lesson",
      "duration": 3,
      "content": "HireVue uses AI to analyze: facial expressions, tone of voice, word choice, and response content. Generates candidate scores and rankings. Requires disclosure to candidates and annual bias audits in NYC and other jurisdictions."
    },
    {
      "title": "Compliance Checklist",
      "type": "lesson",
      "duration": 4,
      "content": "Before using HireVue: 1) Review vendor bias audit report, 2) Provide candidate disclosure, 3) Obtain consent where required, 4) Train interviewers on AI limitations, 5) Maintain human oversight, 6) Document opt-outs and alternative interviews."
    },
    {
      "title": "HireVue Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "What must you review before using HireVue?",
          "options": ["Nothing", "Vendor bias audit report", "Company stock price", "Job description"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  201,
  3,
  'tool',
  'hirevue',
  true
),
(
  'c0a80121-0000-0000-0000-000000000202',
  'Greenhouse AI Features & Compliance',
  'Greenhouse AI-powered sourcing and screening: setup, disclosure, and best practices.',
  array['hiring_managers', 'recruiters', 'talent_acquisition'],
  'Users',
  10,
  3,
  '[
    {
      "title": "Greenhouse AI Capabilities",
      "type": "lesson",
      "duration": 3,
      "content": "Greenhouse AI features: resume parsing, candidate matching, automated screening questions, interview scheduling automation. Some features use machine learning to rank candidates. Understand which features trigger disclosure requirements."
    },
    {
      "title": "Configuring Compliance",
      "type": "lesson",
      "duration": 4,
      "content": "Enable compliance settings: automated disclosure emails, consent tracking, bias monitoring dashboards. Customize disclosure language for your jurisdiction. Review AI scoring thresholds to prevent over-reliance on automation."
    },
    {
      "title": "Greenhouse Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "Which Greenhouse feature requires disclosure?",
          "options": ["Interview scheduling", "Candidate ranking with ML", "Email templates", "Job posting"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  202,
  3,
  'tool',
  'greenhouse',
  true
),
(
  'c0a80121-0000-0000-0000-000000000203',
  'LinkedIn Recruiter Compliance',
  'LinkedIn Recruiter AI features: search algorithms, InMail optimization, and compliance considerations.',
  array['recruiters', 'talent_acquisition'],
  'Users',
  10,
  3,
  '[
    {
      "title": "LinkedIn AI Features",
      "type": "lesson",
      "duration": 3,
      "content": "LinkedIn Recruiter uses AI for: candidate recommendations, search result ranking, InMail response prediction, and skills matching. While LinkedIn handles some compliance, employers remain responsible for disclosed use."
    },
    {
      "title": "Recruiter Best Practices",
      "type": "lesson",
      "duration": 4,
      "content": "Disclose LinkedIn AI use in initial outreach or job descriptions. Do not rely solely on LinkedIn rankings—apply human judgment. Document sourcing methodology. Avoid discriminatory search filters (age, location as proxy for protected class)."
    },
    {
      "title": "LinkedIn Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "Who is responsible for compliance when using LinkedIn Recruiter?",
          "options": ["Only LinkedIn", "The employer", "Nobody", "The candidate"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  203,
  3,
  'tool',
  'linkedin-recruiter',
  true
),
(
  'c0a80121-0000-0000-0000-000000000204',
  'Workday AI Compliance',
  'Workday HCM AI features: talent intelligence, skills matching, and compliance configuration.',
  array['hiring_managers', 'hr_directors', 'talent_acquisition'],
  'Users',
  10,
  3,
  '[
    {
      "title": "Workday AI Overview",
      "type": "lesson",
      "duration": 3,
      "content": "Workday AI features: talent recommendations, skills cloud, job fit scores, and predictive analytics. Integrated compliance tools help manage disclosures and bias monitoring across the talent lifecycle."
    },
    {
      "title": "Compliance Configuration",
      "type": "lesson",
      "duration": 4,
      "content": "Configure Workday compliance settings: enable candidate notifications, set up consent workflows, activate bias monitoring dashboards, and configure data retention policies. Review AI-driven recommendations before making final decisions."
    },
    {
      "title": "Workday Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "What should you do before relying on Workday job fit scores?",
          "options": ["Nothing", "Review with human judgment", "Ignore them", "Auto-reject low scores"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  204,
  3,
  'tool',
  'workday',
  true
),
(
  'c0a80121-0000-0000-0000-000000000205',
  'Generic ATS AI Compliance',
  'General AI compliance for applicant tracking systems: common features and universal best practices.',
  array['hiring_managers', 'recruiters', 'hr_directors'],
  'Users',
  10,
  3,
  '[
    {
      "title": "Common ATS AI Features",
      "type": "lesson",
      "duration": 3,
      "content": "Most ATS platforms include: resume parsing, keyword matching, automated screening questions, and candidate ranking. Even basic keyword filtering may be considered AI under new regulations. Understand your ATS capabilities."
    },
    {
      "title": "Universal Compliance Practices",
      "type": "lesson",
      "duration": 4,
      "content": "Regardless of ATS vendor: 1) Document AI features in use, 2) Provide candidate disclosures, 3) Maintain human oversight, 4) Review vendor contracts for compliance support, 5) Conduct periodic audits, 6) Train hiring team on limitations."
    },
    {
      "title": "ATS Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "Does basic keyword filtering count as AI?",
          "options": ["No", "Yes, under some regulations", "Only in NYC", "Only for Fortune 500"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  205,
  3,
  'tool',
  '_generic',
  true
);

-- Tier 4: Industry/Size-Triggered Modules
insert into training_modules (id, title, description, audience, icon, duration_minutes, lesson_count, content, sort_order, tier, trigger_type, trigger_value, requires_acknowledgment) values
(
  'c0a80121-0000-0000-0000-000000000301',
  'Healthcare AI Hiring & HIPAA',
  'Healthcare-specific compliance: AI in clinical hiring, HIPAA considerations, and credentialing requirements.',
  array['hiring_managers', 'hr_directors', 'compliance_officers'],
  'Shield',
  15,
  4,
  '[
    {
      "title": "Healthcare Hiring Regulations",
      "type": "lesson",
      "duration": 4,
      "content": "Healthcare hiring involves unique regulations: credentialing verification, background checks, HIPAA training requirements, and state licensing validation. AI tools must not bypass required manual verifications."
    },
    {
      "title": "HIPAA & AI Tools",
      "type": "lesson",
      "duration": 4,
      "content": "If AI tools process protected health information (PHI) during hiring (e.g., reviewing medical credentials), they must comply with HIPAA. Vendor BAAs required. Limit data collection to job-relevant information only."
    },
    {
      "title": "Clinical vs Non-Clinical Roles",
      "type": "lesson",
      "duration": 4,
      "content": "Different AI compliance for clinical vs administrative roles. Clinical roles: verify licenses, check sanctions lists, validate certifications. AI can assist but cannot replace these verifications. Document all validation steps."
    },
    {
      "title": "Healthcare Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "Can AI replace license verification for clinical roles?",
          "options": ["Yes", "No, manual verification required", "Only in emergencies", "Only with vendor guarantee"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  301,
  4,
  'industry',
  'healthcare',
  true
),
(
  'c0a80121-0000-0000-0000-000000000302',
  'Financial Services AI & FCRA',
  'Financial services hiring: AI compliance under FCRA, background check requirements, and regulatory oversight.',
  array['hiring_managers', 'hr_directors', 'compliance_officers'],
  'Shield',
  15,
  4,
  '[
    {
      "title": "FCRA & AI Hiring",
      "type": "lesson",
      "duration": 4,
      "content": "Fair Credit Reporting Act applies to AI hiring tools that use consumer reports (credit checks, background checks). Employers must: provide pre-adverse action notice, allow candidate to dispute, and provide final adverse action notice."
    },
    {
      "title": "Financial Services Regulations",
      "type": "lesson",
      "duration": 4,
      "content": "Financial institutions face heightened scrutiny: FINRA background checks, SEC registration verification, anti-money laundering checks. AI tools must support, not circumvent, these requirements. Regulatory examiners will audit hiring compliance."
    },
    {
      "title": "Credit Checks & AI",
      "type": "lesson",
      "duration": 4,
      "content": "Using credit data in AI hiring models requires FCRA compliance: obtain written consent, provide disclosure, follow adverse action procedures. Many states restrict credit checks—ensure AI does not use proxies for credit history."
    },
    {
      "title": "Finance Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "What law governs AI use of background checks?",
          "options": ["HIPAA", "FCRA", "CCPA", "GDPR"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  302,
  4,
  'industry',
  'finance',
  true
),
(
  'c0a80121-0000-0000-0000-000000000303',
  'Staffing Agency Joint-Employer Liability',
  'Staffing agencies: joint-employer liability for AI hiring, client compliance obligations, and risk mitigation.',
  array['hiring_managers', 'recruiters', 'hr_directors', 'compliance_officers'],
  'Users',
  15,
  4,
  '[
    {
      "title": "Joint-Employer Status",
      "type": "lesson",
      "duration": 4,
      "content": "Staffing agencies and client companies may both be liable for AI hiring violations. Joint-employer test: degree of control over hiring, supervision, and working conditions. Both parties must ensure AI compliance."
    },
    {
      "title": "Client Compliance Obligations",
      "type": "lesson",
      "duration": 4,
      "content": "When placing workers with clients: verify client AI compliance, confirm disclosure processes, ensure non-discriminatory job requirements, document compliance in contracts. Agency remains liable even if client controls AI tools."
    },
    {
      "title": "Risk Mitigation Strategies",
      "type": "lesson",
      "duration": 4,
      "content": "Protect your agency: contractual indemnification clauses, joint compliance audits, shared disclosure responsibilities, clear documentation of who controls AI decisions. Maintain your own compliance program regardless of client practices."
    },
    {
      "title": "Staffing Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "Who is liable for AI hiring violations at a staffing agency?",
          "options": ["Only the agency", "Only the client", "Both (joint liability)", "Nobody"],
          "correctAnswer": 2
        }
      ]
    }
  ]'::jsonb,
  303,
  4,
  'industry',
  'staffing',
  true
),
(
  'c0a80121-0000-0000-0000-000000000304',
  'EEO-1 Reporting & AI Documentation',
  'Employers with 100+ employees: EEO-1 reporting obligations and AI hiring documentation for EEOC compliance.',
  array['hr_directors', 'compliance_officers'],
  'BookOpen',
  10,
  3,
  '[
    {
      "title": "EEO-1 Reporting Basics",
      "type": "lesson",
      "duration": 3,
      "content": "Employers with 100+ employees must file annual EEO-1 reports with EEOC: workforce demographics by race, ethnicity, sex, and job category. AI hiring systems may affect these metrics. EEOC scrutinizes disparities."
    },
    {
      "title": "AI & Adverse Impact",
      "type": "lesson",
      "duration": 4,
      "content": "EEOC can investigate AI systems showing adverse impact: selection rate for protected class < 80% of highest group. Document AI validation studies, bias testing, and remediation efforts. Maintain records for EEOC audits."
    },
    {
      "title": "EEO-1 Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "What is the 80% rule?",
          "options": ["80% completion rate", "Selection rate test for adverse impact", "80% accuracy threshold", "80% of employees trained"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  304,
  4,
  'size',
  '100',
  true
);

-- Tier 5: Advanced Modules
insert into training_modules (id, title, description, audience, icon, duration_minutes, lesson_count, content, sort_order, tier, trigger_type, requires_acknowledgment) values
(
  'c0a80121-0000-0000-0000-000000000401',
  'Bias Audit Preparation',
  'Advanced training for conducting, commissioning, and interpreting bias audits for AI hiring systems.',
  array['hr_directors', 'compliance_officers'],
  'AlertTriangle',
  20,
  6,
  '[
    {
      "title": "Bias Audit Fundamentals",
      "type": "lesson",
      "duration": 3,
      "content": "Bias audits test for disparate impact: statistical analysis of hiring outcomes across protected classes (race, ethnicity, sex). Required in NYC annually. Best practice elsewhere. Independent auditor recommended."
    },
    {
      "title": "Selecting an Auditor",
      "type": "lesson",
      "duration": 3,
      "content": "Qualified auditor criteria: statistical expertise, employment law knowledge, independence from vendor, prior audit experience. Request references, sample audit reports, and methodology documentation."
    },
    {
      "title": "Audit Methodology",
      "type": "lesson",
      "duration": 4,
      "content": "Auditor will: collect hiring data (applications, interviews, offers), calculate selection rates by group, compute impact ratios, conduct statistical significance tests, identify disparities, and recommend mitigations."
    },
    {
      "title": "Interpreting Results",
      "type": "lesson",
      "duration": 3,
      "content": "Impact ratio < 0.80 suggests adverse impact. Statistical significance indicates systemic issue vs. random variation. Actionable findings: adjust AI thresholds, retrain models, increase human oversight, or discontinue problematic tools."
    },
    {
      "title": "Remediation Planning",
      "type": "lesson",
      "duration": 4,
      "content": "If bias detected: immediate mitigation (adjust thresholds, add human review), long-term fixes (retrain model, diversify training data), documentation (audit trail, corrective actions), and follow-up testing."
    },
    {
      "title": "Audit Preparation Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "What impact ratio suggests adverse impact?",
          "options": ["< 0.50", "< 0.80", "> 1.00", "< 0.95"],
          "correctAnswer": 1
        },
        {
          "question": "How often should bias audits be conducted?",
          "options": ["Never", "Only when required", "Annually (best practice)", "Every 5 years"],
          "correctAnswer": 2
        }
      ]
    }
  ]'::jsonb,
  401,
  5,
  'core',
  true
),
(
  'c0a80121-0000-0000-0000-000000000402',
  'AI Vendor Due Diligence',
  'Procurement and HR collaboration: evaluating, contracting, and monitoring AI hiring vendors for compliance.',
  array['hr_directors', 'compliance_officers'],
  'Users',
  15,
  4,
  '[
    {
      "title": "Vendor Evaluation Framework",
      "type": "lesson",
      "duration": 4,
      "content": "Evaluate vendors on: compliance capabilities (bias audits, disclosure tools), data security (encryption, access controls), transparency (explainability, documentation), support (training, updates), and liability (indemnification, insurance)."
    },
    {
      "title": "Contract Provisions",
      "type": "lesson",
      "duration": 4,
      "content": "Essential contract terms: bias audit delivery, compliance with evolving laws, data processing agreement, right to audit vendor, indemnification for violations, termination for non-compliance, and service level agreements (SLAs) for support."
    },
    {
      "title": "Ongoing Monitoring",
      "type": "lesson",
      "duration": 4,
      "content": "Post-contract monitoring: quarterly compliance reviews, bias audit updates, regulatory change notifications, incident reporting, and performance metrics. Establish vendor governance committee for oversight."
    },
    {
      "title": "Vendor Due Diligence Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "What is a critical contract provision for AI vendors?",
          "options": ["Free coffee", "Bias audit delivery commitment", "Logo usage rights", "Social media promotion"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  402,
  5,
  'core',
  true
),
(
  'c0a80121-0000-0000-0000-000000000403',
  'Scenario Simulations',
  'Interactive decision-making scenarios: practice responding to AI hiring compliance situations.',
  array['hiring_managers', 'recruiters'],
  'BookOpen',
  15,
  5,
  '[
    {
      "title": "Scenario 1: Candidate Opt-Out",
      "type": "lesson",
      "duration": 3,
      "content": "Scenario: A candidate emails saying they do not consent to AI video interview analysis. What do you do? Answer: Acknowledge immediately, offer alternative interview method (live video or phone), document the opt-out, proceed with alternative evaluation without penalty."
    },
    {
      "title": "Scenario 2: Suspected Bias",
      "type": "lesson",
      "duration": 3,
      "content": "Scenario: You notice AI consistently ranks candidates from certain schools lower. What do you do? Answer: Pause use of AI for those decisions, escalate to HR/compliance, request vendor investigation, conduct internal review, and document findings. Do not ignore."
    },
    {
      "title": "Scenario 3: Regulatory Inquiry",
      "type": "lesson",
      "duration": 3,
      "content": "Scenario: Your company receives a letter from the NYC Department of Consumer and Worker Protection about AI hiring. What do you do? Answer: Immediately notify legal and compliance, preserve all records, do not respond without legal review, gather bias audit documentation, and cooperate fully."
    },
    {
      "title": "Scenario 4: New Tool Introduction",
      "type": "lesson",
      "duration": 3,
      "content": "Scenario: Your manager wants to pilot a new AI resume screening tool next week. What do you do? Answer: Request vendor compliance documentation, review bias audit, draft candidate disclosures, train hiring team, ensure legal review, and do not launch until compliance verified."
    },
    {
      "title": "Scenario Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "Candidate opts out of AI. What do you do?",
          "options": ["Reject them", "Offer alternative evaluation", "Ignore request", "Use AI anyway"],
          "correctAnswer": 1
        },
        {
          "question": "You suspect AI bias. First step?",
          "options": ["Ignore it", "Pause AI use and escalate", "Speed up hiring", "Delete evidence"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  403,
  5,
  'core',
  true
),
(
  'c0a80121-0000-0000-0000-000000000404',
  'Compliance Documentation Workshop',
  'Hands-on training for building and maintaining AI hiring compliance documentation systems.',
  array['hr_directors', 'compliance_officers'],
  'BookOpen',
  20,
  5,
  '[
    {
      "title": "Documentation Requirements",
      "type": "lesson",
      "duration": 4,
      "content": "Required documentation: AI tool inventory, vendor contracts, bias audit reports, candidate disclosures, opt-out logs, training records, incident reports, and remediation plans. Retention: 3-7 years depending on jurisdiction."
    },
    {
      "title": "Building a Documentation System",
      "type": "lesson",
      "duration": 5,
      "content": "Documentation system components: centralized repository (cloud storage), version control, access controls (role-based), automated reminders (bias audit renewal), audit trails (who accessed what), and disaster recovery (backups)."
    },
    {
      "title": "Templates & Workflows",
      "type": "lesson",
      "duration": 4,
      "content": "Create templates for: candidate disclosure notices, opt-out forms, bias audit checklists, vendor evaluation scorecards, incident report forms, and compliance review schedules. Standardization ensures consistency."
    },
    {
      "title": "Audit Readiness",
      "type": "lesson",
      "duration": 4,
      "content": "Prepare for regulatory audits: organize documents by topic, create index/table of contents, redact confidential information, designate compliance contact, and conduct mock audits quarterly to identify gaps."
    },
    {
      "title": "Documentation Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "How long should AI hiring records be retained?",
          "options": ["1 year", "3-7 years", "Forever", "No requirement"],
          "correctAnswer": 1
        },
        {
          "question": "What is essential for audit readiness?",
          "options": ["Hiding documents", "Organized, indexed documentation", "Verbal explanations only", "Deleting old records"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  404,
  5,
  'core',
  true
),
(
  'c0a80121-0000-0000-0000-000000000405',
  'Annual Recertification',
  'Refresher course covering recent regulatory updates, emerging trends, and compliance best practices.',
  array['all_employees', 'hiring_managers', 'recruiters', 'hr_directors'],
  'RotateCcw',
  10,
  3,
  '[
    {
      "title": "What''s New This Year",
      "type": "lesson",
      "duration": 3,
      "content": "Review: new state laws enacted, updated guidance from EEOC/regulators, recent enforcement actions, vendor updates, and emerging AI technologies. Stay current with compliance landscape changes."
    },
    {
      "title": "Refresher: Key Concepts",
      "type": "lesson",
      "duration": 4,
      "content": "Reinforce core principles: disclosure obligations, bias audit requirements, candidate rights (opt-out, human review), documentation standards, and escalation procedures. Review any incidents from the past year."
    },
    {
      "title": "Recertification Quiz",
      "type": "quiz",
      "duration": 3,
      "questions": [
        {
          "question": "How often should you recertify on AI hiring compliance?",
          "options": ["Never", "Annually", "Every 5 years", "Only when laws change"],
          "correctAnswer": 1
        },
        {
          "question": "What is the most important compliance principle?",
          "options": ["Speed", "Transparency and fairness", "Cost reduction", "Automation"],
          "correctAnswer": 1
        }
      ]
    }
  ]'::jsonb,
  405,
  5,
  'core',
  true
);
