import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { trackServerEvent } from '@/lib/analytics'
import { sendEmail } from '@/lib/emails/send'
import { scanWelcomeEmail } from '@/lib/emails/notification-templates'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, company, states, tools, usages, employeeCount, riskScore } = await req.json()

    if (!email || !company) {
      return NextResponse.json({ error: 'Email and company required' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUserData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUserData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    console.log('Checking for existing user:', email, 'Found:', existingUser?.id || 'none', 'Total users:', existingUserData?.users?.length)

    if (existingUser) {
      const userId = existingUser.id

      // Check if they have an org — if not, create one
      const { data: existingOrg } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('id', userId)
        .single()

      if (!existingOrg) {
        // Create org for existing user (they signed up without going through onboard)
        await supabaseAdmin
          .from('organizations')
          .insert({
            id: userId,
            owner_id: userId,
            name: company,
            states: states || [],
            quiz_tools: tools || [],
            quiz_usages: usages || [],
            quiz_risk_score: riskScore,
            employee_count: employeeCount || null,
            plan: 'trial',
            trial_started_at: new Date().toISOString(),
            documents_generated: 0,
          })

        // Create user record if missing
        await supabaseAdmin
          .from('users')
          .upsert({
            id: userId,
            org_id: userId,
            email: email,
            role: 'admin',
          }, { onConflict: 'id' })
      }

      // Update their password so we can auto-login them
      const tempPassword = crypto.randomUUID()
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: tempPassword,
      })

      if (updateError) {
        console.error('Password update error:', updateError)
        return NextResponse.json({ 
          existingUser: true,
          email: email,
          magicLinkFailed: true,
        }, { status: 200 })
      }

      return NextResponse.json({ 
        success: true,
        email: email,
        tempPassword: tempPassword,
        userId: userId,
      })
    }

    // Create user with a temp password (we'll return it for auto-login)
    const tempPassword = crypto.randomUUID()
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        company_name: company,
        source: 'onboard',
        needs_password_setup: true, // They should set a real password later
        quiz_risk_score: riskScore,
      },
    })

    if (authError || !authData.user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    const userId = authData.user.id

    // Create organization with onboarding data
    const { error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        id: userId,
        name: company,
        owner_id: userId,
        states: states || [],
        quiz_tools: tools || [],
        quiz_usages: usages || [],
        quiz_risk_score: riskScore,
        employee_count: employeeCount || null,
        plan: 'trial',
        trial_started_at: new Date().toISOString(),
        documents_generated: 0,
      })

    if (orgError) {
      console.error('Org error:', orgError)
      // Continue anyway
    }

    // Create user record
    await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        org_id: userId,
        email: email,
        role: 'admin',
      })

    // Convert lead if exists
    await supabaseAdmin
      .from('leads')
      .update({ user_id: userId, converted_at: new Date().toISOString() })
      .eq('email', email)

    // Track signup
    trackServerEvent('signup_completed', {
      source: 'onboard',
      riskScore,
      statesCount: states?.length || 0,
      toolsCount: tools?.length || 0,
    }, userId, userId)

    // Send welcome email with scan results
    try {
      const { subject, html } = scanWelcomeEmail({
        company: company,
        riskScore: riskScore || 0,
        gapCount: tools?.length || 0,
        states: states || [],
      })
      await sendEmail({ to: email, subject, html })
    } catch (emailError) {
      console.error('Welcome email error:', emailError)
      // Don't block signup if email fails
    }

    // Return email and temp password for client-side auto-login
    return NextResponse.json({ 
      success: true,
      email: email,
      tempPassword: tempPassword,
      userId: userId,
    })
  } catch (error) {
    console.error('Onboard signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
