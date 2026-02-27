"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface AdsDecisionRecord {
  id: string
  organization_id: string
  tool_name: string
  decision_type: 'hire' | 'reject' | 'promote' | 'terminate' | 'discipline' | 'other'
  input_summary: string | null
  output_decision: string | null
  criteria_used: string | null
  bias_test_results: string | null
  affected_person: string | null
  decision_date: string
  retention_expires: string
  exported_at: string | null
  notes: string | null
  created_at: string
}

export async function getAdsDecisions(filters?: {
  tool?: string
  decisionType?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from('ads_decision_log')
    .select('*')
    .eq('organization_id', user.id)
    .order('decision_date', { ascending: false })

  if (filters?.tool && filters.tool !== 'all') {
    query = query.eq('tool_name', filters.tool)
  }

  if (filters?.decisionType && filters.decisionType !== 'all') {
    query = query.eq('decision_type', filters.decisionType)
  }

  if (filters?.dateFrom) {
    query = query.gte('decision_date', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('decision_date', filters.dateTo)
  }

  if (filters?.search) {
    query = query.or(`affected_person.ilike.%${filters.search}%,tool_name.ilike.%${filters.search}%`)
  }

  const { data } = await query
  return data || []
}

export async function createAdsDecision(record: {
  tool_name: string
  decision_type: string
  input_summary?: string
  output_decision?: string
  criteria_used?: string
  bias_test_results?: string
  affected_person?: string
  decision_date: string
  notes?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const decisionDate = new Date(record.decision_date)
  const retentionExpires = new Date(decisionDate)
  retentionExpires.setFullYear(retentionExpires.getFullYear() + 4)

  const { data, error } = await supabase
    .from('ads_decision_log')
    .insert({
      organization_id: user.id,
      tool_name: record.tool_name,
      decision_type: record.decision_type,
      input_summary: record.input_summary || null,
      output_decision: record.output_decision || null,
      criteria_used: record.criteria_used || null,
      bias_test_results: record.bias_test_results || null,
      affected_person: record.affected_person || null,
      decision_date: record.decision_date,
      retention_expires: retentionExpires.toISOString(),
      notes: record.notes || null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/tools')
  return { record: data }
}

export async function getAdsDecisionStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { total: 0, expiringSoon: 0, toolNames: [] as string[] }

  const { count: total } = await supabase
    .from('ads_decision_log')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', user.id)

  // Entries expiring within 90 days
  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)

  const { count: expiringSoon } = await supabase
    .from('ads_decision_log')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', user.id)
    .lte('retention_expires', ninetyDaysFromNow.toISOString())
    .gte('retention_expires', new Date().toISOString())

  // Distinct tool names for filter dropdown
  const { data: toolData } = await supabase
    .from('ads_decision_log')
    .select('tool_name')
    .eq('organization_id', user.id)

  const toolNames = [...new Set((toolData || []).map(t => t.tool_name))]

  return {
    total: total || 0,
    expiringSoon: expiringSoon || 0,
    toolNames,
  }
}

export async function exportAdsDecisions(filters?: {
  tool?: string
  decisionType?: string
  dateFrom?: string
  dateTo?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  let query = supabase
    .from('ads_decision_log')
    .select('*')
    .eq('organization_id', user.id)
    .order('decision_date', { ascending: false })

  if (filters?.tool && filters.tool !== 'all') {
    query = query.eq('tool_name', filters.tool)
  }

  if (filters?.decisionType && filters.decisionType !== 'all') {
    query = query.eq('decision_type', filters.decisionType)
  }

  if (filters?.dateFrom) {
    query = query.gte('decision_date', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('decision_date', filters.dateTo)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  // Mark all exported records
  if (data && data.length > 0) {
    const ids = data.map(d => d.id)
    await supabase
      .from('ads_decision_log')
      .update({ exported_at: new Date().toISOString() })
      .in('id', ids)
  }

  return { records: data || [] }
}
