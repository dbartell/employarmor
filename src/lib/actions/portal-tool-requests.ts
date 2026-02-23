"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/emails/send'
import { toolRequestSubmittedEmail } from '@/lib/emails/notification-templates'
import { shouldNotify, getOrgAdmins } from '@/lib/emails/should-notify'

export interface ToolRequest {
  id: string
  organization_id: string
  employee_id: string
  tool_name: string
  tool_url: string | null
  use_case: string
  data_types: string[]
  status: 'pending' | 'approved' | 'denied' | 'revoked'
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  created_at: string
  updated_at: string
}

export async function getEmployeeToolRequests(employeeId: string, organizationId: string) {
  const supabase = await createClient()
  
  const { data: requests, error } = await supabase
    .from('tool_requests')
    .select(`
      *,
      reviewer:reviewed_by(email)
    `)
    .eq('employee_id', employeeId)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tool requests:', error)
    return { requests: [], error: error.message }
  }
  
  return { requests: requests || [], error: null }
}

export async function createToolRequest(
  employeeId: string,
  organizationId: string,
  toolData: {
    tool_name: string
    tool_url: string | null
    use_case: string
    data_types: string[]
  }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tool_requests')
    .insert({
      organization_id: organizationId,
      employee_id: employeeId,
      tool_name: toolData.tool_name,
      tool_url: toolData.tool_url || null,
      use_case: toolData.use_case,
      data_types: toolData.data_types,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating tool request:', error)
    return { request: null, error: error.message }
  }

  // Notify admins
  try {
    const { data: employee } = await supabase
      .from('employee_profiles')
      .select('full_name')
      .eq('id', employeeId)
      .single()

    const admins = await getOrgAdmins(organizationId)
    for (const admin of admins) {
      if (await shouldNotify(admin.userId, organizationId, 'tool_request_submitted')) {
        const email = toolRequestSubmittedEmail({
          adminName: admin.name,
          employeeName: employee?.full_name || 'An employee',
          toolName: toolData.tool_name,
          reason: toolData.use_case,
        })
        await sendEmail({ to: admin.email, subject: email.subject, html: email.html })
      }
    }
  } catch (e) {
    console.error('Error sending tool request notification:', e)
  }
  
  revalidatePath('/portal/tools')
  revalidatePath('/portal')
  
  return { request: data, error: null }
}
