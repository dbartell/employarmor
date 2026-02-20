import { NextRequest, NextResponse } from 'next/server'
import { authenticateAgent, supabaseAdmin, verifyOrgOwnership } from '@/lib/agent-auth'

interface HandoffRequest {
  user_email: string
  send_welcome_email?: boolean
  include_package?: boolean
  custom_message?: string
}

interface HandoffResponse {
  magic_link: string
  expires_at: string
  email_sent: boolean
}

function generateMagicToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id: orgId } = await params
    
    // Authenticate agent
    const agentContext = await authenticateAgent(req)
    if (!agentContext) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or missing agent API key' },
        { status: 401 }
      )
    }

    // Verify org ownership
    const isOwner = await verifyOrgOwnership(orgId, agentContext.agentId)
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Organization not found or not owned by this agent' },
        { status: 403 }
      )
    }

    const body: HandoffRequest = await req.json()

    if (!body.user_email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'user_email is required' },
        { status: 400 }
      )
    }

    // Get organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Organization not found' },
        { status: 404 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://employarmor.com'
    
    // Generate magic link token
    const token = generateMagicToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 72) // 72 hour expiry

    // Save magic link to database
    const { error: linkError } = await supabaseAdmin
      .from('magic_links')
      .insert({
        org_id: orgId,
        user_email: body.user_email,
        token,
        expires_at: expiresAt.toISOString(),
      })

    if (linkError) {
      console.error('Magic link creation error:', linkError)
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create magic link' },
        { status: 500 }
      )
    }

    const magicLink = `${baseUrl}/auth/magic?token=${token}`

    // Check if user exists, if not create them
    const { data: existingUserData } = await supabaseAdmin.auth.admin.listUsers()
    let existingUser = existingUserData?.users?.find(
      u => u.email?.toLowerCase() === body.user_email.toLowerCase()
    )

    if (!existingUser) {
      // Create the user with the magic link flow
      const tempPassword = crypto.randomUUID()
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: body.user_email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          company_name: org.name,
          source: 'agent_handoff',
          agent_id: agentContext.agentId,
          needs_password_setup: true,
        },
      })

      if (!createError && newUser.user) {
        existingUser = newUser.user

        // Create user record linking to org
        await supabaseAdmin
          .from('users')
          .upsert({
            id: newUser.user.id,
            org_id: orgId,
            email: body.user_email,
            role: 'admin',
          })
      }
    } else {
      // Update user to link to this org if not already linked
      await supabaseAdmin
        .from('users')
        .upsert({
          id: existingUser.id,
          org_id: orgId,
          email: body.user_email,
          role: 'admin',
        })
    }

    // Send welcome email if requested (using Supabase's built-in magic link email)
    let emailSent = false
    
    if (body.send_welcome_email !== false) {
      try {
        // Use Supabase's built-in magic link email
        const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
          email: body.user_email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: `${baseUrl}/dashboard?welcome=true`,
          },
        })

        if (!otpError) {
          emailSent = true
        } else {
          console.error('OTP email error:', otpError)
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the request if email fails
      }
    }

    const response: HandoffResponse = {
      magic_link: magicLink,
      expires_at: expiresAt.toISOString(),
      email_sent: emailSent,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Agent handoff error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
