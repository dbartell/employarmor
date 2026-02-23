{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "AI Impact Assessment Template & Guide for Hiring | EmployArmor",
  description: "Colorado and other states now require impact assessments before deploying AI hiring tools. Here's a step-by-step guide with a practical template.",
}

export default function AIImpactAssessmentHiringPage() {
  return (
    <ArticleLayout
      title="AI Impact Assessment for Hiring: Template & Step-by-Step Guide"
      description="Impact assessments are becoming a core compliance requirement. Here's how to conduct one properly—and a template you can actually use."
      category="Compliance Template"
      readTime="14 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        When Colorado's AI Act went into effect in February 2026, it introduced a requirement unfamiliar to most 
        U.S. employers: the <strong>Algorithmic Impact Assessment</strong>. Borrowed from the EU's AI Act and 
        data protection frameworks (GDPR, DPIA), impact assessments force organizations to <em>think before they deploy</em>—to 
        document what an AI system does, what risks it poses, and how those risks will be mitigated.
      </p>

      <p>
        For AI hiring tools, this means you can't just sign a vendor contract, flip a switch, and start screening 
        candidates. You must first conduct a structured analysis of potential harms, discriminatory impacts, privacy 
        risks, and fairness implications.
      </p>

      <p>
        This guide walks through the entire process with a practical, adaptable template you can use for your 
        own assessments.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">What You'll Get:</p>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>✓ Understanding of what impact assessments are and why they're required</li>
          <li>✓ Step-by-step methodology for conducting assessments</li>
          <li>✓ Ready-to-use template with example responses</li>
          <li>✓ Risk mitigation strategies</li>
          <li>✓ Integration with bias audits and other compliance activities</li>
        </ul>
      </div>

      <h2>What Is an AI Impact Assessment?</h2>

      <p>
        An AI Impact Assessment (also called Algorithmic Impact Assessment, or AIA) is a <strong>structured evaluation 
        process</strong> designed to identify and document:
      </p>

      <ul>
        <li>How an AI system works and what decisions it influences</li>
        <li>What data it collects and processes</li>
        <li>Potential risks to individuals (discrimination, privacy, accuracy)</li>
        <li>Mitigation measures to reduce those risks</li>
        <li>Ongoing monitoring and accountability processes</li>
      </ul>

      <p>
        Think of it as a <strong>risk management framework</strong>—similar to a privacy impact assessment (PIA) or 
        data protection impact assessment (DPIA), but focused on algorithmic harm rather than just data privacy.
      </p>

      <h2>Where Impact Assessments Are Required</h2>

      <h3>Colorado AI Act (Mandatory as of Feb 2026)</h3>

      <p>
        Colorado requires impact assessments for "high-risk AI systems," which explicitly includes AI used in employment 
        decisions. Employers must complete an impact assessment <strong>before deploying</strong> an AI hiring tool 
        and update it whenever:
      </p>

      <ul>
        <li>The AI system is materially modified</li>
        <li>New intended uses are identified</li>
        <li>Annually, at minimum</li>
      </ul>

      <h3>EU AI Act (If You Hire in the EU)</h3>

      <p>
        The EU AI Act classifies employment AI as "high-risk" and requires conformity assessments and ongoing risk 
        management—functionally equivalent to impact assessments.
      </p>

      <h3>Best Practice Even Where Not Required</h3>

      <p>
        Even in states without explicit impact assessment mandates, conducting one is smart risk management:
      </p>

      <ul>
        <li>Demonstrates good faith if you're investigated for discrimination</li>
        <li>Forces you to understand how your AI tools actually work</li>
        <li>Identifies issues before they become lawsuits</li>
        <li>Creates documentation showing due diligence</li>
      </ul>

      <h2>When to Conduct an Impact Assessment</h2>

      <p><strong>Timing matters:</strong></p>

      <h3>Before Initial Deployment</h3>
      <p>
        Conduct an assessment <strong>before</strong> you use an AI tool on real candidates. This means during the 
        vendor evaluation phase or during a pilot/testing period.
      </p>

      <h3>Before Material Changes</h3>
      <p>
        If your vendor updates their algorithm, adds new features, or you expand to a new use case (e.g., using a 
        resume screening tool now also for internal promotions), conduct a new assessment or update the existing one.
      </p>

      <h3>Annually (Minimum)</h3>
      <p>
        Even if nothing changes, review your assessment at least once a year. AI systems can drift over time, and 
        regulations evolve.
      </p>

      <h2>Step-by-Step: Conducting an Impact Assessment</h2>

      <h3>Phase 1: System Description and Purpose</h3>

      <p><strong>Objective:</strong> Document what the AI system is, what it does, and why you're using it.</p>

      <p><strong>Questions to answer:</strong></p>

      <ul>
        <li>What is the AI system called?</li>
        <li>Who developed it? (vendor name, version)</li>
        <li>What employment decisions does it support or influence? (screening, ranking, interviewing, assessment)</li>
        <li>What job roles or categories is it used for?</li>
        <li>What business problem is it solving? (efficiency, consistency, quality of hire)</li>
      </ul>

      <p><strong>Example response:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm"><strong>System Name:</strong> HireVue Video Interview Platform (v9.1)</p>
        <p className="text-sm"><strong>Vendor:</strong> HireVue, Inc.</p>
        <p className="text-sm"><strong>Employment Decision:</strong> Screening candidates for customer service 
        representative positions. The system analyzes recorded video interview responses and generates scores based 
        on communication skills, enthusiasm, and problem-solving ability. Scores are used to rank candidates; top 
        30% advance to live interviews with hiring managers.</p>
        <p className="text-sm"><strong>Business Purpose:</strong> Reduce time-to-hire by pre-screening large 
        applicant volumes (300-500 applicants per open position). Improve consistency in initial screening.</p>
      </blockquote>

      <h3>Phase 2: Data Collection and Processing</h3>

      <p><strong>Objective:</strong> Identify what candidate data the AI collects and how it's processed.</p>

      <p><strong>Questions to answer:</strong></p>

      <ul>
        <li>What data does the AI collect? (resume text, video recordings, assessment responses, demographic info)</li>
        <li>How is data collected? (candidate upload, web scraping, third-party data sources)</li>
        <li>What data elements are used in the AI's decision-making? (keywords, speech patterns, facial expressions)</li>
        <li>Is any protected class data used? (race, sex, age, disability)—directly or via proxies?</li>
        <li>How long is data retained?</li>
        <li>Who has access to the data? (internal teams, vendor, subprocessors)</li>
      </ul>

      <p><strong>Example response:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm"><strong>Data Collected:</strong></p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li>Video recording of candidate responses (5-10 minutes)</li>
          <li>Audio transcription of spoken responses</li>
          <li>Metadata: timestamp, device type, browser, IP address</li>
        </ul>
        <p className="text-sm mt-2"><strong>Data Used in AI Processing:</strong></p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li>Transcribed text (analyzed for keywords, complexity, sentiment)</li>
          <li>Speech characteristics (pace, tone, filler words)</li>
          <li>Visual data (currently disabled—not analyzed)</li>
        </ul>
        <p className="text-sm mt-2"><strong>Protected Class Data:</strong> Not directly collected. However, speech 
        characteristics could serve as proxies for race, national origin, or disability.</p>
        <p className="text-sm mt-2"><strong>Retention:</strong> 2 years unless candidate requests earlier deletion</p>
        <p className="text-sm mt-2"><strong>Access:</strong> HR team, hiring managers, HireVue (vendor)</p>
      </blockquote>

      <h3>Phase 3: Risk Identification</h3>

      <p><strong>Objective:</strong> Identify potential harms and risks to candidates.</p>

      <p><strong>Categories of risk to assess:</strong></p>

      <h4>Discrimination / Disparate Impact</h4>
      <ul>
        <li>Could the AI produce different outcomes for protected groups?</li>
        <li>Are there features that could disadvantage certain demographics? (e.g., accent detection, speech patterns)</li>
        <li>Has bias testing been conducted?</li>
      </ul>

      <h4>Privacy Risks</h4>
      <ul>
        <li>Is sensitive personal data being collected beyond what's necessary?</li>
        <li>Could data be re-identified or used for unintended purposes?</li>
        <li>Are there adequate data security measures?</li>
      </ul>

      <h4>Accuracy and Reliability</h4>
      <ul>
        <li>How accurate are the AI's predictions? (Does a high score actually correlate with job success?)</li>
        <li>What's the false positive/false negative rate?</li>
        <li>Could the AI penalize good candidates or advance poor ones?</li>
      </ul>

      <h4>Transparency and Explainability</h4>
      <ul>
        <li>Can the AI explain why it scored a candidate a certain way?</li>
        <li>Do candidates understand how they're being evaluated?</li>
        <li>Can hiring managers understand and challenge AI recommendations?</li>
      </ul>

      <h4>Disability Accommodation</h4>
      <ul>
        <li>Could the AI disadvantage candidates with disabilities? (speech impediments, autism, visual impairments)</li>
        <li>Is there a clear accommodation process?</li>
      </ul>

      <p><strong>Example risk identification:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm font-semibold">Identified Risks:</p>
        <p className="text-sm mt-2"><strong>1. Discrimination Against Non-Native Speakers:</strong></p>
        <p className="text-sm ml-4">
          <em>Risk Level: HIGH</em><br />
          The AI analyzes speech clarity and complexity. Non-native English speakers or candidates with accents may 
          receive lower scores even if their communication is adequate for the job. This could produce disparate 
          impact against Hispanic, Asian, and other national origin groups.
        </p>
        <p className="text-sm mt-2"><strong>2. Disability Discrimination (Speech):</strong></p>
        <p className="text-sm ml-4">
          <em>Risk Level: HIGH</em><br />
          Candidates with speech impediments, hearing impairments affecting speech, or autism spectrum conditions 
          (atypical speech patterns) may be penalized by speech analysis algorithms.
        </p>
        <p className="text-sm mt-2"><strong>3. Privacy: Excessive Data Retention:</strong></p>
        <p className="text-sm ml-4">
          <em>Risk Level: MEDIUM</em><br />
          2-year data retention period may exceed business necessity. Video recordings are sensitive data.
        </p>
        <p className="text-sm mt-2"><strong>4. Accuracy: Unvalidated Predictive Scoring:</strong></p>
        <p className="text-sm ml-4">
          <em>Risk Level: MEDIUM</em><br />
          Vendor has not provided validation studies demonstrating that AI scores correlate with actual job 
          performance for our specific roles. We're using the tool without evidence it predicts success.
        </p>
      </blockquote>

      <h3>Phase 4: Mitigation Strategies</h3>

      <p><strong>Objective:</strong> For each identified risk, define how you'll reduce or eliminate it.</p>

      <p><strong>Example mitigations:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm font-semibold">Risk 1 Mitigation: Non-Native Speaker Discrimination</p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li><strong>Action 1:</strong> Conduct bias audit analyzing selection rates by race/ethnicity and national origin</li>
          <li><strong>Action 2:</strong> Request vendor disable accent/speech clarity scoring; retain only content-based analysis</li>
          <li><strong>Action 3:</strong> Human review of all AI scores; hiring managers instructed to watch videos 
          and independently assess communication adequacy</li>
          <li><strong>Action 4:</strong> Clear disclosure to candidates that accent/language will not be evaluated 
          negatively; focus is on content of responses</li>
          <li><strong>Timeline:</strong> Bias audit Q2 2026; vendor configuration changes by March 15; training by March 30</li>
        </ul>

        <p className="text-sm font-semibold mt-4">Risk 2 Mitigation: Disability Discrimination</p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li><strong>Action 1:</strong> Add accommodation notice to all interview invitations: "If you have a 
          disability that may affect video interview performance, contact [email] to request an alternative format"</li>
          <li><strong>Action 2:</strong> Create alternative evaluation process: phone interview or written responses 
          to interview questions</li>
          <li><strong>Action 3:</strong> Train HR team to process accommodation requests within 48 hours</li>
          <li><strong>Timeline:</strong> Implemented immediately (March 1, 2026)</li>
        </ul>

        <p className="text-sm font-semibold mt-4">Risk 3 Mitigation: Data Retention</p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li><strong>Action 1:</strong> Reduce retention period from 2 years to 1 year</li>
          <li><strong>Action 2:</strong> Implement automated deletion workflow at 1-year mark</li>
          <li><strong>Action 3:</strong> Provide easy deletion request process (email link in candidate communications)</li>
          <li><strong>Timeline:</strong> Policy change March 2026; automated deletion by April 2026</li>
        </ul>

        <p className="text-sm font-semibold mt-4">Risk 4 Mitigation: Validation</p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li><strong>Action 1:</strong> Conduct 6-month pilot: track AI scores vs. actual job performance of hired candidates</li>
          <li><strong>Action 2:</strong> If no correlation found, discontinue AI scoring and use video platform 
          for recording only</li>
          <li><strong>Timeline:</strong> Pilot begins March 2026; evaluation September 2026</li>
        </ul>
      </blockquote>

      <h3>Phase 5: Accountability and Monitoring</h3>

      <p><strong>Objective:</strong> Define who's responsible and how you'll track ongoing compliance.</p>

      <p><strong>Questions to answer:</strong></p>

      <ul>
        <li>Who owns this impact assessment? (role/person responsible for updates)</li>
        <li>How often will the assessment be reviewed?</li>
        <li>What metrics will you monitor? (selection rates, candidate complaints, accommodation requests)</li>
        <li>What triggers a reassessment? (algorithm updates, new laws, identified issues)</li>
      </ul>

      <p><strong>Example accountability framework:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm"><strong>Assessment Owner:</strong> Director of HR & Compliance (Jane Smith)</p>
        <p className="text-sm"><strong>Review Frequency:</strong> Quarterly review of metrics; full reassessment annually or upon material changes</p>
        <p className="text-sm"><strong>Monitoring Metrics:</strong></p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li>Selection rates by demographic group (monthly)</li>
          <li>Candidate complaints related to AI evaluation (real-time)</li>
          <li>Accommodation requests (real-time)</li>
          <li>AI score vs. hiring manager decision agreement rate (quarterly)</li>
        </ul>
        <p className="text-sm mt-2"><strong>Reassessment Triggers:</strong></p>
        <ul className="text-sm list-disc list-inside ml-4 space-y-1">
          <li>Vendor algorithm update</li>
          <li>Bias audit shows disparate impact</li>
          <li>New AI hiring law passes in our jurisdictions</li>
          <li>3+ related candidate complaints in a quarter</li>
        </ul>
      </blockquote>

      <h2>Full Impact Assessment Template</h2>

      <p>
        Here's a complete template you can adapt for your organization. Copy this into a document and fill in 
        your specific details:
      </p>

      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
        <p className="font-bold mb-4">AI HIRING IMPACT ASSESSMENT TEMPLATE</p>

        <p className="font-semibold mt-4">1. SYSTEM IDENTIFICATION</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>AI System Name: ___________</li>
          <li>Vendor/Developer: ___________</li>
          <li>Version: ___________</li>
          <li>Date of Assessment: ___________</li>
          <li>Assessment Owner: ___________</li>
        </ul>

        <p className="font-semibold mt-4">2. PURPOSE AND SCOPE</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Employment Decision Supported: (e.g., resume screening, interview evaluation, skills assessment)</li>
          <li>Job Roles/Categories: ___________</li>
          <li>Business Justification: ___________</li>
          <li>Number of Candidates Evaluated Annually: ___________</li>
        </ul>

        <p className="font-semibold mt-4">3. DATA PROCESSING</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Data Collected: ___________</li>
          <li>Data Used in AI Analysis: ___________</li>
          <li>Protected Class Data (direct or proxy): ___________</li>
          <li>Data Sources: ___________</li>
          <li>Data Retention Period: ___________</li>
          <li>Data Access (who can view): ___________</li>
        </ul>

        <p className="font-semibold mt-4">4. HOW THE AI WORKS</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Input: ___________</li>
          <li>Processing: (describe what the AI analyzes)</li>
          <li>Output: (score, ranking, recommendation, etc.)</li>
          <li>How Output Is Used in Decision: ___________</li>
        </ul>

        <p className="font-semibold mt-4">5. RISK ASSESSMENT</p>

        <p className="text-sm font-semibold mt-3">A. Discrimination Risks</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Risk Identified: ___________</li>
          <li>Severity (Low/Medium/High): ___________</li>
          <li>Affected Groups: ___________</li>
          <li>Evidence/Basis: ___________</li>
        </ul>

        <p className="text-sm font-semibold mt-3">B. Privacy Risks</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Risk Identified: ___________</li>
          <li>Severity: ___________</li>
        </ul>

        <p className="text-sm font-semibold mt-3">C. Accuracy/Reliability Risks</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Risk Identified: ___________</li>
          <li>Severity: ___________</li>
        </ul>

        <p className="text-sm font-semibold mt-3">D. Disability Accommodation Risks</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Risk Identified: ___________</li>
          <li>Severity: ___________</li>
        </ul>

        <p className="font-semibold mt-4">6. MITIGATION MEASURES</p>
        <p className="text-sm ml-4">(For each risk above, describe mitigation actions, responsible party, timeline)</p>

        <p className="font-semibold mt-4">7. BIAS TESTING</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Bias Audit Conducted? (Yes/No): ___________</li>
          <li>Date of Most Recent Audit: ___________</li>
          <li>Key Findings: ___________</li>
          <li>Disparate Impact Identified? (Yes/No): ___________</li>
          <li>Remediation Actions: ___________</li>
        </ul>

        <p className="font-semibold mt-4">8. TRANSPARENCY AND DISCLOSURE</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Candidates Notified of AI Use? (Yes/No): ___________</li>
          <li>Disclosure Method: ___________</li>
          <li>Disclosure Content Summary: ___________</li>
          <li>Alternative Process Available? (Yes/No): ___________</li>
          <li>Alternative Process Description: ___________</li>
        </ul>

        <p className="font-semibold mt-4">9. ACCOUNTABILITY</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Assessment Owner: ___________</li>
          <li>Review Frequency: ___________</li>
          <li>Monitoring Metrics: ___________</li>
          <li>Reassessment Triggers: ___________</li>
        </ul>

        <p className="font-semibold mt-4">10. APPROVAL</p>
        <ul className="text-sm space-y-1 ml-4">
          <li>Approved By: ___________</li>
          <li>Title: ___________</li>
          <li>Date: ___________</li>
          <li>Next Review Date: ___________</li>
        </ul>
      </div>

      <h2>Integrating Impact Assessments With Other Compliance Activities</h2>

      <p>
        Impact assessments shouldn't exist in a vacuum. Integrate them with your broader compliance program:
      </p>

      <h3>With Bias Audits</h3>
      <p>
        Use impact assessments to <em>plan</em> bias audits. Your risk identification (Phase 3) should inform what 
        demographic categories you analyze in the audit. Conversely, bias audit results feed back into the assessment 
        as evidence of actual discrimination risk.
      </p>

      <h3>With Vendor Management</h3>
      <p>
        Share relevant sections of your impact assessment with AI vendors. Ask them to help you complete sections on 
        how the AI works, what data it uses, and what validation has been done. Strong vendors will have ready answers.
      </p>

      <h3>With Privacy/Data Protection</h3>
      <p>
        If you have a Privacy Officer or conduct Data Protection Impact Assessments (DPIAs), coordinate with them. 
        There's significant overlap in the data processing analysis.
      </p>

      <h3>With Legal/Compliance</h3>
      <p>
        Have legal counsel review completed impact assessments, especially the risk identification and mitigation 
        sections. They can advise on legal adequacy of proposed mitigations.
      </p>

      <h2>Common Mistakes in Impact Assessments</h2>

      <h3>Mistake #1: Completing it After Deployment</h3>
      <p>
        The assessment is supposed to happen <strong>before</strong> you use the AI tool. Conducting it retroactively 
        defeats the purpose (identifying risks before they materialize) and may not satisfy regulatory requirements.
      </p>

      <h3>Mistake #2: Generic, Check-the-Box Responses</h3>
      <p>
        Impact assessments must be <strong>specific to your organization and use case</strong>. Copying a vendor's 
        generic template without customization is insufficient. Regulators can tell.
      </p>

      <h3>Mistake #3: Ignoring Disability Risks</h3>
      <p>
        Many assessments focus only on race/sex discrimination and neglect disability risks. AI hiring tools—especially 
        video interview analysis, speech evaluation, and timed assessments—pose significant ADA risks.
      </p>

      <h3>Mistake #4: No Follow-Through on Mitigations</h3>
      <p>
        Identifying risks and proposing mitigations is pointless if you don't actually <em>implement</em> them. Assign 
        owners, deadlines, and track completion. An assessment with unfulfilled mitigations is evidence of negligence, 
        not diligence.
      </p>

      <h3>Mistake #5: One-and-Done</h3>
      <p>
        Impact assessments are living documents. Update them when the AI changes, when you discover new risks, when 
        laws evolve, or at least annually. A two-year-old assessment is stale.
      </p>

      <h2>How EmployArmor Simplifies Impact Assessments</h2>

      <p>
        EmployArmor provides guided impact assessment workflows:
      </p>

      <ul>
        <li><strong>Automated template generation:</strong> We populate assessment templates with data from your 
        AI vendor integrations and your hiring process</li>
        <li><strong>Risk libraries:</strong> Pre-identified common risks for each tool type (video interview, 
        resume screening, skills assessment) to jumpstart your analysis</li>
        <li><strong>Mitigation recommendations:</strong> Suggested actions for each identified risk, customized to 
        your jurisdictions and resources</li>
        <li><strong>Coordination with bias audits:</strong> Impact assessments link to bias audit results automatically</li>
        <li><strong>Review reminders:</strong> Alerts when it's time to update your assessment (annually or when triggers occur)</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Streamline Your Impact Assessments</p>
        <p className="text-blue-700 mb-4">Guided workflows and automated templates</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Can we use a vendor-provided impact assessment, or must we create our own?</h3>
      <p>
        Vendor-provided templates are a good starting point, but you must customize them to <strong>your specific 
        use case</strong>. Your candidate population, job roles, business context, and risk environment are unique. 
        Generic vendor assessments won't satisfy legal requirements.
      </p>

      <h3>Who should conduct the impact assessment—HR, Legal, IT?</h3>
      <p>
        Ideally, it's collaborative: HR understands the hiring process, Legal knows compliance obligations, IT/Data 
        understands the technical details. Assign one owner (typically HR or Compliance) but involve all stakeholders.
      </p>

      <h3>Do we need separate assessments for each AI tool, or one comprehensive assessment?</h3>
      <p>
        <strong>Separate assessments for each distinct AI tool.</strong> A video interview platform and a resume 
        screening tool work differently, pose different risks, and should be assessed independently. You can create 
        a master document with multiple tool sections, but don't lump everything together.
      </p>

      <h3>How long does a typical impact assessment take?</h3>
      <p>
        For a single AI tool: 8-20 hours spread across multiple stakeholders. First-time assessments take longer 
        (building the framework). Subsequent assessments or updates are faster (2-5 hours).
      </p>

      <h3>Are impact assessments confidential, or must they be published like bias audits?</h3>
      <p>
        Currently, impact assessments are <strong>not required to be published</strong> (unlike NYC bias audits). 
        They're internal risk management documents. However, they may be discoverable in litigation or producible 
        to regulators during investigations. Assume they could become public.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">Complete AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/colorado-ai-act-employers" className="text-blue-600 hover:underline">Colorado AI Act: Employer Guide</Link></li>
        <li><Link href="/blog/how-to-conduct-ai-bias-audit" className="text-blue-600 hover:underline">How to Conduct an AI Bias Audit</Link></li>
        <li><Link href="/blog/ai-hiring-laws-2026" className="text-blue-600 hover:underline">2026 AI Hiring Laws: What Changed</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
