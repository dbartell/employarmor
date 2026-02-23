import { MetadataRoute } from 'next'
import { AI_TOOLS, STATES_WITH_LAWS } from '@/lib/seo-data'
import { generateComparisons } from '@/lib/comparison-data'
import { GLOSSARY_TERMS } from '@/lib/glossary-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://employarmor.com'

// Blog post slugs (update this list when adding new posts)
const BLOG_POSTS = [
  'ai-hiring-compliance-small-business',
  'ai-hiring-law-updates-q2-2026',
  'ai-hiring-laws-2026',
  'ai-impact-assessment-hiring',
  'ai-policy-employee-handbook',
  'candidate-rights-ai-hiring',
  'financial-services-ai-hiring',
  'healthcare-ai-hiring-compliance',
  'how-to-conduct-ai-bias-audit',
  'nyc-ll144-enforcement',
  'staffing-agency-ai-compliance',
  'video-interview-ai-compliance',
]

// Resource page slugs (update this list when adding new resources)
const RESOURCE_PAGES = [
  'ai-bias-audit-guide',
  'ai-disclosure-decision-tree',
  'ai-disclosure-notice-template',
  'ai-hiring-compliance-guide-2026',
  'ai-hiring-disclosure-template-download',
  'ai-hiring-laws-by-state',
  'california-ccpa-admt',
  'colorado-ai-act-employers',
  'compliance-checklist-2026',
  'compliance-program-guide',
  'eeoc-ai-hiring-guidance',
  'employarmor-vs-consultants',
  'employarmor-vs-manual-compliance',
  'eu-ai-act-hiring',
  'faq',
  'federal-ai-hiring-laws',
  'greenhouse-ats-compliance',
  'guides',
  'hirevue-compliance',
  'hr-training-guide',
  'illinois-ai-hiring-law',
  'illinois-aivia-compliance-guide',
  'indeed-ai-compliance',
  'linkedin-recruiter-ai-compliance',
  'maryland-ai-hiring-law',
  'nyc-local-law-144',
  'templates',
  'texas-ai-hiring-law',
  'vendor-assessment-guide',
  'washington-ai-hiring-law',
  'what-counts-as-ai-hiring',
  'workday-ai-compliance',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/scorecard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/compliance`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/glossary`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = AI_TOOLS.map(tool => ({
    url: `${BASE_URL}/compliance/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // State pages
  const statePages: MetadataRoute.Sitemap = STATES_WITH_LAWS.map(state => ({
    url: `${BASE_URL}/compliance/state/${state.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Tool + State combination pages (the big programmatic SEO play)
  const toolStatePages: MetadataRoute.Sitemap = AI_TOOLS.flatMap(tool =>
    STATES_WITH_LAWS.map(state => ({
      url: `${BASE_URL}/compliance/${tool.slug}/${state.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  // Comparison pages
  const comparisons = generateComparisons()
  const comparisonPages: MetadataRoute.Sitemap = comparisons.map(comp => ({
    url: `${BASE_URL}/compare/${comp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Glossary term pages
  const glossaryPages: MetadataRoute.Sitemap = GLOSSARY_TERMS.map(term => ({
    url: `${BASE_URL}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Resource pages
  const resourcePages: MetadataRoute.Sitemap = RESOURCE_PAGES.map(slug => ({
    url: `${BASE_URL}/resources/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...toolPages,
    ...statePages,
    ...toolStatePages,
    ...comparisonPages,
    ...glossaryPages,
    ...blogPages,
    ...resourcePages,
  ]
}
