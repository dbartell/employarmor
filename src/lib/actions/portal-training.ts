"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCourseContent, type Course } from './training'
import { getQuizQuestions } from '@/lib/constants/quizzes'
import { sendEmail } from '@/lib/emails/send'
import { trainingCompletedEmail } from '@/lib/emails/notification-templates'
import { shouldNotify, getOrgAdmins } from '@/lib/emails/should-notify'

export interface TrainingAssignment {
  id: string
  organization_id: string
  employee_id: string
  training_module_id: string | null
  training_title: string | null
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue'
  assigned_at: string
  due_date: string | null
  completed_at: string | null
  score: number | null
  progress?: {
    completed_modules: number
    total_modules: number
  }
}

export async function getEmployeeTraining(employeeId: string, organizationId: string) {
  const supabase = await createClient()
  
  const { data: assignments, error } = await supabase
    .from('training_assignments')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('organization_id', organizationId)
    .order('assigned_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching training assignments:', error)
    return { assignments: [], error: error.message }
  }
  
  return { assignments: assignments || [], error: null }
}

export async function ensureStandardTraining(employeeId: string, organizationId: string) {
  const supabase = await createClient()
  
  // Standard training modules to assign
  const standardModules = [
    { id: 'ai-hiring-101', title: 'AI in Hiring 101', daysToComplete: 14 },
    { id: 'state-requirements', title: 'State Law Requirements', daysToComplete: 14 },
    { id: 'disclosure-writing', title: 'Writing Effective Disclosures', daysToComplete: 21 }
  ]
  
  // Check existing assignments
  const { data: existing } = await supabase
    .from('training_assignments')
    .select('training_module_id')
    .eq('employee_id', employeeId)
    .eq('organization_id', organizationId)
  
  const existingModules = new Set(existing?.map(a => a.training_module_id) || [])
  
  // Create missing assignments
  const assignmentsToCreate = []
  
  for (const module of standardModules) {
    if (!existingModules.has(module.id)) {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + module.daysToComplete)
      
      assignmentsToCreate.push({
        organization_id: organizationId,
        employee_id: employeeId,
        training_module_id: module.id,
        training_title: module.title,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        due_date: dueDate.toISOString()
      })
    }
  }
  
  if (assignmentsToCreate.length > 0) {
    const { error } = await supabase
      .from('training_assignments')
      .insert(assignmentsToCreate)
    
    if (error) {
      console.error('Error creating training assignments:', error)
      return { error: error.message }
    }
  }
  
  return { error: null }
}

export async function updateTrainingStatus(
  assignmentId: string,
  status: 'in_progress' | 'completed',
  score?: number
) {
  const supabase = await createClient()
  
  const updateData: any = { status }
  
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
    if (score !== undefined) {
      updateData.score = score
    }
  }
  
  const { error } = await supabase
    .from('training_assignments')
    .update(updateData)
    .eq('id', assignmentId)
  
  if (error) {
    console.error('Error updating training status:', error)
    return { error: error.message }
  }
  
  revalidatePath('/portal/training')
  revalidatePath('/portal')
  
  return { error: null }
}

export async function getCourseWithProgress(courseId: string, employeeId: string) {
  const course = await getCourseContent(courseId)
  
  if (!course) {
    return { course: null, progress: null, error: 'Course not found' }
  }
  
  // Get progress from assignment
  const supabase = await createClient()
  const { data: assignment } = await supabase
    .from('training_assignments')
    .select('*')
    .eq('training_module_id', courseId)
    .eq('employee_id', employeeId)
    .single()
  
  return { 
    course, 
    assignment: assignment || null,
    error: null 
  }
}

export async function submitQuiz(
  assignmentId: string,
  courseId: string,
  answers: number[]
): Promise<{ score: number; passed: boolean; error: string | null }> {
  const questions = getQuizQuestions(courseId)
  
  if (questions.length === 0) {
    return { score: 0, passed: false, error: 'Quiz not found' }
  }
  
  let correctCount = 0
  questions.forEach((q, index) => {
    if (answers[index] === q.correctAnswer) {
      correctCount++
    }
  })
  
  const score = Math.round((correctCount / questions.length) * 100)
  const passed = score >= 70
  
  if (passed) {
    await updateTrainingStatus(assignmentId, 'completed', score)

    // Notify admins
    try {
      const supabase = await createClient()
      const { data: assignment } = await supabase
        .from('training_assignments')
        .select('organization_id, employee_id, training_title')
        .eq('id', assignmentId)
        .single()

      if (assignment) {
        const { data: employee } = await supabase
          .from('employee_profiles')
          .select('full_name')
          .eq('id', assignment.employee_id)
          .single()

        const admins = await getOrgAdmins(assignment.organization_id)
        const completionDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })

        for (const admin of admins) {
          if (await shouldNotify(admin.userId, assignment.organization_id, 'training_completed')) {
            const email = trainingCompletedEmail({
              adminName: admin.name,
              employeeName: employee?.full_name || 'An employee',
              trackTitle: assignment.training_title || courseId,
              completionDate,
              score,
            })
            await sendEmail({ to: admin.email, subject: email.subject, html: email.html })
          }
        }
      }
    } catch (e) {
      console.error('Error sending training completion notification:', e)
    }
  }
  
  return { score, passed, error: null }
}
