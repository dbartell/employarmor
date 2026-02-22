'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sectionApplies, getMissingStates } from '@/data/compliance-sections'
import { Info } from 'lucide-react'

// Map state codes to readable names
const STATE_NAMES: Record<string, string> = {
  IL: 'Illinois', NYC: 'New York City', CO: 'Colorado', CA: 'California',
  MD: 'Maryland', TX: 'Texas', WA: 'Washington', CT: 'Connecticut',
  NV: 'Nevada', RI: 'Rhode Island',
}

interface Props {
  sectionHref: string
}

export function ApplicabilityBanner({ sectionHref }: Props) {
  const [applies, setApplies] = useState<boolean | null>(null)
  const [triggerStates, setTriggerStates] = useState<string[]>([])

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: org } = await supabase
        .from('organizations')
        .select('active_states, primary_state')
        .eq('id', user.id)
        .single()

      const states = org?.active_states || [org?.primary_state || 'IL']
      const doesApply = sectionApplies(sectionHref, states)
      setApplies(doesApply)
      
      if (!doesApply) {
        setTriggerStates(getMissingStates(sectionHref))
      }
    }
    check()
  }, [sectionHref])

  if (applies === null || applies === true) return null

  const stateNames = triggerStates.map(s => STATE_NAMES[s] || s).join(', ')

  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3 mb-4">
      <Info className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-700">
          This doesn&apos;t currently apply to your organization
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          This requirement is triggered when you hire in {stateNames}. 
          If you expand to those states, you&apos;ll need this.
        </p>
      </div>
    </div>
  )
}
