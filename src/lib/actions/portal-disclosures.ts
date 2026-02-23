"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Disclosure {
  id: string
  organization_id: string
  employee_id: string
  document_id: string | null
  document_title: string | null
  signature_text: string | null
  signed_at: string | null
  ip_address: string | null
  user_agent: string | null
}

// Hardcoded disclosure content
export const DISCLOSURE_TEMPLATES = {
  "ai-tool-usage": {
    title: "AI Tool Usage Policy",
    content: `AI Tool Usage Policy and Disclosure

Effective Date: ${new Date().toLocaleDateString()}

This policy outlines the acceptable use of Artificial Intelligence (AI) tools within our organization and your rights regarding automated decision-making systems.

1. SCOPE OF AI USAGE
Our organization uses AI-powered tools to assist with various employment-related functions, including but not limited to:
- Resume screening and candidate evaluation
- Skills assessment and competency testing
- Performance analytics and feedback generation
- Scheduling and workflow optimization
- Training recommendations and personalized learning paths

2. YOUR RIGHTS
As an employee subject to AI-assisted decision-making, you have the right to:
- Be informed when AI systems are used in decisions affecting your employment
- Request human review of any AI-generated decision
- Understand the logic and criteria used by AI systems
- Challenge decisions you believe to be inaccurate or biased
- Opt out of certain AI processing where legally permitted

3. DATA PRIVACY
AI systems may process your personal data, including:
- Performance metrics and work product
- Communication patterns and collaboration data
- Skills assessments and training completion records
- Attendance and scheduling information

All data processing complies with applicable privacy laws and our Data Privacy Notice.

4. LIMITATIONS AND HUMAN OVERSIGHT
AI tools serve as decision-support systems only. Final employment decisions are made by human managers and HR professionals who consider AI recommendations alongside other factors.

5. REPORTING CONCERNS
If you believe an AI system has made an unfair or biased decision affecting you, please contact HR immediately at hr@yourcompany.com.

By signing below, you acknowledge that you have read, understood, and agree to comply with this AI Tool Usage Policy.`
  },
  "data-privacy": {
    title: "Data Privacy Notice",
    content: `Employee Data Privacy Notice

Effective Date: ${new Date().toLocaleDateString()}

This notice explains how we collect, use, and protect your personal data in compliance with applicable privacy laws, including GDPR, CCPA, and state employment privacy regulations.

1. DATA WE COLLECT
We collect and process the following categories of employee data:

Personal Information:
- Name, contact details, emergency contacts
- Social Security Number or tax identification
- Date of birth, citizenship/work authorization status

Employment Information:
- Job title, department, manager
- Compensation and benefits data
- Performance reviews and disciplinary records
- Attendance and time tracking

Professional Development:
- Training completion records and certificates
- Skills assessments and competencies
- Career development plans

Technology Usage:
- Email and communication logs (when legally permitted)
- System access logs and security records
- Device and network usage data

2. HOW WE USE YOUR DATA
Your data is used for legitimate employment purposes:
- Payroll and benefits administration
- Performance management and career development
- Compliance with legal and regulatory requirements
- Workplace safety and security
- Business analytics and planning

3. DATA SHARING
We may share your data with:
- Payroll and benefits providers
- Legal and regulatory authorities when required
- Third-party service providers under strict confidentiality agreements

We do not sell your personal data to third parties.

4. AUTOMATED DECISION-MAKING
Some employment decisions may be assisted by automated systems or AI. You have the right to:
- Be informed when automated systems are used
- Request human review of automated decisions
- Understand the logic behind automated decisions

5. YOUR RIGHTS
You have the right to:
- Access your personal data
- Request correction of inaccurate data
- Request deletion of data (subject to legal retention requirements)
- Object to certain types of processing
- Receive a copy of your data in portable format

6. DATA SECURITY
We implement appropriate technical and organizational measures to protect your data, including:
- Encryption of sensitive data
- Access controls and authentication
- Regular security audits and updates
- Employee training on data protection

7. DATA RETENTION
We retain your data for as long as necessary to fulfill employment purposes and comply with legal requirements. Typical retention periods:
- Active employment records: Duration of employment + 7 years
- Payroll records: 7 years after termination
- Training records: 7 years after completion
- Safety records: As required by OSHA and state law

8. CONTACT INFORMATION
For questions about this notice or to exercise your privacy rights, contact:
Privacy Officer
privacy@yourcompany.com

By signing below, you acknowledge that you have read and understood this Data Privacy Notice.`
  },
  "automated-decisions": {
    title: "Automated Decision-Making Disclosure",
    content: `Notice of Automated Employment Decision-Making Tools

Effective Date: ${new Date().toLocaleDateString()}

Federal and state laws require us to notify you when we use automated systems, including Artificial Intelligence (AI), in employment decisions that may affect you.

1. WHAT ARE AUTOMATED EMPLOYMENT DECISION TOOLS (AEDTs)?
AEDTs are computer-based systems that use algorithms, machine learning, or AI to assist with or make employment-related decisions. This includes tools that:
- Screen resumes or applications
- Assess candidate qualifications or fit
- Evaluate employee performance
- Make scheduling or assignment decisions
- Recommend training or development paths

2. HOW WE USE AEDTs
Our organization uses the following types of automated systems:

Applicant Screening:
- Resume parsing and keyword matching
- Skills assessment platforms
- Video interview analysis (if applicable)

Employee Management:
- Performance analytics dashboards
- Automated scheduling systems
- Learning management systems with AI recommendations

3. LEGAL COMPLIANCE
Our use of AEDTs complies with:
- Illinois HB 3773 (AI in Employment)
- New York City Local Law 144 (Bias Audit Requirements)
- Colorado AI Act
- Other applicable state and federal employment laws

4. BIAS AUDITS AND TESTING
Where required by law, we conduct annual bias audits of our AEDTs to test for discrimination based on:
- Race, ethnicity, and national origin
- Sex and gender identity
- Age
- Disability status
- Other protected characteristics

Audit results are published in accordance with local law requirements.

5. YOUR RIGHTS REGARDING AEDTs

Right to Notice: You will be informed when AEDTs are used in decisions affecting your employment.

Right to Human Review: You may request that a human review any decision made or substantially assisted by an AEDT.

Right to Alternative Process: In some cases, you may request an alternative evaluation process that does not use automated systems.

Right to Explanation: You may request information about:
- The type of AEDT used
- The job qualifications and characteristics the AEDT evaluates
- The data sources used by the AEDT
- How the AEDT's output is used in the decision-making process

Right to Challenge: You may challenge any decision you believe was made based on inaccurate data or discriminatory criteria.

6. HOW TO EXERCISE YOUR RIGHTS
To request human review, an alternative process, or an explanation of AEDT use, contact:

Human Resources Department
Email: hr@yourcompany.com
Phone: (555) 123-4567

Requests will be responded to within 10 business days in accordance with applicable law.

7. NO RETALIATION
You will not face retaliation for exercising your rights regarding AEDTs or for raising concerns about potential bias or discrimination.

8. DATA RETENTION
Data processed by AEDTs is retained in accordance with our Data Privacy Notice and applicable record retention laws.

By signing below, you acknowledge that you have received and understood this notice regarding automated decision-making tools.`
  }
}

