// Resources data for markdown API
// Structured content for AI-consumable markdown versions of resource pages

export interface ResourceContent {
  slug: string
  title: string
  description: string
  sections: {
    heading: string
    content: string
    items?: string[]
  }[]
  relatedLinks?: { title: string; url: string }[]
}

export const RESOURCE_PAGES: ResourceContent[] = [
  {
    slug: 'nyc-local-law-144',
    title: 'NYC Local Law 144: Complete Employer Compliance Guide',
    description: 'How to comply with New York City\'s automated employment decision tool (AEDT) law. Bias audits, public disclosures, candidate notices, and annual requirements explained.',
    sections: [
      {
        heading: 'Key Facts',
        content: 'NYC Local Law 144 was one of the first US laws specifically regulating AI in hiring.',
        items: [
          'Effective Date: July 5, 2023 (already in effect)',
          'Enforced By: NYC Department of Consumer and Worker Protection (DCWP)',
          'Applies To: Employers and employment agencies using AEDTs in NYC',
          'Penalties: $500-$1,500 per violation'
        ]
      },
      {
        heading: 'What is an AEDT?',
        content: 'An Automated Employment Decision Tool (AEDT) is any computational process, derived from machine learning, statistical modeling, data analytics, or artificial intelligence, that issues a simplified output (score, classification, recommendation) to substantially assist or replace discretionary decision-making for employment decisions.',
        items: [
          'Resume screening software that ranks or scores candidates',
          'Video interview platforms that analyze responses, tone, or expressions',
          'Chatbots that screen candidates and make advancement recommendations',
          'Skills assessment tools with AI-powered scoring',
          'ATS features that automatically filter or prioritize applications'
        ]
      },
      {
        heading: 'Requirements Overview',
        content: 'Three main requirements must be met:',
        items: [
          '1. Independent Bias Audit: Must be conducted annually by an independent auditor analyzing selection/scoring rates by sex and race/ethnicity',
          '2. Public Disclosure: Summary of bias audit must be published on your website with dates, distribution info, and impact ratios',
          '3. Candidate Notice: Notify NYC candidates 10+ business days before AEDT use, including what the tool assesses and data sources used'
        ]
      },
      {
        heading: 'Bias Audit Requirements',
        content: 'The audit must calculate impact ratios for:',
        items: [
          'Sex categories: Male, Female, Unknown',
          'Race/Ethnicity: Hispanic/Latino, White, Black/African American, Native Hawaiian/Pacific Islander, Asian, Native American/Alaska Native, Two or More Races',
          'Intersectional categories: Sex combined with race/ethnicity',
          'Impact Ratio = Selection Rate for Category ÷ Selection Rate for Most Selected Category',
          'A ratio below 0.8 (four-fifths rule) may indicate adverse impact'
        ]
      },
      {
        heading: 'Penalties',
        content: 'DCWP enforces with escalating penalties:',
        items: [
          'First violation: $500 civil penalty',
          'Subsequent violations: $500-$1,500 per violation',
          'Each day without a bias audit = separate violation',
          'Each candidate not notified = separate violation'
        ]
      }
    ],
    relatedLinks: [
      { title: 'NYC Compliance Page', url: '/compliance/nyc' },
      { title: 'What Counts as AI in Hiring?', url: '/resources/what-counts-as-ai-hiring' },
      { title: 'Vendor Assessment Guide', url: '/resources/vendor-assessment-guide' }
    ]
  },
  {
    slug: 'illinois-ai-hiring-law',
    title: 'Illinois AI Hiring Law (HB 3773): Everything Employers Need to Know',
    description: 'A complete guide to Illinois\'s AI in hiring regulations, effective January 1, 2026. Learn what\'s required, who\'s covered, and how to comply.',
    sections: [
      {
        heading: 'Key Dates',
        content: '',
        items: [
          'Passed: August 9, 2024',
          'Effective: January 1, 2026',
          'Applies broadly to employers using AI for hiring decisions in Illinois'
        ]
      },
      {
        heading: 'What Does the Law Require?',
        content: 'Illinois HB 3773 imposes several requirements on employers using AI in hiring:',
        items: [
          '1. Notice to Applicants: Inform applicants that AI is being used and what it evaluates',
          '2. Notice to Employees: Similar notice for employees subject to AI-based decisions',
          '3. Prohibition on ZIP Code Discrimination: Cannot use ZIP code as a proxy for protected characteristics',
          '4. Annual Impact Assessments: Evaluate AI systems for disparate impact'
        ]
      },
      {
        heading: 'Who is Covered',
        content: 'The law applies to:',
        items: [
          'Employers using AI to make employment decisions affecting Illinois residents',
          'Employment agencies using AI on behalf of employers',
          'Both hiring decisions and ongoing employment decisions are covered'
        ]
      },
      {
        heading: 'Existing AIVI Requirements',
        content: 'Illinois also has the AI Video Interview Act (AIVI) requiring:',
        items: [
          'Disclosure that AI will analyze video interviews',
          'Explanation of how AI works and what it evaluates',
          'Written consent before recording',
          'Limited video sharing (only those involved in hiring)',
          'Video deletion within 30 days upon request'
        ]
      }
    ],
    relatedLinks: [
      { title: 'Illinois Compliance Page', url: '/compliance/illinois' },
      { title: 'AIVI Definition', url: '/glossary/aivi' },
      { title: 'BIPA Information', url: '/glossary/bipa' }
    ]
  },
  {
    slug: 'colorado-ai-act-employers',
    title: 'Colorado AI Act: Employer Requirements Explained',
    description: 'Impact assessments, consumer notifications, and opt-outs. Breaking down what Colorado\'s AI Act requires for employers using AI in hiring.',
    sections: [
      {
        heading: 'Key Dates',
        content: '',
        items: [
          'Signed: May 17, 2024',
          'Effective: February 1, 2026',
          'First-in-nation comprehensive AI regulation framework'
        ]
      },
      {
        heading: 'Is Your Hiring AI High-Risk?',
        content: 'Under the Colorado AI Act, "high-risk" AI systems include those making "consequential decisions" in employment such as:',
        items: [
          'Hiring, recruiting, or referral decisions',
          'Determining compensation or benefits',
          'Making promotion or termination decisions',
          'Assignment of work or performance evaluation'
        ]
      },
      {
        heading: 'Deployer Requirements',
        content: 'If you deploy high-risk AI, you must:',
        items: [
          '1. Risk Management: Implement policies to manage algorithmic discrimination risks',
          '2. Impact Assessments: Conduct assessments before deployment and annually',
          '3. Consumer Notice: Inform individuals when AI is used for consequential decisions',
          '4. Disclosure Statements: Provide statement explaining the AI system used',
          '5. Human Appeal Process: Allow individuals to appeal AI decisions to a human'
        ]
      },
      {
        heading: 'Impact Assessment Contents',
        content: 'Your impact assessment must document:',
        items: [
          'Purpose and intended use of the AI system',
          'Type of data used and collection methods',
          'Potential discrimination risks identified',
          'Mitigation measures implemented',
          'Ongoing monitoring procedures'
        ]
      }
    ],
    relatedLinks: [
      { title: 'Colorado Compliance Page', url: '/compliance/colorado' },
      { title: 'High-Risk AI System Definition', url: '/glossary/high-risk-ai-system' },
      { title: 'Impact Assessment Definition', url: '/glossary/impact-assessment' }
    ]
  },
  {
    slug: 'california-ccpa-admt',
    title: 'California CCPA ADMT Regulations: Employer Guide',
    description: 'Everything employers need to know about California\'s Automated Decision-Making Technology (ADMT) requirements under CCPA.',
    sections: [
      {
        heading: 'Key Dates and Enforcement',
        content: 'California\'s ADMT regulations are part of the broader CPRA framework:',
        items: [
          'CPRA regulations finalized: 2023',
          'ADMT-specific rules: Expected finalization 2025-2026',
          'Enforced by: California Privacy Protection Agency (CPPA)',
          'Applies to: Businesses meeting CCPA thresholds'
        ]
      },
      {
        heading: 'What is ADMT?',
        content: 'Automated Decision-Making Technology under California law includes:',
        items: [
          'Profiling consumers for employment decisions',
          'AI systems making or assisting significant decisions',
          'Automated processing that produces legal or similarly significant effects'
        ]
      },
      {
        heading: 'Key Requirements',
        content: 'California ADMT regulations require:',
        items: [
          '1. Pre-Use Notice: Inform individuals before using ADMT',
          '2. Right to Opt-Out: Allow consumers to opt out of automated decision-making',
          '3. Risk Assessments: Conduct cybersecurity and privacy risk assessments',
          '4. Access Rights: Provide access to logic and key parameters used'
        ]
      }
    ],
    relatedLinks: [
      { title: 'California Compliance Page', url: '/compliance/california' },
      { title: 'Full Compliance Checklist', url: '/resources/compliance-checklist-2026' }
    ]
  },
  {
    slug: 'compliance-checklist-2026',
    title: 'AI Hiring Compliance Checklist for 2026',
    description: 'A comprehensive step-by-step checklist to ensure your company is compliant with all major AI hiring laws taking effect in 2026.',
    sections: [
      {
        heading: 'Phase 1: Assessment (Complete by December 2025)',
        content: 'Inventory and evaluate your AI systems:',
        items: [
          '☐ List all AI/ML tools used in hiring (ATS, assessments, video platforms)',
          '☐ Identify which tools qualify as AEDTs or high-risk AI',
          '☐ Map tools to applicable jurisdictions (where candidates are located)',
          '☐ Review vendor contracts for compliance support',
          '☐ Assess current disclosure and consent processes'
        ]
      },
      {
        heading: 'Phase 2: Documentation (Complete by January 2026)',
        content: 'Prepare required documentation:',
        items: [
          '☐ Draft candidate notice templates for each jurisdiction',
          '☐ Create/obtain bias audit reports (NYC)',
          '☐ Conduct impact assessments (Colorado, Illinois)',
          '☐ Develop risk management policies',
          '☐ Document data collection and retention practices'
        ]
      },
      {
        heading: 'Phase 3: Implementation (January 2026)',
        content: 'Put policies into practice:',
        items: [
          '☐ Deploy notices in job postings and applications',
          '☐ Train HR staff on new requirements',
          '☐ Implement consent collection workflows',
          '☐ Publish required disclosures on career site',
          '☐ Set up monitoring and audit schedules'
        ]
      },
      {
        heading: 'Phase 4: Ongoing Compliance',
        content: 'Maintain compliance throughout the year:',
        items: [
          '☐ Annual bias audits (NYC - by July each year)',
          '☐ Annual impact assessments (Colorado, Illinois)',
          '☐ Quarterly policy reviews',
          '☐ Update notices when tools change',
          '☐ Monitor for new state/local laws'
        ]
      }
    ],
    relatedLinks: [
      { title: 'NYC Local Law 144 Guide', url: '/resources/nyc-local-law-144' },
      { title: 'Colorado AI Act Guide', url: '/resources/colorado-ai-act-employers' },
      { title: 'HR Training Guide', url: '/resources/hr-training-guide' }
    ]
  },
  {
    slug: 'ai-disclosure-notice-template',
    title: 'How to Write an AI Disclosure Notice for Candidates',
    description: 'Templates and best practices for notifying candidates about AI use in your hiring process.',
    sections: [
      {
        heading: 'Key Principles for Effective Disclosures',
        content: 'Good AI disclosure notices should be:',
        items: [
          'Clear and Plain Language: Avoid legal jargon',
          'Specific: Name the tool and what it evaluates',
          'Timely: Delivered before AI is used',
          'Accessible: Easy to find and read'
        ]
      },
      {
        heading: 'What Must Be Disclosed',
        content: 'Depending on jurisdiction, include:',
        items: [
          'That AI/automated tools will be used',
          'What the AI analyzes (resume, video, assessments)',
          'What characteristics or qualifications are evaluated',
          'Where to find the bias audit summary (NYC)',
          'How to request alternative process or accommodation',
          'Contact information for questions'
        ]
      },
      {
        heading: 'Sample NYC-Compliant Notice',
        content: '[Company Name] uses an automated employment decision tool (AEDT) to assist in evaluating candidates for this position.\n\nThe tool analyzes: [specific factors evaluated]\n\nData sources: [what data is used]\n\nBias audit: Available at [URL]\n\nAlternative process: Contact [HR email] to request an alternative selection process or accommodation.'
      },
      {
        heading: 'Sample Illinois AIVI Notice',
        content: 'This interview will be recorded and analyzed using artificial intelligence.\n\nHow it works: [explanation of AI analysis]\n\nWhat is evaluated: [characteristics assessed]\n\nYour rights: You may request deletion of your video within 30 days.\n\nConsent required: By proceeding, you consent to AI analysis of your video interview.'
      }
    ],
    relatedLinks: [
      { title: 'NYC Requirements', url: '/resources/nyc-local-law-144' },
      { title: 'Illinois Requirements', url: '/resources/illinois-ai-hiring-law' },
      { title: 'Decision Tree', url: '/resources/ai-disclosure-decision-tree' }
    ]
  },
  {
    slug: 'vendor-assessment-guide',
    title: 'Vendor Assessment for AI Hiring Tools: Due Diligence Guide',
    description: 'How to evaluate your hiring technology vendors for compliance support and transparency.',
    sections: [
      {
        heading: 'Why Vendor Assessment Matters',
        content: 'You\'re responsible for compliance even when using third-party AI tools. Key reasons to assess vendors:',
        items: [
          'Legal liability stays with the employer',
          'Vendors vary widely in compliance support',
          'Some tools may not be auditable',
          'Contract terms affect your obligations'
        ]
      },
      {
        heading: 'Questions to Ask Vendors',
        content: 'Before purchasing or renewing, ask:',
        items: [
          'Do you provide independent bias audits?',
          'What demographic categories are tested?',
          'How often are audits conducted?',
          'Can we access our historical data for audits?',
          'What disclosures do you recommend?',
          'Do you support impact assessments?',
          'What happens if we need to explain decisions?'
        ]
      },
      {
        heading: 'Red Flags',
        content: 'Watch out for these warning signs:',
        items: [
          'Vendor refuses to provide audit information',
          'No documentation of AI/ML methodology',
          'Unable to explain what factors are evaluated',
          'No data retention or deletion capabilities',
          'Contract shifts all compliance burden to you'
        ]
      },
      {
        heading: 'Contract Provisions to Include',
        content: 'Negotiate these terms:',
        items: [
          'Right to audit data and methodology',
          'Annual bias audit delivery requirement',
          'Data deletion upon request capabilities',
          'Notice of material algorithm changes',
          'Compliance with specified jurisdictions'
        ]
      }
    ],
    relatedLinks: [
      { title: 'What Counts as AI?', url: '/resources/what-counts-as-ai-hiring' },
      { title: 'Compliance Checklist', url: '/resources/compliance-checklist-2026' }
    ]
  },
  {
    slug: 'hr-training-guide',
    title: 'Training HR Teams on AI Hiring Compliance',
    description: 'How to educate your HR team on AI hiring regulations and best practices.',
    sections: [
      {
        heading: 'Why Training Matters',
        content: 'Under Colorado AI Act (and best practices elsewhere):',
        items: [
          'Staff using high-risk AI must receive training',
          'Training must be appropriate for role and context',
          'Reduces risk of violations through ignorance',
          'Builds culture of responsible AI use'
        ]
      },
      {
        heading: 'Who Needs Training',
        content: 'Different levels for different roles:',
        items: [
          'All HR Staff: Basic awareness of AI regulations',
          'Recruiters: Deep dive on applicable tools and notices',
          'HR Managers: Policy implementation and monitoring',
          'HR Leadership: Risk management and vendor oversight',
          'Legal/Compliance: Full regulatory requirements'
        ]
      },
      {
        heading: 'Core Training Topics',
        content: 'Include these in your training program:',
        items: [
          'What is AI in hiring (and what tools you use)',
          'Applicable laws by jurisdiction',
          'Notice and consent requirements',
          'How to handle candidate questions',
          'Escalation procedures for issues',
          'Documentation requirements'
        ]
      },
      {
        heading: 'Training Documentation',
        content: 'Keep records including:',
        items: [
          'Who was trained and when',
          'Training content and materials',
          'Acknowledgment of completion',
          'Refresher training dates',
          'Updates when regulations change'
        ]
      }
    ],
    relatedLinks: [
      { title: 'Colorado AI Act Guide', url: '/resources/colorado-ai-act-employers' },
      { title: 'Compliance Program Guide', url: '/resources/compliance-program-guide' }
    ]
  },
  {
    slug: 'what-counts-as-ai-hiring',
    title: 'What Counts as AI in Hiring? A Complete Guide',
    description: 'LinkedIn Recruiter, Indeed assessments, HireVue — do they trigger compliance requirements? Here\'s how to know if your tools are covered.',
    sections: [
      {
        heading: 'The Legal Definition',
        content: 'Different laws define covered AI differently:',
        items: [
          'NYC Local Law 144: "AEDT" = computational process from ML/AI that issues simplified output',
          'Colorado AI Act: "High-risk AI" = makes consequential employment decisions',
          'Illinois: Broad definition including any AI for employment decisions'
        ]
      },
      {
        heading: 'Likely Covered',
        content: 'These tools typically trigger compliance requirements:',
        items: [
          'Video interview analysis (HireVue, Modern Hire)',
          'Resume screening with AI scoring (most modern ATS)',
          'AI-powered assessments and skills tests',
          'Chatbots that screen/filter candidates',
          'Candidate ranking algorithms',
          'AI-based personality assessments'
        ]
      },
      {
        heading: 'Probably NOT Covered',
        content: 'These typically don\'t trigger requirements:',
        items: [
          'Simple keyword search (no ML)',
          'Basic yes/no eligibility checks',
          'Calendar scheduling tools',
          'Communication platforms without analytics',
          'Manual applicant tracking (human review only)'
        ]
      },
      {
        heading: 'Gray Areas',
        content: 'These depend on specific features and usage:',
        items: [
          'LinkedIn Recruiter: AI features vs basic search',
          'Indeed Assessments: Depends on AI involvement',
          'ATS filtering: Varies by sophistication',
          'Reference checking tools: Some use AI analysis'
        ]
      },
      {
        heading: 'How to Determine Coverage',
        content: 'Ask these questions:',
        items: [
          '1. Does the tool use ML, AI, or statistical modeling?',
          '2. Does it produce scores, rankings, or recommendations?',
          '3. Do those outputs affect hiring decisions?',
          '4. Are you using it for candidates in regulated jurisdictions?',
          'If yes to all, assume compliance is required.'
        ]
      }
    ],
    relatedLinks: [
      { title: 'AEDT Definition', url: '/glossary/aedt' },
      { title: 'Vendor Assessment Guide', url: '/resources/vendor-assessment-guide' },
      { title: 'Compliance Checklist', url: '/resources/compliance-checklist-2026' }
    ]
  },
  {
    slug: 'faq',
    title: 'AI Hiring Compliance FAQ',
    description: 'Common questions about AI hiring regulations answered.',
    sections: [
      {
        heading: 'General Questions',
        content: '',
        items: [
          'Q: Do these laws apply to remote workers? A: Generally yes, based on where the candidate/employee is located.',
          'Q: What if my vendor provides the bias audit? A: Acceptable if conducted by independent third party, not the vendor itself.',
          'Q: How do I know if my ATS uses AI? A: Ask your vendor about ML/AI features in screening, ranking, or filtering.'
        ]
      },
      {
        heading: 'NYC Local Law 144',
        content: '',
        items: [
          'Q: Do I need a new audit every year? A: Yes, bias audits must be conducted within one year of AEDT use.',
          'Q: What if my tool shows adverse impact? A: The law requires transparency, not perfect scores. Document and consider remediation.',
          'Q: Can I use vendor test data for audits? A: Yes, if you haven\'t accumulated enough NYC applicant data.'
        ]
      },
      {
        heading: 'Colorado AI Act',
        content: '',
        items: [
          'Q: What counts as "deploying" AI? A: Using it to make or assist decisions affecting Colorado consumers.',
          'Q: How detailed must impact assessments be? A: Must cover purpose, data, risks, mitigations, and monitoring.',
          'Q: Is there an enforcement delay? A: Full enforcement begins February 1, 2026.'
        ]
      },
      {
        heading: 'Illinois',
        content: '',
        items: [
          'Q: Does BIPA apply to video interviews? A: Yes, if collecting face geometry or voice prints.',
          'Q: What consent is required under AIVI? A: Written consent before recording video interviews.',
          'Q: Does HB 3773 replace AIVI? A: No, both laws apply — HB 3773 adds requirements.'
        ]
      }
    ],
    relatedLinks: [
      { title: 'Full NYC Guide', url: '/resources/nyc-local-law-144' },
      { title: 'Colorado Guide', url: '/resources/colorado-ai-act-employers' },
      { title: 'Illinois Guide', url: '/resources/illinois-ai-hiring-law' }
    ]
  }
]

export function getResourceBySlug(slug: string): ResourceContent | undefined {
  return RESOURCE_PAGES.find(r => r.slug === slug)
}
