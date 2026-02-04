import { NextRequest, NextResponse } from 'next/server'
import { AI_TOOLS, STATES_WITH_LAWS, getToolBySlug, getStateBySlug } from '@/lib/seo-data'
import { GLOSSARY_TERMS, getTermBySlug } from '@/lib/glossary-data'
import { RESOURCE_PAGES, getResourceBySlug, type ResourceContent } from '@/lib/resources-data'

// Short aliases for state slugs (marketing URLs -> seo-data slugs)
const STATE_ALIASES: Record<string, string> = {
  'nyc': 'new-york-city',
  'ny': 'new-york',
  'ca': 'california',
  'co': 'colorado',
  'il': 'illinois',
  'md': 'maryland',
}

function resolveStateSlug(slug: string): string {
  return STATE_ALIASES[slug.toLowerCase()] || slug
}

// AI agent guidance header - appears at top of all markdown responses
const AGENT_HEADER = `> For a complete index of AI-optimized documentation, see [/llms.txt](https://aihirelaw.com/llms.txt)

`

// Generate markdown for tool + state compliance pages
function generateToolStateMarkdown(toolSlug: string, stateSlug: string): string | null {
  const tool = getToolBySlug(toolSlug)
  const state = getStateBySlug(stateSlug) as typeof STATES_WITH_LAWS[number] | undefined
  
  if (!tool || !state || !('laws' in state)) return null
  
  const laws = state.laws as readonly string[]
  
  let md = `# ${tool.name} Compliance in ${state.name}

Everything you need to know about using ${tool.name} for hiring in ${state.name}.

## Quick Summary

- **Tool:** ${tool.name} (${tool.category})
- **State:** ${state.name} (${state.code})
- **Applicable Laws:** ${laws.join(', ')}
- **Effective Date:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}

## What You Need to Do

`

  if (laws.includes('AIVI')) {
    md += `### Illinois AIVI Compliance

- Notify candidates that AI will analyze their video interview
- Obtain written consent before the interview
- Explain how the AI works and what characteristics it evaluates
- Limit who can view the video (only those necessary for hiring)
- Delete videos within 30 days upon candidate request

`
  }
  
  if (laws.includes('BIPA')) {
    md += `### Illinois BIPA Compliance

- Obtain written consent before collecting biometric data (face, voice)
- Provide a written retention policy
- Never sell or profit from biometric data
- Store biometric data securely

⚠️ **Warning:** BIPA allows private lawsuits with damages of $1,000-$5,000 per violation

`
  }
  
  if (laws.includes('Local Law 144')) {
    md += `### NYC Local Law 144 Compliance

- Conduct annual bias audits of automated decision tools
- Publish audit results on your website
- Notify candidates 10+ days before using the tool
- Disclose what data is collected and analyzed
- Offer alternative selection process upon request

`
  }
  
  if (laws.includes('Colorado AI Act')) {
    md += `### Colorado AI Act Compliance

- Implement risk management policies for high-risk AI systems
- Conduct impact assessments before deployment
- Disclose AI use to candidates before decisions are made
- Provide opportunity for human review of AI decisions
- Document all AI systems used in employment decisions

`
  }
  
  if (laws.includes('HB 1202')) {
    md += `### Maryland HB 1202 Compliance

- Obtain consent before using facial recognition in interviews
- Provide signed waiver before video interview
- Cannot use facial recognition without explicit consent

`
  }

  md += `## Does This Apply to ${tool.name}?

`
  
  if (tool.category === 'Video Interview') {
    md += `**Yes.** ${tool.name} conducts video interviews which are explicitly covered by ${state.name}'s AI hiring regulations. You must obtain consent and provide disclosures before using ${tool.name} for candidates in ${state.name}.

`
  } else if (tool.category === 'Assessment') {
    md += `**Likely yes.** ${tool.name} uses AI-powered assessments to evaluate candidates. If these assessments substantially influence hiring decisions for ${state.name} candidates, compliance is required.

`
  } else if (['ATS', 'ATS/HCM', 'HCM'].includes(tool.category)) {
    md += `**It depends.** If ${tool.name}'s AI features (resume screening, candidate ranking) are used to filter ${state.name} candidates, compliance is likely required. Review which AI features you're using.

`
  } else {
    md += `**Potentially.** If ${tool.name} is used to screen, filter, or rank candidates from ${state.name} using AI, compliance may be required. Consult with legal counsel.

`
  }

  md += `---

*Source: [AIHireLaw](https://aihirelaw.com/compliance/${tool.slug}/${state.slug}) - This is for informational purposes only and does not constitute legal advice.*
`

  return md
}

