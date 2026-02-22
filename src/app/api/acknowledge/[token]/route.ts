import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: employee, error } = await supabase
    .from('employees')
    .select('*, employee_disclosures(*)')
    .eq('token', token)
    .single()

  if (error || !employee) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  // Get org info
  const { data: org } = await supabase
    .from('organizations')
    .select('name, states, quiz_tools')
    .eq('id', employee.org_id)
    .single()

  const disclosure = employee.employee_disclosures?.[0]

  // Mark as viewed if first view
  if (disclosure && disclosure.status === 'sent') {
    await supabase
      .from('employee_disclosures')
      .update({ status: 'viewed', viewed_at: new Date().toISOString() })
      .eq('id', disclosure.id)
  }

  return NextResponse.json({
    employee: { name: employee.name, email: employee.email },
    org: { name: org?.name, states: org?.states, quiz_tools: org?.quiz_tools },
    disclosure: disclosure ? {
      status: disclosure.status === 'sent' ? 'viewed' : disclosure.status,
      signed_at: disclosure.signed_at,
      signature_text: disclosure.signature_text,
      disclosure_type: disclosure.disclosure_type,
      opted_out_tools: disclosure.opted_out_tools,
    } : null,
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: employee, error } = await supabase
    .from('employees')
    .select('*, employee_disclosures(*)')
    .eq('token', token)
    .single()

  if (error || !employee) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  const disclosure = employee.employee_disclosures?.[0]
  if (!disclosure) return NextResponse.json({ error: 'No disclosure found' }, { status: 404 })
  if (disclosure.status === 'signed') return NextResponse.json({ error: 'Already signed' }, { status: 400 })

  const body = await request.json()
  const { signatureText, optOutTools, disclosureType } = body

  if (!signatureText) return NextResponse.json({ error: 'Signature required' }, { status: 400 })

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const ua = request.headers.get('user-agent') || 'unknown'

  const { error: updateError } = await supabase
    .from('employee_disclosures')
    .update({
      status: 'signed',
      signed_at: new Date().toISOString(),
      signature_text: signatureText,
      ip_address: ip,
      user_agent: ua,
      disclosure_type: disclosureType || 'ai_tool_use',
      opted_out_tools: optOutTools || [],
    })
    .eq('id', disclosure.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ success: true, signed_at: new Date().toISOString() })
}
