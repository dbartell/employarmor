import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Token is required' },
        { status: 400 }
      )
    }

    // Look up the magic link
    const { data: magicLink, error: linkError } = await supabaseAdmin
      .from('magic_links')
      .select('*')
      .eq('token', token)
      .single()

    if (linkError || !magicLink) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Invalid or expired link' },
        { status: 404 }
      )
    }

    // Check if expired
    if (new Date(magicLink.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Expired', message: 'This link has expired. Please request a new one.' },
        { status: 410 }
      )
    }

    // Check if already used
    if (magicLink.used_at) {
      return NextResponse.json(
        { error: 'Used', message: 'This link has already been used.' },
        { status: 410 }
      )
    }

    // Mark link as used
    await supabaseAdmin
      .from('magic_links')
      .update({ used_at: new Date().toISOString() })
      .eq('id', magicLink.id)

    // Find or create the user
    const { data: existingUserData } = await supabaseAdmin.auth.admin.listUsers()
    let user = existingUserData?.users?.find(
      u => u.email?.toLowerCase() === magicLink.user_email.toLowerCase()
    )

    if (!user) {
      // Create user if they don't exist
      const tempPassword = crypto.randomUUID()
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: magicLink.user_email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          source: 'magic_link',
          needs_password_setup: true,
        },
      })

      if (createError || !newUser.user) {
        return NextResponse.json(
          { error: 'Internal Server Error', message: 'Failed to create user' },
          { status: 500 }
        )
      }

      user = newUser.user

      // Link user to organization
      await supabaseAdmin
        .from('users')
        .upsert({
          id: user.id,
          org_id: magicLink.org_id,
          email: magicLink.user_email,
          role: 'admin',
        })
    }

    // Generate a session for the user
    // We'll use Supabase's generateLink to create a proper auth session
    const { data: linkData, error: generateError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: magicLink.user_email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?welcome=true`,
      },
    })

    if (generateError || !linkData) {
      console.error('Generate link error:', generateError)
      
      // Fallback: sign in with OTP
      const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
        email: magicLink.user_email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?welcome=true`,
        },
      })

      if (otpError) {
        return NextResponse.json(
          { error: 'Internal Server Error', message: 'Failed to generate session' },
          { status: 500 }
        )
      }

      // Return success but user will need to check email
      return NextResponse.json({
        success: true,
        method: 'email',
        message: 'Check your email for a login link',
      })
    }

    // Extract the token from the generated link and set session
    const url = new URL(linkData.properties.hashed_token ? 
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback#access_token=${linkData.properties.hashed_token}` :
      linkData.properties.action_link
    )

    // Create a server-side Supabase client to set cookies
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Verify the link to get the session
    const hashParams = new URLSearchParams(url.hash?.substring(1) || url.search?.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    if (accessToken && refreshToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    }

    return NextResponse.json({
      success: true,
      redirect_url: '/dashboard?welcome=true',
    })
  } catch (error) {
    console.error('Magic link validation error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
