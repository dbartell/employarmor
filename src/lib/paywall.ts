// Paywall logic for trial users
// Triggers after first document generated OR trial day 3

export interface PaywallStatus {
  shouldShowPaywall: boolean
  reason: 'document_generated' | 'trial_day_3' | null
  trialDaysRemaining: number
  documentsGenerated: number
  isSubscribed: boolean
}

// Check if user should see the paywall
export function checkPaywallStatus(params: {
  trialStartedAt: Date | null
  documentsGenerated: number
  subscriptionStatus: string | null
}): PaywallStatus {
  const { trialStartedAt, documentsGenerated, subscriptionStatus } = params

  // Active subscribers never see paywall
  if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
    return {
      shouldShowPaywall: false,
      reason: null,
      trialDaysRemaining: 0,
      documentsGenerated,
      isSubscribed: true,
    }
  }

  // No trial started = no paywall (shouldn't happen)
  if (!trialStartedAt) {
    return {
      shouldShowPaywall: false,
      reason: null,
      trialDaysRemaining: 14,
      documentsGenerated,
      isSubscribed: false,
    }
  }

  const now = new Date()
  const trialStart = new Date(trialStartedAt)
  const daysSinceTrialStart = Math.floor(
    (now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24)
  )
  const trialDaysRemaining = Math.max(0, 14 - daysSinceTrialStart)

  // Check paywall triggers
  let shouldShowPaywall = false
  let reason: 'document_generated' | 'trial_day_3' | null = null

  // Trigger 1: First document generated
  if (documentsGenerated >= 1) {
    shouldShowPaywall = true
    reason = 'document_generated'
  }

  // Trigger 2: Trial day 3+
  if (daysSinceTrialStart >= 3) {
    shouldShowPaywall = true
    reason = reason || 'trial_day_3'
  }

  // Don't show paywall if trial has expired (show different message)
  if (trialDaysRemaining === 0) {
    shouldShowPaywall = true // But with expired state
  }

  return {
    shouldShowPaywall,
    reason,
    trialDaysRemaining,
    documentsGenerated,
    isSubscribed: false,
  }
}

// Get paywall message based on status
export function getPaywallMessage(status: PaywallStatus): {
  title: string
  description: string
  ctaText: string
  urgency: 'low' | 'medium' | 'high'
} {
  if (status.trialDaysRemaining === 0) {
    return {
      title: 'Your trial has ended',
      description: 'Upgrade now to continue using AIHireLaw and keep your compliance documents.',
      ctaText: 'Upgrade to Continue',
      urgency: 'high',
    }
  }

  if (status.reason === 'document_generated') {
    return {
      title: 'You\'ve created your first document! 🎉',
      description: `Upgrade now to unlock unlimited documents and team access. You have ${status.trialDaysRemaining} days left in your trial.`,
      ctaText: 'Upgrade Now',
      urgency: 'medium',
    }
  }

  return {
    title: 'Ready to get fully compliant?',
    description: `You have ${status.trialDaysRemaining} days left in your trial. Upgrade for full access to all features.`,
    ctaText: 'Upgrade Now',
    urgency: 'low',
  }
}

// Check if a specific action requires paywall check
export function requiresPaywallCheck(action: string): boolean {
  const paywallActions = [
    'generate_document',
    'invite_team',
    'download_certificate',
    'export_audit',
  ]
  return paywallActions.includes(action)
}
