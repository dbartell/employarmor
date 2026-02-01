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
] as const

export type GlossaryTerm = (typeof GLOSSARY_TERMS)[number]

export function getTermBySlug(slug: string) {
  return GLOSSARY_TERMS.find(t => t.slug === slug)
}

export function getAllTermSlugs() {
  return GLOSSARY_TERMS.map(t => t.slug)
}
