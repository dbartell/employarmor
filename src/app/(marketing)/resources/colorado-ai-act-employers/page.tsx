import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export default function ColoradoAIActPage() {
  return (
    <ArticleLayout
      title="Colorado AI Act: Employer Requirements Explained"
      description="Impact assessments, consumer notifications, and opt-outs. Breaking down what Colorado's AI Act requires for employers using AI in hiring."
      category="State Law"
      readTime="10 min read"
      publishedDate="January 12, 2026"
    >
      <AuthorByline publishDate="2025-02-20" />

      <p>
        Colorado's Artificial Intelligence Act is one of the most comprehensive AI regulations in the 
        United States. For employers using AI in hiring, it introduces significant new requirements 
        around transparency, accountability, and consumer rights.
      </p>

      <h2>Key Dates</h2>
      <ul>
        <li><strong>Effective Date:</strong> June 30, 2026</li>
        <li><strong>Applies To:</strong> Deployers of high-risk AI systems in Colorado</li>
        <li><strong>Enforced By:</strong> Colorado Attorney General</li>
      </ul>

      <h2>Is Your Hiring AI "High-Risk"?</h2>
      <p>
        The Colorado AI Act focuses on "high-risk AI systems" — those that make or substantially 
        contribute to consequential decisions. Employment decisions are explicitly listed as 
        consequential, meaning AI used in hiring is almost certainly covered.
      </p>
      
      <p>Your AI is high-risk if it influences decisions about:</p>
      <ul>
        <li>Hiring, recruiting, or screening candidates</li>
        <li>Promotions or demotions</li>
        <li>Termination</li>
        <li>Compensation and benefits</li>
        <li>Performance evaluation</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Key Point</p>
        <p className="text-orange-700">
          If you use AI anywhere in your hiring process in Colorado — including common tools like 
          LinkedIn Recruiter, Indeed, or HireVue — you're likely subject to these requirements.
        </p>
      </div>

      <h2>What the Law Requires</h2>

      <h3>1. Impact Assessments</h3>
      <p>
        Before deploying high-risk AI, you must complete an impact assessment that evaluates:
      </p>
      <ul>
        <li>The purpose and intended use of the AI system</li>
        <li>Benefits provided by the system</li>
        <li>Known or foreseeable risks of algorithmic discrimination</li>
        <li>Data used to train and operate the system</li>
        <li>Transparency measures for consumers</li>
        <li>How consumer feedback will be collected and addressed</li>
      </ul>
      <p>
        Impact assessments must be updated annually or when significant changes are made to the AI system.
      </p>

      <h3>2. Consumer Notifications</h3>
      <p>
        Before AI is used to make a consequential decision about someone, you must provide notice that:
      </p>
      <ul>
        <li>Discloses that AI is being used</li>
        <li>Explains the purpose of the AI system</li>
        <li>Describes the type of consequential decision being made</li>
        <li>Provides contact information for questions</li>
        <li>Describes how to request human review (if available)</li>
      </ul>

      <h3>3. Statement of Decision</h3>
      <p>
        If AI contributes to an adverse decision (like rejecting a candidate), you must provide:
      </p>
      <ul>
        <li>A statement that AI was used in the decision</li>
        <li>Information about the principal reasons for the decision</li>
        <li>How to appeal or request human review</li>
        <li>How to correct any incorrect data</li>
      </ul>

      <h3>4. Risk Management</h3>
      <p>
        Deployers must implement a risk management policy that:
      </p>
      <ul>
        <li>Identifies and mitigates discrimination risks</li>
        <li>Ensures human oversight of AI decisions</li>
        <li>Allows consumers to correct data and appeal decisions</li>
        <li>Maintains records of AI system use</li>
      </ul>

      <h2>Consumer Rights Under the Law</h2>
      <p>
        Colorado consumers (including job applicants) have specific rights:
      </p>
      <ul>
        <li><strong>Right to Notice:</strong> Know when AI is used in decisions about them</li>
        <li><strong>Right to Explanation:</strong> Understand the principal reasons for AI decisions</li>
        <li><strong>Right to Appeal:</strong> Request human review of AI-influenced decisions</li>
        <li><strong>Right to Correction:</strong> Correct inaccurate data used by AI</li>
        <li><strong>Right to Opt-Out:</strong> In some cases, opt out of AI-based profiling</li>
      </ul>

      <h2>Penalties for Non-Compliance</h2>
      <p>
        The Colorado Attorney General can enforce violations with:
      </p>
      <ul>
        <li>Civil penalties up to $20,000 per violation</li>
        <li>Injunctive relief (orders to stop using AI)</li>
        <li>Required corrective actions</li>
      </ul>
      <p>
        There's also an "affirmative defense" — if you discover and correct a violation within 90 days, 
        and it wasn't due to bad faith, you may avoid penalties. But this defense is limited and 
        prevention is far better than cure.
      </p>

      <h2>How to Comply: Checklist</h2>

      <h3>Before Using AI in Hiring</h3>
      <ul>
        <li>☐ Complete an impact assessment</li>
        <li>☐ Document your risk management policy</li>
        <li>☐ Create consumer notification templates</li>
        <li>☐ Establish a process for handling appeals</li>
        <li>☐ Train staff on compliance requirements</li>
      </ul>

      <h3>During the Hiring Process</h3>
      <ul>
        <li>☐ Provide pre-use notice to all candidates</li>
        <li>☐ Document when and how AI is used</li>
        <li>☐ Ensure human oversight of AI recommendations</li>
        <li>☐ Monitor for discriminatory outcomes</li>
      </ul>

      <h3>After Adverse Decisions</h3>
      <ul>
        <li>☐ Provide statement explaining AI's role</li>
        <li>☐ Explain principal reasons for decision</li>
        <li>☐ Offer opportunity to appeal or request review</li>
        <li>☐ Allow candidates to correct their data</li>
      </ul>

      <h3>Ongoing</h3>
      <ul>
        <li>☐ Review impact assessment annually</li>
        <li>☐ Update documentation when AI changes</li>
        <li>☐ Monitor for discrimination and bias</li>
        <li>☐ Maintain records for compliance</li>
      </ul>

      <h2>Impact Assessment Template</h2>
      <p>
        An impact assessment should cover (at minimum):
      </p>
      <ol>
        <li><strong>System Overview:</strong> What AI system? What vendor? What version?</li>
        <li><strong>Purpose:</strong> Why are you using this AI? What decisions does it support?</li>
        <li><strong>Data Inputs:</strong> What data does the AI analyze? Where does it come from?</li>
        <li><strong>Outputs:</strong> What does the AI produce? Scores? Rankings? Recommendations?</li>
        <li><strong>Human Oversight:</strong> How do humans review and oversee AI outputs?</li>
        <li><strong>Risk Analysis:</strong> What discrimination risks exist? How are they mitigated?</li>
        <li><strong>Testing:</strong> Has the AI been tested for bias? What were the results?</li>
        <li><strong>Consumer Rights:</strong> How will consumers be notified? How can they appeal?</li>
      </ol>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/compliance/colorado" className="text-blue-600 hover:underline">Colorado Compliance Page</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/templates" className="text-blue-600 hover:underline">Compliance Templates</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
      <LegalDisclaimer />
    </ArticleLayout>
  )
}
