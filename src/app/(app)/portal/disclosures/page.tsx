import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getEmployeeProfile, ensureOwnerProfile } from "@/lib/auth/roles"
import { getEmployeeDisclosures, ensureStandardDisclosures } from "@/lib/actions/portal-disclosures"
import DisclosuresClient from "./disclosures-client"

export default async function PortalDisclosuresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get employee profile - try org ID as user.id first (for owners)
  let profile = await getEmployeeProfile(user.id, user.id)
  
  // If not found, search for their profile across orgs
  if (!profile) {
    const { data: profiles } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (profiles && profiles.length > 0) {
      profile = profiles[0]
    } else {
      // Special case for owner/admin - auto-create profile
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser?.email) {
        profile = await ensureOwnerProfile(user.id, user.id, authUser.email)
      }
    }
  }

  if (!profile) {
    redirect('/dashboard') // No employee profile, redirect to admin
  }

  // Ensure standard disclosures exist
  await ensureStandardDisclosures(profile.id, profile.organization_id)
  
  // Fetch disclosures
  const { disclosures } = await getEmployeeDisclosures(profile.id, profile.organization_id)

  return <DisclosuresClient disclosures={disclosures} />
}
