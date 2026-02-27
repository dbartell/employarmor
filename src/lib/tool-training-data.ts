// Tool-specific training module generation
// These are templates that get customized per org's states and tool configuration

export interface ToolTrainingModule {
  toolSlug: string
  toolName: string
  category: string
  estimatedTime: string
  hostName: string          // The "compliance host" character
  hostImage?: string        // URL to host avatar image
  sections: ToolTrainingSection[]
}

export interface ToolTrainingSection {
  number: number
  title: string
  hostDialogue: string      // What the "host" says (shown with avatar)
  canDo: string[]
  beCareful: string[]
  doNot: string[]
  stateSpecific?: StateSpecificNote[]
  quiz: ToolQuizQuestion[]
}

export interface StateSpecificNote {
  state: string
  stateName: string
  note: string
  law: string
}

export interface ToolQuizQuestion {
  id: string
  scenario: string          // Scenario-based question
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  hostFeedback: string      // What the host says after answering
}

// Template modules for common tools
// In production, AI generates these based on tool catalog + org states
export const TOOL_TRAINING_TEMPLATES: Record<string, Omit<ToolTrainingModule, 'toolSlug'>> = {
  'greenhouse': {
    toolName: 'Greenhouse',
    category: 'ATS',
    estimatedTime: '8 minutes',
    hostName: 'Sarah',
    sections: [
      {
        number: 1,
        title: 'Using Greenhouse Compliantly',
        hostDialogue: "Hey there! 👋 I'm Sarah from Compliance. Let's quickly go over how to use Greenhouse the right way. It only takes a few minutes, and trust me — knowing this stuff could save the company a lot of headaches.",
        canDo: [
          'Use Greenhouse to track candidates through your pipeline',
          'Schedule interviews and manage communications',
          'Use structured scorecards for consistent evaluation',
          'Export reports for hiring analytics',
        ],
        beCareful: [
          'Greenhouse\'s candidate scoring feature uses ML algorithms — this means candidate rankings are AI-generated',
          'Auto-reject rules based on screening questions may constitute automated decision-making',
          'Candidate data stored in Greenhouse may be subject to data access requests (CCPA states)',
        ],
        doNot: [
          'Rely solely on Greenhouse\'s AI scoring to reject candidates — human review is required',
          'Set up auto-reject rules without compliance review — these may trigger disclosure requirements',
          'Share candidate evaluation data outside the hiring team without proper authorization',
          'Delete candidate records before the retention period expires (4+ years recommended)',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'Greenhouse\'s candidate scoring feature must be disclosed to candidates before use under HB 3773. Ensure disclosure is sent before AI processing.',
            law: 'HB 3773 (effective Jan 1, 2026)',
          },
          {
            state: 'CO',
            stateName: 'Colorado',
            note: 'If Greenhouse is used for high-risk decisions (screening, ranking), an impact assessment may be required under the Colorado AI Act.',
            law: 'SB 24-205',
          },
          {
            state: 'NYC',
            stateName: 'New York City',
            note: 'Greenhouse\'s AI scoring qualifies as an AEDT under LL144. Annual bias audit required if used for NYC-based positions.',
            law: 'Local Law 144',
          },
        ],
        quiz: [
          {
            id: 'gh-q1',
            scenario: 'You\'re reviewing candidates for an open position. Greenhouse shows a "fit score" of 85% for one candidate and 42% for another.',
            question: 'What should you do?',
            options: [
              'Automatically reject the 42% candidate',
              'Use the scores as one input but review both candidates\' full profiles before deciding',
              'Only interview candidates above 70%',
              'Ignore the scores entirely — they\'re useless',
            ],
            correctAnswer: 1,
            explanation: 'AI scores should inform, not dictate, your decisions. Human review of all candidates is required before adverse action.',
            hostFeedback: "That's right! Think of AI scores like a colleague's opinion — worth considering, but you still need to form your own judgment. 👍",
          },
          {
            id: 'gh-q2',
            scenario: 'A colleague asks you to set up an auto-reject rule in Greenhouse: "If they don\'t have 5+ years experience, automatically reject them."',
            question: 'What\'s the correct response?',
            options: [
              'Set it up — it saves time',
              'Check with compliance first — auto-reject rules may require candidate disclosure',
              'Reject the idea entirely',
              'Set it up but don\'t tell anyone',
            ],
            correctAnswer: 1,
            explanation: 'Auto-reject rules constitute automated decision-making and may trigger disclosure requirements under state laws.',
            hostFeedback: "Always check with compliance before setting up automated rules! It takes 5 minutes and could prevent a lawsuit. 🛡️",
          },
          {
            id: 'gh-q3',
            scenario: 'A candidate in Illinois asks: "Is AI being used to evaluate my application?"',
            question: 'What should you tell them?',
            options: [
              '"No, we don\'t use AI"',
              '"I\'m not sure, let me check"',
              '"Yes, we use Greenhouse which includes AI-powered candidate scoring. Here\'s our disclosure page with full details."',
              '"That\'s confidential information"',
            ],
            correctAnswer: 2,
            explanation: 'Illinois HB 3773 requires transparency about AI use. Candidates should be directed to your disclosure page with full details.',
            hostFeedback: "Honesty is always the best policy — and in Illinois, it's the law! Your disclosure page has everything they need to know. 📋",
          },
        ],
      },
    ],
  },

  'linkedin-recruiter': {
    toolName: 'LinkedIn Recruiter',
    category: 'Sourcing',
    estimatedTime: '7 minutes',
    hostName: 'Sarah',
    sections: [
      {
        number: 1,
        title: 'Using LinkedIn Recruiter Compliantly',
        hostDialogue: "LinkedIn Recruiter is one of the most powerful sourcing tools out there — but it's also packed with AI features you might not even realize are there. Let me walk you through what you need to know.",
        canDo: [
          'Search for candidates using LinkedIn\'s search filters',
          'Send InMail messages to potential candidates',
          'Save candidate profiles to projects',
          'Use LinkedIn\'s job posting features',
        ],
        beCareful: [
          'LinkedIn\'s "Recommended Matches" uses AI to rank candidates — this is algorithmic decision-making',
          'InMail suggestions are AI-generated and may introduce bias in outreach',
          'Search results are algorithmically ranked, not neutral',
          'LinkedIn\'s "Likely to Respond" indicator uses predictive AI',
        ],
        doNot: [
          'Use LinkedIn\'s AI recommendations as the sole basis for candidate outreach decisions',
          'Assume LinkedIn\'s ranking is bias-free — algorithmic ranking can perpetuate historical patterns',
          'Use LinkedIn data to screen candidates based on protected characteristics (location as proxy for race, etc.)',
          'Scrape or export candidate data without proper data handling procedures',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'LinkedIn\'s AI-powered recommendations and ranking constitute AI use in recruitment under HB 3773. Disclosure required.',
            law: 'HB 3773',
          },
          {
            state: 'CO',
            stateName: 'Colorado',
            note: 'Using LinkedIn\'s AI features to screen or rank candidates may require notice under the Colorado AI Act.',
            law: 'SB 24-205',
          },
        ],
        quiz: [
          {
            id: 'li-q1',
            scenario: 'You\'re sourcing candidates on LinkedIn Recruiter. The tool shows "Recommended Matches" for your open role, ranking candidates by likelihood of fit.',
            question: 'Is this AI-powered feature subject to compliance requirements?',
            options: [
              'No, it\'s just a search engine',
              'Yes — AI ranking of candidates triggers disclosure requirements in regulated states',
              'Only if you\'re hiring in California',
              'Only if you reject someone based on the ranking',
            ],
            correctAnswer: 1,
            explanation: 'LinkedIn\'s recommendation engine uses ML to rank candidates, which constitutes AI in hiring under laws like IL HB 3773.',
            hostFeedback: "A lot of people don't realize LinkedIn Recruiter IS an AI hiring tool. Now you know! 🧠",
          },
          {
            id: 'li-q2',
            scenario: 'You notice that LinkedIn\'s recommended candidates for a role tend to come from similar educational backgrounds and zip codes.',
            question: 'What should you do?',
            options: [
              'Nothing — the AI knows best',
              'Document the pattern and report it to compliance — this could indicate proxy discrimination',
              'Manually add diversity candidates to balance it out',
              'Switch to a different tool',
            ],
            correctAnswer: 1,
            explanation: 'Patterns in AI recommendations that correlate with protected characteristics should be flagged for compliance review.',
            hostFeedback: "Great catch! Spotting these patterns is exactly what prevents discrimination claims down the road. Always flag it. 🚩",
          },
        ],
      },
    ],
  },

  'slack': {
    toolName: 'Slack',
    category: 'Communication',
    estimatedTime: '5 minutes',
    hostName: 'Sarah',
    sections: [
      {
        number: 1,
        title: 'Using Slack Safely in HR',
        hostDialogue: "Slack might not seem like a compliance risk — it's just a chat app, right? But with Slack AI features and the fact that messages are discoverable in lawsuits, there are some things every team member should know.",
        canDo: [
          'Use Slack for general team communication',
          'Share non-sensitive files and documents',
          'Use channels for project coordination',
          'Schedule meetings and send reminders',
        ],
        beCareful: [
          'Slack AI summaries and channel recaps process employee conversations — this may be subject to monitoring disclosure laws',
          'All Slack messages are discoverable in litigation — treat every message as potentially public',
          'Discussing candidates in Slack creates records that may need to be preserved for compliance',
        ],
        doNot: [
          'Discuss specific candidate evaluations or hiring decisions in Slack (use the ATS instead)',
          'Share salary or compensation data in channels (pay transparency law risk)',
          'Use Slack AI to summarize candidate interviews or hiring discussions (triggers AI disclosure requirements)',
          'Share background check results or sensitive candidate information in any Slack channel',
          'Discuss reasons for termination or disciplinary decisions (creates litigation evidence)',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'If Slack AI features are used to process any employment-related information, disclosure may be required under HB 3773.',
            law: 'HB 3773',
          },
        ],
        quiz: [
          {
            id: 'sl-q1',
            scenario: 'After interviewing a candidate, a hiring manager posts in the #hiring Slack channel: "Just interviewed Jane Doe — she seemed nervous and I don\'t think she\'d fit our culture."',
            question: 'What\'s wrong with this?',
            options: [
              'Nothing — it\'s internal communication',
              'This creates discoverable evidence that could be used in a discrimination claim, and subjective assessments like "culture fit" can be evidence of bias',
              'They should have used a private message instead',
              'They should have been more specific about why',
            ],
            correctAnswer: 1,
            explanation: 'Slack messages are discoverable in lawsuits. Subjective terms like "culture fit" and "seemed nervous" can be used as evidence of discriminatory intent.',
            hostFeedback: "This is one of the most common mistakes! Use your ATS scorecard for candidate feedback — never Slack. Every message could end up in front of a jury. ⚖️",
          },
          {
            id: 'sl-q2',
            scenario: 'You use Slack AI\'s channel recap feature to summarize a week of #recruiting channel conversations.',
            question: 'Is this a compliance concern?',
            options: [
              'No, it\'s just a summary',
              'Yes — AI processing of employment-related conversations may trigger disclosure requirements and creates additional discoverable records',
              'Only if someone complains',
              'Only in California',
            ],
            correctAnswer: 1,
            explanation: 'Slack AI processing employment discussions is AI use in the employment context, which may require disclosure in regulated states.',
            hostFeedback: "Even \"just a summary\" is AI processing employment data. When in doubt, keep hiring discussions in the ATS! 💬➡️📋",
          },
        ],
      },
    ],
  },

  'hirevue': {
    toolName: 'HireVue',
    category: 'Video Interviewing',
    estimatedTime: '10 minutes',
    hostName: 'Sarah',
    sections: [
      {
        number: 1,
        title: 'HireVue Compliance Essentials',
        hostDialogue: "HireVue is probably the most regulated AI hiring tool out there — it analyzes video interviews using AI, which triggers requirements in almost every state with AI hiring laws. Let's make sure you know exactly what to do.",
        canDo: [
          'Use HireVue for structured video interviews with pre-set questions',
          'Review recorded interviews at your convenience',
          'Use standardized scoring criteria',
          'Share interviews with the hiring team for collaborative review',
        ],
        beCareful: [
          'HireVue\'s AI analyzes word choice, speech patterns, and response content',
          'Game-based assessments use AI to evaluate cognitive traits',
          'Candidates MUST be notified and consent obtained before AI analysis in most states',
          'All AI evaluations must be supplemented with human review before final decisions',
        ],
        doNot: [
          'Send a HireVue interview invitation without first confirming the candidate received AI disclosure',
          'Use HireVue AI scores as the sole basis for rejecting a candidate',
          'Skip the consent step — Illinois AIVIA requires written consent for AI video analysis',
          'Retain video recordings beyond the required period without candidate consent',
          'Use HireVue for positions in jurisdictions where you haven\'t set up proper disclosures',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'AIVIA requires: (1) written notice before interview, (2) explanation of how AI works and what it evaluates, (3) written consent, (4) deletion within 30 days if requested. HB 3773 adds broader disclosure requirements.',
            law: 'AIVIA + HB 3773',
          },
          {
            state: 'MD',
            stateName: 'Maryland',
            note: 'Maryland HB 1202 requires consent before using facial recognition in interviews. Candidate can decline without penalty.',
            law: 'HB 1202',
          },
          {
            state: 'NYC',
            stateName: 'New York City',
            note: 'HireVue qualifies as an AEDT. Annual independent bias audit required. Results must be publicly posted. 10 business days notice to NYC candidates.',
            law: 'Local Law 144',
          },
        ],
        quiz: [
          {
            id: 'hv-q1',
            scenario: 'You need to schedule a HireVue video interview with a candidate applying for a role in your Chicago office.',
            question: 'What must happen BEFORE you send the HireVue link?',
            options: [
              'Nothing — just send the link',
              'The candidate must receive written notice about AI analysis AND provide written consent',
              'Just mention it in the job posting',
              'Email them after the interview to let them know',
            ],
            correctAnswer: 1,
            explanation: 'Illinois AIVIA requires written notice AND written consent BEFORE any AI-analyzed video interview.',
            hostFeedback: "Illinois is serious about this one — written notice AND consent, both BEFORE the interview. No exceptions! ✍️",
          },
          {
            id: 'hv-q2',
            scenario: 'HireVue gives a candidate a "competency score" of 35/100. Your gut feeling from watching the replay is that the candidate actually interviewed well.',
            question: 'What should you do?',
            options: [
              'Trust the AI — 35/100 is a clear reject',
              'Document your observations, override the AI score with your human assessment, and advance the candidate if warranted',
              'Average your score with the AI score',
              'Ask HireVue to re-score the interview',
            ],
            correctAnswer: 1,
            explanation: 'Human judgment should supplement AI scoring. Document when you disagree with AI recommendations — this actually strengthens your compliance posture.',
            hostFeedback: "Overriding AI with documented human judgment is GOOD compliance practice. It shows your decisions aren't on autopilot. 🎯",
          },
          {
            id: 'hv-q3',
            scenario: 'An Illinois candidate emails: "I did my HireVue interview 3 weeks ago. I want the video deleted."',
            question: 'How should you respond?',
            options: [
              '"Sorry, we keep all recordings"',
              '"We\'ll delete it after the position is filled"',
              'Honor the request — Illinois AIVIA gives candidates the right to request deletion within 30 days',
              '"Please contact HireVue directly"',
            ],
            correctAnswer: 2,
            explanation: 'Illinois AIVIA gives candidates the right to request video deletion within 30 days. The employer must comply.',
            hostFeedback: "The 30-day deletion right is one of the most specific provisions in AIVIA. When a candidate asks, you delete. Simple as that. 🗑️",
          },
        ],
      },
    ],
  },

  'indeed': {
    toolName: 'Indeed',
    category: 'Job Board & Screening',
    estimatedTime: '6 minutes',
    hostName: 'Marcus',
    sections: [
      {
        number: 1,
        title: 'Using Indeed Compliantly',
        hostDialogue: "Hey, I'm Marcus! Indeed is one of the most popular job boards out there, but a lot of people don't realize it has AI running under the hood. Let me show you what to watch for.",
        canDo: [
          'Post job listings and manage applications',
          'Use Indeed\'s messaging to communicate with candidates',
          'Review candidate profiles and resumes',
          'Use Indeed\'s analytics to track posting performance',
        ],
        beCareful: [
          'Indeed\'s matching algorithm uses AI to rank candidates — you\'re seeing an algorithmically sorted list, not a neutral one',
          'Sponsored job posts use AI to target specific candidate demographics',
          'Indeed Assessments use algorithmic scoring to evaluate candidates',
          'Indeed\'s "Instant Match" feature uses AI to recommend candidates before they even apply',
        ],
        doNot: [
          'Rely solely on Indeed\'s AI-ranked candidate list to decide who to contact',
          'Use Indeed\'s screening questions as automated rejection criteria without compliance review',
          'Assume Indeed\'s candidate matching is bias-free — algorithmic matching can reflect historical patterns',
          'Ignore candidates who apply directly but aren\'t "recommended" by the algorithm',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'Indeed\'s AI matching and ranking features constitute AI in recruitment under HB 3773. Candidates must be notified.',
            law: 'HB 3773',
          },
          {
            state: 'CO',
            stateName: 'Colorado',
            note: 'If using Indeed\'s AI features to screen Colorado applicants, notice may be required under the Colorado AI Act.',
            law: 'SB 24-205',
          },
        ],
        quiz: [
          {
            id: 'ind-q1',
            scenario: 'You post a job on Indeed and get 200 applications. Indeed shows you a "Recommended" list of 15 candidates at the top.',
            question: 'Should you only review the 15 recommended candidates?',
            options: [
              'Yes — Indeed\'s AI identified the best fits',
              'No — the AI ranking may exclude qualified candidates and creates a biased screening funnel',
              'Yes, but also review 5 random others',
              'Only if you\'re in a hurry',
            ],
            correctAnswer: 1,
            explanation: 'Relying solely on AI recommendations narrows your funnel in ways that may not be legally defensible and could introduce bias.',
            hostFeedback: "The recommended list is a starting point, not the finish line. Always cast a wider net! 🎣",
          },
          {
            id: 'ind-q2',
            scenario: 'You set up screening questions on Indeed: "Do you have 10+ years of experience?" Candidates who answer "No" are automatically labeled "Not a fit."',
            question: 'Is this a compliance concern?',
            options: [
              'No — it\'s just a filter',
              'Yes — automated screening based on rigid criteria can constitute AI-driven adverse action and may have disparate impact',
              'Only if someone complains',
              'No, because Indeed handles compliance',
            ],
            correctAnswer: 1,
            explanation: 'Automated screening questions that eliminate candidates constitute algorithmic decision-making. Rigid experience requirements can also have age-related disparate impact.',
            hostFeedback: "Automatic filters = automatic compliance risk. If a question auto-rejects people, it needs compliance review first. ⚖️",
          },
        ],
      },
    ],
  },

  'lever': {
    toolName: 'Lever',
    category: 'ATS',
    estimatedTime: '7 minutes',
    hostName: 'Sarah',
    sections: [
      {
        number: 1,
        title: 'Using Lever Compliantly',
        hostDialogue: "Hi again! 👋 Lever is a great ATS with some powerful CRM features. But like Greenhouse, it has AI features that trigger compliance requirements. Let's make sure you're covered.",
        canDo: [
          'Manage your recruiting pipeline and candidate communications',
          'Use Lever\'s structured interview kits and scorecards',
          'Track candidate sources and referrals',
          'Generate hiring reports and analytics',
        ],
        beCareful: [
          'Lever\'s nurture campaigns use AI to recommend outreach timing and content',
          'Candidate recommendations engine uses ML to suggest similar candidates',
          'Pipeline analytics may use predictive modeling for time-to-hire forecasts',
          'Lever\'s "suggested candidates" feature pulls from your CRM using AI matching',
        ],
        doNot: [
          'Let Lever\'s AI nurture campaigns go out without verifying compliance language is included',
          'Use candidate similarity recommendations as the sole basis for sourcing decisions',
          'Assume Lever handles compliance for you — you\'re responsible for AI disclosure',
          'Auto-archive candidates based solely on algorithmic scores or inactivity triggers',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'Lever\'s AI candidate recommendations and nurture features constitute AI use in recruitment. HB 3773 disclosure required.',
            law: 'HB 3773',
          },
          {
            state: 'NYC',
            stateName: 'New York City',
            note: 'If Lever\'s AI features influence screening decisions for NYC candidates, annual bias audit may be required under LL144.',
            law: 'Local Law 144',
          },
        ],
        quiz: [
          {
            id: 'lv-q1',
            scenario: 'Lever suggests a list of "Similar Candidates" from your CRM based on a recently hired person\'s profile.',
            question: 'What should you be aware of?',
            options: [
              'Nothing — use the list as-is',
              'This is AI-driven candidate matching that could perpetuate homogeneity. Use it as one input but diversify your sourcing.',
              'Only use it for senior roles',
              'Only use it if the hire was successful',
            ],
            correctAnswer: 1,
            explanation: 'AI similarity matching can create echo chambers — recommending candidates who look like past hires perpetuates existing patterns.',
            hostFeedback: "\"Similar candidates\" sounds helpful, but it can also mean \"candidates who look like the people we already hired.\" Diversify your funnel! 🌍",
          },
          {
            id: 'lv-q2',
            scenario: 'Your automated Lever nurture campaign sends emails to candidates in your CRM. A candidate in Illinois receives one.',
            question: 'Do AI-powered nurture campaigns require disclosure?',
            options: [
              'No — it\'s just an email',
              'Yes — AI-timed and AI-recommended outreach to candidates in regulated states may require notification that AI is being used in the recruitment process',
              'Only if the email mentions AI',
              'Only for new applications, not CRM contacts',
            ],
            correctAnswer: 1,
            explanation: 'AI-driven outreach to candidates in regulated jurisdictions is part of the recruitment process and may trigger disclosure requirements.',
            hostFeedback: "If AI decides when or who to email, that's AI in recruitment. Illinois cares about this! 📧",
          },
        ],
      },
    ],
  },

  'workday': {
    toolName: 'Workday Recruiting',
    category: 'Enterprise HCM',
    estimatedTime: '8 minutes',
    hostName: 'Elena',
    sections: [
      {
        number: 1,
        title: 'Using Workday Recruiting Compliantly',
        hostDialogue: "I'm Elena, and I work closely with our legal team. Workday is an enterprise powerhouse, but its AI features are extensive and deeply embedded. Most users don't even realize how much AI they're interacting with. Let me break it down.",
        canDo: [
          'Manage the full recruiting lifecycle from requisition to offer',
          'Use Workday\'s reporting and analytics dashboards',
          'Configure structured interview processes',
          'Manage internal mobility and talent pools',
        ],
        beCareful: [
          'Workday\'s ML-powered candidate matching ranks applicants algorithmically',
          'Skills Cloud uses AI to infer candidate skills from resumes — these inferences drive matching',
          'Workday\'s "Suggested Candidates" feature uses predictive AI',
          'Internal mobility recommendations are AI-driven and still subject to anti-discrimination laws',
          'Workday Peakon (employee engagement) uses AI that may intersect with employment decisions',
        ],
        doNot: [
          'Treat Workday\'s candidate ranking as a neutral ordering — it\'s ML-driven',
          'Use Skills Cloud inferences as factual without verification (AI may infer skills the candidate doesn\'t have)',
          'Assume internal mobility AI is exempt from disclosure — employee-facing AI decisions are also covered by HB 3773',
          'Skip disclosure because "it\'s just our HRIS" — Workday\'s AI features are extensive',
          'Let automated disposition rules reject candidates without human review checkpoints',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'Workday\'s ML matching, Skills Cloud, and automated screening features all fall under HB 3773. Disclosure required for both external candidates and internal employees affected by AI decisions.',
            law: 'HB 3773',
          },
          {
            state: 'CO',
            stateName: 'Colorado',
            note: 'Workday\'s AI features used for hiring or promotion decisions are high-risk AI under the Colorado AI Act. Impact assessment required.',
            law: 'SB 24-205',
          },
          {
            state: 'NYC',
            stateName: 'New York City',
            note: 'Workday\'s candidate scoring and ranking qualifies as AEDT. Bias audit required for NYC-based positions.',
            law: 'Local Law 144',
          },
        ],
        quiz: [
          {
            id: 'wd-q1',
            scenario: 'Workday\'s Skills Cloud automatically tags a candidate as having "Python" and "Data Analysis" skills based on their resume, even though they never listed those skills explicitly.',
            question: 'How should you handle AI-inferred skills?',
            options: [
              'Trust them — Workday\'s AI is sophisticated',
              'Treat them as AI-generated inferences, not facts. Verify with the candidate before making decisions based on inferred skills.',
              'Delete the inferred skills',
              'Ignore all skills data',
            ],
            correctAnswer: 1,
            explanation: 'AI skill inferences can be inaccurate and shouldn\'t be treated as candidate-verified data. They\'re useful inputs but require validation.',
            hostFeedback: "AI inferences are educated guesses, not facts. Always verify before they influence a hiring decision. From a legal standpoint, decisions based on wrong AI data are still your responsibility. ⚖️",
          },
          {
            id: 'wd-q2',
            scenario: 'An internal employee in Colorado applies for a promotion. Workday\'s AI ranks them against other internal candidates.',
            question: 'Is this subject to AI compliance requirements?',
            options: [
              'No — internal moves aren\'t covered',
              'Yes — AI used for promotions and internal mobility is covered under both HB 3773 and the Colorado AI Act',
              'Only if they don\'t get the promotion',
              'Only for external hires',
            ],
            correctAnswer: 1,
            explanation: 'Both Illinois HB 3773 and Colorado\'s AI Act explicitly cover promotions and internal employment decisions, not just hiring.',
            hostFeedback: "This is one people miss all the time! AI in promotions, not just hiring, triggers compliance requirements. Internal doesn't mean exempt. 🏢",
          },
        ],
      },
    ],
  },

  'checkr': {
    toolName: 'Checkr',
    category: 'Background Checks',
    estimatedTime: '8 minutes',
    hostName: 'Elena',
    sections: [
      {
        number: 1,
        title: 'Using Checkr Compliantly',
        hostDialogue: "Background checks are one of the most heavily regulated areas in hiring — and Checkr uses AI to process them. Let's make sure you know the rules, because FCRA violations can be very expensive.",
        canDo: [
          'Run background checks through Checkr with proper candidate authorization',
          'Use Checkr\'s dashboard to review completed reports',
          'Configure screening packages appropriate for the position',
          'Use Checkr\'s adverse action workflow',
        ],
        beCareful: [
          'Checkr uses AI to parse and match criminal records — false positives can occur',
          'Automated adjudication rules (auto-pass/fail based on results) are AI-driven decisions',
          'Checkr\'s "Assess" feature uses algorithmic risk scoring',
          'Ban-the-box laws in many states restrict WHEN you can run background checks',
        ],
        doNot: [
          'Run a background check without proper written authorization from the candidate (FCRA requirement)',
          'Use Checkr\'s auto-adjudication to reject candidates without human review — this violates FCRA adverse action requirements',
          'Share background check results with anyone not involved in the hiring decision',
          'Make hiring decisions based on arrests without convictions (illegal in many states)',
          'Skip the pre-adverse action notice — you MUST notify candidates before taking action based on results',
          'Run checks before conditional offer in ban-the-box jurisdictions',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'Illinois has strong ban-the-box protections. Cannot inquire about criminal history until after an interview or conditional offer. AI-driven background screening also falls under HB 3773 disclosure.',
            law: 'Illinois Job Opportunities for Qualified Applicants Act + HB 3773',
          },
          {
            state: 'NYC',
            stateName: 'New York City',
            note: 'NYC Fair Chance Act: cannot inquire about criminal history until after conditional offer. Must follow specific adverse action process if considering withdrawal.',
            law: 'Fair Chance Act',
          },
          {
            state: 'CO',
            stateName: 'Colorado',
            note: 'Colorado Chance to Compete Act: cannot ask about criminal history on initial application. AI scoring of background results may trigger Colorado AI Act.',
            law: 'Chance to Compete Act + SB 24-205',
          },
        ],
        quiz: [
          {
            id: 'ck-q1',
            scenario: 'Checkr returns a background check with a flagged criminal record. Your auto-adjudication rule is set to "fail" anyone with a felony conviction.',
            question: 'Can you automatically reject this candidate?',
            options: [
              'Yes — they have a felony',
              'No — FCRA requires a pre-adverse action notice, a waiting period, and a final adverse action notice. Auto-rejection without this process violates federal law.',
              'Yes, but send them an email after',
              'Only if the felony is recent',
            ],
            correctAnswer: 1,
            explanation: 'FCRA mandates a specific adverse action process: pre-adverse notice → waiting period (usually 5 business days) → final adverse action notice. Skipping any step is a federal violation.',
            hostFeedback: "The FCRA adverse action process is non-negotiable. Pre-adverse notice, wait, then final notice. Auto-reject = auto-lawsuit. ⚠️",
          },
          {
            id: 'ck-q2',
            scenario: 'A recruiter asks you to share a candidate\'s Checkr background report with the hiring manager via email.',
            question: 'What should you do?',
            options: [
              'Forward the report — the hiring manager needs to see it',
              'Only share the adjudication result (pass/fail), not the full report. Background check details should only be accessible to authorized personnel on a need-to-know basis.',
              'Print it and put it in their file',
              'Share it in the team Slack channel',
            ],
            correctAnswer: 1,
            explanation: 'Background check reports contain sensitive information protected by FCRA. Share only what\'s necessary (the decision, not the details) with only those who need it.',
            hostFeedback: "Less is more with background check data. Share the decision, not the details. FCRA takes data handling seriously. 🔒",
          },
          {
            id: 'ck-q3',
            scenario: 'You\'re about to hire for a position in Chicago. The hiring manager asks to run a background check on all applicants before interviews.',
            question: 'Can you do this?',
            options: [
              'Yes — run them early to save time',
              'No — Illinois ban-the-box law prohibits criminal history inquiry until after an interview or conditional offer',
              'Only for management positions',
              'Only with the candidate\'s permission',
            ],
            correctAnswer: 1,
            explanation: 'Illinois Job Opportunities for Qualified Applicants Act prohibits criminal history inquiry before interview or conditional offer stage.',
            hostFeedback: "Illinois is a ban-the-box state! Background checks come AFTER interviews or conditional offers, not before. Timing matters. ⏰",
          },
        ],
      },
    ],
  },

  'chatgpt': {
    toolName: 'ChatGPT / AI Assistants',
    category: 'General AI',
    estimatedTime: '6 minutes',
    hostName: 'David',
    sections: [
      {
        number: 1,
        title: 'Using ChatGPT & AI Assistants in HR',
        hostDialogue: "Hey, I'm David! ChatGPT and similar AI tools are incredibly useful, but when it comes to hiring and HR, they can create some serious compliance issues. Let me show you where the lines are.",
        canDo: [
          'Use ChatGPT to draft job descriptions (review before posting)',
          'Generate interview question templates (have compliance review them)',
          'Summarize publicly available industry research',
          'Draft internal HR policy documents for review',
        ],
        beCareful: [
          'Any output used in hiring decisions makes ChatGPT part of your AI hiring stack',
          'ChatGPT can generate biased content that reflects training data patterns',
          'Anything you paste into ChatGPT may be used for model training — don\'t paste candidate data',
          'ChatGPT-generated screening criteria may not be legally defensible',
        ],
        doNot: [
          'Paste candidate resumes, applications, or personal data into ChatGPT',
          'Use ChatGPT to rank, score, or evaluate specific candidates',
          'Generate rejection or adverse action communications without legal review',
          'Use ChatGPT to create screening criteria that could have disparate impact (e.g., "top 10 universities")',
          'Ask ChatGPT to predict which candidates will be "culture fits"',
          'Treat ChatGPT-generated HR advice as legal advice',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'If ChatGPT outputs directly influence hiring decisions (e.g., generating screening criteria, evaluating candidates), this constitutes AI use under HB 3773 and requires disclosure.',
            law: 'HB 3773',
          },
        ],
        quiz: [
          {
            id: 'gpt-q1',
            scenario: 'A recruiter copies 5 candidate resumes into ChatGPT and asks: "Rank these candidates for a senior developer role and tell me who to interview."',
            question: 'What\'s wrong with this?',
            options: [
              'Nothing — it\'s efficient',
              'Multiple violations: sharing candidate PII with a third-party AI, using AI to rank candidates without disclosure, and no human review of the AI\'s decision criteria',
              'They should have used Claude instead',
              'They should have asked for top 3, not all 5',
            ],
            correctAnswer: 1,
            explanation: 'This violates data privacy (sharing PII with ChatGPT), creates undisclosed AI screening (candidates don\'t know), and removes human judgment from the process.',
            hostFeedback: "This is a triple violation! Never paste candidate data into ChatGPT. Never let it rank real candidates. And always disclose AI use. 🚫🚫🚫",
          },
          {
            id: 'gpt-q2',
            scenario: 'You ask ChatGPT: "Write screening criteria for a marketing manager role." It suggests requiring a degree from a "top-tier university" and "5+ years at a Fortune 500 company."',
            question: 'Should you use these criteria?',
            options: [
              'Yes — they sound professional',
              'No — these criteria likely have disparate impact on protected groups and aren\'t necessarily job-related. Have compliance review any AI-generated criteria.',
              'Yes, but add "or equivalent experience"',
              'Only for senior roles',
            ],
            correctAnswer: 1,
            explanation: '"Top-tier university" and "Fortune 500" requirements can create disparate impact based on socioeconomic status, race, and other protected characteristics without being job-related.',
            hostFeedback: "ChatGPT reflects the biases in its training data. \"Top-tier university\" sounds neutral but has massive disparate impact. Always review AI-generated criteria through a compliance lens. 🔍",
          },
        ],
      },
    ],
  },

  'zoom': {
    toolName: 'Zoom',
    category: 'Communication',
    estimatedTime: '5 minutes',
    hostName: 'David',
    sections: [
      {
        number: 1,
        title: 'Using Zoom in the Hiring Process',
        hostDialogue: "Zoom seems straightforward, but recent AI features have added compliance implications you should know about. Plus, recording interviews has its own rules.",
        canDo: [
          'Conduct video interviews with candidates',
          'Use Zoom\'s scheduling features',
          'Screen share for presentations during interviews',
          'Use waiting rooms for organized interview scheduling',
        ],
        beCareful: [
          'Zoom AI Companion generates meeting summaries — these are AI-processed records of interviews',
          'Zoom\'s transcription features create written records of everything said in an interview',
          'Recording interviews creates evidence that must be properly stored and may need to be disclosed or deleted',
          'Some states require all-party consent for recording (California, Illinois, others)',
        ],
        doNot: [
          'Enable Zoom AI Companion for candidate interviews without disclosure and consent',
          'Record interviews without informing the candidate AND getting consent (required in many states)',
          'Use AI-generated meeting summaries as evaluation tools without treating them as AI in hiring',
          'Share interview recordings with people outside the hiring team',
          'Keep recordings indefinitely — follow your data retention policy',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'Illinois is a two-party consent state for recording. Must get explicit consent before recording any interview. Zoom AI features used to analyze interviews trigger HB 3773 and AIVIA.',
            law: 'IL Eavesdropping Act + HB 3773 + AIVIA',
          },
          {
            state: 'CO',
            stateName: 'Colorado',
            note: 'Colorado is a one-party consent state for recording, but best practice is to inform all parties. AI analysis of recordings may trigger the Colorado AI Act.',
            law: 'SB 24-205',
          },
        ],
        quiz: [
          {
            id: 'zm-q1',
            scenario: 'You start a Zoom interview with a candidate in Illinois. You click "Record" and Zoom AI Companion is enabled, generating a live summary.',
            question: 'What should you have done before this?',
            options: [
              'Nothing — Zoom shows a recording notification',
              'Explicitly informed the candidate that the interview will be recorded AND that AI will process the conversation, then obtained their consent before starting',
              'Just mention it\'s being recorded at the beginning',
              'Turn off AI but recording is fine',
            ],
            correctAnswer: 1,
            explanation: 'Illinois requires two-party consent for recording AND AIVIA/HB 3773 require disclosure and consent for AI processing. Both must happen before the interview starts.',
            hostFeedback: "Two consents needed in Illinois: one for recording, one for AI processing. Get both BEFORE you hit record! ⏺️",
          },
          {
            id: 'zm-q2',
            scenario: 'After an interview, Zoom AI Companion generates a summary: "Candidate seemed hesitant when discussing leadership experience. Energy level was low."',
            question: 'How should this AI summary be treated?',
            options: [
              'Share it with the hiring team as interview notes',
              'This is an AI-generated assessment that could reflect bias. Do not use it as an evaluation tool. Rely on your structured scorecard instead.',
              'Save it to the candidate\'s file',
              'It\'s just a summary, use it however you want',
            ],
            correctAnswer: 1,
            explanation: 'AI-generated characterizations like "hesitant" and "low energy" can reflect and amplify bias. They\'re not objective assessments.',
            hostFeedback: "\"Seemed hesitant\" and \"low energy\" are subjective AI interpretations that could be influenced by gender, accent, cultural differences, or disability. Stick to your scorecard! 📝",
          },
        ],
      },
    ],
  },

  'criteria-corp': {
    toolName: 'Criteria Corp',
    category: 'Assessment',
    estimatedTime: '7 minutes',
    hostName: 'Elena',
    sections: [
      {
        number: 1,
        title: 'Using Criteria Corp Assessments Compliantly',
        hostDialogue: "I'm Elena. Pre-employment assessments are powerful, but they're one of the most scrutinized tools under employment law. The EEOC has been very clear: assessments must be job-related and non-discriminatory. Here's what you need to know.",
        canDo: [
          'Administer validated assessments that are job-related',
          'Use assessment results as ONE factor in hiring decisions',
          'Offer reasonable accommodations for candidates with disabilities',
          'Track assessment outcomes for adverse impact analysis',
        ],
        beCareful: [
          'Criteria Corp\'s assessments use algorithms to score and rank candidates — this is AI-driven evaluation',
          'Cognitive ability tests can have adverse impact on certain protected groups',
          'Personality assessments may inadvertently screen out candidates with certain disabilities',
          'Game-based assessments collect behavioral data analyzed by AI',
        ],
        doNot: [
          'Use assessments that haven\'t been validated for the specific position',
          'Set arbitrary cutoff scores without justification (e.g., "only candidates above 70")',
          'Refuse accommodations for candidates who request them',
          'Use assessment scores as the sole basis for rejection without human review',
          'Administer assessments before they\'re relevant in the process (early screening without justification)',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'AI-scored assessments require disclosure under HB 3773. Must notify candidates that algorithmic scoring is being used.',
            law: 'HB 3773',
          },
          {
            state: 'NYC',
            stateName: 'New York City',
            note: 'AI-scored assessments qualify as AEDTs under LL144. Annual independent bias audit required. Must provide 10 business days notice to NYC candidates.',
            law: 'Local Law 144',
          },
          {
            state: 'CO',
            stateName: 'Colorado',
            note: 'AI-powered assessments used for hiring decisions are high-risk AI under the Colorado AI Act. Impact assessment required.',
            law: 'SB 24-205',
          },
        ],
        quiz: [
          {
            id: 'cc-q1',
            scenario: 'A hiring manager wants to add a Criteria Corp cognitive ability test to every job posting, from entry-level to executive, using the same cutoff score.',
            question: 'What\'s the problem?',
            options: [
              'Nothing — consistency is good',
              'Assessments must be validated for each specific role. Using the same test and cutoff for every position isn\'t job-related and may have disparate impact.',
              'The cutoff should be higher for executives',
              'Only use it for technical roles',
            ],
            correctAnswer: 1,
            explanation: 'The EEOC requires assessments to be job-related and consistent with business necessity. A blanket approach fails both tests.',
            hostFeedback: "The EEOC is crystal clear: one-size-fits-all testing is a red flag. Each assessment must be justified for the specific role. ⚖️",
          },
          {
            id: 'cc-q2',
            scenario: 'A candidate requests extra time on a Criteria Corp assessment, citing a learning disability.',
            question: 'How should you respond?',
            options: [
              'Deny it — everyone gets the same conditions',
              'Grant reasonable accommodation. ADA requires it. Document the request and accommodation provided.',
              'Waive the assessment entirely',
              'Ask for medical proof before deciding',
            ],
            correctAnswer: 1,
            explanation: 'ADA requires reasonable accommodations for assessments. Extra time is a standard accommodation. Document everything.',
            hostFeedback: "Accommodations aren't optional — they're the law. Document the request, grant reasonable accommodation, and note it for your records. ♿",
          },
        ],
      },
    ],
  },

  'rippling': {
    toolName: 'Rippling',
    category: 'HRIS / Payroll',
    estimatedTime: '5 minutes',
    hostName: 'Sarah',
    sections: [
      {
        number: 1,
        title: 'Using Rippling HR Features Compliantly',
        hostDialogue: "Rippling is primarily an HRIS, but it has recruiting and AI features that can trigger compliance requirements. Even payroll data handled by AI has implications. Quick one — let's go!",
        canDo: [
          'Manage employee records, payroll, and benefits',
          'Use Rippling\'s onboarding workflows',
          'Track time and attendance',
          'Generate HR reports and analytics',
        ],
        beCareful: [
          'Rippling\'s recruiting module uses AI for candidate matching',
          'Workflow automations that trigger employment actions (PIPs, offboarding) may constitute AI-driven decisions',
          'Compensation recommendations based on market data use algorithmic analysis',
          'Rippling\'s analytics dashboard uses AI to surface insights about workforce trends',
        ],
        doNot: [
          'Set up automated employment actions (termination triggers, PIP automation) without compliance review',
          'Use AI-generated compensation recommendations without human review and pay equity analysis',
          'Let automated workflows make adverse employment decisions without a human checkpoint',
          'Assume HRIS = exempt from AI laws. If AI features influence employment decisions, they\'re covered.',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'HB 3773 covers AI used in discharge, discipline, and terms of employment — not just hiring. Rippling automations that affect these areas require disclosure.',
            law: 'HB 3773',
          },
        ],
        quiz: [
          {
            id: 'rp-q1',
            scenario: 'Rippling\'s workflow automation is configured to automatically start a PIP (Performance Improvement Plan) when an employee\'s performance score drops below a threshold.',
            question: 'Is this a compliance concern?',
            options: [
              'No — it\'s just an HR workflow',
              'Yes — automated triggering of disciplinary processes based on algorithmic scoring is AI in employment decisions, covered under HB 3773',
              'Only if the employee is terminated',
              'Only in California',
            ],
            correctAnswer: 1,
            explanation: 'HB 3773 covers AI in discipline and terms of employment. Automated PIP triggers based on algorithmic scores fall under this.',
            hostFeedback: "HR automations that affect employees' careers ARE AI employment decisions. A PIP changes someone's terms of employment! Always have a human in the loop. 👤",
          },
        ],
      },
    ],
  },

  'il-aipa-video-interviews': {
    toolName: 'IL AIPA Video Interview Compliance',
    category: 'Compliance Training',
    estimatedTime: '12 minutes',
    hostName: 'Sarah',
    sections: [
      {
        number: 1,
        title: 'Illinois AIPA Requirements for AI Video Interviews',
        hostDialogue: "Welcome! Illinois has some of the strictest laws in the country when it comes to AI-analyzed video interviews. The Artificial Intelligence Video Interview Act (AIPA) sets very specific requirements that every employer must follow. Let's walk through them together.",
        canDo: [
          'Use AI video interview tools with proper consent and disclosure',
          'Record video interviews after obtaining written consent from the applicant',
          'Use AI analysis as ONE input in your evaluation alongside human review',
          'Maintain a log of all video interview recordings and their status',
        ],
        beCareful: [
          'Consent must be obtained BEFORE the video interview takes place — not during or after',
          'The disclosure must explain how the AI works and what characteristics it evaluates',
          'Every sharing of a recording must be documented with who, when, and why',
          'Deletion requests trigger a strict 30-day compliance deadline',
        ],
        doNot: [
          'Conduct an AI-analyzed video interview without written consent from the applicant',
          'Fail to provide a clear explanation of how the AI analyzes the interview',
          'Share video recordings with anyone without documenting the sharing in your log',
          'Ignore or delay a deletion request — you have 30 days maximum to comply',
          'Use AI video analysis as the sole basis for any employment decision',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'AIPA (820 ILCS 42) requires: (1) written notice before interview explaining AI use, (2) written consent from applicant, (3) deletion within 30 days of request, (4) limits on who can view recordings. Violations carry penalties per incident.',
            law: 'AIPA (820 ILCS 42)',
          },
        ],
        quiz: [
          {
            id: 'vi-q1',
            scenario: 'Your company uses HireVue for video interviews. A recruiter wants to send a candidate a HireVue link for a position at your Chicago office.',
            question: 'What must happen before the candidate can complete the interview?',
            options: [
              'Nothing — just send the link',
              'Send a written notice explaining AI analysis AND obtain written consent from the candidate',
              'Verbally mention it during a phone screen',
              'Include a disclaimer in the job posting',
            ],
            correctAnswer: 1,
            explanation: 'Illinois AIPA requires written notice explaining how AI works AND written consent from the applicant BEFORE the video interview takes place.',
            hostFeedback: "This is non-negotiable in Illinois — written notice AND written consent, both BEFORE the interview. A verbal mention or job posting disclaimer isn't enough. ✍️",
          },
          {
            id: 'vi-q2',
            scenario: 'An applicant completes an AI-analyzed video interview. Two weeks later, they email requesting their video recording be deleted.',
            question: 'What is the deadline for complying with this deletion request?',
            options: [
              'You can keep it until the position is filled',
              '30 days from the date of the request',
              '90 days from the interview date',
              'No requirement to delete — you own the recording',
            ],
            correctAnswer: 1,
            explanation: 'Under AIPA, employers must delete the video recording within 30 days of receiving a deletion request from the applicant.',
            hostFeedback: "30 days from the request — mark it on your calendar! This is one of the most concrete deadlines in AI hiring law. Use the Video Interview tracker to monitor these deadlines. ⏰",
          },
          {
            id: 'vi-q3',
            scenario: 'The hiring manager wants to share a candidate\'s video interview recording with the VP of Engineering so they can weigh in on the hire.',
            question: 'What should you do?',
            options: [
              'Forward the video immediately — the VP needs to see it',
              'Log the sharing with the VP\'s name, date, and reason, then share the recording',
              'Refuse — video recordings can never be shared',
              'Only share if the candidate gave general consent to the interview',
            ],
            correctAnswer: 1,
            explanation: 'Recordings can be shared with people involved in the hiring process, but every instance of sharing must be documented with who received it, when, and why.',
            hostFeedback: "Sharing is allowed with people who need to see it for hiring purposes, but ALWAYS log it! Who, when, and why — every single time. This creates your audit trail. 📋",
          },
          {
            id: 'vi-q4',
            scenario: 'Your team uses an AI video tool that scores candidates on "enthusiasm" and "communication skills." A candidate with a speech impediment receives a low score.',
            question: 'What is the primary concern here?',
            options: [
              'The AI is working as intended — low communication score is accurate',
              'AI analysis of speech patterns may create disability discrimination; human review must supplement AI scoring',
              'Nothing — the AI is objective',
              'Just boost the score manually and move on',
            ],
            correctAnswer: 1,
            explanation: 'AI video analysis of speech patterns can create disparate impact against people with disabilities. Human review is essential to catch and correct these biases.',
            hostFeedback: "This is exactly why human review is required alongside AI analysis. An AI might penalize characteristics associated with disabilities, accents, or other protected traits. Always review AI scores critically! 🎯",
          },
        ],
      },
      {
        number: 2,
        title: 'Managing the 30-Day Deletion Workflow',
        hostDialogue: "Now let's get practical. The 30-day deletion deadline is one of the most actionable requirements in AIPA. Missing it could mean violations and penalties. Here's how to manage it effectively.",
        canDo: [
          'Use the Video Interview Tracker to log all recordings and monitor deletion deadlines',
          'Set up internal reminders at 20 days, 10 days, and 5 days remaining',
          'Document the deletion process — when it was requested, when completed, and by whom',
          'Export your records regularly for audit documentation',
        ],
        beCareful: [
          'The 30-day clock starts when the request is RECEIVED, not when you process it',
          'Deletion means complete removal — from primary storage AND backups',
          'If you use a third-party video platform, coordinate deletion with the vendor',
          'Keep the deletion request log even after the recording is deleted — you need proof of compliance',
        ],
        doNot: [
          'Let a deletion request sit unprocessed — start the workflow immediately',
          'Assume "deletion" means just archiving — the recording must be fully removed',
          'Lose track of deadlines — use the countdown feature in your tracker',
          'Delete the metadata/log entry when you delete the recording — keep the compliance record',
        ],
        stateSpecific: [
          {
            state: 'IL',
            stateName: 'Illinois',
            note: 'AIPA requires employers to destroy all copies of the video within 30 days. This includes copies shared with other evaluators. Coordinate with all parties who received the recording.',
            law: 'AIPA (820 ILCS 42)',
          },
        ],
        quiz: [
          {
            id: 'vi-q5',
            scenario: 'A deletion request comes in on March 1st. You shared the recording with 3 team members during the evaluation process. It\'s now March 25th.',
            question: 'What must happen by March 31st?',
            options: [
              'Only you need to delete your copy — team members can keep theirs',
              'All copies of the recording must be deleted — yours AND the 3 team members\' copies',
              'You have until April 30th since the team members received it later',
              'Just mark it as "deleted" in the system — no need to actually remove files',
            ],
            correctAnswer: 1,
            explanation: 'ALL copies must be destroyed within 30 days, including copies shared with team members. You need to coordinate with everyone who received the recording.',
            hostFeedback: "Every. Single. Copy. That means coordinating with the 3 team members AND confirming they've deleted their copies. Use the sharing log to know exactly who has it! 🗑️",
          },
          {
            id: 'vi-q6',
            scenario: 'Your company receives a deletion request for a video interview. You check and see the recording has already been shared with an external hiring consultant.',
            question: 'How should you handle this?',
            options: [
              'Tell the applicant you can\'t comply because a third party has the recording',
              'Contact the external consultant, request deletion of their copy, and confirm compliance within 30 days',
              'Delete only your copy and let the consultant deal with it',
              'Wait to see if the applicant follows up',
            ],
            correctAnswer: 1,
            explanation: 'You are responsible for ensuring ALL copies are deleted, including those shared with third parties. Contact the consultant immediately to coordinate deletion.',
            hostFeedback: "You're the employer — you're responsible even for copies held by your vendors and consultants. Reach out immediately and get written confirmation of deletion. Time is ticking! ⏱️",
          },
        ],
      },
    ],
  },

  'ca-feha-ads-decisions': {
    toolName: 'CA FEHA ADS Decision Logging',
    category: 'Compliance Training',
    estimatedTime: '12 minutes',
    hostName: 'Marcus',
    sections: [
      {
        number: 1,
        title: 'What Counts as an ADS Under California FEHA',
        hostDialogue: "Hey there! I'm Marcus. California's FEHA regulations on Automated Decision Systems (ADS) are some of the most comprehensive in the country. If your organization uses AI or algorithms in employment decisions, you need to understand what counts as an ADS and what you need to document. Let's break it down.",
        canDo: [
          'Use AI tools to assist with employment decisions when properly documented',
          'Leverage algorithmic screening as one input alongside human judgment',
          'Maintain comprehensive decision logs that demonstrate compliance',
          'Export records for audits and regulatory inquiries',
        ],
        beCareful: [
          'An ADS includes ANY computational process that screens, evaluates, or makes recommendations about applicants or employees',
          'This covers resume screening, candidate ranking, performance scoring, promotion recommendations, and termination risk models',
          'Even tools marketed as "analytics" or "insights" may qualify as ADS if they influence decisions',
          'You must document EVERY employment decision where an ADS was involved — not just negative ones',
        ],
        doNot: [
          'Assume a tool isn\'t an ADS because the vendor says it\'s "just analytics"',
          'Make employment decisions using an ADS without documenting inputs, outputs, and criteria',
          'Skip logging "positive" decisions like hires — ALL ADS decisions must be recorded',
          'Delete ADS decision records before the 4-year retention period expires',
          'Rely solely on AI outputs without human review and override capability',
        ],
        stateSpecific: [
          {
            state: 'CA',
            stateName: 'California',
            note: 'FEHA requires employers to retain all records related to employment decisions for a minimum of 4 years. For ADS, this includes the inputs provided, outputs generated, criteria used, and any bias testing performed. Cal. Gov. Code § 12946.',
            law: 'FEHA (Cal. Gov. Code § 12940 et seq.)',
          },
        ],
        quiz: [
          {
            id: 'ads-q1',
            scenario: 'Your company uses a resume screening tool that ranks candidates by "fit score" based on job requirements. A recruiter uses these scores to decide who to phone screen.',
            question: 'Does this qualify as an ADS under California FEHA?',
            options: [
              'No — it\'s just a search/filter tool',
              'Yes — any computational process that screens or evaluates candidates for employment decisions is an ADS',
              'Only if the tool explicitly says "AI" in its marketing',
              'Only if it auto-rejects candidates without human review',
            ],
            correctAnswer: 1,
            explanation: 'Under FEHA, an ADS includes any computational process that screens, evaluates, rates, or makes recommendations about applicants. A resume ranking tool clearly qualifies.',
            hostFeedback: "If it's computing something that influences who gets hired, it's an ADS. Don't get caught up in marketing terms — look at what the tool actually DOES. 🔍",
          },
          {
            id: 'ads-q2',
            scenario: 'A hiring manager uses Greenhouse\'s AI scoring to evaluate candidates. The candidate with the highest score is hired.',
            question: 'What must be documented for this decision?',
            options: [
              'Nothing — only rejected candidates need documentation',
              'Just the final decision and the candidate\'s name',
              'The tool used, inputs provided, AI output/score, criteria evaluated, any bias testing results, and the final decision',
              'Only the bias testing results',
            ],
            correctAnswer: 2,
            explanation: 'CA FEHA requires complete documentation: the tool name, what data was input, what the AI output was, what criteria were used, bias testing results, and the final decision made.',
            hostFeedback: "Complete documentation means: tool, inputs, outputs, criteria, bias testing, AND the final decision. Every. Single. Time. This is what protects you in an audit. 📝",
          },
          {
            id: 'ads-q3',
            scenario: 'Your company made an AI-assisted hiring decision 3.5 years ago. An employee suggests deleting old records to save storage space.',
            question: 'Can you delete these records?',
            options: [
              'Yes — 3 years is more than enough retention',
              'No — California FEHA requires a minimum 4-year retention period for employment decision records',
              'Yes — you only need to keep records for current employees',
              'You can delete them if you\'ve already exported a CSV backup',
            ],
            correctAnswer: 1,
            explanation: 'California FEHA requires retention of employment decision records for at least 4 years. Deleting them at 3.5 years would violate this requirement.',
            hostFeedback: "4 years minimum — no shortcuts! And honestly, many compliance experts recommend keeping them even longer. The ADS Decision Log tracks expiration dates so you know exactly when it's safe. ⏳",
          },
        ],
      },
      {
        number: 2,
        title: 'Documenting ADS Decisions and Bias Testing',
        hostDialogue: "Now let's get into the details of what you need to log for every ADS decision. Good documentation isn't just about checking boxes — it's your organization's best defense if a decision is ever challenged.",
        canDo: [
          'Use the ADS Decision Log to record every employment decision involving AI/algorithmic tools',
          'Document the specific inputs provided to the AI system (resume data, assessment scores, etc.)',
          'Record the AI\'s output and the final human decision — especially when they differ',
          'Log bias testing results and any corrective actions taken',
        ],
        beCareful: [
          'Document decisions at the TIME they are made — don\'t try to reconstruct records later',
          'When a human overrides the AI recommendation, document the reasoning in detail',
          'Bias testing should be conducted regularly, not just when convenient',
          'Records must include enough detail that someone could understand the decision years later',
        ],
        doNot: [
          'Skip documenting decisions because they seem routine or low-stakes',
          'Record only the AI\'s recommendation without noting the final human decision',
          'Forget to log the criteria the AI evaluated — this is critical for disparate impact analysis',
          'Wait until audit time to fill in documentation gaps — real-time logging is essential',
          'Assume one bias test covers all uses of a tool — test regularly and for each decision type',
        ],
        stateSpecific: [
          {
            state: 'CA',
            stateName: 'California',
            note: 'Under FEHA, failure to maintain adequate records of employment decisions can create an adverse inference in discrimination claims. Complete ADS documentation strengthens your defense. Additionally, SB 1047 may impose additional AI governance requirements.',
            law: 'FEHA + SB 1047',
          },
        ],
        quiz: [
          {
            id: 'ads-q4',
            scenario: 'An AI screening tool recommends rejecting a candidate, but the hiring manager reviews the application and decides to advance them to an interview.',
            question: 'How should this be documented?',
            options: [
              'No need to document — the candidate wasn\'t rejected',
              'Log only the final decision to advance the candidate',
              'Log the AI recommendation (reject), the human override decision (advance), and the manager\'s reasoning for overriding',
              'Just note that the AI and human disagreed',
            ],
            correctAnswer: 2,
            explanation: 'When a human overrides an AI recommendation, you should document both the AI output AND the human decision with reasoning. This demonstrates human oversight and can be evidence of non-discriminatory decision-making.',
            hostFeedback: "Human overrides are actually GREAT for compliance — they show the AI isn't making decisions on autopilot. But only if you document them properly! Log the AI's rec, your decision, and WHY you disagreed. 🎯",
          },
          {
            id: 'ads-q5',
            scenario: 'Your organization runs a quarterly bias audit on its AI hiring tools. The audit reveals that one tool shows a 15% lower pass rate for candidates over 50.',
            question: 'What should you do?',
            options: [
              'Ignore it — age isn\'t relevant to job qualifications',
              'Document the finding, investigate root causes, implement corrective measures, and log all actions in the ADS decision records',
              'Stop using the tool immediately without documentation',
              'Wait for the next quarter\'s audit to see if it persists',
            ],
            correctAnswer: 1,
            explanation: 'Bias testing results must be documented and acted upon. A 15% disparity in pass rates by age could indicate age discrimination. Document the finding, investigate, implement fixes, and log everything.',
            hostFeedback: "Document, investigate, fix, and log — that's the compliance playbook for bias findings. Ignoring it or waiting creates huge liability. And stopping the tool without documentation doesn't help either — you need a paper trail. 📊",
          },
          {
            id: 'ads-q6',
            scenario: 'A new manager asks: "Do I really need to log a decision when I use AI to promote someone? That\'s a positive outcome."',
            question: 'What\'s the correct response?',
            options: [
              '"No, only log adverse decisions like terminations and rejections"',
              '"Yes — CA FEHA requires documentation of ALL employment decisions involving ADS, including hires, promotions, and positive outcomes"',
              '"Only if the employee requests it"',
              '"Just keep a mental note of it"',
            ],
            correctAnswer: 1,
            explanation: 'ALL ADS-involved employment decisions must be documented — positive outcomes included. A promotion decision could be challenged by someone who was passed over, and you need complete records to demonstrate the decision was fair.',
            hostFeedback: "Every decision. Hires, rejects, promotions, terminations, discipline — ALL of them. A promotion you gave to one person is a promotion you denied to others. You need records to show the process was fair. ⚖️",
          },
        ],
      },
    ],
  },
}

// Generate a tool training module for an org's specific context
export function generateToolModule(
  toolSlug: string,
  orgStates: string[],
  customToolName?: string,
  customToolDescription?: string,
): ToolTrainingModule | null {
  const template = TOOL_TRAINING_TEMPLATES[toolSlug]
  
  if (!template) {
    // For unknown tools, return null — AI generation would handle these in production
    // TODO: Call AI to generate module based on tool catalog + org states
    return null
  }

  // Filter state-specific notes to only the org's states
  const module: ToolTrainingModule = {
    toolSlug,
    ...template,
    sections: template.sections.map(section => ({
      ...section,
      stateSpecific: section.stateSpecific?.filter(
        note => orgStates.includes(note.state)
      ),
    })),
  }

  return module
}

// Get all available tool training modules for an org
export function getOrgToolModules(
  approvedTools: string[],
  orgStates: string[],
): ToolTrainingModule[] {
  return approvedTools
    .map(slug => generateToolModule(slug, orgStates))
    .filter((m): m is ToolTrainingModule => m !== null)
}
