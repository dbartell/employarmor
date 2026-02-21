// EmployArmor Compliance Knowledge Base
// Structured dataset of AI-in-hiring laws across US jurisdictions

import { LawCategory } from '@/types';

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
  category?: LawCategory;
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

  // ─────────────────────────────────────────────
  // FEDERAL — Employee Polygraph Protection Act
  // ─────────────────────────────────────────────
  {
    id: 'federal-eppa',
    jurisdiction: 'US',
    jurisdictionName: 'United States',
    lawName: 'Employee Polygraph Protection Act',
    lawCode: '29 USC §§2001-2009',
    effectiveDate: '1988-06-27',
    summary:
      'Prohibits most private employers from using lie detector tests in pre-employment screening. Broadly defines "lie detector" to include any device assessing honesty through physiological responses — AI emotion detection, facial expression analysis, and integrity scoring in video interviews may violate this.',
    triggers: [
      'AI emotion detection in video interviews',
      'AI integrity/honesty scoring',
      'Facial expression analysis for deception detection',
      'AI assessment of truthfulness via physiological or behavioral indicators',
    ],
    requirements: [
      {
        id: 'federal-eppa-prohibition',
        type: 'notice',
        description: 'Cannot require or request lie detector tests',
        details:
          'Employers are prohibited from requiring, requesting, suggesting, or causing any employee or prospective employee to take or submit to any lie detector test. AI tools that assess honesty, integrity, or truthfulness through physiological or behavioral analysis may be deemed lie detector devices.',
        toolTypes: ['video-interview', 'assessment'],
      },
      {
        id: 'federal-eppa-exceptions',
        type: 'consent',
        description: 'Limited exceptions for ongoing investigations',
        details:
          'Narrow exceptions exist for security services, pharmaceutical manufacturing, and ongoing workplace investigations involving economic loss or injury. Even in these cases, strict notice and consent requirements apply.',
        toolTypes: ['video-interview', 'assessment'],
      },
    ],
    penalties: [
      'Civil fines up to $10,000 per violation',
      'Employees can sue for employment, reinstatement, back pay, and damages',
      'Enforcement by the Department of Labor',
    ],
    exemptions: [
      'Federal, state, and local government employers',
      'Security service firms (armored car, alarm, guard)',
      'Pharmaceutical manufacturers (controlled substances)',
      'Ongoing investigations of economic loss (with strict procedural requirements)',
    ],
    relatedLaws: ['ma-lie-detector'],
    category: 'lie-detector',
  },

  // ─────────────────────────────────────────────
  // MASSACHUSETTS — Lie Detector Statute
  // ─────────────────────────────────────────────
  {
    id: 'ma-lie-detector',
    jurisdiction: 'MA',
    jurisdictionName: 'Massachusetts',
    lawName: 'Massachusetts Lie Detector Statute',
    lawCode: 'MGL Ch. 149 §19B',
    effectiveDate: '1959-01-01',
    summary:
      'Prohibits requiring lie detector tests in employment. Broad "device" language covers AI tools that assess truthfulness via facial expressions or voice analysis. CVS settled a case over HireVue facial scoring under this statute.',
    triggers: [
      'AI emotion detection in video interviews',
      'AI integrity/honesty scoring',
      'Facial expression analysis for deception detection',
      'Voice analysis for truthfulness assessment',
      'Any device verifying truthfulness of statements',
    ],
    requirements: [
      {
        id: 'ma-lie-detector-prohibition',
        type: 'notice',
        description: 'Cannot require lie detector test as condition of employment',
        details:
          'No employer shall require or subject any employee or prospective employee to take a lie detector test as a condition of employment or continued employment. Includes any mechanical or electrical device used to verify truthfulness of statements.',
        toolTypes: ['video-interview', 'assessment'],
      },
    ],
    penalties: [
      'Civil fines and damages',
      'Attorney fees for prevailing plaintiffs',
      'Injunctive relief available',
      'CVS settled over HireVue facial scoring allegations',
    ],
    exemptions: [
      'Law enforcement agencies',
      'National security positions',
    ],
    relatedLaws: ['federal-eppa'],
    category: 'lie-detector',
  },

  // ─────────────────────────────────────────────
  // ILLINOIS — Biometric Information Privacy Act
  // ─────────────────────────────────────────────
  {
    id: 'il-bipa',
    jurisdiction: 'IL',
    jurisdictionName: 'Illinois',
    lawName: 'Illinois Biometric Information Privacy Act',
    lawCode: '740 ILCS 14',
    effectiveDate: '2008-10-03',
    summary:
      'Regulates collection of biometric identifiers. ONLY US privacy law with private right of action. Covers facial geometry, voiceprints, keystroke dynamics. Each scan = separate violation. Potential liability in billions.',
    triggers: [
      'Facial recognition in video interviews',
      'Voice pattern analysis',
      'Fingerprint or retina scans',
      'Iris scans',
      'Facial geometry scanning',
      'Voiceprint analysis',
      'Hand or finger geometry',
      'Keystroke or gait analysis',
    ],
    requirements: [
      {
        id: 'il-bipa-consent',
        type: 'consent',
        description: 'Obtain written informed consent before collection',
        details:
          'Must inform the subject in writing that biometric identifiers are being collected or stored, the specific purpose and length of retention, and obtain a written release. Consent must be informed and voluntary.',
        deadline: 'Before collection',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
      {
        id: 'il-bipa-disclosure',
        type: 'disclosure',
        description: 'Publish written retention and destruction policy',
        details:
          'Must make publicly available a written policy establishing a retention schedule and guidelines for permanently destroying biometric identifiers when the initial purpose is satisfied or within 3 years, whichever comes first.',
        deadline: 'Before collection',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
      {
        id: 'il-bipa-retention',
        type: 'retention',
        description: 'Destroy biometric data within retention schedule',
        details:
          'Must permanently destroy biometric identifiers when the initial purpose for collection is satisfied or within 3 years of the individual\'s last interaction, whichever occurs first.',
        deadline: 'Per retention schedule (max 3 years)',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
    ],
    penalties: [
      '$1,000 per violation (negligent)',
      '$5,000 per violation (intentional or reckless)',
      'Each scan constitutes a separate violation',
      'Private right of action — plaintiffs can sue directly',
      'Injunctive relief and attorney fees',
      'Potential aggregate liability in billions for mass scanning',
    ],
    exemptions: [
      'Financial institutions regulated under GLBA',
      'HIPAA-covered entities for treatment purposes',
      'Information captured from patient in healthcare setting',
    ],
    relatedLaws: ['tx-cubi', 'wa-biometric'],
    category: 'biometric',
  },

  // ─────────────────────────────────────────────
  // TEXAS — Capture or Use of Biometric Identifier
  // ─────────────────────────────────────────────
  {
    id: 'tx-cubi',
    jurisdiction: 'TX',
    jurisdictionName: 'Texas',
    lawName: 'Texas Capture or Use of Biometric Identifier Act',
    lawCode: 'TX Bus. & Com. Code §503.001',
    effectiveDate: '2009-09-01',
    summary:
      'Regulates capture and use of biometric identifiers. No private right of action — AG enforcement only. Requires notice and consent before capture.',
    triggers: [
      'Facial recognition in video interviews',
      'Voice pattern analysis',
      'Fingerprint or retina scans',
      'Iris scans',
      'Facial geometry scanning',
      'Voiceprint analysis',
      'Hand or finger geometry',
    ],
    requirements: [
      {
        id: 'tx-cubi-notice',
        type: 'notice',
        description: 'Inform individual before biometric capture',
        details:
          'A person may not capture a biometric identifier of an individual for a commercial purpose unless the person informs the individual before capturing the biometric identifier.',
        deadline: 'Before capture',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
      {
        id: 'tx-cubi-consent',
        type: 'consent',
        description: 'Obtain consent before biometric capture',
        details:
          'A person may not capture a biometric identifier of an individual for a commercial purpose unless the person receives the individual\'s consent to capture the biometric identifier.',
        deadline: 'Before capture',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
      {
        id: 'tx-cubi-sale',
        type: 'disclosure',
        description: 'Prohibited sale or lease of biometric identifiers',
        details:
          'A person may not sell, lease, or otherwise disclose a biometric identifier to another person unless the disclosure complies with consent or is required by law.',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
    ],
    penalties: [
      '$25,000 per violation',
      'Enforcement by Texas Attorney General only',
      'No private right of action',
    ],
    exemptions: [
      'Security purposes',
      'HIPAA-covered entities',
    ],
    relatedLaws: ['il-bipa', 'wa-biometric'],
    category: 'biometric',
  },

  // ─────────────────────────────────────────────
  // WASHINGTON — Biometric Privacy
  // ─────────────────────────────────────────────
  {
    id: 'wa-biometric',
    jurisdiction: 'WA',
    jurisdictionName: 'Washington',
    lawName: 'Washington Biometric Privacy',
    lawCode: 'RCW 19.375',
    effectiveDate: '2017-07-23',
    summary:
      'Requires notice and consent before enrollment in biometric database. Violations treated as unfair business practices under Consumer Protection Act.',
    triggers: [
      'Facial recognition enrollment in database',
      'Voice pattern database enrollment',
      'Fingerprint or retina database enrollment',
      'Biometric identifier enrollment for commercial purposes',
    ],
    requirements: [
      {
        id: 'wa-biometric-notice',
        type: 'notice',
        description: 'Notice before biometric enrollment',
        details:
          'A person may not enroll a biometric identifier in a database for a commercial purpose without first providing notice, separate from any general terms and conditions.',
        deadline: 'Before enrollment',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
      {
        id: 'wa-biometric-consent',
        type: 'consent',
        description: 'Consent before biometric enrollment',
        details:
          'A person may not enroll a biometric identifier in a database for a commercial purpose without receiving consent to enroll the biometric identifier.',
        deadline: 'Before enrollment',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
    ],
    penalties: [
      'Violations treated as unfair or deceptive acts under Consumer Protection Act',
      'Injunctive relief and damages available',
      'Attorney fees for prevailing plaintiffs',
    ],
    exemptions: [
      'Security and fraud prevention',
      'HIPAA-covered entities',
    ],
    relatedLaws: ['il-bipa', 'tx-cubi'],
    category: 'biometric',
  },

  // ─────────────────────────────────────────────
  // FEDERAL — Fair Credit Reporting Act
  // ─────────────────────────────────────────────
  {
    id: 'federal-fcra',
    jurisdiction: 'US',
    jurisdictionName: 'United States',
    lawName: 'Fair Credit Reporting Act',
    lawCode: '15 USC §1681 et seq.',
    effectiveDate: '1970-04-25',
    summary:
      'When third-party AI vendors generate scores, reports, or assessments about candidates that influence hiring, the vendor may be a CRA and output a consumer report. Triggers full FCRA compliance including disclosure, authorization, and adverse action procedures.',
    triggers: [
      'Third-party AI vendor generates candidate scores or reports',
      'AI vendor provides match scores or employment predictions',
      'AI-created talent profiles shared with employers',
      'Third-party background screening with AI-enhanced reports',
    ],
    requirements: [
      {
        id: 'federal-fcra-disclosure',
        type: 'disclosure',
        description: 'Standalone written disclosure to applicant',
        details:
          'Before procuring a consumer report, employer must provide a clear and conspicuous standalone written disclosure that a consumer report may be obtained for employment purposes.',
        deadline: 'Before obtaining report',
        toolTypes: ['screening', 'ats', 'assessment'],
      },
      {
        id: 'federal-fcra-authorization',
        type: 'consent',
        description: 'Written authorization before procuring report',
        details:
          'Employer must obtain written authorization from the applicant before procuring a consumer report. Authorization may be on same document as disclosure but must be clear and conspicuous.',
        deadline: 'Before obtaining report',
        toolTypes: ['screening', 'ats', 'assessment'],
      },
      {
        id: 'federal-fcra-pre-adverse',
        type: 'notice',
        description: 'Pre-adverse action notice',
        details:
          'Before taking adverse action based on consumer report, employer must provide applicant with copy of report and FTC notice "A Summary of Your Rights Under the Fair Credit Reporting Act."',
        deadline: 'Before adverse action',
        toolTypes: ['screening', 'ats', 'assessment'],
      },
      {
        id: 'federal-fcra-post-adverse',
        type: 'notice',
        description: 'Post-adverse action notice',
        details:
          'After taking adverse action, employer must provide written or electronic notice including: name/address/phone of CRA, statement that CRA did not make decision, notice of right to dispute accuracy, and right to obtain additional free report within 60 days.',
        deadline: 'After adverse action',
        toolTypes: ['screening', 'ats', 'assessment'],
      },
    ],
    penalties: [
      'Willful noncompliance: $100-$1,000 per violation plus punitive damages',
      'Negligent noncompliance: actual damages',
      'Attorney fees and costs',
      'Class action exposure',
      'FTC enforcement actions',
    ],
    exemptions: [
      'Reports procured by individual about themselves',
      'Investigative consumer reports for positions with salary over $75,000 (different disclosure requirements)',
    ],
    relatedLaws: [],
    category: 'fcra',
  },

  // ─────────────────────────────────────────────
  // FEDERAL — Wiretap Act
  // ─────────────────────────────────────────────
  {
    id: 'federal-wiretap',
    jurisdiction: 'US',
    jurisdictionName: 'United States',
    lawName: 'Federal Wiretap Act',
    lawCode: '18 USC §2511',
    effectiveDate: '1968-06-19',
    summary:
      'One-party consent federal baseline. AI video interviews recording candidates\' audio/video must comply with federal wiretap law. State laws may impose stricter all-party consent requirements.',
    triggers: [
      'Recording of oral communications during AI video interviews',
      'Interception of electronic communications',
      'AI video interview tools recording candidates',
    ],
    requirements: [
      {
        id: 'federal-wiretap-consent',
        type: 'consent',
        description: 'One-party consent required',
        details:
          'Federal law requires consent of at least one party to the communication. Employer conducting the interview may be considered a party. However, many states impose stricter all-party consent requirements.',
        deadline: 'Before recording',
        toolTypes: ['video-interview'],
      },
    ],
    penalties: [
      'Criminal penalties: up to 5 years imprisonment',
      'Civil damages: greater of actual damages or $10,000',
      'Punitive damages available',
      'Attorney fees',
    ],
    exemptions: [
      'Law enforcement with court order',
      'One party to the communication consents',
    ],
    relatedLaws: ['ca-wiretap', 'il-eavesdrop', 'fl-wiretap', 'pa-wiretap'],
    category: 'wiretapping',
  },

  // ─────────────────────────────────────────────
  // CALIFORNIA — Wiretap Law
  // ─────────────────────────────────────────────
  {
    id: 'ca-wiretap',
    jurisdiction: 'CA',
    jurisdictionName: 'California',
    lawName: 'California Wiretap Law',
    lawCode: 'Cal. Penal Code §632',
    effectiveDate: '1967-01-01',
    summary:
      'All-party consent required. AI video interviews recording without explicit consent from all parties = criminal offense. Among the strictest wiretap laws in the US.',
    triggers: [
      'Recording confidential communications during AI video interviews',
      'Recording telephone or video calls with California residents',
      'AI video interview recording candidates located in California',
    ],
    requirements: [
      {
        id: 'ca-wiretap-consent',
        type: 'consent',
        description: 'All-party consent required',
        details:
          'All parties to a confidential communication must consent to recording. Consent must be explicit. Passive notice (e.g., "this call may be recorded") may not be sufficient — affirmative consent is safest.',
        deadline: 'Before recording',
        toolTypes: ['video-interview'],
      },
    ],
    penalties: [
      'Criminal misdemeanor: up to 1 year in county jail',
      'Criminal fine up to $2,500',
      'Civil damages: $5,000 per violation or three times actual damages, whichever is greater',
      'Attorney fees',
    ],
    exemptions: [
      'All parties consent',
      'Law enforcement with court order',
    ],
    relatedLaws: ['federal-wiretap', 'il-eavesdrop', 'fl-wiretap', 'pa-wiretap'],
    category: 'wiretapping',
  },

  // ─────────────────────────────────────────────
  // ILLINOIS — Eavesdropping Act
  // ─────────────────────────────────────────────
  {
    id: 'il-eavesdrop',
    jurisdiction: 'IL',
    jurisdictionName: 'Illinois',
    lawName: 'Illinois Eavesdropping Act',
    lawCode: '720 ILCS 5/14-2',
    effectiveDate: '1961-01-01',
    summary:
      'All-party consent required. Criminal penalties for recording conversations without consent of all parties. Applies to AI video interviews recording Illinois candidates.',
    triggers: [
      'Recording private conversations during AI video interviews',
      'Recording telephone or video calls with Illinois residents',
      'AI video interview recording candidates located in Illinois',
    ],
    requirements: [
      {
        id: 'il-eavesdrop-consent',
        type: 'consent',
        description: 'All-party consent required',
        details:
          'A person commits eavesdropping when he or she knowingly and intentionally uses an eavesdropping device to hear or record a private conversation without consent of all parties. All parties must consent before recording.',
        deadline: 'Before recording',
        toolTypes: ['video-interview'],
      },
    ],
    penalties: [
      'Class 4 felony',
      'Imprisonment up to 3 years',
      'Civil damages: greater of $3,000 or actual damages',
      'Statutory damages $100-$5,000',
      'Profits from violation may be recoverable',
      'Attorney fees',
    ],
    exemptions: [
      'All parties consent',
      'Law enforcement with court order',
      'Public conversations (no reasonable expectation of privacy)',
    ],
    relatedLaws: ['federal-wiretap', 'ca-wiretap', 'fl-wiretap', 'pa-wiretap'],
    category: 'wiretapping',
  },

  // ─────────────────────────────────────────────
  // FLORIDA — Wiretap Statute
  // ─────────────────────────────────────────────
  {
    id: 'fl-wiretap',
    jurisdiction: 'FL',
    jurisdictionName: 'Florida',
    lawName: 'Florida Security of Communications Act',
    lawCode: 'Fla. Stat. §934.03',
    effectiveDate: '1969-01-01',
    summary:
      'All-party consent required. Recording oral or electronic communications without consent of all parties is a third-degree felony. Applies to AI video interviews with Florida candidates.',
    triggers: [
      'Recording oral communications during AI video interviews',
      'Recording telephone or video calls with Florida residents',
      'AI video interview recording candidates located in Florida',
    ],
    requirements: [
      {
        id: 'fl-wiretap-consent',
        type: 'consent',
        description: 'All-party consent required',
        details:
          'All parties to an oral communication must consent to interception or recording. Consent must be obtained before recording begins.',
        deadline: 'Before recording',
        toolTypes: ['video-interview'],
      },
    ],
    penalties: [
      'Third-degree felony: up to 5 years imprisonment',
      'Fines up to $5,000',
      'Civil damages available',
      'Attorney fees',
    ],
    exemptions: [
      'All parties consent',
      'Law enforcement with court order',
    ],
    relatedLaws: ['federal-wiretap', 'ca-wiretap', 'il-eavesdrop', 'pa-wiretap'],
    category: 'wiretapping',
  },

  // ─────────────────────────────────────────────
  // PENNSYLVANIA — Wiretap Act
  // ─────────────────────────────────────────────
  {
    id: 'pa-wiretap',
    jurisdiction: 'PA',
    jurisdictionName: 'Pennsylvania',
    lawName: 'Pennsylvania Wiretapping and Electronic Surveillance Control Act',
    lawCode: '18 Pa. C.S. §5703',
    effectiveDate: '1978-01-01',
    summary:
      'All-party consent required. Intercepting oral communications without consent of all parties is a felony of the third degree. Applies to AI video interviews with Pennsylvania candidates.',
    triggers: [
      'Recording oral communications during AI video interviews',
      'Recording telephone or video calls with Pennsylvania residents',
      'AI video interview recording candidates located in Pennsylvania',
    ],
    requirements: [
      {
        id: 'pa-wiretap-consent',
        type: 'consent',
        description: 'All-party consent required',
        details:
          'A person is guilty of a felony if he intercepts any wire, electronic or oral communication without the consent of all parties to the communication.',
        deadline: 'Before recording',
        toolTypes: ['video-interview'],
      },
    ],
    penalties: [
      'Felony of the third degree: up to 7 years imprisonment',
      'Fines up to $15,000',
      'Civil damages: $100 per day of violation or $1,000, whichever is greater, plus actual damages exceeding those amounts',
      'Civil damages may be enhanced up to $5,000 per violation for willful or knowing violations',
      'Punitive damages available',
      'Attorney fees',
    ],
    exemptions: [
      'All parties consent',
      'Law enforcement with court order',
    ],
    relatedLaws: ['federal-wiretap', 'ca-wiretap', 'il-eavesdrop', 'fl-wiretap'],
    category: 'wiretapping',
  },

  // ─────────────────────────────────────────────
  // FEDERAL — Title VII Civil Rights Act
  // ─────────────────────────────────────────────
  {
    id: 'federal-title-vii',
    jurisdiction: 'US',
    jurisdictionName: 'United States',
    lawName: 'Title VII of the Civil Rights Act of 1964',
    lawCode: '42 USC §2000e et seq.',
    effectiveDate: '1964-07-02',
    summary:
      'Prohibits employment discrimination based on race, color, religion, sex, national origin. AI hiring tools that produce disparate impact violate Title VII even without discriminatory intent. EEOC has issued guidance on AI discrimination.',
    triggers: [
      'AI screening produces disparate impact on protected groups',
      'AI resume filtering systematically disadvantages protected classes',
      'AI assessment tools with bias in selection rates',
      'Facially neutral AI tools with discriminatory effects',
    ],
    requirements: [
      {
        id: 'federal-title-vii-nondiscrimination',
        type: 'assessment',
        description: 'Ensure AI does not produce disparate impact',
        details:
          'Employers must ensure AI hiring tools do not produce unjustified disparate impact on the basis of race, color, religion, sex, or national origin. Even facially neutral tools violate Title VII if they have discriminatory effects and are not job-related and consistent with business necessity.',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'federal-title-vii-validation',
        type: 'assessment',
        description: 'Validate AI tools for job-relatedness',
        details:
          'If AI tool produces disparate impact, employer must show it is job-related and consistent with business necessity through validation studies (Uniform Guidelines on Employee Selection Procedures).',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
    ],
    penalties: [
      'EEOC enforcement actions',
      'Back pay and front pay',
      'Compensatory damages (emotional distress, etc.)',
      'Punitive damages (for intentional discrimination)',
      'Injunctive relief (cease use of discriminatory tool)',
      'Attorney fees and costs',
      'No cap on back pay; compensatory and punitive damages capped at $50,000-$300,000 depending on employer size',
    ],
    exemptions: [
      'Bona fide occupational qualifications (BFOQ) — extremely narrow exception',
      'Religious organizations for religious position selection',
    ],
    relatedLaws: ['federal-ada', 'federal-adea'],
    category: 'anti-discrimination',
  },

  // ─────────────────────────────────────────────
  // FEDERAL — Americans with Disabilities Act
  // ─────────────────────────────────────────────
  {
    id: 'federal-ada',
    jurisdiction: 'US',
    jurisdictionName: 'United States',
    lawName: 'Americans with Disabilities Act',
    lawCode: '42 USC §12112',
    effectiveDate: '1990-07-26',
    summary:
      'AI hiring tools must accommodate candidates with disabilities. Video AI disadvantages deaf/blind/speech-impaired candidates. Timed AI assessments may disadvantage candidates with processing disabilities. EEOC guidance emphasizes accessibility and accommodation.',
    triggers: [
      'AI video tools inaccessible to deaf or blind candidates',
      'AI assessments without accommodation options',
      'AI scoring that penalizes atypical communication patterns',
      'Timed assessments without extended time accommodations',
      'AI tools that screen out qualified candidates with disabilities',
    ],
    requirements: [
      {
        id: 'federal-ada-accommodation',
        type: 'consent',
        description: 'Provide reasonable accommodations upon request',
        details:
          'Employers must provide reasonable accommodations to qualified candidates with disabilities, including modified assessment formats, extended time, assistive technology compatibility, alternative communication methods, and human review options.',
        deadline: 'Upon request or when disability is known',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
      {
        id: 'federal-ada-screening',
        type: 'assessment',
        description: 'Ensure AI tools do not screen out qualified disabled candidates',
        details:
          'AI tools must not screen out or tend to screen out qualified individuals with disabilities unless the selection criteria are job-related and consistent with business necessity. Employers must validate that AI tools do not penalize disability-related characteristics.',
        toolTypes: ['video-interview', 'assessment', 'screening'],
      },
    ],
    penalties: [
      'EEOC enforcement actions',
      'Back pay and front pay',
      'Compensatory damages (emotional distress, medical expenses)',
      'Punitive damages (for intentional discrimination or reckless indifference)',
      'Injunctive relief (cease use of discriminatory tool, policy changes)',
      'Attorney fees and costs',
      'Compensatory and punitive damages capped at $50,000-$300,000 depending on employer size',
      'Civil penalties up to $75,000 for first violation, $150,000 for subsequent violations in pattern cases',
    ],
    exemptions: [
      'Undue hardship (significant difficulty or expense)',
      'Direct threat to health or safety that cannot be mitigated by reasonable accommodation',
    ],
    relatedLaws: ['federal-title-vii', 'federal-adea'],
    category: 'disability',
  },

  // ─────────────────────────────────────────────
  // COLORADO — Equal Pay for Equal Work Act
  // ─────────────────────────────────────────────
  {
    id: 'co-pay-transparency',
    jurisdiction: 'CO',
    jurisdictionName: 'Colorado',
    lawName: 'Colorado Equal Pay for Equal Work Act',
    lawCode: 'Colo. Rev. Stat. §8-5-101 et seq.',
    effectiveDate: '2021-01-01',
    summary:
      'AI job postings must include salary ranges. Auto-filtering by salary history prohibited. Employers must disclose compensation and advancement opportunities in job postings for Colorado-based positions or remote work available to Colorado residents.',
    triggers: [
      'Job posting for Colorado position',
      'Remote job posting available to Colorado candidates',
      'AI-powered job distribution or applicant tracking',
      'AI filtering of candidates by salary history',
    ],
    requirements: [
      {
        id: 'co-pay-transparency-disclosure',
        type: 'disclosure',
        description: 'Disclose salary range in job postings',
        details:
          'Employers must disclose in each job posting the hourly or salary compensation, or a range of compensation, and a general description of bonuses, commissions, or other compensation.',
        deadline: 'At time of job posting',
        toolTypes: ['ats', 'screening'],
      },
      {
        id: 'co-pay-transparency-history',
        type: 'notice',
        description: 'Prohibited use of salary history',
        details:
          'Employers may not seek wage rate history from applicants or rely on wage rate history in screening or hiring. AI tools that auto-filter by prior compensation violate this law.',
        toolTypes: ['ats', 'screening'],
      },
    ],
    penalties: [
      'Fines ranging from $500 to $10,000 per violation',
      'Each job posting without required disclosure is a separate violation',
      'Enforcement by Colorado Department of Labor and Employment',
    ],
    exemptions: [
      'Positions not performed in Colorado and not eligible for remote work from Colorado',
      'Internal promotions or transfers (different disclosure requirements apply)',
    ],
    relatedLaws: ['ca-pay-transparency', 'ny-pay-transparency'],
    category: 'pay-transparency',
  },

  // ─────────────────────────────────────────────
  // CALIFORNIA — Pay Transparency
  // ─────────────────────────────────────────────
  {
    id: 'ca-pay-transparency',
    jurisdiction: 'CA',
    jurisdictionName: 'California',
    lawName: 'California Pay Transparency Law',
    lawCode: 'Cal. Labor Code §432.3',
    effectiveDate: '2023-01-01',
    summary:
      'AI tools must disclose actual expected pay range in postings for positions that will be performed in California. Bans salary history inquiries and use in hiring decisions.',
    triggers: [
      'Job posting for California position',
      'Remote job posting available to California candidates',
      'AI-powered job distribution or applicant tracking',
      'AI filtering of candidates by salary history',
    ],
    requirements: [
      {
        id: 'ca-pay-transparency-disclosure',
        type: 'disclosure',
        description: 'Disclose pay scale in job postings',
        details:
          'Employers with 15+ employees must include the pay scale (salary or hourly wage range) in any job posting. For positions filled through third-party platforms, the pay scale must be included in the posting on the third-party platform.',
        deadline: 'At time of job posting',
        toolTypes: ['ats', 'screening'],
      },
      {
        id: 'ca-pay-transparency-history',
        type: 'notice',
        description: 'Prohibited use of salary history',
        details:
          'Employers may not seek salary history information about an applicant, including compensation and benefits. Employers may not rely on salary history in determining whether to offer employment or what salary to offer.',
        toolTypes: ['ats', 'screening'],
      },
    ],
    penalties: [
      'Civil penalties: $100 to $10,000 per violation',
      'Enforcement by California Labor Commissioner',
      'Applicants can file complaints',
    ],
    exemptions: [
      'Employers with fewer than 15 employees (for posting requirement)',
      'Positions not performed in California',
      'Public sector positions (different disclosure rules apply)',
    ],
    relatedLaws: ['co-pay-transparency', 'ny-pay-transparency'],
    category: 'pay-transparency',
  },

  // ─────────────────────────────────────────────
  // NEW YORK — Pay Transparency Act
  // ─────────────────────────────────────────────
  {
    id: 'ny-pay-transparency',
    jurisdiction: 'NY',
    jurisdictionName: 'New York',
    lawName: 'New York Pay Transparency Act',
    lawCode: 'NY Labor Law §194-b',
    effectiveDate: '2023-09-17',
    summary:
      'AI postings must disclose salary ranges for positions that will be performed in New York State. Requirements vary by locality (NYC has additional requirements). Prohibits salary history inquiries statewide.',
    triggers: [
      'Job posting for New York position',
      'Remote job posting available to New York candidates',
      'AI-powered job distribution or applicant tracking',
      'AI filtering of candidates by salary history',
    ],
    requirements: [
      {
        id: 'ny-pay-transparency-disclosure',
        type: 'disclosure',
        description: 'Disclose compensation range in job postings',
        details:
          'Employers with 4+ employees must include the compensation or range of compensation in any job posting for a position that will be physically performed in New York State. NYC requires minimum and maximum salary in good faith.',
        deadline: 'At time of job posting',
        toolTypes: ['ats', 'screening'],
      },
      {
        id: 'ny-pay-transparency-history',
        type: 'notice',
        description: 'Prohibited salary history inquiries',
        details:
          'Employers may not inquire about or rely on salary history in determining whether to offer employment or in determining salary, benefits, or other compensation.',
        toolTypes: ['ats', 'screening'],
      },
    ],
    penalties: [
      'Civil penalties vary by locality',
      'NYC: up to $250,000 per violation',
      'Enforcement by local agencies (NYC Commission on Human Rights, NYS Department of Labor)',
    ],
    exemptions: [
      'Employers with fewer than 4 employees (statewide)',
      'Internal transfers or promotions to existing employee (NYC exemption)',
      'Temporary employment at temporary help firm (limited exemption)',
    ],
    relatedLaws: ['co-pay-transparency', 'ca-pay-transparency'],
    category: 'pay-transparency',
  },

  // ─────────────────────────────────────────────
  // FEDERAL — Age Discrimination in Employment Act
  // ─────────────────────────────────────────────
  {
    id: 'federal-adea',
    jurisdiction: 'US',
    jurisdictionName: 'United States',
    lawName: 'Age Discrimination in Employment Act',
    lawCode: '29 USC §621 et seq.',
    effectiveDate: '1967-06-12',
    summary:
      'Prohibits discrimination against workers 40+. AI screening using graduation year, years of experience caps, or "digital native" criteria creates age proxies that violate ADEA even without explicit age filters.',
    triggers: [
      'AI screening produces disparate impact on older workers (40+)',
      'AI uses graduation date as selection criteria',
      'AI filters by maximum years of experience',
      'AI preference for "digital native" or recent graduate criteria',
      'AI excludes "overqualified" candidates (often age proxy)',
    ],
    requirements: [
      {
        id: 'federal-adea-nondiscrimination',
        type: 'assessment',
        description: 'Ensure AI does not produce age-based disparate impact',
        details:
          'Employers must ensure AI hiring tools do not produce unjustified disparate impact on workers age 40 and older. AI criteria that correlate with age (graduation year, years of experience caps, "overqualified" filters) violate ADEA if not justified by business necessity.',
        toolTypes: ['screening', 'ats', 'assessment'],
      },
      {
        id: 'federal-adea-validation',
        type: 'assessment',
        description: 'Validate AI criteria for business necessity',
        details:
          'If AI tool produces age-based disparate impact, employer must show selection criteria are based on reasonable factors other than age (RFOA) and are job-related.',
        toolTypes: ['screening', 'ats', 'assessment'],
      },
    ],
    penalties: [
      'EEOC enforcement actions',
      'Back pay (no cap)',
      'Front pay',
      'Liquidated damages (equal to back pay for willful violations — doubles recovery)',
      'Compensatory and punitive damages NOT available under ADEA (unlike Title VII)',
      'Injunctive relief',
      'Attorney fees and costs',
    ],
    exemptions: [
      'Bona fide occupational qualification (BFOQ) based on age — extremely narrow',
      'Bona fide seniority systems',
      'Reasonable factors other than age (RFOA) — employer must prove',
    ],
    relatedLaws: ['federal-title-vii', 'federal-ada'],
    category: 'age-discrimination',
  },

  // ─────────────────────────────────────────────
  // CALIFORNIA — CCPA/CPRA Data Privacy
  // ─────────────────────────────────────────────
  {
    id: 'ca-ccpa',
    jurisdiction: 'CA',
    jurisdictionName: 'California',
    lawName: 'California Consumer Privacy Act / California Privacy Rights Act',
    lawCode: 'Cal. Civ. Code §1798.100 et seq.',
    effectiveDate: '2020-01-01',
    summary:
      'Applicant data processed by AI = personal information. Applicants (and as of 2023, employees to a degree) have rights to opt-out of profiling, deletion, and disclosure. Automated decision-making triggers notice requirements.',
    triggers: [
      'Collection of personal information from California applicants',
      'Profiling or automated decision-making using applicant data',
      'Sale or sharing of applicant personal information',
      'Use of sensitive personal information (biometrics, precise geolocation, etc.)',
    ],
    requirements: [
      {
        id: 'ca-ccpa-notice',
        type: 'notice',
        description: 'Privacy notice at or before collection',
        details:
          'Businesses must provide notice at or before collection of personal information, disclosing categories of PI collected, purposes of use, and whether PI is sold or shared. For applicants, include this in application flow or privacy policy.',
        deadline: 'At or before collection',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'ca-ccpa-optout',
        type: 'opt-out',
        description: 'Right to opt out of sale/sharing and profiling',
        details:
          'Applicants have the right to opt out of the sale or sharing of their personal information and to opt out of profiling in furtherance of decisions that produce legal or similarly significant effects (including employment decisions). Must provide "Do Not Sell or Share My Personal Information" link.',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'ca-ccpa-deletion',
        type: 'retention',
        description: 'Right to deletion',
        details:
          'Applicants have the right to request deletion of their personal information, subject to exceptions (e.g., legal compliance, transactional necessity). Businesses must delete or de-identify PI upon verified request.',
        deadline: 'Within 45 days of verified request (may extend 45 days with notice)',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
    ],
    penalties: [
      'Administrative fines: $2,500 per violation, $7,500 per intentional violation',
      'Private right of action for data breaches: $100-$750 per consumer per incident',
      'Injunctive relief',
      'CPPA enforcement',
    ],
    exemptions: [
      'Employee and B2B personal information (partially exempt, expiring)',
      'Publicly available information',
      'Deidentified or aggregate data',
      'Information subject to sector-specific privacy laws (HIPAA, GLBA, FCRA)',
    ],
    relatedLaws: ['va-cdpa', 'co-cpa-privacy', 'ct-cdpa'],
    category: 'data-privacy',
  },

  // ─────────────────────────────────────────────
  // VIRGINIA — Consumer Data Protection Act
  // ─────────────────────────────────────────────
  {
    id: 'va-cdpa',
    jurisdiction: 'VA',
    jurisdictionName: 'Virginia',
    lawName: 'Virginia Consumer Data Protection Act',
    lawCode: 'VA Code §59.1-571 et seq.',
    effectiveDate: '2023-01-01',
    summary:
      'Applicants have opt-out rights for profiling in furtherance of decisions with legal/similarly significant effects. Deletion rights. No private right of action — AG enforcement only.',
    triggers: [
      'Processing personal data of Virginia residents (including applicants)',
      'Profiling in furtherance of decisions with legal or similarly significant effects',
      'Sale of personal data',
      'Targeted advertising',
    ],
    requirements: [
      {
        id: 'va-cdpa-notice',
        type: 'notice',
        description: 'Privacy notice',
        details:
          'Controllers must provide a reasonably accessible, clear, and meaningful privacy notice disclosing categories of personal data processed, purposes, how to exercise consumer rights, and categories of third parties with whom data is shared.',
        deadline: 'At or before collection',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'va-cdpa-optout',
        type: 'opt-out',
        description: 'Right to opt out of profiling and targeted advertising',
        details:
          'Consumers have the right to opt out of the processing of personal data for purposes of targeted advertising, sale, or profiling in furtherance of decisions that produce legal or similarly significant effects. Must provide mechanism to opt out.',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'va-cdpa-deletion',
        type: 'retention',
        description: 'Right to deletion',
        details:
          'Consumers have the right to request deletion of personal data provided by or obtained about the consumer. Controllers must delete or anonymize upon verified request, subject to exceptions.',
        deadline: 'Within 45 days of verified request',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
    ],
    penalties: [
      'Enforcement exclusively by Virginia Attorney General',
      'No private right of action',
      'Injunctive relief',
      'Attorney fees',
      '30-day cure period for first violation',
    ],
    exemptions: [
      'Employment records (limited exemption)',
      'Nonprofit organizations',
      'Higher education institutions',
      'Information subject to GLBA, HIPAA, FCRA',
    ],
    relatedLaws: ['ca-ccpa', 'co-cpa-privacy', 'ct-cdpa'],
    category: 'data-privacy',
  },

  // ─────────────────────────────────────────────
  // COLORADO — Privacy Act
  // ─────────────────────────────────────────────
  {
    id: 'co-cpa-privacy',
    jurisdiction: 'CO',
    jurisdictionName: 'Colorado',
    lawName: 'Colorado Privacy Act',
    lawCode: 'Colo. Rev. Stat. §6-1-1301 et seq.',
    effectiveDate: '2023-07-01',
    summary:
      'Applicants have opt-out rights for profiling. Controllers must conduct data protection assessments for high-risk processing activities, including profiling that presents reasonably foreseeable risk of unfair or deceptive treatment or disparate impact.',
    triggers: [
      'Processing personal data of Colorado residents (including applicants)',
      'Profiling in furtherance of decisions with legal or similarly significant effects',
      'Sale of personal data or targeted advertising',
      'Processing sensitive data',
    ],
    requirements: [
      {
        id: 'co-cpa-privacy-notice',
        type: 'notice',
        description: 'Privacy notice',
        details:
          'Controllers must provide a reasonably accessible and clear privacy notice disclosing categories of personal data processed, purposes, how to exercise consumer rights, categories of third parties with whom data is shared, and categories of personal data sold.',
        deadline: 'At or before collection',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'co-cpa-privacy-optout',
        type: 'opt-out',
        description: 'Right to opt out of profiling, targeted advertising, and sale',
        details:
          'Consumers have the right to opt out of the processing of personal data for purposes of targeted advertising, sale, or profiling in furtherance of decisions that produce legal or similarly significant effects. Must provide clear and conspicuous mechanism.',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'co-cpa-privacy-assessment',
        type: 'assessment',
        description: 'Data protection assessment for high-risk processing',
        details:
          'Controllers must conduct and document data protection assessments for processing activities that present a heightened risk of harm, including profiling where there is a reasonably foreseeable risk of unfair or deceptive treatment, disparate impact, or intrusion upon reasonable expectations. Assessments must identify and weigh benefits against risks.',
        deadline: 'Before high-risk processing begins',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
    ],
    penalties: [
      'Enforcement by Colorado Attorney General',
      'No private right of action',
      'Civil penalties up to $20,000 per violation',
      'Injunctive relief',
      '60-day cure period (may be eliminated after Jan 1, 2025)',
    ],
    exemptions: [
      'Employee data (limited exemption)',
      'Nonprofit organizations',
      'Higher education institutions',
      'Information subject to GLBA, HIPAA, FCRA',
    ],
    relatedLaws: ['ca-ccpa', 'va-cdpa', 'ct-cdpa'],
    category: 'data-privacy',
  },

  // ─────────────────────────────────────────────
  // CONNECTICUT — Data Privacy Act
  // ─────────────────────────────────────────────
  {
    id: 'ct-cdpa',
    jurisdiction: 'CT',
    jurisdictionName: 'Connecticut',
    lawName: 'Connecticut Data Privacy Act',
    lawCode: 'CT Gen. Stat. §42-515 et seq.',
    effectiveDate: '2023-07-01',
    summary:
      'Applicants have opt-out rights for profiling and targeted advertising. Controllers must conduct data protection assessments for profiling that presents reasonably foreseeable risk of unfair or deceptive treatment or disparate impact. Similar to Colorado CPA.',
    triggers: [
      'Processing personal data of Connecticut residents (including applicants)',
      'Profiling in furtherance of decisions with legal or similarly significant effects',
      'Sale of personal data or targeted advertising',
      'Processing sensitive data',
    ],
    requirements: [
      {
        id: 'ct-cdpa-notice',
        type: 'notice',
        description: 'Privacy notice',
        details:
          'Controllers must provide a reasonably accessible, clear, and meaningful privacy notice disclosing categories of personal data processed, purposes, how to exercise consumer rights, and categories of third parties receiving personal data.',
        deadline: 'At or before collection',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'ct-cdpa-optout',
        type: 'opt-out',
        description: 'Right to opt out of profiling, targeted advertising, and sale',
        details:
          'Consumers have the right to opt out of the processing of personal data for purposes of targeted advertising, sale, or profiling in furtherance of decisions that produce legal or similarly significant effects. Must provide clear notice and mechanism.',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'ct-cdpa-assessment',
        type: 'assessment',
        description: 'Data protection assessment for high-risk processing',
        details:
          'Controllers must conduct and document data protection assessments for processing activities that present a heightened risk of harm, including profiling where there is a reasonably foreseeable risk of unfair or deceptive treatment, financial or physical injury, or other substantial injury. Must weigh benefits against risks.',
        deadline: 'Before high-risk processing begins',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
      {
        id: 'ct-cdpa-deletion',
        type: 'retention',
        description: 'Right to deletion',
        details:
          'Consumers have the right to request deletion of personal data provided by or obtained about the consumer. Controllers must delete upon verified request, subject to exceptions.',
        deadline: 'Within 45 days of verified request',
        toolTypes: ['screening', 'ats', 'assessment', 'video-interview'],
      },
    ],
    penalties: [
      'Enforcement by Connecticut Attorney General',
      'No private right of action',
      'Civil penalties: $1,000 to $5,000 per violation',
      'Injunctive relief',
      '60-day cure period for violations discovered before Jan 1, 2025',
    ],
    exemptions: [
      'Employee data (limited exemption)',
      'Nonprofit organizations',
      'Higher education institutions',
      'Information subject to GLBA, HIPAA, FCRA',
    ],
    relatedLaws: ['ca-ccpa', 'va-cdpa', 'co-cpa-privacy'],
    category: 'data-privacy',
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
