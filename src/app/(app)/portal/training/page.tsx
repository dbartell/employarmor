import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyEnrollments } from '@/lib/actions/training-modules'
import { getRecommendedModules } from '@/lib/actions/training-triggers'
import PersonalTrainingClient from './personal-training-client'

export default async function PersonalTrainingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile for org context
  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('user_id', user.id)
    .single()

  // Fetch user's training enrollments
  const { enrollments } = await getMyEnrollments(user.id)

  // Get recommended modules for the org
  let recommended: any[] = []
  if (profile?.organization_id) {
    const { recommended: recs } = await getRecommendedModules(profile.organization_id)
    recommended = recs || []
  }

  return (
    <PersonalTrainingClient 
      enrollments={enrollments} 
      userId={user.id}
      recommendedModules={recommended}
    />
  )
}
