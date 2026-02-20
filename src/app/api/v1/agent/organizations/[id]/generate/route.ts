import { NextRequest, NextResponse } from 'next/server'
import { authenticateAgent, supabaseAdmin, verifyOrgOwnership } from '@/lib/agent-auth'

interface GenerateRequest {
  state: string
  documents: string[]
  format?: 'html' | 'markdown' | 'text'
  company_details?: {
    name?: string
    contact_email?: string
    contact_phone?: string
    address?: string
  }
}

interface GeneratedDocument {
  id: string
  type: string
  title: string
  content: string
  format: string
  url: string
}

interface GenerateResponse {
  document_urls: string[]
  package_url: string
  documents: GeneratedDocument[]
}

// Document templates
const documentTemplates: Record<string, {
  title: string
  states: string[]
  template: string
}> = {
  'disclosure-candidate': {
    title: 'Candidate Disclosure Notice',
    states: ['IL', 'CO', 'CA', 'NYC'],
    template: `NOTICE OF AI USE IN HIRING

[COMPANY_NAME] uses artificial intelligence (AI) technology as part of our hiring and employment decision-making process.

WHAT THIS MEANS:
AI-powered tools may be used to analyze your application materials, including but not limited to:
• Resume screening and parsing
• Skills assessment evaluation
• Video interview analysis
• Background check processing

YOUR RIGHTS:
As a candidate, you have the right to:
1. Request information about how AI is used in our hiring process
2. Request an alternative selection process that does not rely solely on AI
3. Request a human review of any AI-generated decision

This notice is provided in compliance with [APPLICABLE_LAWS].

If you have questions about our use of AI in hiring, please contact [CONTACT_EMAIL].

Date: [DATE]
[COMPANY_NAME]`,
  },
  'disclosure-employee': {
    title: 'Employee Disclosure Notice',
    states: ['IL', 'CO', 'CA'],
    template: `EMPLOYEE NOTICE: AI IN EMPLOYMENT DECISIONS

Dear Employee,

[COMPANY_NAME] uses artificial intelligence (AI) systems that may factor into employment-related decisions. This notice informs you of this use in compliance with [APPLICABLE_LAWS].

AI SYSTEMS IN USE:
The following AI tools may influence employment decisions:
• Performance monitoring and evaluation tools
• Workforce planning and scheduling systems
• Training recommendation systems

TYPES OF DECISIONS:
AI may be used as a factor in decisions related to:
• Performance reviews
• Promotion considerations
• Work assignments
• Training recommendations

YOUR RIGHTS:
You have the right to:
1. Request information about AI systems that affect you
2. Request human review of significant AI-assisted decisions
3. Provide feedback on AI system impacts

CONTACT:
For questions, contact HR at [CONTACT_EMAIL].

Effective Date: [DATE]
[COMPANY_NAME]`,
  },
  'consent-form': {
    title: 'Candidate Consent Form',
    states: ['CO', 'CA'],
    template: `AI PROCESSING CONSENT FORM

CANDIDATE INFORMATION:
Name: _________________________
Position Applied For: _________________________
Date: _________________________

CONSENT STATEMENT:
I, the undersigned, acknowledge that I have received and read the Notice of AI Use in Hiring from [COMPANY_NAME].

I understand that:
1. AI technology will be used to process my application
2. AI may analyze my resume, assessments, and interview responses
3. I may request human review of AI-assisted decisions
4. I may withdraw this consent at any time

By signing below, I consent to the use of AI technology in evaluating my application for employment.

☐ I CONSENT to AI processing of my application
☐ I DO NOT CONSENT and request an alternative process

Signature: _________________________
Date: _________________________

For internal use:
Received by: _________________________
Date: _________________________`,
  },
  'handbook-policy': {
    title: 'Employee Handbook AI Policy',
    states: ['IL', 'CO', 'CA'],
    template: `EMPLOYEE HANDBOOK SECTION: ARTIFICIAL INTELLIGENCE USE POLICY

1. PURPOSE
This policy establishes guidelines for [COMPANY_NAME]'s use of artificial intelligence (AI) and automated decision-making tools in employment-related matters.

2. SCOPE
This policy applies to all employees and covers the use of AI in:
• Hiring and recruitment
• Performance management
• Workforce planning
• Employee development

3. TRANSPARENCY
We are committed to transparency about AI use:
• Employees will be notified when AI influences decisions affecting them
• Information about AI systems is available upon request
• Regular reviews ensure AI systems function as intended

4. HUMAN OVERSIGHT
All significant employment decisions involving AI include:
• Human review before final decisions
• Appeal process for affected employees
• Regular audits of AI system outputs

5. FAIRNESS & NON-DISCRIMINATION
Our AI systems are:
• Regularly tested for bias
• Designed to promote equal opportunity
• Subject to independent audits as required by law

6. EMPLOYEE RIGHTS
Employees may:
• Request information about AI systems affecting them
• Request human review of AI-influenced decisions
• Report concerns about AI system impacts

7. COMPLIANCE
This policy complies with all applicable federal, state, and local laws.

8. CONTACT
Questions about this policy: [CONTACT_EMAIL]

Effective Date: [DATE]
Last Updated: [DATE]`,
  },
}

