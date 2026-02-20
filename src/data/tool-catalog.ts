// EmployArmor Tool Catalog — Seed Data
// 90+ HR/hiring tools with AI feature analysis and compliance mapping

export interface AiFeature {
  name: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  triggeredLaws: string[];
}

export interface ToolCatalogEntry {
  slug: string;
  name: string;
  vendor: string;
  category: string;
  description: string;
  websiteUrl: string;
  hasAiFeatures: boolean;
  aiFeatures: AiFeature[];
  complianceNotes: string;
  riskLevel: 'high' | 'medium' | 'low' | 'none';
}

// Shared law ID sets for convenience
const ALL_HIRING_LAWS = ['il-aivi', 'il-hrab', 'nyc-ll144', 'co-sb24205', 'ca-ccpa-admt', 'md-hb1202'];
const AEDT_LAWS = ['nyc-ll144', 'co-sb24205', 'ca-ccpa-admt', 'il-hrab'];
const VIDEO_AI_LAWS = ['il-aivi', 'nyc-ll144', 'co-sb24205', 'ca-ccpa-admt', 'md-hb1202'];
const SCREENING_LAWS = ['nyc-ll144', 'co-sb24205', 'ca-ccpa-admt', 'il-hrab'];

export const toolCatalog: ToolCatalogEntry[] = [
  // ═══════════════════════════════════════════
  // ATS (Applicant Tracking Systems)
  // ═══════════════════════════════════════════
  {
    slug: 'greenhouse',
    name: 'Greenhouse',
    vendor: 'Greenhouse Software',
    category: 'ats',
    description: 'Structured hiring platform with applicant tracking, interview scheduling, and hiring analytics.',
    websiteUrl: 'https://www.greenhouse.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI-Assisted Resume Screening', description: 'Uses AI to parse and rank resumes against job requirements.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Candidate Auto-Tags', description: 'Automatically categorizes candidates based on profile data.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Greenhouse has built-in bias audit support and publishes a responsible AI page. NYC LL144 audit may be needed if AI screening features are enabled.',
    riskLevel: 'medium',
  },
  {
    slug: 'lever',
    name: 'Lever',
    vendor: 'Lever (Employ Inc.)',
    category: 'ats',
    description: 'ATS and CRM combined platform for talent acquisition teams with collaborative hiring workflows.',
    websiteUrl: 'https://www.lever.co',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Candidate Recommendations', description: 'Recommends candidates from existing talent pool based on job requirements.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Resume Parsing', description: 'AI-powered extraction of structured data from resumes.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Candidate recommendations feature may constitute an AEDT under NYC LL144. Evaluate whether recommendations substantially assist hiring decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'workday-recruiting',
    name: 'Workday Recruiting',
    vendor: 'Workday',
    category: 'ats',
    description: 'Enterprise recruiting module within the Workday HCM suite with end-to-end hiring workflows.',
    websiteUrl: 'https://www.workday.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Candidate Scoring', description: 'ML-based scoring of candidates against job requirements and historical hiring patterns.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Skills Intelligence', description: 'AI-driven skills ontology that maps candidate skills to job needs.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'Job Recommendation Engine', description: 'Suggests relevant jobs to internal and external candidates.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Workday has faced a class action lawsuit (Mobley v. Workday) alleging AI screening discrimination. High scrutiny recommended. Ensure bias audits are current.',
    riskLevel: 'high',
  },
  {
    slug: 'bamboohr',
    name: 'BambooHR',
    vendor: 'BambooHR',
    category: 'ats',
    description: 'HR software for SMBs with applicant tracking, onboarding, and employee management.',
    websiteUrl: 'https://www.bamboohr.com',
    hasAiFeatures: false,
    aiFeatures: [],
    complianceNotes: 'Minimal AI in hiring workflow. Standard ATS without automated screening or scoring.',
    riskLevel: 'none',
  },
  {
    slug: 'jazzhr',
    name: 'JazzHR',
    vendor: 'JazzHR (Employ Inc.)',
    category: 'ats',
    description: 'Affordable ATS for SMBs with job posting, candidate management, and collaborative hiring.',
    websiteUrl: 'https://www.jazzhr.com',
    hasAiFeatures: false,
    aiFeatures: [],
    complianceNotes: 'Limited AI features. Primary risk is from integrated third-party assessments.',
    riskLevel: 'none',
  },
  {
    slug: 'icims',
    name: 'iCIMS',
    vendor: 'iCIMS',
    category: 'ats',
    description: 'Enterprise talent acquisition platform with recruiting, onboarding, and talent CRM capabilities.',
    websiteUrl: 'https://www.icims.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI-Powered Talent Matching', description: 'Matches candidates to open roles using AI analysis of skills, experience, and job requirements.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Digital Assistant (Chatbot)', description: 'AI chatbot for candidate engagement and screening questions.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'iCIMS talent matching constitutes an AEDT. Bias audit required for NYC operations. Verify audit coverage with vendor.',
    riskLevel: 'high',
  },
  {
    slug: 'smartrecruiters',
    name: 'SmartRecruiters',
    vendor: 'SmartRecruiters',
    category: 'ats',
    description: 'Enterprise hiring platform with AI-powered sourcing, candidate matching, and hiring workflows.',
    websiteUrl: 'https://www.smartrecruiters.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'SmartAssistant AI Matching', description: 'AI that scores and ranks candidates based on job fit.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Automated Screening', description: 'Knock-out questions and AI-driven filtering of applicants.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'SmartAssistant is a clear AEDT. SmartRecruiters provides bias audit documentation. Ensure annual audits are maintained.',
    riskLevel: 'high',
  },
  {
    slug: 'jobvite',
    name: 'Jobvite',
    vendor: 'Jobvite (Employ Inc.)',
    category: 'ats',
    description: 'End-to-end talent acquisition suite with recruiting, branding, and onboarding tools.',
    websiteUrl: 'https://www.jobvite.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Candidate Ranking', description: 'Ranks applicants by predicted fit using historical hiring data.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'AI ranking feature triggers AEDT requirements. Part of Employ Inc. portfolio alongside Lever and JazzHR.',
    riskLevel: 'medium',
  },
  {
    slug: 'taleo',
    name: 'Oracle Taleo',
    vendor: 'Oracle',
    category: 'ats',
    description: 'Legacy enterprise ATS with recruiting, onboarding, and performance management.',
    websiteUrl: 'https://www.oracle.com/human-capital-management/recruiting/',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Oracle AI Candidate Recommendations', description: 'AI-driven candidate recommendations and matching within Oracle HCM Cloud.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Oracle HCM Cloud AI features may constitute AEDTs. Legacy Taleo has fewer AI features but Oracle is migrating customers to cloud with more AI.',
    riskLevel: 'medium',
  },
  {
    slug: 'bullhorn',
    name: 'Bullhorn',
    vendor: 'Bullhorn',
    category: 'ats',
    description: 'ATS and CRM for staffing and recruiting agencies with automation and analytics.',
    websiteUrl: 'https://www.bullhorn.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Bullhorn AI Candidate Matching', description: 'AI matching of candidates to job orders based on skills and experience.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Copilot', description: 'AI assistant for recruiters to draft messages and summarize candidate profiles.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Staffing agencies using Bullhorn AI matching in NYC are deployers of an AEDT. Agency and client may share compliance obligations.',
    riskLevel: 'medium',
  },

  // ═══════════════════════════════════════════
  // SOURCING
  // ═══════════════════════════════════════════
  {
    slug: 'linkedin-recruiter',
    name: 'LinkedIn Recruiter',
    vendor: 'LinkedIn (Microsoft)',
    category: 'sourcing',
    description: 'Professional sourcing platform with candidate search, InMail, and talent pipeline management.',
    websiteUrl: 'https://business.linkedin.com/talent-solutions/recruiter',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI-Assisted Candidate Search', description: 'AI ranks and surfaces recommended candidates based on job criteria and recruiter behavior.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Recommended Matches', description: 'Machine learning recommends candidates for open roles.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'AI-Assisted Messages', description: 'AI drafts InMail messages to candidates.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'LinkedIn\'s AI-powered candidate recommendations may constitute an AEDT if they substantially assist hiring decisions. LinkedIn provides some bias mitigation documentation.',
    riskLevel: 'high',
  },
  {
    slug: 'seekout',
    name: 'SeekOut',
    vendor: 'SeekOut',
    category: 'sourcing',
    description: 'AI-powered talent intelligence platform for sourcing diverse candidates across multiple data sources.',
    websiteUrl: 'https://www.seekout.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Talent Search', description: 'Deep learning-based candidate discovery and ranking across public profiles and internal databases.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Diversity Insights', description: 'AI estimates demographic data for pipeline diversity analytics.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'AI-driven search and ranking is a clear AEDT use case. Diversity estimation features raise additional concerns about demographic profiling.',
    riskLevel: 'high',
  },
  {
    slug: 'hireez',
    name: 'hireEZ (Hiretual)',
    vendor: 'hireEZ',
    category: 'sourcing',
    description: 'AI sourcing platform that aggregates candidate data from 45+ platforms and uses AI for candidate matching.',
    websiteUrl: 'https://www.hireez.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Sourcing Engine', description: 'AI-powered candidate sourcing and ranking from aggregated public data.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Market Intelligence', description: 'AI-generated talent market analytics and salary benchmarks.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Core product is AI-driven candidate ranking. High AEDT risk. Data aggregation practices may raise additional CCPA/CPRA concerns.',
    riskLevel: 'high',
  },
  {
    slug: 'entelo',
    name: 'Entelo',
    vendor: 'Entelo',
    category: 'sourcing',
    description: 'AI recruiting platform that predicts candidate availability and ranks talent for outreach.',
    websiteUrl: 'https://www.entelo.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Predictive Attrition Models', description: 'AI predicts which candidates are likely to be open to new opportunities.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'AI Candidate Scoring', description: 'Scores candidates on fit for specific roles.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Predictive models and scoring are high-risk AEDT features. Attrition prediction may raise profiling concerns under CCPA ADMT regulations.',
    riskLevel: 'high',
  },
  {
    slug: 'gem',
    name: 'Gem',
    vendor: 'Gem',
    category: 'sourcing',
    description: 'Talent engagement platform with sourcing CRM, analytics, and pipeline management.',
    websiteUrl: 'https://www.gem.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Candidate Rediscovery', description: 'AI surfaces past candidates from ATS who match new open roles.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'AI-Generated Outreach', description: 'AI drafts personalized outreach messages.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Candidate rediscovery/matching features may trigger AEDT requirements if used to filter or rank candidates for hiring decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'fetcher',
    name: 'Fetcher',
    vendor: 'Fetcher',
    category: 'sourcing',
    description: 'Automated sourcing tool that uses AI to find and engage passive candidates.',
    websiteUrl: 'https://www.fetcher.ai',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Candidate Sourcing', description: 'Machine learning identifies and ranks candidates matching job criteria from public data.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Automated Email Sequences', description: 'AI-personalized outreach campaigns.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Core AI sourcing constitutes automated screening. Verify bias audit availability for NYC compliance.',
    riskLevel: 'high',
  },

  // ═══════════════════════════════════════════
  // ASSESSMENT
  // ═══════════════════════════════════════════
  {
    slug: 'hirevue',
    name: 'HireVue',
    vendor: 'HireVue',
    category: 'assessment',
    description: 'Video interviewing and AI assessment platform that evaluates candidates through structured interviews and game-based assessments.',
    websiteUrl: 'https://www.hirevue.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Video Assessment', description: 'Analyzes candidate video responses using NLP to evaluate competencies. (Facial analysis discontinued in 2021.)', riskLevel: 'high', triggeredLaws: VIDEO_AI_LAWS },
      { name: 'Game-Based Assessments', description: 'Cognitive and behavioral assessments using neuroscience-based games with AI scoring.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Structured Interview Scoring', description: 'AI assists in scoring structured interview responses.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'HireVue discontinued facial analysis in 2021 after FTC scrutiny but NLP-based video analysis remains. Publishes annual bias audits. High-profile target for regulation. Triggers Illinois AIVI Act, NYC LL144, and Maryland facial recognition law (if any facial features are used).',
    riskLevel: 'high',
  },
  {
    slug: 'pymetrics',
    name: 'Pymetrics (Harver)',
    vendor: 'Harver',
    category: 'assessment',
    description: 'Neuroscience-based gamified assessments that measure cognitive and emotional traits for hiring.',
    websiteUrl: 'https://www.pymetrics.ai',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Behavioral Assessment', description: 'ML models evaluate cognitive and emotional attributes from game performance to predict job fit.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Bias Auditing Built-In', description: 'Proprietary de-biasing algorithms applied to assessment models.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Acquired by Harver. Pymetrics has been a leader in algorithmic auditing and publishes audit methodologies. Still constitutes an AEDT requiring NYC LL144 compliance.',
    riskLevel: 'high',
  },
  {
    slug: 'criteria-corp',
    name: 'Criteria Corp',
    vendor: 'Criteria Corp',
    category: 'assessment',
    description: 'Pre-employment testing platform offering aptitude, personality, and skills assessments.',
    websiteUrl: 'https://www.criteriacorp.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI-Scored Assessments', description: 'ML-based scoring of cognitive aptitude and personality assessments.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Candidate Ranking', description: 'Automated ranking of candidates based on assessment scores.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Assessment scoring and ranking are AEDTs. Criteria Corp provides validity studies and adverse impact analyses.',
    riskLevel: 'high',
  },
  {
    slug: 'wonderlic',
    name: 'Wonderlic',
    vendor: 'Wonderlic',
    category: 'assessment',
    description: 'Pre-employment cognitive ability and personality assessment provider with decades of psychometric research.',
    websiteUrl: 'https://www.wonderlic.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Scoring Engine', description: 'Automated scoring of cognitive ability and motivation assessments.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'WonScore', description: 'Composite score predicting job performance from multiple assessment dimensions.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Automated scoring produces outputs used in hiring decisions. Wonderlic provides adverse impact studies. NYC bias audit compliance needed.',
    riskLevel: 'high',
  },
  {
    slug: 'shl',
    name: 'SHL',
    vendor: 'SHL',
    category: 'assessment',
    description: 'Global talent assessment and workforce analytics company providing psychometric tests and AI-driven talent insights.',
    websiteUrl: 'https://www.shl.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Talent Analytics', description: 'Machine learning models for predicting job performance and potential.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Smart Interview', description: 'AI-scored video interviews analyzing verbal content.', riskLevel: 'high', triggeredLaws: VIDEO_AI_LAWS },
    ],
    complianceNotes: 'Enterprise assessment provider with comprehensive validity documentation. Video interview AI triggers Illinois and Maryland laws.',
    riskLevel: 'high',
  },
  {
    slug: 'codility',
    name: 'Codility',
    vendor: 'Codility',
    category: 'assessment',
    description: 'Technical assessment platform for evaluating software developer skills through coding challenges.',
    websiteUrl: 'https://www.codility.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Automated Code Evaluation', description: 'AI evaluates code submissions for correctness, efficiency, and code quality.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'Plagiarism Detection', description: 'AI detects code plagiarism and similarity.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Automated code evaluation produces scores used in hiring. Lower risk than behavioral AI but still an AEDT if scores substantially inform decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'hackerrank',
    name: 'HackerRank',
    vendor: 'HackerRank',
    category: 'assessment',
    description: 'Developer skills assessment platform with coding challenges, interviews, and AI-powered evaluation.',
    websiteUrl: 'https://www.hackerrank.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Code Review', description: 'AI-assisted evaluation of code quality and problem-solving approach.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'Candidate Benchmarking', description: 'Automated benchmarking of candidates against role requirements.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Automated scoring of technical assessments constitutes an AEDT if used to filter candidates.',
    riskLevel: 'medium',
  },
  {
    slug: 'testgorilla',
    name: 'TestGorilla',
    vendor: 'TestGorilla',
    category: 'assessment',
    description: 'Pre-employment screening platform with a library of skills tests, personality assessments, and cognitive ability tests.',
    websiteUrl: 'https://www.testgorilla.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Automated Test Scoring', description: 'AI-based scoring and ranking of multi-test assessments.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Candidate Comparison', description: 'Automated comparison and ranking of candidates across test dimensions.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Composite scoring and automated ranking are AEDTs. TestGorilla provides some adverse impact documentation.',
    riskLevel: 'high',
  },

  // ═══════════════════════════════════════════
  // BACKGROUND CHECK
  // ═══════════════════════════════════════════
  {
    slug: 'checkr',
    name: 'Checkr',
    vendor: 'Checkr',
    category: 'background-check',
    description: 'AI-powered background check platform with criminal records, employment verification, and compliance tools.',
    websiteUrl: 'https://www.checkr.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Record Matching', description: 'Machine learning matches criminal records to candidates, reducing false positives.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'Automated Adjudication', description: 'AI applies employer-defined rules to automatically adjudicate background check results.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Automated adjudication can constitute an AEDT if it substantially informs hiring decisions. Also subject to FCRA requirements. Checkr provides fair chance hiring features.',
    riskLevel: 'medium',
  },
  {
    slug: 'hireright',
    name: 'HireRight',
    vendor: 'HireRight',
    category: 'background-check',
    description: 'Global employment background screening provider with criminal, education, and employment verification.',
    websiteUrl: 'https://www.hireright.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI-Enhanced Screening', description: 'AI assists in record matching and data extraction for faster turnaround.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Primarily operational AI (data extraction). FCRA compliance is the primary concern. Lower AEDT risk unless automated pass/fail decisions are implemented.',
    riskLevel: 'low',
  },
  {
    slug: 'sterling',
    name: 'Sterling',
    vendor: 'Sterling Check',
    category: 'background-check',
    description: 'Background and identity verification services for enterprise hiring with global coverage.',
    websiteUrl: 'https://www.sterlingcheck.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Data Extraction', description: 'AI-powered extraction and matching of records for verification.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Primarily operational AI. FCRA is primary compliance framework. Low AEDT risk.',
    riskLevel: 'low',
  },
  {
    slug: 'goodhire',
    name: 'GoodHire',
    vendor: 'GoodHire (Checkr)',
    category: 'background-check',
    description: 'SMB-focused background check platform with FCRA-compliant reports and built-in adjudication workflows.',
    websiteUrl: 'https://www.goodhire.com',
    hasAiFeatures: false,
    aiFeatures: [],
    complianceNotes: 'Manual adjudication workflows. Primary compliance concern is FCRA, not AEDT.',
    riskLevel: 'none',
  },
  {
    slug: 'certn',
    name: 'Certn',
    vendor: 'Certn',
    category: 'background-check',
    description: 'AI-powered background screening platform with risk-based scoring and global checks.',
    websiteUrl: 'https://www.certn.co',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Risk Scoring', description: 'AI-generated risk scores based on background check results.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Social Media Screening', description: 'AI analysis of public social media for risk indicators.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'AI risk scoring and social media screening are high-risk AEDT features. Social media screening raises significant bias and privacy concerns.',
    riskLevel: 'high',
  },

  // ═══════════════════════════════════════════
  // JOB BOARDS
  // ═══════════════════════════════════════════
  {
    slug: 'indeed',
    name: 'Indeed',
    vendor: 'Indeed (Recruit Holdings)',
    category: 'job-board',
    description: 'World\'s largest job board with job posting, resume search, and employer branding tools.',
    websiteUrl: 'https://www.indeed.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Job Matching', description: 'Algorithmic matching of candidates to jobs based on resume and search behavior.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'Smart Sourcing', description: 'AI-powered candidate search and recommendations from Indeed\'s resume database.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'AI Screening Questions', description: 'Automated knock-out screening based on employer-defined criteria.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Indeed\'s Smart Sourcing and AI matching may constitute AEDTs. Employers using Indeed\'s AI features bear compliance responsibility as deployers.',
    riskLevel: 'medium',
  },
  {
    slug: 'ziprecruiter',
    name: 'ZipRecruiter',
    vendor: 'ZipRecruiter',
    category: 'job-board',
    description: 'AI-driven job marketplace that matches employers with candidates through intelligent recommendations.',
    websiteUrl: 'https://www.ziprecruiter.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Matching Technology', description: 'Core AI engine matches candidates to jobs and vice versa based on skills, experience, and behavior.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Invite to Apply', description: 'AI identifies and invites strong-fit candidates to apply for jobs.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'ZipRecruiter\'s entire model is AI-driven matching. High AEDT risk. Employer deployers should assess whether ZipRecruiter\'s AI substantially assists hiring decisions.',
    riskLevel: 'high',
  },
  {
    slug: 'glassdoor',
    name: 'Glassdoor',
    vendor: 'Glassdoor (Recruit Holdings)',
    category: 'job-board',
    description: 'Job board and employer review platform with salary data, company reviews, and job listings.',
    websiteUrl: 'https://www.glassdoor.com',
    hasAiFeatures: false,
    aiFeatures: [],
    complianceNotes: 'Primarily a job posting and employer branding platform. No AI-driven candidate screening. Low compliance risk.',
    riskLevel: 'none',
  },
  {
    slug: 'handshake',
    name: 'Handshake',
    vendor: 'Handshake',
    category: 'job-board',
    description: 'Early career and campus recruiting platform connecting students with employers.',
    websiteUrl: 'https://www.joinhandshake.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Job Recommendations', description: 'Recommends jobs to students based on profile, major, and preferences.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'AI recommendations are candidate-facing (helping students find jobs) rather than employer-facing screening. Lower AEDT risk.',
    riskLevel: 'low',
  },
  {
    slug: 'dice',
    name: 'Dice',
    vendor: 'DHI Group',
    category: 'job-board',
    description: 'Technology-focused job board for tech professionals with AI-powered candidate matching.',
    websiteUrl: 'https://www.dice.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'IntelliSearch', description: 'AI-powered candidate search that interprets natural language queries and ranks results.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'AI search and ranking may constitute AEDT use if results substantially assist hiring decisions.',
    riskLevel: 'medium',
  },

  // ═══════════════════════════════════════════
  // HRIS
  // ═══════════════════════════════════════════
  {
    slug: 'rippling',
    name: 'Rippling',
    vendor: 'Rippling',
    category: 'hris',
    description: 'Unified workforce management platform combining HR, IT, and finance with automation.',
    websiteUrl: 'https://www.rippling.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Workflow Automation', description: 'Rule-based and AI-assisted automation of HR processes including onboarding and compliance.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Primarily operational automation. Low AEDT risk unless used for hiring decisions. Recruiting module warrants separate evaluation.',
    riskLevel: 'low',
  },
  {
    slug: 'adp',
    name: 'ADP Workforce Now',
    vendor: 'ADP',
    category: 'hris',
    description: 'Enterprise HCM platform with payroll, benefits, talent management, and workforce analytics.',
    websiteUrl: 'https://www.adp.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'ADP DataCloud', description: 'AI-powered workforce analytics and benchmarking using aggregated employer data.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'Intelligent Self-Service', description: 'AI chatbot for employee HR queries.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'DataCloud analytics could inform employment decisions. Evaluate whether AI outputs substantially factor into consequential decisions under CO SB 24-205.',
    riskLevel: 'low',
  },
  {
    slug: 'gusto',
    name: 'Gusto',
    vendor: 'Gusto',
    category: 'hris',
    description: 'SMB payroll, benefits, and HR platform with simple hiring and onboarding workflows.',
    websiteUrl: 'https://www.gusto.com',
    hasAiFeatures: false,
    aiFeatures: [],
    complianceNotes: 'Minimal AI in hiring. Primarily payroll and benefits administration.',
    riskLevel: 'none',
  },
  {
    slug: 'trinet',
    name: 'TriNet',
    vendor: 'TriNet',
    category: 'hris',
    description: 'PEO and HR platform for SMBs with payroll, benefits, risk management, and compliance services.',
    websiteUrl: 'https://www.trinet.com',
    hasAiFeatures: false,
    aiFeatures: [],
    complianceNotes: 'Limited AI features in hiring context. Focus is HR administration and PEO services.',
    riskLevel: 'none',
  },
  {
    slug: 'paylocity',
    name: 'Paylocity',
    vendor: 'Paylocity',
    category: 'hris',
    description: 'Cloud HCM platform with payroll, HR, talent, and workforce management for mid-market companies.',
    websiteUrl: 'https://www.paylocity.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Assistant', description: 'AI-powered HR assistant for employee and manager queries.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Limited AI in hiring decisions. Primary use is operational HR automation.',
    riskLevel: 'none',
  },
  {
    slug: 'paychex',
    name: 'Paychex Flex',
    vendor: 'Paychex',
    category: 'hris',
    description: 'Payroll and HR platform for businesses of all sizes with hiring, onboarding, and compliance tools.',
    websiteUrl: 'https://www.paychex.com',
    hasAiFeatures: false,
    aiFeatures: [],
    complianceNotes: 'Standard HR and payroll platform. No AI-driven hiring features.',
    riskLevel: 'none',
  },
  {
    slug: 'ukg',
    name: 'UKG (Ultimate Kronos Group)',
    vendor: 'UKG',
    category: 'hris',
    description: 'Enterprise HCM suite combining workforce management, HR, payroll, and talent management.',
    websiteUrl: 'https://www.ukg.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'UKG Bryte AI', description: 'AI assistant providing workforce insights, predictions, and recommendations to HR leaders.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
      { name: 'Predictive Analytics', description: 'AI-driven attrition prediction and workforce planning.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'UKG Bryte and predictive analytics may inform employment decisions. Evaluate whether outputs are used in consequential decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'ceridian-dayforce',
    name: 'Dayforce (Ceridian)',
    vendor: 'Dayforce',
    category: 'hris',
    description: 'Cloud HCM platform with payroll, workforce management, talent, and benefits administration.',
    websiteUrl: 'https://www.dayforce.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Dayforce AI', description: 'AI-powered insights for workforce optimization, scheduling, and talent decisions.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'AI features focused on workforce management. Evaluate talent-related AI features for AEDT compliance.',
    riskLevel: 'low',
  },

  // ═══════════════════════════════════════════
  // COMMUNICATION
  // ═══════════════════════════════════════════
  {
    slug: 'slack',
    name: 'Slack',
    vendor: 'Salesforce',
    category: 'communication',
    description: 'Business messaging platform with channels, integrations, and workflow automation.',
    websiteUrl: 'https://www.slack.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Slack AI', description: 'AI-powered search, channel summaries, and thread summaries.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Not used for hiring decisions directly. Risk arises only if AI summaries are used to evaluate candidates or employees.',
    riskLevel: 'none',
  },
  {
    slug: 'microsoft-teams',
    name: 'Microsoft Teams',
    vendor: 'Microsoft',
    category: 'communication',
    description: 'Collaboration platform with chat, video meetings, file sharing, and business integrations.',
    websiteUrl: 'https://www.microsoft.com/en-us/microsoft-teams',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Copilot in Teams', description: 'AI meeting summaries, action items, and intelligent recap.', riskLevel: 'low', triggeredLaws: [] },
      { name: 'Meeting Transcription', description: 'AI-powered real-time transcription of meetings.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Risk only if AI meeting analysis is used to evaluate interview candidates. Transcription of interviews may trigger Illinois AIVI Act if AI analysis is applied.',
    riskLevel: 'none',
  },
  {
    slug: 'zoom',
    name: 'Zoom',
    vendor: 'Zoom Video Communications',
    category: 'communication',
    description: 'Video conferencing platform with meetings, webinars, and collaboration tools.',
    websiteUrl: 'https://www.zoom.us',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Zoom AI Companion', description: 'AI meeting summaries, smart recording highlights, and chat compose.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Low risk unless AI Companion features are used to analyze or evaluate candidate interview performance. Recording and AI analysis of interviews could trigger IL AIVI Act.',
    riskLevel: 'none',
  },
  {
    slug: 'google-meet',
    name: 'Google Meet',
    vendor: 'Google',
    category: 'communication',
    description: 'Video conferencing platform integrated with Google Workspace.',
    websiteUrl: 'https://meet.google.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Note-Taking', description: 'Automated meeting notes and action items via Gemini.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Minimal hiring-specific AI risk. Same considerations as other video platforms if used for recorded interviews with AI analysis.',
    riskLevel: 'none',
  },

  // ═══════════════════════════════════════════
  // GENERAL AI
  // ═══════════════════════════════════════════
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    vendor: 'OpenAI',
    category: 'general-ai',
    description: 'General-purpose AI chatbot used across business functions including HR for drafting, analysis, and decision support.',
    websiteUrl: 'https://chat.openai.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Resume Screening/Ranking', description: 'When used to evaluate, score, or rank candidate resumes or applications.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Interview Question Generation', description: 'AI-generated interview questions and evaluation criteria.', riskLevel: 'low', triggeredLaws: [] },
      { name: 'Candidate Evaluation Assistance', description: 'When used to summarize or compare candidates for hiring decisions.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Job Description Drafting', description: 'AI-assisted writing of job descriptions.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Risk depends entirely on use case. Using ChatGPT to screen, rank, or evaluate candidates likely constitutes AEDT use. Difficult to audit. No built-in bias audit capability. Employers should document usage and implement controls.',
    riskLevel: 'high',
  },
  {
    slug: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    category: 'general-ai',
    description: 'AI assistant focused on safety and helpfulness, used for analysis, writing, and decision support.',
    websiteUrl: 'https://claude.ai',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Resume Screening/Ranking', description: 'When used to evaluate or rank candidate applications.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Candidate Evaluation Assistance', description: 'When used to analyze or compare candidates for hiring decisions.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Content Generation', description: 'Drafting job descriptions, offer letters, rejection emails.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Same risk profile as other general-purpose AI when used in hiring. Risk is use-case dependent. No built-in employment bias audit.',
    riskLevel: 'high',
  },
  {
    slug: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    vendor: 'Microsoft',
    category: 'general-ai',
    description: 'AI assistant integrated across Microsoft 365 for productivity, analysis, and content creation.',
    websiteUrl: 'https://copilot.microsoft.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Document Analysis', description: 'When used to analyze resumes, applications, or candidate data in Office documents.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Email Drafting', description: 'AI-assisted drafting of candidate communications.', riskLevel: 'low', triggeredLaws: [] },
      { name: 'Excel/Data Analysis', description: 'When used to score or rank candidate data in spreadsheets.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Embedded in daily workflow tools, making it easy for hiring managers to inadvertently create AEDTs. Requires clear usage policies.',
    riskLevel: 'high',
  },
  {
    slug: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    category: 'general-ai',
    description: 'Google\'s AI assistant for search, analysis, content creation, and productivity.',
    websiteUrl: 'https://gemini.google.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Resume Screening/Ranking', description: 'When used to evaluate candidate materials.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Candidate Evaluation', description: 'When used to compare or assess candidates.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Same considerations as other general-purpose AI. Integration with Google Workspace increases likelihood of use in hiring contexts.',
    riskLevel: 'high',
  },
  {
    slug: 'jasper',
    name: 'Jasper',
    vendor: 'Jasper AI',
    category: 'general-ai',
    description: 'AI content creation platform for marketing and business communications.',
    websiteUrl: 'https://www.jasper.ai',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Job Description Generation', description: 'AI-generated job postings and recruitment marketing content.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Primarily content generation. Low risk unless used to evaluate candidates. Job description bias (gendered language) is a secondary concern.',
    riskLevel: 'low',
  },

  // ═══════════════════════════════════════════
  // COMPENSATION
  // ═══════════════════════════════════════════
  {
    slug: 'pave',
    name: 'Pave',
    vendor: 'Pave',
    category: 'compensation',
    description: 'Real-time compensation benchmarking and planning platform using aggregated employer data.',
    websiteUrl: 'https://www.pave.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Compensation Benchmarking', description: 'AI-driven salary recommendations based on market data, role, level, and location.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'AI compensation recommendations may constitute consequential decisions under Colorado AI Act if they substantially determine pay. CCPA ADMT regulations may apply to automated pay decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'carta-total-comp',
    name: 'Carta Total Comp',
    vendor: 'Carta',
    category: 'compensation',
    description: 'Equity and total compensation management platform with benchmarking data.',
    websiteUrl: 'https://carta.com/total-comp/',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Compensation Benchmarking', description: 'Data-driven compensation recommendations based on peer company data.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'Automated compensation recommendations may trigger Colorado and California ADMT requirements if they substantially determine compensation decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'salary-com',
    name: 'Salary.com',
    vendor: 'Salary.com',
    category: 'compensation',
    description: 'Compensation data, software, and consulting for pay equity analysis and salary benchmarking.',
    websiteUrl: 'https://www.salary.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'CompAnalyst AI', description: 'AI-powered job matching and salary recommendations.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'AI job matching for compensation purposes may inform consequential employment decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'payscale',
    name: 'PayScale (Payfactors)',
    vendor: 'PayScale',
    category: 'compensation',
    description: 'Compensation management platform with salary data, pay equity analysis, and benchmarking tools.',
    websiteUrl: 'https://www.payscale.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Job Matching', description: 'AI matches internal jobs to market survey data for benchmarking.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
      { name: 'Pay Equity Analytics', description: 'Statistical analysis of pay disparities with AI-powered insights.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'Pay equity analytics and AI benchmarking may inform compensation decisions. Lower risk when used as advisory rather than automated decision-making.',
    riskLevel: 'medium',
  },

  // ═══════════════════════════════════════════
  // MONITORING
  // ═══════════════════════════════════════════
  {
    slug: 'hubstaff',
    name: 'Hubstaff',
    vendor: 'Hubstaff',
    category: 'monitoring',
    description: 'Employee time tracking and monitoring with screenshots, activity levels, and GPS tracking.',
    websiteUrl: 'https://www.hubstaff.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Activity Scoring', description: 'Automated activity level scoring based on mouse/keyboard activity and screenshots.', riskLevel: 'high', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt', 'il-hrab'] },
      { name: 'Productivity Analytics', description: 'AI-derived productivity metrics and reports.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'Employee monitoring with AI-derived productivity scores may constitute consequential decisions about employment under CO and CA laws. IL Human Rights Act amendment covers AI in discipline/tenure decisions.',
    riskLevel: 'high',
  },
  {
    slug: 'time-doctor',
    name: 'Time Doctor',
    vendor: 'Time Doctor',
    category: 'monitoring',
    description: 'Employee productivity tracking with screenshots, website monitoring, and distraction alerts.',
    websiteUrl: 'https://www.timedoctor.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Distraction Detection', description: 'AI monitors application and website usage to flag unproductive behavior.', riskLevel: 'high', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt', 'il-hrab'] },
      { name: 'Productivity Scoring', description: 'Automated scoring of employee productivity based on monitored activity.', riskLevel: 'high', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt', 'il-hrab'] },
    ],
    complianceNotes: 'AI-based distraction detection and productivity scoring may substantially inform employment decisions (discipline, termination). High risk under multiple laws.',
    riskLevel: 'high',
  },
  {
    slug: 'activtrak',
    name: 'ActivTrak',
    vendor: 'ActivTrak',
    category: 'monitoring',
    description: 'Workforce analytics and productivity management platform with behavioral insights.',
    websiteUrl: 'https://www.activtrak.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Productivity Insights', description: 'AI-generated workforce productivity analytics, burnout risk detection, and efficiency recommendations.', riskLevel: 'high', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt', 'il-hrab'] },
      { name: 'Workload Balance', description: 'AI detects overwork and underutilization patterns.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'Productivity analytics and burnout prediction may inform consequential employment decisions. ActivTrak markets itself as privacy-conscious but AI outputs may still trigger compliance obligations.',
    riskLevel: 'high',
  },
  {
    slug: 'teramind',
    name: 'Teramind',
    vendor: 'Teramind',
    category: 'monitoring',
    description: 'Advanced employee monitoring and insider threat detection with behavior analytics and DLP.',
    websiteUrl: 'https://www.teramind.co',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Behavioral Analytics', description: 'AI-powered analysis of employee behavior patterns for risk scoring and anomaly detection.', riskLevel: 'high', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt', 'il-hrab'] },
      { name: 'Risk Scoring', description: 'Automated employee risk scores based on monitored behavior.', riskLevel: 'high', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt', 'il-hrab'] },
      { name: 'Insider Threat Detection', description: 'AI identifies potential insider threats from behavioral patterns.', riskLevel: 'high', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt', 'il-hrab'] },
    ],
    complianceNotes: 'Highest risk monitoring tool. AI risk scoring and behavioral analytics directly inform employment decisions. Full compliance assessment recommended.',
    riskLevel: 'high',
  },

  // ═══════════════════════════════════════════
  // VIDEO INTERVIEW (dedicated)
  // ═══════════════════════════════════════════
  {
    slug: 'spark-hire',
    name: 'Spark Hire',
    vendor: 'Spark Hire',
    category: 'video-interview',
    description: 'Video interviewing platform with one-way and live interview capabilities.',
    websiteUrl: 'https://www.sparkhire.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Interview Insights', description: 'AI-generated summaries and evaluations of candidate video responses.', riskLevel: 'high', triggeredLaws: VIDEO_AI_LAWS },
    ],
    complianceNotes: 'AI analysis of video interviews triggers Illinois AIVI Act, NYC LL144, and potentially Maryland HB 1202 if facial features are analyzed.',
    riskLevel: 'high',
  },
  {
    slug: 'vidcruiter',
    name: 'VidCruiter',
    vendor: 'VidCruiter',
    category: 'video-interview',
    description: 'Video interviewing and recruitment platform with structured interview tools and automated scheduling.',
    websiteUrl: 'https://www.vidcruiter.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI-Assisted Scoring', description: 'AI provides scoring suggestions for structured video interviews.', riskLevel: 'high', triggeredLaws: VIDEO_AI_LAWS },
    ],
    complianceNotes: 'AI scoring of video interviews constitutes AEDT use and triggers video-specific AI laws.',
    riskLevel: 'high',
  },
  {
    slug: 'myinterview',
    name: 'myInterview',
    vendor: 'myInterview (HireVue)',
    category: 'video-interview',
    description: 'AI-powered video interview platform with personality and competency insights.',
    websiteUrl: 'https://www.myinterview.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Personality Insights', description: 'AI analyzes video responses to infer personality traits and competencies.', riskLevel: 'high', triggeredLaws: VIDEO_AI_LAWS },
      { name: 'Smart Shortlisting', description: 'AI ranks candidates based on video interview analysis.', riskLevel: 'high', triggeredLaws: VIDEO_AI_LAWS },
    ],
    complianceNotes: 'Personality inference from video is among the highest-risk AI applications in hiring. Triggers all video AI laws. Acquired by HireVue.',
    riskLevel: 'high',
  },

  // ═══════════════════════════════════════════
  // DATA VENDOR / OTHER
  // ═══════════════════════════════════════════
  {
    slug: 'eightfold-ai',
    name: 'Eightfold AI',
    vendor: 'Eightfold AI',
    category: 'sourcing',
    description: 'AI-native talent intelligence platform for hiring, retention, and workforce planning using deep learning.',
    websiteUrl: 'https://www.eightfold.ai',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Deep Learning Talent Matching', description: 'Proprietary deep learning model that matches candidates to roles across entire career trajectory.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Candidate Calibration', description: 'AI calibrates candidate fit scores based on skills, experience, and career patterns.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Talent Rediscovery', description: 'AI resurfaces past applicants for new roles.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'Eightfold\'s entire platform is AI-native. Every feature constitutes an AEDT. Comprehensive bias audit required. They publish transparency reports.',
    riskLevel: 'high',
  },
  {
    slug: 'paradox-olivia',
    name: 'Paradox (Olivia)',
    vendor: 'Paradox',
    category: 'ats',
    description: 'Conversational AI recruiting assistant that automates screening, scheduling, and candidate communication.',
    websiteUrl: 'https://www.paradox.ai',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Screening Chatbot', description: 'Conversational AI screens candidates through automated chat, collecting and evaluating responses against job requirements.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Automated Scheduling', description: 'AI schedules interviews based on availability.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'AI screening chatbot constitutes an AEDT when it filters or ranks candidates. High usage in hourly/high-volume hiring. NYC LL144 bias audit required.',
    riskLevel: 'high',
  },
  {
    slug: 'phenom',
    name: 'Phenom',
    vendor: 'Phenom People',
    category: 'ats',
    description: 'Intelligent talent experience platform with AI-powered career site, CRM, and talent marketplace.',
    websiteUrl: 'https://www.phenom.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Job Matching', description: 'AI matches candidates to roles on career sites and internal talent marketplaces.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'AI Chatbot', description: 'Conversational AI for candidate engagement and screening.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'Talent Analytics', description: 'AI-driven insights on talent pipeline and hiring effectiveness.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Multiple AI features constitute AEDTs. Phenom provides compliance documentation. Comprehensive audit needed.',
    riskLevel: 'high',
  },
  {
    slug: 'beamery',
    name: 'Beamery',
    vendor: 'Beamery',
    category: 'sourcing',
    description: 'Talent lifecycle management platform with AI-powered sourcing, nurturing, and internal mobility.',
    websiteUrl: 'https://www.beamery.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'TalentGPT', description: 'Generative AI for talent acquisition including candidate matching, job description generation, and outreach.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
      { name: 'AI Skills Intelligence', description: 'AI-driven skills taxonomy and gap analysis.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'TalentGPT and AI matching features constitute AEDTs. Beamery publishes responsible AI principles. Audit required.',
    riskLevel: 'high',
  },
  {
    slug: 'cornerstone',
    name: 'Cornerstone OnDemand',
    vendor: 'Cornerstone',
    category: 'hris',
    description: 'Talent management platform with learning, performance, recruiting, and workforce planning.',
    websiteUrl: 'https://www.cornerstoneondemand.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Skills Graph', description: 'AI maps employee skills and recommends learning paths and career moves.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
      { name: 'AI Content Recommendations', description: 'AI recommends learning content based on skills gaps and career goals.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Skills graph may inform promotion and assignment decisions. Evaluate if AI outputs substantially factor into consequential decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'applied',
    name: 'Applied',
    vendor: 'Applied',
    category: 'ats',
    description: 'Bias-reducing hiring platform using anonymized applications and structured assessments.',
    websiteUrl: 'https://www.beapplied.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Anonymized Screening', description: 'AI-assisted anonymization of candidate applications to reduce bias.', riskLevel: 'low', triggeredLaws: [] },
      { name: 'Predictive Scoring', description: 'AI scoring of work sample assessments.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Designed with bias reduction as a core feature. Lower risk than most ATS but still constitutes AEDT use. Good compliance posture.',
    riskLevel: 'medium',
  },
  {
    slug: 'hireology',
    name: 'Hireology',
    vendor: 'Hireology',
    category: 'ats',
    description: 'Hiring and talent management platform for decentralized employers (multi-location, franchise).',
    websiteUrl: 'https://www.hireology.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Candidate Matching', description: 'AI matches and ranks candidates for multi-location hiring.', riskLevel: 'high', triggeredLaws: AEDT_LAWS },
    ],
    complianceNotes: 'AI matching for high-volume/multi-location hiring constitutes AEDT. Franchise employers should clarify compliance responsibility.',
    riskLevel: 'medium',
  },
  {
    slug: 'grayscale',
    name: 'Grayscale',
    vendor: 'Grayscale Labs',
    category: 'communication',
    description: 'Candidate communication and engagement platform with texting, scheduling, and automation.',
    websiteUrl: 'https://www.grayscaleapp.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Text Automation', description: 'AI-powered automated candidate text messaging and responses.', riskLevel: 'low', triggeredLaws: [] },
    ],
    complianceNotes: 'Communication automation only. Low AEDT risk unless AI makes screening decisions.',
    riskLevel: 'none',
  },
  {
    slug: 'textio',
    name: 'Textio',
    vendor: 'Textio',
    category: 'general-ai',
    description: 'Augmented writing platform that uses AI to optimize job descriptions and performance feedback for inclusivity.',
    websiteUrl: 'https://www.textio.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Language Analysis', description: 'AI analyzes and scores written content for bias, inclusivity, and effectiveness.', riskLevel: 'low', triggeredLaws: [] },
      { name: 'Performance Feedback AI', description: 'AI coaches managers on writing equitable and actionable performance reviews.', riskLevel: 'medium', triggeredLaws: ['co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'Job description optimization is low risk. Performance feedback AI may influence employment decisions if managers rely on AI-suggested language that affects evaluations.',
    riskLevel: 'low',
  },
  {
    slug: 'interviewing-io',
    name: 'interviewing.io',
    vendor: 'interviewing.io',
    category: 'assessment',
    description: 'Anonymous technical interview practice and hiring platform connecting candidates with companies.',
    websiteUrl: 'https://www.interviewing.io',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Interview Analytics', description: 'AI analysis of interview performance patterns.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Anonymization features reduce bias risk. Analytics may inform hiring if used by employers to evaluate candidates.',
    riskLevel: 'medium',
  },
  {
    slug: 'karat',
    name: 'Karat',
    vendor: 'Karat',
    category: 'assessment',
    description: 'Technical interviewing service with trained interviewers and structured evaluation rubrics.',
    websiteUrl: 'https://www.karat.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'Interview Intelligence', description: 'AI analytics on interview quality, consistency, and candidate performance patterns.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'Human-led interviews with AI analytics. Lower risk than fully automated assessment but AI insights may inform decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'brighthire',
    name: 'BrightHire',
    vendor: 'BrightHire',
    category: 'video-interview',
    description: 'Interview intelligence platform that records, transcribes, and provides AI insights on interviews.',
    websiteUrl: 'https://www.brighthire.com',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Interview Notes', description: 'Automated transcription and AI-generated highlights from interviews.', riskLevel: 'medium', triggeredLaws: ['il-aivi', 'nyc-ll144', 'co-sb24205', 'ca-ccpa-admt'] },
      { name: 'Interview Analytics', description: 'AI-powered analysis of interviewer quality and candidate evaluation consistency.', riskLevel: 'medium', triggeredLaws: SCREENING_LAWS },
    ],
    complianceNotes: 'AI interview analysis may trigger Illinois AIVI Act if applied to recorded video interviews. NYC LL144 if AI substantially assists hiring decisions.',
    riskLevel: 'medium',
  },
  {
    slug: 'metaview',
    name: 'Metaview',
    vendor: 'Metaview',
    category: 'video-interview',
    description: 'AI note-taker for interviews that generates structured notes and insights from interview conversations.',
    websiteUrl: 'https://www.metaview.ai',
    hasAiFeatures: true,
    aiFeatures: [
      { name: 'AI Interview Notes', description: 'Automated generation of structured interview notes from recorded conversations.', riskLevel: 'medium', triggeredLaws: ['il-aivi', 'co-sb24205', 'ca-ccpa-admt'] },
    ],
    complianceNotes: 'AI-generated interview notes may trigger Illinois AIVI Act. Risk depends on whether AI output substantially informs hiring decisions.',
    riskLevel: 'medium',
  },
];

