import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, canManageEmployees } from "@/lib/auth/roles"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's organization
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user can manage employees
    const role = await getUserRole(user.id, org.id)
    if (!canManageEmployees(role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { email, role: inviteRole, department } = body

    if (!email || !inviteRole) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'employee']
    if (!validRoles.includes(inviteRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, manager, or employee" },
        { status: 400 }
      )
    }

    // Check if email is already invited (pending or accepted)
    const { data: existingInvite } = await supabase
      .from('employee_invites')
      .select('id, accepted_at')
      .eq('organization_id', org.id)
      .eq('email', email)
      .single()

    if (existingInvite) {
      if (existingInvite.accepted_at) {
        return NextResponse.json(
          { error: "This email is already part of your organization" },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: "An active invitation already exists for this email" },
          { status: 400 }
        )
      }
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days to accept

    // Create invite
    const { data: invite, error: insertError } = await supabase
      .from('employee_invites')
      .insert({
        organization_id: org.id,
        email,
        role: inviteRole,
        department,
        token,
        invited_by: user.id,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Generate invite URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/invite/${token}`

    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        email,
        role: inviteRole,
        department,
        inviteUrl,
        expiresAt: invite.expires_at
      }
    })
  } catch (err: unknown) {
    console.error("Employee invite error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}

// List all invites for the organization
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's organization
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check permissions
    const role = await getUserRole(user.id, org.id)
    if (!canManageEmployees(role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get all invites
    const { data: invites, error } = await supabase
      .from('employee_invites')
      .select('*')
      .eq('organization_id', org.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ invites })
  } catch (err: unknown) {
    console.error("Get invites error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
