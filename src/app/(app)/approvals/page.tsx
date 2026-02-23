'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckSquare, Clock, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ToolRequest {
  id: string
  tool_name: string
  tool_url: string | null
  use_case: string
  data_types: string[] | null
  status: string
  review_notes: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
  employee: {
    full_name: string
    email: string
  } | null
  reviewer: {
    full_name: string
  } | null
}

export default function ApprovalsPage() {
  const [pending, setPending] = useState<ToolRequest[]>([])
  const [history, setHistory] = useState<ToolRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchRequests = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Pending requests
    const { data: pendingData } = await supabase
      .from('tool_requests')
      .select(`
        *,
        employee:employee_id(full_name, email),
        reviewer:reviewed_by(full_name)
      `)
      .eq('organization_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    // Decision history (approved/denied)
    const { data: historyData } = await supabase
      .from('tool_requests')
      .select(`
        *,
        employee:employee_id(full_name, email),
        reviewer:reviewed_by(full_name)
      `)
      .eq('organization_id', user.id)
      .neq('status', 'pending')
      .order('reviewed_at', { ascending: false })
      .limit(20)

    setPending(pendingData || [])
    setHistory(historyData || [])
    setLoading(false)
  }

  useEffect(() => { fetchRequests() }, [])

  const handleDecision = async (requestId: string, decision: 'approved' | 'denied') => {
    setActing(requestId)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get admin's employee profile
    const { data: profile } = await supabase
      .from('employee_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const { error } = await supabase
      .from('tool_requests')
      .update({
        status: decision,
        reviewed_by: profile?.id || null,
        reviewed_at: new Date().toISOString(),
        review_notes: reviewNotes[requestId] || null,
      })
      .eq('id', requestId)

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update request' })
    } else {
      setMessage({ type: 'success', text: `Tool request ${decision}` })
      fetchRequests()
    }
    setActing(null)
    setTimeout(() => setMessage(null), 3000)
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString()

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Approvals</h1>
        <p className="text-lg text-gray-600">Review and approve employee tool requests and access changes</p>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Pending Requests */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-500" />
          Pending Requests
          {pending.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </h2>

        {pending.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending approvals</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Tool requests from employees will appear here for review. Employees can submit requests from their portal.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{request.tool_name}</h3>
                        {request.tool_url && (
                          <a href={request.tool_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            {request.tool_url}
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Requested by <span className="font-medium">{request.employee?.full_name || 'Unknown'}</span>
                        {request.employee?.email && <span className="text-gray-400"> ({request.employee.email})</span>}
                        {' '}on {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Use Case</h4>
                  <p className="text-sm text-gray-700">{request.use_case}</p>
                </div>

                {request.data_types && request.data_types.length > 0 && (
                  <div className="px-5 py-3 border-b border-gray-100">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Data Types Involved</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {request.data_types.map((dt, i) => (
                        <span key={i} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                          {dt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="px-5 py-3 border-b border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Review Notes (optional)</label>
                  <textarea
                    value={reviewNotes[request.id] || ''}
                    onChange={(e) => setReviewNotes({ ...reviewNotes, [request.id]: e.target.value })}
                    placeholder="Add conditions or reason for denial..."
                    rows={2}
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="px-5 py-4 flex items-center gap-3">
                  <Button
                    onClick={() => handleDecision(request.id, 'approved')}
                    disabled={acting === request.id}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDecision(request.id, 'denied')}
                    disabled={acting === request.id}
                    className="text-red-700 border-red-200 hover:bg-red-50 gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Deny
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decision History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Decision History</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Tool</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Requested By</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Decision</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Reviewed By</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((decision) => (
                  <tr key={decision.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{decision.tool_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{decision.employee?.full_name || '—'}</td>
                    <td className="px-4 py-3">
                      {decision.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : decision.status === 'denied' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Denied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                          {decision.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{decision.reviewer?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{decision.reviewed_at ? formatDate(decision.reviewed_at) : '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{decision.review_notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
