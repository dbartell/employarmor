import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getEmployeeProfile, ensureOwnerProfile } from "@/lib/auth/roles"
import { getCourseWithProgress } from "@/lib/actions/portal-training"
import CourseClient from "./course-client"

interface CoursePageProps {
  params: { courseId: string }
}

export default async function CoursePage({ params }: CoursePageProps) {
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

  const { course, assignment } = await getCourseWithProgress(params.courseId, profile.id)

  if (!course) {
    redirect('/portal/training')
  }

  return <CourseClient course={course} assignment={assignment} />
}
