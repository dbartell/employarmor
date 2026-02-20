import { Suspense } from "react"
import { getComplianceDocuments } from "@/lib/actions/compliance-documents"
import { DocumentsTable } from "./documents-table"
import { AddDocumentDialog } from "./add-document-dialog"
import { FileText, Shield, Calendar, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Compliance Documents | EmployArmor",
  description: "Manage your compliance documents and renewal reminders",
}

function DocumentStats({ documents }: { documents: Array<{ status: string; expires_at: string }> }) {
  const now = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(now.getDate() + 30)

  const stats = {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    expiringSoon: documents.filter(d => {
      const expires = new Date(d.expires_at)
      return d.status !== 'renewed' && expires > now && expires <= thirtyDaysFromNow
    }).length,
    expired: documents.filter(d => d.status === 'expired').length,
  }

  return (
    <div className="grid sm:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function DocumentsContent() {
  const { documents, error } = await getComplianceDocuments()

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Failed to load documents: {error}
      </div>
    )
  }

  return (
    <>
      <DocumentStats documents={documents} />
      <DocumentsTable documents={documents} />
    </>
  )
}

export default function ComplianceDocumentsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Documents</h1>
          <p className="text-gray-600">
            Track your compliance documents and get automatic renewal reminders
          </p>
        </div>
        <AddDocumentDialog />
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Automatic Renewal Reminders</h3>
            <p className="text-sm text-blue-700 mt-1">
              We'll send you email reminders at 90, 60, 30, and 7 days before your documents expire.
              You'll also be notified when documents become expired.
            </p>
          </div>
        </div>
      </div>

      {/* Documents Content */}
      <Suspense fallback={
        <div className="animate-pulse space-y-4">
          <div className="grid sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      }>
        <DocumentsContent />
      </Suspense>
    </div>
  )
}