// Generate markdown for tool overview pages
function generateToolMarkdown(toolSlug: string): string | null {
  const tool = getToolBySlug(toolSlug)
  if (!tool) return null
  
  let md = `# ${tool.name} AI Hiring Compliance Guide

${tool.name} is a ${tool.category} tool used in hiring. Here's what you need to know about compliance.

## States with AI Hiring Laws

The following states have specific laws that may apply when using ${tool.name}:

`
  
  for (const state of STATES_WITH_LAWS) {
    md += `### ${state.name}
- **Laws:** ${state.laws.join(', ')}
- **Effective:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}
- **Summary:** ${state.summary}
- [View full ${tool.name} compliance guide for ${state.name}](/compliance/${tool.slug}/${state.slug})

`
  }

  md += `---

*Source: [AIHireLaw](https://aihirelaw.com/compliance/${tool.slug}) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate markdown for state overview pages
function generateStateMarkdown(stateSlug: string): string | null {
  const state = getStateBySlug(stateSlug) as typeof STATES_WITH_LAWS[number] | undefined
  if (!state || !('laws' in state)) return null
  
  let md = `# ${state.name} AI Hiring Law Compliance

${state.summary}

## Overview

- **State:** ${state.name} (${state.code})
- **Laws:** ${state.laws.join(', ')}
- **Effective Date:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}

## AI Tools Covered

These AI hiring tools may require compliance in ${state.name}:

`
  
  for (const tool of AI_TOOLS) {
    md += `- [${tool.name}](/compliance/${tool.slug}/${state.slug}) (${tool.category})\n`
  }

  md += `
---

