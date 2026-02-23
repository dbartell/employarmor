"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCourseContent, type Course } from './training'

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

// Quiz questions for each course
const QUIZ_QUESTIONS: Record<string, Array<{
  question: string
  options: string[]
  correctAnswer: number
}>> = {
  "ai-hiring-101": [
    {
      question: "Which of the following is considered an AI hiring tool?",
      options: [
        "A manual spreadsheet for tracking candidates",
        "An automated resume screening system",
        "A paper job application form",
        "A phone directory"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the primary purpose of AI in hiring?",
      options: [
        "To completely replace human decision-making",
        "To assist with and streamline hiring processes",
        "To discriminate against certain candidates",
        "To make hiring more complicated"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is NOT typically an AI hiring tool?",
      options: [
        "Video interview analysis platform",
        "Automated skills assessment",
        "Handwritten reference letter",
        "Chatbot for candidate screening"
      ],
      correctAnswer: 2
    }
  ],
  "state-requirements": [
    {
      question: "Which state requires notification to candidates about AI use in hiring?",
      options: [
        "All of the above",
        "Illinois",
        "Colorado",
        "New York"
      ],
      correctAnswer: 0
    },
    {
      question: "What does NYC Local Law 144 require?",
      options: [
        "Banning AI in all hiring decisions",
        "Annual bias audits for automated employment decision tools",
        "Hiring only through AI systems",
        "Removing all job postings"
      ],
      correctAnswer: 1
    },
    {
      question: "When must candidates be notified about AI use under most state laws?",
      options: [
        "After they are hired",
        "Before AI processing occurs",
        "Only if they ask",
        "Never"
      ],
      correctAnswer: 1
    },
    {
      question: "What can candidates request under Colorado's AI Act?",
      options: [
        "Complete deletion of all company records",
        "Information about how AI is used and alternatives upon request",
        "Access to the AI source code",
        "A guaranteed job offer"
      ],
      correctAnswer: 1
    }
  ],
  "disclosure-writing": [
    {
      question: "Effective disclosures should be:",
      options: [
        "Written in complex legal jargon",
        "Clear, conspicuous, and in plain language",
        "Hidden in employee handbooks",
        "Provided only after hiring"
      ],
      correctAnswer: 1
    },
    {
      question: "When should AI disclosures be provided to candidates?",
      options: [
        "After the hiring decision is made",
        "Before AI processing of their information",
        "Only if the candidate complains",
        "Never"
      ],
      correctAnswer: 1
    },
    {
      question: "What should an effective AI disclosure include?",
      options: [
        "Only the name of the AI tool",
        "How the AI is used, what it evaluates, and candidate rights",
        "Just a link to the vendor website",
        "Nothing specific"
      ],
      correctAnswer: 1
    }
  ],
  "bias-prevention": [
    {
      question: "Algorithmic bias in hiring AI can result from:",
      options: [
        "Training data that reflects historical discrimination",
        "Poorly designed algorithms",
        "Lack of diverse testing",
        "All of the above"
      ],
      correctAnswer: 3
    },
    {
      question: "How can organizations mitigate AI bias?",
      options: [
        "Ignore the problem",
        "Regular bias audits and diverse testing",
        "Use AI without any oversight",
        "Hire only through AI"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a key strategy for preventing bias?",
      options: [
        "Never testing the AI system",
        "Monitoring AI outputs for disparate impact across protected groups",
        "Using the same AI for every job without changes",
        "Hiding AI use from candidates"
      ],
      correctAnswer: 1
    }
  ],
  "audit-preparation": [
    {
      question: "What documentation should be maintained for compliance audits?",
      options: [
        "None",
        "Only vendor contracts",
        "Disclosure records, audit reports, and decision logs",
        "Just employee names"
      ],
      correctAnswer: 2
    },
    {
      question: "How long should AI-related employment records typically be retained?",
      options: [
        "1 week",
        "According to applicable record retention laws (often 3-7 years)",
        "Forever",
        "They should be deleted immediately"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of an audit trail?",
      options: [
        "To hide AI use",
        "To demonstrate compliance and track decision-making processes",
        "To complicate processes",
        "To avoid responsibility"
      ],
      correctAnswer: 1
    }
  ]
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

export function getQuizQuestions(courseId: string) {
  return QUIZ_QUESTIONS[courseId] || []
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
  }
  
  return { score, passed, error: null }
}
