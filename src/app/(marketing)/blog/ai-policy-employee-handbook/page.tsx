{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "How to Write an AI Policy for Your Employee Handbook | EmployArmor",
  description: "Create a compliant AI hiring policy for your employee handbook. Template, key elements, and practical examples included.",
}

export default function AIPolicyEmployeeHandbookPage() {
  return (
    <ArticleLayout
      title="How to Write an AI Hiring Policy for Your Employee Handbook"
      description="Your employee handbook needs an AI policy. Here's what to include, with a template you can adapt."
      category="Policy Template"
      readTime="11 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        As AI becomes standard in hiring, your employee handbook—and your public-facing candidate materials—need 
        policies that explain how your organization uses AI, what rights candidates and employees have, and what 
        safeguards you've implemented. These policies serve multiple purposes: legal compliance, transparency, and 
        building trust with candidates and employees.
      </p>

      <p>This guide walks through creating a comprehensive AI hiring policy with template language you can adapt.</p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">What You'll Get:</p>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>✓ Key elements every AI policy should include</li>
          <li>✓ Template policy language (adapt to your organization)</li>
          <li>✓ Separate sections for candidates vs. employees</li>
          <li>✓ Compliance with major AI hiring laws</li>
          <li>✓ Plain-language explanations</li>
        </ul>
      </div>

      <h2>Why You Need an AI Hiring Policy</h2>

      <h3>Legal Compliance</h3>

      <p>
        Multiple jurisdictions require disclosure of AI use. A clear policy in your handbook (and on your careers 
        site) helps satisfy these requirements.
      </p>

      <h3>Transparency and Trust</h3>

      <p>
        Candidates are increasingly skeptical of AI hiring. A transparent policy that explains how AI is used and 
        what safeguards exist builds trust.
      </p>

      <h3>Internal Accountability</h3>

      <p>
        A written policy creates accountability—it forces you to articulate principles and commit to them. It also 
        guides hiring managers and HR staff on proper AI use.
      </p>

      <h3>Defense in Litigation</h3>

      <p>
        If you're ever sued or investigated for AI discrimination, a robust policy showing you thought carefully 
        about fairness and took proactive measures is valuable evidence of good faith.
      </p>

      <h2>Core Elements of an AI Hiring Policy</h2>

      <h3>1. Scope: What AI Tools Are Covered</h3>

      <p>
        Be specific about what AI your organization uses. Generic "we may use technology" doesn't satisfy legal 
        requirements.
      </p>

      <p><strong>Example language:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          [Company Name] uses artificial intelligence (AI) and automated decision-making tools at various stages 
          of our hiring process, including:
        </p>
        <ul className="text-sm list-disc list-inside ml-4 mt-2 space-y-1">
          <li><strong>Resume screening:</strong> AI analyzes resumes to identify candidates whose skills and 
          experience match job requirements</li>
          <li><strong>Video interviews:</strong> For certain positions, candidates may be asked to complete 
          asynchronous video interviews. AI analyzes responses for communication skills and job-relevant competencies</li>
          <li><strong>Skills assessments:</strong> AI-powered testing platforms evaluate technical skills, 
          problem-solving ability, and job-related knowledge</li>
        </ul>
        <p className="text-sm mt-2">
          This policy explains how we use these tools, what safeguards we have in place, and what rights candidates 
          and employees have.
        </p>
      </blockquote>

      <h3>2. How AI Is Used in Decision-Making</h3>

      <p>
        Explain the role AI plays: Does it screen people out? Rank candidates? Provide recommendations humans review?
      </p>

      <p><strong>Example language:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          AI tools <strong>assist</strong> our hiring decisions but do not make final decisions. Here's how AI fits 
          into our process:
        </p>
        <ul className="text-sm list-disc list-inside ml-4 mt-2 space-y-1">
          <li><strong>Initial screening:</strong> AI reviews applications and identifies candidates who meet minimum 
          qualifications. A human recruiter reviews AI recommendations before any candidate is advanced or rejected.</li>
          <li><strong>Evaluation support:</strong> AI may provide scores or recommendations, but hiring managers 
          make final interview and hiring decisions based on multiple factors, including human judgment.</li>
          <li><strong>No fully automated rejection:</strong> We do not reject candidates based solely on AI output 
          without human review.</li>
        </ul>
      </blockquote>

      <h3>3. Fairness and Bias Testing</h3>

      <p>
        Explain how you ensure AI tools don't discriminate.
      </p>

      <p><strong>Example language:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          [Company Name] is committed to fair, non-discriminatory hiring practices. To ensure our AI tools do not 
          produce biased outcomes:
        </p>
        <ul className="text-sm list-disc list-inside ml-4 mt-2 space-y-1">
          <li><strong>Bias audits:</strong> We conduct annual independent bias audits of our AI hiring tools, 
          analyzing whether they produce different outcomes for candidates based on race, ethnicity, sex, age, 
          or disability status</li>
          <li><strong>Vendor selection:</strong> We require AI vendors to demonstrate that their tools have been 
          tested for bias and comply with applicable anti-discrimination laws</li>
          <li><strong>Ongoing monitoring:</strong> We regularly review selection rates and hiring outcomes to 
          identify potential disparate impact</li>
          <li><strong>Remediation:</strong> If bias is identified, we modify or discontinue use of problematic tools</li>
        </ul>
        <p className="text-sm mt-2">
          [For NYC/CA employers:] Bias audit results are available at [URL] as required by law.
        </p>
      </blockquote>

      <h3>4. Candidate Rights</h3>

      <p>
        This is the most legally important section. Clearly state what rights candidates have.
      </p>

      <p><strong>Example language:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm font-semibold">Candidates have the following rights regarding our use of AI:</p>
        
        <p className="text-sm mt-3"><strong>Right to Disclosure:</strong></p>
        <p className="text-sm ml-4">
          We will inform you before AI is used to evaluate your application. Disclosures appear in job postings, 
          during the application process, and before video interviews or assessments.
        </p>

        <p className="text-sm mt-3"><strong>Right to Alternative Evaluation:</strong></p>
        <p className="text-sm ml-4">
          If you prefer not to be evaluated using AI, you may request an alternative evaluation process. Contact 
          [email/phone] to request alternative evaluation. Requesting an alternative will not negatively affect 
          your candidacy.
        </p>

        <p className="text-sm mt-3"><strong>Right to Accommodation:</strong></p>
        <p className="text-sm ml-4">
          If you have a disability that may affect your performance on AI-evaluated assessments or interviews, you 
          may request reasonable accommodation under the Americans with Disabilities Act. Contact [email/phone] to 
          discuss accommodations.
        </p>

        <p className="text-sm mt-3"><strong>[For IL/MD candidates] Right to Data Deletion:</strong></p>
        <p className="text-sm ml-4">
          For candidates in Illinois or Maryland: If we used AI to analyze your video interview, you may request 
          deletion of the video recording and all AI-generated data within 30 days by contacting [email].
        </p>

        <p className="text-sm mt-3"><strong>Right to Human Review:</strong></p>
        <p className="text-sm ml-4">
          You may request that a human, not just AI, review your application. All hiring decisions involve human 
          judgment—AI recommendations are advisory only.
        </p>
      </blockquote>

      <h3>5. Data Privacy</h3>

      <p>
        Explain what data AI collects and how it's protected.
      </p>

      <p><strong>Example language:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          When AI tools evaluate your application, they may collect and analyze:
        </p>
        <ul className="text-sm list-disc list-inside ml-4 mt-1 space-y-1">
          <li>Information from your resume (work history, education, skills)</li>
          <li>Your responses to application questions</li>
          <li>Video interview recordings and transcripts</li>
          <li>Assessment results and response patterns</li>
        </ul>
        <p className="text-sm mt-2">
          We retain this data for [X months/years] or until you request deletion (where legally required). Data is 
          shared only with hiring decision-makers and our AI vendors who are bound by confidentiality agreements. 
          We implement security measures to protect your information.
        </p>
        <p className="text-sm mt-2">
          For more information, see our full Privacy Policy at [URL].
        </p>
      </blockquote>

      <h3>6. How to Exercise Your Rights or File Complaints</h3>

      <p>
        Provide clear contact information and complaint procedures.
      </p>

      <p><strong>Example language:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          <strong>Questions or Concerns:</strong> If you have questions about our AI hiring practices or wish to 
          exercise any of the rights described above, contact:
        </p>
        <ul className="text-sm ml-4 mt-1">
          <li>Email: aihiring@[company].com</li>
          <li>Phone: [phone number]</li>
          <li>Mail: [mailing address], Attn: HR Compliance</li>
        </ul>
        <p className="text-sm mt-2">
          We will respond to your inquiry within [X business days].
        </p>
        <p className="text-sm mt-2">
          <strong>Filing a Complaint:</strong> If you believe our AI hiring tools have discriminated against you 
          or violated your rights, you may file a complaint with:
        </p>
        <ul className="text-sm list-disc list-inside ml-4 mt-1">
          <li>U.S. Equal Employment Opportunity Commission (EEOC): eeoc.gov</li>
          <li>[For NYC:] NYC Department of Consumer and Worker Protection</li>
          <li>[For CA:] California Civil Rights Department</li>
          <li>[Add other relevant state agencies based on your locations]</li>
        </ul>
      </blockquote>

      <h2>Internal Policy: For Employees and Managers</h2>

      <p>
        In addition to candidate-facing policy, your employee handbook should include guidance for hiring managers 
        and HR staff on proper AI use.
      </p>

      <h3>Template: Internal AI Hiring Policy</h3>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm font-semibold">AI HIRING POLICY - INTERNAL GUIDANCE</p>

        <p className="text-sm mt-3"><strong>Approved AI Tools:</strong></p>
        <p className="text-sm ml-4">
          Only the following AI tools have been approved for use in hiring: [list specific tools]. Use of 
          unapproved AI tools is prohibited. If you wish to use a new AI tool, submit a request to [HR/Compliance].
        </p>

        <p className="text-sm mt-3"><strong>Mandatory Human Review:</strong></p>
        <p className="text-sm ml-4">
          Hiring managers and recruiters must personally review all AI recommendations before making advancement or 
          rejection decisions. Do not automatically accept AI output. You may override AI recommendations based on 
          your professional judgment.
        </p>

        <p className="text-sm mt-3"><strong>Candidate Disclosure:</strong></p>
        <p className="text-sm ml-4">
          Before using AI to evaluate any candidate, ensure they have received proper disclosure. HR will provide 
          disclosure templates for job postings and candidate communications.
        </p>

        <p className="text-sm mt-3"><strong>Accommodation Requests:</strong></p>
        <p className="text-sm ml-4">
          If a candidate requests accommodation or alternative evaluation, immediately forward the request to 
          [HR contact]. Do not attempt to handle accommodation requests without HR involvement.
        </p>

        <p className="text-sm mt-3"><strong>Prohibited Practices:</strong></p>
        <ul className="text-sm list-disc list-inside ml-4 mt-1">
          <li>Do not tell candidates they were rejected "by AI" or "because of their AI score"</li>
          <li>Do not use AI to evaluate protected characteristics (race, sex, age, disability)</li>
          <li>Do not use AI for "culture fit" assessments without HR approval and bias testing</li>
          <li>Do not share AI scores or candidate data outside the hiring team</li>
        </ul>

        <p className="text-sm mt-3"><strong>Documentation:</strong></p>
        <p className="text-sm ml-4">
          Document your hiring decisions, including how you used (or chose not to use) AI recommendations. This 
          documentation protects both you and the company in case of complaints or investigations.
        </p>

        <p className="text-sm mt-3"><strong>Training:</strong></p>
        <p className="text-sm ml-4">
          All hiring managers must complete AI hiring compliance training annually. Contact [HR] to schedule.
        </p>
      </blockquote>

      <h2>Where to Publish Your AI Policy</h2>

      <h3>Multiple Channels</h3>

      <p>
        Your AI policy should be easily accessible in multiple places:
      </p>

      <ul>
        <li><strong>Employee handbook:</strong> Internal policy for hiring managers and HR</li>
        <li><strong>Careers website:</strong> Dedicated page (e.g., yourcompany.com/ai-hiring-policy)</li>
        <li><strong>Job postings:</strong> Brief version or link to full policy</li>
        <li><strong>Application portal:</strong> Disclosure before candidates submit</li>
        <li><strong>Interview scheduling emails:</strong> For video interview AI, disclose again at scheduling</li>
      </ul>

      <h3>Keep It Updated</h3>

      <p>
        Review and update your AI policy:
      </p>

      <ul>
        <li>Annually (minimum)</li>
        <li>When you adopt new AI tools</li>
        <li>When new laws pass in jurisdictions where you hire</li>
        <li>After bias audits reveal issues requiring policy changes</li>
      </ul>

      <h2>Common Mistakes to Avoid</h2>

      <h3>Mistake #1: Vague, Generic Language</h3>

      <p>
        ❌ <em>"We may use technology in our hiring process."</em>
      </p>

      <p>
        ✅ <em>"We use HireVue AI video interview software to analyze speech patterns and communication skills."</em>
      </p>

      <p>
        Specificity is legally required in most jurisdictions. Generic language doesn't satisfy disclosure obligations.
      </p>

      <h3>Mistake #2: Hiding the Policy</h3>

      <p>
        Burying your AI policy on page 47 of a PDF handbook doesn't satisfy transparency requirements. Make it easy 
        to find—dedicated webpage, linked from job postings, mentioned in candidate emails.
      </p>

      <h3>Mistake #3: No Actionable Rights</h3>

      <p>
        Simply saying "candidates have rights" without explaining <em>how to exercise them</em> is insufficient. 
        Include email addresses, phone numbers, and procedures.
      </p>

      <h3>Mistake #4: Policy Doesn't Match Reality</h3>

      <p>
        If your policy says "AI recommendations are advisory only" but in practice hiring managers rubber-stamp AI 
        decisions, that's a problem. Your actual practices must align with your written policy.
      </p>

      <h2>How EmployArmor Helps</h2>

      <p>
        EmployArmor generates customized AI policies:
      </p>

      <ul>
        <li><strong>Jurisdiction-specific templates:</strong> Automatically includes required elements for NYC, CA, IL, CO based on your hiring locations</li>
        <li><strong>Tool-specific language:</strong> Generates disclosure text for the specific AI tools you use</li>
        <li><strong>Multi-format output:</strong> Employee handbook version, candidate-facing version, job posting snippets</li>
        <li><strong>Auto-updates:</strong> When laws change or you adopt new tools, policies update automatically</li>
        <li><strong>Publication management:</strong> One-click publishing to your careers website</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Generate Your AI Hiring Policy</p>
        <p className="text-blue-700 mb-4">Customized for your tools and jurisdictions</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Do we need separate policies for candidates vs. employees?</h3>
      <p>
        Yes, or at least separate sections. Candidates need to know their rights during the hiring process. Employees 
        (especially hiring managers) need guidance on proper AI use and compliance obligations. Both audiences, different needs.
      </p>

      <h3>Can we just copy another company's AI policy?</h3>
      <p>
        No. Your policy must be specific to <strong>your</strong> AI tools, your jurisdictions, and your practices. 
        Generic copied policies don't satisfy legal requirements and create liability if they don't match reality.
      </p>

      <h3>How often should we update the policy?</h3>
      <p>
        Minimum annually. Also update whenever: (1) you adopt new AI tools, (2) new laws pass, (3) bias audits reveal 
        issues requiring changes, (4) you change how AI is used in your process.
      </p>

      <h3>Should the policy name specific AI vendors and tools?</h3>
      <p>
        Yes, for candidate-facing policy. Naming specific tools (e.g., "HireVue," "Pymetrics") provides transparency 
        and allows candidates to research those tools. For internal policy, specificity helps ensure only approved 
        tools are used.
      </p>

      <h3>What if our AI vendor updates their tool—does our policy need to change?</h3>
      <p>
        Possibly. If the vendor's update materially changes what the AI evaluates or how it works, update your policy 
        and re-disclose to candidates. Minor updates (bug fixes, performance improvements) may not require policy changes.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">Complete AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/blog/ai-impact-assessment-hiring" className="text-blue-600 hover:underline">Impact Assessment Template & Guide</Link></li>
        <li><Link href="/blog/candidate-rights-ai-hiring" className="text-blue-600 hover:underline">Candidate Rights Under AI Hiring Laws</Link></li>
        <li><Link href="/blog/ai-hiring-laws-2026" className="text-blue-600 hover:underline">2026 AI Hiring Laws: What Changed</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
