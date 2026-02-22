'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Upload, History, Globe } from 'lucide-react'

export default function BiasAuditPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bias Audit</h1>
              <p className="text-lg text-gray-600 mb-4">
                NYC requires annual third-party bias audit of AI hiring tools. Must be published on company website.
              </p>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold">Required by law</span>
                <span className="text-red-600">— NYC Local Law 144</span>
              </div>
              <p className="text-gray-600 max-w-2xl">
                NYC LL 144 requires employers using automated employment decision tools (AEDTs) to conduct an independent bias audit annually. 
                Results must be publicly posted on your website at least 10 days before use.
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload Audit Report</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your third-party bias audit report for review and publication.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <History className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Audit History</h3>
              <p className="text-sm text-gray-600 mb-4">
                View past audit reports, dates, and compliance status over time.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Publication Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track whether your audit results are publicly posted as required.
              </p>
              <Button variant="outline" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
