'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wrench, Plus, CheckCircle2, Clock, XCircle, X, Send, AlertCircle } from 'lucide-react'
import { getEmployeeToolRequests, createToolRequest } from '@/lib/actions/portal-tool-requests'

interface ToolRequest {
  id: string
  tool_name: string
  tool_url: string | null
  use_case: string
  data_types: string[]
  status: string
  review_notes: string | null
  reviewed_at: string | null
  created_at: string
}

const DATA_TYPE_OPTIONS = [
  'Candidate data',
  'Employee data',
  'Salary / compensation data',
  'Performance data',
  'Health / medical data',
  'Background check data',
  'Biometric data',
  'Social media data',
]

export default function PortalToolsPage() {
  const [requests, setRequests] = useState<ToolRequest[]>([])
  const [employeeId, setEmployeeId] = useState('')
  const [organizationId, setOrganizationId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [toolName, setToolName] = useState('')
  const [toolUrl, setToolUrl] = useState('')
  const [useCase, setUseCase] = useState('')
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([])

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    const result = await getEmployeeToolRequests()
    setRequests(result.requests || [])
    setEmployeeId(result.employeeId || '')
    setOrganizationId(result.organizationId || '')
    setLoading(false)
  }

  function toggleDataType(dt: string) {
    setSelectedDataTypes(prev =>
      prev.includes(dt) ? prev.filter(d => d !== dt) : [...prev, dt]
    )
  }

  async function handleSubmit() {
    if (!toolName.trim() || !useCase.trim()) return
    setSubmitting(true)

    const result = await createToolRequest({
      toolName: toolName.trim(),
      toolUrl: toolUrl.trim() || undefined,
      useCase: useCase.trim(),
      dataTypes: selectedDataTypes,
      employeeId,
      organizationId,
    })

    if (result.success) {
      setShowForm(false)
      setToolName('')
      setToolUrl('')
      setUseCase('')
      setSelectedDataTypes([])
      await loadRequests()
    }
    setSubmitting(false)
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3" /> Approved</span>
      case 'denied':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Denied</span>
      case 'revoked':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><XCircle className="w-3 h-3" /> Revoked</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3" /> Pending Review</span>
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-3 mt-8">
            {[1, 2].map(i => <div key={i} className="h-32 bg-gray-200 rounded" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Tool Requests</h1>
          </div>
          <p className="text-gray-600">Request access to AI tools and track approval status</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-1" /> Request Tool
        </Button>
      </div>

      {/* Empty State */}
      {requests.length === 0 && !showForm && (
        <Card className="p-12 text-center bg-gray-50 border-dashed">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tool requests yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Need to use an AI tool for work? Submit a request and your compliance team will review it.
          </p>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" /> Request Your First Tool
          </Button>
        </Card>
      )}

      {/* Request Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Request AI Tool Access</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <Label htmlFor="toolName">Tool Name *</Label>
                <Input
                  id="toolName"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g., ChatGPT, Copilot, Jasper"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="toolUrl">Tool URL (optional)</Label>
                <Input
                  id="toolUrl"
                  value={toolUrl}
                  onChange={(e) => setToolUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="useCase">Business Justification *</Label>
                <textarea
                  id="useCase"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="Describe how you plan to use this tool and why it is needed for your role..."
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label>Data Types Involved</Label>
                <p className="text-xs text-gray-500 mb-2">Select all types of data this tool will process</p>
                <div className="grid grid-cols-2 gap-2">
                  {DATA_TYPE_OPTIONS.map(dt => (
                    <label
                      key={dt}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                        selectedDataTypes.includes(dt)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDataTypes.includes(dt)}
                        onChange={() => toggleDataType(dt)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedDataTypes.includes(dt) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {selectedDataTypes.includes(dt) && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      {dt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    All AI tool requests are reviewed by your compliance team. You will be notified when your request is approved or denied. Do not use the tool until approval is granted.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={!toolName.trim() || !useCase.trim() || submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-1" />
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request List */}
      {requests.length > 0 && (
        <div className="space-y-4">
          {requests.map(req => (
            <Card key={req.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{req.tool_name}</h3>
                  {req.tool_url && (
                    <a href={req.tool_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {req.tool_url}
                    </a>
                  )}
                </div>
                {getStatusBadge(req.status)}
              </div>

              <p className="text-gray-600 text-sm mb-3">{req.use_case}</p>

              {req.data_types && req.data_types.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {req.data_types.map(dt => (
                    <span key={dt} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{dt}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Requested {new Date(req.created_at).toLocaleDateString()}</span>
                {req.reviewed_at && (
                  <span>Reviewed {new Date(req.reviewed_at).toLocaleDateString()}</span>
                )}
              </div>

              {req.review_notes && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  req.status === 'approved' ? 'bg-green-50 text-green-800' :
                  req.status === 'denied' ? 'bg-red-50 text-red-800' :
                  'bg-gray-50 text-gray-700'
                }`}>
                  <span className="font-medium">Reviewer notes:</span> {req.review_notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
