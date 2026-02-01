import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { aiHiringTools } from '@/data/tools'

// Use service role for public API access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Fetch disclosure page
    const { data: page, error } = await supabase
      .from('disclosure_pages')
      .select(`
        *,
        organizations (
          id,
          name
        )
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !page) {
      return NextResponse.json(
        { error: 'Disclosure page not found' },
        { status: 404 }
      )
    }

    // Get hiring tools if use_audit_tools is enabled
    let tools = page.custom_tools || []
    
    if (page.use_audit_tools && page.organization_id) {
      const { data: hiringTools } = await supabase
        .from('hiring_tools')
        .select('*')
        .eq('org_id', page.organization_id)

      if (hiringTools && hiringTools.length > 0) {
        const auditTools = hiringTools.map((tool: { tool_name: string; usage_description?: string }) => {
          const toolInfo = aiHiringTools.find(t => t.id === tool.tool_name)
          return {
            name: toolInfo?.name || tool.tool_name,
            purpose: toolInfo?.description || tool.usage_description || 'Employment decision support',
            evaluates: toolInfo?.commonUses?.join(', ') || 'Various employment factors',
            stages: 'Multiple stages'
          }
        })
        tools = [...auditTools, ...tools]
      }
    }

    // Track page view (async, non-blocking)
    const referrer = request.headers.get('referer') || undefined
    const userAgent = request.headers.get('user-agent') || undefined
    
    supabase.from('disclosure_page_views').insert({
      disclosure_page_id: page.id,
      referrer,
      user_agent: userAgent,
      ip_hash: Math.random().toString(36).substring(2, 15),
      embed_type: 'widget',
    }).then(() => {})

    // Return response with CORS headers for embedding
    return NextResponse.json(
      { ...page, tools },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching disclosure:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
