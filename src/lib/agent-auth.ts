import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin client for agent API operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AgentContext {
  agentId: string
  agentKeyId: string
  agentName: string | null
}

/**
 * Authenticate an agent request using Bearer token and X-Agent-ID header
 * Returns the agent context or null if authentication fails
 */
export async function authenticateAgent(req: NextRequest): Promise<AgentContext | null> {
  const authHeader = req.headers.get('Authorization')
  const agentIdHeader = req.headers.get('X-Agent-ID')

  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const apiKey = authHeader.slice(7) // Remove 'Bearer ' prefix

  if (!apiKey) {
    return null
  }

  // Look up the API key
  const { data: agentKey, error } = await supabaseAdmin
    .from('agent_keys')
    .select('id, agent_id, name')
    .eq('api_key', apiKey)
    .single()

  if (error || !agentKey) {
    return null
  }

  // If X-Agent-ID is provided, verify it matches
  if (agentIdHeader && agentIdHeader !== agentKey.agent_id) {
    return null
  }

  // Update last_used_at
  await supabaseAdmin
    .from('agent_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', agentKey.id)

  return {
    agentId: agentKey.agent_id,
    agentKeyId: agentKey.id,
    agentName: agentKey.name,
  }
}

/**
 * Middleware wrapper that handles agent authentication
 */
export function withAgentAuth<T>(
  handler: (req: NextRequest, context: AgentContext) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const agentContext = await authenticateAgent(req)

    if (!agentContext) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or missing agent API key' },
        { status: 401 }
      )
    }

    return handler(req, agentContext)
  }
}

/**
 * Verify that an organization belongs to the authenticated agent
 */
export async function verifyOrgOwnership(orgId: string, agentId: string): Promise<boolean> {
  const { data: org, error } = await supabaseAdmin
    .from('organizations')
    .select('agent_id')
    .eq('id', orgId)
    .single()

  if (error || !org) {
    return false
  }

  return org.agent_id === agentId
}

/**
 * Generate a secure API key
 */
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const prefix = 'ahl_' // AIHireLaw prefix
  let key = prefix
  for (let i = 0; i < 48; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

/**
 * Increment org count for an agent
 */
export async function incrementAgentOrgCount(agentId: string): Promise<void> {
  // Get current count and increment
  const { data } = await supabaseAdmin
    .from('agent_keys')
    .select('org_count')
    .eq('agent_id', agentId)
    .single()
  
  const currentCount = data?.org_count || 0
  
  await supabaseAdmin
    .from('agent_keys')
    .update({ org_count: currentCount + 1 })
    .eq('agent_id', agentId)
}
