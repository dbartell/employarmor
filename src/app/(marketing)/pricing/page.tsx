'use client'

import { useState } from 'react'
import { Check, Users, Building, Building2, Landmark, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const oneTimePlans = [
  {
    name: 'Compliance Training',
    price: '$299',
    period: 'one-time',
    description: 'Perfect for teams unsure if they need ongoing compliance.',
    icon: BookOpen,
    priceId: 'training',
    features: [
      'HR team training course (self-paced)',
      'Certificate of completion',
      '"Are we compliant?" assessment',
      'AI tool classification guide',
      '30-day email support',
    ],
    cta: 'Get Training',
    highlighted: false,
  },
]

const monthlyPlans = [
  {
    name: 'Starter',
    price: '$149',
    period: '/month',
    description: 'For small teams under 50 employees.',
    icon: Users,
    priceId: 'starter',
    features: [
      'Up to 50 employees',
      'Compliance dashboard',
      'Training module + certificates',
      'Document generator (basic)',
      'Single state coverage',
      'Email support',
      'Monthly compliance updates',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$349',
    period: '/month',
    description: 'For growing companies with 50-250 employees.',
    badge: 'Most Popular',
    icon: Building,
    priceId: 'growth',
    features: [
      'Up to 250 employees',
      'Everything in Starter',
      'ATS integrations (Greenhouse, Lever)',
      'Consent tracking & management',
      'Multi-state coverage (up to 5)',
      'Priority support',
      'Quarterly compliance reviews',
      'Audit preparation tools',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Scale',
    price: '$749',
    period: '/month',
    description: 'For larger teams with 250-1000 employees.',
    icon: Building2,
    priceId: 'scale',
    features: [
      'Up to 1,000 employees',
      'Everything in Growth',
      'Unlimited state coverage',
      'Advanced ATS integrations',
      'Custom document templates',
      'API access',
      'Dedicated success manager',
      'Monthly compliance reviews',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: '$2,499',
    period: '/month+',
    description: 'For large organizations with 1000+ employees.',
    icon: Landmark,
    priceId: 'enterprise',
    features: [
      'Unlimited employees',
      'Everything in Scale',
      'SSO / SAML integration',
      'Custom policies & workflows',
      'Dedicated account team',
      'Custom SLA guarantee',
      'On-site training available',
      'Legal review support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string) => {
    if (priceId === 'enterprise') {
      window.location.href = 'mailto:hello@aihirelaw.com?subject=AIHireLaw Enterprise Inquiry'
      return
    }

    setLoading(priceId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { url, error } = await res.json()
      if (error) {
        window.location.href = '/signup?redirect=/pricing'
        return
      }
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get compliant before the Feb 1 Colorado deadline. No hidden fees. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Urgency Banner */}
      <section className="py-4 bg-amber-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-800">
            ⏰ <strong>Colorado AI Act</strong> goes into effect{' '}
            <strong>February 1, 2026</strong>. Only{' '}
            <strong>
              {Math.ceil(
                (new Date('2026-02-01').getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </strong>{' '}
            to get compliant.
          </p>
        </div>
      </section>

      {/* One-Time Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Not sure if you need ongoing compliance?
            </h2>
            <p className="text-gray-600">
              Start with training to learn what applies to you
            </p>
          </div>
          
          <div className="grid gap-6 max-w-md mx-auto">
            {oneTimePlans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl p-6 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <plan.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.period}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                </div>

                <button
                  onClick={() => handleCheckout(plan.priceId)}
                  disabled={loading === plan.priceId}
                  className="w-full py-3 px-4 rounded-lg font-semibold mb-6 bg-gray-100 text-gray-900 hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {loading === plan.priceId ? 'Loading...' : plan.cta}
                </button>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Plans */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ongoing Compliance & Monitoring
            </h2>
            <p className="text-gray-600">
              Stay compliant as laws evolve. Cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {monthlyPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-[1.02]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.badge && (
                  <span className="inline-block bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-3">
                    {plan.badge}
                  </span>
                )}
                
                <div className="flex items-center gap-2 mb-2">
                  <plan.icon className={`w-5 h-5 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`} />
                  <h3 className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                </div>
                
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-500'}>
                    {plan.period}
                  </span>
                </div>

                <button
                  onClick={() => handleCheckout(plan.priceId)}
                  disabled={loading === plan.priceId}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold mb-6 transition ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50`}
                >
                  {loading === plan.priceId ? 'Loading...' : plan.cta}
                </button>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlighted ? 'text-white' : 'text-green-600'
                        }`}
                      />
                      <span
                        className={`text-sm ${plan.highlighted ? 'text-white' : 'text-gray-600'}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Note */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Not sure which plan is right for you?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Just need training?</p>
                <p className="text-gray-900">→ Start with <strong>Compliance Training</strong> ($299)</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Want full compliance + ongoing support?</p>
                <p className="text-gray-900">→ Choose a <strong>monthly plan</strong> — includes audit, docs, training & more</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I'm not using AI in hiring yet?
              </h3>
              <p className="text-gray-600">
                Start with our Compliance Training ($299). Your HR team will learn 
                what triggers the law, get certified, and you'll have documentation 
                proving your team is trained — even if you're not actively using AI tools.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes. Monthly plans have no contracts or cancellation fees. Cancel 
                from your dashboard anytime and you won't be charged again.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's included in ATS integrations?
              </h3>
              <p className="text-gray-600">
                Growth plan and above includes native integrations with Greenhouse, 
                Lever, Workday, and more. Automatically sync candidate data and 
                manage consent within your existing workflow.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I need this if I already use HireVue/Workday?
              </h3>
              <p className="text-gray-600">
                Yes. Those tools may handle their own compliance, but you're 
                responsible for your process: collecting consent, posting notices, 
                training your team, and keeping records. That's what AIHireLaw handles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I upgrade later?
              </h3>
              <p className="text-gray-600">
                Absolutely. Start with any plan and upgrade anytime. If you start 
                with training, we'll credit your purchase toward a monthly plan.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What states are covered?
              </h3>
              <p className="text-gray-600">
                We cover all states with AI hiring laws: Colorado, New York City, 
                Illinois, Maryland, California, and more as they pass. Higher tiers 
                include multi-state coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get compliant?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with our free scorecard or jump straight in.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/scorecard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Free Compliance Scorecard
              </Button>
            </Link>
            <button
              onClick={() => handleCheckout('growth')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-400 font-semibold"
            >
              Start with Growth Plan <ArrowRight className="inline ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
