"use client"

import { useEffect, useState } from "react"
import { Layers, Plus, Search, Filter, AlertTriangle, CheckCircle2, Clock, XCircle, ExternalLink, Shield, ChevronDown, ChevronUp, FileText, Download, Loader2, X, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toolCatalog, type ToolCatalogEntry } from "@/data/tool-catalog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  getAdsDecisions, createAdsDecision, getAdsDecisionStats,
  exportAdsDecisions, AdsDecisionRecord
} from "@/lib/actions/ads-decisions"

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

  // Tab state
  const [activeTab, setActiveTab] = useState<'registry' | 'ads-log'>('registry')

  // ADS Decision Log state
  const [adsRecords, setAdsRecords] = useState<AdsDecisionRecord[]>([])
  const [adsStats, setAdsStats] = useState({ total: 0, expiringSoon: 0, toolNames: [] as string[] })
  const [adsLoading, setAdsLoading] = useState(false)
  const [adsSearchQuery, setAdsSearchQuery] = useState("")
  const [adsToolFilter, setAdsToolFilter] = useState("all")
  const [adsTypeFilter, setAdsTypeFilter] = useState("all")
  const [adsDateFrom, setAdsDateFrom] = useState("")
  const [adsDateTo, setAdsDateTo] = useState("")
  const [adsShowForm, setAdsShowForm] = useState(false)
  const [adsSaving, setAdsSaving] = useState(false)
  const [adsExporting, setAdsExporting] = useState(false)
  const [adsExpandedRecord, setAdsExpandedRecord] = useState<string | null>(null)
  const [adsFormData, setAdsFormData] = useState({
    tool_name: '',
    decision_type: 'hire' as string,
    input_summary: '',
    output_decision: '',
    criteria_used: '',
    bias_test_results: '',
    affected_person: '',
    decision_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

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

  // ADS Decision Log data loading
  useEffect(() => {
    if (activeTab === 'ads-log') loadAdsDecisions()
  }, [activeTab, adsSearchQuery, adsToolFilter, adsTypeFilter, adsDateFrom, adsDateTo])

  const loadAdsDecisions = async () => {
    setAdsLoading(true)
    const [recordsData, statsData] = await Promise.all([
      getAdsDecisions({
        tool: adsToolFilter,
        decisionType: adsTypeFilter,
        dateFrom: adsDateFrom || undefined,
        dateTo: adsDateTo || undefined,
        search: adsSearchQuery || undefined
      }),
      getAdsDecisionStats()
    ])
    setAdsRecords(recordsData as AdsDecisionRecord[])
    setAdsStats(statsData)
    setAdsLoading(false)
  }

  const handleAdsCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adsFormData.tool_name.trim() || !adsFormData.decision_date) return
    setAdsSaving(true)
    await createAdsDecision({
      tool_name: adsFormData.tool_name.trim(),
      decision_type: adsFormData.decision_type,
      input_summary: adsFormData.input_summary.trim() || undefined,
      output_decision: adsFormData.output_decision.trim() || undefined,
      criteria_used: adsFormData.criteria_used.trim() || undefined,
      bias_test_results: adsFormData.bias_test_results.trim() || undefined,
      affected_person: adsFormData.affected_person.trim() || undefined,
      decision_date: adsFormData.decision_date,
      notes: adsFormData.notes.trim() || undefined,
    })
    setAdsFormData({
      tool_name: '', decision_type: 'hire', input_summary: '', output_decision: '',
      criteria_used: '', bias_test_results: '', affected_person: '',
      decision_date: new Date().toISOString().split('T')[0], notes: ''
    })
    setAdsShowForm(false)
    setAdsSaving(false)
    await loadAdsDecisions()
  }

  const handleAdsExport = async () => {
    setAdsExporting(true)
    const result = await exportAdsDecisions({
      tool: adsToolFilter !== 'all' ? adsToolFilter : undefined,
      decisionType: adsTypeFilter !== 'all' ? adsTypeFilter : undefined,
      dateFrom: adsDateFrom || undefined,
      dateTo: adsDateTo || undefined,
    })
    if ('records' in result && result.records) {
      const headers = ['Tool', 'Decision Type', 'Affected Person', 'Decision Date', 'Input Summary', 'Output Decision', 'Criteria Used', 'Bias Test Results', 'Retention Expires', 'Exported At', 'Notes']
      const rows = result.records.map((r: AdsDecisionRecord) => [
        r.tool_name,
        r.decision_type,
        r.affected_person || '',
        r.decision_date,
        (r.input_summary || '').replace(/,/g, ';'),
        (r.output_decision || '').replace(/,/g, ';'),
        (r.criteria_used || '').replace(/,/g, ';'),
        (r.bias_test_results || '').replace(/,/g, ';'),
        r.retention_expires,
        r.exported_at || '',
        (r.notes || '').replace(/,/g, ';')
      ])
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ads-decision-log-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      await loadAdsDecisions()
    }
    setAdsExporting(false)
  }

  const getRetentionRemaining = (expires: string) => {
    const diff = new Date(expires).getTime() - Date.now()
    if (diff <= 0) return 'Expired'
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days > 365) {
      const years = Math.floor(days / 365)
      const months = Math.floor((days % 365) / 30)
      return `${years}y ${months}m`
    }
    if (days > 30) return `${Math.floor(days / 30)}m ${days % 30}d`
    return `${days}d`
  }

  const decisionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hire: 'Hire', reject: 'Reject', promote: 'Promote',
      terminate: 'Terminate', discipline: 'Discipline', other: 'Other'
    }
    return labels[type] || type
  }

  const decisionTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      hire: 'bg-green-100 text-green-700',
      reject: 'bg-red-100 text-red-700',
      promote: 'bg-blue-100 text-blue-700',
      terminate: 'bg-red-100 text-red-700',
      discipline: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-600'
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[type] || styles.other}`}>
        {decisionTypeLabel(type)}
      </span>
    )
  }

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
      {/* Hero */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tool Registry</h1>
            <p className="text-lg text-gray-600 mb-4">Register and monitor the AI tools your organization uses in hiring</p>
          </div>
          {activeTab === 'registry' && (
            <Link
              href="/tools/request"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Request New Tool
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('registry')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'registry'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Tool Registry ({tools.length})
        </button>
        <button
          onClick={() => setActiveTab('ads-log')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'ads-log'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          ADS Decision Log ({adsStats.total})
        </button>
      </div>

      {activeTab === 'registry' ? (
      <>
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
            {tools.length === 0 ? "No AI tools registered yet" : "No matching tools"}
          </h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            {tools.length === 0
              ? "Register the AI tools your organization uses in hiring to track compliance requirements"
              : "Try adjusting your search or filter."}
          </p>
          {tools.length === 0 && (
            <Link href="/tools/request" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              <Plus className="w-4 h-4" />
              Add Your First Tool
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
      </>
      ) : (
        /* ADS Decision Log Tab */
        <>
          {/* ADS Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{adsStats.total}</div>
                  <div className="text-sm text-gray-500">Total Decisions</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{adsStats.expiringSoon}</div>
                  <div className="text-sm text-gray-500">Expiring in 90 Days</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{adsStats.toolNames.length}</div>
                  <div className="text-sm text-gray-500">Unique Tools</div>
                </div>
              </div>
            </div>
          </div>

          {/* ADS Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by person or tool..."
                value={adsSearchQuery}
                onChange={(e) => setAdsSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={adsToolFilter}
              onChange={(e) => setAdsToolFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tools</option>
              {adsStats.toolNames.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={adsTypeFilter}
              onChange={(e) => setAdsTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="hire">Hire</option>
              <option value="reject">Reject</option>
              <option value="promote">Promote</option>
              <option value="terminate">Terminate</option>
              <option value="discipline">Discipline</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={adsDateFrom}
                onChange={(e) => setAdsDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="From"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={adsDateTo}
                onChange={(e) => setAdsDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="To"
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleAdsExport} disabled={adsRecords.length === 0 || adsExporting}>
                {adsExporting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                Export CSV
              </Button>
              <Button onClick={() => setAdsShowForm(!adsShowForm)}>
                {adsShowForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                {adsShowForm ? 'Cancel' : 'Log Decision'}
              </Button>
            </div>
          </div>

          {/* Add Decision Form */}
          {adsShowForm && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Log ADS Decision</h3>
              <form onSubmit={handleAdsCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AI Tool Name *</label>
                    <input
                      type="text"
                      value={adsFormData.tool_name}
                      onChange={(e) => setAdsFormData(p => ({ ...p, tool_name: e.target.value }))}
                      placeholder="e.g., HireVue, Greenhouse"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Decision Type *</label>
                    <select
                      value={adsFormData.decision_type}
                      onChange={(e) => setAdsFormData(p => ({ ...p, decision_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="hire">Hire</option>
                      <option value="reject">Reject</option>
                      <option value="promote">Promote</option>
                      <option value="terminate">Terminate</option>
                      <option value="discipline">Discipline</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Decision Date *</label>
                    <input
                      type="date"
                      value={adsFormData.decision_date}
                      onChange={(e) => setAdsFormData(p => ({ ...p, decision_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affected Person</label>
                    <input
                      type="text"
                      value={adsFormData.affected_person}
                      onChange={(e) => setAdsFormData(p => ({ ...p, affected_person: e.target.value }))}
                      placeholder="Name of person affected"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Input Summary</label>
                    <input
                      type="text"
                      value={adsFormData.input_summary}
                      onChange={(e) => setAdsFormData(p => ({ ...p, input_summary: e.target.value }))}
                      placeholder="Data/inputs provided to the AI"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Output Decision</label>
                    <input
                      type="text"
                      value={adsFormData.output_decision}
                      onChange={(e) => setAdsFormData(p => ({ ...p, output_decision: e.target.value }))}
                      placeholder="What the AI recommended/decided"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Criteria Used</label>
                    <input
                      type="text"
                      value={adsFormData.criteria_used}
                      onChange={(e) => setAdsFormData(p => ({ ...p, criteria_used: e.target.value }))}
                      placeholder="Criteria or factors the AI evaluated"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bias Test Results</label>
                    <input
                      type="text"
                      value={adsFormData.bias_test_results}
                      onChange={(e) => setAdsFormData(p => ({ ...p, bias_test_results: e.target.value }))}
                      placeholder="Results of any bias testing"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <input
                      type="text"
                      value={adsFormData.notes}
                      onChange={(e) => setAdsFormData(p => ({ ...p, notes: e.target.value }))}
                      placeholder="Additional notes"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={adsSaving || !adsFormData.tool_name.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {adsSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Log Decision
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdsShowForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADS Records List */}
          {adsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : adsRecords.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {adsStats.total === 0 ? "No ADS decisions logged yet" : "No matching decisions"}
              </h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">
                {adsStats.total === 0
                  ? "Log AI-assisted employment decisions to meet CA FEHA 4-year retention requirements"
                  : "Try adjusting your filters or search."}
              </p>
              {adsStats.total === 0 && (
                <button
                  onClick={() => setAdsShowForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Log First Decision
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {adsRecords.map((record) => (
                <div key={record.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setAdsExpandedRecord(adsExpandedRecord === record.id ? null : record.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">{record.tool_name}</span>
                          {decisionTypeBadge(record.decision_type)}
                          {record.exported_at && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              Exported
                            </span>
                          )}
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                            Retain: {getRetentionRemaining(record.retention_expires)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {record.affected_person && `${record.affected_person} · `}
                          {new Date(record.decision_date).toLocaleDateString()}
                          {record.output_decision && ` · ${record.output_decision}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {adsExpandedRecord === record.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {adsExpandedRecord === record.id && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {record.input_summary && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input Summary</span>
                            <p className="text-gray-700 mt-0.5">{record.input_summary}</p>
                          </div>
                        )}
                        {record.output_decision && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output Decision</span>
                            <p className="text-gray-700 mt-0.5">{record.output_decision}</p>
                          </div>
                        )}
                        {record.criteria_used && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Criteria Used</span>
                            <p className="text-gray-700 mt-0.5">{record.criteria_used}</p>
                          </div>
                        )}
                        {record.bias_test_results && (
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bias Test Results</span>
                            <p className="text-gray-700 mt-0.5">{record.bias_test_results}</p>
                          </div>
                        )}
                        {record.notes && (
                          <div className="sm:col-span-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</span>
                            <p className="text-gray-700 mt-0.5">{record.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                        <span>Created: {new Date(record.created_at).toLocaleDateString()}</span>
                        <span>Retention expires: {new Date(record.retention_expires).toLocaleDateString()}</span>
                        {record.exported_at && <span>Exported: {new Date(record.exported_at).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-medium text-blue-900 mb-2">CA FEHA ADS Record Retention</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• California FEHA requires 4-year retention of all ADS employment decisions</li>
              <li>• Document inputs, outputs, criteria, and bias testing for each decision</li>
              <li>• Export records regularly for audit documentation</li>
              <li>• Records expiring within 90 days are flagged for attention</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
