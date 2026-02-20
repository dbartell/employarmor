import { CheckSquare, Clock, CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react"

export default function ApprovalsPage() {
  // TODO: Fetch from org_tool_registry WHERE status = 'pending_review' + tool_audit_log
  const pendingRequests = [
    {
      id: "1",
      toolName: "HireVue",
      category: "Video Interviewing",
      requestedBy: "Sarah Chen",
      requestedAt: "2026-02-16",
      businessJustification: "Need AI video interview capability for remote candidates. Currently doing all interviews live which doesn't scale.",
      riskLevel: "high",
      aiAssessment: {
        summary: "HireVue uses AI to analyze video interviews including facial expressions, word choice, and tone. This triggers disclosure requirements under Illinois HB 3773 and may require bias auditing under NYC LL144.",
        requirements: [
          "Illinois: Must notify candidates before AI analysis (HB 3773)",
          "Illinois: Must explain what characteristics AI evaluates (AIVIA)",
          "Illinois: Must obtain prior written consent (AIVIA)",
          "NYC: Annual bias audit required if used for NYC candidates (LL144)",
        ],
        recommendation: "Approve with conditions — require disclosure setup before first use"
      }
    },
  ]

  const recentDecisions = [
    { toolName: "Greenhouse", action: "approved", actor: "Devyn B.", date: "2026-01-15", conditions: "Candidate scoring feature requires IL disclosure" },
    { toolName: "LinkedIn Recruiter", action: "approved", actor: "Devyn B.", date: "2026-01-15", conditions: null },
    { toolName: "Clearview AI", action: "denied", actor: "Devyn B.", date: "2026-02-01", reason: "Biometric data collection violates BIPA" },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare className="w-7 h-7 text-blue-600" />
          Approvals
        </h1>
        <p className="text-gray-500 mt-1">Review tool requests and manage your approval workflow</p>
      </div>

      {/* Pending Requests */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          Pending Requests
          {pendingRequests.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </h2>

        {pendingRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-500">No pending requests. All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Request Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{request.toolName}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{request.category}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-orange-100 text-orange-700 border-orange-200">
                          {request.riskLevel.charAt(0).toUpperCase() + request.riskLevel.slice(1)} Risk
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Requested by <span className="font-medium">{request.requestedBy}</span> on {request.requestedAt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Justification */}
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Business Justification</h4>
                  <p className="text-sm text-gray-700">{request.businessJustification}</p>
                </div>

                {/* AI Risk Assessment */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    AI Compliance Assessment
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">{request.aiAssessment.summary}</p>
                  <div className="space-y-1.5">
                    {request.aiAssessment.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 mt-0.5">⚠️</span>
                        <span className="text-gray-600">{req}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      💡 Recommendation: {request.aiAssessment.recommendation}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-5 py-4 flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors border border-green-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Approve with Conditions
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors border border-red-200">
                    <XCircle className="w-4 h-4" />
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Trail / Recent Decisions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Decision History</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Tool</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Decision</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Decided By</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentDecisions.map((decision, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{decision.toolName}</td>
                  <td className="px-4 py-3">
                    {decision.action === "approved" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Denied
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{decision.actor}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{decision.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {decision.conditions || decision.reason || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
