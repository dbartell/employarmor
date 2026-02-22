'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, TrendingUp, Download, Copy, CheckCircle2, 
  Clock, RefreshCw, FileText, Edit3
} from 'lucide-react'

interface HandbookPolicy {
  id?: string
  content: string
  generated_at: string
  updated_at: string
  added_to_handbook: boolean
}

export default function HandbookPolicyPage() {
  const [policy, setPolicy] = useState<HandbookPolicy | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    fetchPolicy()
  }, [])

  const fetchPolicy = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('handbook_policies')
      .select('*')
      .eq('org_id', user.id)
      .single()

    if (data) {
      setPolicy(data)
      setEditContent(data.content)
    }
    setLoading(false)
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const generatePolicy = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/handbook/generate', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to generate')
      const data = await res.json()
      setPolicy(data.policy)
      setEditContent(data.policy.content)
      showMessage('success', 'Policy generated successfully')
    } catch {
      showMessage('error', 'Failed to generate policy')
    }
    setGenerating(false)
  }

  const savePolicy = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('handbook_policies')
      .upsert({
        org_id: user.id,
        content: editContent,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'org_id' })

    if (error) {
      showMessage('error', 'Failed to save')
    } else {
      setPolicy(prev => prev ? { ...prev, content: editContent, updated_at: new Date().toISOString() } : null)
      setEditing(false)
      showMessage('success', 'Policy saved')
    }
    setSaving(false)
  }

  const toggleHandbook = async () => {
    setToggling(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newValue = !policy?.added_to_handbook
    await supabase
      .from('handbook_policies')
      .update({ added_to_handbook: newValue })
      .eq('org_id', user.id)
    
    setPolicy(prev => prev ? { ...prev, added_to_handbook: newValue } : null)
    setToggling(false)
  }

  const copyToClipboard = () => {
    if (policy?.content) {
      navigator.clipboard.writeText(policy.content)
      showMessage('success', 'Copied to clipboard')
    }
  }

  const downloadPolicy = () => {
    if (!policy?.content) return
    const blob = new Blob([policy.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-policy-handbook-addendum.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Handbook — AI Policy</h1>
          <p className="text-lg text-gray-600 mb-4">
            Add an AI use policy section to your employee handbook
          </p>
          
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-semibold">Strongly recommended for all organizations using AI in hiring</span>
          </div>

          <p className="text-gray-600 max-w-2xl">
            A clear AI policy in your employee handbook sets expectations, reduces misuse, and provides legal protection. 
            Courts look favorably on companies with documented AI governance policies.
          </p>
        </div>

        {/* Compliance Impact */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Compliance Impact</h3>
                <p className="text-lg font-bold text-green-700 mb-2">Adds up to 10 points to your compliance score</p>
                <div className="text-sm text-gray-600">
                  <p>Your AI policy covers: Purpose &amp; Scope, Approved AI Tools, Prohibited Uses, Employee Responsibilities, Reporting &amp; Concerns, and Compliance &amp; Consequences.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Policy Content */}
        {!policy ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI Policy Generated Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Generate a customized AI use policy based on your organization&apos;s tools, states, and industry.
              </p>
              <Button size="lg" onClick={generatePolicy} disabled={generating}>
                {generating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Policy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPolicy}>
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
                {!editing && (
                  <Button variant="outline" size="sm" onClick={() => { setEditing(true); setEditContent(policy.content) }}>
                    <Edit3 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={generatePolicy} disabled={generating}>
                  <RefreshCw className={`w-4 h-4 mr-1 ${generating ? 'animate-spin' : ''}`} /> Regenerate
                </Button>
              </div>
            </div>

            {/* Policy Preview/Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  AI Use Policy — Handbook Addendum
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={30}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <Button onClick={savePolicy} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed bg-gray-50 p-6 rounded-lg">
                      {policy.content}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policy Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {policy.added_to_handbook ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">Added to Handbook</div>
                        <div className="text-sm text-gray-500">
                          {policy.added_to_handbook 
                            ? 'This policy has been added to your employee handbook' 
                            : 'Mark as added once you\'ve included this in your handbook'}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant={policy.added_to_handbook ? "outline" : "default"}
                      size="sm"
                      onClick={toggleHandbook}
                      disabled={toggling}
                    >
                      {policy.added_to_handbook ? 'Mark as Removed' : 'Mark as Added'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Generated:</span>{' '}
                      <span className="font-medium">{new Date(policy.generated_at).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last updated:</span>{' '}
                      <span className="font-medium">{new Date(policy.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
