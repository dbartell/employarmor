// Quiz questions for each training course
export const QUIZ_QUESTIONS: Record<string, Array<{
  question: string
  options: string[]
  correctAnswer: number
}>> = {
  "ai-hiring-101": [
    {
      question: "Which of the following is considered an AI hiring tool?",
      options: [
        "A manual spreadsheet for tracking candidates",
        "An automated resume screening system",
        "A paper job application form",
        "A phone directory"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the primary purpose of AI in hiring?",
      options: [
        "To completely replace human decision-making",
        "To assist with and streamline hiring processes",
        "To discriminate against certain candidates",
        "To make hiring more complicated"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is NOT typically an AI hiring tool?",
      options: [
        "Video interview analysis platform",
        "Automated skills assessment",
        "Handwritten reference letter",
        "Chatbot for candidate screening"
      ],
      correctAnswer: 2
    }
  ],
  "state-requirements": [
    {
      question: "Which state requires notification to candidates about AI use in hiring?",
      options: [
        "All of the above",
        "Illinois",
        "Colorado",
        "New York"
      ],
      correctAnswer: 0
    },
    {
      question: "What does NYC Local Law 144 require?",
      options: [
        "Banning AI in all hiring decisions",
        "Annual bias audits for automated employment decision tools",
        "Hiring only through AI systems",
        "Removing all job postings"
      ],
      correctAnswer: 1
    },
    {
      question: "When must candidates be notified about AI use under most state laws?",
      options: [
        "After they are hired",
        "Before AI processing occurs",
        "Only if they ask",
        "Never"
      ],
      correctAnswer: 1
    },
    {
      question: "What can candidates request under Colorado's AI Act?",
      options: [
        "Complete deletion of all company records",
        "Information about how AI is used and alternatives upon request",
        "Access to the AI source code",
        "A guaranteed job offer"
      ],
      correctAnswer: 1
    }
  ],
  "disclosure-writing": [
    {
      question: "Effective disclosures should be:",
      options: [
        "Written in complex legal jargon",
        "Clear, conspicuous, and in plain language",
        "Hidden in employee handbooks",
        "Provided only after hiring"
      ],
      correctAnswer: 1
    },
    {
      question: "When should AI disclosures be provided to candidates?",
      options: [
        "After the hiring decision is made",
        "Before AI processing of their information",
        "Only if the candidate complains",
        "Never"
      ],
      correctAnswer: 1
    },
    {
      question: "What should an effective AI disclosure include?",
      options: [
        "Only the name of the AI tool",
        "How the AI is used, what it evaluates, and candidate rights",
        "Just a link to the vendor website",
        "Nothing specific"
      ],
      correctAnswer: 1
    }
  ],
  "bias-prevention": [
    {
      question: "Algorithmic bias in hiring AI can result from:",
      options: [
        "Training data that reflects historical discrimination",
        "Poorly designed algorithms",
        "Lack of diverse testing",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      question: "How can organizations mitigate AI bias?",
      options: [
        "Ignore the problem",
        "Regular bias audits and diverse testing",
        "Use AI without any oversight",
        "Hire only through AI"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a key strategy for preventing bias?",
      options: [
        "Never testing the AI system",
        "Monitoring AI outputs for disparate impact across protected groups",
        "Using the same AI for every job without changes",
        "Hiding AI use from candidates"
      ],
      correctAnswer: 1
    }
  ],
  "audit-preparation": [
    {
      question: "What documentation should be maintained for compliance audits?",
      options: [
        "None",
        "Only vendor contracts",
        "Disclosure records, audit reports, and decision logs",
        "Just employee names"
      ],
      correctAnswer: 2
    },
    {
      question: "How long should AI-related employment records typically be retained?",
      options: [
        "1 week",
        "According to applicable record retention laws (often 3-7 years)",
        "Forever",
        "They should be deleted immediately"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of an audit trail?",
      options: [
        "To hide AI use",
        "To demonstrate compliance and track decision-making processes",
        "To complicate processes",
        "To avoid responsibility"
      ],
      correctAnswer: 1
    }
  ]
}

export function getQuizQuestions(courseId: string) {
  return QUIZ_QUESTIONS[courseId] || []
}
