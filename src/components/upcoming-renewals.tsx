"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, ArrowRight, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import type { ComplianceDocument } from "@/types"
import { DOCUMENT_TYPE_LABELS } from "@/types"

interface RenewalWithDays extends ComplianceDocument {
  daysRemaining: number
}

interface UpcomingRenewalsProps {
  renewals: RenewalWithDays[]
}

function getUrgencyConfig(daysRemaining: number) {
  if (daysRemaining < 0) {
    return {
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      icon: AlertTriangle,
      label: 'Expired',
    }
  }
  if (daysRemaining <= 7) {
    return {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: AlertTriangle,
      label: `${daysRemaining} days`,
    }
  }
  if (daysRemaining <= 30) {
    return {
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: Clock,
      label: `${daysRemaining} days`,
    }
  }
  if (daysRemaining <= 60) {
    return {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: Clock,
      label: `${daysRemaining} days`,
    }
  }
  return {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    label: `${daysRemaining} days`,
  }
}

function getStatusDot(daysRemaining: number) {
  if (daysRemaining < 0) return '🔴'
  if (daysRemaining <= 7) return '🔴'
  if (daysRemaining <= 30) return '🟡'
  return '🟢'
}

export function UpcomingRenewals({ renewals }: UpcomingRenewalsProps) {
  if (!renewals || renewals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents expiring soon</p>
            <Link href="/compliance/documents">
              <Button variant="link" size="sm">Add compliance documents</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Renewals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {renewals.slice(0, 5).map((renewal) => {
            const urgency = getUrgencyConfig(renewal.daysRemaining)
            const statusDot = getStatusDot(renewal.daysRemaining)
            const Icon = urgency.icon

            return (
              <div
                key={renewal.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${urgency.bgColor} ${urgency.borderColor}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{statusDot}</span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {DOCUMENT_TYPE_LABELS[renewal.document_type] || renewal.document_type}
                    </div>
                    <div className="text-sm text-gray-600">
                      {renewal.jurisdiction?.toUpperCase() || 'General'}
                      {' · '}
                      Expires {new Date(renewal.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 font-medium ${urgency.color}`}>
                    <Icon className="w-4 h-4" />
                    <span>{urgency.label}</span>
                  </div>
                  <Link href="/compliance/documents">
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      {renewal.daysRemaining < 0 ? 'Renew Now' : 'Schedule'}
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {renewals.length > 5 && (
          <Link href="/compliance/documents">
            <Button variant="link" className="mt-4 p-0">
              View all {renewals.length} documents <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}

        <Link href="/compliance/documents">
          <Button variant="outline" className="w-full mt-4">
            <FileText className="w-4 h-4 mr-2" />
            Manage Documents
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
