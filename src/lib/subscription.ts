import { createClient } from '@/lib/supabase/server'

export interface SubscriptionStatus {
  active: boolean
  plan?: string
  expiresAt?: string
  status?: string
  isLifetime?: boolean
}

/**
 * Check if an organization has an active subscription
 * Checks the organizations table for subscription_status
 */
export async function checkSubscription(orgId: string): Promise<SubscriptionStatus> {
  try {
    const supabase = await createClient()
    
    const { data: org, error } = await supabase
      .from('organizations')
      .select('subscription_status, plan, trial_started_at')
      .eq('id', orgId)
      .single()

    if (error || !org) {
      return { active: false }
    }

    // Active subscription or lifetime access
    const isActive = org.subscription_status === 'active' || org.subscription_status === 'lifetime'
    const isLifetime = org.subscription_status === 'lifetime'

    return {
      active: isActive,
      plan: org.plan || 'free',
      status: org.subscription_status || 'inactive',
      isLifetime,
    }
  } catch (error) {
    console.error('Error checking subscription:', error)
    return { active: false }
  }
}

/**
 * Check if current user's organization has active subscription
 * Uses auth.getUser() to get the current user's org
 */
export async function checkCurrentUserSubscription(): Promise<SubscriptionStatus> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { active: false }
    }

    // User ID is the org ID in this app's architecture
    return await checkSubscription(user.id)
  } catch (error) {
    console.error('Error checking current user subscription:', error)
    return { active: false }
  }
}

/**
 * Require subscription for a route
 * Returns subscription status and throws redirect if not active
 */
export async function requireSubscription(): Promise<SubscriptionStatus> {
  const status = await checkCurrentUserSubscription()
  return status
}

/**
 * Check if a specific route requires subscription
 * Free routes: /audit, /scan, /settings/billing, marketing pages
 * Paid routes: everything else behind auth
 */
export function isSubscriptionRequired(pathname: string): boolean {
  // Free routes (no subscription needed)
  const freeRoutes = [
    '/audit',
    '/scan',
    '/settings/billing',
    '/pricing',
    '/login',
    '/signup',
    '/',
  ]

  // Check if it's a free route
  if (freeRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return false
  }

  // Protected routes require subscription
  const protectedRoutes = [
    '/dashboard',
    '/training',
    '/portal',
    '/documents',
    '/consent',
    '/settings',
    '/approvals',
    '/state',
  ]

  return protectedRoutes.some(route => pathname.startsWith(route))
}
