import { Layers, Plus, Search, Filter, AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default function ToolRegistryPage() {
  // TODO: Fetch from org_tool_registry + tool_catalog
  const tools = {
    approved: [
      { name: "Greenhouse", category: "ATS", riskLevel: "medium", approvedAt: "2026-01-15", expiresAt: "2027-01-15", features: ["Candidate scoring", "Interview scheduling"] },
      { name: "LinkedIn Recruiter", category: "Sourcing", riskLevel: "high", approvedAt: "2026-01-15", expiresAt: "2027-01-15", features: ["AI candidate recommendations", "InMail suggestions"] },
    ],
    pending: [
      { name: "HireVue", category: "Video Interviewing", riskLevel: "high", requestedAt: "2026-02-16", requestedBy: "Sarah Chen" },
    ],
    denied: [
      { name: "Clearview AI", category: "Screening", riskLevel: "critical", deniedAt: "2026-02-01", reason: "Biometric data collection violates BIPA" },
    ]
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-blue-600" />
            Tool Registry
          </h1>
          <p className="text-gray-500 mt-1">Track, approve, and manage every tool in your hiring stack</p>
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
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{tools.approved.length}</div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{tools.pending.length}</div>
              <div className="text-sm text-gray-500">Pending Review</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{tools.denied.length}</div>
              <div className="text-sm text-gray-500">Denied</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Expiring Soon</div>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Pending Requests */}
      {tools.pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Pending Approval
          </h2>
          <div className="space-y-3">
            {tools.pending.map((tool) => (
              <div key={tool.name} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">{tool.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{tool.category}</span>
                    {riskBadge(tool.riskLevel)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Requested by {tool.requestedBy} on {tool.requestedAt}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/approvals`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Tools */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          Approved Tools
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Tool</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Risk</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">AI Features in Use</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Approved</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tools.approved.map((tool) => (
                <tr key={tool.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{tool.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{tool.category}</span>
                  </td>
                  <td className="px-4 py-3">{riskBadge(tool.riskLevel)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((f) => (
                        <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{f}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{tool.approvedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{tool.expiresAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Denied Tools */}
      {tools.denied.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Denied Tools
          </h2>
          <div className="space-y-3">
            {tools.denied.map((tool) => (
              <div key={tool.name} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{tool.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{tool.category}</span>
                  {riskBadge(tool.riskLevel)}
                </div>
                <p className="text-sm text-red-600 mt-1">Denied on {tool.deniedAt}: {tool.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
