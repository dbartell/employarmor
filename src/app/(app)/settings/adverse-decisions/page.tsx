"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, CheckCircle, Save, Loader2, Info, Shield, User, Mail, Phone, Clock
} from "lucide-react"
import Link from "next/link"
import { 
  getAdverseDecisionSettings, 
  saveAdverseDecisionSettings
} from "@/lib/actions/compliance"
import type { AdverseDecisionSettings } from "@/lib/types/compliance"

const defaultReasonsTemplate = `Dear [CANDIDATE_NAME],

Thank you for your interest in the [POSITION] role at [COMPANY_NAME].

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.

REASON FOR DECISION:
[SPECIFIC_REASON]

AI INVOLVEMENT DISCLOSURE:
An automated decision-making tool was used as part of our evaluation process. This tool assisted in [TOOL_USAGE_DESCRIPTION].

YOUR RIGHTS:
Under applicable law, you have the right to:
1. Request additional information about how the AI system was used in evaluating your application
2. Request a human review of this decision
3. Correct any incorrect personal data that may have affected this decision

If you wish to exercise any of these rights, please contact us within [DEADLINE_DAYS] business days at [REVIEWER_CONTACT].

We appreciate your time and wish you success in your job search.

Sincerely,
[REVIEWER_NAME]
[REVIEWER_ROLE]
[COMPANY_NAME]`

export default function AdverseDecisionsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<Partial<AdverseDecisionSettings>>({
    reviewer_name: '',
    reviewer_role: '',
    reviewer_email: '',
    reviewer_phone: '',
    response_deadline_days: 5,
    reasons_template: defaultReasonsTemplate,
    appeal_instructions: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const data = await getAdverseDecisionSettings()
    if (data) {
      setSettings(data)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const result = await saveAdverseDecisionSettings(settings)
    if (!result.error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const updateSettings = (updates: Partial<AdverseDecisionSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/settings" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Adverse Decision Process</h1>
          <p className="text-gray-600">
            Configure your human review and appeal process for AI-assisted hiring decisions
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Colorado AI Act Requirement</h3>
                <p className="text-sm text-blue-700 mt-1">
                  When AI is used in employment decisions that negatively impact candidates, you must:
                </p>
                <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                  <li>Provide a statement of reasons for the decision</li>
                  <li>Allow opportunity to correct incorrect personal data</li>
                  <li>Offer human review of the AI-assisted decision</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Human Reviewer Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Human Reviewer
            </CardTitle>
            <CardDescription>
              Designate who will handle appeals and human review requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reviewer Name *</label>
                <input
                  type="text"
                  value={settings.reviewer_name || ''}
                  onChange={(e) => updateSettings({ reviewer_name: e.target.value })}
                  placeholder="e.g., Jane Smith"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role / Title *</label>
                <input
                  type="text"
                  value={settings.reviewer_role || ''}
                  onChange={(e) => updateSettings({ reviewer_role: e.target.value })}
                  placeholder="e.g., HR Director"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={settings.reviewer_email || ''}
                  onChange={(e) => updateSettings({ reviewer_email: e.target.value })}
                  placeholder="appeals@company.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.reviewer_phone || ''}
                  onChange={(e) => updateSettings({ reviewer_phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Response Timeline
            </CardTitle>
            <CardDescription>
              How long do candidates have to request an appeal?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Response Deadline (Business Days)</label>
                <select
                  value={settings.response_deadline_days || 5}
                  onChange={(e) => updateSettings({ response_deadline_days: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 business days</option>
                  <option value={5}>5 business days</option>
                  <option value={7}>7 business days</option>
                  <option value={10}>10 business days</option>
                  <option value={14}>14 business days</option>
                  <option value={30}>30 business days</option>
                </select>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{settings.response_deadline_days}</div>
                <div className="text-xs text-gray-600">days to respond</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statement of Reasons Template */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statement of Reasons Template</CardTitle>
            <CardDescription>
              Template for adverse decision notifications. Use placeholders like [CANDIDATE_NAME], [POSITION], etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium mb-2">Template Content</label>
              <textarea
                value={settings.reasons_template || ''}
                onChange={(e) => updateSettings({ reasons_template: e.target.value })}
                rows={20}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Available placeholders: [CANDIDATE_NAME], [POSITION], [COMPANY_NAME], [SPECIFIC_REASON], 
                [TOOL_USAGE_DESCRIPTION], [DEADLINE_DAYS], [REVIEWER_NAME], [REVIEWER_ROLE], [REVIEWER_CONTACT]
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => updateSettings({ reasons_template: defaultReasonsTemplate })}
            >
              Reset to Default Template
            </Button>
          </CardContent>
        </Card>

        {/* Appeal Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appeal Instructions</CardTitle>
            <CardDescription>
              Additional instructions for candidates who wish to appeal (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={settings.appeal_instructions || ''}
              onChange={(e) => updateSettings({ appeal_instructions: e.target.value })}
              placeholder="e.g., To request a human review of your application, please email appeals@company.com with your full name and the position you applied for. Include 'Appeal Request' in the subject line. You will receive a response within 5 business days."
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {saved && (
              <span className="text-green-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Settings saved successfully!
              </span>
            )}
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving || !settings.reviewer_name || !settings.reviewer_email}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        {/* Completion Notice */}
        {settings.reviewer_name && settings.reviewer_email && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800">
                    Adverse Decision Process Configured
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your appeal process is set up. {settings.reviewer_name} ({settings.reviewer_email}) 
                    will handle human review requests with a {settings.response_deadline_days}-day response deadline.
                  </p>
                  <Link href="/audit/remediation">
                    <Button variant="outline" size="sm" className="mt-3">
                      <Shield className="w-4 h-4 mr-2" />
                      Return to Remediation Checklist
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
