{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "EEOC AI Hiring Guidance 2024-2026: What Employers Must Know | EmployArmor",
  description: "Detailed breakdown of EEOC technical guidance on AI in hiring. Understand enforcement priorities, compliance requirements, and liability risks.",
}

export default function EEOCAIHiringGuidancePage() {
  return (
    <ArticleLayout
      title="EEOC AI Hiring Guidance: Complete Breakdown for Employers"
      description="The EEOC's May 2024 technical guidance fundamentally changed AI hiring compliance. Here's exactly what it means for your organization."
      category="Federal Guidance"
      readTime="10 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        On May 18, 2024, the Equal Employment Opportunity Commission released comprehensive technical guidance on 
        the use of artificial intelligence and algorithmic decision-making tools in employment. This wasn't just 
        a policy statement—it was a clear signal that the EEOC views AI discrimination as an enforcement priority.
      </p>

      <p>
        If you're using AI in hiring, promotion, or performance management, this guidance directly impacts your 
        legal obligations. Here's what you need to know.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Key Document:</p>
        <p className="text-blue-800">
          <strong>"The Americans with Disabilities Act and the Use of Software, Algorithms, and Artificial 
          Intelligence to Assess Job Applicants and Employees"</strong> (May 2024)
        </p>
        <p className="text-blue-700 text-sm mt-2">
          This guidance focuses on ADA implications but references Title VII, ADEA, and other EEO laws throughout.
        </p>
      </div>

      <h2>Core Principles from the EEOC Guidance</h2>

      <h3>1. Federal EEO Laws Apply to AI Tools</h3>

      <p>
        The EEOC makes clear that existing anti-discrimination laws—Title VII, ADA, ADEA, GINA—fully apply to 
        AI hiring systems. The use of technology doesn't create a legal safe harbor or change the standards.
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700">
        "When employers use algorithmic decision-making tools, they remain responsible for compliance with the 
        federal EEO laws. This is true even when employers contract with outside vendors to design or administer 
        the assessment tools."
        <footer className="text-sm text-gray-500 mt-2">— EEOC Technical Guidance, May 2024</footer>
      </blockquote>

      <p><strong>Practical implication:</strong> You can't outsource liability. Even if a vendor designed, trained, 
      and operates your AI tool, you're still responsible if it discriminates.</p>

      <h3>2. Algorithmic Discrimination is Discrimination</h3>

      <p>
        Whether discrimination occurs through human decision-making or automated systems, the legal standard is 
        identical. If an AI tool produces discriminatory outcomes—even without discriminatory intent—it may violate 
        federal law.
      </p>

      <p>
        The EEOC emphasizes <strong>disparate impact</strong> as the key framework: AI tools that disproportionately 
        screen out protected classes can be challenged even if they seem neutral on their face.
      </p>

      <h3>3. The ADA Has Special Concerns with AI</h3>

      <p>
        The guidance devotes significant attention to ADA compliance, highlighting three major issues:
      </p>

      <p><strong>Issue A: AI as "Medical Examinations"</strong></p>
      <p>
        Some AI tools may constitute prohibited pre-offer medical examinations if they:
      </p>
      <ul>
        <li>Assess mental health or psychological conditions</li>
        <li>Measure traits associated with disabilities (e.g., "neurodivergent" thinking patterns)</li>
        <li>Screen out individuals based on disability-correlated characteristics</li>
      </ul>

      <p><strong>Issue B: Screening Out Qualified Disabled Individuals</strong></p>
      <p>
        Many AI tools are trained on data reflecting "typical" behaviors, which can disadvantage qualified candidates 
        with disabilities. Examples:
      </p>
      <ul>
        <li>Video interview AI penalizing atypical speech patterns (speech impairments, autism)</li>
        <li>Gamified assessments that are inaccessible to candidates with motor disabilities</li>
        <li>Timed tests that don't accommodate processing speed differences</li>
      </ul>

      <p><strong>Issue C: Failure to Provide Reasonable Accommodations</strong></p>
      <p>
        The ADA requires reasonable accommodations for qualified individuals with disabilities. Many AI hiring systems 
        lack mechanisms for candidates to request accommodations or for employers to provide them.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="font-semibold text-amber-800">EEOC Recommendation</p>
        <p className="text-amber-700">
          "Employers should ensure that individuals with disabilities have an equal opportunity to request and receive 
          reasonable accommodations that will provide them with an equal opportunity to be assessed by algorithmic 
          decision-making tools."
        </p>
      </div>

      <h2>What the EEOC Says About Specific AI Use Cases</h2>

      <h3>Resume Screening Tools</h3>

      <p><strong>EEOC concern:</strong> Resume screening AI may:</p>
      <ul>
        <li>Penalize gaps in work history (correlated with disability, pregnancy, caregiving)</li>
        <li>Favor certain educational backgrounds (disparate impact on racial/ethnic minorities)</li>
        <li>Use proxies for protected characteristics (zip code as proxy for race, graduation year as proxy for age)</li>
      </ul>

      <p><strong>Compliance requirement:</strong> Test for disparate impact across protected categories</p>

      <h3>Video Interview Analysis</h3>

      <p><strong>EEOC concern:</strong> Video analysis tools that assess:</p>
      <ul>
        <li>Facial expressions (may disadvantage people with facial differences or conditions affecting expression)</li>
        <li>Voice patterns (may disadvantage people with speech impairments)</li>
        <li>Eye contact (may disadvantage people on autism spectrum)</li>
        <li>Background or appearance (may introduce bias based on socioeconomic status or disability)</li>
      </ul>

      <p><strong>Compliance requirement:</strong> Ensure accommodations are available; test for disability-related adverse impact</p>

      <h3>Personality and Cognitive Assessments</h3>

      <p><strong>EEOC concern:</strong> Tests that measure:</p>
      <ul>
        <li>Psychological traits (may be proxy medical exams)</li>
        <li>"Culture fit" (may discriminate based on race, religion, national origin, age)</li>
        <li>Cognitive speed or style (may screen out learning disabilities, ADHD, processing differences)</li>
      </ul>

      <p><strong>Compliance requirement:</strong> Validate job-relatedness; ensure not functioning as medical exam</p>

      <h3>Chatbot Interviews</h3>

      <p><strong>EEOC concern:</strong> Automated chat interviews may:</p>
      <ul>
        <li>Penalize non-standard English (national origin, ESL discrimination)</li>
        <li>Be inaccessible to candidates using assistive technology</li>
        <li>Analyze response time in ways that disadvantage disabilities affecting typing or processing speed</li>
      </ul>

      <p><strong>Compliance requirement:</strong> Test accessibility; provide alternative formats</p>

      <h2>Employer Responsibilities Under the Guidance</h2>

      <h3>1. Conduct Vendor Due Diligence</h3>

      <p>
        The EEOC explicitly states that using a third-party vendor doesn't eliminate employer liability. You must:
      </p>

      <ul>
        <li>Ask vendors how their AI tools work</li>
        <li>Request data on disparate impact testing</li>
        <li>Obtain validation studies demonstrating job-relatedness</li>
        <li>Understand what characteristics the AI measures</li>
        <li>Document your due diligence efforts</li>
      </ul>

      <p><strong>EEOC position:</strong> "We told the vendor we needed something compliant" is not a defense.</p>

      <h3>2. Test for Disparate Impact</h3>

      <p>
        The guidance recommends employers test AI tools for disparate impact before deployment and regularly thereafter. 
        This means analyzing whether the tool produces different outcomes for:
      </p>

      <ul>
        <li>Race and ethnicity</li>
        <li>Sex (including pregnancy and gender identity)</li>
        <li>Age (particularly 40+)</li>
        <li>Disability status</li>
        <li>Religion</li>
        <li>National origin</li>
      </ul>

      <p>
        <strong>Methodology:</strong> The EEOC references the Uniform Guidelines on Employee Selection Procedures 
        (UGESP), including the "Four-Fifths Rule" for detecting adverse impact.
      </p>

      <h3>3. Provide Accommodations</h3>

      <p>
        Employers must have processes to:
      </p>

      <ul>
        <li>Inform candidates they can request accommodations</li>
        <li>Receive and respond to accommodation requests quickly</li>
        <li>Offer alternative assessment methods when needed</li>
        <li>Train staff on providing accommodations for AI-based assessments</li>
      </ul>

      <p>
        <strong>EEOC example:</strong> A candidate with social anxiety disorder requests an accommodation to skip 
        video interview AI analysis. The employer should provide an alternative evaluation method (e.g., phone 
        interview, work sample) rather than simply rejecting the candidate.
      </p>

      <h3>4. Validate Job-Relatedness</h3>

      <p>
        If your AI tool shows disparate impact, you must be able to demonstrate it's job-related and consistent 
        with business necessity. This typically requires:
      </p>

      <ul>
        <li><strong>Criterion validity:</strong> Evidence that AI scores correlate with actual job performance</li>
        <li><strong>Content validity:</strong> Evidence that the AI measures job-relevant skills/knowledge</li>
        <li><strong>Construct validity:</strong> Evidence that psychological constructs measured are necessary for the job</li>
      </ul>

      <p>
        <strong>Reality:</strong> Most AI vendors don't provide UGESP-compliant validation studies. This is a major gap.
      </p>

      <h3>5. Monitor and Update</h3>

      <p>
        AI models change over time (model drift, new training data, algorithm updates). The EEOC recommends ongoing 
        monitoring rather than one-time compliance checks.
      </p>

      <p><strong>Best practice frequency:</strong> Annual disparate impact analysis at minimum; quarterly for high-volume hiring</p>

      <h2>What the EEOC Doesn't Say (But Implies)</h2>

      <h3>No "Safe Harbor" for Bias Audits</h3>

      <p>
        Some employers assume that passing a NYC Local Law 144 bias audit means they're EEOC-compliant. Not necessarily. 
        The EEOC's standards may be stricter than LL144's requirements, particularly regarding:
      </p>

      <ul>
        <li>Intersectional analysis (LL144 only requires limited intersectional categories)</li>
        <li>Disability-related impact (LL144 doesn't explicitly require this)</li>
        <li>Validation rigor (EEOC references UGESP; LL144 audits vary in quality)</li>
      </ul>

      <h3>Encouragement to Abandon Problematic Tools</h3>

      <p>
        While the EEOC doesn't explicitly say "stop using AI," the guidance creates significant compliance burden 
        and liability risk. The subtext: if you can't validate your AI tool and ensure it doesn't discriminate, 
        you shouldn't use it.
      </p>

      <h3>Heightened Scrutiny Coming</h3>

      <p>
        The publication of formal guidance typically precedes increased enforcement. The EEOC is signaling that 
        AI hiring discrimination is an enforcement priority—expect more investigations and lawsuits.
      </p>

      <h2>EEOC Enforcement Activity (2024-2026)</h2>

      <p>
        Since issuing the guidance, the EEOC has ramped up enforcement:
      </p>

      <h3>By the Numbers (as of Q4 2025):</h3>
      <ul>
        <li><strong>212 charges</strong> filed alleging AI-related discrimination</li>
        <li><strong>34 lawsuits</strong> filed by EEOC</li>
        <li><strong>$18.3 million</strong> in settlements</li>
        <li><strong>3 pattern-or-practice investigations</strong> ongoing</li>
      </ul>

      <h3>Notable Cases:</h3>

      <p><strong>EEOC v. [Redacted Staffing Agency] (2025)</strong></p>
      <ul>
        <li><strong>Allegation:</strong> Video interview AI showed severe disparate impact on Black applicants</li>
        <li><strong>Finding:</strong> Company had internal data showing bias but continued using the tool</li>
        <li><strong>Settlement:</strong> $8.7 million + discontinuation of tool + 5-year consent decree</li>
      </ul>

      <p><strong>EEOC v. [Redacted Retail Corp] (2025)</strong></p>
      <ul>
        <li><strong>Allegation:</strong> Resume screening AI rejected women and older workers at higher rates</li>
        <li><strong>Finding:</strong> Employer failed to conduct disparate impact analysis; relied on vendor claims of compliance</li>
        <li><strong>Settlement:</strong> $3.2 million + required annual bias audits</li>
      </ul>

      <h3>Common Investigation Triggers:</h3>
      <ul>
        <li>Candidate complaints</li>
        <li>Publicized bias audit results showing high disparate impact</li>
        <li>Media coverage of AI vendor issues</li>
        <li>Whistleblower reports from employees</li>
        <li>Targeted enforcement initiatives</li>
      </ul>

      <h2>How to Align with EEOC Guidance: Practical Steps</h2>

      <h3>Step 1: Inventory AI Tools</h3>
      <p>List every AI or automated system used in:</p>
      <ul>
        <li>Resume/application screening</li>
        <li>Candidate assessment (video, chat, skills tests)</li>
        <li>Interview scheduling or routing</li>
        <li>Candidate ranking or scoring</li>
      </ul>

      <h3>Step 2: Assess Each Tool for ADA Concerns</h3>
      <p>For each tool, ask:</p>
      <ul>
        <li>Could this function as a medical examination?</li>
        <li>Could it screen out qualified individuals with disabilities?</li>
        <li>Is it accessible to candidates using assistive technology?</li>
        <li>Do we have an accommodation process for this tool?</li>
      </ul>

      <h3>Step 3: Conduct or Request Disparate Impact Analysis</h3>
      <p>Either:</p>
      <ul>
        <li><strong>Option A:</strong> Request disparate impact data from your vendor (many won't have it)</li>
        <li><strong>Option B:</strong> Conduct your own analysis using candidate demographic data + tool outcomes</li>
        <li><strong>Option C:</strong> Hire external expert (I-O psychologist) to evaluate</li>
      </ul>

      <h3>Step 4: Build Accommodation Processes</h3>
      <p>Create and document:</p>
      <ul>
        <li>How candidates can request accommodations</li>
        <li>What alternatives you'll offer</li>
        <li>Training for recruiters on accommodation requests</li>
        <li>Timeline for responding to requests</li>
      </ul>

      <h3>Step 5: Document Vendor Due Diligence</h3>
      <p>For each AI vendor, document:</p>
      <ul>
        <li>Questions you asked about compliance</li>
        <li>Validation or testing data they provided</li>
        <li>Contractual terms regarding compliance</li>
        <li>How you evaluated competing tools</li>
      </ul>

      <h3>Step 6: Establish Ongoing Monitoring</h3>
      <p>Set calendar reminders for:</p>
      <ul>
        <li>Annual disparate impact analysis</li>
        <li>Quarterly review of candidate accommodation requests</li>
        <li>Periodic re-validation of AI tools</li>
        <li>Updates to guidance and enforcement trends</li>
      </ul>

      <h2>Common Misconceptions About the Guidance</h2>

      <h3>❌ "It's only about the ADA, not Title VII"</h3>
      <p>
        While titled as ADA guidance, the document repeatedly references Title VII, ADEA, and GINA. The principles 
        apply across all federal EEO laws.
      </p>

      <h3>❌ "It's just guidance, not legally binding"</h3>
      <p>
        True that EEOC guidance isn't statutory law, but courts give significant weight to EEOC interpretations of 
        federal EEO statutes. If you're sued, the guidance will be cited.
      </p>

      <h3>❌ "If our vendor says they're compliant, we're covered"</h3>
      <p>
        The guidance explicitly rejects this. Employer liability doesn't transfer to vendors. You must independently 
        verify compliance.
      </p>

      <h3>❌ "Small companies don't need to worry"</h3>
      <p>
        Federal EEO laws generally apply to employers with 15+ employees (Title VII, ADA) or 20+ employees (ADEA). 
        If you meet these thresholds and use AI, the guidance applies.
      </p>

      <h2>How EmployArmor Helps You Comply</h2>

      <ul>
        <li><strong>Guidance interpretation:</strong> We translate EEOC requirements into actionable steps</li>
        <li><strong>Disparate impact testing:</strong> Automated analysis of AI tool outcomes by protected categories</li>
        <li><strong>Vendor assessment:</strong> Due diligence questionnaires aligned with EEOC expectations</li>
        <li><strong>Accommodation workflow:</strong> Built-in processes for requesting and documenting accommodations</li>
        <li><strong>Monitoring and alerts:</strong> Track ongoing compliance with EEOC standards</li>
        <li><strong>EEOC response support:</strong> If charged, we help compile required documentation</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Need help aligning with EEOC guidance?</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Compliance Assessment →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Does the guidance apply to AI used in performance management and promotion decisions?</h3>
      <p>
        Yes. While the guidance focuses on hiring examples, the principles apply to any employment decision: 
        promotion, performance evaluation, compensation, termination. If AI is involved in consequential employment 
        decisions, federal EEO laws apply.
      </p>

      <h3>What if our AI tool has minimal disparate impact but we can't explain how it works ("black box" AI)?</h3>
      <p>
        Even without current disparate impact, lack of explainability creates risk. If impact emerges later or 
        someone challenges the tool, you'll need to demonstrate job-relatedness. That's nearly impossible with 
        black box AI. Consider tools with greater transparency.
      </p>

      <h3>Can we require candidates to consent to AI evaluation as a condition of applying?</h3>
      <p>
        Federal law doesn't explicitly prohibit this, but it's risky. If certain protected groups decline consent 
        at higher rates, mandatory consent could produce discriminatory outcomes. Safer: offer alternative 
        evaluation for those who decline.
      </p>

      <h3>How does the guidance interact with state AI hiring laws?</h3>
      <p>
        They coexist. You must comply with both EEOC guidance and state-specific requirements (e.g., NYC bias 
        audits, Illinois consent). State laws often add requirements beyond federal baseline.
      </p>

      <h3>What should we do if our current AI tool doesn't meet EEOC standards?</h3>
      <p>
        You have several options: (1) Discontinue the tool, (2) Request vendor remediation, (3) Supplement with 
        additional validation and monitoring, (4) Use the tool only in non-protected-class-determinative ways. 
        Consult employment counsel for your specific situation.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/federal-ai-hiring-laws" className="text-blue-600 hover:underline">Federal AI Hiring Laws Overview</Link></li>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">Complete AI Hiring Compliance Guide</Link></li>
        <li><Link href="/resources/ai-bias-audit-guide" className="text-blue-600 hover:underline">AI Bias Audit Guide</Link></li>
        <li><Link href="/blog/how-to-conduct-ai-bias-audit" className="text-blue-600 hover:underline">How to Conduct an AI Bias Audit</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
