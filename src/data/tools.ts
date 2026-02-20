import { AITool } from "@/types"

export const aiHiringTools: AITool[] = [
  // === AI Hiring & Recruiting ===
  {
    id: "linkedin-recruiter",
    name: "LinkedIn Recruiter",
    category: "AI Hiring & Recruiting",
    description: "AI-powered candidate recommendations, search ranking, and InMail suggestions",
    commonUses: ["Candidate sourcing", "Profile ranking", "Outreach optimization"]
  },
  {
    id: "hirevue",
    name: "HireVue",
    category: "AI Hiring & Recruiting",
    description: "AI-powered video interview analysis, game-based assessments",
    commonUses: ["Video interview scoring", "Behavioral analysis", "Skills assessment"]
  },
  {
    id: "pymetrics",
    name: "Pymetrics",
    category: "AI Hiring & Recruiting",
    description: "Neuroscience-based games to assess cognitive and emotional traits",
    commonUses: ["Soft skills assessment", "Role fit prediction", "Bias reduction"]
  },
  {
    id: "eightfold",
    name: "Eightfold AI",
    category: "AI Hiring & Recruiting",
    description: "AI platform for talent acquisition, management, and internal mobility",
    commonUses: ["Candidate matching", "Career pathing", "Skills inference"]
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    category: "AI Hiring & Recruiting",
    description: "Applicant tracking with AI-powered features for candidate scoring",
    commonUses: ["Application tracking", "Interview scheduling", "Candidate scoring"]
  },
  {
    id: "lever",
    name: "Lever",
    category: "AI Hiring & Recruiting",
    description: "ATS and CRM with AI nurture campaigns and candidate recommendations",
    commonUses: ["Pipeline management", "Candidate nurturing", "Analytics"]
  },
  {
    id: "workday",
    name: "Workday Recruiting",
    category: "AI Hiring & Recruiting",
    description: "Enterprise recruiting with machine learning for candidate matching",
    commonUses: ["Enterprise recruiting", "Internal mobility", "Workforce planning"]
  },
  {
    id: "textio",
    name: "Textio",
    category: "AI Hiring & Recruiting",
    description: "AI-powered writing platform for inclusive job descriptions",
    commonUses: ["Job description optimization", "Bias detection", "Language analysis"]
  },
  {
    id: "paradox-olivia",
    name: "Paradox (Olivia)",
    category: "AI Hiring & Recruiting",
    description: "AI assistant for candidate screening, scheduling, and FAQs",
    commonUses: ["Chatbot screening", "Interview scheduling", "Candidate engagement"]
  },
  {
    id: "spark-hire",
    name: "Spark Hire",
    category: "AI Hiring & Recruiting",
    description: "Video interviewing platform with AI-assisted features",
    commonUses: ["One-way video interviews", "Live interviews", "Candidate evaluation"]
  },
  {
    id: "criteria",
    name: "Criteria Corp",
    category: "AI Hiring & Recruiting",
    description: "Pre-employment testing with AI scoring",
    commonUses: ["Aptitude testing", "Personality assessment", "Skills testing"]
  },

  // === Job Boards ===
  {
    id: "indeed",
    name: "Indeed",
    category: "Job Boards",
    description: "AI matching algorithms, resume screening, and candidate ranking",
    commonUses: ["Job matching", "Resume screening", "Candidate ranking"]
  },
  {
    id: "ziprecruiter",
    name: "ZipRecruiter",
    category: "Job Boards",
    description: "AI matching technology to connect employers with candidates",
    commonUses: ["Job distribution", "Candidate matching", "Application management"]
  },
  {
    id: "glassdoor",
    name: "Glassdoor",
    category: "Job Boards",
    description: "Job board with employer reviews and salary data",
    commonUses: ["Job posting", "Employer branding", "Salary benchmarking"]
  },
  {
    id: "handshake",
    name: "Handshake",
    category: "Job Boards",
    description: "Early talent recruiting platform for college students and recent grads",
    commonUses: ["Campus recruiting", "Internship postings", "Early talent pipeline"]
  },
  {
    id: "dice",
    name: "Dice",
    category: "Job Boards",
    description: "Tech-focused job board with AI-powered candidate matching",
    commonUses: ["Tech recruiting", "Candidate search", "Job distribution"]
  },

  // === HRIS / Payroll ===
  {
    id: "rippling",
    name: "Rippling",
    category: "HRIS / Payroll",
    description: "Unified HR, IT, and finance platform with automation features",
    commonUses: ["Payroll", "Benefits administration", "Onboarding automation"]
  },
  {
    id: "adp",
    name: "ADP",
    category: "HRIS / Payroll",
    description: "Enterprise payroll and HR management with analytics",
    commonUses: ["Payroll processing", "Tax compliance", "HR analytics"]
  },
  {
    id: "gusto",
    name: "Gusto",
    category: "HRIS / Payroll",
    description: "Payroll, benefits, and HR for small businesses",
    commonUses: ["Payroll", "Benefits", "Compliance"]
  },
  {
    id: "trinet",
    name: "TriNet",
    category: "HRIS / Payroll",
    description: "PEO providing HR solutions for small and midsize businesses",
    commonUses: ["PEO services", "Payroll", "Risk mitigation"]
  },
  {
    id: "paylocity",
    name: "Paylocity",
    category: "HRIS / Payroll",
    description: "Cloud-based payroll and HCM platform",
    commonUses: ["Payroll", "Talent management", "Workforce management"]
  },
  {
    id: "bamboohr",
    name: "BambooHR",
    category: "HRIS / Payroll",
    description: "HR software with applicant tracking and employee management",
    commonUses: ["Small business HR", "Applicant tracking", "Onboarding"]
  },
  {
    id: "paychex",
    name: "Paychex",
    category: "HRIS / Payroll",
    description: "Payroll, HR, and benefits outsourcing for businesses of all sizes",
    commonUses: ["Payroll", "Benefits administration", "HR services"]
  },

  // === Communication ===
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Business messaging platform with AI-powered search and summaries",
    commonUses: ["Team messaging", "Channel organization", "Workflow automation"]
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    category: "Communication",
    description: "Collaboration platform with AI Copilot features",
    commonUses: ["Video meetings", "Team chat", "Document collaboration"]
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Communication",
    description: "Video conferencing with AI meeting summaries and transcription",
    commonUses: ["Video interviews", "Team meetings", "Webinars"]
  },
  {
    id: "google-meet",
    name: "Google Meet",
    category: "Communication",
    description: "Video conferencing with AI noise cancellation and captions",
    commonUses: ["Video calls", "Interview scheduling", "Team meetings"]
  },

  // === Background Checks ===
  {
    id: "checkr",
    name: "Checkr",
    category: "Background Checks",
    description: "AI-powered background checks with adjudication assistance",
    commonUses: ["Background screening", "Compliance checks", "Risk assessment"]
  },
  {
    id: "hireright",
    name: "HireRight",
    category: "Background Checks",
    description: "Global background screening and workforce solutions",
    commonUses: ["Background checks", "Drug testing", "I-9 verification"]
  },
  {
    id: "sterling",
    name: "Sterling",
    category: "Background Checks",
    description: "Background and identity verification services",
    commonUses: ["Criminal checks", "Identity verification", "Credential verification"]
  },
  {
    id: "goodhire",
    name: "GoodHire",
    category: "Background Checks",
    description: "Employment background checks for businesses of all sizes",
    commonUses: ["Background screening", "FCRA compliance", "Candidate portal"]
  },

  // === General AI ===
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "General AI",
    description: "OpenAI's general-purpose AI assistant used across business functions",
    commonUses: ["Content generation", "Email drafting", "Research assistance"]
  },
  {
    id: "claude",
    name: "Claude",
    category: "General AI",
    description: "Anthropic's AI assistant for analysis, writing, and reasoning",
    commonUses: ["Document analysis", "Writing assistance", "Code review"]
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    category: "General AI",
    description: "AI assistant integrated across Microsoft 365 applications",
    commonUses: ["Document drafting", "Email summaries", "Data analysis"]
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "General AI",
    description: "Google's AI assistant integrated with Workspace",
    commonUses: ["Research", "Content creation", "Data analysis"]
  },

  // === Compensation ===
  {
    id: "pave",
    name: "Pave",
    category: "Compensation",
    description: "Real-time compensation benchmarking and planning platform",
    commonUses: ["Comp benchmarking", "Offer modeling", "Equity planning"]
  },
  {
    id: "salary-com",
    name: "Salary.com",
    category: "Compensation",
    description: "Compensation data, software, and consulting",
    commonUses: ["Salary surveys", "Pay equity analysis", "Job pricing"]
  },
  {
    id: "payscale",
    name: "PayScale",
    category: "Compensation",
    description: "Compensation management software with market data",
    commonUses: ["Market pricing", "Pay equity", "Compensation planning"]
  },

  // === Monitoring ===
  {
    id: "hubstaff",
    name: "Hubstaff",
    category: "Monitoring",
    description: "Employee time tracking and productivity monitoring",
    commonUses: ["Time tracking", "Screenshot monitoring", "Activity levels"]
  },
  {
    id: "time-doctor",
    name: "Time Doctor",
    category: "Monitoring",
    description: "Employee productivity tracking and time management",
    commonUses: ["Time tracking", "Distraction alerts", "Productivity reports"]
  },
  {
    id: "activtrak",
    name: "ActivTrak",
    category: "Monitoring",
    description: "Workforce analytics and productivity management platform",
    commonUses: ["Activity monitoring", "Productivity insights", "Compliance reporting"]
  },

  // === Other ===
  {
    id: "other",
    name: "Other Tool",
    category: "Other",
    description: "Other tool not listed",
    commonUses: []
  }
]

