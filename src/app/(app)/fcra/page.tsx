'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, FileText, ClipboardCheck, AlertOctagon } from 'lucide-react'
import { ApplicabilityBanner } from '@/components/compliance/applicability-banner'

export default function FCRAPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ApplicabilityBanner sectionHref="/fcra" />
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FCRA Compliance</h1>
              <p className="text-lg text-gray-600 mb-4">
                Fair Credit Reporting Act requires specific disclosure, authorization, and adverse action procedures when using AI/background checks in hiring.
              </p>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold">Required by law</span>
                <span className="text-red-600">— Federal requirement</span>
              </div>
              <p className="text-gray-600 max-w-2xl">
                The FCRA mandates that employers provide standalone disclosure and obtain written authorization before procuring consumer reports. If adverse action is taken based on AI-assisted screening, a specific multi-step process must be followed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Standalone Disclosure</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate FCRA-compliant standalone disclosure forms for candidates.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Authorization Form</h3>
              <p className="text-sm text-gray-600 mb-4">
                Collect written candidate authorization before running background checks.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <AlertOctagon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Adverse Action Process</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage pre-adverse and adverse action notices with required waiting periods.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
