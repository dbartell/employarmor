import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FAQSchema } from '@/components/faq-schema'
import { 
  CheckCircle, 
  Shield, 
  FileText, 
  GraduationCap, 
  BarChart3, 
  FileCheck,
  Users
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Schedule a Demo | See EmployArmor in Action',
  description:
    'Book a 15-minute demo to see how EmployArmor simplifies AI hiring compliance. Learn about automated scanning, disclosure generation, training, and audit-ready reporting.',
}

const faqs = [
  {
    question: 'How long is the demo?',
    answer: 'Our standard demo is 15 minutes, focused on showing you the core features that matter most to your organization. If you need more time to discuss specific compliance scenarios or integrations, we can extend to 30 minutes. We respect your time and keep demos concise and practical.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! After the demo, we offer a 14-day free trial of EmployArmor Pro so you can test it with your actual hiring tools and processes. No credit card required to start the trial. We also provide onboarding support to help you get set up quickly.',
  },
  {
    question: 'Do I need to prepare anything?',
    answer: 'No preparation required! It helps if you know which AI tools you currently use in hiring (ATS, video interview platforms, assessment tools, etc.) and which states you hire in, but we can walk through those questions together during the demo. Come as you are—we\'ll tailor the demo to your situation.',
  },
]

const demoFeatures = [
  {
    icon: Shield,
    title: 'AI-powered compliance scanning',
    description: 'See how we analyze your hiring tools across 6+ state laws in seconds',
  },
  {
    icon: FileText,
    title: 'Automated disclosure and notice generation',
    description: 'Generate legally compliant candidate disclosures for each jurisdiction',
  },
  {
    icon: GraduationCap,
    title: 'Team training and certification tracking',
    description: 'Keep your hiring team educated on AI compliance requirements',
  },
  {
    icon: BarChart3,
    title: 'Real-time compliance monitoring dashboard',
    description: 'Track compliance status across tools, roles, and locations',
  },
  {
    icon: FileCheck,
    title: 'Audit-ready reporting and documentation',
    description: 'Generate comprehensive compliance reports for regulators and auditors',
  },
]

const companySize = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees',
]

const states = [
  'California',
  'Colorado',
  'Illinois',
  'Maryland',
  'New Jersey',
  'New York',
  'Texas',
  'Washington',
  'Other',
]

export default function DemoPage() {
  return (
    <div className="bg-white">
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See EmployArmor in Action
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-4">
            Book a personalized 15-minute demo and see how EmployArmor simplifies AI hiring compliance across every state law, tool, and regulation.
          </p>
          <p className="text-lg text-blue-600 font-medium">
            No sales pressure. No long presentations. Just a practical walkthrough of how we solve your compliance challenges.
          </p>
        </div>
      </section>

      {/* What You'll See */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            What You'll See in the Demo
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            We'll walk you through the exact features that save compliance teams 20+ hours per week
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {demoFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request Form */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Request Your Demo
            </h2>
            
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demo-name">Name *</Label>
                  <Input 
                    id="demo-name" 
                    placeholder="Your full name" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="demo-email">Email *</Label>
                  <Input 
                    id="demo-email" 
                    type="email" 
                    placeholder="you@company.com" 
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="demo-company">Company Name *</Label>
                <Input 
                  id="demo-company" 
                  placeholder="Your company" 
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="demo-company-size">Company Size</Label>
                <select
                  id="demo-company-size"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select company size</option>
                  {companySize.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Which states do you hire in? *</Label>
                <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {states.map((state) => (
                    <label
                      key={state}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        value={state}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {state}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="demo-message">What would you like to focus on?</Label>
                <textarea
                  id="demo-message"
                  rows={3}
                  placeholder="Tell us about your compliance challenges, tools you use, or specific questions..."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                Request Demo
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                . We'll contact you within 24 hours to schedule your demo.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-medium">Trusted by HR teams nationwide</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Companies Taking Compliance Seriously
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From startups to enterprises, EmployArmor helps organizations of all sizes navigate AI hiring regulations with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
              <p className="text-gray-600">Hours saved per week on compliance</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">6+</div>
              <p className="text-gray-600">State laws monitored automatically</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600">Audit-ready documentation</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Demo FAQ
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prefer to explore on your own first?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Take our free 2-minute compliance assessment and get instant insights into your compliance status.
          </p>
          <Link href="/scorecard">
            <Button variant="outline" className="text-lg px-8 py-6">
              <CheckCircle className="w-5 h-5 mr-2" />
              Get Your Free Compliance Score
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
