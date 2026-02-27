"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface VideoInterviewRecord {
  id: string
  organization_id: string
  applicant_name: string
  applicant_email: string | null
  date_received: string
  ai_tool: string | null
  shared_with: { name: string; date: string; reason: string }[]
  status: 'active' | 'deletion_requested' | 'deleted'
  deletion_requested_at: string | null
  deletion_deadline: string | null
  deleted_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getVideoInterviewRecords(filters?: {
  status?: string
  search?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from('video_interview_records')
    .select('*')
    .eq('organization_id', user.id)
    .order('date_received', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.or(`applicant_name.ilike.%${filters.search}%,applicant_email.ilike.%${filters.search}%`)
  }

  const { data } = await query
  return data || []
}

export async function createVideoInterviewRecord(record: {
  applicant_name: string
  applicant_email?: string
  date_received: string
  ai_tool?: string
  notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('video_interview_records')
    .insert({
      organization_id: user.id,
      applicant_name: record.applicant_name,
      applicant_email: record.applicant_email || null,
      date_received: record.date_received,
      ai_tool: record.ai_tool || null,
      notes: record.notes || null,
      shared_with: [],
      status: 'active',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/consent')
  return { record: data }
}

export async function requestDeletion(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const now = new Date()
  const deadline = new Date(now)
  deadline.setDate(deadline.getDate() + 30)

  const { data, error } = await supabase
    .from('video_interview_records')
    .update({
      status: 'deletion_requested',
      deletion_requested_at: now.toISOString(),
      deletion_deadline: deadline.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/consent')
  return { record: data }
}

export async function markDeleted(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('video_interview_records')
    .update({
      status: 'deleted',
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/consent')
  return { record: data }
}

export async function addSharingEntry(id: string, entry: { name: string; date: string; reason: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Fetch current record
  const { data: current } = await supabase
    .from('video_interview_records')
    .select('shared_with')
    .eq('id', id)
    .eq('organization_id', user.id)
    .single()

  if (!current) return { error: 'Record not found' }

  const sharedWith = [...(current.shared_with || []), entry]

  const { data, error } = await supabase
    .from('video_interview_records')
    .update({
      shared_with: sharedWith,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('organization_id', user.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/consent')
  return { record: data }
}

export async function getVideoInterviewStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { total: 0, active: 0, deletionRequested: 0, deleted: 0 }

  const [total, active, deletionRequested, deleted] = await Promise.all([
    supabase.from('video_interview_records').select('*', { count: 'exact', head: true }).eq('organization_id', user.id),
    supabase.from('video_interview_records').select('*', { count: 'exact', head: true }).eq('organization_id', user.id).eq('status', 'active'),
    supabase.from('video_interview_records').select('*', { count: 'exact', head: true }).eq('organization_id', user.id).eq('status', 'deletion_requested'),
    supabase.from('video_interview_records').select('*', { count: 'exact', head: true }).eq('organization_id', user.id).eq('status', 'deleted'),
  ])

  return {
    total: total.count || 0,
    active: active.count || 0,
    deletionRequested: deletionRequested.count || 0,
    deleted: deleted.count || 0,
  }
}
