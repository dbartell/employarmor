{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "Washington State AI Hiring Law (SB 5116): Compliance Guide 2026 | EmployArmor",
  description: "Complete guide to Washington State AI hiring law SB 5116. Learn disclosure requirements, impact assessment obligations, and compliance steps.",
}

export default function WashingtonAIHiringLawPage() {
  return (
    <ArticleLayout
      title="Washington State AI Hiring Law: SB 5116 Compliance Guide"
      description="Washington's approach to AI hiring regulation balances innovation with accountability. Here's what employers need to know about SB 5116 and related consumer protection requirements."
      category="State Compliance"
      readTime="9 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        Washington State passed SB 5116 in 2024, establishing requirements for automated employment decision systems. 
        While less prescriptive than NYC's Local Law 144 or Illinois' AIVIA, Washington's law creates meaningful 
        compliance obligations—particularly around disclosure and impact assessments for high-risk AI systems.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Key Requirements:</p>
        <ul className="text-blue-800 space-y-1">
          <li>✓ Disclosure to candidates when AI is used in hiring</li>
          <li>✓ Impact assessments for high-risk automated systems</li>
          <li>✓ Consumer protection enforcement mechanisms</li>
          <li>✓ Biometric data privacy protections (separate law)</li>
        </ul>
      </div>

      <h2>What is Washington SB 5116?</h2>

      <p>
        Senate Bill 5116, effective March 31, 2024, regulates automated employment decision systems under Washington's 
        consumer protection framework. The law requires:
      </p>

      <ul>
        <li><strong>Notice and disclosure</strong> when automated systems are used in employment decisions</li>
        <li><strong>Impact assessments</strong> for AI systems deemed "high-risk"</li>
        <li><strong>Algorithmic discrimination protections</strong> aligned with federal and state anti-discrimination law</li>
        <li><strong>Enforcement</strong> via Washington Attorney General under Consumer Protection Act</li>
      </ul>

      <h3>Legislative Context</h3>

      <p>
        Washington's AI law was part of a broader consumer protection and privacy legislative package. The approach 
        emphasizes transparency and risk management rather than prescriptive technical requirements like bias audits.
      </p>

      <h2>Scope: What's Covered</h2>

      <h3>Automated Employment Decision Systems</h3>

      <p>
        The law applies to systems that use algorithms, machine learning, or AI to:
      </p>

      <ul>
        <li>Screen job applicants</li>
        <li>Evaluate candidates</li>
        <li>Make or substantially influence hiring, promotion, or termination decisions</li>
        <li>Determine compensation or work assignments</li>
      </ul>

      <p><strong>Examples of covered tools:</strong></p>
      <ul>
        <li>Resume screening AI</li>
        <li>Video interview analysis platforms</li>
        <li>Skills assessment tools with automated scoring</li>
        <li>Candidate ranking and matching systems</li>
        <li>Chatbot-based screening interviews</li>
      </ul>

      <h3>What's NOT Covered</h3>

      <ul>
        <li>Simple keyword filtering (no machine learning/AI)</li>
        <li>Applicant tracking systems that only organize data without evaluation</li>
        <li>Scheduling and administrative automation</li>
        <li>Background check services (unless they use AI to evaluate results)</li>
      </ul>

      <h2>Disclosure Requirements</h2>

      <p>
        Employers using automated employment decision systems in Washington must provide <strong>clear notice</strong> 
        to candidates and employees. While the law doesn't specify exact disclosure language, best practices include:
      </p>

      <h3>What to Disclose</h3>

      <ul>
        <li>That an automated system is being used</li>
        <li>What the system evaluates (skills, qualifications, traits)</li>
        <li>How the system influences employment decisions</li>
        <li>How candidates can request more information or human review</li>
      </ul>

      <h3>When to Disclose</h3>

      <p>
        The law requires disclosure "at or before" the time the automated system is used. Conservative approach:
      </p>

      <ul>
        <li><strong>Job postings:</strong> Include general notice of AI use</li>
        <li><strong>Application stage:</strong> Specific disclosure before AI evaluation begins</li>
        <li><strong>Assessment invitations:</strong> Remind candidates of AI use before they participate</li>
      </ul>

      <h3>Sample Washington-Compliant Disclosure</h3>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4 text-sm">
        <p className="font-semibold mb-2">Automated Hiring Technology Notice</p>
        <p className="mb-2">
          [Company Name] uses automated decision-making technology to assist in evaluating job applicants. This 
          technology analyzes [specific factors—e.g., qualifications, skills, work history] to [specific use—e.g., 
          "identify candidates for interview," "rank applicants based on job fit"].
        </p>
        <p className="mb-2">
          While automated systems assist our hiring process, final employment decisions are made by humans. If you 
          have questions about our use of automated technology or wish to request human review of any automated 
          decision, contact [email/phone].
        </p>
        <p>
          For more information about your rights under Washington law, visit [link to state resources or company policy].
        </p>
      </blockquote>

      <h2>Impact Assessment Requirements</h2>

      <p>
        For "high-risk" automated employment systems, Washington law requires <strong>algorithmic impact assessments</strong>. 
        While the law doesn't define "high-risk" with precision, guidance suggests systems are high-risk if they:
      </p>

      <ul>
        <li>Make or substantially replace human decision-making</li>
        <li>Have potential for significant impact on employment opportunities</li>
        <li>Process large volumes of candidates</li>
        <li>Use sensitive or complex data inputs</li>
        <li>Have limited transparency or explainability</li>
      </ul>

      <h3>What an Impact Assessment Includes</h3>

      <p>
        Washington's framework is modeled on privacy impact assessments. A compliant assessment should evaluate:
      </p>

      <ul>
        <li><strong>Purpose and use:</strong> What the system does and why it's being used</li>
        <li><strong>Data inputs:</strong> What data is collected and analyzed</li>
        <li><strong>Decision-making logic:</strong> How the system reaches conclusions (to extent explainable)</li>
        <li><strong>Potential harms:</strong> Risks of discrimination, bias, privacy violations, or unfair outcomes</li>
        <li><strong>Mitigation measures:</strong> Steps taken to reduce identified risks</li>
        <li><strong>Human oversight:</strong> How humans review and can override automated decisions</li>
        <li><strong>Monitoring:</strong> Ongoing evaluation of system performance</li>
      </ul>

      <h3>Frequency of Impact Assessments</h3>

      <p>
        The law doesn't specify frequency, but best practice:
      </p>

      <ul>
        <li><strong>Before deployment:</strong> Initial impact assessment before using a new AI system</li>
        <li><strong>After material changes:</strong> Re-assess if the system is significantly updated</li>
        <li><strong>Annually:</strong> Regular review even if system hasn't changed (models drift over time)</li>
        <li><strong>Post-incident:</strong> Re-assess if problems are discovered or complaints received</li>
      </ul>

      <h3>Documentation and Retention</h3>

      <p>
        Washington law doesn't explicitly require public posting of impact assessments (unlike NYC bias audits), but 
        employers should:
      </p>

      <ul>
        <li>Retain assessment documentation for at least 3 years</li>
        <li>Make assessments available to regulators upon request</li>
        <li>Consider making summaries available to candidates (transparency builds trust)</li>
      </ul>

      <h2>Algorithmic Discrimination Protections</h2>

      <p>
        Washington's law emphasizes that automated systems must not discriminate. This aligns with federal and state 
        anti-discrimination law but adds specific accountability mechanisms:
      </p>

      <h3>Prohibited Practices</h3>

      <ul>
        <li>Using automated systems that produce disparate impact on protected classes</li>
        <li>Collecting or using protected class data inappropriately in algorithms</li>
        <li>Deploying systems without reasonable steps to prevent discrimination</li>
        <li>Failing to provide human oversight and review mechanisms</li>
      </ul>

      <h3>Affirmative Obligations</h3>

      <p>
        Employers should:
      </p>

      <ul>
        <li>Test automated systems for discriminatory outcomes before deployment</li>
        <li>Monitor systems continuously for bias</li>
        <li>Maintain human review capacity</li>
        <li>Provide candidates with mechanisms to challenge automated decisions</li>
      </ul>

      <h2>Biometric Data Privacy (Separate Law)</h2>

      <p>
        In addition to SB 5116, Washington passed <strong>HB 1493</strong> (effective March 31, 2024) regulating 
        biometric data in employment. This impacts AI hiring tools that use:
      </p>

      <ul>
        <li>Facial recognition or analysis</li>
        <li>Voice analysis</li>
        <li>Fingerprint or retina scanning</li>
        <li>Other biometric identifiers</li>
      </ul>

      <h3>HB 1493 Requirements</h3>

      <ul>
        <li><strong>Notice:</strong> Inform employees/candidates before collecting biometric data</li>
        <li><strong>Consent:</strong> Obtain written consent (similar to Illinois BIPA)</li>
        <li><strong>Purpose limitation:</strong> Use biometric data only for stated purposes</li>
        <li><strong>Data protection:</strong> Implement reasonable security measures</li>
        <li><strong>Retention limits:</strong> Delete biometric data when no longer needed</li>
      </ul>

      <p>
        <strong>Practical impact:</strong> If your video interview platform analyzes facial features or voice patterns, 
        you need both SB 5116 disclosure (automated system use) AND HB 1493 biometric consent.
      </p>

      <h2>Enforcement and Penalties</h2>

      <h3>Enforcement Authority</h3>

      <p>
        Washington Attorney General enforces SB 5116 under the Consumer Protection Act (CPA). Violations can result in:
      </p>

      <ul>
        <li><strong>Civil penalties:</strong> Up to $2,500 per violation</li>
        <li><strong>Injunctive relief:</strong> Court orders to stop using non-compliant systems</li>
        <li><strong>Corrective action:</strong> Required remediation and compliance measures</li>
        <li><strong>Costs and fees:</strong> Defendants may pay AG's investigation and litigation costs</li>
      </ul>

      <h3>Private Right of Action</h3>

      <p>
        Unlike some states, Washington's AI law doesn't create a private right of action for individual candidates. 
        However, candidates can:
      </p>

      <ul>
        <li>File complaints with the AG's office</li>
        <li>Bring discrimination claims under Washington Law Against Discrimination (WLAD)</li>
        <li>Bring federal claims under Title VII, ADA, etc.</li>
        <li>Pursue consumer protection claims if other CPA violations exist</li>
      </ul>

      <h3>Current Enforcement Activity</h3>

      <p>
        As of Q1 2026, Washington AG has:
      </p>

      <ul>
        <li>Opened <strong>12 investigations</strong> into AI hiring practices</li>
        <li>Issued <strong>compliance guidance</strong> for employers</li>
        <li>Partnered with EEOC on <strong>joint investigations</strong></li>
        <li>No public enforcement actions yet, but several cases under review</li>
      </ul>

      <h2>Comparison to Other State Laws</h2>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Requirement</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Washington</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">NYC LL144</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Illinois AIVIA</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-3 py-2 text-gray-900 font-medium">Disclosure</td>
              <td className="px-3 py-2 text-green-600">Required</td>
              <td className="px-3 py-2 text-green-600">Required (10 days advance)</td>
              <td className="px-3 py-2 text-green-600">Required (before use)</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-3 py-2 text-gray-900 font-medium">Consent</td>
              <td className="px-3 py-2 text-gray-500">Not required</td>
              <td className="px-3 py-2 text-gray-500">Not required</td>
              <td className="px-3 py-2 text-green-600">Required</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-2 text-gray-900 font-medium">Bias Audit</td>
              <td className="px-3 py-2 text-gray-500">Not required</td>
              <td className="px-3 py-2 text-green-600">Annual required</td>
              <td className="px-3 py-2 text-gray-500">Not required</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-3 py-2 text-gray-900 font-medium">Impact Assessment</td>
              <td className="px-3 py-2 text-green-600">High-risk systems</td>
              <td className="px-3 py-2 text-gray-500">Not required</td>
              <td className="px-3 py-2 text-gray-500">Not required</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <strong>Compliance strategy:</strong> If you're already complying with NYC or Illinois laws, adding Washington 
        disclosure and impact assessment is relatively straightforward.
      </p>

      <h2>Practical Compliance Steps</h2>

      <h3>Step 1: Update Disclosure Materials</h3>

      <ul>
        <li>Add Washington-compliant disclosure to job postings</li>
        <li>Include notice in application workflow</li>
        <li>Update career site FAQs</li>
        <li>Train recruiters on disclosure requirements</li>
      </ul>

      <h3>Step 2: Conduct Impact Assessments</h3>

      <p>For each high-risk AI tool:</p>
      <ul>
        <li>Document purpose, data inputs, decision logic</li>
        <li>Identify potential harms (bias, privacy, fairness)</li>
        <li>Describe mitigation measures and human oversight</li>
        <li>Establish monitoring processes</li>
        <li>Retain assessment documentation</li>
      </ul>

      <h3>Step 3: Address Biometric Data (If Applicable)</h3>

      <p>If using facial recognition, voice analysis, or other biometric AI:</p>
      <ul>
        <li>Provide HB 1493-compliant notice</li>
        <li>Obtain written consent</li>
        <li>Implement data security measures</li>
        <li>Establish retention and deletion policies</li>
      </ul>

      <h3>Step 4: Monitor for Discrimination</h3>

      <ul>
        <li>Test AI tools for disparate impact (even though not legally required, it's best practice)</li>
        <li>Track selection rates by demographic group</li>
        <li>Review candidate complaints about AI evaluation</li>
        <li>Be prepared to demonstrate non-discrimination</li>
      </ul>

      <h3>Step 5: Maintain Human Oversight</h3>

      <ul>
        <li>Ensure AI assists but doesn't solely decide</li>
        <li>Train hiring managers on AI limitations</li>
        <li>Create escalation path for candidate concerns</li>
        <li>Document human review of AI recommendations</li>
      </ul>

      <h2>How EmployArmor Helps with Washington Compliance</h2>

      <ul>
        <li><strong>Disclosure generation:</strong> Washington-specific compliant language</li>
        <li><strong>Impact assessment templates:</strong> Structured framework for evaluating AI systems</li>
        <li><strong>Biometric consent management:</strong> HB 1493-compliant forms and tracking</li>
        <li><strong>Multi-state coordination:</strong> Integrate WA requirements with other jurisdictions</li>
        <li><strong>Monitoring dashboard:</strong> Track compliance across all Washington hires</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Hiring in Washington?</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Compliance Assessment →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Does Washington law apply to remote workers based in Washington working for out-of-state companies?</h3>
      <p>
        Yes. If the candidate or employee is located in Washington during the hiring process, Washington law applies 
        regardless of where the employer is headquartered.
      </p>

      <h3>Do we need an impact assessment for every AI tool, or just high-risk ones?</h3>
      <p>
        Technically only high-risk systems require formal impact assessments. However, documenting purpose and risk 
        for all AI tools is good practice and helps demonstrate due diligence if investigated.
      </p>

      <h3>Can we use the same impact assessment format for Washington and Colorado?</h3>
      <p>
        Yes. Both states require similar impact assessments. A comprehensive assessment covering both states' requirements 
        will satisfy either jurisdiction.
      </p>

      <h3>How does Washington's biometric law compare to Illinois BIPA?</h3>
      <p>
        Similar requirements (notice and consent), but Washington's law doesn't have BIPA's private right of action or 
        statutory damages. Illinois has been more aggressively enforced to date.
      </p>

      <h3>What if we disclose AI use but a candidate complains they didn't see it?</h3>
      <p>
        Document disclosure delivery (timestamps, acknowledgments, confirmation emails). If a candidate claims no notice, 
        your records demonstrate compliance. This is why tracking and logging disclosure is critical.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/ai-hiring-laws-by-state" className="text-blue-600 hover:underline">State-by-State AI Hiring Laws</Link></li>
        <li><Link href="/blog/ai-impact-assessment-hiring" className="text-blue-600 hover:underline">AI Impact Assessment Guide</Link></li>
        <li><Link href="/resources/ai-hiring-disclosure-template-download" className="text-blue-600 hover:underline">AI Disclosure Templates</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
