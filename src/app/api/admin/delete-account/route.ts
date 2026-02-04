import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// This endpoint completely deletes an organization and optionally the user
// Only accessible by super admins

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    
    // Create client for auth check
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

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is super admin (using organizations table OR specific email)
    const allowedEmails = ['bartelldevyn@gmail.com']
    const isSuperAdminByEmail = allowedEmails.includes(user.email || '')
    
    if (!isSuperAdminByEmail) {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('is_super_admin')
        .eq('id', user.id)
        .single()

      if (orgError || !org?.is_super_admin) {
        return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
      }
    }

    const { deleteUser = false } = await request.json()
    const orgId = user.id  // org_id = user.id in this schema

    // Use service role client for admin operations
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Call the deletion function
    const { error: deleteError } = await adminClient.rpc('delete_organization_completely', {
      org_uuid: orgId
    })

    if (deleteError) {
      console.error('Delete org error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete organization data' }, { status: 500 })
    }

    // If deleteUser flag is set, delete the current user from auth
    if (deleteUser) {
      console.log('Deleting auth user:', user.id, user.email)
      const { error: userDeleteError } = await adminClient.auth.admin.deleteUser(user.id)
      if (userDeleteError) {
        console.error('Delete user error:', userDeleteError)
        return NextResponse.json({ error: 'Failed to delete user from auth: ' + userDeleteError.message }, { status: 500 })
      }
      console.log('Auth user deleted successfully')
    }

    return NextResponse.json({ 
      success: true, 
      message: deleteUser 
        ? 'Organization and all users deleted' 
        : 'Organization data deleted (users preserved)'
    })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
