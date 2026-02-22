'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Fingerprint, FileText, Clock, Shield } from 'lucide-react'
import { ApplicabilityBanner } from '@/components/compliance/applicability-banner'

export default function BiometricPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ApplicabilityBanner sectionHref="/biometric" />
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biometric Data Compliance</h1>
          <p className="text-lg text-gray-600 mb-4">
            Manage consent and retention policies for biometric data collection
          </p>
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold">Required by law</span>
            <span className="text-red-600">in Illinois (BIPA), Texas, Washington</span>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Illinois BIPA requires written consent before collecting biometric data including facial geometry, 
            voiceprints, and fingerprints. This applies to video interview tools like HireVue that analyze 
            facial expressions. Violations carry penalties of $1,000-$5,000 per incident.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consent Form</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate BIPA-compliant consent forms for candidates subject to biometric data collection.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Retention Policy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Define how long biometric data is stored and when it&apos;s destroyed per BIPA requirements.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Collection Log</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track all biometric data collection events with timestamps and consent records.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
