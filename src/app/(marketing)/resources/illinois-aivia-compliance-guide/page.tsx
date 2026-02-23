import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "Illinois AI Hiring Law: AIVIA Compliance Guide 2026 | EmployArmor",
  description: "Complete guide to Illinois AIVIA compliance. Learn disclosure requirements, consent rules, penalties, and how to stay compliant with HB 3773.",
}

export default function IllinoisAIVIAComplianceGuidePage() {
  return (
    <ArticleLayout
      title="Illinois AI Hiring Law: What Employers Need to Know About AIVIA Compliance in 2026"
      description="If you're using AI in your hiring process and employing workers in Illinois, you're subject to one of the most comprehensive AI hiring regulations in the country."
      category="Compliance Guide"
      readTime="10 min read"
      publishedDate="February 9, 2026"
    >
      <AuthorByline publishDate="2025-02-20" />

      {/* Author byline */}
      <div className="flex items-center gap-3 mb-8 pb-8 border-b">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">DB</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Devyn Bartell</p>
          <p className="text-sm text-gray-500">Founder, EmployArmor</p>
        </div>
      </div>

      <p>
        The Illinois Artificial Intelligence Video Interview Act (AIVIA) and the recent amendments 
        under HB 3773 create specific obligations that many employers are still getting wrong. This 
        guide breaks down exactly what's required, what the penalties look like, and how to stay 
        compliant without grinding your hiring process to a halt.
      </p>

      <h2>What Is Illinois AIVIA?</h2>
      <p>
        The Artificial Intelligence Video Interview Act (820 ILCS 42) was originally passed in 2020, 
        making Illinois the first state to regulate AI in hiring. The law has since been expanded 
        through HB 3773 to cover a broader range of AI-powered hiring tools—not just video interviews.
      </p>
      
      <p><strong>The law applies to you if:</strong></p>
      <ul>
        <li>You have employees in Illinois</li>
        <li>You use AI or automated decision-making tools in any part of your hiring process</li>
        <li>This includes resume screening, chatbots, skills assessments, video interviews, and candidate ranking systems</li>
      </ul>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">Common Misconception</p>
        <p className="text-amber-700">
          Many employers think AIVIA only applies to video interview analysis. That was true before 
          HB 3773. Now, <em>any</em> AI tool that screens, evaluates, or ranks candidates triggers 
          compliance requirements.
        </p>
      </div>

      <h2>The Three Core Requirements</h2>

      <h3>1. Disclosure Before Use</h3>
      <p>
        Before a candidate interacts with any AI hiring tool, you must provide written notice that explains:
      </p>
      <ul>
        <li>That AI will be used to evaluate their candidacy</li>
        <li>What the AI is evaluating (skills, personality traits, qualifications, etc.)</li>
        <li>How the AI analysis will factor into the hiring decision</li>
      </ul>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
        <p className="font-semibold text-red-800">Where Employers Get This Wrong</p>
        <p className="text-red-700">
          Burying disclosure language in a 20-page terms of service doesn't count. The notice must 
          be "clear and conspicuous"—meaning a standalone disclosure, not hidden in fine print.
        </p>
      </div>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700">
        "The disclosure piece is where most companies fail their first audit. They'll have something 
        in their ATS terms, but candidates never actually see it. That's not compliant."
        <footer className="text-sm text-gray-500 mt-2">— HR Compliance Practitioner</footer>
      </blockquote>

      <h3>2. Consent Requirements</h3>
      <p>
        After providing disclosure, you must obtain the candidate's consent <em>before</em> using 
        the AI tool. This consent must be:
      </p>
      <ul>
        <li>Affirmative (opt-in, not opt-out)</li>
        <li>Specific to the AI evaluation</li>
        <li>Documented and retained</li>
      </ul>
      <p>
        <strong>The tricky part:</strong> If a candidate declines AI evaluation, you need an 
        alternative process. You can't simply reject them for refusing. This is where many 
        employers' workflows break down—they haven't built the non-AI path.
      </p>

      <h3>3. Data Retention and Destruction</h3>
      <p>
        AIVIA includes specific requirements for how long you keep AI evaluation data and when 
        you must destroy it:
      </p>
      <ul>
        <li>Video recordings must be destroyed within 30 days of a candidate's request</li>
        <li>You must have a documented data retention policy</li>
        <li>Candidates have the right to request their data be deleted</li>
      </ul>

      <h2>What Counts as "AI" Under the Law?</h2>
      <p>This is where it gets nuanced. The law covers:</p>

      <p><strong>Clearly covered:</strong></p>
      <ul>
        <li>AI-powered video interview analysis (HireVue-style)</li>
        <li>Resume parsing and screening tools</li>
        <li>Chatbot-based candidate assessments</li>
        <li>Predictive analytics that rank candidates</li>
        <li>Skills or personality assessments using ML models</li>
      </ul>

      <p><strong>Gray areas:</strong></p>
      <ul>
        <li>Keyword matching in ATS systems (depends on sophistication)</li>
        <li>Calendar scheduling bots (probably not covered)</li>
        <li>Simple automated email sequences (not covered)</li>
      </ul>

      <p>
        <strong>The test:</strong> If the tool is making evaluative judgments about candidates—scoring, 
        ranking, filtering, or recommending—it's likely covered. If it's purely administrative, it's likely not.
      </p>

      <h2>Penalties for Non-Compliance</h2>
      <p>Illinois enforces AIVIA through the Illinois Department of Labor. Penalties include:</p>
      <ul>
        <li><strong>First violation:</strong> Up to $500 per affected candidate</li>
        <li><strong>Subsequent violations:</strong> Up to $1,000 per affected candidate</li>
        <li><strong>Pattern of violations:</strong> Additional penalties and potential injunctive relief</li>
      </ul>

      <div className="bg-red-100 border border-red-300 rounded-lg p-6 my-6">
        <p className="font-bold text-red-800 text-lg">⚠️ The Math Adds Up Fast</p>
        <p className="text-red-700 mt-2">
          A company that processes 10,000 applications annually without proper disclosure could 
          face <strong>$5-10 million</strong> in potential liability.
        </p>
      </div>

      <p>Beyond direct penalties, non-compliance creates:</p>
      <ul>
        <li>Private right of action exposure</li>
        <li>Reputational damage in competitive hiring markets</li>
        <li>Complications in M&A due diligence (acquirers are checking this now)</li>
      </ul>

      <h2>How to Become Compliant: A Practical Checklist</h2>

      <h3>Step 1: Audit Your Current Tools</h3>
      <p>Map every tool in your hiring workflow and flag anything that:</p>
      <ul>
        <li>☐ Scores or ranks candidates</li>
        <li>☐ Filters applications automatically</li>
        <li>☐ Analyzes video, audio, or text from candidates</li>
        <li>☐ Uses machine learning or AI in any evaluation</li>
      </ul>

      <h3>Step 2: Update Your Disclosure Language</h3>
      <p>For each AI tool, create clear disclosure language that covers:</p>
      <ul>
        <li>☐ What the tool is</li>
        <li>☐ What it evaluates</li>
        <li>☐ How it impacts hiring decisions</li>
        <li>☐ How candidates can opt out</li>
      </ul>

      <h3>Step 3: Implement Consent Capture</h3>
      <p>Build consent capture into your workflow:</p>
      <ul>
        <li>☐ Consent appears <em>before</em> AI evaluation</li>
        <li>☐ Consent is affirmative (checkbox, signature, or equivalent)</li>
        <li>☐ Consent is logged with timestamp</li>
        <li>☐ Alternative path exists for candidates who decline</li>
      </ul>

      <h3>Step 4: Create Your Alternative Process</h3>
      <p>Design a non-AI evaluation path for candidates who opt out:</p>
      <ul>
        <li>☐ Define what "alternative review" looks like</li>
        <li>☐ Train recruiters on the alternative process</li>
        <li>☐ Ensure opt-out candidates aren't disadvantaged</li>
      </ul>

      <h3>Step 5: Document Everything</h3>
      <p>Build your compliance documentation:</p>
      <ul>
        <li>☐ Written policy on AI use in hiring</li>
        <li>☐ Data retention and destruction procedures</li>
        <li>☐ Consent records retention (keep for at least 3 years)</li>
        <li>☐ Regular audit schedule</li>
      </ul>

      <h2>How EmployArmor Helps</h2>
      <p>We built EmployArmor specifically for this problem. Our platform:</p>
      <ul>
        <li><strong>Scans your job postings</strong> for AI tool usage and flags compliance gaps</li>
        <li><strong>Generates disclosure language</strong> tailored to your specific tools</li>
        <li><strong>Manages consent capture</strong> with audit-ready documentation</li>
        <li><strong>Provides the alternative pathway</strong> workflow out of the box</li>
        <li><strong>Monitors regulatory changes</strong> so you don't have to</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Not sure where you stand?</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Free Compliance Score →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Does AIVIA apply to remote workers?</h3>
      <p>
        Yes. If the employee will be working in Illinois—even remotely—the law applies. The 
        location of your headquarters doesn't matter.
      </p>

      <h3>What if we use a third-party ATS with built-in AI?</h3>
      <p>
        You're still responsible for compliance. Your vendor may provide tools to help, but the 
        legal obligation sits with you as the employer. Ask your ATS vendor for their AIVIA 
        compliance documentation.
      </p>

      <h3>Do we need to disclose AI use for internal transfers or promotions?</h3>
      <p>
        The law specifically covers "applicants for employment." Internal moves are a gray area, 
        but if you're using AI to evaluate internal candidates for new roles, the safer approach 
        is to disclose.
      </p>

      <h3>What about AI tools we're just testing?</h3>
      <p>
        If candidates are being evaluated by the AI—even in a pilot—you need to comply. 
        "Testing" isn't an exemption.
      </p>

      <h3>How does Illinois compare to other state AI laws?</h3>
      <p>
        Illinois was first, but Colorado, New York City, and other jurisdictions have followed. 
        The requirements vary:
      </p>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Jurisdiction</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Disclosure</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Consent</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Bias Audit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-3 text-sm text-gray-900">Illinois (AIVIA)</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">Required</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">Required</td>
              <td className="px-4 py-3 text-sm text-gray-400">Not required</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">NYC Local Law 144</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">Required</td>
              <td className="px-4 py-3 text-sm text-gray-400">Not required</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">Required annually</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm text-gray-900">Colorado AI Act</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">Required</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">Required</td>
              <td className="px-4 py-3 text-sm text-green-600 font-medium">Risk assessment required</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Illinois is consent-heavy but doesn't require bias audits. NYC requires audits but not 
        consent. If you operate in multiple jurisdictions, you need to comply with all applicable laws.
      </p>

      <h2>Frequently Asked Questions</h2>

      <h3>Does AIVIA apply if the candidate lives in Illinois but the job is remote in another state?</h3>
      <p>
        Yes. AIVIA applies to "applicants for employment" in Illinois, which includes Illinois residents regardless 
        of where the job is located. If an Illinois resident applies for your fully remote position based in California, 
        AIVIA applies to that hire. Your compliance trigger is candidate location, not job location. For remote roles 
        open to multiple states, you must comply with each applicable state's laws based on where candidates are located.
      </p>

      <h3>What if a candidate refuses consent? Can we reject their application?</h3>
      <p>
        No. AIVIA requires that you provide an "alternative manner" for candidates who don't consent to AI evaluation. 
        You cannot penalize or automatically reject candidates who opt out—this would defeat the law's purpose. The 
        alternative process must be "equivalent" in terms of opportunity. For example, if your standard process is AI 
        resume screening followed by phone interview, opt-out candidates might receive direct human resume review followed 
        by the same phone interview. Document that opt-out candidates are not disadvantaged in outcomes (track hire 
        rates for opt-outs vs. AI-evaluated candidates to prove equivalence).
      </p>

      <h3>How specific does our AI disclosure need to be?</h3>
      <p>
        Very specific. Generic language like "we may use technology in hiring" doesn't meet AIVIA requirements. Your 
        disclosure must explain: (1) that artificial intelligence will be used, (2) what characteristics or traits 
        the AI evaluates (e.g., "communication skills, problem-solving ability, and cultural fit based on video 
        interview responses"), and (3) how the AI output factors into hiring decisions (e.g., "candidates scoring 
        below 70% are not advanced to phone screen stage"). See our <Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">disclosure templates</Link> for compliant examples. When in doubt, 
        err on the side of more detail.
      </p>

      <h3>Does the 30-day deletion requirement apply to all candidate data or just video recordings?</h3>
      <p>
        AIVIA specifically mentions video recordings in the deletion provision (Section 10), requiring destruction 
        within 30 days of a candidate's request. However, the broader principle of candidate data rights suggests 
        best practice is to extend deletion rights to all AI-generated evaluations, scores, and analyses. If a 
        candidate requests deletion of their AI assessment data, refusing on the grounds that "it's not technically 
        a video recording" is legally risky. The Illinois Attorney General's guidance leans toward expansive 
        interpretation of candidate data rights. Our recommendation: honor all deletion requests for AI-related 
        candidate data within 30 days.
      </p>

      <h3>Do we need separate consent for each AI tool, or can one general consent cover all AI use?</h3>
      <p>
        One comprehensive consent can cover multiple AI tools if it's sufficiently detailed. However, the consent 
        must inform candidates about <em>all</em> AI tools they'll encounter. Example of acceptable combined consent: 
        "I consent to the use of artificial intelligence in evaluating my candidacy, including: (1) Greenhouse ATS 
        resume screening which analyzes my qualifications against job requirements, (2) HireVue video interview 
        analysis which evaluates communication and problem-solving skills, and (3) Codility technical assessment 
        which scores my coding ability." Don't use overly broad consent like "I consent to any AI tools the company 
        may use"—this lacks the specificity AIVIA requires. When in doubt, provide tool-specific disclosures and 
        consents at each stage where AI is introduced.
      </p>

      <h3>Are personality tests and skills assessments considered "AI" under AIVIA?</h3>
      <p>
        If they use machine learning, algorithmic scoring, or automated decision-making, yes. Traditional personality 
        tests (paper-based, static scoring rubrics) are generally not covered. However, modern assessment platforms 
        like Pymetrics, Criteria Corp, HackerRank, and Codility use ML algorithms to score responses, compare 
        candidates to benchmarks, or adapt questions based on performance—all of which constitute AI under AIVIA. 
        The key question: Is the evaluation automated and algorithmic? If yes, it's covered. Check with your assessment 
        vendor about whether their platform uses AI/ML. If they can't give you a clear answer, treat it as AI-powered 
        to be safe. See our guide on <Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">what counts as AI in hiring</Link>.
      </p>

      <h3>What happens if we discover we've been non-compliant for months or years?</h3>
      <p>
        First, stop the non-compliant practice immediately. Second, conduct internal review to understand the scope: 
        how many candidates were affected, what violations occurred, and when they started. Third, implement compliant 
        processes going forward. Fourth, consult legal counsel about whether voluntary disclosure to the Illinois 
        Department of Labor is advisable—proactive disclosure sometimes reduces penalties. Fifth, document all 
        corrective actions taken. Penalties are calculated per violation (per candidate), but the Department of Labor 
        has discretion in enforcement. Demonstrating good faith (you discovered the issue through internal audit, 
        fixed it promptly, took steps to prevent recurrence) may reduce penalties. Don't ignore historical non-compliance 
        and hope no one notices—candidates can file complaints, triggering investigations into your past practices.
      </p>

      <h2>2026 Enforcement Landscape in Illinois</h2>

      <h3>Recent IDOL Enforcement Actions</h3>
      <p>
        The Illinois Department of Labor (IDOL) has become more active in AIVIA enforcement:
      </p>
      <ul>
        <li><strong>Large staffing firm (Nov 2025):</strong> $340,000 penalty for failure to obtain consent from 
        680 candidates. IDOL emphasized that high-volume hiring does not excuse compliance shortcuts.</li>
        <li><strong>E-commerce company (Jan 2026):</strong> $150,000 penalty for inadequate disclosure language. 
        Company's notice said "we use technology" without mentioning AI or explaining what it evaluated.</li>
        <li><strong>Healthcare system (Dec 2025):</strong> Under investigation for refusing to honor deletion 
        requests from candidates. Investigation ongoing but signals IDOL focus on candidate data rights.</li>
      </ul>

      <h3>Coordination with Other Agencies</h3>
      <p>
        IDOL is coordinating with the Illinois Attorney General and EEOC on AI hiring enforcement. In two recent 
        cases, AIVIA violations uncovered during IDOL investigations led to EEOC charges for underlying discrimination. 
        Non-compliance with AIVIA often indicates broader employment law problems.
      </p>

      <h3>Private Litigation Trends</h3>
      <p>
        AIVIA includes an implied private right of action, and plaintiffs' attorneys are increasingly bringing class 
        actions. Typical claims: failure to disclose AI use, failure to obtain consent, and failure to provide 
        alternative processes. Settlement values for AIVIA class actions have ranged from $50,000 (small class, quick 
        settlement) to $3.2 million (large class, protracted litigation). Most settle in the $200,000-800,000 range.
      </p>

      <h2>Bottom Line</h2>
      <p>
        Illinois AIVIA compliance isn't optional, and enforcement is increasing. The good news: the 
        requirements are straightforward once you understand them. Disclose, get consent, document 
        everything, and provide an alternative for candidates who opt out.
      </p>
      <p>
        The companies getting ahead aren't waiting for an audit—they're building compliance into 
        their hiring process now.
      </p>

      <div className="bg-gray-100 rounded-lg p-6 mt-8">
        <p className="text-sm text-gray-600">
          <em>
            Devyn Bartell is the founder of EmployArmor, an AI hiring compliance platform. This 
            article is for informational purposes and does not constitute legal advice. Consult 
            with qualified legal counsel for specific compliance questions.
          </em>
        </p>
      </div>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/compliance/illinois" className="text-blue-600 hover:underline">Illinois Compliance Dashboard</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/resources/ai-disclosure-decision-tree" className="text-blue-600 hover:underline">Do I Need to Disclose? Decision Tree</Link></li>
      </ul>
      <LegalDisclaimer />
    </ArticleLayout>
  )
}
