/**
 * Shared email sending utility using Resend API
 */

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

const DEFAULT_FROM = 'EmployArmor <notifications@employarmor.com>'

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[Email] RESEND_API_KEY not set — logging email instead')
    console.log(`[Email] To: ${Array.isArray(to) ? to.join(', ') : to}`)
    console.log(`[Email] Subject: ${subject}`)
    console.log(`[Email] From: ${from || DEFAULT_FROM}`)
    return { success: true, id: 'dev-logged' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || DEFAULT_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('[Email] Resend API error:', res.status, errorData)
      return { success: false, error: `Resend API error: ${res.status}` }
    }

    const data = await res.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
