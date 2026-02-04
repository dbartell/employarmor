import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user from auth
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user needs password reset (created via scorecard signup)
    if (!user.user_metadata?.needs_password_reset) {
      return NextResponse.json({ error: 'Password already set' }, { status: 400 })
    }

    return NextResponse.json({
      email: user.email,
      company: user.user_metadata?.company_name,
    })
  } catch (error) {
    console.error('Verify user error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
