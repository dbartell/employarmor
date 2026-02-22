'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Lock, FileText, ToggleRight, Database } from 'lucide-react'
import { ApplicabilityBanner } from '@/components/compliance/applicability-banner'

export default function DataPrivacyPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ApplicabilityBanner sectionHref="/data-privacy" />
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Privacy</h1>
          <p className="text-lg text-gray-600 mb-4">
            Applicant data privacy notices and automated decision-making opt-outs
          </p>
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold">Required by law</span>
            <span className="text-red-600">in California (CCPA/ADMT), Colorado, Connecticut</span>
          </div>
          <p className="text-gray-600 max-w-2xl">
            California&apos;s CCPA and proposed ADMT regulations require employers to notify applicants about 
            data collection, provide opt-out mechanisms for automated decision-making, and maintain data inventories. 
            Similar requirements exist in Colorado and Connecticut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Notice</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate an applicant data privacy notice covering what data is collected and how AI processes it.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ToggleRight className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Opt-Out Mechanism</h3>
              <p className="text-sm text-gray-600 mb-4">
                Set up a process for candidates to opt out of automated decision-making in your hiring flow.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Inventory</h3>
              <p className="text-sm text-gray-600 mb-4">
                Catalog what applicant data your AI tools collect, process, and retain.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
