{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "EU AI Act Impact on US Employers: Hiring Compliance Guide 2026 | EmployArmor",
  description: "How the EU AI Act affects US employers hiring in Europe. Learn extraterritorial reach, high-risk system requirements, and compliance obligations.",
}

export default function EUAIActHiringPage() {
  return (
    <ArticleLayout
      title="EU AI Act: What US Employers Need to Know About Hiring in Europe"
      description="The EU AI Act isn't just a European law—its extraterritorial reach affects US companies hiring EU workers. Here's what you need to know to stay compliant."
      category="International Compliance"
      readTime="10 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        The European Union's AI Act, which entered into force in August 2024 and begins phased enforcement in 2026, 
        is the world's most comprehensive AI regulation. While it's an EU law, its extraterritorial provisions mean 
        <strong> US employers hiring workers located in the EU must comply</strong>—even if your company has no physical 
        presence in Europe.
      </p>

      <p>
        If you use AI in hiring and have candidates or employees in EU member states, this law applies to you.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Key Takeaway:</p>
        <p className="text-blue-800">
          The EU AI Act classifies AI systems used in employment as <strong>"high-risk"</strong>, triggering strict 
          compliance requirements including conformity assessments, human oversight, transparency obligations, and 
          record-keeping. Penalties reach <strong>€30 million or 6% of global annual revenue</strong>, whichever is higher.
        </p>
      </div>

      <h2>What is the EU AI Act?</h2>

      <p>
        The AI Act (Regulation (EU) 2024/1689) is a comprehensive framework regulating artificial intelligence across 
        the European Union. It takes a risk-based approach, categorizing AI systems into four levels:
      </p>

      <ul>
        <li><strong>Unacceptable risk:</strong> Prohibited AI (e.g., social scoring, subliminal manipulation)</li>
        <li><strong>High risk:</strong> Heavily regulated AI in critical domains (includes employment)</li>
        <li><strong>Limited risk:</strong> Transparency requirements only</li>
        <li><strong>Minimal risk:</strong> No specific obligations</li>
      </ul>

      <p>
        <strong>Employment AI systems are classified as high-risk</strong>, meaning they face the Act's strictest requirements.
      </p>

      <h2>Extraterritorial Reach: When Does the EU AI Act Apply to US Employers?</h2>

      <p>
        The AI Act applies if:
      </p>

      <ul>
        <li><strong>The AI provider is established in the EU</strong> (e.g., your vendor is EU-based), OR</li>
        <li><strong>The output of the AI system is used in the EU</strong> (e.g., you hire someone located in Germany), OR</li>
        <li><strong>The AI system is deployed within the EU</strong> (e.g., you have EU subsidiaries using the tool)</li>
      </ul>

      <h3>Practical Examples</h3>

      <p><strong>Scenario 1: US Company, EU Candidate</strong></p>
      <p>
        A California-based tech startup uses AI resume screening to evaluate candidates for a remote position. One 
        applicant is located in France. <strong>Result:</strong> EU AI Act applies to that evaluation, even though 
        the company is US-based.
      </p>

      <p><strong>Scenario 2: US Company, EU Subsidiary</strong></p>
      <p>
        A New York financial services firm has offices in London and Frankfurt. They use AI video interview software 
        globally. <strong>Result:</strong> EU AI Act applies to all use in EU offices, plus any EU-located candidates 
        interviewing for US positions.
      </p>

      <p><strong>Scenario 3: US Company, EU Vendor</strong></p>
      <p>
        A Texas employer uses an AI hiring tool developed by a Paris-based vendor. <strong>Result:</strong> The vendor 
        must comply with EU AI Act as the provider. The US employer, as deployer, has separate obligations if using 
        the tool for EU hires.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">Key Insight</p>
        <p className="text-amber-700">
          You don't need EU operations to be subject to the EU AI Act. Hiring or managing workers <em>located</em> 
          in the EU triggers compliance obligations, even if your company is entirely US-based.
        </p>
      </div>

      <h2>Why Employment AI is "High-Risk"</h2>

      <p>
        Annex III of the AI Act explicitly lists employment AI systems as high-risk, including systems used for:
      </p>

      <ul>
        <li>Recruitment and selection of persons (job advertisements, CV analysis, interviews)</li>
        <li>Making decisions affecting employment, promotion, or termination</li>
        <li>Task allocation and monitoring of work performance</li>
      </ul>

      <p>
        <strong>Rationale:</strong> Employment decisions profoundly impact individuals' livelihoods and fundamental 
        rights. AI bias in hiring can perpetuate discrimination and violate EU Charter of Fundamental Rights.
      </p>

      <h2>Core Obligations for High-Risk Employment AI</h2>

      <h3>1. Conformity Assessment</h3>

      <p>
        Before deploying a high-risk AI system, providers must conduct a <strong>conformity assessment</strong> to 
        demonstrate compliance with EU AI Act requirements. This involves:
      </p>

      <ul>
        <li><strong>Risk management system:</strong> Identify, analyze, and mitigate risks throughout AI lifecycle</li>
        <li><strong>Data governance:</strong> Ensure training/testing data is relevant, representative, and free from bias</li>
        <li><strong>Technical documentation:</strong> Detailed description of system design, development, and performance</li>
        <li><strong>Logging capabilities:</strong> Automatic recording of system events for oversight and accountability</li>
        <li><strong>Transparency:</strong> Clear information for deployers and affected persons</li>
        <li><strong>Human oversight:</strong> Measures enabling human intervention and control</li>
        <li><strong>Accuracy, robustness, cybersecurity:</strong> Technical performance standards</li>
      </ul>

      <p>
        Conformity assessment can be conducted:
      </p>

      <ul>
        <li><strong>Internally:</strong> Provider self-assesses and issues Declaration of Conformity</li>
        <li><strong>Via Notified Body:</strong> For certain high-risk systems, independent third-party assessment required</li>
      </ul>

      <p><strong>For employment AI:</strong> Internal assessment is typically allowed, but must be thorough and documented.</p>

      <h3>2. Human Oversight</h3>

      <p>
        High-risk AI systems must include measures enabling effective human oversight, including:
      </p>

      <ul>
        <li><strong>Understanding system capabilities and limitations:</strong> Humans must know what the AI can/cannot do</li>
        <li><strong>Ability to monitor:</strong> Real-time awareness of AI operation</li>
        <li><strong>Ability to intervene:</strong> Humans can stop or alter AI decisions</li>
        <li><strong>Ability to override:</strong> Final decisions rest with humans, not algorithms</li>
      </ul>

      <p>
        <strong>Practical example:</strong> A hiring manager reviews AI-generated candidate rankings but makes final 
        hiring decisions. The manager can override AI recommendations and understands the AI's limitations.
      </p>

      <h3>3. Transparency and Information Obligations</h3>

      <p><strong>For Deployers (Employers):</strong></p>
      <ul>
        <li>Providers must give deployers sufficient information to understand the AI system</li>
        <li>Instructions for use, technical specifications, performance metrics</li>
        <li>Information about training data, known biases, limitations</li>
      </ul>

      <p><strong>For Affected Persons (Candidates/Employees):</strong></p>
      <ul>
        <li>Inform individuals that AI is being used to make employment decisions</li>
        <li>Explain the purpose and logic of the AI system</li>
        <li>Provide information about their rights (right to explanation, right to contest decisions)</li>
      </ul>

      <h3>4. Record-Keeping and Logging</h3>

      <p>
        High-risk AI systems must automatically log:
      </p>

      <ul>
        <li>Events and decisions made by the AI system</li>
        <li>Data inputs and outputs</li>
        <li>Timestamp and context of AI operations</li>
        <li>Human oversight actions (interventions, overrides)</li>
      </ul>

      <p>
        <strong>Retention period:</strong> Logs must be kept for at least 6 months, or longer if required by other 
        EU laws (e.g., GDPR, employment law).
      </p>

      <h3>5. Accuracy, Robustness, and Cybersecurity</h3>

      <p>
        AI systems must achieve appropriate levels of:
      </p>

      <ul>
        <li><strong>Accuracy:</strong> AI predictions must be correct and reliable</li>
        <li><strong>Robustness:</strong> System performs consistently across scenarios</li>
        <li><strong>Cybersecurity:</strong> Protected against attacks, manipulation, and unauthorized access</li>
      </ul>

      <p>
        Providers must validate these characteristics and make performance metrics available to deployers.
      </p>

      <h3>6. Post-Market Monitoring</h3>

      <p>
        After deployment, providers must:
      </p>

      <ul>
        <li>Continuously monitor AI system performance</li>
        <li>Establish mechanisms for reporting serious incidents or malfunctions</li>
        <li>Update risk assessments as new information emerges</li>
        <li>Implement corrective actions when problems arise</li>
      </ul>

      <h2>Deployer Obligations: What US Employers Must Do</h2>

      <p>
        As the "deployer" (entity using the AI system), US employers have separate obligations:
      </p>

      <h3>1. Use AI Systems Appropriately</h3>

      <ul>
        <li>Follow provider's instructions for use</li>
        <li>Use AI only for its intended purpose</li>
        <li>Ensure input data is relevant and of sufficient quality</li>
      </ul>

      <h3>2. Ensure Human Oversight</h3>

      <ul>
        <li>Assign individuals to oversee AI system operation</li>
        <li>Train oversight personnel on AI capabilities and limitations</li>
        <li>Enable human intervention in AI decision-making</li>
      </ul>

      <h3>3. Monitor and Report</h3>

      <ul>
        <li>Monitor AI system for malfunctions or unexpected behavior</li>
        <li>Report serious incidents to provider and authorities</li>
        <li>Suspend AI use if serious risks identified</li>
      </ul>

      <h3>4. Conduct Data Protection Impact Assessments (If Required)</h3>

      <p>
        Under GDPR, automated decision-making may require Data Protection Impact Assessments (DPIAs). EU AI Act 
        coordinates with GDPR—often a single integrated assessment suffices.
      </p>

      <h3>5. Inform Affected Persons</h3>

      <ul>
        <li>Tell candidates/employees that AI is being used</li>
        <li>Explain the AI's role in employment decisions</li>
        <li>Provide information about rights (explanation, contest decisions)</li>
      </ul>

      <h2>Prohibited AI Practices in Employment</h2>

      <p>
        The EU AI Act bans certain AI uses outright. In employment context, prohibited practices include:
      </p>

      <ul>
        <li><strong>Subliminal manipulation:</strong> AI that manipulates behavior without awareness</li>
        <li><strong>Exploiting vulnerabilities:</strong> AI targeting disabilities or socioeconomic status to manipulate behavior</li>
        <li><strong>Social scoring:</strong> General-purpose evaluation of individuals' trustworthiness or social behavior</li>
        <li><strong>Real-time remote biometric identification in public spaces:</strong> Limited exceptions; not generally 
        applicable to employment but could affect workplace surveillance</li>
      </ul>

      <p>
        <strong>Note:</strong> Personality assessments and behavioral analysis in hiring are allowed (as high-risk, 
        not prohibited) if compliant with high-risk requirements.
      </p>

      <h2>GDPR and EU AI Act: How They Interact</h2>

      <p>
        AI hiring tools in the EU must comply with <strong>both</strong> the AI Act and GDPR:
      </p>

      <h3>GDPR Requirements for AI Hiring</h3>

      <ul>
        <li><strong>Legal basis for processing:</strong> Need lawful basis (typically legitimate interest or consent)</li>
        <li><strong>Data minimization:</strong> Collect only necessary personal data</li>
        <li><strong>Transparency:</strong> Explain AI logic in privacy notices</li>
        <li><strong>Right to explanation:</strong> Individuals can request explanation of automated decisions</li>
        <li><strong>Right to human intervention:</strong> Individuals can contest solely automated decisions and request 
        human review</li>
        <li><strong>Data Protection Impact Assessment:</strong> Required for high-risk automated processing</li>
      </ul>

      <h3>Coordinated Compliance</h3>

      <p>
        The AI Act explicitly states it's without prejudice to GDPR. In practice:
      </p>

      <ul>
        <li>AI Act conformity assessment can incorporate GDPR DPIA</li>
        <li>AI Act transparency obligations align with GDPR disclosure requirements</li>
        <li>AI Act human oversight dovetails with GDPR right to human intervention</li>
        <li>Both require logging and record-keeping (can use unified system)</li>
      </ul>

      <p>
        <strong>Tip:</strong> Build integrated compliance framework addressing both regulations simultaneously.
      </p>

      <h2>Penalties for Non-Compliance</h2>

      <p>
        EU AI Act penalties are substantial:
      </p>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
        <p className="font-semibold text-red-800 mb-2">Penalty Tiers:</p>
        <ul className="text-red-700 space-y-1">
          <li><strong>Prohibited AI use:</strong> Up to <strong>€35 million or 7% of global annual turnover</strong></li>
          <li><strong>Non-compliance with high-risk requirements:</strong> Up to <strong>€15 million or 3% of global turnover</strong></li>
          <li><strong>Incorrect/incomplete information to authorities:</strong> Up to <strong>€7.5 million or 1% of global turnover</strong></li>
        </ul>
        <p className="text-red-700 mt-2 text-sm italic">
          Whichever amount is <strong>higher</strong> applies. For global companies, this can be hundreds of millions of dollars.
        </p>
      </div>

      <p>
        Beyond financial penalties:
      </p>

      <ul>
        <li><strong>Injunctions:</strong> Orders to stop using non-compliant AI systems</li>
        <li><strong>Product recalls:</strong> Removal of AI systems from market</li>
        <li><strong>Reputational damage:</strong> Public enforcement actions harm brand</li>
        <li><strong>Operational disruption:</strong> Forced to abandon AI tools mid-hiring cycle</li>
      </ul>

      <h2>Compliance Roadmap for US Employers</h2>

      <h3>Step 1: Determine Applicability</h3>

      <ul>
        <li>Do you hire candidates located in EU member states?</li>
        <li>Do you have employees or contractors working in the EU?</li>
        <li>Do you use AI tools from EU-based vendors?</li>
      </ul>

      <p>If yes to any, EU AI Act likely applies.</p>

      <h3>Step 2: Inventory AI Systems</h3>

      <ul>
        <li>List all AI tools used in recruitment, hiring, performance management, promotions</li>
        <li>Classify each as high-risk, limited-risk, or minimal-risk</li>
        <li>Identify providers (who developed the AI) and deployers (who uses it—likely you)</li>
      </ul>

      <h3>Step 3: Engage Providers</h3>

      <p>For AI tools you buy from vendors:</p>
      <ul>
        <li>Request conformity assessment documentation</li>
        <li>Obtain technical documentation and instructions for use</li>
        <li>Verify CE marking (EU conformity declaration)</li>
        <li>Require contractual representations of EU AI Act compliance</li>
        <li>Establish incident reporting procedures</li>
      </ul>

      <h3>Step 4: Implement Deployer Requirements</h3>

      <ul>
        <li>Assign human oversight responsibility</li>
        <li>Train personnel on AI system operation and limitations</li>
        <li>Establish monitoring and incident response processes</li>
        <li>Create candidate/employee notification mechanisms</li>
        <li>Set up logging and record-keeping infrastructure</li>
      </ul>

      <h3>Step 5: Coordinate with GDPR Compliance</h3>

      <ul>
        <li>Update privacy notices to explain AI use</li>
        <li>Conduct or update DPIAs for automated decision-making</li>
        <li>Establish procedures for right to explanation and human review requests</li>
        <li>Align data retention policies with GDPR and AI Act requirements</li>
      </ul>

      <h3>Step 6: Monitor Regulatory Developments</h3>

      <p>
        The AI Act has phased implementation. Key dates:
      </p>

      <ul>
        <li><strong>August 2024:</strong> Act entered into force</li>
        <li><strong>February 2025:</strong> Prohibited AI rules apply</li>
        <li><strong>August 2026:</strong> High-risk AI obligations apply (employment AI)</li>
        <li><strong>August 2027:</strong> Remaining provisions apply</li>
      </ul>

      <p>
        <strong>As of February 2026:</strong> You're in the compliance window for high-risk employment AI. Full 
        enforcement begins August 2026.
      </p>

      <h2>Practical Challenges for US Employers</h2>

      <h3>Challenge 1: Vendor Readiness</h3>

      <p>
        Many US AI vendors are not yet EU AI Act compliant. If your vendor can't provide conformity documentation 
        by August 2026, you may need to:
      </p>

      <ul>
        <li>Switch to compliant vendor</li>
        <li>Pause AI use for EU hires</li>
        <li>Pressure vendor to achieve compliance</li>
        <li>Accept enforcement risk (not recommended)</li>
      </ul>

      <h3>Challenge 2: Cost of Compliance</h3>

      <p>
        Conformity assessments, technical documentation, logging infrastructure, and human oversight add cost. 
        Estimate €50,000-€250,000 per AI system for full EU AI Act compliance.
      </p>

      <h3>Challenge 3: Conflicting Requirements</h3>

      <p>
        US state laws (e.g., NYC bias audits) may have different standards than EU AI Act conformity assessments. 
        You may need parallel compliance processes for different jurisdictions.
      </p>

      <h3>Challenge 4: Extraterritorial Enforcement</h3>

      <p>
        EU member states can enforce against non-EU companies. Enforcement mechanisms include:
      </p>

      <ul>
        <li>Penalties enforceable against EU assets or revenues</li>
        <li>Market access restrictions (banned from EU hiring)</li>
        <li>Cooperation with US authorities (via mutual legal assistance treaties)</li>
      </ul>

      <h2>How EmployArmor Helps with EU AI Act Compliance</h2>

      <ul>
        <li><strong>Applicability analysis:</strong> Determine if EU AI Act applies to your hiring practices</li>
        <li><strong>Vendor assessment:</strong> Evaluate AI provider compliance with EU AI Act</li>
        <li><strong>Deployer obligation tracking:</strong> Manage human oversight, monitoring, and notification requirements</li>
        <li><strong>GDPR coordination:</strong> Integrated compliance framework for AI Act + GDPR</li>
        <li><strong>Candidate notification:</strong> EU-compliant disclosure and explanation processes</li>
        <li><strong>Documentation repository:</strong> Centralized logging and record-keeping</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Hiring in the EU?</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your EU AI Act Readiness Assessment →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Does the EU AI Act apply if we only hire EU citizens working in the US?</h3>
      <p>
        No. The key factor is location of the individual when AI is used, not their citizenship. If the candidate is 
        physically in the US during evaluation, EU AI Act likely doesn't apply (though other factors could trigger it).
      </p>

      <h3>What if we hire remote EU workers through a PEO or contractor arrangement?</h3>
      <p>
        Likely still applies. If you're making hiring decisions about individuals located in the EU using AI, you're 
        subject to the Act regardless of employment structure.
      </p>

      <h3>Can we just exclude EU candidates to avoid EU AI Act compliance?</h3>
      <p>
        Technically possible but may violate EU anti-discrimination law or limit your talent pool. Many US companies 
        with global ambitions choose compliance over exclusion.
      </p>

      <h3>How does this interact with the UK's AI regulation?</h3>
      <p>
        The UK (post-Brexit) is developing separate AI regulation. Currently, the UK follows a sector-specific approach 
        rather than comprehensive AI Act. If you hire in both EU and UK, monitor UK developments separately.
      </p>

      <h3>What if our AI vendor is US-based but we use the tool for EU hires?</h3>
      <p>
        The vendor (provider) is subject to EU AI Act if their product is used in the EU. You (deployer) have separate 
        obligations. Work with vendor to ensure they can meet provider requirements; you handle deployer requirements.
      </p>

      <h3>Do US-based companies with no EU operations but occasional EU remote hires really need to comply?</h3>
      <p>
        Yes, if you're using AI to evaluate candidates located in the EU. The EU AI Act has extraterritorial reach—it 
        applies based on where the AI's outputs are used or affect individuals, not where your company is headquartered. 
        Even one EU-based remote hire evaluated with AI triggers compliance obligations. Penalties can reach €30 million 
        or 6% of global turnover, whichever is higher. The EU takes extraterritorial enforcement seriously (see GDPR 
        enforcement against US companies). You cannot ignore EU AI Act just because you're US-based. Alternative: explicitly 
        exclude EU candidates from roles if you're unwilling to invest in compliance, but this limits your talent pool 
        significantly. See our <Link href="/resources/compliance-program-guide" className="text-blue-600 hover:underline">Compliance Program Guide</Link> for 
        multi-jurisdictional implementation strategies.
      </p>

      <h3>How does the EU AI Act's conformity assessment process work for high-risk hiring AI?</h3>
      <p>
        Conformity assessment is required before deploying high-risk AI (employment/HR AI is explicitly high-risk under 
        Annex III). Process involves: (1) Provider (AI vendor) conducts internal testing against EU requirements, 
        (2) Provider prepares technical documentation and Declaration of Conformity, (3) For some high-risk systems, 
        third-party Notified Body conducts independent assessment, (4) CE marking applied to compliant systems. As 
        deployer (employer), you must verify your vendor completed conformity assessment and obtain Declaration of 
        Conformity before use. US vendors may struggle with this—many aren't set up for EU conformity assessment. 
        Budget expectation: Conformity assessment adds $50,000-150,000 to vendor's product development costs, which 
        they may pass through to customers. Timeline: 6-12 months for initial assessment. Deployment without conformity 
        assessment is a serious violation—don't deploy AI in EU without verification.
      </p>

      <h2>Practical EU AI Act Implementation for US Employers</h2>

      <h3>Phase 1: Scope Assessment (Months 1-2)</h3>
      <ul>
        <li>☐ Identify all positions that may hire EU-located candidates</li>
        <li>☐ Document current AI tools used in hiring process</li>
        <li>☐ Determine which AI systems qualify as "high-risk" under EU AI Act</li>
        <li>☐ Map which EU member states you hire in (different data protection authorities)</li>
        <li>☐ Estimate annual EU hiring volume to assess compliance cost-benefit</li>
      </ul>

      <h3>Phase 2: Vendor Due Diligence (Months 3-4)</h3>
      <ul>
        <li>☐ Request EU AI Act compliance documentation from all AI vendors</li>
        <li>☐ Verify conformity assessments and CE marking where required</li>
        <li>☐ Review vendor technical documentation for transparency obligations</li>
        <li>☐ Confirm vendor has EU representative (required for non-EU providers)</li>
        <li>☐ Negotiate contract addendums for EU AI Act compliance support</li>
      </ul>

      <h3>Phase 3: Deployer Obligations (Months 5-7)</h3>
      <ul>
        <li>☐ Conduct Fundamental Rights Impact Assessment (FRIA)</li>
        <li>☐ Implement human oversight procedures for EU AI decisions</li>
        <li>☐ Create transparency notices for EU candidates (what AI evaluates, their rights)</li>
        <li>☐ Establish logging and monitoring systems (EU requires extensive recordkeeping)</li>
        <li>☐ Designate responsible person for EU AI Act compliance</li>
        <li>☐ Register high-risk AI systems in EU database (when operational, expected 2027)</li>
      </ul>

      <h3>Phase 4: Ongoing Compliance (Continuous)</h3>
      <ul>
        <li>☐ Monitor AI system performance and outcomes (quarterly minimum)</li>
        <li>☐ Update FRIAs annually or when material changes occur</li>
        <li>☐ Maintain logs of AI decisions for required retention period</li>
        <li>☐ Report serious incidents to relevant authorities within 15 days</li>
        <li>☐ Cooperate with market surveillance authorities during inspections</li>
      </ul>

      <h2>Enforcement Timeline and Expectations</h2>

      <h3>Phased Implementation (2024-2027)</h3>
      <ul>
        <li><strong>August 2024:</strong> EU AI Act entered into force</li>
        <li><strong>February 2025:</strong> Prohibited AI practices banned (doesn't significantly affect hiring)</li>
        <li><strong>August 2025:</strong> Governance and notified body framework operational</li>
        <li><strong>August 2026:</strong> Obligations for high-risk AI systems (including hiring AI) begin</li>
        <li><strong>August 2027:</strong> Full enforcement including high-risk AI system registration database</li>
      </ul>

      <h3>Current Enforcement Posture</h3>
      <p>
        As of February 2026, EU member states are still building enforcement capacity. However, early signals suggest 
        aggressive enforcement:
      </p>

      <ul>
        <li><strong>Germany:</strong> BfDI (data protection authority) issued guidance that hiring AI enforcement is a 
        priority, coordinating with labor authorities.</li>
        <li><strong>France:</strong> CNIL announced hiring AI as focus area for 2026 inspections, particularly in tech 
        and financial services sectors.</li>
        <li><strong>Netherlands:</strong> Dutch DPA investigating several unnamed employers for non-compliant hiring AI, 
        outcomes expected Q2 2026.</li>
        <li><strong>Ireland:</strong> DPC (relevant for many US tech companies with EU HQs in Ireland) issued preliminary 
        warning letters to multinationals about AI hiring compliance.</li>
      </ul>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/federal-ai-hiring-laws" className="text-blue-600 hover:underline">Federal AI Hiring Laws (US)</Link></li>
        <li><Link href="/resources/ai-hiring-laws-by-state" className="text-blue-600 hover:underline">State-by-State AI Hiring Laws</Link></li>
        <li><Link href="/blog/ai-impact-assessment-hiring" className="text-blue-600 hover:underline">How to Conduct an AI Impact Assessment</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
