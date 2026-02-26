"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Sparkles, Check, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaywallStatus, getPaywallMessage, getPricingInfo } from "@/lib/paywall"
import { PRICES } from "@/lib/stripe"
import { trackEvent } from "@/components/GoogleAnalytics"

interface PaywallModalProps {
  status: PaywallStatus
  onClose?: () => void
  onUpgrade?: () => void
  isGuest?: boolean
}

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for small teams',
    features: [
      'Up to 50 employees',
      'Basic compliance documents',
      'Single state coverage',
      'Email support',
    ]
  },
  {
    name: 'Professional',
    price: '$249',
    period: '/month',
    description: 'For growing companies',
    features: [
      'Up to 250 employees',
      'Full compliance suite',
      'Multi-state coverage',
      'Priority support',
      'Team training modules',
      'Automated renewals',
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored for large organizations',
    features: [
      'Unlimited employees',
      'Dedicated compliance manager',
      'Custom integrations',
      '24/7 phone support',
      'Legal review included',
      'White-glove onboarding',
    ]
  }
]

const FEATURES = [
  "Unlimited compliance documents",
  "All required disclosure notices",
  "IL + CO + CA + NYC coverage",
  "Impact assessments (Colorado)",
  "Team training & certificates",
  "Consent tracking",
  "Annual renewal reminders",
  "Priority support",
]

const ONBOARD_STORAGE_KEY = 'employarmor_onboard_data'

export function PaywallModal({ status, onClose, onUpgrade, isGuest }: PaywallModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const message = getPaywallMessage(status)
  
  // Get pricing based on selected states
  const states = status.states || []
  const pricing = getPricingInfo(states)
  const features = FEATURES

  // Pre-fill email from localStorage for guests
  useEffect(() => {
    if (isGuest) {
      const storedData = localStorage.getItem(ONBOARD_STORAGE_KEY)
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          if (data.email) setGuestEmail(data.email)
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isGuest])

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)

    // Guest checkout flow
    if (isGuest) {
      if (!guestEmail) {
        setError('Please enter your email')
        setLoading(false)
        return
      }

      try {
        // Get quiz data from localStorage to pass along
        const storedQuizData = localStorage.getItem(ONBOARD_STORAGE_KEY)
        let quizData: { states?: string[], tools?: string[], riskScore?: number, company?: string } = {}
        if (storedQuizData) {
          try {
            const parsed = JSON.parse(storedQuizData)
            quizData = {
              states: parsed.states,
              tools: parsed.tools,
              riskScore: parsed.riskScore,
              company: parsed.company,
            }
          } catch (e) { /* ignore */ }
        }

        const priceId = PRICES.STARTER

        const res = await fetch('/api/checkout/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: guestEmail, priceId, ...quizData }),
        })

        const data = await res.json()

        if (!res.ok) {
          if (data.existingUser) {
            setError('Account exists. Please sign in first.')
            setLoading(false)
            return
          }
          setError(data.error || 'Failed to start checkout')
          setLoading(false)
          return
        }

        // Track checkout initiation
        trackEvent('begin_checkout', 'conversion', 'guest_checkout')
        
        // Redirect to Stripe checkout
        window.location.href = data.url
      } catch (err) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
      return
    }
    
    if (onUpgrade) {
      onUpgrade()
    } else {
      // Default: go to billing page
      router.push('/settings/billing?upgrade=true')
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  // Determine if modal is dismissable
  const canDismiss = status.trialDaysRemaining > 0 && status.documentsGenerated < 3

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-8 text-center ${
          message.urgency === 'high' 
            ? 'bg-gradient-to-br from-orange-500 to-red-600' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-700'
        } text-white relative`}>
          {canDismiss && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {status.reason === 'document_generated' ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <Shield className="w-8 h-8" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{message.title}</h2>
          <p className="text-white/90">{message.description}</p>
        </div>

        {/* Pricing Tiers */}
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-center font-bold text-gray-900 mb-4">Choose Your Plan</h3>
          <div className="space-y-3">
            {PRICING_TIERS.map((tier, idx) => (
              <div 
                key={tier.name}
                className={`border-2 rounded-lg p-4 ${
                  tier.popular 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {tier.popular && (
                  <div className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-lg text-gray-900">{tier.name}</div>
                    <div className="text-xs text-gray-500">{tier.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-gray-900">
                      {tier.price}<span className="text-sm font-normal text-gray-500">{tier.period}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-1 mt-3">
                  {tier.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 space-y-3">
          {isGuest && (
            <div className="space-y-2">
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          )}

          <Button
            onClick={handleUpgrade}
            disabled={loading || (isGuest && !guestEmail)}
            className="w-full h-12 text-base"
            variant="cta"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Subscribe Now — Professional $249/mo'
            )}
          </Button>

          {canDismiss && (
            <button
              onClick={handleClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Maybe later
            </button>
          )}

          <p className="text-xs text-center text-gray-500">
            {isGuest ? (
              "Create your account after checkout"
            ) : status.trialDaysRemaining > 0 ? (
              `${status.trialDaysRemaining} days left in your trial`
            ) : (
              "Your compliance progress will be saved"
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Legacy hook to manage paywall state (for existing usage)
export function usePaywallModal() {
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallStatus, setPaywallStatus] = useState<PaywallStatus | null>(null)

  const triggerPaywall = (status: PaywallStatus) => {
    setPaywallStatus(status)
    setShowPaywall(true)
  }

  const dismissPaywall = () => {
    setShowPaywall(false)
  }

  return {
    showPaywall,
    paywallStatus,
    triggerPaywall,
    dismissPaywall,
  }
}

/**
 * Standalone action-gated paywall modal.
 * Free users can VIEW everything, but when they click an action button
 * this modal appears with "Subscribe to take action" messaging.
 */
export function ActionPaywallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-8 text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Subscribe to Take Action</h2>
          <p className="text-white/90">Upgrade to generate documents, run audits, assign training, and invite team members.</p>
        </div>

        <div className="px-6 pt-6 pb-2 text-center border-b">
          <div className="text-4xl font-bold text-gray-900">
            $199<span className="text-lg font-normal text-gray-500 ml-1">/month</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">AI hiring compliance with ongoing support</p>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm font-medium text-gray-700 mb-3">What you can do:</p>
          <ul className="space-y-2">
            {FEATURES.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <Button
            onClick={() => {
              setLoading(true)
              router.push('/settings/billing?upgrade=true')
            }}
            disabled={loading}
            className="w-full h-12 text-base"
            variant="cta"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Start Now — $199/month'
            )}
          </Button>
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
