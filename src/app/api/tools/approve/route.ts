import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { registryEntryId, action, conditions, reason } = body

    if (!registryEntryId || !action || !["approve", "deny"].includes(action)) {
      return NextResponse.json(
        { error: "registryEntryId and action ('approve' or 'deny') are required" },
        { status: 400 }
      )
    }

    const now = new Date()
    const expiresAt = action === "approve"
      ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString()
      : null

    const status = action === "approve" ? "approved" : "denied"

    const { data: entry, error: updateError } = await supabase
      .from("org_tool_registry")
      .update({
        status,
        conditions: conditions || null,
        reason: reason || null,
        approved_by: user.id,
        expires_at: expiresAt,
        updated_at: now.toISOString(),
      })
      .eq("id", registryEntryId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    if (!entry) {
      return NextResponse.json({ error: "Registry entry not found" }, { status: 404 })
    }

    // Audit log
    await supabase.from("tool_audit_log").insert({
      org_id: entry.org_id,
      registry_entry_id: registryEntryId,
      action: action === "approve" ? "approved" : "denied",
      actor_id: user.id,
      details: { conditions, reason, expires_at: expiresAt },
    })

    return NextResponse.json({ success: true, entry })
  } catch (err: unknown) {
    console.error("Tool approve error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
