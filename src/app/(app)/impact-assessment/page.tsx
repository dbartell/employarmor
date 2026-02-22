'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, PlayCircle, FolderOpen, ShieldAlert } from 'lucide-react'

export default function ImpactAssessmentPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Assessment</h1>
              <p className="text-lg text-gray-600 mb-4">
                Colorado requires annual impact assessment documenting AI system risks, data inputs, mitigation measures.
              </p>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold">Required by law</span>
                <span className="text-red-600">— Colorado SB24-205</span>
              </div>
              <p className="text-gray-600 max-w-2xl">
                Colorado&apos;s AI Act requires deployers of high-risk AI systems to complete annual impact assessments covering system purpose, data inputs, known risks, and measures taken to mitigate algorithmic discrimination.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Assessment</h3>
              <p className="text-sm text-gray-600 mb-4">
                Begin a new impact assessment with guided questions and templates.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Past Assessments</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review previously completed impact assessments and their findings.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Risk Mitigation Log</h3>
              <p className="text-sm text-gray-600 mb-4">
                Document risks identified and mitigation steps taken for each AI system.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
