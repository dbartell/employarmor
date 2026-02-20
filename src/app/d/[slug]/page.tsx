import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getDisclosureBySlug, trackDisclosurePageView } from '@/lib/actions/disclosure'
import { Shield, Bot, FileText, Mail, ExternalLink, CheckCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const disclosure = await getDisclosureBySlug(slug)

  if (!disclosure) {
    return {
      title: 'Page Not Found',
    }
  }

  const companyName = disclosure.organizations?.name || 'Company'

  return {
    title: `AI Hiring Disclosure - ${companyName}`,
    description: `Learn how ${companyName} uses AI in their hiring process. View our commitment to transparent and fair AI-assisted hiring practices.`,
    openGraph: {
      title: `How ${companyName} Uses AI in Hiring`,
      description: `Learn about our AI-assisted hiring practices and your rights as a candidate.`,
      type: 'website',
    },
  }
}

export default async function DisclosurePage({ params }: PageProps) {
  const { slug } = await params
  const disclosure = await getDisclosureBySlug(slug)

  if (!disclosure) {
    notFound()
  }

  // Track page view (async, non-blocking)
  trackDisclosurePageView(disclosure.id, undefined, undefined, 'direct')

  const companyName = disclosure.organizations?.name || 'Company'
  const brandColor = disclosure.brand_color || '#3B82F6'

  // Default rights text if not customized
  const defaultRightsText = `• You may request an alternative selection process that does not use AI tools
• You may request human review of AI-assisted decisions
• You have the right to understand how AI affects your application
• You may request information about the specific AI tools used`

  const rightsText = disclosure.rights_custom_text || defaultRightsText

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="bg-white border-b"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {disclosure.logo_url ? (
              <img 
                src={disclosure.logo_url} 
                alt={companyName}
                className="h-12 w-auto"
              />
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: brandColor }}
              >
                {companyName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {disclosure.header_text || `How ${companyName} Uses AI in Hiring`}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro Section */}
        {disclosure.intro_text && (
          <section className="mb-8">
            <div className="prose prose-gray max-w-none">
              {disclosure.intro_text.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* AI Tools Section */}
        {disclosure.tools && disclosure.tools.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bot 
                className="w-6 h-6"
                style={{ color: brandColor }}
              />
              <h2 className="text-xl font-semibold text-gray-900">AI Tools We Use</h2>
            </div>
            <div className="space-y-4">
              {disclosure.tools.map((tool: { name: string; purpose: string; evaluates: string; stages: string }, i: number) => (
                <div 
                  key={i}
                  className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Purpose:</span> {tool.purpose}</p>
                    <p><span className="font-medium">What it evaluates:</span> {tool.evaluates}</p>
                    <p><span className="font-medium">Stages used:</span> {tool.stages}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rights Section */}
        {disclosure.rights_section_enabled && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle 
                className="w-6 h-6"
                style={{ color: brandColor }}
              />
              <h2 className="text-xl font-semibold text-gray-900">Your Rights as a Candidate</h2>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <div className="prose prose-gray prose-sm max-w-none">
                {rightsText.split('\n').map((line: string, i: number) => {
                  const trimmed = line.trim()
                  // Handle both • and - as bullet markers
                  if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                    return (
                      <p key={i} className="text-gray-700 flex items-start gap-2 my-2">
                        <span 
                          className="inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                        <span>{trimmed.substring(1).trim()}</span>
                      </p>
                    )
                  }
                  return trimmed ? (
                    <p key={i} className="text-gray-700 my-2">{trimmed}</p>
                  ) : null
                })}
              </div>
            </div>
          </section>
        )}

        {/* Bias Audit Section */}
        {disclosure.bias_audit_section_enabled && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText 
                className="w-6 h-6"
                style={{ color: brandColor }}
              />
              <h2 className="text-xl font-semibold text-gray-900">Bias Audit Summary (NYC LL144)</h2>
            </div>
            <div className="bg-white rounded-lg border p-6">
              {(disclosure.bias_audit_date || disclosure.bias_audit_auditor) ? (
                <p className="text-gray-700 mb-4">
                  Our most recent bias audit was conducted
                  {disclosure.bias_audit_date && (
                    <> on <strong>{new Date(disclosure.bias_audit_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</strong></>
                  )}
                  {disclosure.bias_audit_auditor && (
                    <> by <strong>{disclosure.bias_audit_auditor}</strong></>
                  )}
                  .
                </p>
              ) : (
                <p className="text-gray-700 mb-4">
                  We conduct regular bias audits of our AI hiring tools to ensure fair and non-discriminatory outcomes.
                </p>
              )}
              {disclosure.bias_audit_url && (
                <a
                  href={disclosure.bias_audit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: brandColor }}
                >
                  View Full Audit Summary
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Mail 
              className="w-6 h-6"
              style={{ color: brandColor }}
            />
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <p className="text-gray-700 mb-2">
              Questions about AI in our hiring process?
            </p>
            <a 
              href={`mailto:${disclosure.contact_email}`}
              className="font-medium hover:underline"
              style={{ color: brandColor }}
            >
              {disclosure.contact_email}
            </a>
          </div>
        </section>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 mb-8">
          Last updated: {new Date(disclosure.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        {/* Powered By Footer */}
        {!disclosure.hide_powered_by && (
          <footer className="border-t pt-6 text-center">
            <a 
              href="https://employarmor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Powered by HireShield | AI Hiring Compliance</span>
            </a>
          </footer>
        )}
      </main>

      {/* Custom CSS (Enterprise) */}
      {disclosure.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: disclosure.custom_css }} />
      )}
    </div>
  )
}
