import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { toolCatalog } from '@/data/tool-catalog'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Get org info
  const { data: org } = await supabase
    .from('organizations')
    .select('name, industry, quiz_tools, states, active_states, primary_state')
    .eq('id', user.id)
    .single()

  const companyName = org?.name || 'Your Company'
  const industry = org?.industry || 'technology'
  const states = org?.active_states || org?.states || [org?.primary_state || 'IL']
  const quizTools = org?.quiz_tools || []

  // Cross-reference quiz_tools with tool catalog to get names
  const toolNames: string[] = []
  if (Array.isArray(quizTools)) {
    for (const slug of quizTools) {
      const entry = toolCatalog.find((t: { slug: string }) => t.slug === slug)
      if (entry) {
        toolNames.push(`${entry.name} (${entry.vendor})`)
      } else {
        toolNames.push(slug)
      }
    }
  }

  const toolList = toolNames.length > 0
    ? toolNames.map((t, i) => `   ${i + 1}. ${t}`).join('\n')
    : '   • No AI tools currently registered in the Tool Registry'

  const stateList = states.join(', ')
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const content = `EMPLOYEE HANDBOOK ADDENDUM
AI USE POLICY

${companyName}
Effective Date: ${today}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PURPOSE & SCOPE

This policy establishes guidelines for the use of artificial intelligence (AI) and automated decision-making tools within ${companyName}. It applies to all employees, contractors, and agents who use or interact with AI systems in the course of their work.

${companyName} is committed to the responsible, transparent, and ethical use of AI technology. This policy ensures compliance with applicable laws in ${stateList} and establishes best practices for AI governance across the organization.

All employees are expected to read, understand, and comply with this policy. Questions should be directed to Human Resources.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. APPROVED AI TOOLS

The following AI-powered tools have been approved for use in ${industry} operations at ${companyName}:

${toolList}

Only tools listed above or subsequently approved through the company's AI Tool Approval Process may be used for business purposes. Employees must not use unapproved AI tools to process company data, candidate information, or employee records.

To request approval for a new AI tool, submit a request through the Tool Registry at EmployArmor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. PROHIBITED USES

The following uses of AI are strictly prohibited:

   a) Using AI to make final employment decisions (hiring, firing, promotion, demotion) without human review and approval
   
   b) Using AI tools to process biometric data (facial recognition, fingerprints, voiceprints) without proper notice and consent as required by law
   
   c) Using unapproved AI tools to screen, evaluate, or score job candidates or employees
   
   d) Sharing confidential employee or candidate data with AI tools not approved by the company
   
   e) Using AI to conduct surveillance of employees beyond what is disclosed in company policies
   
   f) Relying solely on AI outputs for decisions that materially affect employment terms, conditions, or privileges
   
   g) Using AI in any manner that discriminates based on protected characteristics including race, gender, age, disability, religion, or national origin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. EMPLOYEE RESPONSIBILITIES

All employees who use or interact with AI tools must:

   a) Complete required AI awareness training before using any AI tools
   
   b) Use only approved AI tools as listed in Section 2 of this policy
   
   c) Ensure human oversight of all AI-assisted decisions that affect employment
   
   d) Report any concerns about AI bias, errors, or unexpected behavior immediately
   
   e) Protect the privacy of candidates and employees when using AI tools
   
   f) Document AI-assisted decisions and maintain records as required by the Audit Packet
   
   g) Stay current on company AI policies and complete periodic refresher training

Managers and HR personnel have additional responsibilities:

   h) Ensure their teams are aware of and comply with this policy
   
   i) Review AI-assisted recommendations before making employment decisions
   
   j) Respond promptly to employee or candidate inquiries about AI use

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. REPORTING & CONCERNS

${companyName} encourages employees to report any concerns related to AI use in the workplace. Reports can be made through:

   • Direct supervisor or manager
   • Human Resources department
   • Anonymous reporting (where available)

Concerns may include but are not limited to:
   - Suspected bias or discrimination in AI outputs
   - Use of unapproved AI tools
   - Privacy violations related to AI processing
   - AI errors that could affect employment decisions
   - Retaliation for raising AI-related concerns

All reports will be investigated promptly and confidentially. ${companyName} prohibits retaliation against any employee who raises good-faith concerns about AI use.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. COMPLIANCE & CONSEQUENCES

Failure to comply with this AI Use Policy may result in disciplinary action, up to and including termination of employment. Specific consequences depend on the severity and nature of the violation:

   • Minor violations (first offense): Written warning and mandatory retraining
   • Moderate violations: Suspension of AI tool access and formal corrective action
   • Severe violations: Termination and potential legal action

This policy is subject to periodic review and updates as AI technology and applicable regulations evolve. Employees will be notified of material changes.

This policy complements and does not replace other company policies regarding data privacy, information security, equal employment opportunity, and workplace conduct.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACKNOWLEDGMENT

By continuing employment with ${companyName}, employees acknowledge that they have received, read, and understood this AI Use Policy and agree to abide by its terms.

${companyName}
${today}`

  // Save to database
  const now = new Date().toISOString()
  const { data: existing } = await supabase
    .from('handbook_policies')
    .select('id')
    .eq('org_id', user.id)
    .single()

  let policy
  if (existing) {
    const { data } = await supabase
      .from('handbook_policies')
      .update({ content, updated_at: now, generated_at: now })
      .eq('org_id', user.id)
      .select()
      .single()
    policy = data
  } else {
    const { data } = await supabase
      .from('handbook_policies')
      .insert({ org_id: user.id, content, generated_at: now, updated_at: now, added_to_handbook: false })
      .select()
      .single()
    policy = data
  }

  return NextResponse.json({ policy })
}
