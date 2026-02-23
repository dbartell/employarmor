{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "HireVue Compliance Guide: AI Video Interview Regulations 2026 | EmployArmor",
  description: "Complete guide to HireVue compliance requirements. Understand AI video interview regulations, bias audit obligations, state laws, and what employers using HireVue must do in 2026.",
}

export default function HireVueCompliancePage() {
  return (
    <ArticleLayout
      title="HireVue Compliance Guide: AI Video Interview Regulations"
      description="HireVue's AI-powered video interviewing platform is used by thousands of employers—but it comes with significant compliance obligations. This comprehensive guide covers everything you need to know to use HireVue legally in 2026."
      category="Tool Compliance"
      readTime="16 min read"
      publishedDate="February 25, 2026"
    >
      <AuthorByline publishDate="2026-02-25" />

      <p>
        HireVue is one of the most widely adopted AI hiring tools in the world, used by over 1,000 companies including 
        30% of the Fortune 100. Its video interview platform uses artificial intelligence to analyze candidate responses, 
        facial expressions, voice patterns, and word choice—and that's exactly why it's subject to some of the strictest 
        AI hiring regulations in existence.
      </p>

      <p>
        If you're using HireVue (or considering it), understanding your compliance obligations isn't optional. This guide 
        breaks down the specific requirements, state-by-state variations, bias audit history, and practical implementation steps.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">What You'll Learn:</p>
        <ul className="text-blue-800 space-y-1">
          <li>✓ How HireVue's AI actually works and what it analyzes</li>
          <li>✓ Which state laws apply to HireVue deployments</li>
          <li>✓ HireVue's bias audit history and public results</li>
          <li>✓ Required disclosures and consent processes</li>
          <li>✓ Step-by-step compliance implementation</li>
          <li>✓ Risk areas and recent litigation</li>
        </ul>
      </div>

      <h2>Understanding HireVue's AI Technology</h2>

      <p>
        Before diving into compliance requirements, it's critical to understand what HireVue's AI actually does—because 
        that determines which regulations apply to your use of the platform.
      </p>

      <h3>What HireVue Analyzes</h3>

      <p>HireVue's AI-powered assessments evaluate candidates across multiple dimensions:</p>

      <ul>
        <li><strong>Verbal content:</strong> What candidates say—word choice, vocabulary complexity, response structure</li>
        <li><strong>Voice characteristics:</strong> Tone, pitch, speaking rate, pauses, and vocal patterns</li>
        <li><strong>Video analysis (historical):</strong> Facial expressions, eye contact, and visual cues (largely discontinued in 2021)</li>
        <li><strong>Behavioral indicators:</strong> Problem-solving approaches, communication style, competency demonstrations</li>
      </ul>

      <p>
        The platform uses <strong>machine learning algorithms trained on historical candidate data</strong> to predict 
        job performance. It scores candidates based on how closely their responses match patterns of previously successful 
        employees in similar roles.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">Important Context: The Facial Analysis Pivot</p>
        <p className="text-amber-700">
          In January 2021, HireVue announced it would discontinue visual analysis of facial expressions and movements 
          following criticism from advocacy groups. However, the platform still analyzes voice and verbal content—which 
          remains subject to AI hiring regulations. Employers using HireVue before 2021 may have legacy data collected 
          under the old system.
        </p>
      </div>

      <h3>How AI Scoring Works</h3>

      <p>When a candidate completes a HireVue video interview:</p>

      <ol>
        <li>The AI transcribes spoken responses</li>
        <li>Natural language processing analyzes word choice, sentence structure, and content relevance</li>
        <li>Audio processing evaluates voice characteristics</li>
        <li>Algorithms compare responses to "success profiles" built from historical data</li>
        <li>The system generates competency scores for specific traits (e.g., communication, problem-solving, leadership)</li>
        <li>Candidates are ranked or categorized based on predicted performance</li>
      </ol>

      <p>
        This automated scoring is what makes HireVue an <strong>"Automated Employment Decision Tool" (AEDT)</strong> 
        under NYC Local Law 144 and similar statutes—triggering strict compliance requirements.
      </p>

      <h2>State and Local Laws Governing HireVue Use</h2>

      <p>
        HireVue deployments are subject to multiple overlapping regulations depending on where candidates are located. 
        Here's the jurisdictional breakdown:
      </p>

      <h3>Illinois: The Gold Standard for Video Interview AI</h3>

      <p>
        Illinois was the first state to regulate AI video interviews with the <strong>Artificial Intelligence Video 
        Interview Act (AIVIA - 820 ILCS 42)</strong>, effective January 1, 2020.
      </p>

      <p><strong>What AIVIA Requires for HireVue:</strong></p>

      <ul>
        <li><strong>Pre-use disclosure:</strong> Before conducting any AI video interview, employers must notify candidates 
        that AI will be used to analyze their interview</li>
        <li><strong>Explanation requirement:</strong> The notice must explain how the AI works and what characteristics 
        it evaluates</li>
        <li><strong>Explicit consent:</strong> Candidates must affirmatively consent to the AI analysis before proceeding</li>
        <li><strong>No sharing:</strong> Video interviews and AI analysis cannot be shared with third parties (with limited exceptions)</li>
        <li><strong>Deletion rights:</strong> Candidates can request deletion of their interview recording and AI data 
        within 30 days; employers must comply within 30 days of the request</li>
      </ul>

      <p><strong>Penalties:</strong> $500 for first violation, $1,000 for subsequent violations (per candidate)</p>

      <p>
        AIVIA was expanded via <strong>HB 3773 in 2024</strong>, adding requirements for alternative evaluation 
        processes and enhanced transparency about AI decision-making.
      </p>

      <h3>New York City: Bias Audit Requirements</h3>

      <p>
        NYC Local Law 144 (effective July 2023) requires <strong>annual bias audits</strong> for automated employment 
        decision tools—which explicitly includes HireVue's AI scoring system.
      </p>

      <p><strong>Requirements:</strong></p>

      <ul>
        <li><strong>Annual independent bias audit:</strong> Conducted by external auditor analyzing selection rates 
        by race, ethnicity, sex, and intersectional categories</li>
        <li><strong>Public posting:</strong> Audit results must be published on a publicly accessible website</li>
        <li><strong>Disclosure timing:</strong> Candidates must be notified at least 10 days before HireVue is used</li>
        <li><strong>Alternative process:</strong> Employers must offer candidates an opt-out with human-only evaluation</li>
        <li><strong>Data retention notice:</strong> Publication of what data is collected and how long it's retained</li>
      </ul>

      <p>
        HireVue itself has published <strong>NYC LL144-compliant bias audit results</strong> conducted by DCI Consulting 
        Group, which employers can reference—but employers remain independently responsible for their specific deployment 
        and use cases.
      </p>

      <h3>Maryland: Facial Recognition Consent</h3>

      <p>
        Maryland's <strong>HB 1202</strong> (effective October 2020) requires written consent before using facial 
        recognition technology in job interviews.
      </p>

      <p>
        <strong>Impact on HireVue:</strong> While HireVue discontinued facial analysis in 2021, employers who used 
        the platform before that date may have historical compliance obligations. Current HireVue deployments that only 
        analyze audio/text are not subject to Maryland's facial recognition law—but employers should document that facial 
        analysis is disabled.
      </p>

      <h3>California: Emerging Requirements</h3>

      <p>
        California's <strong>AB 2930</strong> (effective January 1, 2026) imposes broad AI hiring compliance requirements:
      </p>

      <ul>
        <li>Pre-deployment disclosure to candidates</li>
        <li>Annual bias testing and reporting</li>
        <li>Data minimization requirements</li>
        <li>Right to human review of automated decisions</li>
      </ul>

      <p>
        California enforcement is still ramping up, but the Attorney General has signaled that video interview AI 
        platforms are a priority enforcement area.
      </p>

      <h3>Colorado: Impact Assessments Required</h3>

      <p>
        Colorado's <strong>AI Act (HB 24-1278)</strong>, effective February 1, 2026, classifies AI hiring tools as 
        "high-risk systems" requiring:
      </p>

      <ul>
        <li>Algorithmic impact assessment before deployment</li>
        <li>Disclosure to candidates and employees</li>
        <li>Opt-out rights with alternative evaluation</li>
        <li>Human review of AI-generated decisions</li>
        <li>Annual algorithmic accountability reporting</li>
      </ul>

      <h3>Multi-State Compliance Strategy</h3>

      <p>
        If you hire across multiple states, you must comply with <em>all applicable laws simultaneously</em>. 
        Best practice: build to the highest standard (Illinois consent + NYC bias audits + Colorado impact assessments) 
        to achieve comprehensive coverage.
      </p>

      <h2>HireVue's Bias Audit History</h2>

      <p>
        HireVue has been more transparent than most AI hiring vendors about bias testing, but that transparency has 
        also exposed challenges.
      </p>

      <h3>Published Audits and Results</h3>

      <p>
        In 2023, HireVue engaged <strong>DCI Consulting Group</strong> to conduct an independent bias audit for 
        NYC LL144 compliance. Key findings:
      </p>

      <ul>
        <li>Analysis of selection rates across race, ethnicity, and sex categories</li>
        <li>Impact ratios calculated for multiple job families and levels</li>
        <li>Some statistically significant disparities identified in certain job categories</li>
        <li>Recommendations for ongoing monitoring and algorithm refinement</li>
      </ul>

      <p>
        HireVue has also worked with <strong>ORCAA</strong> and <strong>Landers Workforce Science LLC</strong> 
        for additional validation studies focused on predictive validity and adverse impact analysis.
      </p>

      <h3>Documented Concerns</h3>

      <p>Despite HireVue's compliance efforts, concerns persist:</p>

      <ul>
        <li><strong>Disability discrimination:</strong> In March 2025, the ACLU filed an EEOC complaint alleging 
        that HireVue's audio analysis discriminates against deaf and hard-of-hearing candidates</li>
        <li><strong>Cultural bias:</strong> Critics note that voice and language analysis may disadvantage non-native 
        English speakers and candidates from different cultural backgrounds</li>
        <li><strong>Opacity:</strong> Despite published audits, the underlying algorithms remain proprietary, making 
        independent verification difficult</li>
      </ul>

      <h2>Required Disclosures: What to Tell Candidates</h2>

      <p>Compliant HireVue disclosure must include:</p>

      <h3>Minimum Disclosure Elements</h3>

      <ul>
        <li>✓ That HireVue (or "AI video interview technology") will be used</li>
        <li>✓ What the AI analyzes (voice, word choice, response content)</li>
        <li>✓ How AI scores influence hiring decisions (e.g., "used to rank candidates for interviews")</li>
        <li>✓ Data collected and retention period</li>
        <li>✓ Option to opt out and request human-only review</li>
        <li>✓ Deletion rights (where applicable, e.g., Illinois)</li>
        <li>✓ Contact information for questions or accommodations</li>
      </ul>

      <h3>Sample HireVue Disclosure Language</h3>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="font-semibold mb-2">AI Video Interview Notice</p>
        <p className="text-sm">
          As part of our hiring process, [Company] uses HireVue, an artificial intelligence-powered video interview 
          platform. HireVue's AI technology analyzes your video interview responses, including the content of your 
          answers, your word choice, and voice characteristics such as tone and speaking pace.
        </p>
        <p className="text-sm mt-2">
          The AI generates scores for specific competencies (e.g., communication skills, problem-solving ability) 
          based on how your responses compare to patterns from successful employees in similar roles. These scores 
          are used by our hiring team to rank candidates and determine who advances to the next stage of our process.
        </p>
        <p className="text-sm mt-2">
          <strong>You have the right to:</strong>
        </p>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Request an alternative evaluation process that does not use AI (contact [email])</li>
          <li>• Request deletion of your video recording and AI analysis (Illinois candidates only)</li>
          <li>• Request accommodations if you have a disability that may affect AI evaluation</li>
        </ul>
        <p className="text-sm mt-2">
          We retain video recordings and AI data for [X] months. Your consent to this AI analysis is required to 
          proceed with this interview. By clicking "I Agree" below, you consent to the use of AI as described above.
        </p>
        <p className="text-sm mt-2">
          For questions or to exercise your rights, contact [email] or [phone number].
        </p>
      </blockquote>

      <h3>Timing of Disclosure</h3>

      <p>When disclosure must occur varies by jurisdiction:</p>

      <ul>
        <li><strong>Illinois:</strong> Before the candidate begins the AI video interview</li>
        <li><strong>NYC:</strong> At least 10 days before HireVue is used</li>
        <li><strong>Colorado:</strong> At or before data collection</li>
        <li><strong>California:</strong> Before application submission</li>
      </ul>

      <p>
        <strong>Best practice:</strong> Include disclosure in the job posting and send a dedicated notice via email 
        before scheduling the HireVue interview—this covers all timing requirements.
      </p>

      <h2>Step-by-Step Compliance Implementation</h2>

      <p>Here's how to deploy HireVue compliantly:</p>

      <h3>Phase 1: Pre-Deployment (Before Using HireVue)</h3>

      <p><strong>1. Conduct jurisdictional analysis</strong></p>
      <ul>
        <li>Identify states/cities where you'll be hiring</li>
        <li>Map applicable AI hiring laws</li>
        <li>Determine overlapping requirements</li>
      </ul>

      <p><strong>2. Obtain HireVue compliance documentation</strong></p>
      <ul>
        <li>Request bias audit results from HireVue</li>
        <li>Review validation studies and technical documentation</li>
        <li>Verify NYC LL144 compliance status</li>
        <li>Confirm that facial analysis is disabled (if required)</li>
      </ul>

      <p><strong>3. Draft disclosure notices and consent forms</strong></p>
      <ul>
        <li>Create jurisdiction-specific disclosure language</li>
        <li>Build consent capture mechanism (checkboxes, signed forms)</li>
        <li>Prepare alternative evaluation process documentation</li>
      </ul>

      <h3>Phase 2: Deployment Configuration</h3>

      <p><strong>4. Configure HireVue settings</strong></p>
      <ul>
        <li>Disable facial analysis features (if applicable)</li>
        <li>Set data retention periods per jurisdiction requirements</li>
        <li>Configure candidate notification workflows</li>
        <li>Enable deletion request processing</li>
      </ul>

      <p><strong>5. Create alternative evaluation process</strong></p>
      <ul>
        <li>Define how candidates who opt out will be evaluated (e.g., phone screen, in-person interview)</li>
        <li>Train hiring team on executing alternative process</li>
        <li>Document that opt-outs will not be penalized</li>
      </ul>

      <h3>Phase 3: Ongoing Compliance</h3>

      <p><strong>6. Implement disclosure workflow</strong></p>
      <ul>
        <li>Add HireVue disclosure to job postings</li>
        <li>Send dedicated notice email before scheduling interviews</li>
        <li>Capture and log consent before interview access</li>
        <li>Provide contact information for questions/accommodations</li>
      </ul>

      <p><strong>7. Handle candidate requests</strong></p>
      <ul>
        <li>Process opt-out requests within required timeframes</li>
        <li>Execute deletion requests (Illinois: within 30 days)</li>
        <li>Provide accommodations for candidates with disabilities</li>
        <li>Maintain audit trail of all requests and actions taken</li>
      </ul>

      <p><strong>8. Monitor and audit</strong></p>
      <ul>
        <li>Track HireVue usage and candidate outcomes by demographic category</li>
        <li>Conduct or commission bias audits (annual for NYC, recommended for all)</li>
        <li>Review HireVue algorithm updates and assess impact</li>
        <li>Update policies as new regulations emerge</li>
      </ul>

      <h2>Common Compliance Pitfalls</h2>

      <h3>❌ Pitfall 1: Generic "We Use AI" Disclosure</h3>
      <p>
        <strong>The problem:</strong> Many employers use vague language like "we may use technology in hiring." 
        That doesn't meet the specificity requirements of AIVIA or LL144.
      </p>
      <p>
        <strong>The fix:</strong> Explicitly name HireVue, explain what it analyzes, and describe how it affects decisions.
      </p>

      <h3>❌ Pitfall 2: No Real Alternative Process</h3>
      <p>
        <strong>The problem:</strong> Employers say "contact us to opt out" but haven't defined what the alternative 
        evaluation looks like—or worse, they make it so burdensome that candidates don't opt out.
      </p>
      <p>
        <strong>The fix:</strong> Design a comparable alternative (e.g., live phone interview) and train recruiters 
        on execution. Document that opt-outs are not disadvantaged.
      </p>

      <h3>❌ Pitfall 3: Ignoring Disability Accommodations</h3>
      <p>
        <strong>The problem:</strong> HireVue's audio/voice analysis can disadvantage candidates with speech 
        disabilities, hearing impairments, or conditions affecting communication.
      </p>
      <p>
        <strong>The fix:</strong> Proactively offer accommodations. Consider disabling AI scoring for candidates 
        who request accommodations and using human-only review.
      </p>

      <h3>❌ Pitfall 4: Assuming HireVue's Audit Covers You</h3>
      <p>
        <strong>The problem:</strong> HireVue publishes bias audit results, but those audits may not reflect 
        <em>your specific implementation, job categories, or candidate pool</em>.
      </p>
      <p>
        <strong>The fix:</strong> Conduct your own adverse impact analysis using your hiring data. HireVue's audits 
        are helpful but not a substitute for employer-specific validation.
      </p>

      <h3>❌ Pitfall 5: Legacy Facial Analysis Data</h3>
      <p>
        <strong>The problem:</strong> If you used HireVue before 2021 when facial analysis was active, you may 
        have historical candidate data subject to stricter requirements.
      </p>
      <p>
        <strong>The fix:</strong> Audit your HireVue data retention. Consider purging pre-2021 data or ensuring 
        it's not used in current decision-making.
      </p>

      <h2>Risk Areas and Recent Litigation</h2>

      <h3>ACLU Disability Discrimination Complaint (2025)</h3>

      <p>
        In March 2025, the ACLU filed an EEOC complaint on behalf of a deaf candidate who alleged that HireVue's 
        audio analysis inherently discriminates against candidates who cannot speak or have speech disabilities.
      </p>

      <p><strong>Key allegations:</strong></p>
      <ul>
        <li>HireVue's AI relies on voice characteristics (tone, pace, pitch) that deaf candidates cannot produce</li>
        <li>Even with captions/transcription, the audio AI still penalizes non-vocal communication</li>
        <li>Employer failed to offer meaningful accommodation (e.g., text-based interview without audio AI)</li>
      </ul>

      <p>
        HireVue disputed the complaint, noting that accommodations can be provided and AI scoring can be disabled 
        on a case-by-case basis. However, the complaint highlights a critical compliance risk: <strong>employers 
        must proactively assess whether HireVue's AI creates barriers for candidates with disabilities</strong>.
      </p>

      <h3>Class Action Exposure</h3>

      <p>
        Several class action lawsuits are pending against employers alleging:
      </p>

      <ul>
        <li>Failure to obtain AIVIA consent (Illinois)</li>
        <li>Inadequate disclosure of AI use</li>
        <li>Refusal to honor deletion requests</li>
        <li>Discrimination via biased AI algorithms</li>
      </ul>

      <p>
        Settlement values have ranged from <strong>$50,000 to $2+ million</strong> depending on class size and 
        violation severity.
      </p>

      <h2>HireVue Alternatives and Mitigation</h2>

      <p>
        If HireVue's compliance burden or risk profile is too high for your organization, consider:
      </p>

      <h3>Alternative Tools</h3>

      <ul>
        <li><strong>Asynchronous video without AI:</strong> Tools like Spark Hire or Modern Hire (in non-AI mode) 
        allow video interviews without automated scoring</li>
        <li><strong>Structured interviews with scorecards:</strong> Human-driven evaluation using standardized 
        questions and rubrics</li>
        <li><strong>Skills-based assessments:</strong> Work sample tests or simulations that don't rely on AI analysis</li>
      </ul>

      <h3>Risk Mitigation Strategies</h3>

      <p>If you choose to continue using HireVue:</p>

      <ul>
        <li><strong>Limit to early screening only:</strong> Use HireVue for initial candidate narrowing, but rely 
        on human interviews for final decisions</li>
        <li><strong>Human override process:</strong> Allow recruiters to advance candidates who scored poorly on 
        HireVue if there's contextual justification</li>
        <li><strong>Periodic validation:</strong> Conduct annual adverse impact analysis on your actual hiring 
        outcomes, not just HireVue's generic audit</li>
        <li><strong>Enhanced accommodations:</strong> Default to human-only review for any candidate who requests 
        accommodation or expresses concern about AI</li>
      </ul>

      <h2>How EmployArmor Helps with HireVue Compliance</h2>

      <p>
        Managing HireVue compliance across multiple jurisdictions is complex. EmployArmor simplifies it by:
      </p>

      <ul>
        <li><strong>Automated disclosure generation:</strong> Jurisdiction-specific HireVue notices that meet 
        all state and local requirements</li>
        <li><strong>Consent tracking:</strong> Capture, log, and retain candidate consent with full audit trail</li>
        <li><strong>Deletion request workflow:</strong> Automated processing of Illinois AIVIA deletion requests</li>
        <li><strong>Alternative process templates:</strong> Pre-built workflows for opt-out candidates</li>
        <li><strong>Bias monitoring:</strong> Track HireVue outcomes by demographic category with automated 
        adverse impact alerts</li>
        <li><strong>Vendor audit management:</strong> Centralized repository for HireVue compliance documentation</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Using HireVue? Get Compliant.</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Assess Your HireVue Compliance Risk →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Do we need consent for every candidate who uses HireVue?</h3>
      <p>
        <strong>Illinois:</strong> Yes, explicit affirmative consent is required. <strong>Other states:</strong> 
        Disclosure is required; implicit consent (proceeding after notice) may suffice, but best practice is to 
        obtain explicit consent universally.
      </p>

      <h3>Can we use HireVue for internal promotions?</h3>
      <p>
        Yes, but many laws (including NYC LL144) apply to both hiring <em>and</em> promotion decisions. The same 
        disclosure, audit, and alternative process requirements apply.
      </p>

      <h3>What if a candidate requests deletion of their HireVue interview?</h3>
      <p>
        <strong>Illinois:</strong> You must delete the recording and AI data within 30 days. <strong>Other states:</strong> 
        No statutory requirement (yet), but consider honoring requests as a best practice to reduce data liability.
      </p>

      <h3>Are we liable if HireVue's algorithm is biased?</h3>
      <p>
        Yes. Employer liability for vendor AI tools is well-established under Title VII and EEOC guidance. 
        "The vendor said it was compliant" is not a legal defense. You must conduct your own due diligence and 
        validation.
      </p>

      <h3>Can we require candidates to use HireVue or lose consideration?</h3>
      <p>
        Not in jurisdictions requiring alternative processes (NYC, Colorado, California). Candidates must be able 
        to opt out without penalty. Even where not legally required, forcing HireVue use creates ADA accommodation 
        risk.
      </p>

      <h2>Conclusion: Compliance is Non-Negotiable</h2>

      <p>
        HireVue offers powerful efficiency gains—but only if used compliantly. With 17+ states regulating AI hiring 
        and enforcement ramping up in 2026, the cost of non-compliance (litigation, fines, reputational damage) far 
        exceeds the investment in proper implementation.
      </p>

      <p>
        The employers succeeding with HireVue are those treating compliance as a competitive advantage: building 
        trust with candidates, demonstrating responsible AI use, and proactively addressing bias concerns.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/ai-bias-audit-guide" className="text-blue-600 hover:underline">Do I Need an AI Bias Audit?</Link></li>
        <li><Link href="/resources/illinois-aivia-compliance-guide" className="text-blue-600 hover:underline">Illinois AIVIA Compliance Guide</Link></li>
        <li><Link href="/resources/workday-ai-compliance" className="text-blue-600 hover:underline">Workday AI Compliance Guide</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
