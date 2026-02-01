"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText, ExternalLink, MoreVertical, RefreshCw, Trash2, 
  CheckCircle, Clock, AlertTriangle, XCircle 
} from "lucide-react"
import type { ComplianceDocument } from "@/types"
import { DOCUMENT_TYPE_LABELS } from "@/types"
import { deleteComplianceDocument, renewComplianceDocument } from "@/lib/actions/compliance-documents"

interface DocumentsTableProps {
  documents: ComplianceDocument[]
}

function getStatusBadge(status: string, expiresAt: string) {
  const now = new Date()
  const expires = new Date(expiresAt)
  const daysRemaining = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (status === 'renewed') {
    return {
      label: 'Renewed',
      color: 'bg-gray-100 text-gray-600',
      icon: CheckCircle,
    }
  }

  if (status === 'expired' || daysRemaining < 0) {
    return {
      label: `Expired ${Math.abs(daysRemaining)}d ago`,
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
    }
  }

  if (daysRemaining <= 7) {
    return {
      label: `${daysRemaining}d remaining`,
      color: 'bg-red-100 text-red-700',
      icon: AlertTriangle,
    }
  }

  if (daysRemaining <= 30) {
    return {
      label: `${daysRemaining}d remaining`,
      color: 'bg-orange-100 text-orange-700',
      icon: Clock,
    }
  }

  if (daysRemaining <= 60) {
    return {
      label: `${daysRemaining}d remaining`,
      color: 'bg-yellow-100 text-yellow-700',
      icon: Clock,
    }
  }

  return {
    label: `${daysRemaining}d remaining`,
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  }
}

function DocumentRow({ document }: { document: ComplianceDocument }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRenewing, setIsRenewing] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const status = getStatusBadge(document.status, document.expires_at)
  const StatusIcon = status.icon
  const isExpired = document.status === 'expired' || new Date(document.expires_at) < new Date()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this document?')) return
    setIsDeleting(true)
    await deleteComplianceDocument(document.id)
    setIsDeleting(false)
  }

  async function handleRenew() {
    const today = new Date().toISOString().split('T')[0]
    setIsRenewing(true)
    await renewComplianceDocument(document.id, today)
    setIsRenewing(false)
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{document.title}</div>
            <div className="text-sm text-gray-500">
              {DOCUMENT_TYPE_LABELS[document.document_type] || document.document_type}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-gray-600">
          {document.jurisdiction?.toUpperCase() || 'All'}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-gray-600">
          {new Date(document.issued_at).toLocaleDateString()}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-gray-600">
          {new Date(document.expires_at).toLocaleDateString()}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                {document.file_url && (
                  <a
                    href={document.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Document
                  </a>
                )}
                {(isExpired || document.status !== 'renewed') && (
                  <button
                    onClick={handleRenew}
                    disabled={isRenewing}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRenewing ? 'animate-spin' : ''}`} />
                    {isRenewing ? 'Renewing...' : 'Renew Document'}
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-600 mb-4">
            Add your compliance documents to track expiration dates and receive automatic renewal reminders.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Sort: expired first, then by days remaining
  const sortedDocuments = [...documents].sort((a, b) => {
    if (a.status === 'renewed' && b.status !== 'renewed') return 1
    if (a.status !== 'renewed' && b.status === 'renewed') return -1
    return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Document</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Jurisdiction</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Issued</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Expires</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {sortedDocuments.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
