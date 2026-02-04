// Analytics tracking for time-to-value and user journey metrics
// Currently logs to console; can be hooked up to real analytics later

export interface AnalyticsEvent {
  event: string
  userId?: string
  orgId?: string
  timestamp: string
  properties?: Record<string, unknown>
}

class Analytics {
  private queue: AnalyticsEvent[] = []

  track(event: string, properties?: Record<string, unknown>, userId?: string, orgId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId,
      orgId,
      timestamp: new Date().toISOString(),
      properties,
    }

    // Log to console for now
    console.log('[Analytics]', event, properties)
    
    // Store in queue for batch processing if needed
    this.queue.push(analyticsEvent)

    // In production, you'd send to an analytics service:
    // - Mixpanel: mixpanel.track(event, { ...properties, userId, orgId })
    // - Segment: analytics.track({ event, userId, properties })
    // - PostHog: posthog.capture(event, properties)
    
    return analyticsEvent
  }

  // Time-to-value specific events
  signupCompleted(userId: string, orgId: string, source?: string) {
    return this.track('signup_completed', { source }, userId, orgId)
  }

  firstDocumentStarted(userId: string, orgId: string, docType: string) {
    return this.track('first_document_started', { docType }, userId, orgId)
  }

  firstDocumentCompleted(userId: string, orgId: string, docType: string) {
    return this.track('first_document_completed', { docType }, userId, orgId)
  }

  quizCompleted(userId: string, orgId: string, riskScore: number, states: string[], tools: string[]) {
    return this.track('quiz_completed', { riskScore, states, tools, stateCount: states.length, toolCount: tools.length }, userId, orgId)
  }

  trialStarted(userId: string, orgId: string) {
    return this.track('trial_started', {}, userId, orgId)
  }

  paywallTriggered(userId: string, orgId: string, reason: 'document_generated' | 'trial_day_3') {
    return this.track('paywall_triggered', { reason }, userId, orgId)
  }

  paywallConverted(userId: string, orgId: string) {
    return this.track('paywall_converted', {}, userId, orgId)
  }

  paywallDismissed(userId: string, orgId: string) {
    return this.track('paywall_dismissed', {}, userId, orgId)
  }

  atsConnected(userId: string, orgId: string, provider: string) {
    return this.track('ats_connected', { provider }, userId, orgId)
  }

  trainingStarted(userId: string, orgId: string, track: string) {
    return this.track('training_started', { track }, userId, orgId)
  }

  trainingCompleted(userId: string, orgId: string, track: string) {
    return this.track('training_completed', { track }, userId, orgId)
  }

  // Calculate time-to-value metrics
  calculateTimeToFirstDocument(signupTime: string, documentCompletedTime: string): number {
    const signup = new Date(signupTime).getTime()
    const completed = new Date(documentCompletedTime).getTime()
    return Math.round((completed - signup) / 1000 / 60) // in minutes
  }

  // Get events for debugging
  getQueue() {
    return this.queue
  }

  clearQueue() {
    this.queue = []
  }
}

// Singleton instance
export const analytics = new Analytics()

// Server-side tracking function that can be imported in server components
export async function trackServerEvent(
  event: string,
  properties?: Record<string, unknown>,
  userId?: string,
  orgId?: string
) {
  // For server-side, we might want to log differently or send to a different endpoint
  console.log('[Analytics:Server]', event, { ...properties, userId, orgId })
  
  // You could also insert directly into a database here for persistence
  // await supabase.from('analytics_events').insert({ event, properties, user_id: userId, org_id: orgId })
}
