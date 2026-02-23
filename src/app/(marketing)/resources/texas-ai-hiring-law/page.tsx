{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "Texas AI Hiring Law & CUBI Compliance Guide 2026 | EmployArmor",
  description: "Complete guide to Texas AI hiring regulations. Learn about biometric privacy law (CUBI), pending AI legislation, and compliance requirements for Texas employers.",
}

export default function TexasAIHiringLawPage() {
  return (
    <ArticleLayout
      title="Texas AI Hiring Regulations: What Employers Need to Know in 2026"
      description="While Texas hasn't passed comprehensive AI hiring legislation, biometric privacy law and pending bills create compliance obligations. Here's your guide to navigating the Texas landscape."
      category="State Compliance"
      readTime="8 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        Texas takes a different approach to AI hiring regulation than states like California, New York, or Illinois. 
        Rather than comprehensive AI-specific employment laws, Texas regulates through:
      </p>

      <ul>
        <li><strong>Biometric privacy law</strong> (CUBI) affecting facial recognition and biometric AI tools</li>
        <li><strong>General employment discrimination protections</strong> that apply to AI systems</li>
        <li><strong>Pending legislation</strong> that may establish broader AI hiring requirements</li>
      </ul>

      <p>
        If you're hiring in Texas, here's what you need to comply with today—and what may be coming tomorrow.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Current Texas AI Hiring Requirements:</p>
        <ul className="text-blue-800 space-y-1">
          <li>✓ CUBI compliance for biometric data collection (notice + consent)</li>
          <li>✓ Texas Labor Code anti-discrimination provisions apply to AI</li>
          <li>✓ Best practices: disclosure and bias testing (not legally required but recommended)</li>
          <li>✓ Monitor pending legislation (HB 2060, SB 1893)</li>
        </ul>
      </div>

      <h2>Texas Biometric Privacy Law: The Capture or Use of Biometric Identifier Act (CUBI)</h2>

      <p>
        Texas Business & Commerce Code §503.001, known as CUBI, regulates the capture and use of biometric identifiers 
        including facial geometry, voiceprints, retina scans, and fingerprints.
      </p>

      <h3>When CUBI Applies to Hiring</h3>

      <p>
        If your AI hiring tools use any of the following, CUBI compliance is required:
      </p>

      <ul>
        <li><strong>Facial recognition or analysis:</strong> Video interview platforms that analyze facial features, 
        expressions, or geometry</li>
        <li><strong>Voice analysis:</strong> AI that evaluates voice patterns, tone, or speech characteristics</li>
        <li><strong>Fingerprint/biometric verification:</strong> Identity verification tools using fingerprints or 
        retina scans</li>
        <li><strong>Gait or behavioral biometrics:</strong> Analysis of physical movement patterns</li>
      </ul>

      <h3>CUBI Requirements</h3>

      <p><strong>1. Notice Before Collection</strong></p>
      <p>
        Employers must inform candidates before collecting biometric identifiers. The notice must explain:
      </p>

      <ul>
        <li>What biometric data is being collected</li>
        <li>The purpose of collection</li>
        <li>How long the data will be retained</li>
      </ul>

      <p><strong>2. Written Consent</strong></p>
      <p>
        Before collecting biometric data, obtain written consent from the candidate. Unlike some states, CUBI doesn't 
        specify detailed consent form requirements, but best practice includes:
      </p>

      <ul>
        <li>Clear description of biometric data being collected</li>
        <li>Affirmative opt-in (checkbox or signature)</li>
        <li>Documentation of consent with timestamp</li>
      </ul>

      <p><strong>3. Reasonable Care in Storage</strong></p>
      <p>
        Biometric data must be stored with "reasonable care" to prevent unauthorized access. This includes:
      </p>

      <ul>
        <li>Encryption of biometric data</li>
        <li>Access controls and authentication</li>
        <li>Secure transmission protocols</li>
        <li>Vendor security requirements (if third-party tools used)</li>
      </ul>

      <p><strong>4. Prohibition on Sale</strong></p>
      <p>
        Biometric identifiers cannot be sold, leased, or otherwise disclosed without consent—except to:
      </p>

      <ul>
        <li>Complete the purpose for which it was collected</li>
        <li>Comply with legal process</li>
        <li>Other limited exceptions</li>
      </ul>

      <h3>CUBI Penalties</h3>

      <p>
        Violations can result in:
      </p>

      <ul>
        <li><strong>Civil penalties:</strong> Up to $25,000 per violation (intentional/reckless violations)</li>
        <li><strong>Injunctive relief:</strong> Court orders to stop collection or delete data</li>
        <li><strong>Private right of action:</strong> Individuals can sue for actual damages</li>
      </ul>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">CUBI vs. Illinois BIPA</p>
        <p className="text-amber-700">
          Texas CUBI is similar to Illinois BIPA but with key differences: (1) CUBI doesn't have statutory damages 
          (only actual damages), (2) CUBI requires "reasonable care" not specific data retention schedules, (3) CUBI 
          has been less aggressively enforced than BIPA. However, compliance with BIPA generally satisfies CUBI.
        </p>
      </div>

      <h3>Sample CUBI-Compliant Biometric Consent</h3>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4 text-sm">
        <p className="font-semibold mb-2">Biometric Information Notice and Consent</p>
        <p className="mb-2">
          [Company Name] uses technology that collects and analyzes <strong>biometric identifiers</strong> as part 
          of our hiring process. Specifically, we collect:
        </p>
        <ul className="mb-2 ml-4 list-disc">
          <li>[If applicable] Facial geometry and features from video interview recordings</li>
          <li>[If applicable] Voiceprint and speech patterns from audio recordings</li>
          <li>[If applicable] Other biometric data: [specify]</li>
        </ul>
        <p className="mb-2">
          <strong>Purpose:</strong> This biometric data is used to [describe purpose - e.g., "evaluate communication 
          skills and presentation during video interviews," "verify identity for secure assessment access"].
        </p>
        <p className="mb-2">
          <strong>Retention:</strong> We will retain your biometric data for [specify period - e.g., "the duration 
          of the hiring process," "up to 3 years"] or until you request deletion, whichever is sooner.
        </p>
        <p className="mb-2">
          <strong>Protection:</strong> We store biometric data with reasonable security measures including encryption 
          and access controls. We will not sell, lease, or disclose your biometric data without your consent except 
          as required by law.
        </p>
        <p className="mt-4 mb-2">
          <strong>Your Consent:</strong><br />
          ☐ I consent to [Company Name]'s collection and use of my biometric identifiers as described above.
        </p>
        <p className="text-xs italic">
          Signature: _________________________ Date: ____________
        </p>
      </blockquote>

      <h2>Texas Employment Discrimination Law and AI</h2>

      <p>
        Even without AI-specific legislation, Texas employment law applies to AI hiring tools:
      </p>

      <h3>Texas Labor Code Chapter 21 (Texas Commission on Human Rights Act)</h3>

      <p>
        Prohibits employment discrimination based on:
      </p>

      <ul>
        <li>Race, color, religion, sex, national origin</li>
        <li>Age (40+)</li>
        <li>Disability</li>
        <li>Genetic information</li>
      </ul>

      <p>
        <strong>Application to AI:</strong> If an AI hiring tool produces discriminatory outcomes (disparate impact) 
        on these protected classes, it may violate Texas Labor Code regardless of intent.
      </p>

      <h3>Compliance Implications</h3>

      <p>
        While Texas doesn't require bias audits, employers should:
      </p>

      <ul>
        <li>Test AI tools for disparate impact before deployment</li>
        <li>Monitor outcomes by protected category</li>
        <li>Validate that AI tools are job-related</li>
        <li>Maintain human oversight of AI decisions</li>
        <li>Document due diligence efforts</li>
      </ul>

      <h2>Pending Texas AI Hiring Legislation</h2>

      <p>
        Several bills introduced in the Texas Legislature could establish comprehensive AI hiring requirements:
      </p>

      <h3>HB 2060 - AI Transparency in Employment Act (Proposed)</h3>

      <p><strong>Status:</strong> Committee review (as of Q1 2026)</p>

      <p><strong>Key provisions (if passed):</strong></p>
      <ul>
        <li>Disclosure requirement when AI is used in hiring decisions</li>
        <li>Bias audit requirement for AI screening tools</li>
        <li>Right to opt out and request human-only review</li>
        <li>Civil penalties for non-compliance ($2,500-$10,000 per violation)</li>
      </ul>

      <h3>SB 1893 - Algorithmic Accountability Act (Proposed)</h3>

      <p><strong>Status:</strong> Introduced, not yet scheduled for hearing</p>

      <p><strong>Key provisions (if passed):</strong></p>
      <ul>
        <li>Impact assessments for high-risk AI systems</li>
        <li>Registry of AI tools used in employment</li>
        <li>Annual reporting to Texas Workforce Commission</li>
        <li>Enforcement through Attorney General</li>
      </ul>

      <h3>Likelihood and Timeline</h3>

      <p>
        Texas has historically taken a light-touch regulatory approach compared to states like California. However, 
        bipartisan concern about AI fairness may lead to passage of some form of AI employment regulation by 2027.
      </p>

      <p>
        <strong>Compliance strategy:</strong> Monitor legislation and prepare for potential requirements even if not 
        yet law. Building compliant processes now avoids rushed implementation later.
      </p>

      <h2>Best Practices for Texas Employers (Beyond Legal Requirements)</h2>

      <h3>1. Voluntary Disclosure</h3>

      <p>
        While not legally required, disclosing AI use to candidates:
      </p>

      <ul>
        <li>Builds trust and transparency</li>
        <li>Reduces candidate complaints</li>
        <li>Prepares you for potential future legal requirements</li>
        <li>Demonstrates good-faith compliance efforts if investigated</li>
      </ul>

      <h3>2. Voluntary Bias Testing</h3>

      <p>
        Even without a bias audit mandate, test your AI tools:
      </p>

      <ul>
        <li>Analyze selection rates by race, sex, age</li>
        <li>Calculate impact ratios (Four-Fifths Rule)</li>
        <li>Document findings and remediation efforts</li>
        <li>Retain testing data for 3+ years</li>
      </ul>

      <h3>3. Vendor Due Diligence</h3>

      <p>
        Ask AI vendors serving Texas employers:
      </p>

      <ul>
        <li>Is your tool CUBI-compliant for biometric data collection?</li>
        <li>Have you conducted bias testing? Can we see results?</li>
        <li>How do you ensure compliance with Texas anti-discrimination law?</li>
        <li>Will you indemnify us for compliance violations?</li>
      </ul>

      <h3>4. Accommodation Processes</h3>

      <p>
        Build processes to accommodate candidates with disabilities:
      </p>

      <ul>
        <li>Provide alternative assessment formats</li>
        <li>Allow extra time or assistive technology use</li>
        <li>Train recruiters on accommodation requests</li>
        <li>Document accommodation provision</li>
      </ul>

      <h2>Comparison: Texas vs. Other Major States</h2>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Requirement</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Texas</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">California</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">New York</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-3 py-2 text-gray-900">AI Disclosure</td>
              <td className="px-3 py-2 text-amber-600">Not required*</td>
              <td className="px-3 py-2 text-green-600">Required</td>
              <td className="px-3 py-2 text-green-600">Required</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-3 py-2 text-gray-900">Bias Audit</td>
              <td className="px-3 py-2 text-amber-600">Not required*</td>
              <td className="px-3 py-2 text-green-600">Annual</td>
              <td className="px-3 py-2 text-green-600">Annual (NYC)</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-2 text-gray-900">Biometric Consent</td>
              <td className="px-3 py-2 text-green-600">Required (CUBI)</td>
              <td className="px-3 py-2 text-green-600">Required (CCPA/CPRA)</td>
              <td className="px-3 py-2 text-green-600">Required (BIPA if IL)</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-3 py-2 text-gray-900">Penalties</td>
              <td className="px-3 py-2 text-gray-700">$25K (CUBI)</td>
              <td className="px-3 py-2 text-gray-700">AG enforcement</td>
              <td className="px-3 py-2 text-gray-700">$1,500/day (NYC)</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-600 mt-2">* Pending legislation may change requirements</p>
      </div>

      <h2>Practical Compliance Steps for Texas Employers</h2>

      <h3>Step 1: Identify Biometric AI Tools</h3>

      <ul>
        <li>Audit your AI hiring tech stack</li>
        <li>Flag tools that collect facial recognition, voice analysis, or other biometrics</li>
        <li>Obtain CUBI compliance documentation from vendors</li>
      </ul>

      <h3>Step 2: Implement CUBI Compliance</h3>

      <ul>
        <li>Create biometric data notice and consent forms</li>
        <li>Integrate consent collection into hiring workflow</li>
        <li>Establish data retention and deletion policies</li>
        <li>Implement security measures for biometric data</li>
        <li>Train staff on CUBI requirements</li>
      </ul>

      <h3>Step 3: Test for Discrimination</h3>

      <ul>
        <li>Conduct voluntary bias analysis (even though not required)</li>
        <li>Monitor AI tool outcomes by protected categories</li>
        <li>Document validation and job-relatedness</li>
        <li>Prepare to defend AI use if challenged</li>
      </ul>

      <h3>Step 4: Monitor Pending Legislation</h3>

      <ul>
        <li>Track HB 2060, SB 1893, and other AI employment bills</li>
        <li>Participate in industry comment periods</li>
        <li>Prepare compliance plans for potential new requirements</li>
        <li>Budget for bias audits/impact assessments if laws pass</li>
      </ul>

      <h3>Step 5: Document Everything</h3>

      <ul>
        <li>Retain CUBI consent records</li>
        <li>Document vendor due diligence</li>
        <li>Keep bias testing results and remediation efforts</li>
        <li>Maintain records of accommodation requests and responses</li>
      </ul>

      <h2>How EmployArmor Helps Texas Employers</h2>

      <ul>
        <li><strong>CUBI compliance automation:</strong> Biometric consent forms and tracking</li>
        <li><strong>Voluntary disclosure templates:</strong> Build good-faith transparency</li>
        <li><strong>Bias testing coordination:</strong> Proactive analysis before legal requirement</li>
        <li><strong>Legislative monitoring:</strong> Real-time alerts on pending Texas AI bills</li>
        <li><strong>Multi-state compliance:</strong> Integrate Texas requirements with other jurisdictions</li>
        <li><strong>Vendor assessment:</strong> Evaluate AI tool compliance with Texas law</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Hiring in Texas?</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Texas Compliance Assessment →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Do we need CUBI compliance if our vendor handles all biometric data?</h3>
      <p>
        Yes. Even if a third-party vendor operates the AI tool, you as the employer are responsible for obtaining 
        consent from candidates before biometric data collection. Vendor handling doesn't eliminate your CUBI obligations.
      </p>

      <h3>If we're already compliant with Illinois BIPA, are we automatically CUBI-compliant?</h3>
      <p>
        Generally yes. BIPA requirements are more stringent than CUBI in most respects. If you're BIPA-compliant 
        (notice, consent, retention schedule, security), you likely satisfy CUBI. However, review CUBI's specific 
        "reasonable care" standard to ensure alignment.
      </p>

      <h3>Should we conduct bias audits even though Texas doesn't require them?</h3>
      <p>
        Strongly recommended. Federal anti-discrimination law applies regardless of state requirements. Voluntary bias 
        audits help you discover problems before EEOC or candidates do. They also demonstrate good-faith compliance 
        efforts if you're investigated.
      </p>

      <h3>What if pending legislation passes mid-year? Do we get a grace period?</h3>
      <p>
        Most AI hiring laws include implementation periods (e.g., 6-12 months after passage). However, don't count on 
        generous timelines. Start building compliance processes now so you're ready when/if new requirements take effect.
      </p>

      <h3>Can we use AI tools for hiring in Texas even without comprehensive regulation?</h3>
      <p>
        Yes. The absence of AI-specific hiring law doesn't prohibit AI use—it just means there's less prescriptive 
        guidance. You're still bound by federal and Texas anti-discrimination law, so ensure your AI tools don't 
        produce biased outcomes.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/ai-hiring-laws-by-state" className="text-blue-600 hover:underline">State-by-State AI Hiring Laws</Link></li>
        <li><Link href="/resources/ai-hiring-disclosure-template-download" className="text-blue-600 hover:underline">AI Disclosure Templates</Link></li>
        <li><Link href="/blog/ai-hiring-compliance-small-business" className="text-blue-600 hover:underline">AI Hiring for Small Businesses</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
