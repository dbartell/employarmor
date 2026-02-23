{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "AI Hiring Laws by State: Complete 2026 Comparison Table | EmployArmor",
  description: "Comprehensive state-by-state guide to AI hiring laws. Compare disclosure, consent, bias audit, and penalty requirements across all 50 states.",
}

export default function AIHiringLawsByStatePage() {
  return (
    <ArticleLayout
      title="State-by-State AI Hiring Laws: Complete Comparison Guide 2026"
      description="AI hiring regulations vary dramatically by state. This comprehensive comparison helps you understand exactly what's required in each jurisdiction where you hire."
      category="Compliance Reference"
      readTime="15 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        As of February 2026, <strong>17 states and 23 municipalities</strong> have active AI hiring laws. Another 
        12 states have pending legislation. For employers hiring across multiple jurisdictions, this creates a 
        compliance nightmare: overlapping requirements, conflicting standards, and constantly shifting regulations.
      </p>

      <p>
        This guide breaks down every active AI hiring law in the United States, organized by compliance requirement, 
        penalty structure, and practical impact.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Quick Navigation:</p>
        <ul className="text-blue-800 space-y-1">
          <li>• Comprehensive Regulation States (Tier 1)</li>
          <li>• Targeted Regulation States (Tier 2)</li>
          <li>• Pending Legislation States (Tier 3)</li>
          <li>• Full Comparison Table</li>
          <li>• Multi-State Compliance Strategy</li>
        </ul>
      </div>

      <h2>Understanding the Regulatory Tiers</h2>

      <p>Not all AI hiring laws are created equal. We've organized states into three tiers:</p>

      <ul>
        <li><strong>Tier 1 (Comprehensive):</strong> Broad coverage of AI tools + multiple compliance requirements 
        (disclosure, audits, impact assessments) + meaningful penalties</li>
        <li><strong>Tier 2 (Targeted):</strong> Narrow scope (e.g., facial recognition only) or limited requirements 
        (disclosure-only)</li>
        <li><strong>Tier 3 (Pending):</strong> Legislation introduced but not yet passed; worth monitoring</li>
      </ul>

      <h2>Tier 1: Comprehensive Regulation States</h2>

      <p>These states have the most demanding AI hiring compliance frameworks:</p>

      <h3>Illinois - AIVIA (820 ILCS 42)</h3>

      <p><strong>Effective:</strong> January 1, 2020 (expanded via HB 3773, January 1, 2025)</p>

      <p><strong>Scope:</strong> Any AI tool used to evaluate job applicants, including:</p>
      <ul>
        <li>Video interview analysis</li>
        <li>Resume screening</li>
        <li>Skills assessments</li>
        <li>Candidate ranking systems</li>
      </ul>

      <p><strong>Requirements:</strong></p>
      <ul>
        <li>✓ <strong>Disclosure:</strong> Written notice explaining AI use, what it evaluates, and how it impacts decisions</li>
        <li>✓ <strong>Consent:</strong> Affirmative opt-in required before AI evaluation</li>
        <li>✓ <strong>Alternative process:</strong> Must offer non-AI evaluation for candidates who decline</li>
        <li>✓ <strong>Data deletion:</strong> Destroy video/data within 30 days upon request</li>
      </ul>

      <p><strong>Penalties:</strong> $500 per violation (first offense), $1,000 per violation (subsequent)</p>

      <p><strong>Enforcement:</strong> Illinois Department of Labor</p>

      <h3>New York City - Local Law 144</h3>

      <p><strong>Effective:</strong> July 5, 2023</p>

      <p><strong>Scope:</strong> Automated Employment Decision Tools (AEDTs) that substantially assist or replace 
      discretionary decision-making in hiring or promotion</p>

      <p><strong>Requirements:</strong></p>
      <ul>
        <li>✓ <strong>Bias audit:</strong> Annual independent audit required</li>
        <li>✓ <strong>Audit publication:</strong> Results must be posted publicly on company website</li>
        <li>✓ <strong>Disclosure:</strong> Notice to candidates at least 10 days before AEDT use</li>
        <li>✓ <strong>Alternative process:</strong> Available upon request</li>
        <li>✓ <strong>Data retention policy:</strong> Published explanation of what data is collected and retained</li>
      </ul>

      <p><strong>Penalties:</strong> $500 to $1,500 per violation (each day of non-compliance = separate violation)</p>

      <p><strong>Enforcement:</strong> NYC Department of Consumer and Worker Protection (DCWP)</p>

      <p><strong>Notable:</strong> NYC has issued multiple enforcement actions. First penalties levied in Q4 2025.</p>

      <h3>Colorado - AI Act (HB 24-1278)</h3>

      <p><strong>Effective:</strong> February 1, 2026</p>

      <p><strong>Scope:</strong> High-risk AI systems in employment, defined as systems that make or substantially 
      influence consequential decisions about employment</p>

      <p><strong>Requirements:</strong></p>
      <ul>
        <li>✓ <strong>Impact assessment:</strong> Before deployment and annually thereafter</li>
        <li>✓ <strong>Disclosure:</strong> Clear notice to candidates and employees</li>
        <li>✓ <strong>Opt-out rights:</strong> Candidates can request non-AI alternative</li>
        <li>✓ <strong>Human review:</strong> Meaningful human oversight of automated decisions</li>
        <li>✓ <strong>Algorithmic accountability:</strong> Annual report to Colorado AG</li>
        <li>✓ <strong>Risk management:</strong> Documented policies for AI governance</li>
      </ul>

      <p><strong>Penalties:</strong> Up to $20,000 per violation</p>

      <p><strong>Enforcement:</strong> Colorado Attorney General</p>

      <h3>California - AB 2930</h3>

      <p><strong>Effective:</strong> January 1, 2026</p>

      <p><strong>Scope:</strong> Automated decision systems that screen, evaluate, or rank job candidates</p>

      <p><strong>Requirements:</strong></p>
      <ul>
        <li>✓ <strong>Pre-use disclosure:</strong> Before AI tool is used</li>
        <li>✓ <strong>Bias testing:</strong> Annual evaluation for discriminatory impact</li>
        <li>✓ <strong>Data minimization:</strong> Collect only job-relevant data</li>
        <li>✓ <strong>Human review rights:</strong> Candidates can request human re-evaluation</li>
        <li>✓ <strong>Privacy protections:</strong> CCPA-style data handling requirements</li>
      </ul>

      <p><strong>Penalties:</strong> CCPA-style enforcement (AG can seek civil penalties)</p>

      <p><strong>Enforcement:</strong> California Attorney General</p>

      <h3>Washington - SB 5116</h3>

      <p><strong>Effective:</strong> March 31, 2024</p>

      <p><strong>Scope:</strong> Automated employment decision systems</p>

      <p><strong>Requirements:</strong></p>
      <ul>
        <li>✓ <strong>Disclosure:</strong> Notice of AI use</li>
        <li>✓ <strong>Impact assessment:</strong> For high-risk systems</li>
        <li>✓ <strong>Data protection:</strong> Algorithmic discrimination protections</li>
      </ul>

      <p><strong>Penalties:</strong> Consumer protection enforcement remedies</p>

      <h2>Tier 2: Targeted Regulation States</h2>

      <p>These states have narrower AI hiring laws, typically focused on specific technologies or limited requirements:</p>

      <h3>Maryland - HB 1202</h3>
      <p><strong>Scope:</strong> Facial recognition in interviews only</p>
      <p><strong>Requirement:</strong> Written consent</p>
      <p><strong>Effective:</strong> October 1, 2020</p>

      <h3>New Jersey - A1 Bill (Pending final rules)</h3>
      <p><strong>Scope:</strong> AI hiring tools that evaluate or rank candidates</p>
      <p><strong>Requirements:</strong> Disclosure + annual bias audit</p>
      <p><strong>Expected effective:</strong> 2026</p>

      <h3>Texas - No specific AI hiring law</h3>
      <p><strong>However:</strong> Texas Capture or Use of Biometric Identifier Act (CUBI) applies to facial 
      recognition and other biometric data in hiring</p>
      <p><strong>Requirement:</strong> Notice and consent for biometric data collection</p>

      <h3>Nevada - SB 370</h3>
      <p><strong>Scope:</strong> General AI consumer protection law with employment provisions</p>
      <p><strong>Requirements:</strong> Disclosure of AI use; right to opt out</p>
      <p><strong>Effective:</strong> October 1, 2025</p>

      <h3>Massachusetts - S.2016 (Pending)</h3>
      <p><strong>Proposed scope:</strong> Any AI that materially influences hiring decisions</p>
      <p><strong>Proposed requirements:</strong> Disclosure, bias audits, impact assessments, human oversight</p>
      <p><strong>Status:</strong> Committee review; expected vote Q2 2026</p>

      <h3>Oregon - HB 2557 (Pending)</h3>
      <p><strong>Proposed scope:</strong> Automated employment systems</p>
      <p><strong>Proposed requirements:</strong> Notice, consent, audit rights</p>

      <h3>Connecticut - SB 1103 (Proposed)</h3>
      <p><strong>Proposed scope:</strong> AI decision-making in employment</p>
      <p><strong>Proposed requirements:</strong> Impact assessments, disclosure, accountability mechanisms</p>

      <h2>The Complete Comparison Table</h2>

      <div className="overflow-x-auto my-8">
        <table className="min-w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">State/City</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Disclosure</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Consent</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Bias Audit</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Impact Assessment</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Alt. Process</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 border-b">Max Penalty</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-3 py-2 font-medium text-gray-900">Illinois</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-700">$1,000/violation</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-900">NYC</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓ Annual</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-700">$1,500/day</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-2 font-medium text-gray-900">Colorado</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-700">$20,000/violation</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-900">California</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓ Annual</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-700">AG discretion</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-2 font-medium text-gray-900">Washington</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-700">Consumer protection</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-900">Maryland</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓ (facial only)</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-700">Not specified</td>
            </tr>
            <tr className="border-b">
              <td className="px-3 py-2 font-medium text-gray-900">Nevada</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-700">$5,000/violation</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-900">New Jersey</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-green-600 font-medium">✓</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-400">—</td>
              <td className="px-3 py-2 text-gray-700">Pending rules</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Municipal Laws: Beyond State Regulations</h2>

      <p>
        Several cities have passed AI hiring laws more stringent than their state requirements. Key jurisdictions:
      </p>

      <h3>New York City (covered above)</h3>
      <p>Most comprehensive municipal AI hiring law in the U.S.</p>

      <h3>San Francisco - Surveillance Technology Ordinance</h3>
      <p>
        While not AI-hiring specific, SF's surveillance ordinance impacts employers using monitoring or analysis 
        tools in hiring. Requires:
      </p>
      <ul>
        <li>Impact assessments for surveillance technology</li>
        <li>Public disclosure of technology use</li>
        <li>Oversight and accountability mechanisms</li>
      </ul>

      <h3>Portland, OR - Facial Recognition Ban</h3>
      <p>
        Portland prohibits private entities (including employers) from using facial recognition in places of 
        public accommodation. Arguably extends to job interviews conducted in public-facing offices.
      </p>

      <h2>Multi-State Compliance Strategy</h2>

      <p>
        If you hire across multiple states, you need a unified compliance approach that satisfies all jurisdictions. 
        Here's how to build it:
      </p>

      <h3>Strategy 1: Build to the Highest Standard</h3>

      <p>
        Identify the most demanding requirements across all states where you hire, then implement those everywhere. 
        This "ceiling" approach ensures you're never out of compliance.
      </p>

      <p><strong>Example:</strong> If you hire in both NYC and Illinois:</p>
      <ul>
        <li>Conduct annual bias audits (NYC requirement) → applies to all tools</li>
        <li>Obtain explicit consent (Illinois requirement) → collect from all candidates</li>
        <li>Provide alternative process (both require) → offer universally</li>
        <li>Publish audit results (NYC requirement) → makes sense to do once, publicly</li>
      </ul>

      <p><strong>Result:</strong> You're simultaneously compliant in both jurisdictions with a single process.</p>

      <h3>Strategy 2: Tool-Specific Compliance Mapping</h3>

      <p>
        Different AI tools may have different compliance requirements. Create a matrix:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-6 text-sm">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-2 py-2 text-left text-xs font-semibold">Tool</th>
              <th className="px-2 py-2 text-left text-xs font-semibold">Use Case</th>
              <th className="px-2 py-2 text-left text-xs font-semibold">States Where Used</th>
              <th className="px-2 py-2 text-left text-xs font-semibold">Compliance Requirements</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-2 py-2">HireVue</td>
              <td className="px-2 py-2">Video interviews</td>
              <td className="px-2 py-2">IL, NY, CA, TX</td>
              <td className="px-2 py-2">Bias audit (NYC), consent (IL), disclosure (all)</td>
            </tr>
            <tr className="border-b">
              <td className="px-2 py-2">Greenhouse AI</td>
              <td className="px-2 py-2">Resume screening</td>
              <td className="px-2 py-2">IL, NY, CO</td>
              <td className="px-2 py-2">Bias audit (NYC), consent (IL, CO), impact assessment (CO)</td>
            </tr>
            <tr>
              <td className="px-2 py-2">Pymetrics</td>
              <td className="px-2 py-2">Skills assessment</td>
              <td className="px-2 py-2">NY, CA</td>
              <td className="px-2 py-2">Bias audit (NYC), bias testing (CA), disclosure (both)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Strategy 3: Geographic Segmentation</h3>

      <p>
        For very large employers, it may make sense to use different hiring workflows in different states—especially 
        if certain AI tools are only cost-effective at scale.
      </p>

      <p><strong>Example:</strong></p>
      <ul>
        <li><strong>High-volume roles in regulated states:</strong> Use compliant AI tools with full bias audits</li>
        <li><strong>Low-volume roles in non-regulated states:</strong> Consider traditional (non-AI) hiring to avoid 
        compliance costs</li>
        <li><strong>Remote roles:</strong> Default to most stringent compliance (assume candidates could be anywhere)</li>
      </ul>

      <p><strong>Caution:</strong> This approach requires sophisticated workflow management and clear policies to 
      prevent mistakes.</p>

      <h2>Pending Federal Legislation</h2>

      <p>
        Congress is debating several bills that could establish national AI hiring standards. Key proposals:
      </p>

      <h3>Algorithmic Accountability Act (S. 2892)</h3>
      <p><strong>Status:</strong> Committee review</p>
      <p><strong>Key provisions:</strong></p>
      <ul>
        <li>Mandatory impact assessments for high-risk AI systems</li>
        <li>Annual reporting to FTC</li>
        <li>Algorithmic discrimination protections</li>
        <li>Consumer notification rights</li>
      </ul>

      <h3>AI Bill of Rights Implementation Act</h3>
      <p><strong>Status:</strong> Introduced 2025</p>
      <p><strong>Key provisions:</strong></p>
      <ul>
        <li>Right to notice when AI is used in consequential decisions</li>
        <li>Right to opt out of automated decision-making</li>
        <li>Right to challenge and appeal AI decisions</li>
        <li>Protections against algorithmic discrimination</li>
      </ul>

      <h3>Preemption Questions</h3>

      <p>
        If federal AI hiring legislation passes, it may:
      </p>

      <ul>
        <li><strong>Preempt state laws entirely</strong> (unlikely given political dynamics)</li>
        <li><strong>Create a federal floor with state flexibility</strong> (most likely outcome)</li>
        <li><strong>Coexist with state laws</strong> (creating additional compliance layers)</li>
      </ul>

      <p>
        <strong>Compliance implication:</strong> Don't assume federal law will simplify multi-state compliance. 
        Plan for continued state-level variation.
      </p>

      <h2>Enforcement Trends Across States</h2>

      <h3>Active Enforcement</h3>
      <p><strong>New York City:</strong> First penalties issued Q4 2025; multiple investigations ongoing</p>
      <p><strong>Illinois:</strong> Pattern-and-practice investigations of staffing agencies</p>
      <p><strong>California:</strong> AG investigating major ATS vendors</p>

      <h3>Complaint-Driven Enforcement</h3>
      <p>
        Most states rely on complaints to trigger investigations. Common complaint sources:
      </p>
      <ul>
        <li>Candidates who believe they were unfairly screened out</li>
        <li>Whistleblowers (employees who see non-compliant practices)</li>
        <li>Media investigations uncovering AI tool issues</li>
        <li>Advocacy groups testing compliance systematically</li>
      </ul>

      <h3>Cross-Jurisdictional Collaboration</h3>
      <p>
        State AGs are increasingly coordinating AI enforcement. A violation in one state can trigger scrutiny in others 
        where you operate.
      </p>

      <h2>International Considerations</h2>

      <p>
        If you hire in both the U.S. and internationally, consider:
      </p>

      <h3>EU AI Act</h3>
      <p>
        AI hiring tools are "high-risk" under the EU AI Act. Requirements include:
      </p>
      <ul>
        <li>Conformity assessments</li>
        <li>Human oversight</li>
        <li>Transparency obligations</li>
        <li>Record-keeping</li>
      </ul>

      <p><strong>Penalties:</strong> Up to €30M or 6% of global revenue</p>

      <h3>Canada - AIDA (Artificial Intelligence and Data Act)</h3>
      <p>
        Pending legislation would create impact assessment and transparency requirements for AI in employment.
      </p>

      <h3>UK - AI Regulation Bill (Proposed)</h3>
      <p>
        Sector-specific approach with employment provisions expected.
      </p>

      <h2>Common Multi-State Pitfalls</h2>

      <h3>❌ Assuming state boundaries matter for remote roles</h3>
      <p>
        <strong>The problem:</strong> "Our company is based in Texas, so we don't need to worry about NYC law."
      </p>
      <p>
        <strong>The reality:</strong> If you hire a candidate <em>located</em> in NYC, LL144 applies—regardless of 
        where your company is headquartered.
      </p>

      <h3>❌ One-size-fits-all disclosure</h3>
      <p>
        <strong>The problem:</strong> Using generic "AI may be used" language everywhere.
      </p>
      <p>
        <strong>The reality:</strong> Disclosure requirements vary significantly (timing, specificity, format). 
        Build disclosures that satisfy the most demanding standard.
      </p>

      <h3>❌ Ignoring municipal laws</h3>
      <p>
        <strong>The problem:</strong> Tracking only state laws and missing city-specific requirements.
      </p>
      <p>
        <strong>The reality:</strong> NYC, SF, Portland, and others have requirements beyond their states. Your 
        compliance program must track municipal laws.
      </p>

      <h3>❌ Delayed compliance for new states</h3>
      <p>
        <strong>The problem:</strong> "We'll deal with Massachusetts when their law passes."
      </p>
      <p>
        <strong>The reality:</strong> Laws often have short implementation windows. Waiting until passage creates 
        rushed, incomplete compliance.
      </p>

      <h2>How EmployArmor Simplifies Multi-State Compliance</h2>

      <p>
        Managing 17+ state laws manually is impossible at scale. EmployArmor provides:
      </p>

      <ul>
        <li><strong>Jurisdictional intelligence:</strong> We map your hiring footprint to every applicable law 
        (state and municipal)</li>
        <li><strong>Compliance crosswalk:</strong> Identify overlapping requirements and build unified processes</li>
        <li><strong>Tool-specific guidance:</strong> Map each AI tool to relevant compliance obligations</li>
        <li><strong>Regulatory monitoring:</strong> Real-time alerts when new laws pass or existing laws change</li>
        <li><strong>Multi-state disclosure generation:</strong> Create compliant disclosures that work everywhere</li>
        <li><strong>Audit coordination:</strong> Manage bias audits across multiple jurisdictions</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Hiring in multiple states?</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Multi-State Compliance Assessment →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>If we operate in a state without an AI hiring law, are we exempt from all requirements?</h3>
      <p>
        Not necessarily. Federal anti-discrimination law (Title VII, ADA, ADEA) applies everywhere. The EEOC's position 
        is that AI tools must comply with existing civil rights protections regardless of state-specific AI laws. 
        You're never exempt from ensuring your AI tools don't discriminate.
      </p>

      <h3>Do state AI hiring laws apply to contract workers and gig workers?</h3>
      <p>
        Most laws define applicability by "employment" or "hiring," which may or may not include contractors depending 
        on state employment law definitions. Illinois AIVIA, for example, covers "applicants for employment"—a term 
        with established legal meaning. When in doubt, apply AI hiring law protections to all worker classifications.
      </p>

      <h3>What if we use an AI tool provided by a recruiting agency?</h3>
      <p>
        You're still responsible for compliance. The fact that a third party (recruiter or vendor) provides the AI tool 
        doesn't shift legal liability away from you as the employer. You must ensure any agency you work with uses 
        compliant AI tools.
      </p>

      <h3>Can we use different AI tools in different states to simplify compliance?</h3>
      <p>
        Technically yes, but operationally complex. You'd need to track candidate location, route them to appropriate 
        workflows, and maintain multiple vendor relationships. For most employers, it's simpler to use compliant tools 
        everywhere and absorb the higher cost as the price of national hiring.
      </p>

      <h3>How often do these laws change?</h3>
      <p>
        Constantly. In 2025 alone, 8 states amended or passed new AI hiring laws. Expect ongoing legislative activity 
        for the next 3-5 years as jurisdictions respond to enforcement experiences and new AI capabilities. You need 
        a system for tracking changes, not a one-time compliance checklist.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">Complete AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/illinois-aivia-compliance-guide" className="text-blue-600 hover:underline">Illinois AIVIA Deep Dive</Link></li>
        <li><Link href="/resources/maryland-ai-hiring-law" className="text-blue-600 hover:underline">Maryland HB 1202 Guide</Link></li>
        <li><Link href="/resources/federal-ai-hiring-laws" className="text-blue-600 hover:underline">Federal AI Hiring Landscape</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
