import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET: Fetch team-wide tool training progress for an org
// Used by the training dashboard to show "47/52 employees compliant"
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get all team members
  const { data: members } = await supabase
    .from("organization_members")
    .select("user_id, role, users(email)")
    .eq("organization_id", user.id)

  // Get all approved tools that require training
  const { data: approvedTools } = await supabase
    .from("org_tool_registry")
    .select("tool_catalog_id, custom_tool_name, status")
    .eq("organization_id", user.id)
    .eq("status", "approved")

  // Get all training completions
  const { data: completions } = await supabase
    .from("tool_training_certificates")
    .select("*")
    .eq("organization_id", user.id)

  // Get all in-progress training
  const { data: progress } = await supabase
    .from("tool_training_progress")
    .select("*")
    .eq("organization_id", user.id)

  // Calculate compliance metrics
  const totalMembers = members?.length || 1
  const totalTools = approvedTools?.length || 0
  const totalRequired = totalMembers * totalTools
  const totalCompleted = completions?.length || 0
  const complianceRate = totalRequired > 0 
    ? Math.round((totalCompleted / totalRequired) * 100) 
    : 100

  // Per-member status
  const memberStatus = (members || []).map(member => {
    const memberCerts = (completions || []).filter(c => c.user_id === member.user_id)
    const memberProgress = (progress || []).filter(p => p.user_id === member.user_id)
    const toolsCompleted = memberCerts.length
    const toolsInProgress = memberProgress.filter(p => !p.passed).length

    return {
      userId: member.user_id,
      email: (member as any).users?.email,
      role: member.role,
      toolsCompleted,
      toolsRequired: totalTools,
      toolsInProgress,
      isCompliant: toolsCompleted >= totalTools,
      certificates: memberCerts,
      expiringCerts: memberCerts.filter(c => {
        const expires = new Date(c.expires_at)
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        return expires <= thirtyDaysFromNow
      }),
    }
  })

  // Per-tool status
  const toolStatus = (approvedTools || []).map(tool => {
    const toolCerts = (completions || []).filter(c => c.tool_slug === tool.tool_catalog_id)
    return {
      toolSlug: tool.tool_catalog_id,
      toolName: tool.custom_tool_name,
      membersCompleted: toolCerts.length,
      membersRequired: totalMembers,
      complianceRate: totalMembers > 0 
        ? Math.round((toolCerts.length / totalMembers) * 100)
        : 100,
    }
  })

  return NextResponse.json({
    summary: {
      totalMembers,
      totalTools,
      totalRequired,
      totalCompleted,
      complianceRate,
      membersFullyCompliant: memberStatus.filter(m => m.isCompliant).length,
      expiringCertificates: memberStatus.reduce((sum, m) => sum + m.expiringCerts.length, 0),
    },
    members: memberStatus,
    tools: toolStatus,
  })
}
