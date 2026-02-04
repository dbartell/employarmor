"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Sparkles, Check, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaywallStatus, getPaywallMessage } from "@/lib/paywall"

interface PaywallModalProps {
  status: PaywallStatus
  onClose?: () => void
  onUpgrade?: () => void
}

const FEATURES = [
  "Unlimited compliance documents",
  "Team training & certificates",
  "ATS integrations",
  "Consent tracking",
  "Quarterly audit reminders",
  "Priority support",
]

export function PaywallModal({ status, onClose, onUpgrade }: PaywallModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const message = getPaywallMessage(status)

  const handleUpgrade = async () => {
    setLoading(true)
    
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

        {/* Features */}
        <div className="px-6 py-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Everything you need:</p>
          <ul className="space-y-2">
            {FEATURES.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 space-y-3">
          <Button
            onClick={handleUpgrade}
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
              message.ctaText
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
            {status.trialDaysRemaining > 0 ? (
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

// Hook to manage paywall state
export function usePaywall() {
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
