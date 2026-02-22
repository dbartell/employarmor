'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Accessibility, FileText, ClipboardList, BarChart3 } from 'lucide-react'
import { ApplicabilityBanner } from '@/components/compliance/applicability-banner'

export default function AdaPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ApplicabilityBanner sectionHref="/ada" />
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ADA Accommodations</h1>
          <p className="text-lg text-gray-600 mb-4">
            Ensure AI assessments don&apos;t discriminate against candidates with disabilities
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="font-semibold">Recommended</span>
          </div>
          <p className="text-gray-600 max-w-2xl">
            The EEOC has flagged AI hiring tools as a disability discrimination risk. Establishing a clear 
            accommodation process for candidates who cannot complete AI-based assessments protects against 
            ADA claims and demonstrates proactive compliance. This is especially important for video interviews, 
            game-based assessments, and timed tests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accommodation Request Form</h3>
              <p className="text-sm text-gray-600 mb-4">
                A form candidates can use to request alternatives to AI-based assessments during hiring.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Process Documentation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Document your interactive process for handling accommodation requests in AI-driven hiring.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tracking Log</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track accommodation requests, responses, and outcomes for audit readiness.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
