'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, DollarSign, Search, ShieldOff, CheckSquare } from 'lucide-react'

export default function PayTransparencyPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pay Transparency</h1>
          <p className="text-lg text-gray-600 mb-4">
            Ensure AI tools comply with salary history bans and pay posting requirements
          </p>
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold">Required by law</span>
            <span className="text-red-600">in Colorado, NYC, California, Washington + 15 more states</span>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Multiple states require salary ranges in job postings and prohibit asking about salary history. 
            AI hiring tools that filter candidates based on compensation expectations or past salary data 
            can create violations. Penalties range from $1,000 to $250,000 per violation depending on jurisdiction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Posting Audit</h3>
              <p className="text-sm text-gray-600 mb-4">
                Scan your job postings to verify salary ranges are included where required by state law.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldOff className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Salary History Ban</h3>
              <p className="text-sm text-gray-600 mb-4">
                Verify your AI tools don&apos;t collect, filter, or use salary history data in prohibited jurisdictions.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compliance Checklist</h3>
              <p className="text-sm text-gray-600 mb-4">
                State-by-state checklist of pay transparency requirements relevant to your hiring locations.
              </p>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
