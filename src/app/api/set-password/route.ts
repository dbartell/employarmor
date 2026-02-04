import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { trackServerEvent } from '@/lib/analytics'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId: directUserId, password, isTrial } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    let userId: string | null = null

    // Trial flow - user ID provided directly
    if (isTrial && directUserId) {
      // Verify the user exists and needs password reset
      const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(directUserId)
      
      if (error || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (!user.user_metadata?.needs_password_reset) {
        return NextResponse.json({ error: 'Password already set' }, { status: 400 })
      }

      userId = directUserId
    }
    // Legacy Stripe checkout flow
    else if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (!session.customer) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
      }

      const customer = await stripe.customers.retrieve(session.customer as string)
      
      if (customer.deleted) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 400 })
      }

      userId = customer.metadata?.supabase_user_id || null
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    // Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      user_metadata: {
        needs_password_reset: false,
      },
    })

    if (updateError) {
      console.error('Update password error:', updateError)
      return NextResponse.json({ error: 'Failed to set password' }, { status: 500 })
    }

    // Track trial started analytics
    if (isTrial) {
      trackServerEvent('trial_started', { source: 'scorecard' }, userId, userId)
    }

    // For trial users, sign them in automatically
    if (isTrial) {
      // Get user email for auto-login
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)
      
      if (user?.email) {
        // Sign in the user
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
          email: user.email,
          password,
        })

        if (!signInError && signInData.session) {
          // Return session token for client-side authentication
          return NextResponse.json({ 
            success: true,
            session: signInData.session,
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
