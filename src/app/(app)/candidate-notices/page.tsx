'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, Shield, Users, ClipboardCheck, AlertTriangle, 
  ExternalLink, Eye, Download, Copy, Globe, CheckCircle2,
  Clock, XCircle, Plus, ArrowRight
} from 'lucide-react'
import { ApplicabilityBanner } from '@/components/compliance/applicability-banner'

interface Document {
  id: string
  name: string
  doc_type: string
  status: string
  created_at: string
  content: string
}

interface DisclosurePage {
  id: string
  slug: string
  is_published: boolean
  header_text: string
  updated_at: string
}

interface ConsentStats {
  total: number
  consented: number
  pending: number
  declined: number
}

const REQUIRED_STATES: Record<string, string> = {
  IL: 'Illinois (AIVI Act)',
  NYC: 'New York City (LL 144)',
  CO: 'Colorado (SB 24-205)',
  MD: 'Maryland (HB 1202)',
  CA: 'California (CCPA/ADMT)',
}

export default function CandidateNoticesPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [disclosurePage, setDisclosurePage] = useState<DisclosurePage | null>(null)
  const [consentStats, setConsentStats] = useState<ConsentStats>({ total: 0, consented: 0, pending: 0, declined: 0 })
  const [orgStates, setOrgStates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get org states
      const { data: org } = await supabase
        .from('organizations')
        .select('active_states, states, primary_state')
        .eq('id', user.id)
        .single()
      
      const states = org?.active_states || org?.states || [org?.primary_state || 'IL']
      setOrgStates(states)

      // Get candidate disclosure documents
      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('org_id', user.id)
        .eq('doc_type', 'disclosure-candidate')
        .order('created_at', { ascending: false })
      setDocuments(docs || [])

      // Get disclosure page
      const { data: dp } = await supabase
        .from('disclosure_pages')
        .select('*')
        .eq('org_id', user.id)
        .single()
      setDisclosurePage(dp || null)

      // Get consent stats
      const { data: consents } = await supabase
        .from('consent_records')
        .select('status')
        .eq('org_id', user.id)
      
      if (consents) {
        setConsentStats({
          total: consents.length,
          consented: consents.filter(c => c.status === 'consented').length,
          pending: consents.filter(c => c.status === 'pending').length,
          declined: consents.filter(c => c.status === 'declined').length,
        })
      }

      setLoading(false)
    }
    fetchData()
  }, [])

  const applicableStates = orgStates.filter(s => s in REQUIRED_STATES)

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-40 bg-gray-200 rounded-xl" />
            <div className="grid grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded-xl" />
              <div className="h-32 bg-gray-200 rounded-xl" />
              <div className="h-32 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ApplicabilityBanner sectionHref="/candidate-notices" />
        {/* Hero Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Disclosure Notices</h1>
              <p className="text-lg text-gray-600 mb-4">
                Notify job candidates that AI tools are used in your hiring process
              </p>
              
              {applicableStates.length > 0 && (
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">Required by law</span>
                  <span className="text-red-600">in {applicableStates.map(s => REQUIRED_STATES[s]).join(', ')}</span>
                </div>
              )}

              <p className="text-gray-600 max-w-2xl">
                Several states require employers to disclose when AI tools are used to evaluate candidates. 
                Non-compliance can result in fines up to $1,500 per violation in NYC and significant penalties in other jurisdictions.
              </p>
            </div>
          </div>
        </div>

        {/* How It Helps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Legal Protection</h3>
              <p className="text-sm text-gray-600">
                Documented notices protect against lawsuits and demonstrate good-faith compliance efforts.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Candidate Trust</h3>
              <p className="text-sm text-gray-600">
                Transparency about AI use builds your employer brand and attracts top talent.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Audit Ready</h3>
              <p className="text-sm text-gray-600">
                Records prove compliance during audits and regulatory inquiries.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Your Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Notices
                </CardTitle>
                <CardDescription>Candidate disclosure documents you&apos;ve created</CardDescription>
              </div>
              <Link href="/documents?type=disclosure-candidate">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate New Notice
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No candidate notices created yet</p>
                <Link href="/documents?type=disclosure-candidate">
                  <Button variant="outline">
                    Create Your First Notice
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">Created {new Date(doc.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.status || 'Draft'}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(doc.content || '')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Link href={`/documents?id=${doc.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Public Disclosure Page (LL144) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Public Disclosure Page
            </CardTitle>
            <CardDescription>
              NYC LL144 requires a publicly accessible page with bias audit results and AI tool disclosures
            </CardDescription>
          </CardHeader>
          <CardContent>
            {disclosurePage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${disclosurePage.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {disclosurePage.is_published ? 'Published' : 'Unpublished'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last updated {new Date(disclosurePage.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {disclosurePage.is_published && (
                      <a href={`/d/${disclosurePage.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Page
                        </Button>
                      </a>
                    )}
                    <Link href="/disclosures">
                      <Button size="sm">Edit Page</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No public disclosure page set up yet</p>
                <Link href="/disclosures">
                  <Button variant="outline">
                    Create Disclosure Page
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate Consent Records */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Candidate Consent Records
                </CardTitle>
                <CardDescription>Track candidate acknowledgments and consent status</CardDescription>
              </div>
              <Link href="/consent">
                <Button variant="outline" size="sm">
                  View All Records
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{consentStats.total}</div>
                <div className="text-sm text-gray-500">Total Notified</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{consentStats.consented}</div>
                <div className="text-sm text-gray-500">Consented</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{consentStats.pending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{consentStats.declined}</div>
                <div className="text-sm text-gray-500">Declined</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
