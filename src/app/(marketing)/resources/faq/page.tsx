"use client"

import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, HelpCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

const faqCategories = [
  {
    name: "Understanding AI in Hiring",
    questions: [
      {
        q: "What is AI in hiring?",
        a: "AI in hiring refers to automated systems that use algorithms, machine learning, or artificial intelligence to make or substantially assist in employment decisions. This includes resume screening software, video interview analysis platforms, skills assessment tools with predictive scoring, candidate ranking algorithms, and chatbots that filter applicants. Even seemingly simple ATS features like automated resume parsing or keyword matching may qualify as AI under some state laws if they substantially influence hiring decisions."
      },
      {
        q: "What counts as an 'automated employment decision tool' (AEDT)?",
        a: "An AEDT is any software, algorithm, or computational process that substantially assists or replaces human decision-making in employment contexts. New York City's Local Law 144 specifically defines it as any tool that relies on machine learning, statistical modeling, data analytics, or AI to evaluate candidates. This includes applicant tracking systems with AI features, video interview platforms analyzing facial expressions or speech patterns, skills assessment tools with predictive algorithms, and automated resume screening that ranks or eliminates candidates based on computational analysis."
      },
      {
        q: "Do common recruiting tools like LinkedIn Recruiter or Indeed count as AI?",
        a: "Yes, many features within platforms like LinkedIn Recruiter, Indeed, HireVue, Workday, and Greenhouse use AI or automated decision-making. LinkedIn's candidate recommendations, Indeed's resume screening, HireVue's video interview analysis, and Workday's predictive analytics all qualify as AI hiring tools under most state laws. Even if you think you're just using basic features, many modern recruiting platforms incorporate AI behind the scenes to rank, score, or filter candidates—which triggers compliance obligations."
      },
      {
        q: "If my vendor says their tool is compliant, am I protected?",
        a: "Not necessarily. While vendor compliance is important, most state laws place direct responsibility on the employer. You can't outsource legal liability. Under NYC Local Law 144, the employer using the tool is responsible for bias audits and disclosure, even if the vendor provides the software. Similarly, Illinois HB 3773 requires the employer to provide notice and ensure non-discriminatory use. Best practice: require vendors to provide documentation of their compliance measures, bias testing results, and model transparency—but verify their claims and maintain your own compliance documentation."
      },
    ]
  },
  {
    name: "State-Specific Requirements",
    questions: [
      {
        q: "What does Illinois HB 3773 require?",
        a: "Illinois HB 3773, effective January 1, 2026, prohibits employers from using AI in ways that discriminate based on protected characteristics (race, sex, age, disability, etc.) in any covered employment decision—including recruitment, hiring, promotion, discharge, training selection, and terms of employment. Employers must provide notice to employees and applicants whenever AI influences these decisions. The notice must include: the AI system name, developer/vendor, which employment decisions are affected, what data is processed, and a summary of employee rights under the law. The Illinois Department of Human Rights (IDHR) enforces the law and has authority to investigate complaints and pursue civil remedies for violations."
      },
      {
        q: "What does Colorado's AI Act require for hiring?",
        a: "Colorado SB24-205, effective February 1, 2026, regulates high-risk AI systems, which include those used in employment decisions. Employers must: (1) conduct and document impact assessments for high-risk AI systems, (2) provide clear notification to individuals before using AI in consequential decisions, (3) establish an appeal process for AI-driven employment decisions, (4) publish a public summary of AI usage in employment contexts, and (5) implement risk management practices. Penalties range from $10,000 to $200,000 per violation, with additional daily fines for ongoing non-compliance. The Colorado Attorney General enforces the law and provides a 60-day cure period after notice of violation."
      },
      {
        q: "What does NYC Local Law 144 require?",
        a: "NYC Local Law 144, in effect since July 2023, requires employers using automated employment decision tools (AEDTs) to: (1) conduct an annual independent bias audit testing for disparate impact across race/ethnicity and sex/gender categories, (2) publicly post audit results and methodology on their website with the date and summary statistics, (3) provide candidates with at least 10 days advance notice that an AEDT will be used, (4) disclose what job qualifications and characteristics the tool assesses, and (5) offer an alternative selection process or reasonable accommodation. Violations can result in civil penalties ranging from $500 to $1,500 per day for continuing violations. The NYC Commission on Human Rights enforces the law."
      },
      {
        q: "What does California require under CCPA ADMT regulations?",
        a: "California's CCPA regulations regarding Automated Decision-Making Technology (ADMT), with various provisions taking effect between 2026-2027, require businesses to: (1) provide pre-use notice to individuals before using automated decision-making that produces legal or similarly significant effects, (2) disclose the right to opt out of automated decision-making, (3) respond to consumer requests for information about the logic involved in automated decisions, (4) conduct risk assessments for certain automated processing activities, and (5) maintain records of automated decision-making activities. Violations can result in penalties of $2,500 per violation or $7,500 per intentional violation. The California Privacy Protection Agency enforces these requirements."
      },
      {
        q: "Does my company need to comply if we only hire in one state?",
        a: "If you hire candidates who reside in or will work in a regulated jurisdiction, you must comply with that jurisdiction's law—even if your company is headquartered elsewhere. For example, if your Texas-based company hires someone who will work remotely from Illinois, you must comply with Illinois HB 3773. Similarly, if you post a position open to NYC residents, Local Law 144 applies. Many employers adopt a unified compliance approach that meets the strictest applicable standards (often NYC's bias audit requirement) to simplify multi-state hiring."
      },
      {
        q: "Are there federal AI hiring laws?",
        a: "Not yet. While the EEOC issued guidance in 2023 emphasizing that existing anti-discrimination laws (Title VII, ADA, ADEA) apply to AI-driven employment decisions, there is no specific federal AI hiring statute. However, recent changes in federal administration have led to some rollback of EEOC guidance documents on AI and DEI. Despite federal uncertainty, employers must still comply with applicable state and local laws. The lack of federal preemption means you must navigate a complex patchwork of state regulations—Illinois, Colorado, California, New York City, Maryland, and others all have different requirements."
      },
    ]
  },
  {
    name: "Bias Audits & Technical Compliance",
    questions: [
      {
        q: "What is a bias audit and who needs one?",
        a: "A bias audit is an independent analysis that tests whether an automated employment decision tool produces discriminatory outcomes across protected categories (typically race/ethnicity and sex/gender). NYC Local Law 144 explicitly requires annual bias audits conducted by independent third parties. While other states don't mandate the specific term 'bias audit,' Colorado requires impact assessments, and Illinois encourages regular assessments to demonstrate non-discriminatory AI use. The audit tests for statistically significant disparate impact—whether one demographic group is selected at a substantially different rate than another."
      },
      {
        q: "How do I conduct a compliant bias audit?",
        a: "Under NYC Local Law 144, a compliant bias audit must: (1) be conducted by an independent auditor (not employed by the company or AI vendor), (2) use historical data from the tool's actual use, or if unavailable, test data that's reasonably representative, (3) calculate selection rates by race/ethnicity and sex/gender, (4) compute impact ratios comparing each category to the highest-performing group, (5) calculate scoring rates if the tool assigns scores, and (6) be completed within one year before the tool's use. The full methodology and results must be published on your website, including the number of individuals assessed, selection rates by category, impact ratios, and the audit date."
      },
      {
        q: "What qualifies someone as an 'independent' auditor?",
        a: "NYC regulations specify that the auditor cannot be closely associated with the employer or tool vendor—meaning they're not an employee, contractor in another capacity, or have a financial stake that would compromise objectivity. Qualified independent auditors are typically specialized consulting firms, law firms with employment AI expertise, or academic researchers with relevant credentials in statistics, industrial-organizational psychology, or civil rights auditing. The auditor should have demonstrable experience in disparate impact analysis and employment discrimination testing."
      },
      {
        q: "What if my AI vendor already did a bias audit?",
        a: "Even if your vendor conducted an audit, you as the employer are responsible for ensuring it meets the specific requirements of applicable laws. Review the vendor's audit to confirm: (1) it was conducted by a truly independent party, (2) it used data reflective of your actual candidate pool or a representative sample, (3) it tested for the required categories (race/ethnicity and sex/gender minimum), (4) it was completed within the required timeframe (within 12 months for NYC), and (5) the methodology aligns with regulatory standards. Many vendor audits don't meet these criteria because they use the vendor's aggregate data across all clients rather than your specific implementation. You may need to commission your own audit."
      },
      {
        q: "How often do bias audits need to be updated?",
        a: "NYC Local Law 144 requires bias audits to be conducted at least annually—the audit date must be within one year before the tool's use. If you make significant changes to the tool's configuration, data inputs, or decision criteria, best practice is to conduct a new audit even if it's been less than a year, as these modifications can substantially alter outcomes and disparate impact. Treat major model updates from your vendor the same way—request evidence that the new version has been audited for bias."
      },
    ]
  },
  {
    name: "Vendor Relationships & Third-Party Tools",
    questions: [
      {
        q: "Am I responsible for my vendor's AI compliance?",
        a: "Yes. While vendors have responsibilities to design non-discriminatory tools, state laws place compliance obligations directly on the employer using the AI. You cannot contractually transfer your legal liability to the vendor. Employers must independently verify vendor claims, conduct required audits and disclosures, and ensure the tool's actual use in your hiring process complies with applicable laws. Smart vendor contracts include: indemnification clauses, requirements that vendors notify you of model changes, access to bias testing data, and cooperation with your compliance audits."
      },
      {
        q: "What questions should I ask AI hiring vendors before purchasing?",
        a: "Critical vendor due diligence questions include: (1) Has the tool undergone independent bias testing? Request results. (2) What data does the tool collect and how is it used? (3) How does the tool make predictions or score candidates? (4) Can you provide model transparency documentation? (5) How do you handle model updates and will you notify us of changes? (6) What is your data retention policy? (7) Can you provide evidence of compliance with applicable state laws? (8) Will you cooperate with our independent audits? (9) What guardrails exist to prevent discriminatory outcomes? (10) Have you faced any regulatory complaints or enforcement actions?"
      },
      {
        q: "Does using LinkedIn Recruiter or Indeed require compliance?",
        a: "Yes. Many features in LinkedIn Recruiter (candidate recommendations based on AI scoring, automated matching) and Indeed (resume screening, applicant ranking) use AI algorithms that substantially influence hiring decisions. If you use these tools to narrow your candidate pool, rank applicants, or make selection decisions, you're subject to AI hiring compliance laws in applicable jurisdictions. The fact that these are widely-used commercial platforms doesn't exempt you from regulatory requirements. Document your use of these tools, understand which features involve AI, and ensure your candidate disclosures cover them."
      },
      {
        q: "What about video interview platforms like HireVue?",
        a: "Video interview platforms that analyze facial expressions, speech patterns, word choice, or other characteristics beyond basic recording functionality are squarely within the scope of AI hiring regulations. HireVue, Spark Hire, and similar platforms that use AI to score or evaluate candidates require full compliance—bias audits (NYC), impact assessments (Colorado), candidate notification (all jurisdictions), and non-discrimination safeguards (Illinois). Even if the platform only provides 'recommendations' and a human makes the final decision, the AI substantially assists that decision and triggers compliance obligations. Notable: HireVue discontinued its facial analysis technology in 2021 after bias concerns, but other assessment features still qualify as AI."
      },
    ]
  },
  {
    name: "Data, Privacy & Retention",
    questions: [
      {
        q: "How long must I retain hiring data for compliance?",
        a: "Illinois requires employers to maintain employment records, including detailed automated-decision data, for at least four years. This retention period facilitates accountability and oversight of AI in hiring decisions. Federal EEOC regulations generally require retention of hiring records for one year, but state AI laws may impose longer periods. Best practice: retain all candidate data, AI tool outputs, selection decisions, bias audit results, and related documentation for four years from the date of the employment decision. This protects you in the event of regulatory investigation or discrimination claims."
      },
      {
        q: "What data privacy risks exist with AI hiring tools?",
        a: "AI hiring tools create several privacy risks: (1) Over-collection of sensitive personal information beyond job-related qualifications, (2) unauthorized secondary use of candidate data (e.g., selling to third parties), (3) data breaches exposing applicant information, (4) lack of transparency about what data is collected and how it's used, (5) inadequate data security measures by vendors, and (6) retention of data longer than necessary. These risks can trigger legal claims under state privacy laws (CCPA, VCDPA, etc.), erode candidate trust, and damage employer reputation. Strong vendor agreements with data security requirements, clear privacy policies, and regular security audits are essential."
      },
      {
        q: "Do candidates have the right to access their AI-generated scores or data?",
        a: "It depends on the jurisdiction. California's CCPA grants consumers the right to request information about automated decisions, including the logic involved. Colorado's AI Act requires establishing an appeal process for AI-driven decisions, implicitly requiring disclosure of relevant data. Illinois emphasizes transparency through notice requirements. While federal law doesn't explicitly grant this right, best practice is to develop a process for candidates to request information about how AI was used in their evaluation, even if not legally required—it demonstrates good faith and builds trust."
      },
    ]
  },
  {
    name: "Disclosure & Candidate Notification",
    questions: [
      {
        q: "When and how must I notify candidates about AI use?",
        a: "Notification timing and content vary by jurisdiction. NYC requires at least 10 days advance notice before using an AEDT. Illinois requires notice whenever AI influences covered employment decisions, with draft regulations specifying content requirements (system name, vendor, decisions affected, data processed, employee rights). Colorado requires notification before consequential decisions. Best practice: provide notice early in the application process (e.g., on the job posting or application page) stating that AI may be used in candidate evaluation, what types of data will be analyzed, and where candidates can find more information or opt out if applicable. Use clear, plain language—avoid legalese."
      },
      {
        q: "What information must disclosure notices include?",
        a: "Comprehensive disclosure notices should include: (1) that AI or automated decision-making will be used in the hiring process, (2) which stages of the process involve AI (screening, assessment, interview analysis, etc.), (3) what candidate data the AI collects and analyzes, (4) the purpose of the AI analysis and how it influences decisions, (5) the candidate's rights under applicable law (e.g., opt-out, appeal, access to information), (6) contact information for questions or concerns, and (7) links to bias audit results if required (NYC). EmployArmor generates compliant disclosure notices tailored to your specific tools and jurisdictions automatically."
      },
      {
        q: "Do I need separate notices for each AI tool I use?",
        a: "You can provide a comprehensive notice covering all AI tools in your hiring process, rather than separate notices for each tool—this is often less confusing for candidates. However, the notice should clearly identify all AI systems in use (by name or function), the employment decisions each affects, and the data each collects. If different tools are used at different hiring stages (e.g., resume screening vs. interview analysis), clarify which tool applies when. Transparency reduces legal risk and improves candidate experience."
      },
    ]
  },
  {
    name: "Penalties, Enforcement & Risk",
    questions: [
      {
        q: "What are the penalties for non-compliance?",
        a: "Penalties vary significantly by jurisdiction. NYC can impose civil penalties of $500 to $1,500 per violation, with separate violations for each day of non-compliance. Colorado's AI Act allows penalties ranging from $10,000 to $200,000 per violation, plus up to $40,000 per day for continuing violations. California CCPA violations can result in $2,500 per violation or $7,500 per intentional violation. Illinois provides enforcement through the IDHR with potential civil remedies, though specific fine amounts are not codified. Beyond regulatory penalties, employers face risk of class action lawsuits (discrimination claims, BIPA violations, privacy claims), reputational damage, and loss of qualified candidates who avoid companies with opaque AI practices."
      },
      {
        q: "Who enforces AI hiring compliance laws?",
        a: "Enforcement varies by jurisdiction: Illinois HB 3773 is enforced by the Illinois Department of Human Rights (IDHR), which investigates complaints and can pursue civil actions. Colorado's AI Act grants exclusive enforcement authority to the Colorado Attorney General, who provides a 60-day cure period before imposing penalties. NYC Local Law 144 is enforced by the NYC Commission on Human Rights. California's CCPA ADMT regulations are enforced by the California Privacy Protection Agency. Federal employment discrimination laws (Title VII, ADA, ADEA) are enforced by the EEOC, which has indicated AI hiring falls under existing anti-discrimination statutes even without specific AI legislation."
      },
      {
        q: "Can employees or applicants sue directly?",
        a: "In many cases, yes. Most employment discrimination laws allow private rights of action—meaning individuals can file lawsuits directly, often as class actions. Illinois BIPA violations (relevant for video interview analysis collecting biometric data) carry statutory damages of $1,000 to $5,000 per violation, leading to expensive class action settlements. A proposed class action lawsuit argues some AI hiring tools function like consumer reports under the Fair Credit Reporting Act (FCRA), which would trigger disclosure, authorization, and adverse action requirements—violations of which allow private lawsuits. Even where state AI laws grant enforcement to government agencies, traditional discrimination claims remain available to individuals under state and federal civil rights statutes."
      },
      {
        q: "What is the risk of a discrimination lawsuit from AI hiring?",
        a: "Significant and growing. AI hiring tools have been shown to produce discriminatory outcomes—screening out qualified candidates based on protected characteristics, even unintentionally. If your AI tool disproportionately excludes women, people of color, older workers, or people with disabilities, you face liability under Title VII, the ADA, the ADEA, and state equivalents—regardless of whether you intended to discriminate. Recent enforcement actions and settlements demonstrate regulators and plaintiffs' attorneys are actively pursuing AI bias cases. Proactive bias testing, human oversight, and documentation of non-discriminatory intent are critical defenses. Remember: 'the algorithm did it' is not a legal defense for discrimination."
      },
    ]
  },
  {
    name: "Implementation & Best Practices",
    questions: [
      {
        q: "Should I eliminate AI from hiring entirely to avoid compliance burdens?",
        a: "Not necessarily. AI hiring tools can improve efficiency, reduce unconscious human bias, and identify qualified candidates you might otherwise miss—when used responsibly. The key is compliant, transparent, and audited use. Rather than eliminating AI, focus on: (1) understanding exactly what AI you're using and how it works, (2) conducting bias testing before and during deployment, (3) maintaining human oversight and final decision-making authority, (4) providing clear candidate disclosures, (5) documenting your compliance efforts, and (6) training HR staff on AI risks and guardrails. Used correctly, AI can be a valuable hiring tool; used carelessly, it's a legal liability. EmployArmor helps you stay on the right side of that line."
      },
      {
        q: "How do I balance AI automation with human judgment?",
        a: "Best practice guidance recommends using AI as a supplement to, not a replacement for, human decision-making. Keep a 'human in the loop'—meaning AI can screen, score, or rank candidates, but a human makes the final hiring decision and has authority to override AI recommendations. This approach serves multiple purposes: (1) compliance (many laws require human oversight), (2) quality control (AI can miss context or nuance), (3) bias mitigation (humans can catch discriminatory patterns), and (4) legal defense (demonstrating reasonable care). Document when and why humans override AI recommendations—this evidence shows good faith and thoughtful decision-making."
      },
      {
        q: "What should I do if I discover my AI tool has bias?",
        a: "Act immediately. First, pause use of the tool for consequential hiring decisions until the issue is addressed. Second, investigate the source of bias—is it the algorithm, the training data, the input features, or the way your organization configured the tool? Third, work with the vendor to correct the issue or consider alternative tools. Fourth, conduct a lookback analysis to identify whether past hiring decisions were affected and whether remediation is needed (e.g., reconsidering rejected candidates). Fifth, document your response thoroughly—swift corrective action demonstrates good faith and can mitigate liability. Finally, consider proactive disclosure to regulators if the bias is severe or affected a large number of candidates."
      },
    ]
  },
  {
    name: "EmployArmor Platform",
    questions: [
      {
        q: "What does EmployArmor do?",
        a: "EmployArmor is a comprehensive compliance platform that helps companies audit their AI hiring tools, generate required disclosures and policies, train HR teams, track candidate consent, and maintain documentation—all in one place. We provide: (1) AI tool inventory and risk assessment, (2) automated generation of compliant disclosure notices tailored to your tools and jurisdictions, (3) bias audit coordination with qualified independent auditors, (4) HR compliance training modules, (5) candidate consent tracking and documentation, (6) ongoing regulatory monitoring and updates, and (7) audit-ready compliance reporting. Instead of piecing together compliance from multiple vendors and consultants, EmployArmor provides an integrated solution."
      },
      {
        q: "Do I need to integrate EmployArmor with my ATS or HR systems?",
        a: "No. EmployArmor works alongside your existing tools without requiring technical integrations or data connections. You can manually track compliance, generate documents, and manage training without connecting any systems. For customers who want deeper integration, we offer optional API connections to streamline data flow, but they're not required. This flexibility means you can start using EmployArmor immediately—no IT project, no vendor approval process, no data migration."
      },
      {
        q: "How much does EmployArmor cost?",
        a: "EmployArmor offers four transparent pricing plans: Starter ($199/month) for small teams up to 50 employees, Growth ($499/month) for growing companies up to 250 employees, Scale ($999/month) for larger organizations up to 1,000 employees, and Enterprise (custom pricing) for complex compliance needs, multi-location operations, or companies over 1,000 employees. All plans include a 14-day free trial with no credit card required. Pricing includes access to all core compliance features—tool assessment, disclosure generation, training modules, and regulatory updates. Bias audits are quoted separately as they require independent auditors."
      },
      {
        q: "Is there a free option to assess my compliance risk?",
        a: "Yes. Take our free compliance scorecard to assess your risk level in under 5 minutes. You'll answer questions about your hiring practices, locations, and AI tool use, then receive a personalized report showing: (1) which laws apply to your organization, (2) your current compliance gaps, (3) prioritized action items, and (4) estimated risk level. You'll see exactly what you need to fix before you pay anything—no sales call required, no commitment. The scorecard is designed to give HR teams a clear, honest assessment of where they stand."
      },
    ]
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`px-6 pb-5 text-gray-600 leading-relaxed ${isOpen ? '' : 'hidden'}`}>
          {answer}
        </div>
    </div>
  )
}

