"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DISCLOSURE_TEMPLATES } from '@/lib/constants/disclosures'

export interface Disclosure {
  id: string
  organization_id: string
  employee_id: string
  document_id: string | null
  document_title: string | null
  signature_text: string | null
  signed_at: string | null
  ip_address: string | null
  user_agent: string | null
}

export async function getEmployeeDisclosures(employeeId: string, organizationId: string) {
  const supabase = await createClient()
  
  const { data: disclosures, error } = await supabase
    .from('disclosure_acknowledgments')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('organization_id', organizationId)
    .order('signed_at', { ascending: false, nullsFirst: true })
  
  if (error) {
    console.error('Error fetching disclosures:', error)
    return { disclosures: [], error: error.message }
  }
  
  return { disclosures: disclosures || [], error: null }
}

export async function ensureStandardDisclosures(employeeId: string, organizationId: string) {
  const supabase = await createClient()
  
  // Check existing disclosures
  const { data: existing } = await supabase
    .from('disclosure_acknowledgments')
    .select('document_title')
    .eq('employee_id', employeeId)
    .eq('organization_id', organizationId)
  
  const existingTitles = new Set(existing?.map(d => d.document_title) || [])
  
  // Create missing standard disclosures
  const disclosuresToCreate = []
  
  if (!existingTitles.has(DISCLOSURE_TEMPLATES['ai-tool-usage'].title)) {
    disclosuresToCreate.push({
      organization_id: organizationId,
      employee_id: employeeId,
      document_id: 'ai-tool-usage',
      document_title: DISCLOSURE_TEMPLATES['ai-tool-usage'].title,
      signature_text: null,
      signed_at: null,
      ip_address: null,
      user_agent: null
    })
  }
  
  if (!existingTitles.has(DISCLOSURE_TEMPLATES['data-privacy'].title)) {
    disclosuresToCreate.push({
      organization_id: organizationId,
      employee_id: employeeId,
      document_id: 'data-privacy',
      document_title: DISCLOSURE_TEMPLATES['data-privacy'].title,
      signature_text: null,
      signed_at: null,
      ip_address: null,
      user_agent: null
    })
  }
  
  if (!existingTitles.has(DISCLOSURE_TEMPLATES['automated-decisions'].title)) {
    disclosuresToCreate.push({
      organization_id: organizationId,
      employee_id: employeeId,
      document_id: 'automated-decisions',
      document_title: DISCLOSURE_TEMPLATES['automated-decisions'].title,
      signature_text: null,
      signed_at: null,
      ip_address: null,
      user_agent: null
    })
  }
  
  if (disclosuresToCreate.length > 0) {
    const { error } = await supabase
      .from('disclosure_acknowledgments')
      .insert(disclosuresToCreate)
    
    if (error) {
      console.error('Error creating standard disclosures:', error)
      return { error: error.message }
    }
  }
  
  return { error: null }
}

export async function signDisclosure(
  disclosureId: string,
  signatureText: string,
  ipAddress: string,
  userAgent: string
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('disclosure_acknowledgments')
    .update({
      signature_text: signatureText,
      signed_at: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent
    })
    .eq('id', disclosureId)
  
  if (error) {
    console.error('Error signing disclosure:', error)
    return { error: error.message }
  }
  
  revalidatePath('/portal/disclosures')
  revalidatePath('/portal')
  
  return { error: null }
}
