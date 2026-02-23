import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export default function AIDisclosureDecisionTreePage() {
  return (
    <ArticleLayout
      title="Do I Need to Disclose AI in Hiring? Decision Tree"
      description="Use this simple flowchart to determine if your company needs to disclose AI use to candidates, and which regulations apply to your hiring process."
      category="Tool"
      readTime="3 min read"
      publishedDate="June 30, 2026"
    >
      <AuthorByline publishDate="2025-02-20" />

      <p>
        Not sure if your hiring tools require candidate disclosure? This decision tree walks you 
        through the key questions to determine your obligations. Answer each question to identify 
        which regulations apply and what actions you need to take.
      </p>

      <h2>Start Here: The Main Question</h2>
      
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 my-6 text-center">
        <p className="text-lg font-bold text-blue-900 mb-2">
          Do you use any technology in hiring that uses AI, machine learning, 
          automated scoring, or algorithmic decision-making?
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-green-700 font-bold">YES → Continue below</div>
          <div className="text-gray-500 font-bold">NO → No disclosure required*</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-8">
        *If you're unsure whether your tools use AI, see our guide: 
        <Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline"> What Counts as AI in Hiring?</Link>
      </p>

      <h2>Question 1: Where Are Your Positions?</h2>
      <p className="mb-4">
        Check all locations where you have open positions or may hire employees:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>New York City</strong>
              <p className="text-sm text-gray-600">→ NYC Local Law 144 applies (already in effect)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Illinois</strong>
              <p className="text-sm text-gray-600">→ HB 3773 applies (effective January 1, 2026)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Colorado</strong>
              <p className="text-sm text-gray-600">→ Colorado AI Act applies (effective June 30, 2026)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>California</strong>
              <p className="text-sm text-gray-600">→ CCPA ADMT rules apply (if meeting business thresholds)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Maryland</strong>
              <p className="text-sm text-gray-600">→ HB 1202 applies if using video interview AI</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Remote positions (work from anywhere)</strong>
              <p className="text-sm text-gray-600">→ All above may apply depending on candidate location</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>None of the above</strong>
              <p className="text-sm text-gray-600">→ Currently no specific disclosure law, but best practice to disclose</p>
            </div>
          </li>
        </ul>
      </div>

      <h2>Question 2: What Type of AI Do You Use?</h2>
      
      <h3>Resume Screening / Candidate Ranking</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI to screen, score, or rank resumes?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES →</strong> Disclosure required (NYC, IL, CO, CA)</li>
          <li><strong>Examples:</strong> LinkedIn Recruiter matching, Indeed recommendations, AI-powered ATS screening</li>
        </ul>
      </div>

      <h3>Video Interview Analysis</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI to analyze video interviews?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES →</strong> Disclosure required (NYC, IL, CO, CA, MD)</li>
          <li><strong>Examples:</strong> HireVue, Pymetrics, facial expression or tone analysis</li>
        </ul>
      </div>

      <h3>AI-Scored Assessments</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI-powered skills tests or assessments?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES →</strong> Disclosure required (NYC, IL, CO, CA)</li>
          <li><strong>Examples:</strong> Cognitive assessments, personality tests with ML scoring, game-based assessments</li>
        </ul>
      </div>

      <h3>Chatbots / Virtual Assistants</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use chatbots that screen or evaluate candidates?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES (if it influences decisions) →</strong> Disclosure required</li>
          <li><strong>NO (if scheduling only) →</strong> Typically not required</li>
        </ul>
      </div>

      <h3>Background Check AI</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI for background screening beyond verification?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES (if predictive/scoring) →</strong> Likely disclosure required</li>
          <li><strong>NO (basic verification only) →</strong> May not require AI disclosure (but FCRA applies)</li>
        </ul>
      </div>

      <h2>Decision Summary</h2>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800 mb-2">If you checked ANY box in Questions 1 AND 2:</p>
        <p className="text-orange-700">
          You likely need to provide AI disclosure notices to candidates. The specific requirements 
          depend on which jurisdictions apply.
        </p>
      </div>

      <h2>What You Need to Do by Jurisdiction</h2>

      <h3>NYC (Local Law 144) — Already Required</h3>
      <ul>
        <li>☐ Independent bias audit (annually)</li>
        <li>☐ Post audit summary on website</li>
        <li>☐ Notify candidates 10 business days before AEDT use</li>
        <li>☐ Explain what AI evaluates and data sources</li>
        <li>☐ Offer alternative process if available</li>
      </ul>

      <h3>Illinois (HB 3773) — January 1, 2026</h3>
      <ul>
        <li>☐ Notify candidates before or at time of AI use</li>
        <li>☐ Explain what AI is used for</li>
        <li>☐ Explain data inputs and how outputs influence decisions</li>
        <li>☐ Ensure AI doesn't discriminate on protected characteristics</li>
      </ul>

      <h3>Colorado (AI Act) — June 30, 2026</h3>
      <ul>
        <li>☐ Complete impact assessment before deployment</li>
        <li>☐ Notify candidates before AI is used</li>
        <li>☐ Explain purpose and decision type</li>
        <li>☐ Offer opt-out from AI profiling</li>
        <li>☐ Provide appeal process for adverse decisions</li>
        <li>☐ Send adverse decision statement if not selected</li>
      </ul>

      <h3>California (CCPA ADMT) — Already Required</h3>
      <ul>
        <li>☐ Pre-use notice explaining ADMT</li>
        <li>☐ Describe logic, inputs, and outputs</li>
        <li>☐ Offer opt-out from ADMT processing</li>
        <li>☐ Respond to access requests within 45 days</li>
        <li>☐ Complete risk assessment</li>
      </ul>

      <h3>Maryland (HB 1202) — If Using Video AI</h3>
      <ul>
        <li>☐ Obtain consent before using facial recognition in interviews</li>
        <li>☐ Provide notice that video AI will be used</li>
      </ul>

      <h2>Still Not Sure?</h2>

      <p>Here are some common scenarios:</p>

      <h3>"We just use LinkedIn Recruiter"</h3>
      <p>
        LinkedIn Recruiter uses AI for matching and recommendations. If you're hiring in regulated 
        jurisdictions and using these AI features to inform decisions, disclosure is likely required.
      </p>

      <h3>"Our ATS does automatic screening, but it's not really AI"</h3>
      <p>
        If the ATS uses machine learning, natural language processing, or algorithmic scoring to 
        filter or rank candidates, it's probably covered. Check with your vendor.
      </p>

      <h3>"We only use AI to source candidates, not decide on them"</h3>
      <p>
        The laws generally apply when AI is used to make or substantially assist employment decisions. 
        If AI helps determine who gets contacted or considered, disclosure may still apply.
      </p>

      <h3>"We're a small company"</h3>
      <p>
        NYC and Illinois apply regardless of company size. Colorado applies to "deployers" of high-risk 
        AI. California CCPA has business size thresholds. Check each law's scope carefully.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">When in Doubt, Disclose</p>
        <p className="text-blue-700">
          Disclosing AI use when not strictly required has minimal downside. Failing to disclose when 
          required can result in fines and legal liability. Transparency builds trust.
        </p>
      </div>

      <h2>Edge Cases and Exceptions</h2>
      <p>
        Some scenarios require careful analysis:
      </p>

      <h3>Internal Promotions and Transfers</h3>
      <p>
        <strong>Question:</strong> Do AI disclosure rules apply to internal hiring?
      </p>
      <p>
        <strong>Answer:</strong> It depends on the jurisdiction. NYC Local Law 144 explicitly covers 
        "promotion or selection for hire." Colorado's AI Act applies to "consequential decisions" 
        affecting employment. Illinois HB 3773 applies to "applicants" but is less clear about internal 
        candidates. Best practice: disclose AI use even for internal moves to ensure consistency and 
        avoid claims of disparate treatment. Many organizations extend the same transparency to internal 
        and external candidates.
      </p>

      <h3>Contractors and Gig Workers</h3>
      <p>
        <strong>Question:</strong> If we use AI to select contractors, does this count as "hiring"?
      </p>
      <p>
        <strong>Answer:</strong> The laws primarily focus on "employment" relationships, which typically 
        means W-2 employees. Independent contractors (1099) may not be covered under employment laws, 
        but this is a grey area. If your contractor relationship looks like employment (exclusive, 
        long-term, controlled work), regulators might argue the protections apply. California's CCPA 
        ADMT rules include some contractor protections. When in doubt, treat contractor selection the 
        same as employee hiring for disclosure purposes.
      </p>

      <h3>Pre-Application Screening</h3>
      <p>
        <strong>Question:</strong> What if we use AI to decide who to invite to apply, before they're 
        officially "applicants"?
      </p>
      <p>
        <strong>Answer:</strong> This is increasingly common (AI-powered sourcing, predictive analytics 
        on passive candidates). If AI determines who gets recruitment outreach, you're making a 
        consequential decision about who has opportunity. While technical applicability varies by 
        jurisdiction, EEOC guidance on AI in hiring emphasizes transparency at all stages. Disclose AI 
        use when first contacting candidates: "We used AI to identify you as a potential match for this 
        role based on your public profile."
      </p>

      <h3>Multi-Tool Scenarios</h3>
      <p>
        <strong>Question:</strong> We use three different AI tools at different stages. Do we need three 
        disclosures?
      </p>
      <p>
        <strong>Answer:</strong> You can provide a comprehensive disclosure covering all AI tools used 
        in your hiring process, or stage-specific disclosures. Comprehensive disclosure is simpler 
        operationally and ensures candidates understand the full scope of AI use upfront. If tools vary 
        significantly by role or location, targeted disclosures may be clearer. NYC requires disclosure 
        "at least 10 business days before use" of each AEDT, so timing matters more than number of 
        notices.
      </p>

      <h3>Vendor-Hosted AI (You Don't "Own" the AI)</h3>
      <p>
        <strong>Question:</strong> Our ATS vendor uses AI on their platform. Are we responsible for 
        disclosure even though we don't control the AI?
      </p>
      <p>
        <strong>Answer:</strong> Yes. As the employer making hiring decisions, you're responsible for 
        compliance regardless of whether you own or just use the AI. The legal concept is "deployer" 
        liability—you deployed the AI in your hiring process. Your vendor should support your 
        compliance (provide documentation, audit support), but the obligation to disclose to candidates 
        is yours. This is why vendor contracts should include compliance cooperation provisions.
      </p>

      <h3>AI in Recruiting, Human in Hiring</h3>
      <p>
        <strong>Question:</strong> AI only creates a shortlist, but humans make all final decisions. 
        Still need disclosure?
      </p>
      <p>
        <strong>Answer:</strong> Yes. The laws apply when AI "substantially assists" decisions, not 
        just when AI makes final decisions. If AI determines who makes it to the human review stage, 
        it substantially assisted by filtering out other candidates. NYC uses the phrase "substantially 
        assists or replaces" decision-making. Colorado refers to AI that "materially impacts" decisions. 
        The test is whether the AI influenced the opportunity, not whether humans had final say.
      </p>

      <h2>Advanced Decision Tree: Disclosure Timing</h2>
      <p>
        Beyond whether to disclose, <em>when</em> you disclose matters:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <h4 className="font-semibold mb-3">Disclosure Timing Requirements</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Jurisdiction</th>
              <th className="py-2 text-left">Timing Requirement</th>
              <th className="py-2 text-left">Penalty for Late Disclosure</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">NYC</td>
              <td className="py-2">At least 10 business days before using AEDT</td>
              <td className="py-2">$500-1,500 per violation</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Illinois</td>
              <td className="py-2">Before or at time of use</td>
              <td className="py-2">Injunction, damages</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Colorado</td>
              <td className="py-2">Before use</td>
              <td className="py-2">$5,000-10,000 per violation</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">California</td>
              <td className="py-2">Before ADMT processing</td>
              <td className="py-2">CCPA penalties ($2,500-7,500/violation)</td>
            </tr>
            <tr>
              <td className="py-2">Maryland</td>
              <td className="py-2">Before video AI use + consent</td>
              <td className="py-2">Statutory damages</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-600 mt-3">
          <strong>Best practice:</strong> Provide disclosure in the job posting or application 
          confirmation email to ensure sufficient advance notice for all jurisdictions.
        </p>
      </div>

      <h2>Disclosure Delivery Methods</h2>
      <p>
        How you deliver the disclosure matters as much as what you say:
      </p>

      <h3>Job Posting</h3>
      <ul>
        <li><strong>Pros:</strong> Maximum advance notice, reaches candidates before they invest time</li>
        <li><strong>Cons:</strong> Not all candidates read full postings, may deter some applicants</li>
        <li><strong>Best for:</strong> High-volume roles, meeting NYC's 10-day requirement</li>
      </ul>

      <h3>Application Confirmation Email</h3>
      <ul>
        <li><strong>Pros:</strong> Reliably delivered, trackable, arrives at natural touchpoint</li>
        <li><strong>Cons:</strong> May not meet 10-day advance notice if AI screening is immediate</li>
        <li><strong>Best for:</strong> Colorado, Illinois, California (immediate notice requirements)</li>
      </ul>

      <h3>Dedicated Disclosure Page</h3>
      <ul>
        <li><strong>Pros:</strong> Comprehensive information in one place, referenceable URL</li>
        <li><strong>Cons:</strong> Candidates must navigate to it, link could break</li>
        <li><strong>Best for:</strong> Detailed transparency for informed candidates</li>
      </ul>

      <h3>In-App Notice (Before Assessment)</h3>
      <ul>
        <li><strong>Pros:</strong> Impossible to miss, contextual to the AI interaction</li>
        <li><strong>Cons:</strong> May not provide sufficient advance notice, disrupts flow</li>
        <li><strong>Best for:</strong> AI-powered assessments, video interview tools</li>
      </ul>

      <h3>Multi-Channel Approach (Recommended)</h3>
      <ul>
        <li>Disclose in job posting (meets advance notice requirement)</li>
        <li>Repeat in application confirmation email (ensures receipt)</li>
        <li>Remind before AI assessment stages (contextual reinforcement)</li>
        <li>Link to comprehensive disclosure page (for detail-seekers)</li>
      </ul>

      <h2>Common ATS Platforms: AI Disclosure Checklist</h2>
      <p>
        Quick reference for determining if your ATS requires disclosure:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <h4 className="font-semibold mb-3">ATS AI Feature Analysis</h4>
        <ul className="space-y-3 text-sm">
          <li>
            <strong>Workday Recruiting:</strong> Uses machine learning for candidate matching, job 
            recommendations, and resume parsing. AI disclosure required if using SmartMatch or similar 
            features.
          </li>
          <li>
            <strong>Greenhouse:</strong> Core product is mostly non-AI, but partner integrations 
            (structured interviews, assessments) may include AI. Check your specific integrations.
          </li>
          <li>
            <strong>Lever:</strong> Uses AI for candidate matching, sourcing recommendations, and 
            duplicate detection. Disclosure required for matching/ranking features.
          </li>
          <li>
            <strong>iCIMS:</strong> Includes AI-powered candidate experience tools, screening, and 
            matching. Check with iCIMS about specific features you've enabled.
          </li>
          <li>
            <strong>LinkedIn Recruiter:</strong> Uses AI for talent pool suggestions, candidate ranking, 
            and InMail prioritization. Disclosure required.
          </li>
          <li>
            <strong>Indeed:</strong> Uses AI for resume search ranking and candidate recommendations. 
            Disclosure required if using sponsored jobs with AI targeting.
          </li>
          <li>
            <strong>Bullhorn (staffing):</strong> Includes AI matching and automation. Disclosure 
            required if AI influences candidate submissions.
          </li>
        </ul>
        <p className="text-xs text-gray-600 mt-4">
          Note: AI features evolve rapidly. Verify current AI functionality with your vendor and review 
          their terms of service for compliance support obligations.
        </p>
      </div>

      <h2>Federal Considerations (EEOC)</h2>
      <p>
        While no federal AI disclosure law exists yet, the EEOC has issued guidance affecting how you 
        should approach AI hiring:
      </p>

      <ul>
        <li><strong>Title VII implications:</strong> AI tools that produce adverse impact on protected 
        groups can violate federal anti-discrimination law even if state AI laws don't apply</li>
        <li><strong>ADA concerns:</strong> AI that screens out candidates based on disability-related 
        characteristics may violate the Americans with Disabilities Act</li>
        <li><strong>ADEA issues:</strong> Age bias in AI violates the Age Discrimination in Employment Act</li>
        <li><strong>EEOC enforcement:</strong> The EEOC has stated it will hold employers accountable 
        for discriminatory AI, regardless of whether they developed the AI themselves</li>
        <li><strong>Reasonable accommodation:</strong> Candidates with disabilities may request 
        alternatives to AI evaluation as a reasonable accommodation under the ADA</li>
      </ul>

      <p>
        <strong>Takeaway:</strong> Even if you're not in a state with AI disclosure laws, proactive 
        transparency and bias monitoring protects against federal discrimination claims. The EEOC views 
        "we didn't know the AI was biased" as insufficient defense.
      </p>

      <h2>International Hiring Considerations</h2>
      <p>
        Hiring candidates outside the US? Additional regulations may apply:
      </p>

      <ul>
        <li><strong>EU AI Act:</strong> High-risk AI systems for employment decisions require conformity 
        assessment, transparency, human oversight. Effective 2026-2027 in phases.</li>
        <li><strong>GDPR (EU):</strong> Automated decision-making with legal/significant effects requires 
        explicit consent or explicit legal basis, plus right to explanation</li>
        <li><strong>UK:</strong> ICO guidance on AI and data protection, GDPR-style transparency requirements</li>
        <li><strong>Canada:</strong> PIPEDA applies to automated decision-making, right to explanation</li>
      </ul>

      <p className="text-sm text-gray-600">
        If you hire internationally, consult with employment counsel in those jurisdictions. US state 
        laws may be just the beginning of your compliance obligations.
      </p>

      <h2>Frequently Asked Questions</h2>

      <h3>What if we start using AI after a candidate already applied?</h3>
      <p>
        Provide disclosure as soon as you intend to use AI on their application, even if they applied 
        weeks ago. For NYC, wait 10 business days after disclosure before running AI evaluation. For 
        other jurisdictions, disclosure before AI use is sufficient. Document the disclosure date in 
        your ATS. This is common when implementing new AI tools mid-hiring cycle.
      </p>

      <h3>Do we need separate disclosures for each job posting?</h3>
      <p>
        Not necessarily. If you use the same AI tools consistently across all roles, a general 
        disclosure about your hiring process can apply to all postings. Link to a central "AI in Our 
        Hiring Process" page from all job postings. However, if AI use varies significantly by role 
        (e.g., technical roles use coding AI, others don't), role-specific disclosures are clearer 
        and avoid over-disclosure.
      </p>

      <h3>How detailed does the disclosure need to be?</h3>
      <p>
        Requirements vary by jurisdiction. NYC requires explaining what job qualifications/characteristics 
        the AI evaluates. Colorado requires describing the purpose, decision type, and opt-out rights. 
        California requires describing logic, inputs, and outputs. When complying with multiple 
        jurisdictions, provide the most comprehensive disclosure (Colorado/California level) to all 
        candidates. Avoid generic "we may use AI" language—be specific about what the AI does.
      </p>

      <h3>Can we comply by just linking to our vendor's disclosure?</h3>
      <p>
        No. While you can (and should) leverage vendor-provided documentation, the disclosure must come 
        from you, the employer, and explain how you use the AI in your hiring process. Candidates applied 
        to your company, not your vendor. Your disclosure should explain: "We use [Vendor Tool] to 
        [specific purpose]" and link to vendor documentation for technical details. A bare link to a 
        vendor's generic disclosure doesn't meet the spirit or letter of the laws.
      </p>

      <h3>What happens if we forget to disclose to some candidates?</h3>
      <p>
        First, stop using AI on those candidates until you've provided proper disclosure. Second, send 
        disclosure immediately (better late than never). Third, wait the required notice period before 
        resuming AI-assisted evaluation. Fourth, document the gap and corrective action. Fifth, 
        investigate why the disclosure failed (technical glitch, process breakdown, human error) and 
        fix it. Proactive self-correction demonstrates good faith and may reduce penalties if 
        regulators inquire. Consider retrospective review: did the disclosure gap disadvantage those 
        candidates?
      </p>

      <h2>Quick Self-Assessment</h2>
      <p>
        Answer these questions to gauge your disclosure readiness:
      </p>

      <ol className="space-y-2">
        <li>☐ I can name every AI tool we use in hiring and explain what each does</li>
        <li>☐ I know which states/cities we hire in and which AI laws apply</li>
        <li>☐ We have written disclosure notices for all applicable jurisdictions</li>
        <li>☐ Our disclosures are integrated into our ATS and job posting workflow</li>
        <li>☐ We can prove (with logs/records) that disclosures were delivered to candidates</li>
        <li>☐ We provide disclosure with sufficient advance notice (10+ days for NYC)</li>
        <li>☐ Our vendor contracts require them to support our compliance efforts</li>
        <li>☐ We have a process for handling candidate questions about our AI</li>
      </ol>

      <p className="text-sm text-gray-600 mt-4">
        <strong>Score:</strong> 8/8 = Excellent. 6-7 = Good, minor gaps. 4-5 = Concerning gaps. 
        0-3 = Urgent action needed.
      </p>

      <h2>Next Steps</h2>
      <ol>
        <li><strong>Audit your tools:</strong> Confirm which tools use AI and how (see <Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI</Link>)</li>
        <li><strong>Map your jurisdictions:</strong> Determine which laws apply based on where you hire</li>
        <li><strong>Create your notices:</strong> Use our <Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">disclosure templates</Link> customized to your tools and jurisdictions</li>
        <li><strong>Integrate disclosures:</strong> Build disclosure delivery into job postings, ATS workflows, and assessment platforms</li>
        <li><strong>Verify delivery:</strong> Test that disclosures reach candidates and document proof of delivery</li>
        <li><strong>Get compliant:</strong> Take our <Link href="/scorecard" className="text-blue-600 hover:underline">free compliance scorecard</Link> to assess your overall readiness</li>
      </ol>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/resources/compliance-checklist-2026" className="text-blue-600 hover:underline">2026 Compliance Checklist</Link></li>
        <li><Link href="/resources/compliance-program-guide" className="text-blue-600 hover:underline">Building a Compliance Program</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
      <LegalDisclaimer />
    </ArticleLayout>
  )
}