export default function FAQPage() {
  // Generate FAQ schema data
  const allFaqs = faqCategories.flatMap(cat => 
    cat.questions.map(q => ({ question: q.q, answer: q.a }))
  )

  const faqSchemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="py-16">
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/resources" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AI Hiring Compliance FAQ</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Comprehensive answers to the most common questions about AI hiring compliance laws, bias audits, vendor responsibilities, penalties, and best practices. Whether you're navigating Illinois HB 3773, NYC Local Law 144, Colorado's AI Act, or California's CCPA ADMT regulations, this FAQ provides the guidance you need.
          </p>
        </div>

        <AuthorByline publishDate="2026-02-23" />

        {/* Overview Section - Always Visible for SEO/NLP */}
        <div className="prose prose-lg max-w-none mb-12">
          <p>
            As artificial intelligence transforms how companies recruit and evaluate talent, a complex web of federal, state, and local regulations has emerged to protect candidates and employees from algorithmic discrimination. From New York City&apos;s Local Law 144 requiring annual bias audits to Illinois HB 3773&apos;s comprehensive disclosure mandates, employers using AI in hiring face significant compliance obligations — and steep penalties for getting it wrong.
          </p>
          <p>
            This FAQ covers the most critical questions HR leaders, compliance officers, and in-house counsel ask about AI hiring compliance. We address state-specific requirements across Illinois, Colorado, California, New York City, Maryland, and Texas (TRAIGA), explain bias audit procedures and vendor responsibilities, clarify data privacy and retention obligations, and outline the penalties and enforcement mechanisms that make compliance non-optional.
          </p>
          <p>
            Whether you use tools like HireVue, Greenhouse, Workday, LinkedIn Recruiter, or any automated employment decision tool (AEDT), understanding your compliance obligations is essential. The regulatory landscape is evolving rapidly — multiple states enacted new AI employment laws effective January and February 2026, and enforcement actions are accelerating. Below you&apos;ll find {allFaqs.length} answers organized across {faqCategories.length} categories, each reflecting the latest regulatory guidance and enforcement trends.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-blue-50 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {faqCategories.map((category) => (
              <Link 
                key={category.name}
                href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {category.name} ({category.questions.length} questions)
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category) => (
          <div 
            key={category.name} 
            id={category.name.toLowerCase().replace(/\s+/g, '-')}
            className="mb-12 scroll-mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {category.questions.map((faq, index) => (
                <FAQItem key={index} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Additional Resources */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Additional Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:text-blue-800 hover:underline">
              → Complete AI Hiring Compliance Guide 2026
            </Link>
            <Link href="/resources/compliance-checklist-2026" className="text-blue-600 hover:text-blue-800 hover:underline">
              → Compliance Checklist for 2026
            </Link>
            <Link href="/resources/ai-bias-audit-guide" className="text-blue-600 hover:text-blue-800 hover:underline">
              → Bias Audit Implementation Guide
            </Link>
            <Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:text-blue-800 hover:underline">
              → What Counts as AI in Hiring?
            </Link>
            <Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:text-blue-800 hover:underline">
              → Vendor Assessment Guide
            </Link>
            <Link href="/compliance/illinois" className="text-blue-600 hover:text-blue-800 hover:underline">
              → Illinois AI Hiring Law Deep Dive
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Take our free compliance scorecard to get a personalized assessment of your AI hiring compliance situation. In under 5 minutes, you'll see exactly which laws apply to your organization and what steps you need to take.
          </p>
          <LegalDisclaimer />
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/scorecard">
              <Button variant="cta" size="lg" className="min-w-[200px]">
                Free Compliance Score <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
