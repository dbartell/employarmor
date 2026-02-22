import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://employarmor.vercel.app'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', user.id)
    .single()

  const companyName = org?.name || 'Your Company'
  const body = await request.json()

  let query = supabase
    .from('employees')
    .select('*, employee_disclosures(*)')
    .eq('org_id', user.id)

  const { data: allEmployees } = await query

  let targets: any[] = []

  if (body.remindUnsigned) {
    targets = (allEmployees || []).filter((e: any) => {
      const d = e.employee_disclosures?.[0]
      return d && d.status === 'sent'
    })
  } else if (body.all) {
    targets = (allEmployees || []).filter((e: any) => {
      const d = e.employee_disclosures?.[0]
      return !d || d.status !== 'signed'
    })
  } else if (body.employeeIds) {
    targets = (allEmployees || []).filter((e: any) => body.employeeIds.includes(e.id))
  }

  let sent = 0
  let errors = 0

  for (const emp of targets) {
    const disclosure = emp.employee_disclosures?.[0]
    if (!disclosure) continue

    const acknowledgeUrl = `${BASE_URL}/acknowledge/${emp.token}`

    try {
      await resend.emails.send({
        from: 'EmployArmor Compliance <onboarding@resend.dev>',
        to: emp.email,
        subject: `${companyName} — AI Tool Disclosure Notice: Action Required`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e40af; font-size: 24px; margin: 0;">🛡️ EmployArmor</h1>
              <p style="color: #6b7280; font-size: 14px;">AI Hiring Compliance</p>
            </div>
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px;">
              <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px;">AI Tool Disclosure Notice</h2>
              <p style="color: #374151; line-height: 1.6;">Hi ${emp.name},</p>
              <p style="color: #374151; line-height: 1.6;"><strong>${companyName}</strong> uses AI-powered tools in its hiring and employment processes. As required by applicable state and local laws, we are providing you with this disclosure notice.</p>
              <p style="color: #374151; line-height: 1.6;">Please review the disclosure and provide your acknowledgment by clicking the button below:</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${acknowledgeUrl}" style="background: #2563eb; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">Review & Acknowledge</a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="color: #2563eb; font-size: 13px; word-break: break-all;">${acknowledgeUrl}</p>
            </div>
            <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px;">Powered by EmployArmor — AI Hiring Compliance</p>
            </div>
          </div>
        `,
      })

      await supabase
        .from('employee_disclosures')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', disclosure.id)

      sent++
    } catch {
      errors++
    }
  }

  return NextResponse.json({ sent, errors })
}
