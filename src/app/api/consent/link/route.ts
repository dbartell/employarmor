import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/consent/link
 * 
 * Create a new consent link for the organization.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, position, expires_in_days } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Link name is required' },
        { status: 400 }
      )
    }

    // Generate a secure random token
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let token = ''
    for (let i = 0; i < 24; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const expiresAt = expires_in_days 
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { data: link, error } = await supabase
      .from('consent_links')
      .insert({
        org_id: user.id,
        token,
        name,
        position: position || null,
        is_active: true,
        expires_at: expiresAt,
        views_count: 0,
        submissions_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating consent link:', error)
      return NextResponse.json(
        { error: 'Failed to create consent link' },
        { status: 500 }
      )
    }

    return NextResponse.json({ link })
  } catch (error) {
    console.error('Create consent link error:', error)
    return NextResponse.json(
      { error: 'Failed to create consent link' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/consent/link
 * 
 * Get all consent links for the organization.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: links, error } = await supabase
      .from('consent_links')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching consent links:', error)
      return NextResponse.json(
        { error: 'Failed to fetch consent links' },
        { status: 500 }
      )
    }

    return NextResponse.json({ links: links || [] })
  } catch (error) {
    console.error('Fetch consent links error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consent links' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/consent/link
 * 
 * Delete or deactivate a consent link.
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { linkId, deactivate } = await req.json()

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      )
    }

    if (deactivate) {
      // Just deactivate, don't delete
      const { error } = await supabase
        .from('consent_links')
        .update({ is_active: false })
        .eq('id', linkId)
        .eq('org_id', user.id)

      if (error) {
        console.error('Error deactivating consent link:', error)
        return NextResponse.json(
          { error: 'Failed to deactivate consent link' },
          { status: 500 }
        )
      }
    } else {
      // Actually delete
      const { error } = await supabase
        .from('consent_links')
        .delete()
        .eq('id', linkId)
        .eq('org_id', user.id)

      if (error) {
        console.error('Error deleting consent link:', error)
        return NextResponse.json(
          { error: 'Failed to delete consent link' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete consent link error:', error)
    return NextResponse.json(
      { error: 'Failed to delete consent link' },
      { status: 500 }
    )
  }
}
