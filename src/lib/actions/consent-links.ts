"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export interface ConsentLink {
  id: string
  org_id: string
  token: string
  name: string
  position?: string
  is_active: boolean
  expires_at?: string
  created_at: string
  views_count: number
  submissions_count: number
}

// Generate a secure random token
function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let token = ''
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// Create a new consent link
export async function createConsentLink(data: {
  name: string
  position?: string
  expires_in_days?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const token = generateToken()
  const expiresAt = data.expires_in_days 
    ? new Date(Date.now() + data.expires_in_days * 24 * 60 * 60 * 1000).toISOString()
    : null

  const { data: link, error } = await supabase
    .from('consent_links')
    .insert({
      org_id: user.id,
      token,
      name: data.name,
      position: data.position || null,
      is_active: true,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating consent link:', error)
    return { error: error.message }
  }

  revalidatePath('/consent')
  return { link }
}

// Get all consent links for the org
export async function getConsentLinks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: links } = await supabase
    .from('consent_links')
    .select('*')
    .eq('org_id', user.id)
    .order('created_at', { ascending: false })

  return links || []
}

// Deactivate a consent link
export async function deactivateConsentLink(linkId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('consent_links')
    .update({ is_active: false })
    .eq('id', linkId)
    .eq('org_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/consent')
  return { success: true }
}

// Delete a consent link
export async function deleteConsentLink(linkId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('consent_links')
    .delete()
    .eq('id', linkId)
    .eq('org_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/consent')
  return { success: true }
}

// Get consent link by token (public - for the consent page)
export async function getConsentLinkByToken(token: string) {
  const supabase = await createClient()

  const { data: link } = await supabase
    .from('consent_links')
    .select(`
      *,
      organizations (
        id,
        name
      ),
      disclosure_pages (
        intro_text,
        header_text,
        rights_section_enabled,
        rights_custom_text,
        contact_email,
        brand_color,
        logo_url,
        tools:custom_tools
      )
    `)
    .eq('token', token)
    .eq('is_active', true)
    .single()

  if (!link) {
    return null
  }

  // Check if expired
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return null
  }

  // Increment views
  await supabase
    .from('consent_links')
    .update({ views_count: (link.views_count || 0) + 1 })
    .eq('id', link.id)

  return link
}

// Submit consent via public link
export async function submitConsentViaLink(token: string, data: {
  candidate_name: string
  candidate_email: string
}) {
  const supabase = await createClient()

  // Get the link
  const { data: link } = await supabase
    .from('consent_links')
    .select('*')
    .eq('token', token)
    .eq('is_active', true)
    .single()

  if (!link) {
    return { error: 'Invalid or expired consent link' }
  }

  // Check if expired
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return { error: 'This consent link has expired' }
  }

  // Get IP address from headers
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')
  const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'

  const now = new Date().toISOString()

  // Create consent record
  const { data: record, error } = await supabase
    .from('consent_records')
    .insert({
      org_id: link.org_id,
      candidate_name: data.candidate_name,
      candidate_email: data.candidate_email,
      position: link.position || null,
      disclosure_date: now.split('T')[0],
      consent_date: now.split('T')[0],
      status: 'consented',
      source: 'link',
      consent_link_id: link.id,
      ip_address: ipAddress,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating consent record:', error)
    return { error: 'Failed to submit consent' }
  }

  // Increment submissions count
  await supabase
    .from('consent_links')
    .update({ submissions_count: (link.submissions_count || 0) + 1 })
    .eq('id', link.id)

  return { success: true, record }
}

// Get org disclosure info for public consent page
export async function getOrgDisclosureForConsent(orgId: string) {
  const supabase = await createClient()

  const { data: disclosure } = await supabase
    .from('disclosure_pages')
    .select(`
      intro_text,
      header_text,
      rights_section_enabled,
      rights_custom_text,
      contact_email,
      brand_color,
      logo_url,
      custom_tools
    `)
    .eq('organization_id', orgId)
    .single()

  return disclosure
}
