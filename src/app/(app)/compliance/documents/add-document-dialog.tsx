"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X, Upload, Loader2 } from "lucide-react"
import { createComplianceDocument, type CreateDocumentInput } from "@/lib/actions/compliance-documents"
import { DOCUMENT_TYPE_LABELS, DOCUMENT_VALIDITY_YEARS } from "@/types"
import type { ComplianceDocument } from "@/types"

const JURISDICTIONS = [
  { value: 'all', label: 'All / General' },
  { value: 'nyc', label: 'NYC (Local Law 144)' },
  { value: 'colorado', label: 'Colorado' },
  { value: 'illinois', label: 'Illinois' },
  { value: 'california', label: 'California' },
  { value: 'maryland', label: 'Maryland' },
]

export function AddDocumentDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateDocumentInput>({
    document_type: 'bias_audit',
    title: '',
    description: '',
    jurisdiction: 'all',
    issued_at: new Date().toISOString().split('T')[0],
  })

  // Calculate expiry preview
  const expiryDate = (() => {
    const issued = new Date(formData.issued_at)
    const years = DOCUMENT_VALIDITY_YEARS[formData.document_type] || 1
    issued.setFullYear(issued.getFullYear() + years)
    return issued.toLocaleDateString()
  })()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { document, error } = await createComplianceDocument(formData)

    if (error) {
      setError(error)
      setIsSubmitting(false)
      return
    }

    // Reset and close
    setFormData({
      document_type: 'bias_audit',
      title: '',
      description: '',
      jurisdiction: 'all',
      issued_at: new Date().toISOString().split('T')[0],
    })
    setIsSubmitting(false)
    setIsOpen(false)
  }

  // Auto-generate title based on type and jurisdiction
  function handleTypeChange(type: ComplianceDocument['document_type']) {
    const typeName = DOCUMENT_TYPE_LABELS[type]
    const year = new Date(formData.issued_at).getFullYear()
    const jurisdictionLabel = JURISDICTIONS.find(j => j.value === formData.jurisdiction)?.label || ''
    
    setFormData(prev => ({
      ...prev,
      document_type: type,
      title: `${typeName} - ${jurisdictionLabel.split(' ')[0]} ${year}`,
    }))
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Document
      </Button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Add Compliance Document</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={formData.document_type}
                onChange={(e) => handleTypeChange(e.target.value as ComplianceDocument['document_type'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Valid for {DOCUMENT_VALIDITY_YEARS[formData.document_type] || 1} year(s)
              </p>
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jurisdiction
              </label>
              <select
                value={formData.jurisdiction}
                onChange={(e) => setFormData(prev => ({ ...prev, jurisdiction: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {JURISDICTIONS.map((j) => (
                  <option key={j.value} value={j.value}>{j.label}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Bias Audit - NYC 2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={formData.issued_at}
                onChange={(e) => setFormData(prev => ({ ...prev, issued_at: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Expiry date will be auto-calculated: <strong>{expiryDate}</strong>
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add any notes about this document..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* File Upload Placeholder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document File (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  File upload coming soon
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You can add the file URL manually after creating
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Document
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
