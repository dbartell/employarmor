import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getTrainingModules,
  getOrgEnrollments,
  getOrgTeamMembers,
  getEnrollmentStats
} from '@/lib/actions/training-modules'
import { getRecommendedModules } from '@/lib/actions/training-triggers'
import TrainingAdminClient from './training-admin-client'
import { checkSubscription } from '@/lib/subscription'
import { Paywall } from '@/components/paywall'

export default async function TrainingAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, organization_id, role')
    .eq('user_id', user.id)
    .single()

  if (!profile || !profile.organization_id) {
    redirect('/dashboard')
  }

  // Check if user is admin/owner
  const isAdmin = profile.role === 'owner' || profile.role === 'admin'
  
  if (!isAdmin) {
    // Non-admins should see the personal training view
    redirect('/portal/training')
  }

  // Check subscription status
  const subscription = await checkSubscription(user.id)

  // Fetch all data for admin dashboard
  const [
    { modules },
    { enrollments },
    { members },
    { recommended }
  ] = await Promise.all([
    getTrainingModules(),
    getOrgEnrollments(profile.organization_id),
    getOrgTeamMembers(profile.organization_id),
    getRecommendedModules(profile.organization_id)
  ])

  const stats = await getEnrollmentStats(profile.organization_id)

  const content = (
    <TrainingAdminClient
      modules={modules}
      enrollments={enrollments}
      teamMembers={members}
      stats={stats}
      recommendedModules={recommended || []}
      orgId={profile.organization_id}
      userId={user.id}
    />
  )

  // Wrap in paywall if no subscription
  return (
    <Paywall hasSubscription={subscription.active} plan={subscription.plan}>
      {content}
    </Paywall>
  )
}
