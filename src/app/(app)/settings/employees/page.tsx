'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Send, Upload, Plus, RefreshCw, CheckCircle2, Clock, Eye, Mail } from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  token: string
  status: string
  sent_at: string | null
  signed_at: string | null
  signature_text: string | null
  disclosure_type: string | null
  opted_out_tools: string[] | null
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  not_sent: { label: 'Not Sent', color: 'bg-gray-100 text-gray-700' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700' },
  viewed: { label: 'Viewed', color: 'bg-yellow-100 text-yellow-700' },
  signed: { label: 'Signed', color: 'bg-green-100 text-green-700' },
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [bulkSending, setBulkSending] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees')
    const data = await res.json()
    setEmployees(data.employees || [])
    setLoading(false)
  }

  useEffect(() => { fetchEmployees() }, [])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const addEmployee = async () => {
    if (!name || !email) return
    setAdding(true)
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    if (res.ok) {
      setName('')
      setEmail('')
      showMessage('success', 'Employee added')
      fetchEmployees()
    } else {
      const err = await res.json()
      showMessage('error', err.error || 'Failed to add')
    }
    setAdding(false)
  }

  const importCSV = async () => {
    if (!csvText.trim()) return
    setImporting(true)
    const res = await fetch('/api/employees/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: csvText }),
    })
    const data = await res.json()
    showMessage('success', `Imported ${data.imported}, skipped ${data.skipped}`)
    setCsvText('')
    setImportOpen(false)
    fetchEmployees()
    setImporting(false)
  }

  const sendDisclosure = async (employeeIds?: string[]) => {
    const body = employeeIds ? { employeeIds } : { all: true }
    const res = await fetch('/api/employees/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    showMessage('success', `Sent ${data.sent} email(s)${data.errors ? `, ${data.errors} failed` : ''}`)
    fetchEmployees()
  }

  const sendReminders = async () => {
    setBulkSending(true)
    const res = await fetch('/api/employees/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remindUnsigned: true }),
    })
    const data = await res.json()
    showMessage('success', `Sent ${data.sent} reminder(s)`)
    fetchEmployees()
    setBulkSending(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCsvText(ev.target?.result as string || '')
      setImportOpen(true)
    }
    reader.readAsText(file)
  }

  const total = employees.length
  const sentCount = employees.filter(e => ['sent', 'viewed', 'signed'].includes(e.status)).length
  const signedCount = employees.filter(e => e.status === 'signed').length
  const pct = total > 0 ? Math.round((signedCount / total) * 100) : 0

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString() : '—'

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Disclosures</h1>
          <p className="text-gray-600">Send AI tool disclosure notices and track acknowledgments</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-500">Total Employees</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{sentCount}</div>
              <div className="text-sm text-gray-500">Sent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{signedCount}</div>
              <div className="text-sm text-gray-500">Signed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{pct}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Employee */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5" />
              Add Employee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addEmployee} disabled={adding || !name || !email}>
                {adding ? 'Adding...' : 'Add'}
              </Button>
            </div>
            <div className="mt-3 flex gap-2">
              <input type="file" ref={fileRef} accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> Import CSV
              </Button>
            </div>
            {importOpen && (
              <div className="mt-4 space-y-3">
                <textarea
                  value={csvText}
                  onChange={e => setCsvText(e.target.value)}
                  placeholder="name,email (one per line)"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={importCSV} disabled={importing}>
                    {importing ? 'Importing...' : 'Import'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setImportOpen(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={async () => { setBulkSending(true); await sendDisclosure(); setBulkSending(false) }}
            disabled={bulkSending}
          >
            <Send className="w-4 h-4 mr-2" />
            {bulkSending ? 'Sending...' : 'Send All Unsigned'}
          </Button>
          <Button variant="outline" onClick={sendReminders} disabled={bulkSending}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
        </div>

        {/* Employee Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : employees.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No employees yet. Add one above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Sent</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Signed</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => {
                      const badge = STATUS_BADGES[emp.status] || STATUS_BADGES.not_sent
                      return (
                        <tr key={emp.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{emp.name}</td>
                          <td className="p-4 text-gray-600 text-sm">{emp.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">{formatDate(emp.sent_at)}</td>
                          <td className="p-4 text-sm text-gray-500">{formatDate(emp.signed_at)}</td>
                          <td className="p-4">
                            {emp.status === 'not_sent' && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={sending === emp.id}
                                onClick={async () => {
                                  setSending(emp.id)
                                  await sendDisclosure([emp.id])
                                  setSending(null)
                                }}
                              >
                                <Send className="w-3 h-3 mr-1" />
                                {sending === emp.id ? 'Sending...' : 'Send'}
                              </Button>
                            )}
                            {(emp.status === 'sent' || emp.status === 'viewed') && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={sending === emp.id}
                                onClick={async () => {
                                  setSending(emp.id)
                                  await sendDisclosure([emp.id])
                                  setSending(null)
                                }}
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Remind
                              </Button>
                            )}
                            {emp.status === 'signed' && emp.signature_text && (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Signed: {emp.signature_text}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
