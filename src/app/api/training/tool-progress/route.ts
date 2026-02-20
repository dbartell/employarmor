import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: Fetch tool training progress for the current user's org
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const toolSlug = request.nextUrl.searchParams.get("toolSlug")

  let query = supabase
    .from("tool_training_progress")
    .select("*")
    .eq("organization_id", user.id)

  if (toolSlug) {
    query = query.eq("tool_slug", toolSlug)
  }

  const { data, error } = await query.order("completed_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress: data })
}

// POST: Record tool training completion
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { toolSlug, toolName, sectionNumber, quizAnswers, quizScore, passed } = body

  if (!toolSlug || !sectionNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Upsert progress record
  const { data, error } = await supabase
    .from("tool_training_progress")
    .upsert(
      {
        organization_id: user.id,
        user_id: user.id,
        tool_slug: toolSlug,
        tool_name: toolName,
        section_number: sectionNumber,
        quiz_answers: quizAnswers,
        quiz_score: quizScore,
        passed: passed,
        completed_at: passed ? new Date().toISOString() : null,
        attempts: 1, // TODO: increment on retry
      },
      {
        onConflict: "organization_id,user_id,tool_slug,section_number",
      }
    )
    .select()
    .single()

  if (error) {
    // If upsert fails due to missing table, provide helpful error
    if (error.code === "42P01") {
      return NextResponse.json({ 
        error: "Tool training table not yet created. Run the migration first.",
        migration: MIGRATION_SQL
      }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If passed, check if a certificate should be generated
  if (passed) {
    // Generate certificate number
    const certNumber = `TT-${toolSlug.toUpperCase().slice(0, 4)}-${Date.now().toString(36).toUpperCase()}`
    
    const { error: certError } = await supabase
      .from("tool_training_certificates")
      .upsert(
        {
          organization_id: user.id,
          user_id: user.id,
          tool_slug: toolSlug,
          tool_name: toolName,
          certificate_number: certNumber,
          quiz_score: quizScore,
          issued_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        },
        {
          onConflict: "organization_id,user_id,tool_slug",
        }
      )

    if (certError && certError.code !== "42P01") {
      console.error("Certificate creation error:", certError)
    }

    // Log to audit trail
    await supabase.from("tool_audit_log").insert({
      organization_id: user.id,
      action: "training_completed",
      actor_id: user.id,
      actor_name: user.email,
      details: {
        tool_slug: toolSlug,
        tool_name: toolName,
        quiz_score: quizScore,
        certificate_number: certNumber,
      },
    }) // Best effort - fire and forget
  }

  return NextResponse.json({ 
    success: true, 
    progress: data,
    passed,
  })
}

// Migration SQL for reference
const MIGRATION_SQL = `
-- Tool training progress tracking
CREATE TABLE IF NOT EXISTS tool_training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL,
  tool_slug TEXT NOT NULL,
  tool_name TEXT,
  section_number INTEGER NOT NULL DEFAULT 1,
  quiz_answers JSONB DEFAULT '{}',
  quiz_score INTEGER,
  passed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id, tool_slug, section_number)
);

-- Tool training certificates
CREATE TABLE IF NOT EXISTS tool_training_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL,
  tool_slug TEXT NOT NULL,
  tool_name TEXT,
  certificate_number TEXT UNIQUE NOT NULL,
  quiz_score INTEGER,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id, tool_slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tool_training_org ON tool_training_progress(organization_id);
CREATE INDEX IF NOT EXISTS idx_tool_training_user ON tool_training_progress(user_id, tool_slug);
CREATE INDEX IF NOT EXISTS idx_tool_certs_org ON tool_training_certificates(organization_id);
CREATE INDEX IF NOT EXISTS idx_tool_certs_user ON tool_training_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_certs_expires ON tool_training_certificates(expires_at);
`
