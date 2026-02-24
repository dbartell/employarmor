import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FAQSchema } from '@/components/faq-schema'
import { Mail, Send, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | EmployArmor',
  description:
    'Get in touch with EmployArmor for AI hiring compliance support. Contact our team for sales inquiries, support, or to schedule a demo.',
}

const faqs = [
  {
    question: 'How quickly do you respond?',
    answer: 'We respond to all inquiries within 24 hours during business days (Monday-Friday). For urgent compliance questions, our Pro and Enterprise customers have access to priority support with same-day response times.',
  },
  {
    question: 'Do you offer custom plans?',
    answer: 'Yes! We offer custom Enterprise plans tailored to your organization\'s specific needs, including multi-state compliance, custom integrations, dedicated account management, and white-label solutions. Contact us to discuss your requirements.',
  },
  {
    question: 'Can I get a compliance assessment first?',
    answer: 'Absolutely. We offer a free 2-minute compliance scorecard that gives you an instant assessment of your AI hiring compliance status. For a more comprehensive assessment, schedule a demo and our team will walk through your specific situation and provide personalized recommendations.',
  },
]

export default function ContactPage() {
  return (
    <div className="bg-white">
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have questions about AI hiring compliance? We're here to help. Reach out to our team and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Email */}
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 mb-4">
                For general inquiries, support questions, or technical assistance.
              </p>
              <a
                href="mailto:support@employarmor.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                support@employarmor.com
              </a>
            </Card>

            {/* Sales Inquiry Form */}
            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sales Inquiry
              </h3>
              <p className="text-gray-600 mb-4">
                Interested in EmployArmor for your organization? Fill out our sales form.
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-sm">Name</Label>
                  <Input id="name" placeholder="Your name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm">Company</Label>
                  <Input id="company" placeholder="Company name" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm">Message</Label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Tell us about your needs..."
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
              </div>
            </Card>

            {/* Schedule a Demo */}
            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Schedule a Demo
              </h3>
              <p className="text-gray-600 mb-4">
                See EmployArmor in action with a personalized 15-minute demo from our team.
              </p>
              <Link href="/demo">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Demo
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Common questions about getting in touch and our services
          </p>
          
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Not ready to contact us yet?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Take our free 2-minute compliance assessment to see where you stand.
          </p>
          <Link href="/scorecard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Get Your Free Compliance Score
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