// State-specific law names
const stateLawNames: Record<string, string> = {
  IL: 'Illinois AI Video Interview Act (820 ILCS 42) and HB 3773',
  CO: 'Colorado AI Act (SB24-205)',
  CA: 'California Consumer Privacy Act and proposed AEDT regulations',
  NYC: 'NYC Local Law 144',
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

    const body: GenerateRequest = await req.json()

    if (!body.state || !body.documents || body.documents.length === 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'state and documents[] are required' },
        { status: 400 }
      )
    }

    // Get organization info
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single()

    if (!org) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Organization not found' },
        { status: 404 }
      )
    }

    const companyName = body.company_details?.name || org.name || 'Your Company'
    const contactEmail = body.company_details?.contact_email || org.contact_email || 'hr@company.com'
    const applicableLaws = stateLawNames[body.state] || 'applicable state and local laws'
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    const format = body.format || 'html'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://employarmor.com'
    
    const generatedDocuments: GeneratedDocument[] = []
    const documentUrls: string[] = []

    for (const docType of body.documents) {
      const template = documentTemplates[docType]
      if (!template) {
        continue // Skip unknown document types
      }

      // Replace placeholders
      let content = template.template
        .replace(/\[COMPANY_NAME\]/g, companyName)
        .replace(/\[CONTACT_EMAIL\]/g, contactEmail)
        .replace(/\[APPLICABLE_LAWS\]/g, applicableLaws)
        .replace(/\[DATE\]/g, currentDate)

      // Convert to requested format
      if (format === 'html') {
        content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${template.title} - ${companyName}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #1e40af; }
    ul { margin: 10px 0; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
${content.split('\n').map(line => {
  if (line.match(/^[A-Z][A-Z\s:&]+$/)) return `<h2>${line}</h2>`
  if (line.startsWith('•')) return `<li>${line.slice(1).trim()}</li>`
  if (line.match(/^\d+\./)) return `<h3>${line}</h3>`
  if (line.trim() === '') return '<br>'
  return `<p>${line}</p>`
}).join('\n')}
</body>
</html>`
      }

      // Save to database
      const { data: savedDoc, error: saveError } = await supabaseAdmin
        .from('documents')
        .insert({
          org_id: orgId,
          doc_type: docType,
          title: `${template.title} - ${body.state}`,
          content: content,
          version: 1,
        })
        .select()
        .single()

      if (saveError) {
        console.error('Error saving document:', saveError)
        continue
      }

      const docUrl = `${baseUrl}/api/disclosure/${savedDoc.id}`
      documentUrls.push(docUrl)

      generatedDocuments.push({
        id: savedDoc.id,
        type: docType,
        title: template.title,
        content: format === 'markdown' || format === 'text' ? content : savedDoc.content,
        format,
        url: docUrl,
      })
    }

    // Update documents_generated count
    await supabaseAdmin
      .from('organizations')
      .update({ 
        documents_generated: (org.documents_generated || 0) + generatedDocuments.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orgId)

    // Mark disclosure remediation items as complete
    for (const doc of generatedDocuments) {
      if (doc.type === 'disclosure-candidate' || doc.type === 'disclosure-employee') {
        await supabaseAdmin
          .from('remediation_items')
          .update({
            status: 'complete',
            completed_at: new Date().toISOString(),
            linked_document_id: doc.id,
          })
          .eq('org_id', orgId)
          .eq('item_key', 'disclosure')
      }
    }

    const response: GenerateResponse = {
      document_urls: documentUrls,
      package_url: `${baseUrl}/api/v1/agent/organizations/${orgId}/package`,
      documents: generatedDocuments,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Agent generate error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
