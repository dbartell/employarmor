"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Upload, Search, Download, Plus, CheckCircle, Clock, AlertTriangle, 
  Trash2, Loader2, X, Edit2, TrendingUp, Calendar, Link2, Copy, Eye,
  ExternalLink, Code, ToggleLeft, ToggleRight
} from "lucide-react"
import { 
  getConsentRecords, createConsentRecord, updateConsentRecord, 
  deleteConsentRecord, bulkImportConsent, getConsentStats, ConsentRecord 
} from "@/lib/actions/consent"
import { ApplicabilityBanner } from '@/components/compliance/applicability-banner'

interface ConsentStats {
  total: number
  consented: number
  pending: number
  declined: number
  last30Days?: {
    total: number
    consented: number
    pending: number
  }
}

interface ConsentLink {
  id: string
  token: string
  name: string
  position?: string
  is_active: boolean
  expires_at?: string
  created_at: string
  views_count: number
  submissions_count: number
}

// Extended record type to include source
interface ExtendedConsentRecord extends ConsentRecord {
  source?: 'manual' | 'link'
  consent_link_id?: string
}

export default function ConsentPage() {
  const [activeTab, setActiveTab] = useState<'records' | 'links'>('records')
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [records, setRecords] = useState<ExtendedConsentRecord[]>([])
  const [stats, setStats] = useState<ConsentStats>({ total: 0, consented: 0, pending: 0, declined: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ConsentRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Consent Links state
  const [links, setLinks] = useState<ConsentLink[]>([])
  const [linksLoading, setLinksLoading] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [creatingLink, setCreatingLink] = useState(false)
  const [linkFormData, setLinkFormData] = useState({
    name: '',
    position: '',
    expires_in_days: ''
  })
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
  const [showEmbedCode, setShowEmbedCode] = useState<string | null>(null)

  // Quick add form state (simplified)
  const [quickName, setQuickName] = useState('')
  const [quickEmail, setQuickEmail] = useState('')
  const [quickAdding, setQuickAdding] = useState(false)

  // Full form state
  const [formData, setFormData] = useState({
    candidate_name: '',
    candidate_email: '',
    position: '',
    disclosure_date: new Date().toISOString().split('T')[0],
    consent_date: '',
    status: 'pending' as 'pending' | 'consented' | 'declined'
  })

  useEffect(() => {
    loadData()
    loadLinks()
  }, [statusFilter, searchQuery])

  const loadData = async () => {
    setLoading(true)
    const [recordsData, statsData] = await Promise.all([
      getConsentRecords({ status: statusFilter, search: searchQuery }),
      getConsentStats()
    ])
    setRecords(recordsData as ExtendedConsentRecord[])
    setStats(statsData)
    setLoading(false)
  }

  const loadLinks = async () => {
    setLinksLoading(true)
    try {
      const res = await fetch('/api/consent/link')
      if (res.ok) {
        const data = await res.json()
        setLinks(data.links || [])
      }
    } catch (err) {
      console.error('Failed to load consent links:', err)
    }
    setLinksLoading(false)
  }

  // Quick add handler
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickName.trim() || !quickEmail.trim()) return

    setQuickAdding(true)
    await createConsentRecord({
      candidate_name: quickName.trim(),
      candidate_email: quickEmail.trim(),
      position: '',
      disclosure_date: new Date().toISOString().split('T')[0],
      consent_date: null,
      status: 'pending'
    })
    await loadData()
    setQuickName('')
    setQuickEmail('')
    setQuickAdding(false)
  }

  const resetForm = () => {
    setFormData({
      candidate_name: '',
      candidate_email: '',
      position: '',
      disclosure_date: new Date().toISOString().split('T')[0],
      consent_date: '',
      status: 'pending'
    })
    setEditingRecord(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (editingRecord) {
      await updateConsentRecord(editingRecord.id, {
        ...formData,
        consent_date: formData.consent_date || null,
      })
    } else {
      await createConsentRecord({
        ...formData,
        consent_date: formData.consent_date || null,
      })
    }

    await loadData()
    resetForm()
    setSaving(false)
  }

  const handleEdit = (record: ConsentRecord) => {
    setEditingRecord(record)
    setFormData({
      candidate_name: record.candidate_name,
      candidate_email: record.candidate_email,
      position: record.position || '',
      disclosure_date: record.disclosure_date,
      consent_date: record.consent_date || '',
      status: record.status as 'pending' | 'consented' | 'declined'
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    
    setDeleting(id)
    await deleteConsentRecord(id)
    await loadData()
    setDeleting(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const importRecords = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const record: Record<string, string> = {}
        headers.forEach((h, i) => {
          record[h] = values[i] || ''
        })
        return {
          candidate_name: record['name'] || record['candidate_name'] || '',
          candidate_email: record['email'] || record['candidate_email'] || '',
          position: record['position'] || '',
          disclosure_date: record['disclosure_date'] || new Date().toISOString().split('T')[0],
          consent_date: record['consent_date'] || '',
          status: (record['status'] || 'pending') as string
        }
      }).filter(r => r.candidate_email && r.candidate_name)

      if (importRecords.length > 0) {
        const result = await bulkImportConsent(importRecords)
        if (result.error) {
          alert(`Import error: ${result.error}`)
        } else {
          alert(`Successfully imported ${result.count} records`)
          await loadData()
        }
      } else {
        alert('No valid records found in CSV')
      }
    } catch {
      alert('Error parsing CSV file')
    }

    setImporting(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Position', 'Disclosure Date', 'Consent Date', 'Status', 'Source']
    const rows = records.map(r => [
      r.candidate_name,
      r.candidate_email,
      r.position || '',
      r.disclosure_date,
      r.consent_date || '',
      r.status,
      r.source || 'manual'
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consent-records-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Create consent link
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkFormData.name.trim()) return

    setCreatingLink(true)
    try {
      const res = await fetch('/api/consent/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: linkFormData.name.trim(),
          position: linkFormData.position.trim() || undefined,
          expires_in_days: linkFormData.expires_in_days ? parseInt(linkFormData.expires_in_days) : undefined,
        }),
      })

      if (res.ok) {
        setLinkFormData({ name: '', position: '', expires_in_days: '' })
        setShowLinkForm(false)
        await loadLinks()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create link')
      }
    } catch {
      alert('Failed to create link')
    }
    setCreatingLink(false)
  }

  // Delete/deactivate link
  const handleDeleteLink = async (linkId: string, deactivate: boolean = false) => {
    const action = deactivate ? 'deactivate' : 'delete'
    if (!confirm(`Are you sure you want to ${action} this link?`)) return

    try {
      const res = await fetch('/api/consent/link', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, deactivate }),
      })

      if (res.ok) {
        await loadLinks()
      }
    } catch {
      alert(`Failed to ${action} link`)
    }
  }

  // Copy link to clipboard
  const copyLink = async (token: string, linkId: string) => {
    const url = `${window.location.origin}/consent/${token}`
    await navigator.clipboard.writeText(url)
    setCopiedLinkId(linkId)
    setTimeout(() => setCopiedLinkId(null), 2000)
  }

  // Get embed code
  const getEmbedCode = (token: string) => {
    const url = `${window.location.origin}/consent/${token}`
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-family: sans-serif;">Review AI Disclosure</a>`
  }

  // Calculate 30-day stats
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentRecords = records.filter(r => new Date(r.disclosure_date) >= thirtyDaysAgo)
  const last30Stats = {
    total: recentRecords.length,
    consented: recentRecords.filter(r => r.status === 'consented').length,
    pending: recentRecords.filter(r => r.status === 'pending').length
  }

  // Count records from links
  const linkRecordsCount = records.filter(r => r.source === 'link').length

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <ApplicabilityBanner sectionHref="/consent" />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consent Tracking</h1>
        <p className="text-gray-600 mt-1">Record candidate disclosures and consent</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'records'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Records ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'links'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Link2 className="w-4 h-4" />
          Consent Links ({links.length})
        </button>
      </div>

      {activeTab === 'records' ? (
        <>
          {/* Quick Add */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Candidate name"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button type="submit" disabled={quickAdding || !quickName.trim() || !quickEmail.trim()}>
                  {quickAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </form>
              <p className="text-xs text-blue-600 mt-2">
                Quick add: Creates a record with today&apos;s date and &quot;pending&quot; status
              </p>
            </CardContent>
          </Card>

          {/* 30-Day Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Last 30 Days</p>
                    <p className="text-2xl font-bold">{last30Stats.total}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-gray-200" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Consented</p>
                    <p className="text-2xl font-bold text-green-600">{last30Stats.consented}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-100" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{last30Stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-100" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">All Time</p>
                    <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-100" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Via Links</p>
                    <p className="text-2xl font-bold text-blue-600">{linkRecordsCount}</p>
                  </div>
                  <Link2 className="w-8 h-8 text-blue-100" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add/Edit Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingRecord ? 'Edit Record' : 'Add Consent Record'}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Candidate Name *</label>
                      <input
                        type="text"
                        value={formData.candidate_name}
                        onChange={e => setFormData({ ...formData, candidate_name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        value={formData.candidate_email}
                        onChange={e => setFormData({ ...formData, candidate_email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Position</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Disclosure Date *</label>
                        <input
                          type="date"
                          value={formData.disclosure_date}
                          onChange={e => setFormData({ ...formData, disclosure_date: e.target.value })}
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Consent Date</label>
                        <input
                          type="date"
                          value={formData.consent_date}
                          onChange={e => setFormData({ ...formData, consent_date: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as 'pending' | 'consented' | 'declined' })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="consented">Consented</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving} className="flex-1">
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : editingRecord ? 'Update' : 'Add Record'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Records */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Records</CardTitle>
                  <CardDescription>Candidate disclosure and consent log</CardDescription>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importing}
                  >
                    {importing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-1" />
                        Import
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToCsv} disabled={records.length === 0}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Full Form
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="consented">Consented</option>
                  <option value="pending">Pending</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Table */}
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No records match your filters'
                    : 'No records yet. Use the quick add form above.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {records.slice(0, 10).map(record => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          record.status === 'consented' ? 'bg-green-100' :
                          record.status === 'pending' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          {record.status === 'consented' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {record.status === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                          {record.status === 'declined' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {record.candidate_name}
                            {record.source === 'link' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                <Link2 className="w-3 h-3" />
                                link
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{record.candidate_email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(record.disclosure_date).toLocaleDateString()}
                          </div>
                          {record.position && (
                            <div className="text-xs text-gray-400">{record.position}</div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                            disabled={deleting === record.id}
                          >
                            {deleting === record.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {records.length > 10 && (
                    <p className="text-center text-sm text-gray-500 py-2">
                      Showing 10 of {records.length} records. Use search or filters to find more.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Import Help */}
          <Card className="mt-6 bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">Bulk Import from CSV</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Import consent records from your ATS. Required columns: name, email. 
                    Optional: position, disclosure_date, consent_date, status.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      const csv = 'name,email,position,disclosure_date,consent_date,status\nJohn Doe,john@example.com,Software Engineer,2026-01-15,2026-01-16,consented'
                      const blob = new Blob([csv], { type: 'text/csv' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'consent-template.csv'
                      a.click()
                    }}
                  >
                    Download CSV Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Consent Links Tab */
        <>
          {/* Create Link Button */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Shareable Consent Links</h2>
              <p className="text-sm text-gray-600">Create links to collect candidate acknowledgments automatically</p>
            </div>
            <Button onClick={() => setShowLinkForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Link
            </Button>
          </div>

          {/* Create Link Modal */}
          {showLinkForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generate Consent Link</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowLinkForm(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Create a shareable link that candidates can use to acknowledge your AI disclosure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateLink} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Link Name *</label>
                      <input
                        type="text"
                        value={linkFormData.name}
                        onChange={e => setLinkFormData({ ...linkFormData, name: e.target.value })}
                        required
                        placeholder="e.g., Engineering Q1 Hiring"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">For your reference only, not shown to candidates</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Position (Optional)</label>
                      <input
                        type="text"
                        value={linkFormData.position}
                        onChange={e => setLinkFormData({ ...linkFormData, position: e.target.value })}
                        placeholder="e.g., Software Engineer"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">If set, will be shown to candidates and saved with their record</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expires In (Optional)</label>
                      <select
                        value={linkFormData.expires_in_days}
                        onChange={e => setLinkFormData({ ...linkFormData, expires_in_days: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Never expires</option>
                        <option value="7">7 days</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowLinkForm(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={creatingLink || !linkFormData.name.trim()} className="flex-1">
                        {creatingLink ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Link'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Links List */}
          {linksLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            </div>
          ) : links.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No consent links yet</h3>
                <p className="text-gray-500 mb-4">
                  Generate a shareable link to collect candidate acknowledgments automatically
                </p>
                <Button onClick={() => setShowLinkForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Your First Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {links.map(link => (
                <Card key={link.id} className={!link.is_active ? 'opacity-60' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{link.name}</h3>
                          {link.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              <ToggleRight className="w-3 h-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              <ToggleLeft className="w-3 h-3" />
                              Inactive
                            </span>
                          )}
                        </div>
                        {link.position && (
                          <p className="text-sm text-gray-600 mt-1">Position: {link.position}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {link.views_count || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {link.submissions_count || 0} submissions
                          </span>
                          {link.expires_at && (
                            <span>
                              Expires: {new Date(link.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLink(link.token, link.id)}
                        >
                          {copiedLinkId === link.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy Link
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/consent/${link.token}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Link URL */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm text-gray-700 break-all">
                          {typeof window !== 'undefined' ? `${window.location.origin}/consent/${link.token}` : `/consent/${link.token}`}
                        </code>
                      </div>
                    </div>

                    {/* Embed Code Toggle */}
                    <div className="mt-4">
                      <button
                        onClick={() => setShowEmbedCode(showEmbedCode === link.id ? null : link.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Code className="w-4 h-4" />
                        {showEmbedCode === link.id ? 'Hide' : 'Show'} Embed Code
                      </button>
                      {showEmbedCode === link.id && (
                        <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                          <code className="text-xs text-green-400 break-all">
                            {getEmbedCode(link.token)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-white hover:bg-gray-800"
                            onClick={() => {
                              navigator.clipboard.writeText(getEmbedCode(link.token))
                              alert('Embed code copied!')
                            }}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Embed Code
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Created {new Date(link.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        {link.is_active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id, true)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <ToggleLeft className="w-4 h-4 mr-1" />
                            Deactivate
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLink(link.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Help Text */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-medium text-blue-900 mb-2">How Consent Links Work</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Share the link with candidates (email, job posting, careers page)</li>
                <li>• Candidates see your AI disclosure and enter their name/email</li>
                <li>• When they acknowledge, a consent record is automatically created</li>
                <li>• Records show &quot;via link&quot; badge to distinguish from manual entries</li>
                <li>• View and link stats show how many people viewed/submitted</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
