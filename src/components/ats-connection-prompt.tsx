"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Link2, ArrowRight, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { aiHiringTools } from "@/data/tools"

// Map tool IDs to their display names and Merge.dev integration slugs
const ATS_INTEGRATIONS: Record<string, { name: string; slug: string; logo?: string }> = {
  'greenhouse': { name: 'Greenhouse', slug: 'greenhouse', logo: '/logos/greenhouse.svg' },
  'lever': { name: 'Lever', slug: 'lever', logo: '/logos/lever.svg' },
  'workday': { name: 'Workday', slug: 'workday', logo: '/logos/workday.svg' },
  'bamboohr': { name: 'BambooHR', slug: 'bamboohr', logo: '/logos/bamboohr.svg' },
}

interface ATSConnectionPromptProps {
  selectedTools: string[]
  orgId: string
  onComplete?: () => void
  onSkip?: () => void
}

export function ATSConnectionPrompt({
  selectedTools,
  orgId,
  onComplete,
  onSkip,
}: ATSConnectionPromptProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState<string | null>(null)

  // Find ATS tools from the selected tools
  const atsTools = selectedTools
    .map(toolId => {
      const tool = aiHiringTools.find(t => t.id === toolId)
      if (!tool || tool.category !== 'ATS') return null
      const integration = ATS_INTEGRATIONS[toolId]
      return integration ? { id: toolId, ...integration, toolName: tool.name } : null
    })
    .filter((t): t is NonNullable<typeof t> => t !== null)

  // No ATS tools selected - don't render
  if (atsTools.length === 0) {
    return null
  }

  const handleConnect = async (atsSlug: string) => {
    setConnecting(atsSlug)
    setLoading(true)

    try {
      // In production, this would redirect to Merge.dev link flow
      // For now, redirect to integrations page
      router.push(`/settings/integrations?connect=${atsSlug}`)
    } catch (error) {
      console.error('Failed to start connection:', error)
    } finally {
      setLoading(false)
      setConnecting(null)
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      // Default: just continue to dashboard
      router.push('/dashboard')
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 max-w-lg mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Link2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Connect Your ATS</h3>
            <p className="text-sm text-gray-500">Auto-track consent for candidates</p>
          </div>
        </div>
        <button
          onClick={handleSkip}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Connect your ATS to automatically sync candidates and track consent status. 
        This takes 2 minutes and saves hours of manual work.
      </p>

      <div className="space-y-3 mb-4">
        {atsTools.map(ats => (
          <button
            key={ats.id}
            onClick={() => handleConnect(ats.slug)}
            disabled={loading}
            className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              {ats.logo ? (
                <img src={ats.logo} alt={ats.name} className="w-8 h-8" />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                  {ats.name.charAt(0)}
                </div>
              )}
              <span className="font-medium text-gray-900">Connect {ats.name}</span>
            </div>
            {connecting === ats.slug ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <ArrowRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span>Secure OAuth connection · Read-only access · Your data stays private</span>
      </div>

      <button
        onClick={handleSkip}
        className="w-full text-sm text-gray-500 hover:text-gray-700"
      >
        Skip for now — I'll set this up later
      </button>
    </div>
  )
}

// Wrapper component that fetches org data and shows prompt if needed
export function ATSConnectionCheck({ orgId }: { orgId: string }) {
  // This would be used in the onboarding flow
  // Fetches quiz_tools from org and shows prompt if ATS was selected
  return null
}
