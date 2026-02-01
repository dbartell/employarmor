"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ComplianceDocument } from '@/types'
import { DOCUMENT_VALIDITY_YEARS } from '@/types'

export interface CreateDocumentInput {
  document_type: ComplianceDocument['document_type']
  title: string
  description?: string
  jurisdiction?: string
  issued_at: string // Date string
  file_url?: string
  file_name?: string
}

export interface UpdateDocumentInput {
  id: string
  title?: string
  description?: string
  jurisdiction?: string
  issued_at?: string
  file_url?: string
  file_name?: string
}

// Calculate expiry date based on document type
function calculateExpiryDate(issuedAt: string, documentType: ComplianceDocument['document_type']): string {
  const validityYears = DOCUMENT_VALIDITY_YEARS[documentType] || 1
  const issued = new Date(issuedAt)
  issued.setFullYear(issued.getFullYear() + validityYears)
  return issued.toISOString()
}

// Get all compliance documents for the current org
export async function getComplianceDocuments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { documents: [], error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('compliance_documents')
    .select('*')
    .eq('org_id', user.id)
    .order('expires_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch compliance documents:', error)
    return { documents: [], error: error.message }
  }

  return { documents: data as ComplianceDocument[], error: null }
}

// Get upcoming renewals (documents expiring in next 90 days)
export async function getUpcomingRenewals() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { renewals: [], error: 'Not authenticated' }
  }

  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)

  const { data, error } = await supabase
    .from('compliance_documents')
    .select('*')
    .eq('org_id', user.id)
    .neq('status', 'renewed')
    .lte('expires_at', ninetyDaysFromNow.toISOString())
    .order('expires_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch upcoming renewals:', error)
    return { renewals: [], error: error.message }
  }

  // Calculate days remaining for each document
  const renewalsWithDays = (data as ComplianceDocument[]).map(doc => {
    const expiresAt = new Date(doc.expires_at)
    const now = new Date()
    const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return {
      ...doc,
      daysRemaining,
    }
  })

  return { renewals: renewalsWithDays, error: null }
}

// Create a new compliance document
export async function createComplianceDocument(input: CreateDocumentInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { document: null, error: 'Not authenticated' }
  }

  const expiresAt = calculateExpiryDate(input.issued_at, input.document_type)

  const { data, error } = await supabase
    .from('compliance_documents')
    .insert({
      org_id: user.id,
      document_type: input.document_type,
      title: input.title,
      description: input.description,
      jurisdiction: input.jurisdiction,
      issued_at: input.issued_at,
      expires_at: expiresAt,
      file_url: input.file_url,
      file_name: input.file_name,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create compliance document:', error)
    return { document: null, error: error.message }
  }

  revalidatePath('/compliance/documents')
  revalidatePath('/dashboard')

  return { document: data as ComplianceDocument, error: null }
}

// Update a compliance document
export async function updateComplianceDocument(input: UpdateDocumentInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { document: null, error: 'Not authenticated' }
  }

  // If issued_at is being updated, recalculate expiry
  let updateData: Record<string, unknown> = { ...input }
  delete updateData.id

  if (input.issued_at) {
    // Get the current document to know its type
    const { data: current } = await supabase
      .from('compliance_documents')
      .select('document_type')
      .eq('id', input.id)
      .eq('org_id', user.id)
      .single()

    if (current) {
      updateData.expires_at = calculateExpiryDate(input.issued_at, current.document_type as ComplianceDocument['document_type'])
    }
  }

  const { data, error } = await supabase
    .from('compliance_documents')
    .update(updateData)
    .eq('id', input.id)
    .eq('org_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update compliance document:', error)
    return { document: null, error: error.message }
  }

  revalidatePath('/compliance/documents')
  revalidatePath('/dashboard')

  return { document: data as ComplianceDocument, error: null }
}

// Mark a document as renewed (creates new document linked to old)
export async function renewComplianceDocument(documentId: string, newIssuedAt: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { document: null, error: 'Not authenticated' }
  }

  // Get the original document
  const { data: original, error: fetchError } = await supabase
    .from('compliance_documents')
    .select('*')
    .eq('id', documentId)
    .eq('org_id', user.id)
    .single()

  if (fetchError || !original) {
    return { document: null, error: 'Document not found' }
  }

  const expiresAt = calculateExpiryDate(newIssuedAt, original.document_type)

  // Create new document linked to original
  const { data: newDoc, error: createError } = await supabase
    .from('compliance_documents')
    .insert({
      org_id: user.id,
      document_type: original.document_type,
      title: original.title,
      description: original.description,
      jurisdiction: original.jurisdiction,
      issued_at: newIssuedAt,
      expires_at: expiresAt,
      renewed_from_id: original.id,
      file_url: null, // New document needs new file
      file_name: null,
    })
    .select()
    .single()

  if (createError) {
    console.error('Failed to create renewed document:', createError)
    return { document: null, error: createError.message }
  }

  // Mark original as renewed
  await supabase
    .from('compliance_documents')
    .update({ status: 'renewed' })
    .eq('id', documentId)

  revalidatePath('/compliance/documents')
  revalidatePath('/dashboard')

  return { document: newDoc as ComplianceDocument, error: null }
}

// Delete a compliance document
export async function deleteComplianceDocument(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('compliance_documents')
    .delete()
    .eq('id', documentId)
    .eq('org_id', user.id)

  if (error) {
    console.error('Failed to delete compliance document:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/compliance/documents')
  revalidatePath('/dashboard')

  return { success: true, error: null }
}
