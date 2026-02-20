'use client'

import { useState, useEffect, use } from 'react'
import { Shield, CheckCircle, Loader2, AlertTriangle, Bot, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ConsentLinkData {
  id: string
  name: string
  position?: string
  organizations: {
    id: string
    name: string
  }
  disclosure_pages?: {
    intro_text?: string
    header_text?: string
    rights_section_enabled?: boolean
    rights_custom_text?: string
    contact_email?: string
    brand_color?: string
    logo_url?: string
    tools?: Array<{
      name: string
      purpose: string
      evaluates: string
      stages: string
    }>
  }
}

export default function PublicConsentPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const [linkData, setLinkData] = useState<ConsentLinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })

  useEffect(() => {
    async function fetchLink() {
      try {
        const res = await fetch(`/api/consent/link/${token}`)
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error || 'Invalid consent link')
          return
        }
        
        setLinkData(data.link)
      } catch {
        setError('Failed to load consent page')
      } finally {
        setLoading(false)
      }
    }
    
    fetchLink()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/consent/link/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_name: formData.name.trim(),
          candidate_email: formData.email.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to submit consent')
        return
      }

      setSuccess(true)
    } catch {
      setError('Failed to submit consent')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !linkData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Not Valid</h2>
            <p className="text-gray-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 text-center mb-4">
              Your acknowledgment has been recorded. You may close this page.
            </p>
            <div className="text-sm text-gray-500 text-center">
              <p>A copy has been saved for your records.</p>
              <p className="mt-1">
                Questions? Contact{' '}
                <a 
                  href={`mailto:${linkData?.disclosure_pages?.contact_email}`}
                  className="text-blue-600 hover:underline"
                >
                  {linkData?.disclosure_pages?.contact_email || 'the employer'}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const brandColor = linkData?.disclosure_pages?.brand_color || '#3B82F6'
  const companyName = linkData?.organizations?.name || 'the employer'
  const disclosure = linkData?.disclosure_pages

  // Default rights text
  const defaultRightsText = `• You may request an alternative selection process that does not use AI tools
• You may request human review of AI-assisted decisions
• You have the right to understand how AI affects your application`

  const rightsText = disclosure?.rights_custom_text || defaultRightsText

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="bg-white border-b"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {disclosure?.logo_url ? (
              <img 
                src={disclosure.logo_url} 
                alt={companyName}
                className="h-12 w-auto"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: brandColor }}
              >
                {companyName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                AI Hiring Disclosure
              </h1>
              <p className="text-gray-600">{companyName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Position Badge */}
        {linkData?.position && (
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Position: {linkData.position}
            </span>
          </div>
        )}

        {/* Intro Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5" style={{ color: brandColor }} />
              About Our AI Hiring Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray prose-sm max-w-none">
              {disclosure?.intro_text ? (
                disclosure.intro_text.split('\n').map((paragraph: string, i: number) => (
                  paragraph.trim() ? <p key={i} className="text-gray-700">{paragraph}</p> : null
                ))
              ) : (
                <p className="text-gray-700">
                  {companyName} uses artificial intelligence and automated tools to assist in our hiring process. 
                  These tools help us efficiently evaluate candidates while striving for fair and consistent decisions.
                </p>
              )}
            </div>

            {/* AI Tools List */}
            {disclosure?.tools && disclosure.tools.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">AI tools we may use:</p>
                {disclosure.tools.map((tool, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-900">{tool.name}</p>
                    <p className="text-gray-600">{tool.purpose}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rights Section */}
        {disclosure?.rights_section_enabled !== false && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5" style={{ color: brandColor }} />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray prose-sm max-w-none">
                {rightsText.split('\n').map((line: string, i: number) => {
                  if (line.trim().startsWith('•')) {
                    return (
                      <p key={i} className="text-gray-700 flex items-start gap-2 my-2">
                        <span 
                          className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                        <span>{line.trim().substring(1).trim()}</span>
                      </p>
                    )
                  }
                  return line.trim() ? (
                    <p key={i} className="text-gray-700 my-2">{line}</p>
                  ) : null
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consent Form */}
        <Card className="mb-6 border-2" style={{ borderColor: brandColor }}>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg">Acknowledgment</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Smith"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p>By clicking &quot;I Acknowledge&quot; below, I confirm that:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>I have read and understand the AI disclosure above</li>
                  <li>I am aware that AI tools may be used in evaluating my application</li>
                  <li>I understand my rights regarding the use of AI in hiring</li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || !formData.name.trim() || !formData.email.trim()}
                className="w-full"
                size="lg"
                style={{ backgroundColor: brandColor }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    I Acknowledge
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact */}
        {disclosure?.contact_email && (
          <div className="text-center text-sm text-gray-500">
            <Mail className="w-4 h-4 inline mr-1" />
            Questions? Contact{' '}
            <a 
              href={`mailto:${disclosure.contact_email}`}
              className="text-blue-600 hover:underline"
            >
              {disclosure.contact_email}
            </a>
          </div>
        )}

        {/* Powered By Footer */}
        <footer className="mt-8 pt-6 border-t text-center">
          <a 
            href="https://employarmor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span className="text-xs">Powered by EmployArmor</span>
          </a>
        </footer>
      </main>
    </div>
  )
}