export const toolCategories = [
  "AI Hiring & Recruiting",
  "Job Boards",
  "HRIS / Payroll",
  "Communication",
  "Background Checks",
  "General AI",
  "Compensation",
  "Monitoring",
  "Other"
]

export const usageTypes = [
  { id: "screening", label: "Resume/Application Screening", description: "AI reviews resumes to filter or rank candidates" },
  { id: "ranking", label: "Candidate Ranking/Scoring", description: "AI ranks or scores candidates for consideration" },
  { id: "matching", label: "Job Matching", description: "AI matches candidates to open positions" },
  { id: "interview-analysis", label: "Interview Analysis", description: "AI analyzes video/audio interviews" },
  { id: "assessment-scoring", label: "Assessment Scoring", description: "AI scores skills or personality tests" },
  { id: "chatbot-screening", label: "Chatbot Screening", description: "AI chatbot asks screening questions" },
  { id: "scheduling", label: "Interview Scheduling", description: "AI handles interview scheduling" },
  { id: "job-description", label: "Job Description Writing", description: "AI helps write or optimize job posts" },
  { id: "background-check", label: "Background Check Review", description: "AI assists in reviewing background checks" },
  { id: "compensation", label: "Compensation Decisions", description: "AI informs salary or offer decisions" },
  { id: "promotion", label: "Promotion Decisions", description: "AI influences internal promotion decisions" },
  { id: "termination", label: "Termination Decisions", description: "AI factors into termination decisions" }
]
