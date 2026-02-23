// Glossary terms for programmatic SEO pages
export const GLOSSARY_TERMS = [
  {
    slug: 'aedt',
    term: 'AEDT',
    fullName: 'Automated Employment Decision Tool',
    definition: 'Any computational process, derived from machine learning, statistical modeling, data analytics, or artificial intelligence, that issues simplified output, including a score, classification, or recommendation, that is used to substantially assist or replace discretionary decision making for employment decisions that impact natural persons.',
    whyItMatters: 'AEDTs are the central focus of NYC Local Law 144 and similar regulations. If your AI hiring tool falls under this definition, you likely need bias audits and candidate notifications.',
    relatedLaws: ['NYC Local Law 144', 'Proposed NJ S-1943'],
    examples: [
      'AI resume screening software',
      'Video interview analysis tools',
      'Chatbots that filter candidates',
      'Automated assessment scoring systems'
    ],
    relatedTerms: ['bias-audit', 'disparate-impact', 'adverse-action-notice']
  },
  {
    slug: 'bias-audit',
    term: 'Bias Audit',
    fullName: 'Independent Bias Audit',
    definition: 'An impartial evaluation by an independent auditor that includes testing an AEDT for disparate impact based on race, ethnicity, and sex. The audit examines selection rates, scoring rates, or other outputs to identify potential discrimination.',
    whyItMatters: 'NYC Local Law 144 requires annual bias audits before using an AEDT. Audits must be conducted by independent third parties and results must be publicly posted.',
    relatedLaws: ['NYC Local Law 144', 'Proposed NJ S-1943', 'Proposed CA AB 331'],
    examples: [
      'Statistical analysis of selection rates by demographic group',
      'Impact ratio calculations comparing selection rates',
      'Testing for adverse impact in scoring distributions'
    ],
    relatedTerms: ['aedt', 'disparate-impact', 'impact-ratio']
  },
  {
    slug: 'disparate-impact',
    term: 'Disparate Impact',
    fullName: 'Disparate Impact Discrimination',
    definition: 'A form of discrimination that occurs when a facially neutral policy or practice disproportionately affects members of a protected class, even without discriminatory intent. In AI hiring, this often manifests as algorithms that systematically disadvantage certain demographic groups.',
    whyItMatters: 'The 4/5ths rule (or 80% rule) is commonly used to evaluate disparate impact. If a selection rate for any group is less than 80% of the rate for the highest-scoring group, disparate impact may exist.',
    relatedLaws: ['Title VII', 'NYC Local Law 144', 'Colorado AI Act', 'All state AI hiring laws'],
    examples: [
      'Resume screening that filters out names associated with certain ethnicities',
      'Video analysis that scores based on facial features correlated with race',
      'Language analysis that disadvantages non-native speakers'
    ],
    relatedTerms: ['bias-audit', 'four-fifths-rule', 'algorithmic-discrimination']
  },
  {
    slug: 'adverse-action-notice',
    term: 'Adverse Action Notice',
    fullName: 'Adverse Action Notification',
    definition: 'A notification provided to a candidate or employee when a negative employment decision is made based wholly or partially on information obtained through automated means. The notice typically must explain the decision, the data used, and appeal rights.',
    whyItMatters: 'Multiple laws require adverse action notices when AI influences negative decisions. Colorado AI Act requires statement of reasons, opportunity to correct data, and human review appeal rights.',
    relatedLaws: ['Colorado AI Act', 'FCRA', 'Illinois AIVI'],
    examples: [
      'Rejection notification explaining AI was used in screening',
      'Notice of right to request human review of AI decision',
      'Explanation of factors that contributed to automated assessment'
    ],
    relatedTerms: ['aedt', 'human-review', 'right-to-explanation']
  },
  {
    slug: 'impact-assessment',
    term: 'Impact Assessment',
    fullName: 'AI Impact Assessment / Algorithmic Impact Assessment',
    definition: 'A systematic evaluation of how an AI system may affect individuals and groups, particularly regarding potential discrimination, privacy, and civil rights implications. Assessments typically document the system\'s purpose, data inputs, decision logic, and safeguards.',
    whyItMatters: 'Colorado AI Act requires annual impact assessments for high-risk AI systems. These must be completed within 90 days of any substantial modification and retained for at least 5 years.',
    relatedLaws: ['Colorado AI Act', 'EU AI Act', 'Proposed federal legislation'],
    examples: [
      'Documentation of AI system purpose and intended use',
      'Analysis of training data for potential bias',
      'Evaluation of safeguards against algorithmic discrimination',
      'Assessment of consumer notification adequacy'
    ],
    relatedTerms: ['high-risk-ai-system', 'nist-ai-rmf', 'risk-management']
  },
  {
    slug: 'high-risk-ai-system',
    term: 'High-Risk AI System',
    fullName: 'High-Risk Artificial Intelligence System',
    definition: 'Under the Colorado AI Act, any AI system that makes or is a substantial factor in making a "consequential decision" affecting consumers. In employment, this includes decisions about hiring, firing, promotions, compensation, and job assignments.',
    whyItMatters: 'If your AI system qualifies as "high-risk," you\'re subject to the full requirements of the Colorado AI Act including impact assessments, risk management programs, and consumer notifications.',
    relatedLaws: ['Colorado AI Act', 'EU AI Act'],
    examples: [
      'AI resume screening tools',
      'Automated interview scoring',
      'Algorithmic performance evaluation',
      'AI-driven promotion recommendations'
    ],
    relatedTerms: ['impact-assessment', 'consequential-decision', 'algorithmic-discrimination']
  },
  {
    slug: 'bipa',
    term: 'BIPA',
    fullName: 'Biometric Information Privacy Act (Illinois)',
    definition: 'Illinois law that regulates the collection, use, storage, and destruction of biometric identifiers and biometric information. Requires informed written consent before collecting biometric data and prohibits sale or profit from biometric information.',
    whyItMatters: 'BIPA has a private right of action with damages of $1,000-$5,000 per violation. AI video interviews that analyze facial features may trigger BIPA requirements.',
    relatedLaws: ['Illinois BIPA', 'Texas CUBI', 'Washington My Health My Data Act'],
    examples: [
      'Facial geometry scanning in video interviews',
      'Voice print analysis during phone screens',
      'Fingerprint collection for employee verification',
      'Retina scans for building access'
    ],
    relatedTerms: ['aivi', 'biometric-data', 'informed-consent']
  },
  {
    slug: 'aivi',
    term: 'AIVI',
    fullName: 'Artificial Intelligence Video Interview Act (Illinois)',
    definition: 'Illinois law requiring employers to notify applicants and obtain consent before using AI to analyze video interviews. Employers must explain how AI works and what characteristics it evaluates.',
    whyItMatters: 'AIVI was one of the first AI-specific hiring laws in the US. If you use AI video interview analysis for applicants in Illinois, you need written consent and must provide explanations.',
    relatedLaws: ['Illinois AIVI (HB 2557)', 'Maryland HB 1202'],
    examples: [
      'HireVue video interview analysis',
      'AI-powered facial expression analysis',
      'Automated voice tone evaluation',
      'Body language assessment algorithms'
    ],
    relatedTerms: ['bipa', 'informed-consent', 'video-interview']
  },
  {
    slug: 'algorithmic-discrimination',
    term: 'Algorithmic Discrimination',
    fullName: 'Algorithmic Discrimination / Algorithmic Bias',
    definition: 'Any condition in which the use of an AI system results in an unlawful differential treatment or impact that disfavors individuals based on their actual or perceived membership in a protected class.',
    whyItMatters: 'Colorado AI Act\'s central requirement is using "reasonable care" to protect consumers from algorithmic discrimination. This is the harm all AI hiring regulations seek to prevent.',
    relatedLaws: ['Colorado AI Act', 'NYC Local Law 144', 'Title VII'],
    examples: [
      'AI that systematically scores male candidates higher',
      'Resume screening that filters out names associated with certain races',
      'Assessment tools calibrated on non-representative training data',
      'Algorithms that penalize employment gaps (affecting women more)'
    ],
    relatedTerms: ['disparate-impact', 'bias-audit', 'protected-class']
  },
  {
    slug: 'four-fifths-rule',
    term: 'Four-Fifths Rule',
    fullName: 'Four-Fifths Rule (80% Rule)',
    definition: 'A guideline for determining adverse impact in employment selection. If the selection rate for a protected group is less than 80% (or 4/5ths) of the selection rate for the group with the highest rate, adverse impact may be indicated.',
    whyItMatters: 'This is the standard metric used in bias audits under NYC Local Law 144 and is commonly applied to evaluate AI hiring tools for potential discrimination.',
    relatedLaws: ['EEOC Uniform Guidelines', 'NYC Local Law 144'],
    examples: [
      'If 60% of white candidates pass screening but only 45% of Black candidates pass, the impact ratio is 75% (45/60) — below the 80% threshold',
      'Comparing selection rates across gender, race, and ethnicity categories'
    ],
    relatedTerms: ['disparate-impact', 'bias-audit', 'impact-ratio']
  },
  {
    slug: 'impact-ratio',
    term: 'Impact Ratio',
    fullName: 'Impact Ratio / Selection Rate Ratio',
    definition: 'The ratio comparing the selection rate of one demographic group to another, typically expressed as the rate for the lower-selected group divided by the rate for the higher-selected group. Used to quantify potential disparate impact.',
    whyItMatters: 'NYC Local Law 144 bias audits must calculate impact ratios for race/ethnicity categories and sex. These metrics help identify which tools may be discriminating.',
    relatedLaws: ['NYC Local Law 144', 'EEOC Guidelines'],
    examples: [
      'Selection rate ratio = (Selection rate of Group A) / (Selection rate of Group B)',
      'Scoring rate ratio for assessment tools',
      'Pass-through rates at each stage of automated screening'
    ],
    relatedTerms: ['four-fifths-rule', 'bias-audit', 'disparate-impact']
  },
  {
    slug: 'nist-ai-rmf',
    term: 'NIST AI RMF',
    fullName: 'NIST Artificial Intelligence Risk Management Framework',
    definition: 'A voluntary framework developed by the National Institute of Standards and Technology to help organizations design, develop, deploy, and use AI systems in ways that minimize negative impacts and maximize trustworthiness.',
    whyItMatters: 'Colorado AI Act explicitly references NIST AI RMF as a recognized framework. Aligning with NIST can provide an affirmative defense against enforcement actions.',
    relatedLaws: ['Colorado AI Act'],
    examples: [
      'Implementing the GOVERN, MAP, MEASURE, MANAGE functions',
      'Documenting AI system trustworthiness characteristics',
      'Establishing AI governance structures',
      'Creating AI risk management policies'
    ],
    relatedTerms: ['impact-assessment', 'risk-management', 'high-risk-ai-system']
  },
  {
    slug: 'human-review',
    term: 'Human Review',
    fullName: 'Human Review / Human-in-the-Loop',
    definition: 'The requirement that a human being review and have meaningful involvement in employment decisions that are informed by AI systems. May include the right to appeal automated decisions to a human reviewer.',
    whyItMatters: 'Colorado AI Act requires providing appeal opportunities with human review for adverse decisions. Many frameworks require humans to have final authority over consequential AI-driven decisions.',
    relatedLaws: ['Colorado AI Act', 'EU AI Act', 'GDPR Article 22'],
    examples: [
      'HR professional reviewing AI screening recommendations',
      'Appeal process where human reconsiders AI-flagged applications',
      'Human verification of AI assessment scores before rejection'
    ],
    relatedTerms: ['adverse-action-notice', 'right-to-explanation', 'consequential-decision']
  },
  {
    slug: 'consequential-decision',
    term: 'Consequential Decision',
    fullName: 'Consequential Decision',
    definition: 'Under Colorado AI Act, a decision that has a material legal or similarly significant effect on a consumer. In employment, this includes decisions that affect terms of employment, hiring, firing, promotions, and compensation.',
    whyItMatters: 'If your AI system influences consequential decisions, it\'s considered "high-risk" under Colorado law and triggers full compliance requirements.',
    relatedLaws: ['Colorado AI Act'],
    examples: [
      'Decision to reject a job applicant',
      'Recommendation to promote or demote an employee',
      'Determination of compensation levels',
      'Decision to terminate employment'
    ],
    relatedTerms: ['high-risk-ai-system', 'impact-assessment', 'human-review']
  },
  {
    slug: 'informed-consent',
    term: 'Informed Consent',
    fullName: 'Informed Consent for AI Use',
    definition: 'The requirement to clearly disclose AI use to candidates/employees and obtain their agreement before processing their data with AI systems. Must include explanation of what AI is used, what it evaluates, and how decisions are made.',
    whyItMatters: 'Illinois AIVI and BIPA require informed, written consent. Failure to obtain proper consent can result in significant penalties, especially under BIPA\'s private right of action.',
    relatedLaws: ['Illinois AIVI', 'Illinois BIPA', 'Maryland HB 1202', 'Colorado AI Act'],
    examples: [
      'Written notice before AI video interview explaining analysis methods',
      'Consent form detailing biometric data collection',
      'Disclosure of AI use in resume screening'
    ],
    relatedTerms: ['aivi', 'bipa', 'adverse-action-notice']
  },
  {
    slug: 'ccpa-admt',
    term: 'CCPA ADMT',
    fullName: 'California Consumer Privacy Act - Automated Decision-Making Technology Regulations',
    definition: 'California regulations under CCPA/CPRA governing automated decision-making technology that uses personal information to make or facilitate decisions that produce legal or similarly significant effects. Requires businesses to provide opt-out rights, transparency about logic, and access to information used in automated decisions.',
    whyItMatters: 'California ADMT regulations apply to AI hiring tools that substantially assist employment decisions. Employers must provide candidates/employees notice of automated decision-making, explain the logic involved, and offer opt-out options or human review where feasible.',
    relatedLaws: ['California CCPA/CPRA', 'Colorado AI Act', 'EU GDPR Article 22'],
    examples: [
      'AI resume screening that substantially determines interview selection',
      'Automated assessment scoring used for hiring decisions',
      'Algorithmic performance evaluation systems',
      'AI-driven promotion recommendation engines'
    ],
    relatedTerms: ['aedt', 'right-to-explanation', 'human-review', 'algorithmic-discrimination']
  },
  {
    slug: 'transparency-report',
    term: 'Transparency Report',
    fullName: 'AI Transparency Report',
    definition: 'Public documentation disclosing how AI systems are used in employment decisions, including bias audit results, fairness metrics, and system capabilities. Some jurisdictions require publication of transparency reports as part of AEDT compliance.',
    whyItMatters: 'NYC Local Law 144 requires employers to publicly post bias audit results. Leading AI hiring vendors publish voluntary transparency reports demonstrating algorithmic fairness and compliance commitment. Transparency builds trust with candidates and regulators.',
    relatedLaws: ['NYC Local Law 144', 'Proposed federal AI legislation', 'EU AI Act'],
    examples: [
      'HireVue\'s annual bias audit reports published online',
      'Pymetrics\' algorithmic fairness methodology disclosures',
      'LinkedIn\'s AI transparency principles and documentation',
      'Annual bias audit results required under NYC LL144'
    ],
    relatedTerms: ['bias-audit', 'algorithmic-accountability', 'aedt', 'impact-assessment']
  },
  {
    slug: 'right-to-explanation',
    term: 'Right to Explanation',
    fullName: 'Right to Explanation of Automated Decisions',
    definition: 'The right of individuals to receive meaningful information about the logic, significance, and consequences of automated decision-making systems that affect them. Includes understanding what data was used, how it was processed, and why a particular outcome was reached.',
    whyItMatters: 'Colorado AI Act and CCPA ADMT regulations require employers to provide explanations of AI-driven employment decisions when requested. Candidates have right to know how AI influenced hiring/promotion/termination decisions and what factors were considered.',
    relatedLaws: ['Colorado AI Act', 'CCPA ADMT', 'EU GDPR Article 22', 'Illinois AIVI'],
    examples: [
      'Explaining why AI ranked a candidate lower than others',
      'Disclosing what resume keywords triggered automated rejection',
      'Clarifying how video interview AI assessed candidate responses',
      'Providing factor breakdown for AI-generated performance scores'
    ],
    relatedTerms: ['adverse-action-notice', 'human-review', 'ccpa-admt', 'algorithmic-discrimination']
  },
  {
    slug: 'algorithmic-accountability',
    term: 'Algorithmic Accountability',
    fullName: 'Algorithmic Accountability',
    definition: 'The principle that organizations deploying AI systems must be responsible and answerable for their algorithms\' outcomes, including discriminatory impacts. Encompasses transparency, auditability, bias testing, human oversight, and remediation of algorithmic harms.',
    whyItMatters: 'Emerging AI hiring laws establish algorithmic accountability frameworks requiring employers to audit, monitor, and remediate biased AI systems. Accountability means employers can\'t outsource liability to vendors - deployers remain responsible for discrimination caused by AI they use.',
    relatedLaws: ['NYC Local Law 144', 'Colorado AI Act', 'Illinois HRAB', 'Proposed federal AI legislation'],
    examples: [
      'Conducting annual bias audits of AI hiring tools',
      'Maintaining documentation of AI system testing and validation',
      'Establishing AI governance committees with oversight authority',
      'Creating processes to investigate and remediate AI-caused discrimination'
    ],
    relatedTerms: ['bias-audit', 'transparency-report', 'impact-assessment', 'vendor-due-diligence']
  },
  {
    slug: 'consent-withdrawal',
    term: 'Consent Withdrawal',
    fullName: 'Right to Withdraw Consent',
    definition: 'The right of candidates and employees to withdraw previously-given consent for AI processing of their data at any time. Under laws like Illinois BIPA and AIVI, individuals can revoke consent and require deletion of biometric data or AI analysis.',
    whyItMatters: 'Illinois AIVI requires employers to delete video interview recordings within 30 days of candidate request. BIPA allows withdrawal of biometric data consent anytime. Employers must have processes to honor withdrawal requests promptly and completely.',
    relatedLaws: ['Illinois AIVI', 'Illinois BIPA', 'CCPA/CPRA', 'GDPR'],
    examples: [
      'Candidate requests deletion of video interview with AI analysis',
      'Employee withdraws consent for biometric clock-in system',
      'Applicant opts out of AI resume screening mid-process',
      'Worker requires removal from facial recognition system database'
    ],
    relatedTerms: ['informed-consent', 'right-to-opt-out', 'bipa', 'aivi']
  },
  {
    slug: 'right-to-opt-out',
    term: 'Right to Opt-Out',
    fullName: 'Right to Opt-Out of Automated Decision-Making',
    definition: 'The right to refuse or withdraw from AI-driven employment processes and receive alternative human-based evaluation. Some jurisdictions require employers to offer non-AI alternatives when candidates opt out of automated screening.',
    whyItMatters: 'Colorado AI Act and CCPA ADMT grant rights to opt-out of certain automated decisions. NYC LL144 requires offering alternative selection processes upon request. Employers must provide meaningful alternatives, not just token options.',
    relatedLaws: ['Colorado AI Act', 'CCPA ADMT', 'NYC Local Law 144', 'EU GDPR Article 22'],
    examples: [
      'Offering traditional resume review instead of AI screening',
      'Providing live interview option instead of AI video analysis',
      'Human-scored assessment alternative to AI scoring',
      'Manual background check adjudication instead of automated decisions'
    ],
    relatedTerms: ['human-review', 'consent-withdrawal', 'adverse-action-notice', 'ccpa-admt']
  },
  {
    slug: 'human-oversight',
    term: 'Human Oversight',
    fullName: 'Human Oversight of AI Systems',
    definition: 'The requirement that humans maintain meaningful control, supervision, and decision authority over AI systems used in employment. Human oversight ensures AI assists rather than replaces human judgment and provides accountability for outcomes.',
    whyItMatters: 'Best practice and emerging legal requirements mandate human oversight of AI hiring tools. Colorado AI Act emphasizes human review of consequential decisions. Effective oversight means humans have authority to override AI and are trained to identify and correct errors.',
    relatedLaws: ['Colorado AI Act', 'EU AI Act', 'NYC Local Law 144 best practices'],
    examples: [
      'HR professionals reviewing AI-flagged candidates before rejection',
      'Managers having authority to override AI recommendations',
      'Compliance officers monitoring AI system performance metrics',
      'Designated humans responsible for bias audit review and remediation'
    ],
    relatedTerms: ['human-review', 'algorithmic-accountability', 'consequential-decision', 'aedt']
  },
  {
    slug: 'facial-recognition-ban',
    term: 'Facial Recognition Ban',
    fullName: 'Facial Recognition Technology Bans',
    definition: 'Legal prohibitions on using facial recognition technology in employment contexts. Some jurisdictions ban facial recognition entirely, others restrict it for hiring/screening, and some require consent and regulation. Bans aim to prevent biometric surveillance and discrimination.',
    whyItMatters: 'Portland, San Francisco, and other cities have banned government use of facial recognition. Illinois BIPA and Maryland HB 1202 heavily regulate facial recognition in hiring. HireVue discontinued facial analysis feature in 2021 due to regulatory pressure. Employers must verify AI video interview tools don\'t use facial recognition.',
    relatedLaws: ['Illinois BIPA', 'Maryland HB 1202', 'Portland facial recognition ban', 'San Francisco ban'],
    examples: [
      'Video interview platforms analyzing facial movements/expressions',
      'Biometric time clocks using facial recognition',
      'Security systems analyzing employee faces for access control',
      'AI assessing candidate "micro-expressions" during interviews'
    ],
    relatedTerms: ['bipa', 'aivi', 'biometric-data', 'video-interview']
  },
  {
    slug: 'predictive-analytics',
    term: 'Predictive Analytics',
    fullName: 'Predictive Analytics in Employment',
    definition: 'Use of statistical models and machine learning to predict future employment outcomes such as job performance, turnover risk, promotion readiness, or hiring success. Predictive models analyze historical data to forecast which candidates/employees will succeed or fail.',
    whyItMatters: 'Predictive analytics substantially assist or determine employment decisions, triggering AEDT requirements. Prediction based on historical data risks perpetuating past discrimination. Attrition prediction and performance forecasting raise profiling concerns under CCPA ADMT.',
    relatedLaws: ['NYC Local Law 144', 'Colorado AI Act', 'CCPA ADMT', 'Illinois HRAB'],
    examples: [
      'AI predicting which candidates will be top performers',
      'Machine learning identifying employees at risk of quitting',
      'Algorithms forecasting promotion readiness or leadership potential',
      'Models predicting cultural fit or tenure likelihood'
    ],
    relatedTerms: ['aedt', 'algorithmic-discrimination', 'disparate-impact', 'ccpa-admt']
  },
  {
    slug: 'natural-language-processing',
    term: 'NLP in Hiring',
    fullName: 'Natural Language Processing in Hiring',
    definition: 'Use of NLP and large language models to analyze text in resumes, cover letters, applications, interview transcripts, or performance reviews. NLP extracts meaning, sentiment, skills, and qualifications from human language to evaluate candidates or employees.',
    whyItMatters: 'NLP powers most AI hiring tools - resume parsers, video interview analysis (analyzing spoken words), chatbot screening, and assessment scoring. NLP can embed bias from training data, disadvantage non-native speakers, or penalize communication styles associated with protected classes.',
    relatedLaws: ['NYC Local Law 144', 'Illinois AIVI', 'Colorado AI Act', 'Title VII'],
    examples: [
      'Parsing resumes to extract skills and experience',
      'Analyzing video interview transcripts to assess competencies',
      'Chatbot screening using conversational AI',
      'Sentiment analysis of candidate communication'
    ],
    relatedTerms: ['aedt', 'aivi', 'disparate-impact', 'video-interview']
  },
  {
    slug: 'employment-practice-liability',
    term: 'EPL',
    fullName: 'Employment Practices Liability',
    definition: 'Legal liability arising from employment-related claims including discrimination, wrongful termination, harassment, and wage violations. AI hiring tool use creates new EPL exposure if algorithms discriminate, vendors face liability for AI-caused harms, and insurance policies may exclude AI-related claims.',
    whyItMatters: 'AI hiring substantially increases employment practices liability risk. Discrimination claims based on algorithmic bias, class actions (Mobley v. Workday), and regulatory enforcement create major liability. Standard EPL insurance may not cover AI-related claims. Comprehensive risk management required.',
    relatedLaws: ['Title VII', 'ADA', 'ADEA', 'State discrimination laws', 'NYC Local Law 144'],
    examples: [
      'Class action lawsuit alleging AI screening discriminated by age/race',
      'EEOC charge claiming automated hiring process disparate impact',
      'Wrongful termination suit based on AI performance monitoring',
      'Disability discrimination claim for AI assessment bias'
    ],
    relatedTerms: ['algorithmic-discrimination', 'disparate-impact', 'vendor-due-diligence', 'bias-audit']
  },
  {
    slug: 'vendor-due-diligence',
    term: 'Vendor Due Diligence',
    fullName: 'AI Vendor Due Diligence',
    definition: 'The process of evaluating AI hiring vendors before procurement to assess compliance capabilities, bias audit availability, data practices, liability allocation, and technical performance. Thorough due diligence protects employers from inheriting vendor AI risks.',
    whyItMatters: 'Employers are ultimately liable for discrimination caused by vendor AI tools. NYC LL144 applies even when using third-party AEDTs. Vendor due diligence must verify bias audit availability, contractual liability protections, security practices, and vendor compliance support.',
    relatedLaws: ['NYC Local Law 144', 'Colorado AI Act', 'FCRA', 'Data privacy laws'],
    examples: [
      'Requesting vendor bias audit reports before procurement',
      'Reviewing vendor contracts for indemnification and liability terms',
      'Evaluating vendor data security and privacy practices',
      'Requiring vendor compliance documentation and support commitments'
    ],
    relatedTerms: ['bias-audit', 'algorithmic-accountability', 'employment-practice-liability', 'aedt']
  },
  {
    slug: 'compliance-certification',
    term: 'Compliance Certification',
    fullName: 'AI Compliance Certification',
    definition: 'Formal certification or attestation that an AI system meets specific fairness, accuracy, or compliance standards. May be self-certified by vendors, validated by third-party auditors, or required by regulations. Certifications provide evidence of compliance for deployers.',
    whyItMatters: 'As AI hiring regulations mature, compliance certifications are emerging. NYC LL144 requires independent bias audits (a form of certification). Future regulations may require compliance seals or certifications before AI tool deployment. Certifications help but don\'t eliminate employer liability.',
    relatedLaws: ['NYC Local Law 144', 'EU AI Act', 'Proposed ISO standards'],
    examples: [
      'Independent auditor certification of bias audit completion',
      'Vendor attestation of NIST AI RMF framework compliance',
      'Third-party validation of algorithmic fairness testing',
      'ISO standard certification for AI system quality (emerging)'
    ],
    relatedTerms: ['bias-audit', 'nist-ai-rmf', 'algorithmic-accountability', 'vendor-due-diligence']
  },
  {
    slug: 'reasonable-accommodation',
    term: 'Reasonable Accommodation',
    fullName: 'Reasonable Accommodation (ADA + AI Context)',
    definition: 'Employer obligation under ADA to modify application processes, assessments, or working conditions to enable individuals with disabilities to participate equally. AI hiring tools must provide accommodations such as extra time, alternative formats, or assistive technology compatibility.',
    whyItMatters: 'AI assessments (timed tests, video interviews, gamified assessments, cognitive tests) may disadvantage people with disabilities. Employers must provide reasonable accommodations: extended time, alternative assessment methods, accessible interfaces. Failure to accommodate AI-driven processes violates ADA.',
    relatedLaws: ['Americans with Disabilities Act (ADA)', 'Section 504 Rehabilitation Act', 'State disability laws'],
    examples: [
      'Providing extra time for timed AI coding assessments',
      'Offering alternative to video interview for candidates with visual/speech disabilities',
      'Screen reader compatibility for online assessments',
      'Human interview option for candidates unable to use AI chatbot screening'
    ],
    relatedTerms: ['disparate-impact', 'human-review', 'right-to-opt-out', 'algorithmic-discrimination']
  },
  {
    slug: 'protected-class',
    term: 'Protected Class',
    fullName: 'Protected Class / Protected Characteristics',
    definition: 'Groups protected from employment discrimination under federal and state laws. Federal protected classes include race, color, religion, national origin, sex, age (40+), disability, and genetic information. States add additional protections for sexual orientation, gender identity, marital status, and others.',
    whyItMatters: 'AI bias audits must test for disparate impact on protected classes. NYC LL144 specifically requires testing for race/ethnicity and sex. Algorithms trained on biased data may discriminate against protected classes even without explicit use of protected characteristics. Proxy variables can reveal protected status.',
    relatedLaws: ['Title VII', 'ADA', 'ADEA', 'GINA', 'State anti-discrimination laws', 'NYC Local Law 144'],
    examples: [
      'Race and ethnicity (Title VII)',
      'Sex, pregnancy, gender identity (Title VII + state laws)',
      'Age 40+ (ADEA)',
      'Disability (ADA)',
      'Religion, national origin, sexual orientation, veteran status'
    ],
    relatedTerms: ['disparate-impact', 'algorithmic-discrimination', 'bias-audit', 'four-fifths-rule']
  },
  {
    slug: 'risk-management',
    term: 'AI Risk Management',
    fullName: 'AI Risk Management Program',
    definition: 'Structured processes and governance to identify, assess, mitigate, and monitor risks associated with AI system deployment. Includes technical testing, bias audits, impact assessments, human oversight, incident response, and continuous monitoring.',
    whyItMatters: 'Colorado AI Act requires deployers to implement risk management policies for high-risk AI systems. NIST AI Risk Management Framework provides voluntary guidance. Effective risk management prevents algorithmic discrimination, ensures compliance, and limits liability exposure.',
    relatedLaws: ['Colorado AI Act', 'NIST AI RMF', 'EU AI Act', 'Best practices'],
    examples: [
      'Establishing AI governance committee with oversight authority',
      'Conducting pre-deployment impact assessments',
      'Implementing continuous bias monitoring',
      'Creating incident response plan for AI failures',
      'Maintaining risk register of all AI systems'
    ],
    relatedTerms: ['impact-assessment', 'nist-ai-rmf', 'algorithmic-accountability', 'high-risk-ai-system']
  },
] as const

export type GlossaryTerm = (typeof GLOSSARY_TERMS)[number]

export function getTermBySlug(slug: string) {
  return GLOSSARY_TERMS.find(t => t.slug === slug)
}

export function getAllTermSlugs() {
  return GLOSSARY_TERMS.map(t => t.slug)
}
