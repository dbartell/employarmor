import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/integrations/merge/settings
 * 
 * Get integration settings for the organization.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const integrationId = req.nextUrl.searchParams.get('integrationId')

    if (!integrationId) {
      return NextResponse.json(
        { error: 'integrationId is required' },
        { status: 400 }
      )
    }

    const { data: integration, error } = await supabase
      .from('ats_integrations')
      .select('id, settings')
      .eq('id', integrationId)
      .eq('org_id', user.id)
      .single()

    if (error || !integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ settings: integration.settings || {} })
  } catch (error) {
    console.error('Get integration settings error:', error)
    return NextResponse.json(
      { error: 'Failed to get integration settings' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/integrations/merge/settings
 * 
 * Update integration settings for the organization.
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { integrationId, settings } = await req.json()

    if (!integrationId) {
      return NextResponse.json(
        { error: 'integrationId is required' },
        { status: 400 }
      )
    }

    // Get existing integration
    const { data: existing, error: fetchError } = await supabase
      .from('ats_integrations')
      .select('id, settings')
      .eq('id', integrationId)
      .eq('org_id', user.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    // Merge new settings with existing
    const updatedSettings = {
      ...(existing.settings || {}),
      ...settings,
    }

    const { error: updateError } = await supabase
      .from('ats_integrations')
      .update({ settings: updatedSettings })
      .eq('id', integrationId)
      .eq('org_id', user.id)

    if (updateError) {
      console.error('Update settings error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    // Log the settings change
    await supabase.from('ats_audit_events').insert({
      org_id: user.id,
      integration_id: integrationId,
      event_type: 'settings_changed',
      event_source: 'user_action',
      description: 'Integration settings updated',
      severity: 'info',
      metadata: { updated_settings: Object.keys(settings) },
      occurred_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, settings: updatedSettings })
  } catch (error) {
    console.error('Update integration settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update integration settings' },
      { status: 500 }
    )
  }
}
