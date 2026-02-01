import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scale, Filter } from "lucide-react"
import { AI_TOOLS } from "@/lib/seo-data"
import { generateComparisons, TOOL_DETAILS } from "@/lib/comparison-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Hiring Tool Comparisons - Compliance Guide",
  description: "Compare AI hiring tools for compliance requirements. Side-by-side comparisons of HireVue, Pymetrics, Workday, Eightfold, and more under NYC Local Law 144, Colorado AI Act, and Illinois laws.",
  openGraph: {
    title: "Compare AI Hiring Tools for Compliance",
    description: "Which AI hiring tool is easier to comply with? Compare bias audit requirements, data collection, and regulatory obligations.",
  }
}

function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const colors = {
    Low: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[level]}`}>
      {level}
    </span>
  )
}

export default function CompareIndexPage() {
  const comparisons = generateComparisons()
  
  // Group by category
  const categories = [...new Set(AI_TOOLS.map(t => t.category))]
  
  // Popular comparisons
  const popularComparisons = comparisons.filter(c => 
    ['hirevue', 'pymetrics', 'workday', 'eightfold', 'greenhouse'].includes(c.tool1.slug) ||
    ['hirevue', 'pymetrics', 'workday', 'eightfold', 'greenhouse'].includes(c.tool2.slug)
  ).slice(0, 12)

  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            Tool Comparisons
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Compare AI Hiring Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Side-by-side compliance comparisons for the most popular AI hiring tools. Understand bias audit requirements, data collection, and regulatory obligations.
          </p>
          <Link href="/scorecard">
            <Button size="lg" variant="cta">
              Check Your Tool's Compliance <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Comparisons */}
      <section className="py-12 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Popular Comparisons</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {popularComparisons.map(comp => {
              const d1 = TOOL_DETAILS[comp.tool1.slug]
              const d2 = TOOL_DETAILS[comp.tool2.slug]
              return (
                <Link 
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="bg-white border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{comp.tool1.name}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="font-bold text-gray-900">{comp.tool2.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {d1 && <RiskBadge level={d1.biasRiskLevel} />}
                    </div>
                    <div className="flex items-center gap-1">
                      {d2 && <RiskBadge level={d2.biasRiskLevel} />}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {comp.tool1.category === comp.tool2.category ? comp.tool1.category : 'Cross-category'}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* By Category */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          
          {categories.map(category => {
            const categoryTools = AI_TOOLS.filter(t => t.category === category)
            const categoryComparisons = comparisons.filter(c => 
              c.tool1.category === category && c.tool2.category === category
            )
            
            if (categoryComparisons.length === 0) return null
            
            return (
              <div key={category} className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  {category}
                  <span className="text-sm font-normal text-gray-500">
                    ({categoryTools.length} tools, {categoryComparisons.length} comparisons)
                  </span>
                </h3>
                
                {/* Tools in category */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {categoryTools.map(tool => {
                      const details = TOOL_DETAILS[tool.slug]
                      return (
                        <span key={tool.slug} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {tool.name}
                          {details && <RiskBadge level={details.biasRiskLevel} />}
                        </span>
                      )
                    })}
                  </div>
                </div>
                
                {/* Comparisons */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoryComparisons.map(comp => (
                    <Link 
                      key={comp.slug}
                      href={`/compare/${comp.slug}`}
                      className="bg-white border rounded-lg p-3 hover:border-blue-300 hover:shadow transition-all text-sm"
                    >
                      <span className="font-medium">{comp.tool1.name}</span>
                      <span className="text-gray-400 mx-1">vs</span>
                      <span className="font-medium">{comp.tool2.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* All Tools Reference */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">All Tools We Cover</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AI_TOOLS.map(tool => {
              const details = TOOL_DETAILS[tool.slug]
              const toolComparisons = comparisons.filter(c => 
                c.tool1.slug === tool.slug || c.tool2.slug === tool.slug
              )
              
              return (
                <div key={tool.slug} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{tool.name}</span>
                    {details && <RiskBadge level={details.biasRiskLevel} />}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{tool.category}</div>
                  <div className="text-xs text-blue-600">
                    {toolComparisons.length} comparisons →
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Using One of These Tools?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get a personalized compliance assessment for your specific AI hiring stack.
          </p>
          <Link href="/scorecard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Free Compliance Score <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
