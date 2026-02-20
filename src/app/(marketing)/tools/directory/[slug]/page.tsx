import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ExternalLink, ArrowLeft, Zap, Landmark, ClipboardCheck, Link2, Shield, CheckCircle2 } from "lucide-react"
import { toolCatalog, getToolBySlug, getRelatedTools, type RiskLevel } from "@/data/tool-catalog"
import type { Metadata } from "next"

const riskColors: Record<RiskLevel, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
  none: "bg-gray-100 text-gray-600 border-gray-200",
}

export async function generateStaticParams() {
  return toolCatalog.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return { title: "Tool Not Found" }
  return {
    title: `${tool.name} AI Compliance Requirements | HireShield`,
    description: `Compliance profile for ${tool.name} by ${tool.vendor}. ${tool.aiFeatures.length} AI features analyzed across ${tool.complianceRequirements.length} state regulations.`,
    keywords: [tool.name, tool.vendor, "AI compliance", "hiring tools", tool.category, "HR technology"],
  }
}

export default async function ToolProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const related = getRelatedTools(slug, 4)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back */}
      <Link href="/tools/directory" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      {/* Header */}
      <div className="bg-white border rounded-xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
            <p className="text-gray-500 mt-1">{tool.vendor}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tool.category}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${riskColors[tool.riskLevel]}`}>
                {tool.riskLevel.charAt(0).toUpperCase() + tool.riskLevel.slice(1)} Risk
              </span>
            </div>
          </div>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            Visit Website <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="mt-4 text-gray-600">{tool.description}</p>
      </div>

      {/* AI Features */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
          <Zap className="w-5 h-5 text-yellow-500" /> AI Features
        </h2>
        <div className="space-y-3">
          {tool.aiFeatures.map((feature) => (
            <div key={feature.name} className="bg-white border rounded-lg p-4 flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{feature.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{feature.description}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ml-4 ${riskColors[feature.riskLevel]}`}>
                {feature.riskLevel.charAt(0).toUpperCase() + feature.riskLevel.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Requirements */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
          <Landmark className="w-5 h-5 text-blue-600" /> Compliance Requirements by State
        </h2>
        <div className="space-y-4">
          {tool.complianceRequirements.map((req, i) => (
            <div key={i} className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold text-gray-900">{req.state}</span>
                <span className="text-sm text-gray-500">—</span>
                <span className="text-sm font-medium text-blue-600">{req.lawName}</span>
              </div>
              <ul className="space-y-2">
                {req.requirements.map((r, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
          <ClipboardCheck className="w-5 h-5 text-green-600" /> What You Need to Do
        </h2>
        <div className="bg-white border rounded-lg p-5">
          <ul className="space-y-3">
            {tool.checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related Tools */}
      {related.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-4">
            <Link2 className="w-5 h-5 text-purple-600" /> Related Tools
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/directory/${t.slug}`}
                className="bg-white border rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{t.name}</h3>
                    <p className="text-xs text-gray-500">{t.category}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${riskColors[t.riskLevel]}`}>
                    {t.riskLevel.charAt(0).toUpperCase() + t.riskLevel.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center">
        <Shield className="w-10 h-10 text-blue-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Automate your {tool.name} compliance
        </h2>
        <p className="text-blue-100 mb-6 max-w-md mx-auto">
          Get a complete compliance action plan, generate required documents, and stay audit-ready.
        </p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Start Free Assessment <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