// Utility functions
export function getToolBySlug(slug: string): ToolCatalogEntry | undefined {
  return toolCatalog.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolCatalogEntry[] {
  return toolCatalog.filter((tool) => tool.category === category);
}

export function getToolsByRiskLevel(riskLevel: 'high' | 'medium' | 'low' | 'none'): ToolCatalogEntry[] {
  return toolCatalog.filter((tool) => tool.riskLevel === riskLevel);
}

export function getToolsTriggeredByLaw(lawId: string): ToolCatalogEntry[] {
  return toolCatalog.filter((tool) =>
    tool.aiFeatures.some((f) => f.triggeredLaws.includes(lawId))
  );
}

// Summary stats
export const catalogStats = {
  totalTools: toolCatalog.length,
  byCategory: Object.fromEntries(
    [...new Set(toolCatalog.map((t) => t.category))].map((cat) => [
      cat,
      toolCatalog.filter((t) => t.category === cat).length,
    ])
  ),
  byRiskLevel: {
    high: toolCatalog.filter((t) => t.riskLevel === 'high').length,
    medium: toolCatalog.filter((t) => t.riskLevel === 'medium').length,
    low: toolCatalog.filter((t) => t.riskLevel === 'low').length,
    none: toolCatalog.filter((t) => t.riskLevel === 'none').length,
  },
  withAiFeatures: toolCatalog.filter((t) => t.hasAiFeatures).length,
};

// Risk level type
export type RiskLevel = 'high' | 'medium' | 'low' | 'none' | 'critical';

// Get related tools (same category, excluding current)
export function getRelatedTools(slug: string, limit = 3): ToolCatalogEntry[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return toolCatalog
    .filter((t) => t.category === tool.category && t.slug !== slug)
    .slice(0, limit);
}

// Derived exports used by tool request page
export const categories = [...new Set(toolCatalog.map((t) => t.category))];

export const teamRoles = [
  "Recruiter",
  "Hiring Manager",
  "HR Director",
  "Talent Acquisition",
  "Compliance Officer",
  "People Operations",
  "HRBP",
  "Executive",
];
