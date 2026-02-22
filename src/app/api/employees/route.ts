import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: employees, error } = await supabase
    .from('employees')
    .select('*, employee_disclosures(*)')
    .eq('org_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const formatted = (employees || []).map((emp: any) => {
    const disclosure = emp.employee_disclosures?.[0] || null
    return {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      token: emp.token,
      created_at: emp.created_at,
      disclosure_id: disclosure?.id,
      status: disclosure?.status || 'not_sent',
      sent_at: disclosure?.sent_at,
      viewed_at: disclosure?.viewed_at,
      signed_at: disclosure?.signed_at,
      signature_text: disclosure?.signature_text,
      disclosure_type: disclosure?.disclosure_type,
      opted_out_tools: disclosure?.opted_out_tools,
    }
  })

  return NextResponse.json({ employees: formatted })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email } = await request.json()
  if (!name || !email) return NextResponse.json({ error: 'Name and email required' }, { status: 400 })

  const { data: employee, error } = await supabase
    .from('employees')
    .insert({ org_id: user.id, name, email })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Employee already exists' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase
    .from('employee_disclosures')
    .insert({ employee_id: employee.id, org_id: user.id })

  return NextResponse.json({ employee })
}
