{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "AI Hiring Disclosure Template Download | Free Compliance Template | EmployArmor",
  description: "Download our free AI hiring disclosure template. Compliant with NYC Local Law 144, Illinois AIVIA, and multi-state requirements. Customizable for your tools.",
}

export default function AIHiringDisclosureTemplatePage() {
  return (
    <ArticleLayout
      title="AI Hiring Disclosure Template: Free Download & Implementation Guide"
      description="Proper disclosure is the foundation of AI hiring compliance. Use our free template to create legally compliant notices for candidates in every jurisdiction where you hire."
      category="Free Resource"
      readTime="8 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        Nearly every AI hiring law requires disclosure to candidates—but the specifics vary dramatically. Some states 
        require consent. Some require 10 days' advance notice. Some demand detailed explanations of how AI is used.
      </p>

      <p>
        Getting disclosure wrong is one of the most common compliance failures. This template provides multi-jurisdiction 
        compliant language you can customize for your specific AI tools.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">What's Included:</p>
        <ul className="text-blue-800 space-y-1">
          <li>✓ Multi-state compliant disclosure language</li>
          <li>✓ Consent form templates (for IL, CO, MD)</li>
          <li>✓ Job posting disclosure snippets</li>
          <li>✓ Email notification templates</li>
          <li>✓ FAQ responses for candidates</li>
          <li>✓ Implementation checklist</li>
        </ul>
      </div>

      <h2>Core AI Hiring Disclosure Template</h2>

      <p>
        This template satisfies the most stringent state requirements (Illinois, NYC, Colorado, California). Customize 
        the bracketed sections for your specific tools and processes.
      </p>

      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 my-8">
        <p className="font-bold text-lg text-gray-900 mb-4">AI Use in Hiring Notice</p>
        
        <p className="text-sm text-gray-800 mb-3">
          <strong>[Company Name]</strong> uses artificial intelligence (AI) and automated decision-making technology 
          as part of our hiring process.
        </p>

        <p className="text-sm text-gray-800 mb-3">
          <strong>What AI Tools We Use:</strong><br />
          We use the following AI-powered tools to evaluate job applicants:
        </p>

        <ul className="text-sm text-gray-700 mb-3 ml-6 list-disc">
          <li><strong>[Tool Name 1]</strong> for [purpose - e.g., "resume screening and qualification matching"]</li>
          <li><strong>[Tool Name 2]</strong> for [purpose - e.g., "video interview analysis"]</li>
          <li><strong>[Tool Name 3]</strong> for [purpose - e.g., "skills assessment and cognitive ability testing"]</li>
        </ul>

        <p className="text-sm text-gray-800 mb-3">
          <strong>What the AI Evaluates:</strong><br />
          Our AI tools analyze and evaluate:
        </p>

        <ul className="text-sm text-gray-700 mb-3 ml-6 list-disc">
          <li>Qualifications, skills, and work experience relevance</li>
          <li>[Add specific factors - e.g., "Communication skills and presentation style"]</li>
          <li>[Add specific factors - e.g., "Problem-solving ability and analytical reasoning"]</li>
          <li>[Add specific factors - e.g., "Cultural alignment and team fit indicators"]</li>
        </ul>

        <p className="text-sm text-gray-800 mb-3">
          <strong>How AI Impacts Hiring Decisions:</strong><br />
          AI-generated scores and recommendations are used to:
        </p>

        <ul className="text-sm text-gray-700 mb-3 ml-6 list-disc">
          <li>[Select applicable] Rank candidates for recruiter review</li>
          <li>[Select applicable] Determine who advances to the next interview stage</li>
          <li>[Select applicable] Identify top candidates for hiring manager consideration</li>
          <li>[Select applicable] Screen out candidates who do not meet minimum qualifications</li>
        </ul>

        <p className="text-sm text-gray-800 mb-3">
          <strong>Important:</strong> While AI assists our hiring process, final hiring decisions are made by humans. 
          AI recommendations are considered alongside other factors including interviews, references, and manager evaluation.
        </p>

        <p className="text-sm text-gray-800 mb-3">
          <strong>Data We Collect:</strong><br />
          The AI tools collect and analyze:
        </p>

        <ul className="text-sm text-gray-700 mb-3 ml-6 list-disc">
          <li>Information from your resume/application (work history, education, skills)</li>
          <li>[If applicable] Video and audio from interview recordings</li>
          <li>[If applicable] Responses to assessment questions</li>
          <li>[If applicable] Timing and interaction patterns during assessments</li>
        </ul>

        <p className="text-sm text-gray-800 mb-3">
          <strong>Your Rights:</strong>
        </p>

        <ul className="text-sm text-gray-700 mb-3 ml-6 list-disc">
          <li><strong>Right to opt out:</strong> You may request an alternative evaluation process that does not use 
          AI by contacting [email/phone] within [X] days of this notice.</li>
          <li><strong>Right to accommodation:</strong> If you require an accommodation related to a disability, 
          contact [email/phone] and we will work with you to provide an accessible alternative.</li>
          <li><strong>Right to human review:</strong> You may request human review of any AI-driven decision by 
          contacting [email/phone].</li>
          <li><strong>Right to explanation:</strong> You may request information about how AI was used in your 
          evaluation by contacting [email/phone].</li>
        </ul>

        <p className="text-sm text-gray-800 mb-3">
          <strong>Bias Audit Information:</strong> [Required for NYC]<br />
          Our AI hiring tools have undergone independent bias audits. The most recent audit was conducted on 
          [Date] by [Auditor Name]. Audit results are available at [URL to published audit summary].
        </p>

        <p className="text-sm text-gray-800 mb-3">
          <strong>Questions or Concerns:</strong><br />
          If you have questions about our use of AI in hiring, wish to opt out, or need accommodations, contact:
        </p>

        <p className="text-sm text-gray-700 mb-1">
          [Contact Name/Department]<br />
          [Email]<br />
          [Phone]<br />
          [Mailing Address - if required by state law]
        </p>

        <p className="text-sm text-gray-600 mt-4 italic">
          Declining AI evaluation will not negatively impact your candidacy. We are committed to fair and 
          non-discriminatory hiring practices.
        </p>
      </div>

      <h2>Consent Form Template (Illinois, Colorado, Maryland)</h2>

      <p>
        For states requiring explicit consent (Illinois, Colorado) or specific facial recognition consent (Maryland), 
        use this addendum:
      </p>

      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 my-8">
        <p className="font-bold text-lg text-gray-900 mb-4">Consent to AI Evaluation</p>

        <p className="text-sm text-gray-800 mb-3">
          I have read and understand the AI Use in Hiring Notice provided by [Company Name]. I understand that:
        </p>

        <ul className="text-sm text-gray-700 mb-3 ml-6 list-disc">
          <li>AI technology will be used to evaluate my application and candidacy</li>
          <li>The AI will analyze [list specific data types from disclosure above]</li>
          <li>AI-generated scores will influence hiring decisions as described above</li>
          <li>I have the right to decline AI evaluation and request an alternative process</li>
        </ul>

        <p className="text-sm text-gray-800 mb-3">
          By signing below, I consent to [Company Name]'s use of AI technology to evaluate my candidacy as described 
          in the AI Use in Hiring Notice.
        </p>

        <div className="border-t-2 border-gray-400 mt-6 pt-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Applicant Signature:</strong> ________________________________ <strong>Date:</strong> ____________
          </p>
          <p className="text-sm text-gray-700 mb-4">
            <strong>Printed Name:</strong> ________________________________
          </p>

          <p className="text-sm text-gray-600 italic">
            OR [For electronic consent]
          </p>

          <p className="text-sm text-gray-700 mt-2">
            ☐ I consent to AI evaluation as described above<br />
            ☐ I decline AI evaluation and request an alternative process
          </p>
        </div>

        <p className="text-sm text-gray-600 mt-4 italic">
          If declining AI evaluation, please contact [email/phone] within [X] days to arrange your alternative evaluation.
        </p>
      </div>

      <h2>Job Posting Disclosure Snippet</h2>

      <p>
        Include this language in job postings to provide early notice (recommended for all states; helps with NYC's 
        10-day advance notice requirement):
      </p>

      <div className="bg-blue-50 border border-blue-300 rounded p-4 my-6">
        <p className="text-sm text-gray-800 font-medium mb-2">
          <strong>AI in Our Hiring Process</strong>
        </p>
        <p className="text-sm text-gray-700">
          [Company Name] uses AI-powered tools to screen applications and evaluate candidates. All applicants will 
          receive detailed information about our AI use and have the option to request alternative evaluation methods. 
          Questions? Contact [email].
        </p>
      </div>

      <h2>Email Notification Template</h2>

      <p>
        Send this when inviting candidates to AI-based assessments (satisfies timing requirements for most states):
      </p>

      <div className="bg-gray-50 border border-gray-300 rounded p-4 my-6">
        <p className="text-sm text-gray-800 mb-2"><strong>Subject:</strong> Next Steps in Your Application - AI Disclosure Notice</p>
        
        <p className="text-sm text-gray-700 mb-3">
          Dear [Candidate Name],
        </p>

        <p className="text-sm text-gray-700 mb-3">
          Thank you for your interest in the [Position Title] role at [Company Name]. We're excited to move your 
          application to the next stage!
        </p>

        <p className="text-sm text-gray-700 mb-3">
          <strong>Important Notice: Use of AI in Our Hiring Process</strong>
        </p>

        <p className="text-sm text-gray-700 mb-3">
          As part of our evaluation process, we use artificial intelligence tools to [describe specific use - e.g., 
          "analyze video interview responses" or "assess technical skills through coding challenges"]. Before you 
          proceed, please review the attached AI Use in Hiring Notice, which explains:
        </p>

        <ul className="text-sm text-gray-700 mb-3 ml-6 list-disc">
          <li>What AI tools we use and what they evaluate</li>
          <li>How AI influences our hiring decisions</li>
          <li>Your right to opt out and request an alternative evaluation</li>
          <li>How to request accommodations</li>
        </ul>

        <p className="text-sm text-gray-700 mb-3">
          <strong>[For states requiring consent]</strong> To proceed with the AI-based evaluation, you'll need to 
          provide consent. If you prefer an alternative evaluation method, please reply to this email or call 
          [phone] within [X] days.
        </p>

        <p className="text-sm text-gray-700 mb-3">
          <strong>[For NYC 10-day requirement]</strong> You may begin the assessment on or after [Date - 10 days from 
          this email]. If you have questions before then, please don't hesitate to reach out.
        </p>

        <p className="text-sm text-gray-700 mb-3">
          We're committed to a fair, inclusive hiring process. If you have any questions or concerns about our use 
          of AI, please contact [name/email/phone].
        </p>

        <p className="text-sm text-gray-700">
          Best regards,<br />
          [Recruiter Name]<br />
          [Company Name]
        </p>
      </div>

      <h2>Candidate FAQ Template</h2>

      <p>
        Provide this FAQ to candidates who have questions (can be posted on career site or sent upon request):
      </p>

      <div className="bg-white border border-gray-200 rounded p-4 my-6">
        <p className="font-semibold text-gray-900 mb-3">Frequently Asked Questions: AI in Our Hiring Process</p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: Why do you use AI in hiring?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: AI tools help us efficiently review high volumes of applications and identify candidates whose skills 
          match our job requirements. This allows our recruiters to spend more time on personalized interactions with 
          top candidates. AI assists our process but does not make final hiring decisions—humans do.
        </p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: Will AI reject my application automatically?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: [Customize based on your process] AI may screen out applications that clearly don't meet minimum 
          qualifications (e.g., required certifications, years of experience). However, borderline candidates are 
          reviewed by human recruiters, and all final decisions involve human judgment.
        </p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: How do I know the AI is fair and unbiased?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: We require all AI tools to undergo independent bias audits. [For NYC] Our most recent audit results are 
          publicly available at [URL]. We monitor AI performance continuously and will discontinue any tool found to 
          produce discriminatory outcomes.
        </p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: Can I opt out of AI evaluation?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: Yes. You have the right to request an alternative evaluation process that does not use AI. Contact 
          [email/phone] and we'll arrange a human-only review. Opting out will not negatively impact your candidacy.
        </p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: What if I have a disability that makes AI assessment difficult?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: Please contact [email/phone] to request accommodations. We can provide alternative formats, extra time, 
          assistive technology support, or human-only evaluation. We're committed to accessibility.
        </p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: What data does the AI collect about me?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: [List specific data based on your tools - e.g., "resume content, video/audio from interviews, assessment 
          responses, timing data"]. We do not collect protected class information (race, religion, age, etc.) for use 
          in AI evaluation. Demographic data collected via EEO forms is not shared with AI tools.
        </p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: How long do you keep my AI evaluation data?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: [Specify retention period based on your policy and state law - e.g., "We retain evaluation data for 
          [X months/years] or until you request deletion, whichever is sooner."]. You may request deletion by 
          contacting [email].
        </p>

        <p className="text-sm text-gray-800 font-medium mb-1"><strong>Q: Can I see my AI scores or how I was evaluated?</strong></p>
        <p className="text-sm text-gray-700 mb-3">
          A: You may request information about how AI was used in your evaluation by contacting [email/phone]. We'll 
          provide a summary of the AI's assessment, though detailed algorithms are proprietary.
        </p>
      </div>

      <h2>Implementation Checklist</h2>

      <p>Use this checklist to deploy your AI hiring disclosures compliantly:</p>

      <h3>Pre-Deployment</h3>
      <ul>
        <li>☐ Customize templates for your specific AI tools</li>
        <li>☐ Verify disclosure language covers all jurisdictions where you hire</li>
        <li>☐ Legal review of final disclosure and consent language</li>
        <li>☐ Identify contact person/department for candidate questions</li>
        <li>☐ Create internal process for handling opt-out requests</li>
        <li>☐ Train recruiters on disclosure timing and consent collection</li>
      </ul>

      <h3>Job Posting Integration</h3>
      <ul>
        <li>☐ Add AI disclosure snippet to job posting template</li>
        <li>☐ Update career site FAQ with AI information</li>
        <li>☐ Include link to full disclosure in application</li>
      </ul>

      <h3>Application Stage</h3>
      <ul>
        <li>☐ Present full disclosure before candidate proceeds with AI-assessed stages</li>
        <li>☐ For consent-required states: collect affirmative opt-in</li>
        <li>☐ Log consent timestamp and disclosure version</li>
        <li>☐ Provide easy opt-out mechanism</li>
      </ul>

      <h3>Assessment Invitation</h3>
      <ul>
        <li>☐ Send email notice with disclosure attached (for NYC 10-day rule)</li>
        <li>☐ Confirm candidate understands AI will be used</li>
        <li>☐ Remind of accommodation request option</li>
      </ul>

      <h3>Ongoing Compliance</h3>
      <ul>
        <li>☐ Update disclosures when AI tools change</li>
        <li>☐ Update bias audit information annually (for NYC)</li>
        <li>☐ Monitor opt-out rates (high rates may indicate disclosure issues)</li>
        <li>☐ Retain consent records per state law requirements</li>
        <li>☐ Review and update language as regulations evolve</li>
      </ul>

      <h2>Jurisdiction-Specific Customizations</h2>

      <h3>New York City (Local Law 144)</h3>
      <p><strong>Additional requirements:</strong></p>
      <ul>
        <li>Notice must be given at least 10 days before AEDT use</li>
        <li>Must include job qualifications and characteristics the AEDT assesses</li>
        <li>Must link to publicly posted bias audit summary</li>
        <li>Must explain data retention and access policies</li>
      </ul>

      <h3>Illinois (AIVIA)</h3>
      <p><strong>Additional requirements:</strong></p>
      <ul>
        <li>Explicit written consent required before AI evaluation</li>
        <li>Must explain what characteristics AI analyzes</li>
        <li>Must provide alternative for candidates who decline</li>
        <li>Must offer data deletion within 30 days upon request</li>
      </ul>

      <h3>Colorado (AI Act)</h3>
      <p><strong>Additional requirements:</strong></p>
      <ul>
        <li>Notice must include information about impact assessments</li>
        <li>Must explain human oversight of automated decisions</li>
        <li>Must provide meaningful opt-out with alternative process</li>
        <li>Must include information about data minimization practices</li>
      </ul>

      <h3>California (AB 2930)</h3>
      <p><strong>Additional requirements:</strong></p>
      <ul>
        <li>Disclosure before AI tool use (pre-application recommended)</li>
        <li>Must inform of annual bias testing</li>
        <li>Right to human review of decisions</li>
        <li>Data privacy protections (align with CCPA)</li>
      </ul>

      <h2>Common Disclosure Mistakes to Avoid</h2>

      <h3>❌ Burying Disclosure in Terms of Service</h3>
      <p>
        <strong>The problem:</strong> Generic "we may use technology" language buried in 20-page T&Cs doesn't count 
        as compliant disclosure.
      </p>
      <p>
        <strong>The fix:</strong> Standalone, prominently displayed disclosure that candidates must acknowledge.
      </p>

      <h3>❌ Vague "AI May Be Used" Language</h3>
      <p>
        <strong>The problem:</strong> "We may use artificial intelligence" without specifics doesn't meet most state 
        requirements.
      </p>
      <p>
        <strong>The fix:</strong> Specific disclosure of which tools, what they evaluate, and how they influence decisions.
      </p>

      <h3>❌ Wrong Timing</h3>
      <p>
        <strong>The problem:</strong> Disclosing AI use after the candidate has already been evaluated.
      </p>
      <p>
        <strong>The fix:</strong> Disclose before AI evaluation begins; for NYC, at least 10 days in advance.
      </p>

      <h3>❌ No Opt-Out Mechanism</h3>
      <p>
        <strong>The problem:</strong> Disclosure mentions rights but provides no way to exercise them.
      </p>
      <p>
        <strong>The fix:</strong> Clear contact information and process for opting out or requesting accommodations.
      </p>

      <h3>❌ One-Size-Fits-All for Multiple Tools</h3>
      <p>
        <strong>The problem:</strong> Using identical disclosure for resume screening AI and video interview AI when 
        they evaluate very different things.
      </p>
      <p>
        <strong>The fix:</strong> Tool-specific disclosures or comprehensive disclosure covering all tools with detail.
      </p>

      <h2>Download the Templates</h2>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 my-8 text-center">
        <p className="text-2xl font-bold mb-3">Get the Complete Template Package</p>
        <p className="text-blue-100 mb-6">
          Customizable Word/PDF templates for all disclosure types, plus implementation guides and checklists.
        </p>
        <Link 
          href="/download/ai-disclosure-templates" 
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-lg"
        >
          Download Free Templates →
        </Link>
        <p className="text-blue-200 text-sm mt-4">No email required • Immediate download</p>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Can we use the same disclosure for all states?</h3>
      <p>
        Yes, if you build to the highest standard. The comprehensive template above satisfies NYC, Illinois, Colorado, 
        and California requirements. Using this everywhere ensures you're never out of compliance, even if you're not 
        sure where a candidate is located.
      </p>

      <h3>Do we need separate disclosures for each AI tool, or can we combine them?</h3>
      <p>
        You can combine multiple tools in one disclosure as long as you're specific about what each tool does. The 
        template above shows how to list multiple tools with their respective purposes.
      </p>

      <h3>How often should we update our disclosure language?</h3>
      <p>
        Update whenever: (1) You add/remove AI tools, (2) You change how tools are used, (3) Laws change in your 
        hiring jurisdictions, (4) You conduct new bias audits (NYC requires updated audit info). Review at least 
        annually.
      </p>

      <h3>What if a candidate says they didn't see the disclosure?</h3>
      <p>
        This is why documentation is critical. Log when disclosures are presented, require acknowledgment (checkbox, 
        signature), and retain records. If a candidate claims they weren't notified, your records prove otherwise.
      </p>

      <h3>Can we require consent as a condition of application?</h3>
      <p>
        Risky. While not explicitly prohibited everywhere, mandatory consent may produce discriminatory outcomes if 
        certain groups decline at higher rates. Safer: offer alternative evaluation for those who don't consent.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/ai-hiring-laws-by-state" className="text-blue-600 hover:underline">State-by-State AI Hiring Laws</Link></li>
        <li><Link href="/resources/illinois-aivia-compliance-guide" className="text-blue-600 hover:underline">Illinois AIVIA Compliance</Link></li>
        <li><Link href="/blog/candidate-rights-ai-hiring" className="text-blue-600 hover:underline">Candidate Rights Under AI Hiring</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
