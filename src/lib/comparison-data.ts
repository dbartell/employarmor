import { AI_TOOLS, type AITool } from './seo-data'

// Tool details for comparison pages
export const TOOL_DETAILS: Record<string, {
  description: string
  aiFeatures: string[]
  complianceConsiderations: string[]
  biasRiskLevel: 'Low' | 'Medium' | 'High'
  dataCollected: string[]
  laws: string[]
}> = {
  'hirevue': {
    description: 'AI-powered skill validation platform using video interviews, game-based assessments, and virtual job tryouts. Uses machine learning to analyze communication patterns, behavioral analytics, and role-specific competencies.',
    aiFeatures: [
      'Interview Insights with AI analysis',
      'Virtual job tryouts and skill validation',
      'Game-based cognitive assessments',
      'Structured interview evaluation with NLP',
      'Behavioral analytics and competency scoring',
      'Automated candidate engagement',
    ],
    complianceConsiderations: [
      'AEDT under NYC Local Law 144 - requires annual bias audit',
      'Illinois AIVI consent required for video analysis',
      'Colorado AI Act high-risk system notification required',
      'Facial expression analysis may trigger additional biometric consent laws',
      'Speech pattern analysis requires transparency disclosures',
    ],
    biasRiskLevel: 'High',
    dataCollected: ['Video recordings', 'Audio and speech patterns', 'Facial expressions', 'Text transcripts', 'Assessment scores', 'Behavioral data from games'],
    laws: ['NYC Local Law 144', 'Illinois AIVI', 'Colorado AI Act', 'Maryland HB 1202', 'Texas CUBI'],
  },
  'pymetrics': {
    description: 'Neuroscience-based assessments using games to measure cognitive and emotional traits, matched against successful employee profiles.',
    aiFeatures: [
      'Neuroscience-based games',
      'Trait matching algorithms',
      'Bias-tested models',
      'Job-fit predictions',
    ],
    complianceConsiderations: [
      'AEDT requiring bias audit',
      'High-risk AI system under Colorado AI Act',
      'Trait analysis may raise fairness questions',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Game performance data', 'Cognitive trait scores', 'Behavioral patterns'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
  'workday': {
    description: 'Enterprise HCM platform with AI-powered recruiting, talent management, and workforce planning capabilities.',
    aiFeatures: [
      'Skills Cloud AI',
      'Candidate scoring',
      'Job matching',
      'Career recommendations',
    ],
    complianceConsiderations: [
      'May qualify as AEDT depending on configuration',
      'Skills matching algorithms need monitoring',
      'Large data aggregation increases privacy considerations',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Resume data', 'Skills profiles', 'Performance data', 'Career history'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'CCPA'],
  },
  'greenhouse': {
    description: 'Applicant tracking system with structured hiring tools and integration capabilities for AI add-ons.',
    aiFeatures: [
      'Structured interview kits',
      'Scorecard automation',
      'Integration with AI tools',
      'Analytics and reporting',
    ],
    complianceConsiderations: [
      'Core ATS functions generally not AEDT',
      'AI integrations may trigger compliance requirements',
      'Data retention policies need review',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Application data', 'Interview scores', 'Hiring decisions'],
    laws: ['CCPA', 'State data privacy laws'],
  },
  'eightfold': {
    description: 'Talent Intelligence Platform using deep learning for matching candidates to opportunities and career pathing.',
    aiFeatures: [
      'Deep learning talent matching',
      'Skills inference',
      'Career path predictions',
      'Diversity insights',
    ],
    complianceConsiderations: [
      'Automated matching is likely AEDT',
      'Skills inference from incomplete data raises accuracy concerns',
      'Career predictions are consequential decisions',
    ],
    biasRiskLevel: 'High',
    dataCollected: ['Resume data', 'Inferred skills', 'Career trajectory data', 'Diversity metrics'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'Illinois laws'],
  },
  'paradox': {
    description: 'Conversational AI assistant (Olivia) for recruiting automation, screening, scheduling, and candidate engagement.',
    aiFeatures: [
      'Conversational screening',
      'Automated scheduling',
      'FAQ responses',
      'Candidate qualification',
    ],
    complianceConsiderations: [
      'Screening chatbots are AEDTs if they filter candidates',
      'Conversation analysis may trigger consent requirements',
      'Automated rejection messages need review',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Chat transcripts', 'Screening responses', 'Qualification data'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
  'beamery': {
    description: 'Talent CRM with AI-powered candidate engagement, talent pooling, and pipeline management.',
    aiFeatures: [
      'Predictive lead scoring',
      'Talent pool recommendations',
      'Engagement optimization',
      'Pipeline analytics',
    ],
    complianceConsiderations: [
      'Lead scoring may be AEDT if used for selection',
      'Talent pool prioritization needs monitoring',
      'Integration with screening tools extends scope',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Candidate profiles', 'Engagement history', 'Talent scores'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'GDPR (EU operations)'],
  },
  'seekout': {
    description: 'AI-powered talent sourcing platform for finding and engaging passive candidates across the web.',
    aiFeatures: [
      'AI-powered sourcing',
      'Diversity filters',
      'Talent rediscovery',
      'Profile enrichment',
    ],
    complianceConsiderations: [
      'Sourcing generally pre-application',
      'Diversity filters need careful implementation',
      'Data aggregation from public sources has privacy implications',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Public profile data', 'Inferred contact info', 'Skills data'],
    laws: ['CCPA', 'State data broker laws'],
  },
  'hiredscore': {
    description: 'AI-powered talent orchestration for screening, matching, and prioritizing candidates.',
    aiFeatures: [
      'Resume screening',
      'Candidate scoring',
      'Match predictions',
      'Pipeline prioritization',
    ],
    complianceConsiderations: [
      'Clear AEDT under NYC Local Law 144',
      'Scoring and prioritization are consequential decisions',
      'Needs annual bias audits',
    ],
    biasRiskLevel: 'High',
    dataCollected: ['Resume data', 'Match scores', 'Priority rankings'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'Illinois laws'],
  },
  'lever': {
    description: 'Talent acquisition suite combining ATS and CRM with collaborative hiring features.',
    aiFeatures: [
      'Candidate recommendations',
      'Resume parsing',
      'Pipeline analytics',
      'Interview scheduling',
    ],
    complianceConsiderations: [
      'Core ATS features generally lower risk',
      'Recommendations features may qualify as AEDT',
      'Integration capabilities expand scope',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Application data', 'Interview feedback', 'Hiring outcomes'],
    laws: ['CCPA', 'State data privacy laws'],
  },
  'icims': {
    description: 'Enterprise talent acquisition platform with AI-powered matching and engagement tools.',
    aiFeatures: [
      'AI matching',
      'Candidate engagement',
      'Video interviewing',
      'Analytics',
    ],
    complianceConsiderations: [
      'AI matching features likely AEDT',
      'Video interviewing triggers state consent laws',
      'Enterprise scale increases impact',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Application data', 'Video interviews', 'Match scores'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'Illinois AIVI'],
  },
  'spark-hire': {
    description: 'Video interviewing platform with one-way and live interview capabilities.',
    aiFeatures: [
      'One-way video interviews',
      'Rating and evaluation',
      'Collaboration tools',
      'Basic analytics',
    ],
    complianceConsiderations: [
      'Video collection requires consent in some states',
      'If AI analysis added, AEDT requirements apply',
      'Data retention policies important',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Video recordings', 'Interviewer ratings'],
    laws: ['Illinois AIVI', 'Maryland HB 1202'],
  },
  'vidcruiter': {
    description: 'Digital interviewing platform with video, skills testing, and automated scheduling.',
    aiFeatures: [
      'Pre-recorded interviews',
      'Skills assessments',
      'Rating automation',
      'Scheduling AI',
    ],
    complianceConsiderations: [
      'Video interviews require state-specific consent',
      'Skills assessments may be AEDTs',
      'Combined scoring increases risk',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Video recordings', 'Assessment scores', 'Skills data'],
    laws: ['NYC Local Law 144', 'Illinois AIVI', 'Maryland HB 1202'],
  },
  'harver': {
    description: 'Pre-employment assessment platform using situational judgment tests, games, and simulations.',
    aiFeatures: [
      'Situational judgment tests',
      'Cultural fit assessments',
      'Gamified evaluations',
      'Predictive analytics',
    ],
    complianceConsiderations: [
      'Assessment tools are AEDTs under NYC law',
      'Cultural fit analysis raises discrimination concerns',
      'Requires bias audits',
    ],
    biasRiskLevel: 'High',
    dataCollected: ['Assessment responses', 'Game performance', 'Behavioral predictions'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
  'phenom': {
    description: 'Talent experience platform with AI-powered career sites, chatbots, and CRM.',
    aiFeatures: [
      'AI career site',
      'Chatbot screening',
      'Talent CRM',
      'Employee experience',
    ],
    complianceConsiderations: [
      'Chatbot screening is likely AEDT',
      'Career site recommendations generally lower risk',
      'Multiple AI touchpoints need comprehensive audit',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Career site interactions', 'Chat transcripts', 'Application data'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
  'humanly': {
    description: 'Conversational AI for high-volume recruiting with screening and scheduling automation.',
    aiFeatures: [
      'Conversational screening',
      'Automated scheduling',
      'Candidate qualification',
      'Interview prep',
    ],
    complianceConsiderations: [
      'Screening chatbots are AEDTs',
      'Qualification decisions are consequential',
      'Needs bias audit and notifications',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Chat transcripts', 'Qualification responses', 'Scheduling data'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
  'criteria': {
    description: 'Pre-employment testing company offering aptitude, personality, and skills assessments.',
    aiFeatures: [
      'Cognitive aptitude tests',
      'Personality assessments',
      'Skills testing',
      'Video interviewing',
    ],
    complianceConsiderations: [
      'Pre-employment tests are AEDTs',
      'Personality assessments raise legal questions',
      'Must validate for job-relatedness',
    ],
    biasRiskLevel: 'High',
    dataCollected: ['Test scores', 'Personality profiles', 'Cognitive assessments'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'ADA considerations'],
  },
  'shl': {
    description: 'Talent assessment company providing psychometric testing and talent analytics.',
    aiFeatures: [
      'Psychometric assessments',
      'Talent analytics',
      'Leadership assessments',
      'Job simulations',
    ],
    complianceConsiderations: [
      'Assessments are AEDTs requiring bias audits',
      'Long history provides validation data',
      'Enterprise use increases compliance scope',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Assessment scores', 'Psychometric data', 'Job simulation results'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
  'wonderlic': {
    description: 'Cognitive ability and personality assessment provider for employee selection.',
    aiFeatures: [
      'Cognitive ability tests',
      'Personality assessments',
      'Motivation analysis',
      'Job fit predictions',
    ],
    complianceConsiderations: [
      'Cognitive tests have disparate impact history',
      'Must demonstrate job-relatedness',
      'Requires careful validation and monitoring',
    ],
    biasRiskLevel: 'High',
    dataCollected: ['Cognitive scores', 'Personality profiles', 'Motivation metrics'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'Title VII', 'ADA'],
  },
  'mya': {
    description: 'Conversational AI for recruiting automation with screening and engagement.',
    aiFeatures: [
      'AI screening assistant',
      'Candidate engagement',
      'Interview scheduling',
      'FAQ automation',
    ],
    complianceConsiderations: [
      'Screening chatbots are AEDTs',
      'Automated qualification is consequential',
      'Needs transparent candidate notifications',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Conversation data', 'Screening responses', 'Engagement metrics'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
  'textio': {
    description: 'Augmented writing platform for job descriptions and recruiting communications.',
    aiFeatures: [
      'Language analysis',
      'Bias detection in job posts',
      'Performance predictions',
      'Writing guidance',
    ],
    complianceConsiderations: [
      'Generally pre-application, lower risk',
      'Focuses on employer content, not candidate evaluation',
      'May reduce discrimination risk overall',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Job description text', 'Language patterns', 'Performance correlations'],
    laws: ['Generally lower compliance burden'],
  },
  'fetcher': {
    description: 'AI-powered sourcing tool for finding and engaging passive candidates.',
    aiFeatures: [
      'Automated sourcing',
      'Candidate matching',
      'Outreach automation',
      'Diversity sourcing',
    ],
    complianceConsiderations: [
      'Sourcing is generally pre-application',
      'Matching algorithms need monitoring',
      'Data from public sources has privacy implications',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Public profile data', 'Contact information', 'Match scores'],
    laws: ['CCPA', 'Data broker laws'],
  },
  'gem': {
    description: 'Talent engagement platform for sourcing, nurturing, and analytics.',
    aiFeatures: [
      'Talent rediscovery',
      'Engagement automation',
      'Pipeline analytics',
      'Diversity insights',
    ],
    complianceConsiderations: [
      'CRM functions generally lower risk',
      'Rediscovery recommendations need monitoring',
      'Diversity tracking has its own requirements',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Candidate profiles', 'Engagement data', 'Pipeline metrics'],
    laws: ['CCPA', 'Data privacy laws'],
  },
  'entelo': {
    description: 'Recruiting automation platform with AI-powered sourcing and engagement.',
    aiFeatures: [
      'Predictive sourcing',
      'Diversity search',
      'Candidate scoring',
      'Engagement automation',
    ],
    complianceConsiderations: [
      'Predictive scoring may be AEDT if used in selection',
      'Diversity features need careful implementation',
      'Data aggregation has privacy implications',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Public profile data', 'Predictive scores', 'Engagement data'],
    laws: ['CCPA', 'NYC Local Law 144 (if scoring used in selection)'],
  },
  'linkedin-recruiter': {
    description: 'LinkedIn\'s premium recruiting platform for sourcing and engaging candidates.',
    aiFeatures: [
      'AI-powered search',
      'Candidate recommendations',
      'InMail optimization',
      'Talent Insights',
    ],
    complianceConsiderations: [
      'Sourcing generally pre-application',
      'Recommendations are suggestions, not decisions',
      'Data is user-controlled on platform',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['LinkedIn profile data', 'Search behavior', 'Engagement metrics'],
    laws: ['Platform-level compliance', 'GDPR for EU'],
  },
  'indeed': {
    description: 'Job board and hiring platform with resume search and candidate matching.',
    aiFeatures: [
      'Resume matching',
      'Sponsored job optimization',
      'Candidate search',
      'Assessment integration',
    ],
    complianceConsiderations: [
      'Job board matching generally lower risk',
      'Assessments may trigger AEDT requirements',
      'Large scale increases aggregate impact',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Resume data', 'Application data', 'Search behavior'],
    laws: ['CCPA', 'Platform-level compliance'],
  },
  'ziprecruiter': {
    description: 'AI-powered job marketplace matching employers with candidates.',
    aiFeatures: [
      'AI matching technology',
      'Candidate recommendations',
      'Job distribution',
      'TrafficBoost optimization',
    ],
    complianceConsiderations: [
      'Matching is facilitation, not selection',
      'Employer makes final decisions',
      'Platform compliance generally handled by ZipRecruiter',
    ],
    biasRiskLevel: 'Low',
    dataCollected: ['Job seeker profiles', 'Application data', 'Match preferences'],
    laws: ['Platform-level compliance'],
  },
  'taleo': {
    description: 'Oracle\'s enterprise talent management system with recruiting and onboarding.',
    aiFeatures: [
      'Candidate matching',
      'Requisition management',
      'Analytics',
      'Integration capabilities',
    ],
    complianceConsiderations: [
      'Legacy system with varying AI capabilities',
      'Configuration determines compliance scope',
      'Enterprise scale requires comprehensive review',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Application data', 'Hiring history', 'Employee records'],
    laws: ['Varies by configuration', 'NYC Local Law 144 for AI features'],
  },
  'sap-successfactors': {
    description: 'SAP\'s cloud HCM suite covering recruiting, learning, performance, and compensation.',
    aiFeatures: [
      'AI-powered recruiting',
      'Skills matching',
      'Learning recommendations',
      'Workforce planning',
    ],
    complianceConsiderations: [
      'Multiple AI touchpoints across platform',
      'Recruiting AI features may be AEDTs',
      'European roots mean GDPR considerations built in',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Employee data', 'Skills profiles', 'Performance data', 'Learning history'],
    laws: ['NYC Local Law 144', 'Colorado AI Act', 'GDPR'],
  },
  'jobvite': {
    description: 'Talent acquisition suite with recruiting, onboarding, and internal mobility.',
    aiFeatures: [
      'AI sourcing',
      'Candidate matching',
      'Chatbot screening',
      'Analytics',
    ],
    complianceConsiderations: [
      'Chatbot screening is AEDT',
      'AI sourcing is generally lower risk',
      'Multiple features need individual assessment',
    ],
    biasRiskLevel: 'Medium',
    dataCollected: ['Application data', 'Chat transcripts', 'Sourcing data'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  },
}

// Generate comparison combinations
export function generateComparisons(): { slug: string; tool1: AITool; tool2: AITool }[] {
  const comparisons: { slug: string; tool1: AITool; tool2: AITool }[] = []
  
  // Priority comparisons (same category)
  const categories = [...new Set(AI_TOOLS.map(t => t.category))]
  
  for (const category of categories) {
    const toolsInCategory = AI_TOOLS.filter(t => t.category === category)
    for (let i = 0; i < toolsInCategory.length; i++) {
      for (let j = i + 1; j < toolsInCategory.length; j++) {
        const tool1 = toolsInCategory[i]
        const tool2 = toolsInCategory[j]
        comparisons.push({
          slug: `${tool1.slug}-vs-${tool2.slug}`,
          tool1,
          tool2,
        })
      }
    }
  }
  
  // Cross-category comparisons (popular tools)
  const popularTools = ['hirevue', 'workday', 'greenhouse', 'eightfold', 'pymetrics']
  for (let i = 0; i < popularTools.length; i++) {
    for (let j = i + 1; j < popularTools.length; j++) {
      const tool1 = AI_TOOLS.find(t => t.slug === popularTools[i])!
      const tool2 = AI_TOOLS.find(t => t.slug === popularTools[j])!
      const slug = `${tool1.slug}-vs-${tool2.slug}`
      if (!comparisons.find(c => c.slug === slug)) {
        comparisons.push({ slug, tool1, tool2 })
      }
    }
  }
  
  return comparisons
}

export function parseComparisonSlug(slug: string): { tool1Slug: string; tool2Slug: string } | null {
  const match = slug.match(/^(.+)-vs-(.+)$/)
  if (!match) return null
  return { tool1Slug: match[1], tool2Slug: match[2] }
}

export function getToolDetails(slug: string) {
  return TOOL_DETAILS[slug] || null
}
