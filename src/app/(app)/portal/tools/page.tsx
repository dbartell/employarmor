import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getEmployeeProfile, ensureOwnerProfile } from "@/lib/auth/roles"
import { getEmployeeToolRequests } from "@/lib/actions/portal-tool-requests"
import ToolsClient from "./tools-client"

export default async function PortalToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get employee profile
  let profile = await getEmployeeProfile(user.id, user.id)
  
  if (!profile) {
    const { data: profiles } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (profiles && profiles.length > 0) {
      profile = profiles[0]
    } else {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser?.email) {
        profile = await ensureOwnerProfile(user.id, user.id, authUser.email)
      }
    }
  }

  if (!profile) {
    redirect('/dashboard')
  }

  // Fetch tool requests
  const { requests } = await getEmployeeToolRequests(profile.id, profile.organization_id)

  return <ToolsClient requests={requests} employeeId={profile.id} organizationId={profile.organization_id} />
}
