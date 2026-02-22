'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface DisclosureData {
  employee: { name: string; email: string }
  org: { name: string; states: string[]; quiz_tools: string[] }
  disclosure: {
    status: string
    signed_at: string | null
    signature_text: string | null
    disclosure_type: string | null
    opted_out_tools: string[] | null
  } | null
}

const STATE_DESCRIPTIONS: Record<string, string> = {
  illinois: 'Illinois AI Video Interview Act (AIVI) and Human Rights Act require employers to disclose and obtain consent before using AI in hiring.',
  'new-york-city': 'NYC Local Law 144 requires notice to candidates when automated employment decision tools (AEDT) are used.',
  colorado: 'Colorado SB 24-205 requires disclosure when AI is used in consequential employment decisions.',
  california: 'California CCPA/ADMT regulations require transparency about automated decision-making technology.',
  maryland: 'Maryland HB 1202 requires consent before using facial recognition in job interviews.',
  texas: 'Texas requires disclosure of AI use in employment decisions under emerging regulations.',
}

export default function AcknowledgePage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<DisclosureData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'acknowledge' | 'opt-out'>('acknowledge')
  const [agreed, setAgreed] = useState(false)
  const [signature, setSignature] = useState('')
  const [optOutTools, setOptOutTools] = useState<string[]>([])
  const [optOutAgreed, setOptOutAgreed] = useState(false)
  const [optOutSignature, setOptOutSignature] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/acknowledge/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setData(d)
        setLoading(false)
      })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [token])

  const submit = async (type: 'ai_tool_use' | 'tool_opt_out') => {
    setSubmitting(true)
    const body = type === 'ai_tool_use'
      ? { signatureText: signature, disclosureType: type }
      : { signatureText: optOutSignature, disclosureType: type, optOutTools }

    const res = await fetch(`/api/acknowledge/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const result = await res.json()
    if (result.success) {
      setSuccess(result.signed_at)
    } else {
      setError(result.error || 'Failed to submit')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { employee, org, disclosure } = data

  // Already signed
  if (disclosure?.status === 'signed' || success) {
    const signedDate = success || disclosure?.signed_at
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Disclosure Acknowledged</h2>
          <p className="text-gray-600 mb-4">
            {disclosure?.signature_text ? `Signed by ${disclosure.signature_text}` : 'Your acknowledgment has been recorded.'}
          </p>
          <p className="text-sm text-gray-500">
            Signed on {signedDate ? new Date(signedDate).toLocaleString() : 'just now'}
          </p>
        </div>
      </div>
    )
  }

  const tools = org.quiz_tools || []
  const states = org.states || []

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">🛡️ EmployArmor</h1>
          <p className="text-sm text-gray-500">AI Hiring Compliance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            AI Tool Disclosure Notice from {org.name}
          </h2>
          <p className="text-gray-600 mb-6">
            Hi {employee.name}, please review and acknowledge the following disclosure.
          </p>

          {/* Tools */}
          {tools.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">AI Tools Used</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool: string) => (
                  <span key={tool} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* State Requirements */}
          {states.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Applicable Regulations</h3>
              <div className="space-y-2">
                {states.map((state: string) => (
                  <div key={state} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900 capitalize">{state.replace(/-/g, ' ')}</div>
                    <div className="text-sm text-gray-600">{STATE_DESCRIPTIONS[state] || 'State regulations require disclosure of AI use in employment.'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setTab('acknowledge')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === 'acknowledge' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              I Acknowledge
            </button>
            <button
              onClick={() => setTab('opt-out')}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === 'opt-out' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              I Won&apos;t Use These Tools
            </button>
          </div>

          {tab === 'acknowledge' && (
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  I have read and understand this AI tool disclosure notice. I acknowledge that {org.name} uses the above AI tools in its hiring and employment processes.
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type your full name as electronic signature
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  placeholder={employee.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => submit('ai_tool_use')}
                disabled={!agreed || !signature.trim() || submitting}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Sign & Acknowledge'}
              </button>
            </div>
          )}

          {tab === 'opt-out' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select the tools you will not use:</p>
              <div className="space-y-2">
                {tools.map((tool: string) => (
                  <label key={tool} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optOutTools.includes(tool)}
                      onChange={e => {
                        if (e.target.checked) setOptOutTools([...optOutTools, tool])
                        else setOptOutTools(optOutTools.filter(t => t !== tool))
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{tool}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optOutAgreed}
                  onChange={e => setOptOutAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  I confirm I will not use the selected tools and understand the implications.
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type your full name as electronic signature
                </label>
                <input
                  type="text"
                  value={optOutSignature}
                  onChange={e => setOptOutSignature(e.target.value)}
                  placeholder={employee.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => submit('tool_opt_out')}
                disabled={!optOutAgreed || !optOutSignature.trim() || optOutTools.length === 0 || submitting}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Sign & Submit Opt-Out'}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">Powered by EmployArmor — AI Hiring Compliance</p>
        </div>
      </div>
    </div>
  )
}