export async function getEmployeeDisclosures(employeeId: string, organizationId: string) {
  const supabase = await createClient()
  
  const { data: disclosures, error } = await supabase
    .from('disclosure_acknowledgments')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('organization_id', organizationId)
    .order('signed_at', { ascending: false, nullsFirst: true })
  
  if (error) {
    console.error('Error fetching disclosures:', error)
    return { disclosures: [], error: error.message }
  }
  
  return { disclosures: disclosures || [], error: null }
}

export async function ensureStandardDisclosures(employeeId: string, organizationId: string) {
  const supabase = await createClient()
  
  // Check existing disclosures
  const { data: existing } = await supabase
    .from('disclosure_acknowledgments')
    .select('document_title')
    .eq('employee_id', employeeId)
    .eq('organization_id', organizationId)
  
  const existingTitles = new Set(existing?.map(d => d.document_title) || [])
  
  // Create missing standard disclosures
  const disclosuresToCreate = []
  
  if (!existingTitles.has(DISCLOSURE_TEMPLATES['ai-tool-usage'].title)) {
    disclosuresToCreate.push({
      organization_id: organizationId,
      employee_id: employeeId,
      document_id: 'ai-tool-usage',
      document_title: DISCLOSURE_TEMPLATES['ai-tool-usage'].title,
      signature_text: null,
      signed_at: null,
      ip_address: null,
      user_agent: null
    })
  }
  
  if (!existingTitles.has(DISCLOSURE_TEMPLATES['data-privacy'].title)) {
    disclosuresToCreate.push({
      organization_id: organizationId,
      employee_id: employeeId,
      document_id: 'data-privacy',
      document_title: DISCLOSURE_TEMPLATES['data-privacy'].title,
      signature_text: null,
      signed_at: null,
      ip_address: null,
      user_agent: null
    })
  }
  
  if (!existingTitles.has(DISCLOSURE_TEMPLATES['automated-decisions'].title)) {
    disclosuresToCreate.push({
      organization_id: organizationId,
      employee_id: employeeId,
      document_id: 'automated-decisions',
      document_title: DISCLOSURE_TEMPLATES['automated-decisions'].title,
      signature_text: null,
      signed_at: null,
      ip_address: null,
      user_agent: null
    })
  }
  
  if (disclosuresToCreate.length > 0) {
    const { error } = await supabase
      .from('disclosure_acknowledgments')
      .insert(disclosuresToCreate)
    
    if (error) {
      console.error('Error creating standard disclosures:', error)
      return { error: error.message }
    }
  }
  
  return { error: null }
}

export async function signDisclosure(
  disclosureId: string,
  signatureText: string,
  ipAddress: string,
  userAgent: string
) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('disclosure_acknowledgments')
    .update({
      signature_text: signatureText,
      signed_at: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent
    })
    .eq('id', disclosureId)
  
  if (error) {
    console.error('Error signing disclosure:', error)
    return { error: error.message }
  }
  
  revalidatePath('/portal/disclosures')
  revalidatePath('/portal')
  
  return { error: null }
}

export function getDisclosureContent(documentId: string | null): string {
  if (!documentId || !(documentId in DISCLOSURE_TEMPLATES)) {
    return "Disclosure content not available."
  }
  
  return DISCLOSURE_TEMPLATES[documentId as keyof typeof DISCLOSURE_TEMPLATES].content
}
