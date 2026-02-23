import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export default function ColoradoAIActPage() {
  return (
    <ArticleLayout
      title="Colorado AI Act (SB24-205): Complete Employer Compliance Guide"
      description="Colorado's AI Act creates nation-leading requirements for high-risk AI in employment. Impact assessments, consumer notifications, opt-outs, and risk management explained with implementation guidance."
      category="State Law"
      readTime="13 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        Colorado Senate Bill 24-205, enacted in May 2024 and effective February 1, 2026, establishes one of the most 
        comprehensive AI regulatory frameworks in the United States. The law takes a risk-based approach, imposing 
        strict requirements on "high-risk artificial intelligence systems" that make or substantially assist consequential 
        decisions—including all employment and hiring decisions.
      </p>

      <p>
        For employers using AI in hiring, promotion, termination, or compensation decisions affecting Colorado residents, 
        SB24-205 creates mandatory impact assessments, consumer notification requirements, opt-out rights, appeal processes, 
        and substantial penalties for non-compliance enforced by Colorado Attorney General Phil Weiser.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Key Dates & Enforcement</p>
        <ul className="text-blue-800 space-y-1">
          <li><strong>Enacted:</strong> May 17, 2024</li>
          <li><strong>Effective Date:</strong> February 1, 2026</li>
          <li><strong>Rulemaking Period:</strong> Ongoing through January 2026</li>
          <li><strong>Enforced By:</strong> Colorado Attorney General Phil Weiser</li>
          <li><strong>Penalties:</strong> Up to $20,000 per violation</li>
          <li><strong>Cure Period:</strong> 60 days after notice of violation (before penalties imposed)</li>
        </ul>
      </div>

      <h2>Understanding "High-Risk" AI Systems for Employment</h2>

      <p>
        SB24-205 defines a high-risk AI system as any artificial intelligence system that, when deployed, makes or is 
        a substantial factor in making a consequential decision. Employment decisions are explicitly enumerated as 
        consequential decisions under the law.
      </p>

      <h3>Employment Decisions Covered</h3>

      <p>
        Under Colorado law, the following employment actions are consequential decisions subject to high-risk AI regulations:
      </p>

      <ul>
        <li><strong>Hiring and recruitment:</strong> Resume screening, candidate ranking, video interview analysis, 
        skills assessments that influence hiring decisions</li>
        <li><strong>Promotions and advancement:</strong> Performance evaluation systems, succession planning algorithms, 
        internal mobility recommendations</li>
        <li><strong>Demotions and terminations:</strong> Performance scoring systems that lead to termination, 
        automated flagging for corrective action</li>
        <li><strong>Compensation decisions:</strong> Algorithmic salary determination, bonus calculations, pay equity 
        analysis that influences compensation</li>
        <li><strong>Benefits allocation:</strong> AI systems determining benefit eligibility or allocation</li>
        <li><strong>Performance monitoring:</strong> Productivity tracking systems that substantially influence 
        management decisions</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Common Misconception</p>
        <p className="text-orange-700">
          "Our AI only makes recommendations; humans make the final decisions, so we're not covered." <strong>Wrong.</strong> 
          If AI is a "substantial factor" in the decision—even if a human has final authority—the law applies. If your 
          recruiter relies on AI to narrow 500 applicants to 20, that AI is a substantial factor and is covered.
        </p>
      </div>

      <h2>Core Compliance Requirements</h2>

      <h3>1. Impact Assessments (§ 6-1-1306)</h3>

      <p>
        Before deploying a high-risk AI system for employment decisions, deployers (employers) must complete a 
        comprehensive impact assessment. This is not optional—it's a legal prerequisite to deployment.
      </p>

      <p><strong>Required Elements of an Impact Assessment:</strong></p>

      <ul>
        <li><strong>System identification:</strong> Name, version, vendor, developer, and purpose of the AI system</li>
        <li><strong>Intended use and benefits:</strong> What employment decisions the AI supports and expected benefits 
        (efficiency, consistency, reduced bias)</li>
        <li><strong>Data inventory:</strong> Categories of data collected and processed, data sources, data retention 
        periods, and data protection measures</li>
        <li><strong>Algorithmic discrimination analysis:</strong> Known or reasonably foreseeable risks that the AI 
        may result in algorithmic discrimination based on protected characteristics (race, sex, age, disability, etc.)</li>
        <li><strong>Mitigation measures:</strong> Specific steps taken to mitigate identified risks, including technical 
        safeguards, human oversight, and bias testing</li>
        <li><strong>Transparency mechanisms:</strong> How consumers will be informed about AI use and how they can 
        exercise their rights</li>
        <li><strong>Post-deployment monitoring:</strong> Procedures for ongoing monitoring of AI performance and 
        discrimination metrics</li>
        <li><strong>Consumer feedback:</strong> How consumer feedback and complaints will be received and addressed</li>
      </ul>

      <p><strong>Update Requirements:</strong></p>
      <ul>
        <li>Impact assessments must be reviewed and updated at least annually</li>
        <li>Updates required whenever there are material changes to the AI system (model updates, new data sources, 
        changes to decision criteria)</li>
        <li>Updates required if post-deployment monitoring reveals previously unknown risks</li>
      </ul>

      <p><strong>Documentation and Submission:</strong></p>
      <ul>
        <li>Impact assessments must be documented in writing and retained for at least 3 years</li>
        <li>Deployers must make impact assessments available to the Attorney General upon request</li>
        <li>The Attorney General may request assessments as part of investigations or proactive oversight</li>
      </ul>

      <h3>2. Consumer Notifications (§ 6-1-1307)</h3>

      <p>
        Before a high-risk AI system is used to make a consequential decision about a Colorado consumer (including 
        job applicants), the deployer must provide clear and conspicuous notice.
      </p>

      <p><strong>Required Notice Elements:</strong></p>

      <ul>
        <li><strong>AI use disclosure:</strong> Clear statement that an automated decision system or AI is being used</li>
        <li><strong>Purpose statement:</strong> Explanation of the purpose of the AI system and what it evaluates</li>
        <li><strong>Decision type:</strong> Description of the type of consequential decision being made (hiring, 
        promotion, etc.)</li>
        <li><strong>Contact information:</strong> How consumers can contact the deployer with questions or concerns 
        about AI use</li>
        <li><strong>Rights information:</strong> Notice of consumer rights including appeal, data correction, and 
        (where applicable) opt-out rights</li>
      </ul>

      <p><strong>Notice Timing and Method:</strong></p>
      <ul>
        <li>Notice must be provided <em>before</em> the AI system is used to make or substantially contribute to a decision</li>
        <li>For hiring, best practice is to include notice in job postings or at application initiation</li>
        <li>Notice must be "clear and conspicuous"—not buried in lengthy privacy policies or terms of service</li>
        <li>Notice should be provided in plain language accessible to the average consumer</li>
      </ul>

      <h3>3. Statement of Adverse Decision (§ 6-1-1308)</h3>

      <p>
        If a high-risk AI system contributes to an adverse consequential decision (rejection of job application, 
        denial of promotion, termination), the deployer must provide the affected consumer with a statement containing:
      </p>

      <ul>
        <li><strong>AI involvement disclosure:</strong> Notice that a high-risk AI system was used to make or 
        substantially contribute to the decision</li>
        <li><strong>Principal reasons:</strong> The principal factors, inputs, or reasons that led to the adverse decision</li>
        <li><strong>Appeal process:</strong> Information about how to appeal the decision and request human review</li>
        <li><strong>Data correction:</strong> How the consumer can correct any inaccurate personal data that was used</li>
        <li><strong>Contact information:</strong> Who to contact with questions or to exercise rights</li>
      </ul>

      <p><strong>Important:</strong> The statement must be provided in a timely manner—generally within a reasonable 
      time after the decision is made, similar to adverse action notice requirements under the Fair Credit Reporting Act.</p>

      <h3>4. Risk Management Policy and Procedures (§ 6-1-1306)</h3>

      <p>
        Deployers must implement and maintain a risk management policy and program governing their use of high-risk 
        AI systems. The policy must:
      </p>

      <ul>
        <li><strong>Identify and mitigate risks:</strong> Establish procedures for identifying, documenting, and 
        mitigating known or reasonably foreseeable risks of algorithmic discrimination</li>
        <li><strong>Human oversight:</strong> Ensure that all consequential decisions involve meaningful human review 
        and that humans have authority to override AI recommendations</li>
        <li><strong>Consumer rights procedures:</strong> Implement processes for consumers to appeal decisions, correct 
        data, and opt out where applicable</li>
        <li><strong>Documentation:</strong> Maintain records of AI system use, decisions made, and mitigation measures</li>
        <li><strong>Training:</strong> Train employees who interact with high-risk AI systems on compliance obligations 
        and bias awareness</li>
        <li><strong>Monitoring:</strong> Conduct ongoing monitoring of AI system performance, including testing for 
        disparate impact and discriminatory outcomes</li>
      </ul>

      <h2>Consumer Rights Under SB24-205</h2>

      <h3>Right to Notice</h3>
      <p>
        Consumers have the right to be informed before AI is used in consequential decisions affecting them. This 
        right is absolute—there are no exceptions for trade secrets or proprietary systems.
      </p>

      <h3>Right to Explanation</h3>
      <p>
        After an adverse decision, consumers have the right to receive a meaningful explanation of the principal reasons 
        for the decision. The explanation must be substantive—not just "AI was used" but what factors led to the outcome.
      </p>

      <h3>Right to Appeal and Human Review</h3>
      <p>
        Consumers can request human review of AI-influenced adverse decisions. The human reviewer must:
      </p>
      <ul>
        <li>Have authority to reverse the AI's recommendation</li>
        <li>Consider information beyond what the AI analyzed</li>
        <li>Apply human judgment and discretion</li>
        <li>Not be bound by the AI's output</li>
      </ul>

      <h3>Right to Correct Data</h3>
      <p>
        If inaccurate data contributed to an adverse decision, consumers have the right to correct that data and 
        request reconsideration of the decision based on accurate information.
      </p>

      <h3>Right to Opt-Out (Limited Circumstances)</h3>
      <p>
        In certain contexts, consumers may opt out of profiling or automated decision-making. For employment, opt-out 
        rights are more limited—employers can demonstrate that automated processing is necessary to complete the hiring 
        process, though human oversight must still be provided.
      </p>

      <h2>Enforcement and Penalties</h2>

      <h3>Enforcement Authority</h3>

      <p>
        The Colorado Attorney General has exclusive authority to enforce SB24-205. Current AG Phil Weiser has signaled 
        that AI regulation is a priority for his office, establishing a dedicated Technology and Data Privacy Unit.
      </p>

      <h3>Penalty Structure</h3>

      <ul>
        <li><strong>Civil penalties:</strong> Up to $20,000 per violation</li>
        <li><strong>Ongoing violations:</strong> Each day of continued non-compliance may constitute a separate violation</li>
        <li><strong>Injunctive relief:</strong> AG can seek court orders requiring deployers to cease using non-compliant AI</li>
        <li><strong>Corrective actions:</strong> Courts may order specific compliance measures, retraining of AI systems, 
        or disclosure of compliance documentation</li>
      </ul>

      <h3>Affirmative Defense (§ 6-1-1310)</h3>

      <p>
        SB24-205 provides a limited affirmative defense if:
      </p>
      <ol>
        <li>The deployer discovers and cures a violation within 90 days of the AG's notice</li>
        <li>The violation was not intentional or reckless</li>
        <li>The deployer provides documentation demonstrating cure</li>
      </ol>

      <p>
        <strong>Limitation:</strong> This defense is available only for the first violation and cannot be used for 
        willful or bad faith violations.
      </p>

      <h3>No Private Right of Action</h3>

      <p>
        Unlike Illinois' BIPA (biometric privacy law), SB24-205 does not create a private right of action—individuals 
        cannot sue directly for violations. Only the Attorney General can bring enforcement actions.
      </p>

      <p>
        <strong>However:</strong> Individuals can still pursue discrimination claims under Colorado's Anti-Discrimination 
        Act (CADA) or federal civil rights laws. SB24-205 violations may serve as evidence in those cases.
      </p>

      <h2>Comparison to Other State AI Laws</h2>

      <table className="w-full my-8 border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-3 text-left">Feature</th>
            <th className="border border-gray-300 p-3 text-left">Colorado</th>
            <th className="border border-gray-300 p-3 text-left">California</th>
            <th className="border border-gray-300 p-3 text-left">Illinois</th>
            <th className="border border-gray-300 p-3 text-left">NYC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-3"><strong>Effective Date</strong></td>
            <td className="border border-gray-300 p-3">Feb 1, 2026</td>
            <td className="border border-gray-300 p-3">Jan 1, 2026</td>
            <td className="border border-gray-300 p-3">Jan 1, 2026</td>
            <td className="border border-gray-300 p-3">Jul 5, 2023</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-3"><strong>Impact Assessment</strong></td>
            <td className="border border-gray-300 p-3">✓ Required</td>
            <td className="border border-gray-300 p-3">✓ Risk assessment</td>
            <td className="border border-gray-300 p-3">✓ Recommended</td>
            <td className="border border-gray-300 p-3">✓ Bias audit</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3"><strong>Pre-Use Notice</strong></td>
            <td className="border border-gray-300 p-3">✓ Required</td>
            <td className="border border-gray-300 p-3">✓ Required</td>
            <td className="border border-gray-300 p-3">✓ Required</td>
            <td className="border border-gray-300 p-3">✓ Required (10 days)</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-3"><strong>Adverse Decision Notice</strong></td>
            <td className="border border-gray-300 p-3">✓ Required</td>
            <td className="border border-gray-300 p-3">Limited</td>
            <td className="border border-gray-300 p-3">–</td>
            <td className="border border-gray-300 p-3">–</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3"><strong>Appeal Rights</strong></td>
            <td className="border border-gray-300 p-3">✓ Human review</td>
            <td className="border border-gray-300 p-3">✓ Opt-out</td>
            <td className="border border-gray-300 p-3">Limited</td>
            <td className="border border-gray-300 p-3">✓ Alternative process</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 p-3"><strong>Penalties</strong></td>
            <td className="border border-gray-300 p-3">$20,000/violation</td>
            <td className="border border-gray-300 p-3">$2,500-$7,500</td>
            <td className="border border-gray-300 p-3">AG enforcement</td>
            <td className="border border-gray-300 p-3">$500-$1,500/day</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-3"><strong>Private Right of Action</strong></td>
            <td className="border border-gray-300 p-3">No</td>
            <td className="border border-gray-300 p-3">Limited (breach)</td>
            <td className="border border-gray-300 p-3">No</td>
            <td className="border border-gray-300 p-3">No</td>
          </tr>
        </tbody>
      </table>

      <p>
        Colorado's approach combines California's risk assessment framework with NYC's emphasis on transparency and 
        consumer rights. It's more prescriptive than California but less technically specific than NYC's bias audit 
        requirements.
      </p>

      <h2>Implementation Roadmap</h2>

      <h3>Phase 1: Assessment (Now – December 2025)</h3>

      <ul>
        <li>☐ Inventory all AI tools used in employment decisions</li>
        <li>☐ Identify which qualify as "high-risk" under Colorado definition</li>
        <li>☐ Determine which positions/candidates are affected (Colorado residents)</li>
        <li>☐ Review vendor contracts for compliance support obligations</li>
        <li>☐ Establish internal compliance team and assign responsibilities</li>
      </ul>

      <h3>Phase 2: Impact Assessments (December 2025 – January 2026)</h3>

      <ul>
        <li>☐ Complete impact assessment for each high-risk AI system</li>
        <li>☐ Conduct or obtain bias testing results</li>
        <li>☐ Document risk mitigation measures</li>
        <li>☐ Obtain vendor cooperation and documentation</li>
        <li>☐ Legal review of impact assessments</li>
      </ul>

      <h3>Phase 3: Policy Development (January 2026)</h3>

      <ul>
        <li>☐ Draft risk management policy</li>
        <li>☐ Create consumer notification templates</li>
        <li>☐ Create adverse decision statement templates</li>
        <li>☐ Establish appeal and human review procedures</li>
        <li>☐ Develop data correction processes</li>
        <li>☐ Create training materials for HR staff</li>
      </ul>

      <h3>Phase 4: Implementation (January 2026)</h3>

      <ul>
        <li>☐ Train HR staff and hiring managers</li>
        <li>☐ Integrate notifications into hiring workflows</li>
        <li>☐ Configure systems to track AI use and consumer rights requests</li>
        <li>☐ Test all processes end-to-end</li>
        <li>☐ Establish monitoring and documentation procedures</li>
      </ul>

      <h3>Phase 5: Ongoing Compliance (Post-February 2026)</h3>

      <ul>
        <li>☐ Annual impact assessment reviews</li>
        <li>☐ Quarterly monitoring of AI outcomes for bias</li>
        <li>☐ Monthly review of consumer rights requests</li>
        <li>☐ Ongoing training refreshers</li>
        <li>☐ Monitor regulatory guidance from Attorney General</li>
      </ul>

      <h2>Sample Impact Assessment Template</h2>

      <div className="bg-gray-50 border rounded-lg p-6 my-8">
        <p className="font-semibold text-gray-900 mb-4">Impact Assessment for [AI System Name]</p>
        
        <p className="font-semibold text-gray-800 mb-2">1. System Identification</p>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>AI System Name: [e.g., HireVue Video Interview Assessment]</li>
          <li>Vendor/Developer: [HireVue, Inc.]</li>
          <li>Version: [3.2.1]</li>
          <li>Deployment Date: [MM/DD/YYYY]</li>
        </ul>

        <p className="font-semibold text-gray-800 mb-2">2. Purpose and Intended Use</p>
        <p className="text-gray-700 mb-4">
          This AI system analyzes video interview responses to evaluate candidate qualifications for [job role]. 
          The system scores candidates based on verbal content, communication skills, and problem-solving approaches 
          to help recruiters identify candidates for in-person interviews.
        </p>

        <p className="font-semibold text-gray-800 mb-2">3. Data Processed</p>
        <ul className="text-gray-700 mb-4 list-disc list-inside">
          <li>Video recordings of candidate responses</li>
          <li>Audio transcripts and speech patterns</li>
          <li>Resume data and application responses</li>
          <li>Assessment question responses</li>
        </ul>

        <p className="font-semibold text-gray-800 mb-2">4. Discrimination Risk Analysis</p>
        <p className="text-gray-700 mb-4">
          Identified risk: Speech pattern analysis may disadvantage candidates with accents or speech impediments. 
          Mitigation: Humans review all AI scores before decisions; candidates can request alternative assessment 
          formats under ADA accommodations.
        </p>

        <p className="font-semibold text-gray-800 mb-2">5. Bias Testing Results</p>
        <p className="text-gray-700 mb-4">
          Annual bias audit conducted December 2025 showed selection rates: [Include specific data by protected category]. 
          No statistically significant disparate impact detected. Results available upon request.
        </p>

        <p className="font-semibold text-gray-800 mb-2">6. Consumer Rights Implementation</p>
        <p className="text-gray-700">
          Candidates notified of AI use in job postings and application confirmations. Adverse decision notices 
          provided within 5 business days. Human review available upon request within 14 days.
        </p>
      </div>

      <h2>Common Compliance Pitfalls</h2>

      <h3>Pitfall #1: Assuming Vendor Compliance = Your Compliance</h3>
      <p>
        Even if your AI vendor is "Colorado compliant," <em>you</em> as the deployer are responsible for conducting 
        impact assessments, providing notifications, and implementing risk management. Vendor support is helpful but 
        doesn't eliminate your obligations.
      </p>

      <h3>Pitfall #2: Incomplete Impact Assessments</h3>
      <p>
        Generic or superficial impact assessments won't satisfy the law. The Attorney General can request assessments 
        and will scrutinize whether they genuinely analyze discrimination risks specific to your use case.
      </p>

      <h3>Pitfall #3: Failing to Update After System Changes</h3>
      <p>
        When your vendor releases a new model version or you change how the AI is configured, you must update the 
        impact assessment. Don't assume the old assessment covers new functionality.
      </p>

      <h3>Pitfall #4: Inadequate Human Review</h3>
      <p>
        "Rubber-stamping" AI recommendations doesn't constitute meaningful human oversight. Human reviewers must have 
        genuine authority to override AI and must be trained to recognize bias.
      </p>

      <h2>Key Takeaways</h2>

      <ul className="space-y-2 my-8">
        <li>✓ <strong>Colorado SB24-205 is comprehensive</strong> — impact assessments, notices, adverse decision statements, 
        and risk management all required</li>
        <li>✓ <strong>All employment AI is likely high-risk</strong> — hiring, promotion, and termination decisions are 
        explicitly covered</li>
        <li>✓ <strong>Enforcement is real</strong> — AG Phil Weiser has prioritized AI regulation with up to $20,000 per violation</li>
        <li>✓ <strong>60-day cure period</strong> — first-time violators get a chance to cure before penalties, but don't rely on it</li>
        <li>✓ <strong>No private lawsuits</strong> — only AG can enforce, reducing litigation risk compared to Illinois BIPA</li>
        <li>✓ <strong>Start now</strong> — effective February 1, 2026, means impact assessments and policies should be done by January</li>
        <li>✓ <strong>Vendor cooperation essential</strong> — you need vendor bias testing data and system documentation to complete assessments</li>
      </ul>

      <h2>Related Resources</h2>
      <ul className="space-y-2">
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">→ What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/ai-bias-audit-guide" className="text-blue-600 hover:underline">→ Bias Audit Implementation Guide</Link></li>
        <li><Link href="/resources/compliance-checklist-2026" className="text-blue-600 hover:underline">→ 2026 Compliance Checklist</Link></li>
        <li><Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:underline">→ Vendor Assessment Guide</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">→ AI Disclosure Templates</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">→ Free Compliance Scorecard</Link></li>
      </ul>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 my-12 border border-blue-100">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Ready for Colorado Compliance?</h3>
        <p className="text-gray-700 mb-4">
          Colorado's AI Act creates complex obligations with tight deadlines. Take our free compliance scorecard to 
          assess your readiness and get a personalized action plan.
        </p>
        <div className="flex gap-4">
          <Link href="/scorecard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
              Get Your Free Compliance Score →
            </button>
          </Link>
          <Link href="/contact">
            <button className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-semibold border border-gray-300">
              Talk to an Expert
            </button>
          </Link>
        </div>
      </div>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
