import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "Texas AI Hiring Law (TRAIGA) 2026: Complete Employer Compliance Guide",
  description: "Everything employers need to know about Texas TRAIGA (Responsible AI Governance Act), CUBI biometric law, and Texas Labor Code Chapter 21. Effective January 1, 2026.",
}

export default function TexasAIHiringLawPage() {
  return (
    <ArticleLayout
      title="Texas AI Hiring Law (TRAIGA): Complete 2026 Compliance Guide"
      description="Texas enacts TRAIGA (Responsible Artificial Intelligence Governance Act) effective January 1, 2026. Learn the intent-based discrimination prohibition, CUBI biometric requirements, and Texas-specific compliance obligations."
      category="State Law"
      readTime="16 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        On January 1, 2026, Texas became one of the first states to regulate artificial intelligence in employment 
        with the passage of the <strong>Texas Responsible Artificial Intelligence Governance Act (TRAIGA)</strong>. 
        Unlike other state laws that focus on transparency and bias audits, Texas takes a unique approach: prohibiting 
        <strong> intentional discrimination</strong> through AI systems while maintaining a business-friendly regulatory 
        environment that avoids prescriptive audit and disclosure mandates.
      </p>

      <p>
        For Texas employers, TRAIGA adds a new layer of compliance obligations on top of existing requirements under:
      </p>
      <ul>
        <li><strong>Texas Labor Code Chapter 21</strong> — General employment discrimination protections</li>
        <li><strong>Texas CUBI</strong> (Capture or Use of Biometric Identifier Act) — Biometric data privacy</li>
        <li><strong>Federal law</strong> — Title VII, ADA, ADEA, and EEOC guidance on AI</li>
      </ul>

      <p>
        This comprehensive guide covers everything Texas employers need to know about AI hiring compliance in 2026.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-3">Texas AI Employment Law at a Glance (Effective January 1, 2026):</p>
        <ul className="text-blue-800 space-y-2">
          <li>✓ <strong>TRAIGA:</strong> Prohibits intentional AI discrimination (all employers)</li>
          <li>✓ <strong>No bias audit mandate</strong> (unlike NYC or Colorado)</li>
          <li>✓ <strong>No AI disclosure requirement</strong> for private employers</li>
          <li>✓ <strong>Intent-based standard:</strong> Disparate impact alone doesn't prove violation</li>
          <li>✓ <strong>Texas AG enforcement:</strong> Exclusive enforcement authority</li>
          <li>✓ <strong>CUBI compliance:</strong> Biometric consent required (facial recognition, voice analysis)</li>
          <li>✓ <strong>Chapter 21 applies:</strong> Traditional discrimination law covers AI outcomes</li>
        </ul>
      </div>

      <h2>Texas Responsible Artificial Intelligence Governance Act (TRAIGA)</h2>

      <h3>Legislative Background</h3>
      <p>
        TRAIGA was passed by the Texas Legislature and signed into law in 2025, effective January 1, 2026. The law 
        positions Texas as a leader in balancing AI innovation with civil rights protection. Unlike more prescriptive 
        state laws, TRAIGA focuses on <strong>intent-based discrimination prohibition</strong> without imposing 
        burdensome compliance requirements like mandatory bias audits or public disclosures.
      </p>

      <p>
        The law emerged from bipartisan concerns about algorithmic bias while respecting Texas's pro-business regulatory 
        philosophy. Texas employers now face clear anti-discrimination obligations without the administrative overhead 
        seen in states like New York or Colorado.
      </p>

      <h3>Who Is Covered by TRAIGA?</h3>
      <p>
        TRAIGA applies to <strong>all employers operating in Texas</strong>, regardless of size. This is a significant 
        departure from federal law (Title VII) and Texas Labor Code Chapter 21, which generally apply to employers with 
        15 or more employees.
      </p>

      <p>
        <strong>Covered entities include:</strong>
      </p>
      <ul>
        <li>Private employers of any size hiring or managing employees in Texas</li>
        <li>Staffing agencies and third-party recruiters</li>
        <li>Out-of-state employers hiring Texas residents or making employment decisions affecting Texas workers</li>
        <li>AI developers and vendors deploying systems used for Texas employment decisions</li>
        <li>Gig economy platforms and contractor management systems (if employment relationship exists)</li>
      </ul>

      <p>
        <strong>Not covered (exemptions):</strong>
      </p>
      <ul>
        <li>Compliant financial institutions and insurance companies (regulated separately)</li>
        <li>Federal government agencies (governed by federal AI procurement rules)</li>
      </ul>

      <h3>Core Prohibition: Intentional AI Discrimination</h3>
      <p>
        TRAIGA prohibits any person from <strong>"developing or deploying an AI system with the intent to unlawfully 
        discriminate"</strong> against individuals based on protected characteristics in employment decisions.
      </p>

      <h4>Protected Classes Under TRAIGA:</h4>
      <ul>
        <li>Race and color</li>
        <li>National origin and ancestry</li>
        <li>Sex (including pregnancy, sexual orientation, gender identity)</li>
        <li>Religion and creed</li>
        <li>Age (40 and over under ADEA; all ages under Texas law)</li>
        <li>Disability (physical and mental)</li>
        <li>Genetic information</li>
      </ul>

      <h4>Covered Employment Decisions:</h4>
      <ul>
        <li>Recruitment and job advertising</li>
        <li>Application screening and resume review</li>
        <li>Interviewing and candidate assessment</li>
        <li>Hiring and selection</li>
        <li>Promotion and advancement</li>
        <li>Training and professional development opportunities</li>
        <li>Performance evaluation and review</li>
        <li>Compensation and benefits decisions</li>
        <li>Discipline, demotion, and corrective action</li>
        <li>Termination and discharge</li>
        <li>Terms, conditions, and privileges of employment</li>
      </ul>

      <h3>The Intent Requirement: What It Means</h3>
      <p>
        TRAIGA's most distinctive feature is its <strong>intent-based standard</strong>. Unlike laws that prohibit 
        disparate impact (outcomes-based liability), TRAIGA requires proof of intentional discrimination.
      </p>

      <h4>What Proves Intent?</h4>
      <ul>
        <li><strong>Design choices:</strong> Explicitly programming AI to weight protected characteristics negatively</li>
        <li><strong>Known bias:</strong> Deploying AI after discovering it discriminates and choosing not to fix it</li>
        <li><strong>Proxy variables:</strong> Intentionally using proxies (zip code, school names) to discriminate</li>
        <li><strong>Deliberate indifference:</strong> Recklessly ignoring obvious discriminatory outcomes</li>
        <li><strong>Documentation:</strong> Internal communications showing discriminatory intent</li>
      </ul>

      <h4>What Doesn't Prove Intent (Under TRAIGA Alone)?</h4>
      <ul>
        <li><strong>Disparate impact alone:</strong> Statistical evidence showing AI disproportionately affects protected groups</li>
        <li><strong>Vendor bias:</strong> Third-party AI tools with unintended bias (if employer acts in good faith)</li>
        <li><strong>Historical data bias:</strong> AI reflecting past discrimination in training data without employer knowledge</li>
        <li><strong>Unintended outcomes:</strong> Results that correlate with protected classes despite neutral design</li>
      </ul>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">Critical Distinction: TRAIGA vs. Chapter 21</p>
        <p className="text-amber-700 mb-2">
          While TRAIGA requires intent, <strong>Texas Labor Code Chapter 21</strong> (for 15+ employee employers) 
          and <strong>federal law</strong> still allow disparate impact claims without proving intent.
        </p>
        <p className="text-amber-700">
          <strong>Bottom line:</strong> Even if you're not violating TRAIGA, AI that causes disparate impact can still 
          violate Chapter 21, Title VII, or EEOC guidelines. Don't assume the intent standard protects you from all liability.
        </p>
      </div>

      <h3>Biometric Data Prohibition</h3>
      <p>
        TRAIGA separately prohibits AI systems from capturing biometric data (facial recognition, voice analysis, 
        fingerprints, retina scans) <strong>without obtaining consent</strong>. This overlaps with and reinforces 
        Texas CUBI requirements (discussed below).
      </p>

      <h3>Enforcement and Penalties</h3>

      <h4>Texas Attorney General (Exclusive Enforcement)</h4>
      <p>
        The <strong>Texas Attorney General</strong> has exclusive authority to enforce TRAIGA. There is <strong>no 
        private right of action</strong> under TRAIGA itself, meaning individuals cannot sue directly for TRAIGA 
        violations (though they can still sue under Chapter 21, federal law, or CUBI).
      </p>

      <p>
        The AG may:
      </p>
      <ul>
        <li><strong>Issue civil investigative demands</strong> requiring documents, data, and testimony</li>
        <li><strong>Conduct investigations</strong> into alleged intentional AI discrimination</li>
        <li><strong>Seek injunctive relief</strong> to stop discriminatory AI deployment</li>
        <li><strong>Impose civil penalties</strong> (amounts not yet specified in published guidance)</li>
        <li><strong>Negotiate consent decrees</strong> requiring corrective action and monitoring</li>
      </ul>

      <h4>No Private Lawsuits Under TRAIGA</h4>
      <p>
        Unlike many state AI laws, TRAIGA does not create a new private cause of action. This means:
      </p>
      <ul>
        <li>Individuals cannot sue employers directly for TRAIGA violations</li>
        <li>Class action lawsuits based solely on TRAIGA are not possible</li>
        <li>Enforcement is limited to state action by the AG</li>
      </ul>

      <p>
        <strong>However,</strong> affected individuals can still sue under:
      </p>
      <ul>
        <li>Texas Labor Code Chapter 21 (traditional discrimination claims)</li>
        <li>Federal laws (Title VII, ADA, ADEA)</li>
        <li>Texas CUBI (biometric data violations with private right of action)</li>
      </ul>

      <h3>Regulatory Sandbox for AI Innovation</h3>
      <p>
        TRAIGA includes a <strong>regulatory sandbox program</strong> allowing companies to test innovative AI systems 
        in employment with temporary regulatory relief. This program aims to foster AI development while ensuring 
        safeguards are in place.
      </p>

      <p>
        Sandbox participants receive:
      </p>
      <ul>
        <li>Limited immunity from certain regulatory requirements during testing periods</li>
        <li>Technical assistance from state agencies</li>
        <li>Expedited approval processes for compliant AI systems</li>
      </ul>

      <p>
        Contact the Texas Workforce Commission or Attorney General's office for sandbox application details.
      </p>

      <h2>Texas Labor Code Chapter 21: Traditional Discrimination Law Applies to AI</h2>

      <p>
        Even before TRAIGA, Texas Labor Code Chapter 21 (the state's equivalent to federal Title VII) has applied to 
        AI-driven employment decisions. Chapter 21 remains the primary vehicle for individual discrimination claims.
      </p>

      <h3>Who Is Covered by Chapter 21?</h3>
      <p>
        Chapter 21 applies to employers with <strong>15 or more employees</strong>, covering:
      </p>
      <ul>
        <li>Private employers</li>
        <li>State and local government agencies</li>
        <li>Labor unions and employment agencies</li>
      </ul>

      <h3>Protected Classes</h3>
      <p>
        Chapter 21 prohibits discrimination based on:
      </p>
      <ul>
        <li>Race, color, national origin</li>
        <li>Religion</li>
        <li>Sex (including pregnancy)</li>
        <li>Age</li>
        <li>Disability</li>
        <li>Genetic information</li>
      </ul>

      <h3>How Chapter 21 Applies to AI Hiring</h3>

      <h4>Disparate Treatment</h4>
      <p>
        If an employer <strong>intentionally</strong> uses AI to discriminate (e.g., programming AI to downweight female 
        candidates), this violates Chapter 21 as disparate treatment.
      </p>

      <h4>Disparate Impact</h4>
      <p>
        Even without intent, if AI produces <strong>statistically significant adverse impact</strong> on protected groups, 
        it may violate Chapter 21. Employers must show AI tools are:
      </p>
      <ul>
        <li><strong>Job-related:</strong> AI criteria actually predict job performance</li>
        <li><strong>Business necessity:</strong> No equally valid alternative with less discriminatory impact</li>
        <li><strong>Validated:</strong> Supported by proper validation studies</li>
      </ul>

      <h4>Employer Liability for AI Vendors</h4>
      <p>
        Texas courts have consistently held that employers are responsible for discriminatory outcomes from third-party 
        vendors, including AI tools. You cannot delegate liability to vendors—even if the vendor created the AI, the 
        employer is accountable for its use.
      </p>

      <h3>Texas Workforce Commission (TWC) Enforcement</h3>

      <p>
        The <strong>Texas Workforce Commission Civil Rights Division</strong> investigates and enforces Chapter 21 
        complaints. The process parallels EEOC procedures:
      </p>

      <ol>
        <li><strong>Charge Filing:</strong> Individual files discrimination charge with TWC (180-day deadline, extendable to 300 days if also filed with EEOC)</li>
        <li><strong>Investigation:</strong> TWC investigates, requesting documents and interviewing witnesses</li>
        <li><strong>Mediation:</strong> TWC offers voluntary mediation</li>
        <li><strong>Determination:</strong> TWC issues "Cause" or "No Cause" finding</li>
        <li><strong>Right to Sue:</strong> If cause found or TWC doesn't resolve, individual receives right-to-sue letter</li>
        <li><strong>Lawsuit:</strong> Individual can sue in Texas state court within 2 years</li>
      </ol>

      <h3>Remedies Under Chapter 21</h3>
      <p>
        Successful plaintiffs can recover:
      </p>
      <ul>
        <li><strong>Back pay and benefits:</strong> Lost wages from date of discrimination</li>
        <li><strong>Front pay:</strong> Future lost earnings if reinstatement isn't feasible</li>
        <li><strong>Compensatory damages:</strong> Emotional distress, mental anguish, loss of reputation (capped at $300,000 for employers with 500+ employees)</li>
        <li><strong>Punitive damages:</strong> Available for intentional or reckless violations</li>
        <li><strong>Injunctive relief:</strong> Court orders to change practices, implement monitoring, provide training</li>
        <li><strong>Attorney's fees and costs:</strong> Prevailing plaintiffs recover legal expenses</li>
      </ul>

      <h2>Texas CUBI: Biometric Data Privacy Law</h2>

      <p>
        The <strong>Capture or Use of Biometric Identifier Act (CUBI)</strong>, codified at Texas Business & Commerce 
        Code §503.001 et seq., regulates the collection, storage, and use of biometric identifiers in all contexts, 
        including employment.
      </p>

      <h3>What Is a "Biometric Identifier" Under CUBI?</h3>
      <p>
        CUBI defines biometric identifiers as:
      </p>
      <ul>
        <li><strong>Fingerprints</strong></li>
        <li><strong>Retina or iris scans</strong></li>
        <li><strong>Voiceprints</strong> (voice pattern analysis)</li>
        <li><strong>Facial geometry</strong> (measurements of facial features)</li>
        <li><strong>Hand or palm scans</strong></li>
        <li><strong>Gait or behavioral patterns</strong></li>
      </ul>

      <p>
        <strong>Not covered:</strong> Photographs, video recordings, or audio recordings that are not analyzed for 
        biometric patterns (e.g., a simple video interview recording without facial analysis software).
      </p>

      <h3>When CUBI Applies to AI Hiring Tools</h3>

      <h4>Common AI Tools Triggering CUBI:</h4>
      <ul>
        <li><strong>HireVue:</strong> Facial expression analysis, speech pattern evaluation</li>
        <li><strong>Modern Hire:</strong> Video interview analysis with emotion detection</li>
        <li><strong>Pymetrics:</strong> Behavioral biometric game assessments</li>
        <li><strong>VidCruiter:</strong> Facial recognition for identity verification</li>
        <li><strong>Voice AI tools:</strong> Accent analysis, tone evaluation, speech stress detection</li>
        <li><strong>Background check services:</strong> Fingerprint-based identity verification</li>
      </ul>

      <h3>CUBI Requirements</h3>

      <h4>1. Advance Notice</h4>
      <p>
        Before collecting biometric data, employers must inform candidates:
      </p>
      <ul>
        <li>That biometric data will be collected</li>
        <li>The specific type of biometric identifier (facial geometry, voiceprint, etc.)</li>
        <li>The purpose for collection</li>
        <li>How long the data will be retained</li>
      </ul>

      <h4>2. Written Consent</h4>
      <p>
        Obtain <strong>affirmative written consent</strong> before capturing or using biometric identifiers. Consent must:
      </p>
      <ul>
        <li>Be separate from general terms of service or application acknowledgments</li>
        <li>Clearly identify what biometric data is collected</li>
        <li>Allow the individual to opt in (not opt out)</li>
        <li>Be documented with date and method of consent</li>
      </ul>

      <h4>3. Reasonable Care in Storage and Transmission</h4>
      <p>
        CUBI requires "reasonable care" to protect biometric data from unauthorized access. Best practices include:
      </p>
      <ul>
        <li><strong>Encryption:</strong> At-rest and in-transit encryption</li>
        <li><strong>Access controls:</strong> Limit who can view biometric data</li>
        <li><strong>Secure deletion:</strong> Permanent deletion protocols when retention period expires</li>
        <li><strong>Vendor security:</strong> Ensure third-party AI providers meet CUBI standards</li>
        <li><strong>Breach notification:</strong> Plan for responding to biometric data breaches</li>
      </ul>

      <h4>4. No Sale or Disclosure Without Consent</h4>
      <p>
        Biometric data cannot be sold, leased, or disclosed to third parties without explicit consent, except:
      </p>
      <ul>
        <li>To complete the purpose for which it was collected (e.g., sharing with AI vendor for analysis)</li>
        <li>In response to court orders, subpoenas, or search warrants</li>
        <li>With written consent from the individual</li>
      </ul>

      <h3>CUBI Penalties and Enforcement</h3>

      <h4>Civil Penalties</h4>
      <ul>
        <li><strong>Up to $25,000 per violation</strong> for intentional or reckless violations</li>
        <li>Penalties apply per individual affected (e.g., $25,000 x 100 applicants = $2.5 million exposure)</li>
      </ul>

      <h4>Private Right of Action</h4>
      <p>
        Unlike TRAIGA, CUBI provides a <strong>private right of action</strong>. Individuals can sue directly for:
      </p>
      <ul>
        <li><strong>Actual damages:</strong> Proven economic or emotional harm</li>
        <li><strong>Injunctive relief:</strong> Court orders to stop collection or delete data</li>
        <li><strong>Attorney's fees:</strong> Prevailing plaintiffs recover legal costs</li>
      </ul>

      <p>
        <strong>No statutory damages:</strong> Unlike Illinois BIPA (which provides $1,000-$5,000 per violation), CUBI 
        requires proof of actual harm for damage awards beyond the $25,000 civil penalty.
      </p>

      <h3>CUBI vs. Illinois BIPA: Key Differences</h3>

      <table className="min-w-full border-collapse border border-gray-300 my-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Aspect</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Texas CUBI</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Illinois BIPA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Notice</strong></td>
            <td className="border border-gray-300 px-3 py-2">Required before collection</td>
            <td className="border border-gray-300 px-3 py-2">Required with detailed written policy</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Consent</strong></td>
            <td className="border border-gray-300 px-3 py-2">Written consent required</td>
            <td className="border border-gray-300 px-3 py-2">Written release required</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Retention</strong></td>
            <td className="border border-gray-300 px-3 py-2">Disclose retention period</td>
            <td className="border border-gray-300 px-3 py-2">Must have written retention schedule and destruction guidelines</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Storage</strong></td>
            <td className="border border-gray-300 px-3 py-2">"Reasonable care"</td>
            <td className="border border-gray-300 px-3 py-2">"Same or more protective than other confidential information"</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Damages</strong></td>
            <td className="border border-gray-300 px-3 py-2">Actual damages only</td>
            <td className="border border-gray-300 px-3 py-2">$1,000 per negligent violation, $5,000 per intentional/reckless</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Civil Penalty</strong></td>
            <td className="border border-gray-300 px-3 py-2">Up to $25,000 (intentional/reckless)</td>
            <td className="border border-gray-300 px-3 py-2">None (statutory damages apply)</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Enforcement</strong></td>
            <td className="border border-gray-300 px-3 py-2">Private lawsuits for actual damages + $25K penalty</td>
            <td className="border border-gray-300 px-3 py-2">Private lawsuits for statutory damages ($1K-$5K per violation)</td>
          </tr>
        </tbody>
      </table>

      <p className="text-sm text-gray-600">
        <strong>Practical takeaway:</strong> If you're BIPA-compliant, you likely satisfy CUBI. However, CUBI's 
        "reasonable care" standard may be more flexible than BIPA's stringent requirements.
      </p>

      <h3>Sample CUBI-Compliant Biometric Consent Form</h3>

      <div className="bg-gray-50 border rounded-lg p-6 my-6 text-sm">
        <p className="font-semibold mb-3">Biometric Information Collection Notice and Consent</p>
        
        <p className="mb-2">
          [Company Name] uses video interview technology provided by [Vendor Name] that collects and analyzes 
          <strong> biometric identifiers</strong> as described below.
        </p>

        <p className="mb-2"><strong>What Biometric Data We Collect:</strong></p>
        <ul className="mb-3 ml-4 list-disc">
          <li>Facial geometry (measurements and analysis of facial features)</li>
          <li>Voiceprint (speech patterns, tone, pitch, and cadence)</li>
          <li>[Add other biometric data types if applicable]</li>
        </ul>

        <p className="mb-2"><strong>Purpose of Collection:</strong></p>
        <p className="mb-3">
          We collect this biometric data to evaluate your communication skills, presentation, and suitability for 
          the role during the video interview process. The AI system analyzes your responses to provide our hiring 
          team with standardized assessment metrics.
        </p>

        <p className="mb-2"><strong>Retention Period:</strong></p>
        <p className="mb-3">
          Your biometric data will be retained for [specify period, e.g., "the duration of the hiring process plus 
          3 years," "6 months following completion of the hiring process"]. After this period, we will permanently 
          delete your biometric data unless we notify you and obtain additional consent for extended retention.
        </p>

        <p className="mb-2"><strong>Data Protection:</strong></p>
        <p className="mb-3">
          We store biometric data with reasonable security measures including encryption, access controls, and secure 
          transmission protocols. We will not sell, lease, trade, or otherwise disclose your biometric identifiers to 
          third parties without your explicit consent, except as necessary to complete the purpose described above or 
          as required by law.
        </p>

        <p className="mb-2"><strong>Your Rights:</strong></p>
        <ul className="mb-3 ml-4 list-disc">
          <li>You may request deletion of your biometric data at any time</li>
          <li>You may withdraw consent, though this may affect your ability to participate in our hiring process</li>
          <li>You have the right to request information about how we use your biometric data</li>
        </ul>

        <p className="mt-4 mb-2"><strong>Your Consent:</strong></p>
        <p className="mb-2">
          By checking the box below and signing, you acknowledge that you have read and understood this notice and 
          consent to [Company Name]'s collection, use, and storage of your biometric identifiers as described above.
        </p>

        <p className="mb-2">
          ☐ <strong>I consent</strong> to [Company Name]'s collection and use of my biometric identifiers.
        </p>

        <p className="text-xs italic mt-4">
          Candidate Signature: _________________________ Date: ____________
        </p>
      </div>

      <h2>Multi-State Compliance: Texas in Context</h2>

      <h3>Comparison: Texas vs. Major State AI Laws</h3>

      <table className="min-w-full border-collapse border border-gray-300 my-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Requirement</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Texas (TRAIGA)</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Illinois (HB 3773)</th>
            <th className="border border-gray-300 px-3 py-2 text-left">NYC (Law 144)</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Colorado (SB 205)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Scope</strong></td>
            <td className="border border-gray-300 px-3 py-2">All employers</td>
            <td className="border border-gray-300 px-3 py-2">All employers</td>
            <td className="border border-gray-300 px-3 py-2">NYC employers only</td>
            <td className="border border-gray-300 px-3 py-2">High-risk AI systems</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Standard</strong></td>
            <td className="border border-gray-300 px-3 py-2">Intent required</td>
            <td className="border border-gray-300 px-3 py-2">Disparate impact</td>
            <td className="border border-gray-300 px-3 py-2">Disparate impact</td>
            <td className="border border-gray-300 px-3 py-2">Disparate impact</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>AI Disclosure</strong></td>
            <td className="border border-gray-300 px-3 py-2">Not required</td>
            <td className="border border-gray-300 px-3 py-2">Required</td>
            <td className="border border-gray-300 px-3 py-2">Required (10 days)</td>
            <td className="border border-gray-300 px-3 py-2">Required</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Bias Audit</strong></td>
            <td className="border border-gray-300 px-3 py-2">Not required</td>
            <td className="border border-gray-300 px-3 py-2">Not required</td>
            <td className="border border-gray-300 px-3 py-2">Annual required</td>
            <td className="border border-gray-300 px-3 py-2">Impact assessments</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Biometric Law</strong></td>
            <td className="border border-gray-300 px-3 py-2">CUBI (consent)</td>
            <td className="border border-gray-300 px-3 py-2">BIPA (strict)</td>
            <td className="border border-gray-300 px-3 py-2">None (general)</td>
            <td className="border border-gray-300 px-3 py-2">CPA (consent)</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Enforcement</strong></td>
            <td className="border border-gray-300 px-3 py-2">AG only (TRAIGA)</td>
            <td className="border border-gray-300 px-3 py-2">IDHR + private</td>
            <td className="border border-gray-300 px-3 py-2">NYC CHR</td>
            <td className="border border-gray-300 px-3 py-2">AG + private (2029)</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Private Action</strong></td>
            <td className="border border-gray-300 px-3 py-2">No (TRAIGA) / Yes (Ch. 21, CUBI)</td>
            <td className="border border-gray-300 px-3 py-2">Yes (IHRA)</td>
            <td className="border border-gray-300 px-3 py-2">No</td>
            <td className="border border-gray-300 px-3 py-2">Yes (2029)</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2"><strong>Effective Date</strong></td>
            <td className="border border-gray-300 px-3 py-2">Jan 1, 2026</td>
            <td className="border border-gray-300 px-3 py-2">Jan 1, 2026</td>
            <td className="border border-gray-300 px-3 py-2">In effect (2023)</td>
            <td className="border border-gray-300 px-3 py-2">Feb 1, 2026</td>
          </tr>
        </tbody>
      </table>

      <h3>Texas's Unique Position</h3>
      <p>
        Texas distinguishes itself by:
      </p>
      <ul>
        <li><strong>Light-touch regulation:</strong> No audits, no mandatory disclosures (for TRAIGA)</li>
        <li><strong>Intent-based standard:</strong> Higher burden of proof protects employers from outcomes-based liability under TRAIGA</li>
        <li><strong>Pro-innovation:</strong> Regulatory sandbox encourages AI development</li>
        <li><strong>AG-only enforcement:</strong> Reduces litigation risk compared to private-action states</li>
      </ul>

      <p>
        However, don't mistake this for weak enforcement—Chapter 21 and federal law still apply full disparate impact 
        standards, and CUBI creates significant biometric liability.
      </p>

      <h2>Practical Compliance Guide for Texas Employers</h2>

      <h3>Step 1: Conduct AI Inventory (Deadline: Before January 1, 2026)</h3>

      <h4>What to Document:</h4>
      <ul>
        <li><strong>Tool name and vendor</strong></li>
        <li><strong>AI functionality:</strong> What does the AI actually do? (screen, score, analyze, predict)</li>
        <li><strong>Employment decisions affected:</strong> Hiring, promotion, performance management, termination</li>
        <li><strong>Biometric data use:</strong> Does it capture facial recognition, voice analysis, or other biometrics?</li>
        <li><strong>Data inputs:</strong> What information does the AI process?</li>
        <li><strong>Output type:</strong> Scores, rankings, recommendations, or automated decisions?</li>
        <li><strong>Human review:</strong> How do humans use AI output in final decisions?</li>
      </ul>

      <h4>Common Tools Requiring Review:</h4>
      <ul>
        <li><Link href="/resources/hirevue-compliance" className="text-blue-600 hover:underline">HireVue</Link> — Video interview analysis</li>
        <li><Link href="/resources/workday-ai-compliance" className="text-blue-600 hover:underline">Workday Recruiting</Link> — Predictive analytics</li>
        <li><Link href="/resources/indeed-ai-compliance" className="text-blue-600 hover:underline">Indeed Smart Sourcing</Link> — Candidate matching</li>
        <li><Link href="/resources/linkedin-recruiter-ai-compliance" className="text-blue-600 hover:underline">LinkedIn Recruiter</Link> — AI-powered recommendations</li>
        <li><Link href="/resources/greenhouse-ats-compliance" className="text-blue-600 hover:underline">Greenhouse</Link> — Structured hiring workflows</li>
      </ul>

      <h3>Step 2: Implement CUBI Compliance for Biometric Tools</h3>

      <h4>For Each Biometric AI Tool:</h4>
      <ol>
        <li><strong>Create biometric notice:</strong> Draft clear explanation of what biometric data is collected and why</li>
        <li><strong>Design consent form:</strong> Separate, explicit opt-in consent (use sample above as template)</li>
        <li><strong>Integrate into workflow:</strong> Present notice and collect consent before AI use</li>
        <li><strong>Document consent:</strong> Store signed consent forms with timestamps</li>
        <li><strong>Implement security:</strong> Encrypt biometric data, restrict access, secure vendor transmission</li>
        <li><strong>Establish retention policy:</strong> Define deletion timelines and procedures</li>
        <li><strong>Train staff:</strong> Ensure HR knows when and how to obtain biometric consent</li>
      </ol>

      <h3>Step 3: Mitigate Intentional Discrimination Risk (TRAIGA Compliance)</h3>

      <h4>Documentation Review:</h4>
      <ul>
        <li><strong>Audit internal communications:</strong> Review emails, Slack messages, meeting notes discussing AI tool selection or configuration</li>
        <li><strong>Remove problematic language:</strong> Eliminate references to protected characteristics in AI requirements</li>
        <li><strong>Document legitimate criteria:</strong> Clearly articulate job-related reasons for AI design choices</li>
      </ul>

      <h4>AI Configuration Review:</h4>
      <ul>
        <li><strong>Check for protected class inputs:</strong> Ensure AI doesn't directly consider race, sex, age, etc.</li>
        <li><strong>Evaluate proxy variables:</strong> Review whether zip code, school names, or other proxies correlate with protected classes</li>
        <li><strong>Test for bias:</strong> Even though not required under TRAIGA, testing helps avoid Chapter 21/federal liability</li>
      </ul>

      <h4>Vendor Due Diligence:</h4>
      <ul>
        <li>Request vendor bias testing reports</li>
        <li>Review vendor compliance documentation</li>
        <li>Include TRAIGA and CUBI compliance obligations in vendor contracts</li>
        <li>Require vendors to notify you of algorithm changes</li>
      </ul>

      <h3>Step 4: Prepare for Chapter 21 Disparate Impact Claims</h3>

      <p>
        Even if you comply with TRAIGA's intent standard, protect against traditional discrimination claims:
      </p>

      <h4>Voluntary Bias Testing:</h4>
      <ul>
        <li><strong>Analyze selection rates:</strong> Compare AI outcomes by race, sex, age (if data available)</li>
        <li><strong>Calculate impact ratios:</strong> Use four-fifths rule (80% benchmark)</li>
        <li><strong>Statistical significance testing:</strong> Confirm whether differences are statistically meaningful</li>
        <li><strong>Document remediation:</strong> If bias found, document corrective action taken</li>
      </ul>

      <h4>Job-Relatedness Validation:</h4>
      <ul>
        <li>Ensure AI criteria predict actual job performance</li>
        <li>Conduct or obtain validation studies (content, criterion, or construct validity)</li>
        <li>Document business justification for AI use</li>
        <li>Explore less discriminatory alternatives if disparate impact found</li>
      </ul>

      <h4>Human Oversight:</h4>
      <ul>
        <li>Never allow AI to make final decisions without human review</li>
        <li>Train reviewers to override biased AI recommendations</li>
        <li>Document when humans deviate from AI output (and why)</li>
      </ul>

      <h3>Step 5: Establish Recordkeeping Systems</h3>

      <h4>Records to Maintain:</h4>
      <ul>
        <li><strong>AI inventory and tool documentation</strong></li>
        <li><strong>CUBI biometric consents</strong> (with timestamps and versions)</li>
        <li><strong>Vendor contracts and compliance documentation</strong></li>
        <li><strong>Bias testing reports and remediation efforts</strong></li>
        <li><strong>AI design and configuration documentation</strong></li>
        <li><strong>Training records</strong> for HR staff on AI compliance</li>
        <li><strong>Candidate inquiries</strong> about AI use and employer responses</li>
        <li><strong>System change logs</strong> documenting AI updates or modifications</li>
      </ul>

      <h4>Retention Periods:</h4>
      <ul>
        <li><strong>3 years minimum:</strong> Align with federal recordkeeping requirements</li>
        <li><strong>CUBI consents:</strong> Retain for duration of retention period disclosed + 3 years</li>
        <li><strong>Litigation hold:</strong> Preserve all records if complaints filed</li>
      </ul>

      <h3>Step 6: Train HR and Hiring Teams</h3>

      <h4>Training Topics:</h4>
      <ul>
        <li><strong>TRAIGA overview:</strong> What intentional AI discrimination means</li>
        <li><strong>CUBI requirements:</strong> When and how to obtain biometric consent</li>
        <li><strong>Chapter 21 basics:</strong> Traditional discrimination law still applies</li>
        <li><strong>Tool identification:</strong> Which AI systems require compliance measures</li>
        <li><strong>Candidate communications:</strong> How to explain AI use when asked</li>
        <li><strong>Escalation procedures:</strong> When to involve legal/compliance teams</li>
      </ul>

      <h4>Roles to Train:</h4>
      <ul>
        <li>HR generalists and recruiters</li>
        <li>Hiring managers and interview panelists</li>
        <li>Talent acquisition specialists</li>
        <li>IT/HR systems administrators</li>
        <li>Third-party recruiters or staffing partners</li>
      </ul>

      <h3>Step 7: Monitor for Compliance and Regulatory Updates</h3>

      <h4>Ongoing Monitoring:</h4>
      <ul>
        <li><strong>Quarterly AI audits:</strong> Review tools for bias and compliance</li>
        <li><strong>Vendor check-ins:</strong> Confirm continued compliance, request updated testing</li>
        <li><strong>Regulatory tracking:</strong> Monitor Texas AG guidance, TWC updates, court decisions</li>
        <li><strong>Policy updates:</strong> Revise AI policies as laws or tools change</li>
      </ul>

      <h4>Key Resources to Monitor:</h4>
      <ul>
        <li><a href="https://www.texasattorneygeneral.gov" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Texas Attorney General's Office</a> — TRAIGA guidance and enforcement actions</li>
        <li><a href="https://www.twc.texas.gov/businesses/civil-rights-division" className="text-blue-600 hover:underline" target="_blank" rel="noopener">Texas Workforce Commission Civil Rights Division</a> — Chapter 21 enforcement and resources</li>
        <li>Texas Legislature — Watch for future AI employment bills</li>
        <li>Industry groups — SHRM Texas, Texas Association of Business</li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <h3>Do small businesses (under 15 employees) have to comply with TRAIGA?</h3>
      <p>
        Yes. TRAIGA applies to <strong>all employers</strong>, regardless of size. This is different from Chapter 21 
        (which applies to 15+ employee employers). Even a 2-person startup using AI in hiring must comply with TRAIGA's 
        prohibition on intentional discrimination and CUBI's biometric requirements.
      </p>

      <h3>What's the difference between TRAIGA and Chapter 21 when it comes to AI?</h3>
      <p>
        <strong>TRAIGA:</strong> Prohibits <em>intentional</em> AI discrimination. Requires proof that the employer 
        designed or deployed AI <em>with the intent</em> to discriminate. Applies to all employers. Enforced by AG only.
      </p>
      <p>
        <strong>Chapter 21:</strong> Prohibits both intentional discrimination (disparate treatment) and 
        <em>outcomes-based</em> discrimination (disparate impact). Applies to 15+ employee employers. Enforced via 
        TWC investigation + private lawsuits.
      </p>
      <p>
        <strong>Bottom line:</strong> You can comply with TRAIGA (no intent to discriminate) but still violate Chapter 
        21 if your AI produces biased outcomes.
      </p>

      <h3>If my AI vendor provides bias audits, am I protected?</h3>
      <p>
        Vendor audits are helpful but <strong>don't eliminate your liability</strong>. Under Texas law, employers are 
        responsible for discriminatory outcomes even if a third-party vendor created the AI. Use vendor audits as part 
        of due diligence, but conduct your own internal monitoring and validation.
      </p>

      <h3>Do I need to disclose AI use to candidates under TRAIGA?</h3>
      <p>
        <strong>No, TRAIGA does not require disclosure</strong> for private employers. However:
      </p>
      <ul>
        <li>If using biometric AI, you must provide CUBI notice and obtain consent</li>
        <li>Voluntary disclosure is best practice (builds trust, prepares for future regulation)</li>
        <li>If you also operate in Illinois, NYC, or Colorado, those states' disclosure requirements apply</li>
      </ul>

      <h3>Can applicants sue me directly under TRAIGA?</h3>
      <p>
        No. TRAIGA does not provide a private right of action—only the Texas Attorney General can enforce it. However, 
        applicants can still sue under:
      </p>
      <ul>
        <li>Texas Labor Code Chapter 21 (discrimination claims)</li>
        <li>Federal law (Title VII, ADA, ADEA)</li>
        <li>Texas CUBI (biometric violations)</li>
      </ul>

      <h3>How does the AG prove "intent" under TRAIGA?</h3>
      <p>
        The AG may use:
      </p>
      <ul>
        <li><strong>Direct evidence:</strong> Internal documents, emails, meeting notes showing discriminatory purpose</li>
        <li><strong>AI design:</strong> Explicit use of protected characteristics or proxies</li>
        <li><strong>Pattern evidence:</strong> Repeated discriminatory outcomes despite knowledge of bias</li>
        <li><strong>Reckless indifference:</strong> Ignoring obvious discriminatory patterns</li>
      </ul>
      <p>
        Courts haven't yet interpreted TRAIGA's intent standard, but expect it to be similar to federal intentional 
        discrimination standards.
      </p>

      <h3>What if I discover my AI has been producing biased outcomes?</h3>
      <p>
        Take immediate action:
      </p>
      <ol>
        <li><strong>Stop using the tool</strong> until bias is addressed</li>
        <li><strong>Document the discovery</strong> and corrective steps (shows good faith)</li>
        <li><strong>Notify legal counsel</strong> to assess exposure</li>
        <li><strong>Review past decisions</strong> to identify affected individuals</li>
        <li><strong>Work with vendor</strong> to fix algorithms or switch providers</li>
        <li><strong>Consider remediation</strong> for impacted applicants (e.g., reconsidering rejections)</li>
        <li><strong>Update monitoring</strong> to catch future issues earlier</li>
      </ol>
      <p>
        Discovering and fixing bias proactively demonstrates lack of intent (helps TRAIGA defense) and shows good faith 
        (helps Chapter 21/federal defenses).
      </p>

      <h3>Do I need a lawyer to comply with Texas AI laws?</h3>
      <p>
        Not necessarily, but legal counsel is recommended if:
      </p>
      <ul>
        <li>You're implementing high-risk AI (auto-reject tools, video analysis)</li>
        <li>You operate in multiple states with conflicting AI laws</li>
        <li>You receive a discrimination complaint or AG inquiry</li>
        <li>Your AI vendor cannot provide adequate compliance documentation</li>
        <li>You're unsure whether specific tools trigger CUBI biometric requirements</li>
      </ul>

      <h3>Should I wait for Texas AG guidance before implementing compliance measures?</h3>
      <p>
        No. TRAIGA is effective January 1, 2026, regardless of whether detailed AG guidance exists. Implement baseline 
        compliance now:
      </p>
      <ul>
        <li>Audit AI tools for intentional discrimination risk</li>
        <li>Implement CUBI biometric consent processes</li>
        <li>Conduct voluntary bias testing</li>
        <li>Document good-faith compliance efforts</li>
      </ul>
      <p>
        You can refine processes as AG guidance emerges, but don't delay basic compliance.
      </p>

      <h3>Can I participate in the TRAIGA regulatory sandbox?</h3>
      <p>
        Yes, if you're developing or testing innovative AI systems for employment. The sandbox provides:
      </p>
      <ul>
        <li>Temporary regulatory relief during testing periods</li>
        <li>Technical assistance from state agencies</li>
        <li>Expedited approval processes</li>
      </ul>
      <p>
        Contact the Texas Workforce Commission or Attorney General's office for application details. The sandbox is 
        designed for companies actively innovating in AI, not for large-scale deployment of existing tools.
      </p>

      <h3>What about gig workers and independent contractors—does TRAIGA apply?</h3>
      <p>
        TRAIGA applies to "employment decisions," which could include contractor relationships if there's an 
        employment-like relationship. Texas courts use multi-factor tests to determine employment status. If you use 
        AI to select, evaluate, or terminate gig workers, consult counsel to assess whether TRAIGA applies.
      </p>

      <h3>I'm already compliant with Illinois BIPA. Does that satisfy Texas CUBI?</h3>
      <p>
        Generally yes, but with nuances:
      </p>
      <ul>
        <li><strong>Notice and consent:</strong> BIPA requirements exceed CUBI—if compliant with BIPA, CUBI is satisfied</li>
        <li><strong>Retention schedules:</strong> BIPA requires written schedules; CUBI requires disclosure but not formal policy</li>
        <li><strong>Security:</strong> BIPA's "same or more protective" standard is stricter than CUBI's "reasonable care"</li>
        <li><strong>Damages:</strong> BIPA provides statutory damages ($1K-$5K); CUBI requires actual harm for damages</li>
      </ul>
      <p>
        <strong>Recommendation:</strong> If you have a BIPA compliance program, add Texas-specific documentation 
        (CUBI consent forms referencing Texas law) but keep the same substantive processes.
      </p>

      <h2>Compliance Checklist for Texas Employers</h2>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
        <p className="font-semibold text-green-800 mb-2">Before January 1, 2026:</p>
        <ul className="text-green-700 space-y-1">
          <li>☐ Complete AI inventory (all tools used in employment decisions)</li>
          <li>☐ Identify biometric AI tools and draft CUBI consent forms</li>
          <li>☐ Audit AI tools for intentional discrimination risk (TRAIGA)</li>
          <li>☐ Conduct voluntary bias testing (Chapter 21/federal mitigation)</li>
          <li>☐ Implement biometric notice and consent workflow</li>
          <li>☐ Update vendor contracts with TRAIGA/CUBI compliance obligations</li>
          <li>☐ Train HR staff on Texas AI laws (TRAIGA, CUBI, Chapter 21)</li>
          <li>☐ Establish recordkeeping systems for AI documentation</li>
          <li>☐ Review internal communications for problematic language</li>
          <li>☐ Designate compliance owner for AI employment practices</li>
        </ul>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800 mb-2">After January 1, 2026 (Ongoing):</p>
        <ul className="text-blue-700 space-y-1">
          <li>☐ Obtain CUBI biometric consent before using facial recognition/voice AI</li>
          <li>☐ Document all biometric consents with timestamps</li>
          <li>☐ Monitor AI outcomes for bias (quarterly reviews recommended)</li>
          <li>☐ Update AI inventory when new tools deployed</li>
          <li>☐ Track Texas AG guidance and enforcement actions</li>
          <li>☐ Respond promptly to candidate inquiries about AI use</li>
          <li>☐ Audit vendor compliance annually</li>
          <li>☐ Update training materials as regulations evolve</li>
          <li>☐ Maintain comprehensive AI documentation (3+ year retention)</li>
          <li>☐ Consider regulatory sandbox participation for innovative AI</li>
        </ul>
      </div>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">2026 AI Hiring Compliance Guide (All States)</Link></li>
        <li><Link href="/resources/ai-hiring-laws-by-state" className="text-blue-600 hover:underline">State-by-State AI Hiring Laws Comparison</Link></li>
        <li><Link href="/resources/illinois-ai-hiring-law" className="text-blue-600 hover:underline">Illinois AI Hiring Law (HB 3773) Guide</Link></li>
        <li><Link href="/resources/colorado-ai-act-employers" className="text-blue-600 hover:underline">Colorado AI Act for Employers</Link></li>
        <li><Link href="/resources/nyc-local-law-144" className="text-blue-600 hover:underline">NYC Local Law 144 Compliance Guide</Link></li>
        <li><Link href="/resources/ai-bias-audit-guide" className="text-blue-600 hover:underline">AI Bias Audit Guide</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Templates</Link></li>
        <li><Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:underline">AI Vendor Assessment Guide</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Texas Compliance Scorecard</Link></li>
      </ul>

      <h2>How EmployArmor Helps Texas Employers</h2>
      <p>
        EmployArmor provides end-to-end Texas AI compliance automation:
      </p>
      <ul>
        <li><strong>AI inventory management:</strong> Identify and track all employment AI tools</li>
        <li><strong>CUBI consent automation:</strong> Generate, deliver, and document biometric consents</li>
        <li><strong>Bias monitoring:</strong> Proactive disparate impact analysis (mitigates Chapter 21 risk)</li>
        <li><strong>TRAIGA compliance:</strong> Document good-faith efforts and absence of discriminatory intent</li>
        <li><strong>Multi-state support:</strong> Coordinate Texas requirements with IL, CO, NYC, and federal obligations</li>
        <li><strong>Vendor management:</strong> Track vendor compliance, audit reports, and contract obligations</li>
        <li><strong>Regulatory monitoring:</strong> Real-time alerts on Texas AG guidance and enforcement</li>
        <li><strong>Audit-ready reporting:</strong> Generate compliance documentation for investigations or audits</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Hiring in Texas? Ensure TRAIGA Compliance</p>
        <Link 
          href="/get-started" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Free Texas Compliance Assessment →
        </Link>
      </div>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
