import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkSubscription } from '@/lib/subscription'

export default async function DocumentsLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check subscription - but we'll pass this down via context or props
  // For now, just do auth check here, subscription check in each page
  return <>{children}</>
}
