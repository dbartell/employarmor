import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { csv } = await request.json()
  if (!csv) return NextResponse.json({ error: 'CSV data required' }, { status: 400 })

  const lines = csv.split('\n').map((l: string) => l.trim()).filter((l: string) => l)
  let imported = 0
  let skipped = 0

  for (const line of lines) {
    const [name, email] = line.split(',').map((s: string) => s.trim())
    if (!name || !email) { skipped++; continue }

    const { data: employee, error } = await supabase
      .from('employees')
      .insert({ org_id: user.id, name, email })
      .select()
      .single()

    if (error) { skipped++; continue }

    await supabase
      .from('employee_disclosures')
      .insert({ employee_id: employee.id, org_id: user.id })

    imported++
  }

  return NextResponse.json({ imported, skipped })
}
