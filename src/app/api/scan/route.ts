import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, states, employee_count, tools, risk_score, gaps } = body

    // Validate required fields
    if (!email || !states || !Array.isArray(states) || states.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Supabase client (no auth required for public endpoint)
    const supabase = createClient()

    // Insert scan lead
    const { data, error } = await supabase
      .from('scan_leads')
      .insert({
        email,
        states,
        employee_count,
        tools: tools || [],
        risk_score,
        gaps: gaps || [],
      })
      .select()
      .single()

    if (error) {
      console.error('Scan lead insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save scan' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Scan API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
