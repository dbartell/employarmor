// EmployArmor Compliance Knowledge Base
// Structured dataset of AI-in-hiring laws across US jurisdictions

export interface ComplianceRequirement {
  id: string;
  type: 'disclosure' | 'consent' | 'audit' | 'assessment' | 'retention' | 'notice' | 'opt-out';
  description: string;
  details: string;
  deadline?: string;
  toolTypes: string[];
}

export interface ComplianceLaw {
  id: string;
  jurisdiction: string;
  jurisdictionName: string;
  lawName: string;
  lawCode: string;
  effectiveDate: string;
  summary: string;
  triggers: string[];
  requirements: ComplianceRequirement[];
  penalties: string[];
  exemptions: string[];
  relatedLaws: string[];
}

export const complianceLaws: ComplianceLaw[] = [
  // ─────────────────────────────────────────────
  // ILLINOIS — HB 3773 (AI Video Interview Act)
  // ─────────────────────────────────────────────
  {
    id: 'il-aivi',
    jurisdiction: 'IL',
    jurisdictionName: 'Illinois',
    lawName: 'Artificial Intelligence Video Interview Act',
    lawCode: 'HB 3773 / 820 ILCS 42',
    effectiveDate: '2020-01-01',
    summary:
      'Regulates employers that use AI to analyze video interviews of applicants. Requires notice, consent, limits on sharing, and destruction of videos upon request. Applies to any employer using AI analysis of applicant-submitted video interviews.',
    triggers: [
      'Employer uses AI to analyze video interviews submitted by applicants',
      'AI evaluates applicant fitness based on facial expressions, word choice, or other video-derived data',
      'Applicant is located in Illinois or position is based in Illinois',
    ],
    requirements: [
      {
        id: 'il-aivi-notice',
        type: 'notice',
        description: 'Notify applicant that AI will be used',
        details:
          'Employer must notify each applicant before the interview that AI may be used to analyze the video interview and consider the applicant\'s fitness for the position.',
        deadline: 'Before the video interview',
        toolTypes: ['video-interview', 'assessment'],
      },
      {
        id: 'il-aivi-explain',
        type: 'disclosure',
        description: 'Explain how AI works',
        details:
          'Employer must provide the applicant with information about how the AI works and what general types of characteristics it uses to evaluate applicants.',
        deadline: 'Before the video interview',
        toolTypes: ['video-interview', 'assessment'],
      },
      {
        id: 'il-aivi-consent',
        type: 'consent',
        description: 'Obtain applicant consent',
        details:
          'Employer must obtain consent from the applicant before using AI analysis on the video interview. Without consent, the employer may not use AI to evaluate.',
        deadline: 'Before AI processing',
        toolTypes: ['video-interview', 'assessment'],
      },
      {
        id: 'il-aivi-sharing',
        type: 'retention',
        description: 'Limit video sharing',
        details:
          'Employer may not share applicant videos except with persons whose expertise is necessary to evaluate the applicant.',
        toolTypes: ['video-interview'],
      },
      {
        id: 'il-aivi-destruction',
        type: 'retention',
        description: 'Destroy video upon request',
        details:
          'Employer must destroy the video and instruct any persons who received copies to also destroy them within 30 days of an applicant\'s request.',
        deadline: '30 days of applicant request',
        toolTypes: ['video-interview'],
      },
    ],
    penalties: [
      'Violations enforced by the Illinois Attorney General',
      'Civil penalties and injunctive relief available',
      'No private right of action specified in the statute',
    ],
    exemptions: [
      'Does not apply if employer does not use AI to analyze the video',
      'Live interviews (non-recorded) are not covered',
    ],
    relatedLaws: ['il-hrab'],
  },

  // ─────────────────────────────────────────────
  // ILLINOIS — HB 3773 Amendment (Human Rights Act)
  // ─────────────────────────────────────────────
  {
    id: 'il-hrab',
    jurisdiction: 'IL',
    jurisdictionName: 'Illinois',
    lawName: 'Illinois Human Rights Act — AI Amendment',
    lawCode: 'HB 3773 / 775 ILCS 5/2-101 et seq.',
    effectiveDate: '2026-01-01',
    summary:
      'Amends the Illinois Human Rights Act to prohibit employers from using AI that has the effect of subjecting employees to discrimination based on protected classes. Employers using AI in employment decisions must provide notice and may face discrimination claims if the AI produces disparate impact.',
    triggers: [
      'Employer uses AI for recruitment, hiring, promotion, renewal of employment, selection for training or apprenticeship, discharge, discipline, tenure, or terms/conditions of employment',
      'AI system produces output that results in discriminatory impact on protected classes',
      'Use of zip code as a proxy for protected class in AI systems',
    ],
    requirements: [
      {
        id: 'il-hrab-notice',
        type: 'notice',
        description: 'Notice of AI use in employment decisions',
        details:
          'Employers must notify employees and applicants when AI is used to make or substantially inform employment decisions. Notice should be provided before AI is used.',
        deadline: 'Before AI processing',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai'],
      },
      {
        id: 'il-hrab-nondiscrimination',
        type: 'assessment',
        description: 'Ensure AI does not cause discriminatory impact',
        details:
          'Employers are liable if their use of AI results in discrimination based on race, color, religion, national origin, ancestry, age, sex, marital status, disability, military status, sexual orientation, pregnancy, or unfavorable discharge from military service.',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'general-ai'],
      },
    ],
    penalties: [
      'Violations treated as civil rights violations under the Illinois Human Rights Act',
      'Complaints filed with the Illinois Department of Human Rights',
      'Compensatory damages, injunctive relief, attorneys\' fees',
      'Civil penalties up to $5,000 per violation',
    ],
    exemptions: [
      'AI systems that do not substantially inform or make employment decisions',
    ],
    relatedLaws: ['il-aivi'],
  },

  // ─────────────────────────────────────────────
  // NYC — Local Law 144 (AEDT Law)
  // ─────────────────────────────────────────────
  {
    id: 'nyc-ll144',
    jurisdiction: 'NYC',
    jurisdictionName: 'New York City',
    lawName: 'Automated Employment Decision Tools Law',
    lawCode: 'Local Law 144 of 2021',
    effectiveDate: '2023-07-05',
    summary:
      'Prohibits employers and employment agencies in NYC from using an automated employment decision tool (AEDT) to screen candidates or employees for an employment decision unless the tool has undergone a bias audit within the past year, and candidates are given required notices.',
    triggers: [
      'Use of an AEDT to substantially assist or replace discretionary decision-making in employment decisions',
      'AEDT screens candidates for employment or employees for promotion within NYC',
      'Tool uses machine learning, statistical modeling, data analytics, or AI to issue a simplified output (score, classification, recommendation) used in employment decisions',
    ],
    requirements: [
      {
        id: 'nyc-ll144-audit',
        type: 'audit',
        description: 'Annual independent bias audit',
        details:
          'An independent auditor must conduct a bias audit of the AEDT no more than one year prior to use. The audit must calculate selection rates and impact ratios for sex/gender, race/ethnicity categories, and intersectional categories. The audit must use historical data from the tool or test data if insufficient historical data exists.',
        deadline: 'Annually, before use or within 1 year of prior audit',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'general-ai'],
      },
      {
        id: 'nyc-ll144-publish',
        type: 'disclosure',
        description: 'Publish bias audit summary',
        details:
          'The summary of the most recent bias audit results, including source and explanation of data used, number of individuals assessed, selection/scoring rates, and impact ratios must be publicly posted on the employer\'s website before the tool is used.',
        deadline: 'Before using the AEDT',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'general-ai'],
      },
      {
        id: 'nyc-ll144-notice-candidates',
        type: 'notice',
        description: 'Notify candidates of AEDT use',
        details:
          'Candidates who reside in NYC must be notified no fewer than 10 business days before the AEDT is used that: (1) an AEDT will be used, (2) the job qualifications and characteristics the AEDT will assess, and (3) information about the data retention policy, data sources, and the type of data collected.',
        deadline: '10 business days before use',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'general-ai'],
      },
      {
        id: 'nyc-ll144-alternative',
        type: 'opt-out',
        description: 'Provide alternative selection process',
        details:
          'Candidates must be informed they may request an alternative selection process or accommodation. The notice must include instructions for how to request such an alternative.',
        deadline: '10 business days before use',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'general-ai'],
      },
      {
        id: 'nyc-ll144-data-notice',
        type: 'notice',
        description: 'Data collection and retention notice',
        details:
          'Employers must provide notice of data collected by the AEDT and their data retention policy. For candidates in NYC, this notice can be on the employer\'s careers page or in the job listing.',
        deadline: '10 business days before use',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'general-ai'],
      },
    ],
    penalties: [
      'Civil penalty of $500 for the first violation',
      'Civil penalty of $500–$1,500 for each subsequent violation',
      'Each day the tool is used in violation constitutes a separate violation',
      'Enforced by the NYC Department of Consumer and Worker Protection (DCWP)',
    ],
    exemptions: [
      'Tools that do not substantially assist or replace discretionary decision-making',
      'Tools that do not automate, or issue a simplified output for, an employment decision',
      'Junk email/spam filtering',
      'Firewall or cybersecurity tools',
      'Calculator or spreadsheet tools',
    ],
    relatedLaws: [],
  },

  // ─────────────────────────────────────────────
  // COLORADO — SB 24-205
  // ─────────────────────────────────────────────
  {
    id: 'co-sb24205',
    jurisdiction: 'CO',
    jurisdictionName: 'Colorado',
    lawName: 'Colorado AI Act',
    lawCode: 'SB 24-205',
    effectiveDate: '2026-02-01',
    summary:
      'Requires developers and deployers of high-risk AI systems to use reasonable care to protect consumers from known or foreseeable risks of algorithmic discrimination. Employment decisions are explicitly listed as a high-risk use case. Deployers must conduct impact assessments, provide notice, and offer opt-out opportunities.',
    triggers: [
      'Deployment of a high-risk AI system that makes or is a substantial factor in making consequential decisions',
      'AI used in employment or employment-related decisions (hiring, termination, compensation, promotion, assignment)',
      'AI system operating in or affecting Colorado residents',
    ],
    requirements: [
      {
        id: 'co-sb24205-risk-mgmt',
        type: 'assessment',
        description: 'Implement risk management policy',
        details:
          'Deployers of high-risk AI must implement a risk management policy and program that maps, manages, and governs known or foreseeable risks of algorithmic discrimination throughout the AI lifecycle.',
        deadline: 'Before deployment and ongoing',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
      {
        id: 'co-sb24205-impact',
        type: 'assessment',
        description: 'Complete impact assessment',
        details:
          'Deployers must complete an impact assessment for each high-risk AI system, including: (1) purpose and intended use, (2) analysis of risks of algorithmic discrimination, (3) categories of data used, (4) metrics used to evaluate performance and fairness, (5) transparency measures, (6) post-deployment monitoring plan.',
        deadline: 'Before deployment and annually thereafter',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
      {
        id: 'co-sb24205-notice',
        type: 'notice',
        description: 'Provide consumer notice',
        details:
          'Before or at the time a high-risk AI system is used to make a consequential decision about a consumer, the deployer must notify the consumer that AI is being used, the purpose, and contact information for the deployer. If the decision is adverse, must provide a statement of reasons, opportunity to correct data, and right to appeal with human review.',
        deadline: 'Before or at time of consequential decision',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
      {
        id: 'co-sb24205-optout',
        type: 'opt-out',
        description: 'Right to opt out / appeal with human review',
        details:
          'If an adverse consequential decision is made, the consumer has the right to appeal and obtain human review of the decision. The deployer must provide a meaningful opportunity for the consumer to correct factually inaccurate data.',
        deadline: 'Upon adverse decision',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai'],
      },
      {
        id: 'co-sb24205-disclosure-ag',
        type: 'disclosure',
        description: 'Disclose discovery of discrimination to AG',
        details:
          'If a deployer discovers that the high-risk AI system has caused algorithmic discrimination, they must notify the Colorado Attorney General within 90 days, unless disclosure is already required under another law.',
        deadline: '90 days after discovery',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
    ],
    penalties: [
      'Enforced exclusively by the Colorado Attorney General',
      'Violations treated as deceptive trade practices under the Colorado Consumer Protection Act',
      'Civil penalties up to $20,000 per violation',
      'Injunctive relief available',
      'No private right of action',
      'Affirmative defense available if deployer has complied with NIST AI Risk Management Framework or equivalent',
    ],
    exemptions: [
      'AI systems that do not make or substantially factor into consequential decisions',
      'Affirmative defense if deployer discovers and cures a violation in a reasonable timeframe',
      'Compliance with recognized AI risk management frameworks (e.g., NIST AI RMF) creates rebuttable presumption of reasonable care',
      'Narrow AI performing routine tasks with human oversight',
    ],
    relatedLaws: [],
  },

  // ─────────────────────────────────────────────
  // CALIFORNIA — CCPA/CPRA Automated Decision-Making
  // ─────────────────────────────────────────────
  {
    id: 'ca-ccpa-admt',
    jurisdiction: 'CA',
    jurisdictionName: 'California',
    lawName: 'CCPA/CPRA — Automated Decision-Making Technology Regulations',
    lawCode: 'Cal. Civ. Code § 1798.100 et seq. / CPPA ADMT Regulations',
    effectiveDate: '2025-01-01',
    summary:
      'The California Privacy Protection Agency (CPPA) has promulgated regulations governing automated decision-making technology (ADMT) under the CCPA/CPRA framework. These regulations grant consumers rights regarding profiling and ADMT, including the right to opt out of automated decision-making and to access information about how ADMT is used in significant decisions, including employment.',
    triggers: [
      'Business uses automated decision-making technology to process personal information for decisions that produce legal or similarly significant effects',
      'ADMT used for profiling employees or job applicants',
      'Profiling for purposes of employment, including hiring, compensation, promotion, or termination decisions',
      'Business collects personal information from California residents in an employment context',
    ],
    requirements: [
      {
        id: 'ca-ccpa-admt-prenotice',
        type: 'notice',
        description: 'Pre-use notice of ADMT',
        details:
          'Before using ADMT to make decisions producing legal or similarly significant effects, businesses must provide a pre-use notice describing the ADMT, its purpose, how it works in plain language, the consumer\'s right to opt out, and how to exercise that right.',
        deadline: 'Before ADMT processing',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
      {
        id: 'ca-ccpa-admt-optout',
        type: 'opt-out',
        description: 'Right to opt out of ADMT',
        details:
          'Consumers (including employees and applicants where applicable under CPRA) have the right to opt out of ADMT that produces legal or similarly significant effects. Businesses must provide a mechanism to exercise this right.',
        deadline: 'Before ADMT processing',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
      {
        id: 'ca-ccpa-admt-access',
        type: 'disclosure',
        description: 'Right to access ADMT logic',
        details:
          'Consumers have the right to request information about the logic involved in ADMT, including the personal information used, the output produced, and how the output was used in the decision.',
        deadline: '45 days of verifiable consumer request',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
      {
        id: 'ca-ccpa-admt-risk',
        type: 'assessment',
        description: 'Cybersecurity audit and risk assessment for ADMT',
        details:
          'Businesses using ADMT for significant decisions must conduct regular risk assessments evaluating the benefits and risks of the processing, including risks of discrimination, and submit these assessments to the CPPA upon request.',
        deadline: 'Before processing and annually',
        toolTypes: ['ats', 'assessment', 'video-interview', 'sourcing', 'monitoring', 'general-ai', 'compensation'],
      },
    ],
    penalties: [
      'CPPA enforcement actions',
      'Administrative fines up to $2,500 per violation, $7,500 per intentional violation',
      'Private right of action for data breaches (limited scope)',
      'Injunctive relief',
    ],
    exemptions: [
      'ADMT that does not produce legal or similarly significant effects',
      'Employee personal information exemption (partially expired as of Jan 1, 2023 — applicant/employee data now largely covered)',
      'Certain security and fraud prevention processing',
    ],
    relatedLaws: [],
  },

  // ─────────────────────────────────────────────
  // MARYLAND — HB 1202
  // ─────────────────────────────────────────────
  {
    id: 'md-hb1202',
    jurisdiction: 'MD',
    jurisdictionName: 'Maryland',
    lawName: 'Maryland Facial Recognition in Hiring Law',
    lawCode: 'HB 1202 / Md. Code, Lab. & Empl. § 3-717',
    effectiveDate: '2020-10-01',
    summary:
      'Prohibits employers from using facial recognition technology during job applicant interviews unless the applicant provides a signed waiver consenting to the use. One of the earliest and most narrowly targeted AI-in-hiring laws, focused specifically on facial recognition in the interview process.',
    triggers: [
      'Employer uses facial recognition technology during a job interview',
      'Facial recognition service creates a facial template of an applicant during an interview',
      'Position is in Maryland or applicant is interviewing in Maryland',
    ],
    requirements: [
      {
        id: 'md-hb1202-waiver',
        type: 'consent',
        description: 'Obtain signed waiver for facial recognition',
        details:
          'An employer may not use a facial recognition service during an applicant\'s interview unless the applicant signs a waiver that explicitly authorizes the employer to use facial recognition during the interview.',
        deadline: 'Before the interview',
        toolTypes: ['video-interview', 'assessment'],
      },
    ],
    penalties: [
      'Enforced under Maryland labor and employment law',
      'Potential civil liability for violations',
      'Enforcement by the Maryland Commissioner of Labor and Industry',
    ],
    exemptions: [
      'Does not apply if the applicant provides a signed waiver',
      'Does not cover other forms of AI analysis beyond facial recognition',
      'Does not apply outside the interview context',
    ],
    relatedLaws: ['il-aivi'],
  },
];

// Utility: look up a law by ID
export function getLawById(id: string): ComplianceLaw | undefined {
  return complianceLaws.find((law) => law.id === id);
}

// Utility: get all laws for a jurisdiction
export function getLawsByJurisdiction(jurisdiction: string): ComplianceLaw[] {
  return complianceLaws.filter((law) => law.jurisdiction === jurisdiction);
}

// Utility: find laws triggered by a specific tool type
export function getLawsTriggeredByToolType(toolType: string): ComplianceLaw[] {
  return complianceLaws.filter((law) =>
    law.requirements.some((req) => req.toolTypes.includes(toolType))
  );
}

// All law IDs for reference
export const allLawIds = complianceLaws.map((law) => law.id);
