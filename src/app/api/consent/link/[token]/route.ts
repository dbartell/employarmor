import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

interface RouteParams {
  params: Promise<{ token: string }>
}

/**
 * GET /api/consent/link/[token]
 * 
 * Public endpoint to get consent link details for the consent page.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params
    const supabase = await createClient()

    // Get the consent link with org and disclosure info
    const { data: link, error } = await supabase
      .from('consent_links')
      .select(`
        id,
        name,
        position,
        is_active,
        expires_at,
        views_count,
        org_id,
        organizations (
          id,
          name
        )
      `)
      .eq('token', token)
      .single()

    if (error || !link) {
      return NextResponse.json(
        { error: 'Consent link not found' },
        { status: 404 }
      )
    }

    // Check if link is active
    if (!link.is_active) {
      return NextResponse.json(
        { error: 'This consent link is no longer active' },
        { status: 410 }
      )
    }

    // Check if expired
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This consent link has expired' },
        { status: 410 }
      )
    }

    // Get disclosure page info
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
      .eq('organization_id', link.org_id)
      .single()

    // Increment views count (fire and forget)
    supabase
      .from('consent_links')
      .update({ views_count: (link.views_count || 0) + 1 })
      .eq('id', link.id)
      .then(() => {})

    return NextResponse.json({
      link: {
        ...link,
        disclosure_pages: disclosure ? {
          ...disclosure,
          tools: disclosure.custom_tools,
        } : null,
      },
    })
  } catch (error) {
    console.error('Get consent link error:', error)
    return NextResponse.json(
      { error: 'Failed to get consent link' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/consent/link/[token]
 * 
 * Public endpoint to submit consent via a consent link.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params
    const supabase = await createClient()

    const body = await req.json()
    const { candidate_name, candidate_email } = body

    if (!candidate_name || !candidate_email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(candidate_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get the consent link
    const { data: link, error: linkError } = await supabase
      .from('consent_links')
      .select('*')
      .eq('token', token)
      .single()

    if (linkError || !link) {
      return NextResponse.json(
        { error: 'Consent link not found' },
        { status: 404 }
      )
    }

    // Check if link is active
    if (!link.is_active) {
      return NextResponse.json(
        { error: 'This consent link is no longer active' },
        { status: 410 }
      )
    }

    // Check if expired
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This consent link has expired' },
        { status: 410 }
      )
    }

    // Get IP address
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'

    const now = new Date().toISOString()

    // Check if this email already consented via this link
    const { data: existing } = await supabase
      .from('consent_records')
      .select('id')
      .eq('org_id', link.org_id)
      .eq('candidate_email', candidate_email)
      .eq('consent_link_id', link.id)
      .single()

    if (existing) {
      // Already consented, just return success
      return NextResponse.json({
        success: true,
        message: 'Consent already recorded',
      })
    }

    // Create consent record
    const { data: record, error } = await supabase
      .from('consent_records')
      .insert({
        org_id: link.org_id,
        candidate_name,
        candidate_email,
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
      return NextResponse.json(
        { error: 'Failed to submit consent' },
        { status: 500 }
      )
    }

    // Increment submissions count
    await supabase
      .from('consent_links')
      .update({ submissions_count: (link.submissions_count || 0) + 1 })
      .eq('id', link.id)

    return NextResponse.json({
      success: true,
      record: {
        id: record.id,
        consent_date: record.consent_date,
      },
    })
  } catch (error) {
    console.error('Submit consent error:', error)
    return NextResponse.json(
      { error: 'Failed to submit consent' },
      { status: 500 }
    )
  }
}
