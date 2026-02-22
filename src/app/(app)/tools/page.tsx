"use client"

import { useEffect, useState } from "react"
import { Layers, Plus, Search, Filter, AlertTriangle, CheckCircle2, Clock, XCircle, ExternalLink, Shield, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toolCatalog, type ToolCatalogEntry } from "@/data/tool-catalog"

type RegistryEntry = {
  id: string
  tool_slug: string | null
  tool_name: string
  category: string
  features: string[]
  justification: string | null
  status: string
  conditions: string | null
  reason: string | null
  requested_by: string
  approved_by: string | null
  expires_at: string | null
  created_at: string
}

type ToolDisplay = {
  slug: string
  name: string
  category: string
  vendor: string
  description: string
  websiteUrl: string
  riskLevel: "high" | "medium" | "low" | "none"
  aiFeatures: { name: string; description: string; riskLevel: string; triggeredLaws: string[] }[]
  complianceNotes: string
  source: "quiz" | "registry" | "both"
  registryStatus?: string
  registryEntry?: RegistryEntry
}

export default function ToolRegistryPage() {
  const [tools, setTools] = useState<ToolDisplay[]>([])
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRisk, setFilterRisk] = useState<string>("all")
  const [expandedTool, setExpandedTool] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTools() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Fetch org's quiz tools
      const { data: org } = await supabase
        .from("organizations")
        .select("quiz_tools")
        .eq("id", user.id)
        .single()

      const quizToolSlugs: string[] = org?.quiz_tools || []

      // Try to fetch registry entries (table may not exist)
      let registry: RegistryEntry[] = []
      try {
        const { data, error } = await supabase
          .from("org_tool_registry")
          .select("*")
          .eq("org_id", user.id)
          .order("created_at", { ascending: false })
        if (!error && data) registry = data
      } catch {
        // Table doesn't exist yet — that's fine
      }
      setRegistryEntries(registry)

      // Build tool display list from quiz tools + catalog
      const toolMap = new Map<string, ToolDisplay>()

      for (const slug of quizToolSlugs) {
        const catalogEntry = toolCatalog.find(t => t.slug === slug)
        if (catalogEntry) {
          toolMap.set(slug, {
            slug: catalogEntry.slug,
            name: catalogEntry.name,
            category: catalogEntry.category,
            vendor: catalogEntry.vendor,
            description: catalogEntry.description,
            websiteUrl: catalogEntry.websiteUrl,
            riskLevel: catalogEntry.riskLevel,
            aiFeatures: catalogEntry.aiFeatures,
            complianceNotes: catalogEntry.complianceNotes,
            source: "quiz",
          })
        } else {
          // Tool selected in quiz but not in catalog — show basic info
          toolMap.set(slug, {
            slug,
            name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            category: "Unknown",
            vendor: "Unknown",
            description: "",
            websiteUrl: "",
            riskLevel: "medium",
            aiFeatures: [],
            complianceNotes: "",
            source: "quiz",
          })
        }
      }

      // Merge registry entries
      for (const entry of registry) {
        const slug = entry.tool_slug || entry.tool_name.toLowerCase().replace(/\s+/g, "-")
        if (toolMap.has(slug)) {
          const existing = toolMap.get(slug)!
          existing.source = "both"
          existing.registryStatus = entry.status
          existing.registryEntry = entry
        } else {
          const catalogEntry = toolCatalog.find(t => t.slug === slug)
          toolMap.set(slug, {
            slug,
            name: entry.tool_name,
            category: entry.category,
            vendor: catalogEntry?.vendor || "Unknown",
            description: catalogEntry?.description || "",
            websiteUrl: catalogEntry?.websiteUrl || "",
            riskLevel: catalogEntry?.riskLevel || "medium",
            aiFeatures: catalogEntry?.aiFeatures || [],
            complianceNotes: catalogEntry?.complianceNotes || "",
            source: "registry",
            registryStatus: entry.status,
            registryEntry: entry,
          })
        }
      }

      setTools(Array.from(toolMap.values()).sort((a, b) => {
        const riskOrder = { high: 0, medium: 1, low: 2, none: 3 }
        return (riskOrder[a.riskLevel] ?? 2) - (riskOrder[b.riskLevel] ?? 2)
      }))
      setLoading(false)
    }
    fetchTools()
  }, [])

  const riskBadge = (level: string) => {
    const styles: Record<string, string> = {
      critical: "bg-red-100 text-red-700 border-red-200",
      high: "bg-orange-100 text-orange-700 border-orange-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-green-100 text-green-700 border-green-200",
      none: "bg-gray-100 text-gray-600 border-gray-200",
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[level] || styles.medium}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Risk
      </span>
    )
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      pending_review: "bg-yellow-100 text-yellow-700",
      denied: "bg-red-100 text-red-700",
    }
    const labels: Record<string, string> = {
      approved: "Approved",
      pending_review: "Pending Review",
      denied: "Denied",
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] || "bg-gray-100 text-gray-600"}`}>
        {labels[status] || status}
      </span>
    )
  }

  // Filter tools
  const filteredTools = tools.filter(t => {
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !t.category.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterRisk !== "all" && t.riskLevel !== filterRisk) return false
    return true
  })

  const highRiskCount = tools.filter(t => t.riskLevel === "high").length
  const mediumRiskCount = tools.filter(t => t.riskLevel === "medium").length
  const lowRiskCount = tools.filter(t => t.riskLevel === "low" || t.riskLevel === "none").length
  const pendingCount = registryEntries.filter(e => e.status === "pending_review").length

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-600" />
            Tool Registry
          </h1>
          <p className="text-gray-500 mt-1">
            {tools.length > 0
              ? `${tools.length} tool${tools.length !== 1 ? "s" : ""} in your hiring stack`
              : "No tools registered yet — complete the compliance quiz to get started"}
          </p>
        </div>
        <Link
          href="/tools/request"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Request New Tool
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{tools.length}</div>
              <div className="text-sm text-gray-500">Total Tools</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{highRiskCount}</div>
              <div className="text-sm text-gray-500">High Risk</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
              <div className="text-sm text-gray-500">Pending Review</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{lowRiskCount}</div>
              <div className="text-sm text-gray-500">Low Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
          <option value="none">No Risk</option>
        </select>
      </div>

      {/* Pending Registry Requests */}
      {registryEntries.filter(e => e.status === "pending_review").length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Pending Approval
          </h2>
          <div className="space-y-3">
            {registryEntries.filter(e => e.status === "pending_review").map((entry) => (
              <div key={entry.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{entry.tool_name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{entry.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Requested {new Date(entry.created_at).toLocaleDateString()}
                    {entry.justification && ` · "${entry.justification}"`}
                  </p>
                </div>
                <Link href="/approvals" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tools List */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tools.length === 0 ? "No tools yet" : "No matching tools"}
          </h3>
          <p className="text-gray-500 mb-4">
            {tools.length === 0
              ? "Complete the compliance quiz to identify tools in your hiring stack."
              : "Try adjusting your search or filter."}
          </p>
          {tools.length === 0 && (
            <Link href="/scan" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Take Compliance Quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTools.map((tool) => (
            <div key={tool.slug} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedTool(expandedTool === tool.slug ? null : tool.slug)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tool.riskLevel === "high" ? "bg-orange-100" :
                    tool.riskLevel === "medium" ? "bg-yellow-100" :
                    "bg-green-100"
                  }`}>
                    <Shield className={`w-5 h-5 ${
                      tool.riskLevel === "high" ? "text-orange-600" :
                      tool.riskLevel === "medium" ? "text-yellow-600" :
                      "text-green-600"
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{tool.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{tool.category}</span>
                      {riskBadge(tool.riskLevel)}
                      {tool.registryStatus && statusBadge(tool.registryStatus)}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {tool.vendor !== "Unknown" && `${tool.vendor} · `}
                      {tool.aiFeatures.length} AI feature{tool.aiFeatures.length !== 1 ? "s" : ""} detected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {tool.websiteUrl && (
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {expandedTool === tool.slug ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedTool === tool.slug && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  {tool.description && (
                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  )}

                  {tool.aiFeatures.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Features</h4>
                      <div className="space-y-2">
                        {tool.aiFeatures.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              feature.riskLevel === "high" ? "bg-orange-500" :
                              feature.riskLevel === "medium" ? "bg-yellow-500" :
                              "bg-green-500"
                            }`} />
                            <div>
                              <span className="font-medium text-gray-900">{feature.name}</span>
                              <span className="text-gray-500"> — {feature.description}</span>
                              {feature.triggeredLaws.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {feature.triggeredLaws.map(law => (
                                    <span key={law} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono">{law}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tool.complianceNotes && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Compliance Notes</h4>
                      <p className="text-sm text-blue-800">{tool.complianceNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Denied Registry Entries */}
      {registryEntries.filter(e => e.status === "denied").length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Denied Tools
          </h2>
          <div className="space-y-3">
            {registryEntries.filter(e => e.status === "denied").map((entry) => (
              <div key={entry.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{entry.tool_name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{entry.category}</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Denied {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : ""}
                  {entry.reason && `: ${entry.reason}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
