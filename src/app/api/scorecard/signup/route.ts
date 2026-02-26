import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { trackServerEvent } from '@/lib/analytics'

// Use admin client to create users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, company, states, tools, riskScore } = await req.json()

    if (!email || !company) {
      return NextResponse.json({ error: 'Email and company required' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      // User exists - return info for frontend to handle nicely
      return NextResponse.json({ 
        existingUser: true,
        email: email,
      }, { status: 200 })
    }

    // Create user with a temporary random password (they'll set it after signup)
    const tempPassword = crypto.randomUUID()
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email since they just gave it to us
      user_metadata: {
        company_name: company,
        source: 'scorecard',
        needs_password_reset: true,
        quiz_risk_score: riskScore,
      },
    })

    if (authError || !authData.user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    userId = authData.user.id

    // Ensure users row exists first (owner_id FK requires it)
    await supabaseAdmin
      .from('users')
      .upsert({ id: userId, email, company_name: company }, { onConflict: 'id' })

    // Create organization with trial_started_at and quiz data
    const { error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        id: userId,
        owner_id: userId,
        name: company,
        states: states || [],
        quiz_tools: tools || [],
        quiz_risk_score: riskScore,
        plan: 'trial',
        subscription_status: 'trialing',
        trial_started_at: new Date().toISOString(),
        documents_generated: 0,
      })

    if (orgError) {
      console.error('Scorecard org error:', JSON.stringify(orgError))
    }

    // Create employee_profiles row as owner (layout checks this for role/nav)
    await supabaseAdmin
      .from('employee_profiles')
      .upsert({
        user_id: userId,
        organization_id: userId,
        email: email,
        role: 'owner',
        joined_at: new Date().toISOString(),
      }, { onConflict: 'user_id,organization_id' })

    // Update lead with user_id if exists
    await supabaseAdmin
      .from('leads')
      .update({ user_id: userId, converted_at: new Date().toISOString() })
      .eq('email', email)

    // Track signup analytics
    trackServerEvent('signup_completed', { 
      source: 'scorecard',
      riskScore,
      statesCount: states?.length || 0,
      toolsCount: tools?.length || 0,
    }, userId, userId)

    // Return URL to set password (no Stripe checkout required)
    // User goes directly to password setup, then dashboard
    return NextResponse.json({ 
      url: `${req.nextUrl.origin}/set-password?user_id=${userId}&trial=true`,
      userId,
    })
  } catch (error) {
    console.error('Scorecard signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
