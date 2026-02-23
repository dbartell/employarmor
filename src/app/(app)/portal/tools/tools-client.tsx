"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Wrench, Plus, CheckCircle2, Clock, XCircle, ExternalLink, Loader2 } from "lucide-react"
import { createToolRequest, DATA_TYPE_OPTIONS, type ToolRequest } from "@/lib/actions/portal-tool-requests"

interface ToolsClientProps {
  requests: ToolRequest[]
  employeeId: string
  organizationId: string
}

export default function ToolsClient({ requests: initialRequests, employeeId, organizationId }: ToolsClientProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    tool_name: "",
    tool_url: "",
    use_case: "",
    data_types: [] as string[]
  })

  const pending = requests.filter(r => r.status === 'pending')
  const approved = requests.filter(r => r.status === 'approved')
  const denied = requests.filter(r => r.status === 'denied')

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
    setFormData({
      tool_name: "",
      tool_url: "",
      use_case: "",
      data_types: []
    })
    setError(null)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setError(null)
  }

  const handleDataTypeToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      data_types: prev.data_types.includes(value)
        ? prev.data_types.filter(v => v !== value)
        : [...prev.data_types, value]
    }))
  }

  const handleSubmit = async () => {
    if (!formData.tool_name.trim() || !formData.use_case.trim() || formData.data_types.length === 0) {
      setError("Please fill in all required fields and select at least one data type.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    const result = await createToolRequest(employeeId, organizationId, {
      tool_name: formData.tool_name.trim(),
      tool_url: formData.tool_url.trim() || null,
      use_case: formData.use_case.trim(),
      data_types: formData.data_types
    })

    if (result.error) {
      setError(result.error)
    } else if (result.request) {
      setRequests([result.request, ...requests])
      handleCloseDialog()
    }

    setIsSubmitting(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>
      case 'denied':
        return <Badge variant="denied">Denied</Badge>
      case 'revoked':
        return <Badge variant="destructive">Revoked</Badge>
      default:
        return <Badge variant="pending">Pending Review</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case 'denied':
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return <Clock className="w-6 h-6 text-blue-600" />
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Tool Requests</h1>
          </div>
          <Button 
            onClick={handleOpenDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request New Tool
          </Button>
        </div>
        <p className="text-gray-600">Request access to AI tools and track approval status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="text-2xl font-bold text-gray-900">{pending.length}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="text-2xl font-bold text-gray-900">{approved.length}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="text-2xl font-bold text-gray-900">{denied.length}</div>
          <div className="text-sm text-gray-600">Denied</div>
        </Card>
      </div>

      {/* Requests List */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card 
              key={request.id}
              className={`p-6 ${
                request.status === 'approved' ? 'border-green-200 bg-green-50' :
                request.status === 'denied' ? 'border-red-200 bg-red-50' :
                'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.tool_name}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>

                  {request.tool_url && (
                    <a 
                      href={request.tool_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2"
                    >
                      {request.tool_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Use Case:</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.use_case}</p>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Data Types:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.data_types.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {DATA_TYPE_OPTIONS.find(opt => opt.value === type)?.label || type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Submitted {new Date(request.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    {request.reviewed_at && (
                      <p>
                        Reviewed {new Date(request.reviewed_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  {request.review_notes && (
                    <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Review Notes:</h4>
                      <p className="text-sm text-gray-700">{request.review_notes}</p>
                    </div>
                  )}
                </div>

                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  request.status === 'approved' ? 'bg-green-100' :
                  request.status === 'denied' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {getStatusIcon(request.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tool Requests</h3>
          <p className="text-gray-600 mb-6">
            You haven't submitted any tool requests yet.
          </p>
          <Button 
            onClick={handleOpenDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request Your First Tool
          </Button>
        </Card>
      )}

      {/* Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request New AI Tool</DialogTitle>
            <DialogDescription>
              Submit a request to use a new AI tool. Include details about the tool and how you plan to use it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Tool Name */}
            <div>
              <Label htmlFor="tool_name" className="mb-2 block">
                Tool Name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="tool_name"
                type="text"
                placeholder="e.g., ChatGPT, Claude, Midjourney"
                value={formData.tool_name}
                onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
              />
            </div>

            {/* Tool URL */}
            <div>
              <Label htmlFor="tool_url" className="mb-2 block">
                Tool URL (Optional)
              </Label>
              <Input
                id="tool_url"
                type="url"
                placeholder="https://example.com"
                value={formData.tool_url}
                onChange={(e) => setFormData({ ...formData, tool_url: e.target.value })}
              />
            </div>

            {/* Use Case */}
            <div>
              <Label htmlFor="use_case" className="mb-2 block">
                Business Justification / Use Case <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="use_case"
                placeholder="Describe how you plan to use this tool and why it's needed for your work..."
                value={formData.use_case}
                onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                rows={4}
              />
            </div>

            {/* Data Types */}
            <div>
              <Label className="mb-3 block">
                What types of data will you process with this tool? <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-lg">
                {DATA_TYPE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-start gap-3">
                    <Checkbox
                      id={option.value}
                      checked={formData.data_types.includes(option.value)}
                      onCheckedChange={() => handleDataTypeToggle(option.value)}
                    />
                    <Label
                      htmlFor={option.value}
                      className="cursor-pointer text-sm"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
