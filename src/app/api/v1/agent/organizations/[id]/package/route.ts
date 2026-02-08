import { NextRequest, NextResponse } from 'next/server'
import { authenticateAgent, supabaseAdmin, verifyOrgOwnership } from '@/lib/agent-auth'
import { stateChecklists } from '@/lib/types/compliance'

interface Document {
  id: string
  type: string
  title: string
  url: string
  created_at: string
}

interface ChecklistItem {
  id: string
  label: string
  description: string
  status: 'incomplete' | 'in_progress' | 'complete'
  route: string
}

interface PackageResponse {
  org_id: string
  company_name: string
  state: string
  status: 'incomplete' | 'in_progress' | 'complete'
  compliance_score: number
  dashboard_url: string
  package_download: string | null
  share_link: string
  documents: Document[]
  checklist: ChecklistItem[]
  created_at: string
  updated_at: string
}

export async function GET(
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

    // Get primary state (first in array)
    const primaryState = org.states?.[0] || 'IL'

    // Get documents
    const { data: docs } = await supabaseAdmin
      .from('documents')
      .select('id, doc_type, title, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aihirelaw.com'
    
    const documents: Document[] = (docs || []).map(doc => ({
      id: doc.id,
      type: doc.doc_type,
      title: doc.title,
      url: `${baseUrl}/api/disclosure/${doc.id}`,
      created_at: doc.created_at,
    }))

    // Get remediation items
    const { data: remediationItems } = await supabaseAdmin
      .from('remediation_items')
      .select('*')
      .eq('org_id', orgId)
      .eq('state_code', primaryState)

    // Build checklist
    const stateChecklist = stateChecklists[primaryState] || []
    const checklist: ChecklistItem[] = stateChecklist.map(item => {
      const remediation = remediationItems?.find(r => r.item_key === item.key)
      return {
        id: item.key,
        label: item.label,
        description: item.description,
        status: (remediation?.status as 'incomplete' | 'in_progress' | 'complete') || 'incomplete',
        route: item.route || '/dashboard',
      }
    })

    // Calculate compliance score and status
    const completedCount = checklist.filter(item => item.status === 'complete').length
    const totalCount = checklist.length
    const complianceScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100

    let status: 'incomplete' | 'in_progress' | 'complete' = 'incomplete'
    if (complianceScore === 100) {
      status = 'complete'
    } else if (completedCount > 0) {
      status = 'in_progress'
    }

    // Generate share link (simple token-based sharing)
    const shareToken = Buffer.from(`${orgId}:${Date.now()}`).toString('base64url')
    const shareLink = `${baseUrl}/share/${shareToken}`

    const response: PackageResponse = {
      org_id: orgId,
      company_name: org.name,
      state: primaryState,
      status,
      compliance_score: complianceScore,
      dashboard_url: `${baseUrl}/dashboard`,
      package_download: documents.length > 0 ? `${baseUrl}/api/v1/agent/organizations/${orgId}/package/download` : null,
      share_link: shareLink,
      documents,
      checklist,
      created_at: org.created_at || org.agent_created_at || new Date().toISOString(),
      updated_at: org.updated_at || new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Agent package error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
