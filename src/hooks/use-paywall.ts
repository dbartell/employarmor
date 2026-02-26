"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface UsePaywallReturn {
  canAct: boolean
  loading: boolean
  showPaywall: () => void
  dismissPaywall: () => void
  paywallOpen: boolean
  /** Wraps an action — runs it if subscribed, otherwise shows paywall */
  gateAction: (action: () => void) => void
}

export function usePaywall(): UsePaywallReturn {
  const [canAct, setCanAct] = useState(false)
  const [loading, setLoading] = useState(true)
  const [paywallOpen, setPaywallOpen] = useState(false)

  useEffect(() => {
    async function checkSubscription() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setCanAct(false)
          setLoading(false)
          return
        }

        const { data: org } = await supabase
          .from("organizations")
          .select("subscription_status")
          .eq("id", user.id)
          .single()

        const status = org?.subscription_status
        setCanAct(status === "active" || status === "lifetime")
      } catch {
        setCanAct(false)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [])

  const showPaywall = useCallback(() => setPaywallOpen(true), [])
  const dismissPaywall = useCallback(() => setPaywallOpen(false), [])

  const gateAction = useCallback(
    (action: () => void) => {
      if (canAct) {
        action()
      } else {
        setPaywallOpen(true)
      }
    },
    [canAct]
  )

  return { canAct, loading, showPaywall, dismissPaywall, paywallOpen, gateAction }
}
