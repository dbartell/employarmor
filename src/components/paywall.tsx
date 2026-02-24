"use client"

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Sparkles, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PaywallProps {
  children: ReactNode
  hasSubscription: boolean
  plan?: string
  showPreview?: boolean // If true, show blurred content behind paywall
}

const FEATURES = [
  'Generate unlimited compliance documents',
  'Employee training & certification tracking',
  'Multi-state compliance coverage',
  'Consent & disclosure management',
  'Audit trail & reporting',
  'Team collaboration tools',
  'Priority support',
]

/**
 * Paywall wrapper component
 * Shows upgrade prompt if user doesn't have active subscription
 * Otherwise renders children normally
 */
export function Paywall({ children, hasSubscription, plan, showPreview = false }: PaywallProps) {
  const router = useRouter()

  // User has subscription - render content normally
  if (hasSubscription) {
    return <>{children}</>
  }

  // User needs subscription - show paywall
  return (
    <div className="relative min-h-[600px]">
      {/* Blurred preview of content */}
      {showPreview && (
        <div className="blur-sm pointer-events-none select-none opacity-40">
          {children}
        </div>
      )}

      {/* Paywall overlay */}
      <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center p-6`}>
        <Card className="max-w-2xl w-full border-2 border-blue-200 shadow-2xl">
          <CardContent className="pt-8 pb-8">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              Unlock the Full Platform
            </h2>
            <p className="text-center text-gray-600 mb-8 text-lg">
              Get instant access to all compliance tools, training modules, and document generation.
            </p>

            {/* Pricing */}
            <div className="text-center mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                $199
                <span className="text-2xl font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Everything you need for AI hiring compliance</p>
            </div>

            {/* Features */}
            <div className="mb-8 space-y-3">
              <p className="font-semibold text-gray-900 mb-4 text-center">What's included:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={() => router.push('/signup')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full h-12"
                onClick={() => router.push('/pricing')}
              >
                View Pricing Details
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                <strong>No credit card required</strong> for trial · Cancel anytime · SOC 2 compliant
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Inline paywall banner (less intrusive)
 * Good for showing upgrade prompts on partially accessible pages
 */
export function PaywallBanner({ plan }: { plan?: string }) {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Upgrade to unlock all features</h3>
            <p className="text-white/90">Get full access to compliance tools, training, and support</p>
          </div>
        </div>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => router.push('/signup')}
          className="flex-shrink-0"
        >
          Start Free Trial
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

/**
 * Feature locked card
 * Shows when a specific feature is locked behind subscription
 */
export function FeatureLockedCard({ 
  title, 
  description, 
  icon: Icon = Shield 
}: { 
  title: string
  description: string
  icon?: any
}) {
  const router = useRouter()

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        <Button onClick={() => router.push('/signup')}>
          <Sparkles className="w-4 h-4 mr-2" />
          Unlock Feature
        </Button>
      </CardContent>
    </Card>
  )
}
