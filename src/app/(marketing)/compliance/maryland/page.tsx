import Link from "next/link"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ArrowRight, Calendar, DollarSign, Building, FileText, Eye } from "lucide-react"

export const metadata = {
  title: "Maryland AI Hiring Law (HB 1202) Compliance Guide | EmployArmor",
  description: "Complete guide to Maryland's facial recognition hiring law HB 1202. Learn consent requirements, penalties, and how to comply with Maryland AI hiring regulations.",
  keywords: ["Maryland AI hiring law", "HB 1202", "facial recognition hiring", "Maryland employment law", "AI compliance Maryland"],
}

export default function MarylandCompliancePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Active Since October 1, 2020
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Maryland Facial Recognition in Hiring (HB 1202)
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Maryland prohibits employers from using facial recognition technology during interviews without explicit written consent. Here&apos;s what you need to know.
          </p>
          <Link href="/scan">
            <Button size="lg" variant="cta">
              Check Your Compliance <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AuthorByline publishDate="2025-02-20" />
      </div>
      {/* Quick Facts */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Effective Date</p>
                <p className="font-bold text-gray-900">Oct 1, 2020</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Building className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Applies To</p>
                <p className="font-bold text-gray-900">All Employers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Eye className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Focus Area</p>
                <p className="font-bold text-gray-900">Facial Recognition</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Enforcement</p>
                <p className="font-bold text-gray-900">Commissioner of Labor</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What the Law Requires */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What HB 1202 Requires</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Written Consent Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Employers may <strong>not</strong> use facial recognition technology during job interviews unless the applicant signs a written waiver specifically authorizing its use.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Consent must be obtained <strong>before</strong> any facial recognition is used</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Must be a signed, written waiver — verbal consent is not sufficient</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Waiver must specifically reference facial recognition technology</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  What Counts as &quot;Facial Recognition&quot;
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The law covers any technology that creates a &quot;facial template&quot; — a machine-readable representation of facial geometry used to identify individuals. This includes:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Video interview platforms with facial analysis (e.g., HireVue&apos;s legacy features)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Identity verification tools that scan faces during onboarding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Proctoring software with facial recognition for assessments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-600" />
                  Who Must Comply
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  <strong>All employers</strong> conducting interviews in Maryland, regardless of company size or industry. This applies if:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">The interview takes place in Maryland (in-person or remote with MD-based candidates)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">The employer uses any tool that creates facial geometry templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">Applies to both direct employers and staffing agencies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Steps */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Comply</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Audit your interview tools", desc: "Identify any video interview or assessment tools that use facial recognition or facial analysis technology." },
              { step: 2, title: "Create a written waiver", desc: "Draft a clear, specific consent form that explains the facial recognition technology being used and requests the applicant's written authorization." },
              { step: 3, title: "Implement consent collection", desc: "Ensure the waiver is presented and signed before any facial recognition technology is activated during the interview process." },
              { step: 4, title: "Train your hiring team", desc: "Educate recruiters and hiring managers on the consent requirement and proper procedures for Maryland-based interviews." },
              { step: 5, title: "Document everything", desc: "Maintain records of signed waivers and your facial recognition policies for compliance audits." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex-shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Get Compliant Today
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter */}
            <div className="bg-white rounded-xl border p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
              <p className="text-sm text-gray-500 mt-1">Small teams, single state</p>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">$199</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>1 state compliance</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Up to 50 employees</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Compliance documents</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Risk assessment</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Email support</li>
              </ul>
              <Link href="/scan" className="block text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium">
                Start Free Trial
              </Link>
            </div>
            {/* Growth */}
            <div className="bg-white rounded-xl border-2 border-blue-600 p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Growth</h3>
              <p className="text-sm text-gray-500 mt-1">Growing companies, multi-state</p>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">$499</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Up to 5 states</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Up to 500 employees</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>All compliance documents</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Training modules</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Priority support</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Quarterly compliance reviews</li>
              </ul>
              <Link href="/scan" className="block text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium">
                Start Free Trial
              </Link>
            </div>
            {/* Scale */}
            <div className="bg-white rounded-xl border p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">Scale</h3>
              <p className="text-sm text-gray-500 mt-1">Large organizations, nationwide</p>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">$999</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Unlimited states</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Unlimited employees</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>All compliance documents</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>All training modules</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Dedicated account manager</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Monthly compliance reviews</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Custom integrations</li>
              </ul>
              <Link href="/scan" className="block text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium">
                Start Free Trial
              </Link>
            </div>
            {/* Enterprise */}
            <div className="bg-white rounded-xl border p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
              <p className="text-sm text-gray-500 mt-1">Complex compliance needs</p>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8 flex-1">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Everything in Scale</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Multi-entity support</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>Custom training content</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>API access</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>SSO / SAML</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>SLA guarantee</li>
              </ul>
              <Link href="/contact" className="block text-center bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 font-medium">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Maryland-Compliant in Minutes
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            EmployArmor generates your consent forms, trains your team, and tracks compliance — so you can focus on hiring.
          </p>
          <Link href="/scan">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50">
              Start Free Assessment <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LegalDisclaimer />
        </div>
      </section>
    </div>
  )
}
