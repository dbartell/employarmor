import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyEnrollments } from '@/lib/actions/training-modules'
import PersonalTrainingClient from './personal-training-client'

export default async function PersonalTrainingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's training enrollments
  const { enrollments } = await getMyEnrollments(user.id)

  return <PersonalTrainingClient enrollments={enrollments} />
}
