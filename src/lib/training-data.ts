// Training track content data
// Each track has sections with videos and quizzes

export type TrainingTrack = 'recruiter' | 'manager' | 'admin' | 'executive'

export interface TrainingSection {
  number: number
  title: string
  description: string
  videoId?: string // Synthesia video ID (placeholder for now)
  videoDuration: number // seconds
  content: string // Text content for when video isn't available
  quiz: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // 0-indexed
  explanation: string
}

export interface TrainingTrackData {
  id: TrainingTrack
  title: string
  description: string
  targetAudience: string
  estimatedTime: string
  sections: TrainingSection[]
}

export const PASSING_SCORE = 80 // 80% required to pass

export const TRAINING_TRACKS: Record<TrainingTrack, TrainingTrackData> = {
  recruiter: {
    id: 'recruiter',
    title: 'Recruiter Compliance Training',
    description: 'Essential training for recruiters using AI tools in the hiring process',
    targetAudience: 'Recruiters, Talent Acquisition Specialists',
    estimatedTime: '45 minutes',
    sections: [
      {
        number: 1,
        title: 'Understanding AI in Recruitment',
        description: 'Learn what counts as AI in the hiring process and why it matters',
        videoDuration: 480,
        content: `
AI in recruitment includes any automated or algorithmic system that processes candidate information. This includes:

• Resume screening tools (ATS with auto-filtering)
• Chatbots for candidate screening
• Video interview analysis (sentiment, keywords)
• Skills assessments with algorithmic scoring
• Predictive hiring analytics

As a recruiter, you're often the first point of contact with candidates and the primary user of these tools. Understanding what qualifies as AI helps you:

1. Properly notify candidates before AI processing
2. Document consent when required
3. Provide alternatives when requested
4. Maintain compliance records
        `,
        quiz: [
          {
            id: 'r1q1',
            question: 'Which of the following is considered AI in hiring under most state laws?',
            options: [
              'Manual resume review by a human',
              'Automated resume screening that filters candidates',
              'Phone calls to schedule interviews',
              'Sending job offer letters'
            ],
            correctAnswer: 1,
            explanation: 'Automated resume screening that filters candidates without human review is considered AI/AEDT under most state laws.'
          },
          {
            id: 'r1q2',
            question: 'When must candidates be notified about AI use?',
            options: [
              'After they\'re hired',
              'Only if they ask',
              'Before AI processing occurs',
              'Never, it\'s optional'
            ],
            correctAnswer: 2,
            explanation: 'Most state laws require notification BEFORE AI processing occurs, giving candidates time to understand and potentially opt-out.'
          },
          {
            id: 'r1q3',
            question: 'What should you do if a candidate requests an alternative to AI screening?',
            options: [
              'Tell them it\'s not possible',
              'Ignore the request',
              'Document the request and provide a human review alternative',
              'Reject their application'
            ],
            correctAnswer: 2,
            explanation: 'Several state laws require providing alternatives when candidates request them. Always document these requests and route to human review.'
          }
        ]
      },
      {
        number: 2,
        title: 'Disclosure Requirements',
        description: 'How to properly notify candidates about AI use',
        videoDuration: 420,
        content: `
Proper disclosure is critical for compliance. Here's what you need to know:

## When to Disclose
- Before any AI tool processes candidate data
- At application start (job posting or application portal)
- Before video interviews using AI analysis
- Before any automated assessment

## What to Include
1. That AI/automated tools will be used
2. What data will be collected
3. How AI affects hiring decisions
4. How to request alternatives (where required)
5. How to access their data (CCPA states)

## Disclosure Methods
- Job posting language
- Application portal notices
- Email before AI-analyzed interviews
- Consent forms for specific tools

## Documentation
Always maintain records of:
- When disclosure was provided
- What was disclosed
- Candidate acknowledgment (if applicable)
        `,
        quiz: [
          {
            id: 'r2q1',
            question: 'What must be included in an AI disclosure notice?',
            options: [
              'Company revenue information',
              'Names of all hiring managers',
              'How AI affects hiring decisions and how to request alternatives',
              'Salary ranges for all positions'
            ],
            correctAnswer: 2,
            explanation: 'Disclosures must explain how AI affects decisions and, in many jurisdictions, how candidates can request alternatives.'
          },
          {
            id: 'r2q2',
            question: 'When should AI disclosure be provided to candidates?',
            options: [
              'After they accept a job offer',
              'Before any AI processing of their data',
              'Only during the final interview',
              'When they ask for it'
            ],
            correctAnswer: 1,
            explanation: 'Disclosure must occur BEFORE AI processing to give candidates informed choice about proceeding.'
          }
        ]
      },
      {
        number: 3,
        title: 'Consent & Documentation',
        description: 'Recording and maintaining compliance records',
        videoDuration: 360,
        content: `
## Consent Requirements

Some states (like Illinois for video interviews) require explicit consent before AI analysis. Here's how to handle it:

### Illinois Video Interview Requirements
- Written notice before interview
- Consent to AI analysis
- Right to request deletion within 30 days
- Cannot share without consent

### Maryland Audio/Video Analysis
- Written consent required
- Must explain data collected
- Applicant can decline without penalty

### Documentation Best Practices

1. **Track Everything**
   - Date/time of disclosure
   - Method of disclosure
   - Candidate response/acknowledgment

2. **Centralized Records**
   - Use your ATS or compliance tool
   - Keep for at least 4 years
   - Make records easily retrievable

3. **Alternative Requests**
   - Log all opt-out requests
   - Document how alternatives were provided
   - Track outcomes for reporting
        `,
        quiz: [
          {
            id: 'r3q1',
            question: 'In Illinois, when is explicit consent required for AI video analysis?',
            options: [
              'Never',
              'Before the video interview is recorded',
              'After the interview is completed',
              'Only for executive positions'
            ],
            correctAnswer: 1,
            explanation: 'Illinois AIPA requires written consent BEFORE video interviews that will be analyzed by AI.'
          },
          {
            id: 'r3q2',
            question: 'How long should you retain consent records?',
            options: [
              '30 days',
              '1 year',
              'At least 4 years',
              'Forever'
            ],
            correctAnswer: 2,
            explanation: 'Best practice is to retain records for at least 4 years to cover statute of limitations in most jurisdictions.'
          },
          {
            id: 'r3q3',
            question: 'What should you do when a candidate opts out of AI screening?',
            options: [
              'Reject their application',
              'Document the request and ensure human review occurs',
              'Tell them AI is mandatory',
              'Ignore the request'
            ],
            correctAnswer: 1,
            explanation: 'Always document opt-out requests and provide the human review alternative as required by law.'
          }
        ]
      },
      {
        number: 4,
        title: 'Beyond AI Laws: Hidden Compliance Risks',
        description: 'Learn about lie detector, biometric, wiretapping, and FCRA laws that affect AI hiring tools',
        videoDuration: 600,
        content: `
Most compliance training only covers AI-specific laws like Illinois HB 3773 or NYC Local Law 144. But your AI hiring tools can trigger 50+ other laws you might not know about.

BIOMETRIC PRIVACY
If your tools analyze facial features, voice patterns, or other biometric data:
• Illinois BIPA requires written consent BEFORE collection — $1,000-$5,000 per violation with private right of action
• Texas and Washington have similar laws
• Each scan counts as a separate violation — liability can reach millions

LIE DETECTOR / POLYGRAPH LAWS
AI tools that score "integrity," "honesty," or "deception" may violate:
• Federal EPPA — bans lie detector tests in employment ($10,000/violation)
• 20+ state polygraph laws with broad "device" definitions
• CVS settled a lawsuit over HireVue's facial "integrity scoring" under Massachusetts law

WIRETAPPING / RECORDING CONSENT
Recording AI video interviews without proper consent is a CRIME in 13 states:
• California, Florida, Illinois, Pennsylvania — all require ALL-PARTY consent
• Florida and Pennsylvania violations are FELONIES (5-7 years)
• Always get explicit, recorded consent before any video interview

FCRA (FAIR CREDIT REPORTING ACT)
When a third-party AI vendor generates candidate scores or reports:
• The vendor may legally be a "consumer reporting agency"
• You must provide standalone written disclosure to the applicant
• You must get written authorization BEFORE the report
• Pre-adverse action notice with report copy is required
• Violations: $100-$1,000 per person + punitive damages

As a recruiter, your key actions:
1. Always disclose AI use AND recording before video interviews
2. Get written consent for biometric data collection
3. Never use tools that claim to detect "deception" or "integrity"
4. Follow FCRA procedures when using third-party screening reports
5. Know which states your candidates are in — laws vary dramatically
        `,
        quiz: [
          {
            id: 'r4q1',
            question: 'A candidate in Illinois completes a HireVue video interview. Which additional law beyond AI disclosure is most likely triggered?',
            options: [
              'OSHA workplace safety regulations',
              'Illinois BIPA (Biometric Information Privacy Act)',
              'Fair Labor Standards Act',
              'HIPAA health privacy rules'
            ],
            correctAnswer: 1,
            explanation: 'Illinois BIPA requires written consent before collecting biometric identifiers like facial geometry. Each scan is a separate violation with $1,000-$5,000 damages and private right of action.'
          },
          {
            id: 'r4q2',
            question: 'Your company uses an AI tool that scores candidates on "integrity" based on facial expressions. What federal law might this violate?',
            options: [
              'The Americans with Disabilities Act',
              'The Fair Labor Standards Act',
              'The Employee Polygraph Protection Act (EPPA)',
              'The Family Medical Leave Act'
            ],
            correctAnswer: 2,
            explanation: 'The EPPA broadly prohibits lie detector tests in employment. AI tools that assess honesty, integrity, or deception through physiological responses may qualify as electronic polygraph tests.'
          },
          {
            id: 'r4q3',
            question: 'Recording an AI video interview in Florida without explicit consent from the candidate could result in:',
            options: [
              'A small administrative fine',
              'A written warning from the state',
              'A felony charge with up to 5 years imprisonment',
              'No consequences — federal law allows it'
            ],
            correctAnswer: 2,
            explanation: 'Florida is an all-party consent state. Recording without consent violates §934.03, which is a felony carrying up to 5 years imprisonment plus civil damages.'
          },
          {
            id: 'r4q4',
            question: 'When using a third-party AI vendor for candidate screening, FCRA requires you to:',
            options: [
              'Nothing — the vendor handles compliance',
              'Provide standalone written disclosure and get written authorization from the candidate',
              'Only notify candidates after they are rejected',
              'Post a notice on your website'
            ],
            correctAnswer: 1,
            explanation: 'Under FCRA, employers must provide clear standalone disclosure AND get written authorization BEFORE procuring a consumer report. The vendor\'s compliance doesn\'t replace yours.'
          }
        ]
      }
    ]
  },

  manager: {
    id: 'manager',
    title: 'Hiring Manager Compliance Training',
    description: 'Training for managers who make hiring decisions using AI-assisted tools',
    targetAudience: 'Hiring Managers, Department Heads',
    estimatedTime: '40 minutes',
    sections: [
      {
        number: 1,
        title: 'Your Role in AI Compliance',
        description: 'Understanding your responsibilities as a hiring decision-maker',
        videoDuration: 420,
        content: `
As a hiring manager, you're the final decision-maker in the hiring process. Here's what you need to know about AI compliance:

## Your Responsibilities

1. **Understand the Tools**
   - Know which AI tools screen candidates before they reach you
   - Understand how AI scores or ranks candidates
   - Recognize AI-generated insights vs. raw candidate data

2. **Don't Over-rely on AI**
   - AI recommendations are inputs, not decisions
   - Apply human judgment to every hiring decision
   - Consider context AI might miss

3. **Document Your Decisions**
   - Record why you selected/rejected candidates
   - Note when you overrode AI recommendations
   - Keep records for potential audits

## Key Compliance Points

- AI screening must not be the sole basis for adverse decisions
- Human review is required for final employment decisions
- You must be able to explain your hiring decisions
        `,
        quiz: [
          {
            id: 'm1q1',
            question: 'What is your primary responsibility regarding AI in hiring?',
            options: [
              'Accept all AI recommendations without question',
              'Apply human judgment and document decisions',
              'Avoid using AI tools entirely',
              'Let HR handle all AI decisions'
            ],
            correctAnswer: 1,
            explanation: 'Hiring managers must apply human judgment to AI recommendations and document their decision-making process.'
          },
          {
            id: 'm1q2',
            question: 'Can AI be the sole basis for rejecting a candidate?',
            options: [
              'Yes, if the AI is accurate',
              'Yes, for initial screening only',
              'No, human review is required for adverse decisions',
              'Yes, if documented properly'
            ],
            correctAnswer: 2,
            explanation: 'Most laws require human review before making adverse employment decisions, even when AI is used in screening.'
          }
        ]
      },
      {
        number: 2,
        title: 'Bias Prevention',
        description: 'How to identify and prevent algorithmic bias',
        videoDuration: 480,
        content: `
## Understanding AI Bias

AI systems can perpetuate or amplify bias in several ways:

### Sources of Bias

1. **Training Data Bias**
   - Historical hiring data reflects past discrimination
   - Underrepresentation of certain groups
   - Biased labels or outcomes

2. **Proxy Discrimination**
   - AI finds patterns correlated with protected classes
   - Zip codes → race/ethnicity
   - Names → gender/ethnicity
   - Education → socioeconomic status

3. **Feedback Loop Bias**
   - AI learns from biased human decisions
   - Reinforces existing patterns
   - Gets worse over time without correction

## What You Can Do

1. **Question AI recommendations that seem off**
   - Ask: "Why did AI rank this candidate lower?"
   - Look for patterns in who gets filtered out

2. **Review demographic patterns**
   - Are certain groups consistently screened out?
   - Compare AI selections to human selections

3. **Report concerns**
   - Tell HR/compliance if you notice patterns
   - Document specific examples
        `,
        quiz: [
          {
            id: 'm2q1',
            question: 'How can AI systems perpetuate hiring bias?',
            options: [
              'By using random selection',
              'By learning from historical data that reflects past discrimination',
              'By always preferring the most qualified candidate',
              'AI cannot be biased'
            ],
            correctAnswer: 1,
            explanation: 'AI trained on historical hiring data can learn and perpetuate past discriminatory patterns.'
          },
          {
            id: 'm2q2',
            question: 'What is proxy discrimination?',
            options: [
              'Discrimination through a staffing agency',
              'When AI uses factors correlated with protected classes',
              'Hiring someone to discriminate for you',
              'Temporary bias'
            ],
            correctAnswer: 1,
            explanation: 'Proxy discrimination occurs when AI uses seemingly neutral factors (like zip code) that correlate with protected characteristics.'
          },
          {
            id: 'm2q3',
            question: 'What should you do if you notice patterns in AI screening?',
            options: [
              'Ignore it, AI knows best',
              'Document concerns and report to HR/compliance',
              'Manually adjust AI scores',
              'Stop using AI entirely'
            ],
            correctAnswer: 1,
            explanation: 'Document specific examples and report concerns to HR or compliance for investigation.'
          }
        ]
      },
      {
        number: 3,
        title: 'Adverse Action Compliance',
        description: 'Requirements when not hiring a candidate',
        videoDuration: 360,
        content: `
## Adverse Action Requirements

When you decide not to hire a candidate, there may be additional requirements:

### What is Adverse Action?

- Not hiring/selecting a candidate
- Demoting or terminating an employee
- Any negative employment decision

### Legal Requirements

1. **NYC Local Law 144**
   - If AEDT was used, notify candidate
   - Allow 10 business days to request info
   - Provide access to data/results if requested

2. **FCRA Requirements**
   - If background check AI was used
   - Pre-adverse action notice required
   - Final adverse action notice required

3. **State-Specific Rules**
   - Colorado: Explanation of AI role in decision
   - Illinois: Disclose AI factors considered
   - CCPA states: Right to access their data

### Documentation Requirements

For every adverse action involving AI:
- Record the AI tools used
- Note AI recommendations/scores
- Document human review process
- Keep records 4+ years
        `,
        quiz: [
          {
            id: 'm3q1',
            question: 'Under NYC Local Law 144, what must you provide after adverse action?',
            options: [
              'Nothing, it\'s optional',
              'Notice and ability to request information about AI use',
              'Only a rejection email',
              'Full explanation of all decisions'
            ],
            correctAnswer: 1,
            explanation: 'NYC LL144 requires notifying candidates and providing information about AI use upon request.'
          },
          {
            id: 'm3q2',
            question: 'What should be documented for every AI-assisted adverse action?',
            options: [
              'Only the final decision',
              'AI tools used, recommendations, and human review process',
              'Just the candidate\'s name',
              'Nothing, unless requested'
            ],
            correctAnswer: 1,
            explanation: 'Complete documentation includes AI tools, recommendations, scores, and the human review process.'
          }
        ]
      },
      {
        number: 4,
        title: 'Protecting Your Team from Hidden AI Risks',
        description: 'Practical steps for managers to ensure AI hiring compliance beyond the basics',
        videoDuration: 480,
        content: `
As a hiring manager, you may not control which AI tools your company uses, but you DO control how they're used in your hiring process. Here are the risks you need to watch for:

VIDEO INTERVIEWS — THE TRIPLE THREAT:
When you use AI-assisted video interviews, three categories of law activate simultaneously:
1. Biometric Privacy — facial analysis requires written consent
2. Wiretapping — recording requires consent in 13 states
3. Lie Detector — "integrity scoring" may be an illegal polygraph test

YOUR CHECKLIST BEFORE ANY AI VIDEO INTERVIEW:
□ Candidate has been notified that AI will be used
□ Candidate has been notified that the interview will be recorded
□ Written consent obtained (biometric + recording)
□ Candidate offered alternative (human-only interview)
□ You know which state the candidate is in

SALARY DISCUSSIONS — NEW RULES:
In 17 states, you cannot:
• Ask candidates about salary history
• Use AI tools to filter by salary expectations
• Post jobs without salary ranges

If your ATS auto-filters candidates by salary data, you may be violating pay transparency laws.

ACCOMMODATION REQUESTS:
If a candidate says they can't complete an AI assessment due to a disability:
• You MUST provide an alternative
• Don't ask what the disability is
• Route to human review immediately
• Document the accommodation

WHEN TO ESCALATE:
Immediately flag to HR/Legal if:
• A candidate mentions they're deaf/blind and can't use the AI tool
• A candidate in IL, CA, or FL objects to video recording
• A vendor claims their tool "detects deception" or scores "integrity"
• A candidate asks about their data rights (may trigger privacy laws)
        `,
        quiz: [
          {
            id: 'm4q1',
            question: 'When using AI video interviews, how many categories of law are simultaneously triggered?',
            options: [
              'Just one — the AI disclosure law',
              'Two — AI disclosure and consent',
              'Three — biometric privacy, wiretapping, and potentially lie detector laws',
              'None — video interviews are unregulated'
            ],
            correctAnswer: 2,
            explanation: 'AI video interviews trigger biometric privacy (facial analysis), wiretapping (recording consent), and potentially lie detector laws (if scoring integrity/honesty) — all on top of AI-specific disclosure requirements.'
          },
          {
            id: 'm4q2',
            question: 'A candidate says they cannot complete your AI video assessment due to hearing loss. What should you do?',
            options: [
              'Tell them the AI assessment is required for all candidates',
              'Ask them to provide medical documentation first',
              'Provide an alternative assessment method and document the accommodation',
              'Skip them and move to the next candidate'
            ],
            correctAnswer: 2,
            explanation: 'Under the ADA, you must provide reasonable accommodations. Provide an alternative assessment, don\'t ask about the specific disability, and document the accommodation.'
          },
          {
            id: 'm4q3',
            question: 'Your ATS automatically filters out candidates who expect a salary above $80K. In which states could this be a problem?',
            options: [
              'No states — salary filtering is always legal',
              'Only California',
              '17+ states with pay transparency laws that restrict salary-based filtering',
              'Only states with AI-specific laws'
            ],
            correctAnswer: 2,
            explanation: '17+ states (including CO, CA, NY, WA, MA, IL, CT) have pay transparency laws. Many prohibit using salary history in hiring decisions, and AI tools that auto-filter by salary may violate these laws.'
          }
        ]
      }
    ]
  },

  admin: {
    id: 'admin',
    title: 'HR Admin Compliance Training',
    description: 'Comprehensive training for HR professionals managing AI compliance',
    targetAudience: 'HR Directors, Compliance Officers, HR Business Partners',
    estimatedTime: '60 minutes',
    sections: [
      {
        number: 1,
        title: 'Regulatory Landscape',
        description: 'Overview of AI hiring laws across jurisdictions',
        videoDuration: 600,
        content: `
## Current AI Hiring Regulations

### Federal Level
- EEOC guidance on AI and Title VII
- OFCCP scrutiny for federal contractors
- FTC enforcement actions for deceptive AI

### State Laws

**Illinois (AIPA)**
- Video interview consent required
- AI decision disclosure
- Data retention requirements

**NYC Local Law 144**
- Annual bias audits for AEDTs
- Public disclosure requirements
- Candidate notification

**Colorado AI Act (2026)**
- High-risk AI designation
- Impact assessments required
- Algorithmic discrimination protection

**Maryland (HB 1202)**
- Facial recognition consent
- Must allow declination without penalty

**California (CCPA/CPRA)**
- Right to know about automated processing
- Right to opt-out of automated decisions
- Access to data used

### Emerging Legislation
- Multiple states considering similar laws
- EU AI Act influence
- Expect more regulation 2025-2027
        `,
        quiz: [
          {
            id: 'a1q1',
            question: 'Which jurisdiction requires annual bias audits for AI hiring tools?',
            options: [
              'Illinois',
              'NYC',
              'Maryland',
              'Federal law'
            ],
            correctAnswer: 1,
            explanation: 'NYC Local Law 144 requires annual independent bias audits for automated employment decision tools.'
          },
          {
            id: 'a1q2',
            question: 'What does Colorado\'s AI Act require for high-risk AI in hiring?',
            options: [
              'Nothing, it\'s not covered',
              'Impact assessments and algorithmic discrimination protections',
              'Only disclosure',
              'Annual training only'
            ],
            correctAnswer: 1,
            explanation: 'Colorado requires impact assessments and provides protections against algorithmic discrimination for high-risk AI.'
          },
          {
            id: 'a1q3',
            question: 'What right does CCPA provide regarding AI in hiring?',
            options: [
              'No relevant rights',
              'Right to know and opt-out of automated decision-making',
              'Only the right to sue',
              'The right to a human interview'
            ],
            correctAnswer: 1,
            explanation: 'CCPA provides the right to know about automated processing and opt-out of automated decisions affecting employment.'
          }
        ]
      },
      {
        number: 2,
        title: 'Building a Compliance Program',
        description: 'Creating policies and procedures for AI compliance',
        videoDuration: 540,
        content: `
## Compliance Program Components

### 1. AI Tool Inventory
- Catalog all AI tools in hiring
- Document what each tool does
- Map to regulatory requirements
- Review vendor compliance

### 2. Policies & Procedures
- AI use policy
- Disclosure templates
- Consent procedures
- Alternative accommodation process
- Adverse action procedures
- Data retention policy

### 3. Training Program
- Role-based training (this!)
- Annual recertification
- New hire onboarding
- Tool-specific training

### 4. Audit & Assessment
- Internal compliance audits
- Bias audits (NYC)
- Impact assessments (CO)
- Vendor assessments

### 5. Documentation System
- Centralized record-keeping
- Consent tracking
- Disclosure logs
- Audit trails

### 6. Incident Response
- Complaint procedures
- Investigation process
- Remediation steps
- Regulatory reporting
        `,
        quiz: [
          {
            id: 'a2q1',
            question: 'What is the first step in building an AI compliance program?',
            options: [
              'Writing policies',
              'Training employees',
              'Creating an inventory of all AI tools used',
              'Hiring a consultant'
            ],
            correctAnswer: 2,
            explanation: 'You must first know what AI tools you\'re using before you can build policies and procedures around them.'
          },
          {
            id: 'a2q2',
            question: 'How often should compliance training be renewed?',
            options: [
              'Only when laws change',
              'Every 5 years',
              'Annually',
              'Never, once is enough'
            ],
            correctAnswer: 2,
            explanation: 'Annual recertification ensures staff stays current with evolving regulations and best practices.'
          },
          {
            id: 'a2q3',
            question: 'What should your documentation system track?',
            options: [
              'Only rejected candidates',
              'Consents, disclosures, and audit trails',
              'Only successful hires',
              'Nothing, it\'s optional'
            ],
            correctAnswer: 1,
            explanation: 'A comprehensive documentation system tracks consents, disclosures, and complete audit trails for compliance defense.'
          }
        ]
      },
      {
        number: 3,
        title: 'Bias Audits & Assessments',
        description: 'Conducting required audits and impact assessments',
        videoDuration: 480,
        content: `
## NYC Bias Audit Requirements

### What Must Be Audited
- Any AEDT used for employment decisions
- Both screening and scoring tools
- Must be independent auditor

### Audit Methodology
- Selection rate analysis by demographics
- Impact ratio calculations
- Statistical significance testing
- Historical data (12+ months preferred)

### Public Disclosure
- Results summary on website
- Distribution date required
- Before using AEDT on candidates

## Colorado Impact Assessments

### Components
- System description and purpose
- Data inputs and outputs
- Intended benefits and limitations
- Risk of algorithmic discrimination
- Mitigation measures
- Ongoing monitoring plan

### When Required
- Before deploying high-risk AI
- Updated when material changes
- Retained for duration of use + 3 years

## Internal Auditing

### Regular Reviews
- Quarterly outcome analysis
- Demographic impact monitoring
- Complaint tracking
- Process compliance checks
        `,
        quiz: [
          {
            id: 'a3q1',
            question: 'Who can conduct a NYC bias audit?',
            options: [
              'Anyone in the company',
              'An independent auditor',
              'The AI vendor',
              'The hiring manager'
            ],
            correctAnswer: 1,
            explanation: 'NYC LL144 requires bias audits to be conducted by an independent auditor to ensure objectivity.'
          },
          {
            id: 'a3q2',
            question: 'Where must NYC bias audit results be published?',
            options: [
              'Internal memo only',
              'Company website',
              'Nowhere, they\'re private',
              'Only sent to NYC'
            ],
            correctAnswer: 1,
            explanation: 'NYC requires public disclosure of bias audit results on the employer\'s website.'
          },
          {
            id: 'a3q3',
            question: 'How long must Colorado impact assessments be retained?',
            options: [
              '1 year',
              '2 years',
              'Duration of use + 3 years',
              'Forever'
            ],
            correctAnswer: 2,
            explanation: 'Colorado requires retention for the duration of AI use plus an additional 3 years.'
          }
        ]
      },
      {
        number: 4,
        title: 'Managing Training & Certification',
        description: 'Running your organization\'s training program',
        videoDuration: 360,
        content: `
## Training Program Management

### Assigning Training
- Identify all roles that interact with AI hiring tools
- Assign appropriate tracks
- Set completion deadlines
- Track progress

### Certification Requirements
- All relevant staff must complete training
- Annual recertification
- Track expiry dates
- Send reminders proactively

### Metrics to Track
- Completion rates by department
- Quiz scores and pass rates
- Time to complete
- Recertification compliance

### Enforcement
- Make training mandatory for hiring participation
- Include in performance reviews
- Escalate non-compliance

### Documentation
- Maintain completion records
- Store certificates
- Keep quiz results
- Audit trail for regulators
        `,
        quiz: [
          {
            id: 'a4q1',
            question: 'Who should receive AI hiring compliance training?',
            options: [
              'Only HR',
              'Only executives',
              'Everyone who interacts with AI hiring tools',
              'Only IT staff'
            ],
            correctAnswer: 2,
            explanation: 'Anyone who uses, oversees, or makes decisions based on AI hiring tools needs appropriate training.'
          },
          {
            id: 'a4q2',
            question: 'What should happen if an employee doesn\'t complete required training?',
            options: [
              'Nothing',
              'They should be restricted from hiring activities until complete',
              'Terminate them immediately',
              'Let them continue hiring anyway'
            ],
            correctAnswer: 1,
            explanation: 'Employees who haven\'t completed required training should not participate in hiring activities using AI tools.'
          }
        ]
      },
      {
        number: 5,
        title: 'Managing the Full Legal Attack Surface',
        description: 'Build compliance programs that cover all 10 categories of AI hiring laws',
        videoDuration: 720,
        content: `
Your compliance program needs to address 10 categories of law — not just the 5-7 AI-specific ones most companies focus on.

THE 10 COMPLIANCE CATEGORIES:
1. AI-Specific Hiring Laws (IL, NYC, CO, CA, TX, UT, MD)
2. Lie Detector / Polygraph (Federal EPPA + 20 states)
3. Biometric Privacy (IL BIPA, TX, WA + 13 other states)
4. FCRA / Consumer Reporting (Federal — applies everywhere)
5. Wiretapping / Recording Consent (13 all-party consent states)
6. Anti-Discrimination (Federal Title VII — applies everywhere)
7. Pay Transparency (17 states + DC)
8. Disability / ADA (Federal — applies everywhere)
9. Age Discrimination / ADEA (Federal — applies everywhere)
10. Data Privacy (12+ states with comprehensive privacy laws)

BUILDING A COMPREHENSIVE PROGRAM:

Step 1: Audit Your Tool Stack
Map every AI tool to the law categories it triggers:
• Video interview tools → biometric, wiretapping, lie-detector, AI-specific
• Resume screening → FCRA, AI-specific, anti-discrimination, age
• Background check vendors → FCRA, data privacy
• Salary tools → pay transparency
• All tools → ADA, Title VII, ADEA (federal baseline)

Step 2: Map Your State Exposure
For each state where you hire:
• Identify state-specific laws beyond federal baseline
• Flag high-risk combinations (e.g., IL = biometric + wiretapping + AI-specific)
• Track upcoming effective dates (CO AI Act: June 2026)

Step 3: Implement Per-Category Controls
Each category needs specific controls:
• Biometric: written consent forms, retention policies, destruction schedules
• Wiretapping: recording consent mechanisms, state-aware interview routing
• FCRA: disclosure templates, authorization forms, adverse action procedures
• Pay transparency: salary range inclusion in all postings, history ban compliance
• Data privacy: applicant data inventories, opt-out mechanisms, deletion procedures

Step 4: Train and Monitor
• Role-specific training (recruiters, managers, executives)
• Quarterly compliance audits
• Incident response procedures
• Document retention policies

THE COMPETITIVE ADVANTAGE:
Most companies only address AI-specific laws. By covering all 10 categories, you're ahead of 95% of employers and significantly reducing litigation risk.
        `,
        quiz: [
          {
            id: 'a5q1',
            question: 'How many categories of law can AI hiring tools potentially violate?',
            options: [
              '3-4 (just the AI-specific ones)',
              '5-7 (AI-specific plus a few others)',
              '10 distinct categories covering 50+ individual laws',
              'Only 1 — there is one unified AI hiring law'
            ],
            correctAnswer: 2,
            explanation: 'AI hiring tools can trigger laws across 10 distinct categories: AI-specific, lie detector, biometric, FCRA, wiretapping, anti-discrimination, pay transparency, disability, age discrimination, and data privacy.'
          },
          {
            id: 'a5q2',
            question: 'Which combination represents the highest compliance risk?',
            options: [
              'Using an ATS in a state with no AI-specific law',
              'Using video interview AI in Illinois (biometric + wiretapping + AI-specific)',
              'Using a job board in Wyoming',
              'Manual resume review in any state'
            ],
            correctAnswer: 1,
            explanation: 'Illinois has AI-specific laws, BIPA (biometric with private right of action), eavesdropping law (wiretapping), and lie detector restrictions — making video AI the highest-risk combination.'
          },
          {
            id: 'a5q3',
            question: 'What is the first step in building a comprehensive AI hiring compliance program?',
            options: [
              'Hire an employment attorney',
              'Stop using all AI tools',
              'Audit your tool stack and map each tool to triggered law categories',
              'Only hire in states with no regulations'
            ],
            correctAnswer: 2,
            explanation: 'The foundation is understanding your exposure. Map every AI tool to the law categories it triggers, then layer on state-specific requirements based on where you operate.'
          },
          {
            id: 'a5q4',
            question: 'Federal baseline laws (Title VII, ADA, ADEA, EPPA, FCRA) apply to:',
            options: [
              'Only companies with 500+ employees',
              'Only companies in regulated states',
              'All employers using AI in hiring, in every state',
              'Only government contractors'
            ],
            correctAnswer: 2,
            explanation: 'Federal laws apply nationwide. Every employer using AI in hiring must comply with anti-discrimination (Title VII), disability accommodation (ADA), age discrimination (ADEA), polygraph (EPPA), and consumer reporting (FCRA) requirements.'
          }
        ]
      },
      {
        number: 6,
        title: 'Texas TRAIGA Compliance',
        description: 'Understanding the Texas Responsible AI Governance Act',
        videoDuration: 480,
        content: `
## Texas TRAIGA Overview

The Texas Responsible AI Governance Act (TRAIGA, HB 149) took effect January 1, 2026. While less prescriptive than NYC LL144 or Colorado AI Act, TRAIGA establishes important requirements for employers using AI in hiring decisions for Texas residents.

### Key Principles

TRAIGA takes an **intent-based liability** approach rather than impact-based. This means:
- Liability requires proof of discriminatory *intent*, not just disparate impact
- Focus is on preventing intentional AI misuse
- Risk management policies serve as safe harbor defense

### Prohibited Uses of AI

TRAIGA prohibits developing or deploying AI systems **intended** for:
1. **Behavioral manipulation or coercion** — AI designed to manipulate candidates into decisions
2. **Discrimination** — Intentionally using AI to discriminate based on protected characteristics
3. **Constitutional rights violations** — AI designed to infringe freedoms protected by U.S. or Texas constitutions
4. **Unlawful content creation** — Deepfakes, unauthorized content using candidate likenesses

### Disclosure Requirements

Unlike NYC's detailed candidate notices, TRAIGA requires **high-level system disclosures**:
- Purpose and intended use of the AI system
- Type of data used for training/programming
- Categories of data collected from users
- Deployment context and benefits

**Where to publish:** Company website, AI system documentation, or hiring portal — must be available before deployment

**When to update:** Annually or when material changes occur

### Texas Artificial Intelligence Council

The Act creates the Texas Artificial Intelligence Council to:
- Provide guidance on ethical AI use
- Monitor the AI Regulatory Sandbox Program
- Recommend policy reforms to the legislature
- Study regulatory barriers to AI innovation

### Penalties

- Civil penalties: **$100,000 per violation**
- Continuing violations: **$40,000 per day**
- Enforcement: Exclusive to Texas Attorney General (no private right of action)
- Sanctions: AG may recommend license suspension/revocation for regulated parties

### AI Regulatory Sandbox

Texas offers a 36-month safe harbor for testing innovative AI:
- Immunity from state enforcement during testing
- Requires application describing system, risks, benefits, mitigation plans
- Managed by Department of Information Resources
- Ideal for high-risk experimental AI before full deployment

### Compliance Steps for Employers

1. **Document Intent**
   - Record decision-making processes during AI development/procurement
   - Maintain proof of non-discriminatory purposes
   - Train teams on prohibited intents

2. **Publish Disclosures**
   - Add TRAIGA disclosures to hiring portal or website
   - Include: system purpose, data used, deployment context
   - Review annually

3. **Build Risk Management Policy**
   - Section 551.008 of TRAIGA encourages risk management policies
   - Policy serves as potential safe harbor defense
   - Include oversight procedures, training, anti-discrimination checks

4. **Constitutional Rights Assessment**
   - Evaluate whether AI could infringe speech, due process, or other constitutional rights
   - Document how AI respects individual freedoms

5. **Monitor Texas AI Council**
   - Track guidance and best practice recommendations
   - Participate in sandbox if testing novel AI approaches

### TRAIGA vs. Other State Laws

**Less prescriptive than:**
- NYC LL144 (no annual bias audits required)
- Colorado AI Act (no impact assessments mandated)
- Illinois AIVI (no per-candidate consent for video AI)

**More flexible approach:**
- Intent-based liability is harder for plaintiffs to prove
- Risk management policies provide safe harbor
- Focus on innovation-friendly framework

**Still requires:**
- System-level disclosures
- Intent audits and documentation
- Compliance with federal baseline (Title VII, ADA, ADEA)

### Integration with Existing Compliance

Texas employers must still comply with:
- **CUBI (Biometric Identifier Act)** — Written consent before collecting biometric data
- **Federal baseline** — Title VII, ADA, ADEA, EPPA, FCRA
- **Multi-state operations** — If hiring in NYC, CO, IL, CA — those laws also apply

### Action Items

✓ Add Texas to your AI compliance jurisdiction map
✓ Publish TRAIGA-compliant system disclosures on website
✓ Update intent documentation in AI development/procurement
✓ Add TRAIGA training to compliance program
✓ Review AI contracts for vendor TRAIGA representations
✓ Monitor Texas AI Council for evolving guidance
        `,
        quiz: [
          {
            id: 'a6q1',
            question: 'What is TRAIGA\'s key legal framework for AI discrimination?',
            options: [
              'Strict liability — any disparate impact is illegal',
              'Intent-based — requires proof of discriminatory intent',
              'No discrimination standard',
              'Same as federal Title VII'
            ],
            correctAnswer: 1,
            explanation: 'TRAIGA uses intent-based liability, requiring proof that AI was designed or deployed with discriminatory intent, not just disparate impact.'
          },
          {
            id: 'a6q2',
            question: 'What disclosure requirement does TRAIGA impose on employers?',
            options: [
              'Per-candidate notification before each AI interaction',
              'High-level system disclosures (purpose, data used, deployment context) published before deployment',
              'Annual bias audit results',
              'No disclosure requirement'
            ],
            correctAnswer: 1,
            explanation: 'TRAIGA requires publishing high-level disclosures about AI system purpose, data used, and deployment context — not per-candidate notices like Illinois AIVI.'
          },
          {
            id: 'a6q3',
            question: 'What is the maximum civil penalty for a TRAIGA violation?',
            options: [
              '$1,000 per violation',
              '$10,000 per violation',
              '$100,000 per violation, $40,000/day for continuing violations',
              'No monetary penalties'
            ],
            correctAnswer: 2,
            explanation: 'TRAIGA authorizes civil penalties up to $100,000 per violation and $40,000 per day for continuing violations, enforced exclusively by the Texas Attorney General.'
          },
          {
            id: 'a6q4',
            question: 'What does the Texas AI Regulatory Sandbox provide?',
            options: [
              'Free AI development tools',
              '36-month immunity from state enforcement while testing innovative AI',
              'Tax credits for AI adoption',
              'Exemption from all federal laws'
            ],
            correctAnswer: 1,
            explanation: 'The Sandbox provides 36-month immunity from state enforcement for testing innovative AI, requiring application with risk/benefit assessments and mitigation plans.'
          },
          {
            id: 'a6q5',
            question: 'Texas employers using AI hiring tools must comply with:',
            options: [
              'Only TRAIGA',
              'Only TRAIGA and CUBI',
              'TRAIGA, CUBI, federal baseline (Title VII, ADA, ADEA), plus laws from other states where they hire',
              'No laws — Texas has no AI hiring regulations'
            ],
            correctAnswer: 2,
            explanation: 'Texas employers must comply with TRAIGA, CUBI (biometric consent), all federal baseline laws, AND laws from other states where they operate (e.g., NYC LL144 for NYC hires).'
          }
        ]
      }
    ]
  },

  executive: {
    id: 'executive',
    title: 'Executive AI Governance Overview',
    description: 'High-level overview of AI hiring compliance for leadership',
    targetAudience: 'C-Suite, VPs, Directors',
    estimatedTime: '20 minutes',
    sections: [
      {
        number: 1,
        title: 'Why AI Compliance Matters',
        description: 'Business and legal risks of AI in hiring',
        videoDuration: 420,
        content: `
## The Stakes

### Regulatory Risk
- NYC fines: $500-$1,500 per violation
- EEOC enforcement actions increasing
- Class action litigation growing
- DOJ civil rights investigations

### Reputational Risk
- Public bias audit disclosures
- Media attention on AI hiring failures
- Employee and candidate trust
- Employer brand damage

### Operational Risk
- Hiring process disruptions
- Invalidated hiring decisions
- Remediation costs
- Executive time and attention

## Why Act Now

1. **Regulations are accelerating**
   - 15+ states considering AI laws
   - EU AI Act influence
   - Federal agency guidance

2. **Enforcement is increasing**
   - First NYC fines issued 2024
   - EEOC settlement actions
   - Private litigation rising

3. **Proactive compliance is cheaper**
   - Build it right from the start
   - Avoid remediation costs
   - Demonstrate good faith
        `,
        quiz: [
          {
            id: 'e1q1',
            question: 'What is the per-violation fine range for NYC AI hiring violations?',
            options: [
              '$100-$200',
              '$500-$1,500',
              '$10,000-$50,000',
              'No fines, just warnings'
            ],
            correctAnswer: 1,
            explanation: 'NYC can impose fines of $500-$1,500 per violation of Local Law 144, which can add up quickly.'
          },
          {
            id: 'e1q2',
            question: 'Why should companies prioritize AI compliance now?',
            options: [
              'It\'s optional',
              'Regulations are accelerating and enforcement is increasing',
              'Only large companies need to worry',
              'AI compliance won\'t matter for years'
            ],
            correctAnswer: 1,
            explanation: 'The regulatory landscape is evolving rapidly with more states passing laws and enforcement actions increasing.'
          }
        ]
      },
      {
        number: 2,
        title: 'Governance & Oversight',
        description: 'Leadership responsibilities for AI compliance',
        videoDuration: 360,
        content: `
## Executive Responsibilities

### Set the Tone
- Make compliance a priority
- Allocate adequate resources
- Support HR/Compliance initiatives
- Include in corporate strategy

### Governance Structure
- Designate AI compliance ownership
- Clear reporting lines
- Board-level visibility
- Regular status updates

### Risk Management
- Include AI in risk assessments
- Monitor key metrics
- Review audit findings
- Approve remediation plans

### Investment Priorities
1. Compliance tools and systems
2. Training programs
3. Legal/advisory support
4. Audit and assessment
5. Documentation systems

## Key Questions to Ask

- What AI tools are we using in hiring?
- Are we compliant in all jurisdictions we hire?
- When was our last bias audit?
- What's our training completion rate?
- How are we tracking consent/disclosure?
        `,
        quiz: [
          {
            id: 'e2q1',
            question: 'What is the executive\'s primary role in AI compliance?',
            options: [
              'Personally review every hire',
              'Set tone, allocate resources, and ensure governance',
              'Write all policies',
              'Conduct bias audits'
            ],
            correctAnswer: 1,
            explanation: 'Executives should set the tone from the top, allocate resources, and ensure proper governance structures exist.'
          },
          {
            id: 'e2q2',
            question: 'What question should executives regularly ask about AI hiring?',
            options: [
              'Why do we hire people?',
              'What AI tools are we using and are we compliant?',
              'Can we eliminate HR?',
              'How much does AI cost?'
            ],
            correctAnswer: 1,
            explanation: 'Executives should regularly verify what AI tools are in use and whether the organization is compliant in all hiring jurisdictions.'
          }
        ]
      },
      {
        number: 3,
        title: 'The Full Legal Attack Surface',
        description: 'Understanding the 50+ laws your AI hiring tools must comply with',
        videoDuration: 480,
        content: `
As an executive, you need to understand the FULL scope of legal exposure from AI hiring tools — not just the headline AI laws.

THE HEADLINE NUMBER: 50+ LAWS
Your AI hiring tools potentially violate laws across 10 categories. Most of your competitors are only tracking 5-7 AI-specific laws. This creates both risk and opportunity.

THE BIGGEST RISKS YOU DIDN'T KNOW ABOUT:

1. Illinois BIPA — $1,000-$5,000 PER SCAN
If your video interview tool analyzes facial features in Illinois, every single scan is a separate violation. One class action reached $17 billion in potential liability. This is the #1 financial risk in AI hiring.

2. Wiretapping Is a FELONY
Recording AI video interviews without consent in Florida (5 years) or Pennsylvania (7 years) isn't a civil matter — it's criminal. Most companies don't even realize their tools are recording.

3. FCRA Class Actions Are Coming
When AI vendors generate candidate scores, they may be operating as unregistered consumer reporting agencies. The CFPB has confirmed this interpretation. Eightfold AI is already facing a class action.

4. Lie Detector Laws Apply to AI
CVS settled a lawsuit because HireVue scored candidates on "integrity" using facial expressions. The federal EPPA and 20+ state laws ban this. If your tools assess "honesty" or "deception," you're exposed.

WHAT THIS MEANS FOR THE BOARD:
• Budget for compliance across all 10 categories, not just AI-specific
• Insurance: verify AI liability coverage includes biometric and wiretapping claims
• Vendor contracts: require compliance representations covering ALL categories
• Incident response: have a plan for biometric breaches and consent failures
        `,
        quiz: [
          {
            id: 'e3q1',
            question: 'What is the estimated potential liability in Illinois BIPA class actions involving AI hiring tools?',
            options: [
              'Thousands of dollars',
              'Hundreds of thousands',
              'Potentially billions (per-scan accrual)',
              'There are no financial penalties'
            ],
            correctAnswer: 2,
            explanation: 'BIPA allows $1,000-$5,000 per violation, and the IL Supreme Court ruled each scan is a separate violation. One case reached $17 billion in potential liability.'
          },
          {
            id: 'e3q2',
            question: 'Recording an AI video interview without proper consent in Pennsylvania could result in:',
            options: [
              'A compliance fine',
              'A civil lawsuit only',
              'A felony charge with up to 7 years imprisonment',
              'No consequences'
            ],
            correctAnswer: 2,
            explanation: 'Pennsylvania is an all-party consent state with felony penalties up to 7 years for unauthorized recording — making this a criminal, not just civil, risk.'
          },
          {
            id: 'e3q3',
            question: 'What should the board ensure regarding AI hiring tool vendor contracts?',
            options: [
              'Only check the price',
              'Require compliance representations covering ALL 10 law categories',
              'Let the vendor handle everything',
              'Only require AI-specific law compliance'
            ],
            correctAnswer: 1,
            explanation: 'Vendor contracts should require compliance representations across all categories — AI-specific, biometric, wiretapping, FCRA, etc. Employers are liable even when using third-party tools.'
          }
        ]
      }
    ]
  }
}

export const TRACK_LABELS: Record<TrainingTrack, string> = {
  recruiter: 'Recruiter',
  manager: 'Hiring Manager',
  admin: 'HR Admin',
  executive: 'Executive'
}

export const TRACK_DESCRIPTIONS: Record<TrainingTrack, string> = {
  recruiter: 'For recruiters and talent acquisition specialists who use AI tools to source and screen candidates',
  manager: 'For hiring managers who make employment decisions based on AI-assisted screening',
  admin: 'For HR professionals who manage AI compliance programs and policies',
  executive: 'For executives who need high-level understanding of AI governance and risk'
}

export function getTrackData(track: TrainingTrack): TrainingTrackData {
  return TRAINING_TRACKS[track]
}

export function getTotalSections(track: TrainingTrack): number {
  return TRAINING_TRACKS[track].sections.length
}

export function calculateQuizScore(answers: Record<string, number>, quiz: QuizQuestion[]): number {
  let correct = 0
  for (const question of quiz) {
    if (answers[question.id] === question.correctAnswer) {
      correct++
    }
  }
  return Math.round((correct / quiz.length) * 100)
}
