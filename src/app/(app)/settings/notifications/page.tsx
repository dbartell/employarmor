"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save, Bell } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/actions/notification-preferences"

interface ToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

const ADMIN_TOGGLES = [
  { key: "training_completed" as const, label: "Training completed", description: "When an employee completes assigned training", category: "Training" },
  { key: "disclosure_signed" as const, label: "Disclosure signed", description: "When an employee signs a disclosure document", category: "Compliance Alerts" },
  { key: "tool_request_submitted" as const, label: "Tool request submitted", description: "When an employee submits a new tool request", category: "Team Activity" },
  { key: "employee_joined" as const, label: "Employee joined", description: "When someone accepts an invite and joins the team", category: "Team Activity" },
  { key: "compliance_score_alert" as const, label: "Compliance score alert", description: "When your compliance score drops below 50%", category: "Compliance Alerts" },
]

const EMPLOYEE_TOGGLES = [
  { key: "training_assigned" as const, label: "Training assigned", description: "When new training is assigned to you", category: "Training" },
  { key: "training_reminder" as const, label: "Training reminders", description: "Reminders about upcoming training deadlines", category: "Training" },
  { key: "tool_request_decided" as const, label: "Tool request decisions", description: "When your tool request is approved or denied", category: "Team Activity" },
  { key: "disclosure_assigned" as const, label: "Disclosure assigned", description: "When a new disclosure is assigned for your signature", category: "Compliance Alerts" },
]

const SYSTEM_TOGGLES = [
  { key: "renewal_reminders" as const, label: "Renewal reminders", description: "Reminders about expiring documents and certifications", category: "System" },
  { key: "drip_emails" as const, label: "Product updates", description: "Tips, feature updates, and compliance news", category: "System" },
]

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [role, setRole] = useState<string>("member")

  useEffect(() => {
    loadPrefs()
  }, [])

  const loadPrefs = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id, role")
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      setLoading(false)
      return
    }

    setOrgId(membership.organization_id)
    setRole(membership.role)

    const { preferences } = await getNotificationPreferences(membership.organization_id)
    setPrefs(preferences)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!orgId || !prefs) return
    setSaving(true)
    await updateNotificationPreferences(orgId, prefs)
    setSaving(false)
  }

  const updatePref = (key: keyof NotificationPreferences, value: boolean) => {
    if (!prefs) return
    setPrefs({ ...prefs, [key]: value })
  }

  const isAdmin = role === "owner" || role === "admin"

  type ToggleDef = { key: keyof NotificationPreferences; label: string; description: string; category: string }

  const allToggles: ToggleDef[] = [
    ...(isAdmin ? ADMIN_TOGGLES : []),
    ...EMPLOYEE_TOGGLES,
    ...SYSTEM_TOGGLES,
  ]

  const grouped: Record<string, ToggleDef[]> = {}
  for (const t of allToggles) {
    if (!grouped[t.category]) grouped[t.category] = []
    grouped[t.category].push(t)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Notification Preferences</h1>
          <p className="text-gray-500 text-sm">Choose which email notifications you receive</p>
        </div>
      </div>

      {!prefs ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No organization found. Join or create an organization first.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {Object.entries(grouped).map(([category, toggles]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                {toggles.map((toggle) => (
                  <Toggle
                    key={toggle.key}
                    label={toggle.label}
                    description={toggle.description}
                    checked={prefs[toggle.key]}
                    onChange={(v) => updatePref(toggle.key, v)}
                  />
                ))}
              </CardContent>
            </Card>
          ))}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Preferences
          </Button>
        </>
      )}
    </div>
  )
}
