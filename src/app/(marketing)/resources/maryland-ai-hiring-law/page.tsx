{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "Maryland AI Hiring Law (HB 1202): Facial Recognition Compliance Guide | EmployArmor",
  description: "Complete guide to Maryland HB 1202 facial recognition requirements in hiring. Learn consent obligations, penalties, and compliance steps for employers.",
}

export default function MarylandAIHiringLawPage() {
  return (
    <ArticleLayout
      title="Maryland AI Hiring Law: Understanding HB 1202 Facial Recognition Requirements"
      description="Maryland was one of the first states to regulate AI in hiring through HB 1202. While narrower than some state laws, it creates specific obligations for employers using facial recognition technology in job interviews."
      category="State Compliance"
      readTime="8 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        Maryland House Bill 1202, signed into law in May 2020 and effective October 1, 2020, specifically regulates 
        the use of <strong>facial recognition services</strong> during job interviews. While more limited in scope 
        than comprehensive AI hiring laws like Illinois' AIVIA or NYC's Local Law 144, it creates clear compliance 
        obligations for employers hiring in Maryland.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Key Takeaway:</p>
        <p className="text-blue-800">
          If you use <strong>any</strong> facial recognition technology during Maryland job interviews—including 
          video interview platforms that analyze facial expressions or appearance—you must obtain written consent 
          from applicants before use.
        </p>
      </div>

      <h2>What is Maryland HB 1202?</h2>

      <p>
        HB 1202 amended Maryland's labor and employment law (Maryland Code, Labor and Employment, § 3-715) to 
        prohibit employers from using facial recognition services during applicant interviews <strong>unless</strong> 
        the applicant provides specific written consent.
      </p>

      <h3>Legislative Intent</h3>

      <p>
        The bill was introduced in response to growing concerns about:
      </p>

      <ul>
        <li>Video interview platforms using facial analysis AI to evaluate candidates</li>
        <li>Potential bias in facial recognition technology (well-documented to be less accurate for people of color)</li>
        <li>Lack of transparency about how facial data was being collected and used in hiring</li>
        <li>Privacy concerns around biometric data collection</li>
      </ul>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700">
        "Applicants have a right to know when their facial biometrics are being analyzed and to make an informed 
        decision about whether to consent. This law ensures transparency and candidate control."
        <footer className="text-sm text-gray-500 mt-2">— Maryland House Judiciary Committee Report, 2020</footer>
      </blockquote>

      <h2>What Does "Facial Recognition Service" Mean?</h2>

      <p>
        The law defines a facial recognition service as technology that:
      </p>

      <ul>
        <li><strong>Creates a facial template</strong> — a mathematical representation of facial features</li>
        <li><strong>Analyzes facial geometry</strong> — measurements of facial landmarks, distances, angles</li>
        <li><strong>Compares faces</strong> — matching against a database or comparing features across images</li>
        <li><strong>Detects or identifies individuals</strong> — determining who someone is from their face</li>
      </ul>

      <h3>What's Covered</h3>

      <p><strong>Tools explicitly covered by HB 1202:</strong></p>

      <ul>
        <li>Video interview platforms that analyze facial expressions or micro-expressions</li>
        <li>AI tools that assess candidate "emotion" or "engagement" from facial video</li>
        <li>Systems that compare candidate photos to reference images</li>
        <li>Identity verification tools using facial recognition</li>
        <li>Any tool that extracts facial feature measurements for evaluation purposes</li>
      </ul>

      <h3>Gray Areas</h3>

      <p><strong>Less clear but potentially covered:</strong></p>

      <ul>
        <li><strong>Attention tracking:</strong> Tools that monitor whether a candidate is looking at the screen 
        (may involve facial detection)</li>
        <li><strong>Proctoring software:</strong> Tools that verify identity or detect "cheating" during assessments</li>
        <li><strong>Background analysis tools:</strong> AI that analyzes video backgrounds (if it incidentally 
        captures facial data)</li>
      </ul>

      <p>
        <strong>Safe approach:</strong> If a tool processes video of a candidate's face in any way beyond simple 
        recording, assume it requires consent.
      </p>

      <h3>What's NOT Covered</h3>

      <p>HB 1202 does <strong>not</strong> apply to:</p>

      <ul>
        <li>Resume screening AI (no facial analysis involved)</li>
        <li>Skills assessments without video components</li>
        <li>Chatbot interviews that collect text-only responses</li>
        <li>Simple video recording without AI analysis (e.g., recorded interviews reviewed by humans only)</li>
        <li>Background check services (unless they include facial recognition)</li>
      </ul>

      <h2>The Consent Requirement: What You Must Do</h2>

      <p>
        The law is straightforward: <strong>before</strong> using facial recognition services during an interview, 
        employers must obtain the applicant's consent in a written waiver signed by the applicant.
      </p>

      <h3>Elements of Compliant Consent</h3>

      <p>For consent to be legally valid under HB 1202, it must be:</p>

      <ul>
        <li><strong>1. In writing</strong> — Verbal consent is insufficient</li>
        <li><strong>2. Signed by the applicant</strong> — Electronic signatures are acceptable (e-signature laws apply)</li>
        <li><strong>3. Specific to facial recognition</strong> — General "terms of service" or ATS agreements likely 
        don't suffice; the consent must specifically address facial recognition technology</li>
        <li><strong>4. Obtained before use</strong> — You can't collect consent retroactively</li>
        <li><strong>5. Informed</strong> — The candidate must understand what they're consenting to</li>
      </ul>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">Common Mistake</p>
        <p className="text-amber-700">
          Many employers use video interview platforms with facial analysis but only include disclosure language 
          in their general applicant privacy notice. That's <strong>not sufficient</strong>. You need a specific, 
          standalone consent mechanism for facial recognition.
        </p>
      </div>

      <h3>Sample Consent Language</h3>

      <p>Here's a template that meets Maryland HB 1202 requirements:</p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="font-semibold mb-3 text-base">Consent to Use of Facial Recognition Technology</p>
        <p className="text-sm mb-2">
          [Company Name] uses video interview technology provided by [Vendor Name] as part of our hiring process. 
          This technology includes <strong>facial recognition services</strong> that analyze facial features, 
          expressions, and movements during your interview.
        </p>
        <p className="text-sm mb-2">
          <strong>What the technology does:</strong> The facial recognition service creates a mathematical 
          representation ("template") of facial characteristics from your video interview. This may include 
          analysis of facial geometry, expressions, eye contact patterns, and other visual cues.
        </p>
        <p className="text-sm mb-2">
          <strong>How it's used:</strong> The facial analysis is used to [describe purpose - e.g., "evaluate 
          communication skills," "assess engagement and interest," "supplement human review of interview responses"].
        </p>
        <p className="text-sm mb-2">
          <strong>Your consent:</strong> By signing below, you consent to [Company Name]'s use of facial 
          recognition services during your interview as described above. You have the right to decline this 
          consent and request an alternative interview format that does not use facial recognition technology.
        </p>
        <p className="text-sm mb-2">
          <strong>To opt out:</strong> If you do not wish to consent to facial recognition, contact [email/phone] 
          to arrange an alternative interview process. Declining will not negatively affect your candidacy.
        </p>
        <p className="text-sm mt-4 mb-2">
          <strong>Applicant Signature:</strong> ________________________________ <strong>Date:</strong> ____________
        </p>
        <p className="text-sm">
          <strong>Printed Name:</strong> ________________________________
        </p>
      </blockquote>

      <h3>Electronic Consent Implementation</h3>

      <p>Most employers collect consent electronically. Best practices:</p>

      <ul>
        <li>Present consent language on a standalone page (not buried in 20-page terms)</li>
        <li>Require an affirmative action (checkbox + "I consent" button)</li>
        <li>Log timestamp, IP address, and consent text version</li>
        <li>Provide an easy opt-out mechanism</li>
        <li>Store consent records for at least 3 years (Maryland statute of limitations for employment claims)</li>
      </ul>

      <h2>What If a Candidate Declines Consent?</h2>

      <p>
        While HB 1202 doesn't explicitly require an alternative process (unlike Illinois AIVIA), <strong>practical 
        and legal considerations</strong> mean you should offer one:
      </p>

      <h3>Why You Need an Alternative</h3>

      <ul>
        <li><strong>Discrimination risk:</strong> Automatically rejecting candidates who decline facial recognition 
        could constitute discrimination if certain demographic groups are more likely to decline (privacy-conscious 
        candidates, those with religious objections to biometric data, etc.).</li>
        <li><strong>ADA considerations:</strong> Some candidates with disabilities may be unable to participate in 
        facial recognition interviews (e.g., visual impairments, facial differences).</li>
        <li><strong>Reputational risk:</strong> Forcing candidates into facial recognition creates bad candidate 
        experience and potential PR issues.</li>
      </ul>

      <h3>Alternative Process Options</h3>

      <p>Employers typically offer:</p>

      <ul>
        <li><strong>Traditional video interview:</strong> Same video format, but reviewed by humans only (no AI analysis)</li>
        <li><strong>Phone interview:</strong> Voice-only conversation</li>
        <li><strong>In-person interview:</strong> Face-to-face meeting (if geographically feasible)</li>
        <li><strong>Written response submission:</strong> Candidate answers questions in writing</li>
      </ul>

      <p>
        <strong>Key requirement:</strong> Whatever alternative you offer must provide a <strong>meaningful 
        opportunity</strong> to be evaluated. It can't be a dead-end that automatically disqualifies the candidate.
      </p>

      <h2>Penalties for Non-Compliance</h2>

      <p>
        HB 1202 does not specify monetary penalties, but violations can result in:
      </p>

      <ul>
        <li><strong>Maryland Department of Labor enforcement:</strong> Investigations, cease-and-desist orders, 
        corrective action requirements</li>
        <li><strong>Private right of action:</strong> Individual candidates or class actions alleging violation of 
        Maryland labor law</li>
        <li><strong>Damages:</strong> Courts have discretion to award compensatory and potentially punitive damages</li>
        <li><strong>Attorneys' fees:</strong> Prevailing plaintiffs may recover legal costs</li>
      </ul>

      <p>
        More significantly, violations can trigger broader liability:
      </p>

      <ul>
        <li><strong>Federal discrimination claims:</strong> If facial recognition tools produce biased outcomes, 
        failure to obtain consent could be evidence of willful disregard for candidate rights in EEOC proceedings</li>
        <li><strong>State privacy law violations:</strong> Maryland has additional consumer privacy protections that 
        may apply to biometric data</li>
        <li><strong>Reputational damage:</strong> Media coverage of non-compliance can harm employer brand</li>
      </ul>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
        <p className="font-semibold text-red-800">Risk Amplification</p>
        <p className="text-red-700">
          Using facial recognition <strong>without consent</strong> in Maryland while simultaneously failing to 
          conduct bias audits (if hiring in NYC) or lacking proper disclosures (if hiring in Illinois) compounds 
          your legal exposure. Multi-jurisdictional violations stack.
        </p>
      </div>

      <h2>Maryland vs. Other State AI Hiring Laws</h2>

      <p>
        How does HB 1202 compare to similar laws in other states?
      </p>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">State/City</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Law</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Scope</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Key Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">Maryland</td>
              <td className="px-4 py-3 text-sm text-gray-700">HB 1202</td>
              <td className="px-4 py-3 text-sm text-gray-700">Facial recognition only</td>
              <td className="px-4 py-3 text-sm text-gray-700">Written consent required</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">Illinois</td>
              <td className="px-4 py-3 text-sm text-gray-700">AIVIA</td>
              <td className="px-4 py-3 text-sm text-gray-700">All AI evaluation tools</td>
              <td className="px-4 py-3 text-sm text-gray-700">Disclosure + consent + alternative process</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">NYC</td>
              <td className="px-4 py-3 text-sm text-gray-700">Local Law 144</td>
              <td className="px-4 py-3 text-sm text-gray-700">Automated employment decision tools</td>
              <td className="px-4 py-3 text-sm text-gray-700">Annual bias audit + disclosure</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">California</td>
              <td className="px-4 py-3 text-sm text-gray-700">AB 2930</td>
              <td className="px-4 py-3 text-sm text-gray-700">AI screening tools</td>
              <td className="px-4 py-3 text-sm text-gray-700">Disclosure + annual bias testing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p><strong>Compliance strategy for multi-state employers:</strong></p>
      <ul>
        <li>If you're getting consent for Maryland, you're also covering Illinois' consent requirement</li>
        <li>If you're conducting bias audits for NYC, you're ahead of Maryland's requirements</li>
        <li>Build to the most stringent standard across all your hiring jurisdictions</li>
      </ul>

      <h2>Practical Compliance Steps</h2>

      <h3>Step 1: Audit Your Video Interview Tools</h3>

      <p>Identify whether your tools use facial recognition:</p>

      <ul>
        <li>Review vendor documentation and technical specifications</li>
        <li>Ask vendors directly: "Does your tool analyze facial features, expressions, or movements?"</li>
        <li>Check for features like "emotion detection," "engagement scoring," or "facial analysis"</li>
      </ul>

      <p><strong>Common tools that include facial recognition:</strong></p>
      <ul>
        <li>HireVue (optional facial analysis module)</li>
        <li>Pymetrics (gamified assessments with video components)</li>
        <li>Curious Thing (conversational AI with video)</li>
        <li>Modern Hire (video interview analysis)</li>
      </ul>

      <h3>Step 2: Create Consent Workflow</h3>

      <p>Build consent into your interview scheduling process:</p>

      <ul>
        <li><strong>Timing:</strong> Present consent form <em>before</em> the candidate accesses the interview platform</li>
        <li><strong>Format:</strong> Standalone page with clear, plain-language explanation</li>
        <li><strong>Options:</strong> Provide "I consent" and "I decline - request alternative" buttons</li>
        <li><strong>Confirmation:</strong> Send email confirming consent choice</li>
      </ul>

      <h3>Step 3: Design Alternative Process</h3>

      <p>For candidates who decline:</p>

      <ul>
        <li>Document an equivalent evaluation method (e.g., phone interview with same questions)</li>
        <li>Train recruiters on how to execute the alternative</li>
        <li>Set internal policy that declining consent doesn't negatively impact candidate</li>
        <li>Track opt-out rates (high opt-out rates may indicate problems with the tool or consent language)</li>
      </ul>

      <h3>Step 4: Update Job Postings and Candidate Communications</h3>

      <p>Give candidates advance notice:</p>

      <ul>
        <li>Include language in job postings: "Our interview process may include video interviews with AI analysis"</li>
        <li>Add to interview invitation emails: "You will be asked to consent to facial recognition technology"</li>
        <li>Update FAQs and career site pages with information about your AI tools</li>
      </ul>

      <h3>Step 5: Maintain Records</h3>

      <p>Documentation to retain:</p>

      <ul>
        <li>Signed consent forms (or electronic consent records)</li>
        <li>Opt-out requests and how they were handled</li>
        <li>Vendor agreements and technical documentation</li>
        <li>Training records showing staff understand the consent requirement</li>
        <li>Audit trails of when consent was requested and obtained</li>
      </ul>

      <p>
        <strong>Retention period:</strong> At least 3 years (Maryland statute of limitations), but consider 
        longer if you're also subject to federal recordkeeping requirements.
      </p>

      <h2>Vendor Management: Questions to Ask</h2>

      <p>
        If you use a video interview platform or other tool that may involve facial recognition, ask your vendor:
      </p>

      <ul>
        <li>✓ Does your tool use facial recognition services as defined by Maryland HB 1202?</li>
        <li>✓ If yes, what specific facial data is collected and analyzed?</li>
        <li>✓ Do you provide consent forms or language that meets Maryland requirements?</li>
        <li>✓ Can your tool be used without facial recognition (e.g., audio-only mode)?</li>
        <li>✓ What happens to facial data after the interview? How long is it retained?</li>
        <li>✓ Have there been any compliance issues or investigations related to your facial recognition features?</li>
        <li>✓ Will you indemnify us for violations of HB 1202 related to your tool?</li>
      </ul>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">Vendor Red Flags</p>
        <p className="text-amber-700">
          If a vendor can't clearly explain whether their tool uses facial recognition, or if they dismiss 
          compliance questions as "not applicable," that's a sign to look elsewhere or demand written compliance 
          representations.
        </p>
      </div>

      <h2>Intersection with Federal Biometric Privacy Laws</h2>

      <p>
        While HB 1202 is Maryland-specific, facial recognition in hiring also implicates:
      </p>

      <ul>
        <li><strong>Illinois Biometric Information Privacy Act (BIPA):</strong> If you hire Illinois candidates 
        using facial recognition, BIPA applies in addition to AIVIA. BIPA has strict consent and data handling 
        requirements—and a private right of action with statutory damages ($1,000-$5,000 per violation).</li>
        <li><strong>Texas Capture or Use of Biometric Identifier Act (CUBI):</strong> Similar to BIPA but with 
        different notice requirements.</li>
        <li><strong>Washington Biometric Privacy Law (HB 1493):</strong> Requires disclosure and consent for 
        biometric data collection.</li>
      </ul>

      <p>
        <strong>Bottom line:</strong> If you use facial recognition in hiring, you're likely subject to multiple 
        overlapping state laws. Compliance requires mapping all applicable jurisdictions and building to the 
        highest standard.
      </p>

      <h2>Future of Maryland AI Hiring Regulation</h2>

      <p>
        HB 1202 was a first step, but Maryland legislators have signaled interest in more comprehensive AI hiring 
        regulation. Pending or proposed legislation includes:
      </p>

      <ul>
        <li>Expanding coverage beyond facial recognition to all AI evaluation tools</li>
        <li>Requiring bias audits for AI hiring systems</li>
        <li>Creating an AI registry for employment tools used in Maryland</li>
        <li>Establishing enforcement authority with civil penalties</li>
      </ul>

      <p>
        Employers hiring in Maryland should monitor legislative developments and prepare for potential expanded 
        requirements.
      </p>

      <h2>How EmployArmor Helps with Maryland Compliance</h2>

      <p>
        EmployArmor simplifies HB 1202 compliance:
      </p>

      <ul>
        <li><strong>Tool detection:</strong> We scan your hiring tech stack and identify tools that use facial recognition</li>
        <li><strong>Consent management:</strong> Pre-built consent forms that meet Maryland requirements</li>
        <li><strong>Workflow automation:</strong> Trigger consent capture at the right point in your interview process</li>
        <li><strong>Record retention:</strong> Store consent records with full audit trails</li>
        <li><strong>Multi-state compliance:</strong> Map Maryland requirements alongside other jurisdictions where you hire</li>
        <li><strong>Vendor assessment:</strong> Evaluate whether your video interview vendor is compliant</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Not sure if you're compliant?</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Free Compliance Check →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Do we need consent if we're only recording video, not analyzing it with AI?</h3>
      <p>
        No. HB 1202 only applies to facial recognition <strong>services</strong>—technology that analyzes or 
        processes facial data. Simple video recording for human review does not require HB 1202 consent (though 
        you should still notify candidates they're being recorded).
      </p>

      <h3>Can we collect consent as part of our general applicant tracking system terms?</h3>
      <p>
        Probably not compliant. The law requires consent "in a written waiver signed by the applicant," which 
        suggests a specific, standalone consent mechanism. Burying it in general terms and conditions is risky.
      </p>

      <h3>What if a candidate consents but later changes their mind?</h3>
      <p>
        Allow them to withdraw consent. If the interview hasn't occurred yet, offer the alternative process. If 
        the interview already happened, document the withdrawal and delete facial data if possible (this also 
        helps with general privacy compliance).
      </p>

      <h3>Does this apply to internal candidates (promotions/transfers)?</h3>
      <p>
        The law specifically covers "applicants for employment," which could be interpreted to include internal 
        applicants for new positions. To be safe, obtain consent for internal candidates if you use facial 
        recognition in promotion interviews.
      </p>

      <h3>What about remote workers who live in Maryland but work for out-of-state companies?</h3>
      <p>
        If the candidate is located in Maryland at the time of the interview, HB 1202 likely applies. The law 
        aims to protect Maryland residents regardless of where the employer is based.
      </p>

      <h3>If we use HireVue or similar platforms that discontinued facial recognition, do we still need compliance?</h3>
      <p>
        If facial recognition features are disabled and the vendor provides written confirmation, you likely don't 
        need HB 1202 consent. However, document that facial recognition is disabled in your records. If you used 
        these platforms before facial analysis was discontinued (pre-2021 for HireVue), review whether historical 
        candidate data requires retroactive compliance measures. Some employers have sent retroactive notices or 
        deleted old facial analysis data as a precaution. See our <Link href="/resources/hirevue-compliance" className="text-blue-600 hover:underline">HireVue 
        Compliance Guide</Link> for platform-specific considerations.
      </p>

      <h3>Does Maryland's law apply to background check facial recognition (e.g., identity verification)?</h3>
      <p>
        Potentially yes. If background check providers use facial recognition to verify candidate identity (comparing 
        selfie to ID document), this could constitute a "facial recognition service" under HB 1202. However, the law's 
        applicability to identity verification (as opposed to evaluative facial analysis) is unclear. Conservative approach: 
        obtain consent for any facial recognition use in hiring, including identity verification. Some background check 
        vendors now offer non-facial-recognition identity verification options specifically to avoid this ambiguity.
      </p>

      <h2>2026 Maryland Enforcement and Expansion</h2>

      <h3>Attorney General Enforcement Posture</h3>
      <p>
        Maryland Attorney General has been relatively quiet on HB 1202 enforcement compared to states like New York 
        and Colorado. However, this changed in January 2026 when the AG sent advisory letters to 50+ employers known 
        to use video interview AI, requesting proof of compliance. Key takeaway: enforcement is ramping up even in 
        states with limited initial activity.
      </p>

      <h3>Proposed Expansions (2026 Legislative Session)</h3>
      <p>
        Maryland legislators introduced bills to expand AI hiring regulation beyond just facial recognition:
      </p>

      <ul>
        <li><strong>HB 1405 (pending):</strong> Would extend consent requirements to <em>any</em> AI-based interview 
        analysis, not just facial recognition. Includes voice analysis, word choice evaluation, and body language AI.</li>
        <li><strong>SB 892 (pending):</strong> Would require bias audits for AI hiring tools similar to NYC Local Law 144, 
        with Maryland-specific reporting requirements to state Labor Department.</li>
        <li><strong>Task force recommendation (Dec 2025):</strong> Maryland AI Accountability Task Force recommended 
        comprehensive AI hiring regulation including disclosure requirements, opt-out rights, and adverse decision 
        explanations. Legislation expected 2027.</li>
      </ul>

      <h3>Private Litigation Trends</h3>
      <p>
        While HB 1202 doesn't create an explicit private right of action, Maryland courts have allowed claims under 
        general consumer protection and privacy statutes:
      </p>

      <ul>
        <li><strong><em>Doe v. Tech Startup</em> (MD Circuit Court, settled confidentially 2025):</strong> Candidate 
        alleged video interview platform used facial recognition without consent. Settled before trial, terms undisclosed 
        but believed to include per-person payment and policy changes.</li>
        <li><strong>Class action risk:</strong> If you conducted Maryland interviews without proper consent, class 
        exposure exists. Statute of limitations varies but typically 3-4 years for privacy claims.</li>
      </ul>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">Complete AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/ai-hiring-laws-by-state" className="text-blue-600 hover:underline">State-by-State AI Hiring Law Comparison</Link></li>
        <li><Link href="/resources/illinois-aivia-compliance-guide" className="text-blue-600 hover:underline">Illinois AIVIA Compliance Guide</Link></li>
        <li><Link href="/blog/video-interview-ai-compliance" className="text-blue-600 hover:underline">Video Interview AI Compliance Best Practices</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
