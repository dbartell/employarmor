"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import { UrgencyAlert } from "@/lib/alerts"

interface UrgencyAlertsProps {
  alerts: UrgencyAlert[]
}

export function UrgencyAlerts({ alerts }: UrgencyAlertsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visibleAlerts = alerts.filter(a => !dismissedIds.has(a.id))

  if (visibleAlerts.length === 0) return null

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]))
  }

  const severityStyles = {
    critical: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-800',
      text: 'text-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700 text-white'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <div className="space-y-3 mb-6">
      {visibleAlerts.map(alert => {
        const styles = severityStyles[alert.severity]
        return (
          <div
            key={alert.id}
            className={`relative p-4 rounded-lg border ${styles.container}`}
          >
            <button
              onClick={() => handleDismiss(alert.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-8">
              <AlertTriangle className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h4 className={`font-semibold ${styles.title}`}>{alert.title}</h4>
                <p className={`text-sm ${styles.text} mt-1`}>{alert.description}</p>
                <Link href={alert.href}>
                  <Button size="sm" className={`mt-3 ${styles.button}`}>
                    {alert.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
