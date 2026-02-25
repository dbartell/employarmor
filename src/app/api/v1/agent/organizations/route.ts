import { NextRequest, NextResponse } from 'next/server'
import { authenticateAgent, supabaseAdmin, generateApiKey } from '@/lib/agent-auth'
import { trackServerEvent } from '@/lib/analytics'

interface CreateOrgRequest {
  company_name: string
  state: string
  employee_count?: number
  contact_email: string
  ai_tools_used?: string[]
  agent_id?: string
}

interface CreateOrgResponse {
  org_id: string
  dashboard_url: string
  api_key: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate agent
    const agentContext = await authenticateAgent(req)
    if (!agentContext) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or missing agent API key' },
        { status: 401 }
      )
    }

    const body: CreateOrgRequest = await req.json()

    // Validate required fields
    if (!body.company_name || !body.state || !body.contact_email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'company_name, state, and contact_email are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUserData } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUserData?.users?.find(
      u => u.email?.toLowerCase() === body.contact_email.toLowerCase()
    )

    let userId: string
    let tempPassword: string | null = null

    if (existingUser) {
      userId = existingUser.id
      
      // Check if org already exists for this user
      const { data: existingOrg } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('id', userId)
        .single()

      if (existingOrg) {
        return NextResponse.json(
          { error: 'Conflict', message: 'Organization already exists for this email' },
          { status: 409 }
        )
      }
    } else {
      // Create new user
      tempPassword = crypto.randomUUID()
      
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: body.contact_email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          company_name: body.company_name,
          source: 'agent_api',
          agent_id: agentContext.agentId,
          needs_password_setup: true,
        },
      })

      if (authError || !authData.user) {
        console.error('Auth error:', authError)
        return NextResponse.json(
          { error: 'Internal Server Error', message: 'Failed to create user account' },
          { status: 500 }
        )
      }

      userId = authData.user.id
    }

    // Create organization
    const { error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        id: userId,
        owner_id: userId,
        name: body.company_name,
        states: [body.state],
        quiz_tools: body.ai_tools_used || [],
        quiz_usages: [],
        employee_count: body.employee_count || null,
        plan: 'trial',
        trial_started_at: new Date().toISOString(),
        documents_generated: 0,
        agent_id: agentContext.agentId,
        agent_created_at: new Date().toISOString(),
      })

    if (orgError) {
      console.error('Org creation error:', orgError)
      return NextResponse.json(
        { error: 'Internal Server Error', message: 'Failed to create organization' },
        { status: 500 }
      )
    }

    // Create user record
    await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        org_id: userId,
        email: body.contact_email,
        role: 'admin',
      })

    // Add hiring state
    await supabaseAdmin
      .from('hiring_states')
      .insert({
        org_id: userId,
        state_code: body.state,
      })

    // Initialize remediation items for regulated states
    const regulatedStates = ['IL', 'CO', 'CA', 'NYC']
    if (regulatedStates.includes(body.state)) {
      const { stateChecklists } = await import('@/lib/types/compliance')
      const checklist = stateChecklists[body.state] || []
      
      const remediationItems = checklist.map(item => ({
        org_id: userId,
        state_code: body.state,
        item_key: item.key,
        item_label: item.label,
        item_description: item.description,
        status: 'incomplete',
      }))

      if (remediationItems.length > 0) {
        await supabaseAdmin
          .from('remediation_items')
          .insert(remediationItems)
      }
    }

    // Increment agent org count
    const { data: agentKeyData } = await supabaseAdmin
      .from('agent_keys')
      .select('org_count')
      .eq('agent_id', agentContext.agentId)
      .single()
    
    await supabaseAdmin
      .from('agent_keys')
      .update({ 
        org_count: (agentKeyData?.org_count || 0) + 1,
        updated_at: new Date().toISOString() 
      })
      .eq('agent_id', agentContext.agentId)

    // Track event
    trackServerEvent('agent_org_created', {
      agent_id: agentContext.agentId,
      state: body.state,
      ai_tools_count: body.ai_tools_used?.length || 0,
    }, userId, userId)

    // Generate API key for this org (for direct API access if needed)
    const orgApiKey = generateApiKey()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://employarmor.com'
    
    const response: CreateOrgResponse = {
      org_id: userId,
      dashboard_url: `${baseUrl}/dashboard`,
      api_key: orgApiKey,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Agent create org error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
