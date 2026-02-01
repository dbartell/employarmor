"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowRight, CheckCircle, FileText, Upload, Settings, 
  Info, Shield, Loader2
} from "lucide-react"
import { saveConsentSettings } from "@/lib/actions/compliance"

interface ConsentOnboardingProps {
  onComplete: () => void
}

const defaultNotificationTemplate = `Dear [CANDIDATE_NAME],

Thank you for applying to [COMPANY_NAME] for the position of [POSITION].

NOTICE OF AI USE IN HIRING

We want to inform you that [COMPANY_NAME] uses artificial intelligence (AI) technology as part of our hiring process. This notice is provided in compliance with applicable state and local laws.

AI tools may be used to:
- Screen and analyze your application materials
- Evaluate assessment or interview responses
- Assist in making employment decisions

YOUR RIGHTS:
1. You have the right to request information about how AI is used
2. You may request an alternative selection process
3. You can request human review of AI-assisted decisions

By proceeding with your application, you acknowledge receiving this disclosure.

If you have questions, please contact [CONTACT_EMAIL].

Sincerely,
[COMPANY_NAME] Recruiting Team`

export function ConsentOnboarding({ onComplete }: ConsentOnboardingProps) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    notification_template: defaultNotificationTemplate,
    data_retention_days: 365,
  })

  const handleComplete = async () => {
    setSaving(true)
    await saveConsentSettings({
      ...settings,
      onboarding_completed: true,
    })
    setSaving(false)
    onComplete()
  }

  return (
    <Card className="mb-8 border-blue-200 bg-gradient-to-b from-blue-50 to-white">
      <CardHeader>
        <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
          <Shield className="w-4 h-4" />
          Setup Required
        </div>
        <CardTitle>Consent Tracking Setup</CardTitle>
        <CardDescription>
          Set up consent tracking to comply with disclosure and consent requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Introduction */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">What is Consent Tracking?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Consent tracking helps you document that candidates have been properly notified about 
                  AI use in your hiring process. This is required under Colorado, California, and Illinois law.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium">Track Disclosures</h4>
                <p className="text-sm text-gray-600">Record when candidates receive AI use notifications</p>
              </div>
              <div className="p-4 border rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="font-medium">Record Consent</h4>
                <p className="text-sm text-gray-600">Document consent status for each candidate</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Upload className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-medium">Import Records</h4>
                <p className="text-sm text-gray-600">Bulk import from your ATS via CSV</p>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Configure Template */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Notification Template</h3>
              <p className="text-sm text-gray-600 mb-4">
                This template can be used for your candidate disclosure emails. Customize as needed.
              </p>
              <textarea
                value={settings.notification_template}
                onChange={(e) => setSettings({ ...settings, notification_template: e.target.value })}
                rows={12}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Placeholders: [CANDIDATE_NAME], [COMPANY_NAME], [POSITION], [CONTACT_EMAIL]
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Data Retention & Complete */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Data Retention Period</h3>
              <p className="text-sm text-gray-600 mb-4">
                How long should consent records be retained?
              </p>
              <select
                value={settings.data_retention_days}
                onChange={(e) => setSettings({ ...settings, data_retention_days: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={90}>90 days</option>
                <option value={180}>6 months</option>
                <option value={365}>1 year</option>
                <option value={730}>2 years</option>
                <option value={1095}>3 years (recommended)</option>
                <option value={2555}>7 years</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Most employment records should be retained for at least 3 years for compliance.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                You're all set!
              </h4>
              <p className="text-sm text-green-700 mt-1">
                After setup, you can add consent records manually or import them from a CSV file.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleComplete} disabled={saving} className="flex-1">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Complete Setup <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
