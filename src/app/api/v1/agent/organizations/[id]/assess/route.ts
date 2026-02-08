import { NextRequest, NextResponse } from 'next/server'
import { authenticateAgent, supabaseAdmin, verifyOrgOwnership } from '@/lib/agent-auth'

interface AssessRequest {
  state: string
  uses_resume_screening?: boolean
  uses_video_interviews?: boolean
  uses_chatbots?: boolean
  uses_skills_assessment?: boolean
  uses_background_check?: boolean
  uses_personality_test?: boolean
  ai_tools?: string[]
  employee_count?: number
}

interface ComplianceGap {
  id: string
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  state: string
}

interface RequiredAction {
  id: string
  title: string
  description: string
  priority: number
  estimated_time: string
  route: string
}

interface ApplicableLaw {
  state: string
  law_name: string
  effective_date: string
  summary: string
}

interface AssessResponse {
  compliance_score: number
  gaps: ComplianceGap[]
  required_actions: RequiredAction[]
  applicable_laws: ApplicableLaw[]
}

// State compliance requirements
const stateRequirements: Record<string, {
  law_name: string
  effective_date: string
  summary: string
  requirements: { key: string; label: string; description: string; route: string }[]
}> = {
  IL: {
    law_name: 'Illinois AI Video Interview Act & HB 3773',
    effective_date: '2026-01-01',
    summary: 'Requires disclosure and consent for AI use in hiring decisions, with employee notification requirements.',
    requirements: [
      { key: 'disclosure', label: 'Candidate Disclosure Notice', description: 'Notify candidates that AI is used in hiring decisions', route: '/documents' },
      { key: 'employee_notice', label: 'Employee Notification', description: 'Notify employees when AI affects employment decisions', route: '/documents' },
      { key: 'training', label: 'HR Training', description: 'Train HR staff on compliance requirements', route: '/training' },
    ],
  },
  CO: {
    law_name: 'Colorado AI Act (SB24-205)',
    effective_date: '2026-02-01',
    summary: 'Comprehensive AI governance requiring impact assessments, disclosures, and human oversight for high-risk AI systems.',
    requirements: [
      { key: 'impact_assessment', label: 'Impact Assessment', description: 'Annual assessment of AI system risks and safeguards', route: '/documents/impact-assessment' },
      { key: 'disclosure', label: 'Candidate Disclosure Notice', description: 'Pre-decision notification to candidates', route: '/documents' },
      { key: 'consent_tracking', label: 'Consent Collection', description: 'Collect and track candidate consent', route: '/consent' },
      { key: 'adverse_decision', label: 'Adverse Decision Process', description: 'Human review and appeal process', route: '/settings/adverse-decisions' },
      { key: 'training', label: 'HR Training', description: 'Train HR staff on compliance requirements', route: '/training' },
    ],
  },
  CA: {
    law_name: 'California AEDT Regulations (Proposed)',
    effective_date: '2025-07-01',
    summary: 'Requires pre-use notice and opt-out rights for automated employment decision tools.',
    requirements: [
      { key: 'disclosure', label: 'Pre-Use Notice', description: 'Notify candidates before AI evaluation', route: '/documents' },
      { key: 'consent_tracking', label: 'Opt-Out Tracking', description: 'Track candidate opt-out requests', route: '/consent' },
      { key: 'training', label: 'HR Training', description: 'Train HR staff on compliance requirements', route: '/training' },
    ],
  },
  NYC: {
    law_name: 'NYC Local Law 144',
    effective_date: '2023-07-05',
    summary: 'Requires annual bias audits and public disclosure for automated employment decision tools.',
    requirements: [
      { key: 'bias_audit', label: 'Annual Bias Audit', description: 'Independent bias audit of AEDT systems', route: '/documents' },
      { key: 'disclosure', label: 'Public Disclosure', description: 'Publish bias audit results publicly', route: '/documents' },
      { key: 'candidate_notice', label: 'Candidate Notice', description: 'Notify candidates 10 days before AEDT use', route: '/documents' },
      { key: 'training', label: 'HR Training', description: 'Train HR staff on compliance requirements', route: '/training' },
    ],
  },
}

export async function POST(
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

    const body: AssessRequest = await req.json()

    if (!body.state) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'state is required' },
        { status: 400 }
      )
    }

    // Get current remediation status
    const { data: remediationItems } = await supabaseAdmin
      .from('remediation_items')
      .select('*')
      .eq('org_id', orgId)
      .eq('state_code', body.state)

    // Calculate AI tools in use
    const aiToolsInUse: string[] = []
    if (body.uses_resume_screening) aiToolsInUse.push('resume_screening')
    if (body.uses_video_interviews) aiToolsInUse.push('video_interviews')
    if (body.uses_chatbots) aiToolsInUse.push('chatbots')
    if (body.uses_skills_assessment) aiToolsInUse.push('skills_assessment')
    if (body.uses_background_check) aiToolsInUse.push('background_check')
    if (body.uses_personality_test) aiToolsInUse.push('personality_test')
    if (body.ai_tools) aiToolsInUse.push(...body.ai_tools)

    // Update organization with assessment data
    await supabaseAdmin
      .from('organizations')
      .update({
        quiz_tools: aiToolsInUse,
        employee_count: body.employee_count || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orgId)

    // Determine applicable laws
    const applicableLaws: ApplicableLaw[] = []
    const stateReq = stateRequirements[body.state]
    
    if (stateReq) {
      applicableLaws.push({
        state: body.state,
        law_name: stateReq.law_name,
        effective_date: stateReq.effective_date,
        summary: stateReq.summary,
      })
    }

    // Calculate gaps and required actions
    const gaps: ComplianceGap[] = []
    const requiredActions: RequiredAction[] = []
    let completedCount = 0
    let totalCount = 0

    if (stateReq) {
      for (const req of stateReq.requirements) {
        totalCount++
        const item = remediationItems?.find(i => i.item_key === req.key)
        const isComplete = item?.status === 'complete'

        if (isComplete) {
          completedCount++
        } else {
          gaps.push({
            id: req.key,
            title: req.label,
            description: req.description,
            severity: req.key === 'disclosure' || req.key === 'impact_assessment' ? 'high' : 'medium',
            state: body.state,
          })

          requiredActions.push({
            id: req.key,
            title: req.label,
            description: req.description,
            priority: req.key === 'disclosure' ? 1 : req.key === 'impact_assessment' ? 2 : 3,
            estimated_time: req.key === 'impact_assessment' ? '20 minutes' : '5 minutes',
            route: req.route,
          })
        }
      }
    }

    // Calculate compliance score
    const complianceScore = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100)
      : (stateReq ? 0 : 100) // Non-regulated states get 100%

    // Sort required actions by priority
    requiredActions.sort((a, b) => a.priority - b.priority)

    const response: AssessResponse = {
      compliance_score: complianceScore,
      gaps,
      required_actions: requiredActions,
      applicable_laws: applicableLaws,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Agent assess error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
