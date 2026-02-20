import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MIGRATION_SQL = `
-- Run this migration to create the required tables:
CREATE TABLE IF NOT EXISTS org_tool_registry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  tool_slug TEXT,
  tool_name TEXT NOT NULL,
  category TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  justification TEXT,
  roles JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending_review',
  conditions TEXT,
  reason TEXT,
  requested_by UUID NOT NULL,
  approved_by UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tool_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  registry_entry_id UUID REFERENCES org_tool_registry(id),
  action TEXT NOT NULL,
  actor_id UUID NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_org_tool_registry_org ON org_tool_registry(org_id);
CREATE INDEX idx_tool_audit_log_org ON tool_audit_log(org_id);
CREATE INDEX idx_tool_audit_log_entry ON tool_audit_log(registry_entry_id);
`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { toolSlug, toolName, category, features, justification, roles } = body

    if (!toolName || !category || !justification) {
      return NextResponse.json({ error: "Tool name, category, and justification are required" }, { status: 400 })
    }

    // Create registry entry
    const { data: entry, error: insertError } = await supabase
      .from("org_tool_registry")
      .insert({
        org_id: user.id,
        tool_slug: toolSlug || null,
        tool_name: toolName,
        category,
        features: features || [],
        justification,
        roles: roles || [],
        status: "pending_review",
        requested_by: user.id,
      })
      .select()
      .single()

    if (insertError) {
      // Table likely doesn't exist
      if (insertError.code === "42P01" || insertError.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "Database tables not found. Please run the migration first.",
            migration: MIGRATION_SQL,
          },
          { status: 500 }
        )
      }
      throw insertError
    }

    // Create audit log
    await supabase.from("tool_audit_log").insert({
      org_id: user.id,
      registry_entry_id: entry.id,
      action: "requested",
      actor_id: user.id,
      details: { toolName, category, features, roles },
    })

    return NextResponse.json({ success: true, entry })
  } catch (err: unknown) {
    console.error("Tool request error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