*Source: [AIHireLaw](https://aihirelaw.com/compliance/state/${state.slug}) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate main compliance overview
function generateComplianceOverview(): string {
  let md = `# AI Hiring Compliance Guide

Navigate AI hiring laws with confidence. AIHireLaw helps employers stay compliant with state and local regulations.

## States with AI Hiring Laws

`
  
  for (const state of STATES_WITH_LAWS) {
    md += `### ${state.name}
- **Laws:** ${state.laws.join(', ')}
- **Effective:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}
- **Summary:** ${state.summary}

`
  }

  md += `## AI Tools We Cover

`
  
  const categories = [...new Set(AI_TOOLS.map(t => t.category))]
  for (const category of categories) {
    const tools = AI_TOOLS.filter(t => t.category === category)
    md += `### ${category}
${tools.map(t => `- [${t.name}](/compliance/${t.slug})`).join('\n')}

`
  }

  md += `---

*Source: [AIHireLaw](https://aihirelaw.com/compliance) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate markdown for a single glossary term
function generateGlossaryTermMarkdown(termSlug: string): string | null {
  const term = getTermBySlug(termSlug)
  if (!term) return null
  
  let md = `# ${term.term} (${term.fullName})

${term.definition}

## Why It Matters

${term.whyItMatters}

## Related Laws

${term.relatedLaws.map(law => `- ${law}`).join('\n')}

## Examples

${term.examples.map(ex => `- ${ex}`).join('\n')}

## Related Terms

${term.relatedTerms.map(t => `- [${t}](/glossary/${t})`).join('\n')}

---

*Source: [AIHireLaw Glossary](https://aihirelaw.com/glossary/${term.slug}) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate markdown for a single resource page
function generateResourceMarkdown(resource: ResourceContent): string {
  let md = `# ${resource.title}

${resource.description}

`
  
  for (const section of resource.sections) {
    md += `## ${section.heading}

${section.content}

`
    if (section.items) {
      for (const item of section.items) {
        md += `${item.startsWith('☐') || item.startsWith('Q:') || /^\d\./.test(item) ? '' : '- '}${item}\n`
      }
      md += '\n'
    }
  }

  if (resource.relatedLinks && resource.relatedLinks.length > 0) {
    md += `## Related Resources

${resource.relatedLinks.map(link => `- [${link.title}](${link.url})`).join('\n')}

`
  }

  md += `---

*Source: [AIHireLaw](https://aihirelaw.com/resources/${resource.slug}) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate resources index
function generateResourcesIndex(): string {
  let md = `# AI Hiring Compliance Resources

Guides, templates, and tools for navigating AI hiring regulations.

## Compliance Guides by Jurisdiction

### NYC Local Law 144
- [NYC Local Law 144: Complete Employer Compliance Guide](/resources/nyc-local-law-144)

### Illinois
- [Illinois AI Hiring Law (HB 3773) Guide](/resources/illinois-ai-hiring-law)

### Colorado
- [Colorado AI Act: Employer Requirements Explained](/resources/colorado-ai-act-employers)

### California
- [California CCPA ADMT Regulations Guide](/resources/california-ccpa-admt)

## Templates & Tools

- [AI Disclosure Notice Template](/resources/ai-disclosure-notice-template)
- [AI Hiring Compliance Checklist for 2026](/resources/compliance-checklist-2026)
- [Vendor Assessment Guide](/resources/vendor-assessment-guide)
- [HR Training Guide](/resources/hr-training-guide)

## Understanding AI Hiring

- [What Counts as AI in Hiring?](/resources/what-counts-as-ai-hiring)
- [FAQ: Common Questions Answered](/resources/faq)

---

*Source: [AIHireLaw Resources](https://aihirelaw.com/resources) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate glossary index
function generateGlossaryIndex(): string {
  let md = `# AI Hiring Compliance Glossary

Essential terms and definitions for understanding AI hiring laws and regulations.

## Terms

`
  
  for (const term of GLOSSARY_TERMS) {
    md += `### [${term.term}](/glossary/${term.slug})
**${term.fullName}**

${term.definition.slice(0, 200)}${term.definition.length > 200 ? '...' : ''}

`
  }

  md += `---

*Source: [AIHireLaw Glossary](https://aihirelaw.com/glossary) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  
  let markdown: string | null = null
  
  if (!slug || slug.length === 0) {
    // /api/markdown or /api/markdown/compliance
    markdown = generateComplianceOverview()
  } else if (slug[0] === 'compliance') {
    if (slug.length === 1) {
      // /api/markdown/compliance
      markdown = generateComplianceOverview()
    } else if (slug.length === 2) {
      // /api/markdown/compliance/[slug] - could be tool or state
      // Try state first (e.g., /compliance/nyc, /compliance/colorado)
      const resolvedStateSlug = resolveStateSlug(slug[1])
      const state = getStateBySlug(resolvedStateSlug) as typeof STATES_WITH_LAWS[number] | undefined
      if (state && 'laws' in state) {
        markdown = generateStateMarkdown(resolvedStateSlug)
      } else {
        // Try as tool (e.g., /compliance/hirevue)
        markdown = generateToolMarkdown(slug[1])
      }
    } else if (slug.length === 3) {
      if (slug[1] === 'state') {
        // /api/markdown/compliance/state/[state]
        const resolvedStateSlug = resolveStateSlug(slug[2])
        markdown = generateStateMarkdown(resolvedStateSlug)
      } else {
        // /api/markdown/compliance/[tool]/[state]
        const resolvedStateSlug = resolveStateSlug(slug[2])
        markdown = generateToolStateMarkdown(slug[1], resolvedStateSlug)
      }
    }
  } else if (slug[0] === 'glossary') {
    if (slug.length === 1) {
      // /api/markdown/glossary
      markdown = generateGlossaryIndex()
    } else if (slug.length === 2) {
      // /api/markdown/glossary/[term]
      markdown = generateGlossaryTermMarkdown(slug[1])
    }
  } else if (slug[0] === 'resources') {
    if (slug.length === 1) {
      // /api/markdown/resources
      markdown = generateResourcesIndex()
    } else if (slug.length === 2) {
      // /api/markdown/resources/[slug]
      const resource = getResourceBySlug(slug[1])
      if (resource) {
        markdown = generateResourceMarkdown(resource)
      }
    }
  } else if (slug.length === 1) {
    // Try as tool
    markdown = generateToolMarkdown(slug[0])
    if (!markdown) {
      // Try as state
      markdown = generateStateMarkdown(slug[0])
    }
  } else if (slug.length === 2) {
    // /api/markdown/[tool]/[state]
    markdown = generateToolStateMarkdown(slug[0], slug[1])
  }
  
  if (!markdown) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }
  
  // Prepend agent guidance header to all markdown responses
  const fullMarkdown = AGENT_HEADER + markdown
  
  return new NextResponse(fullMarkdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
