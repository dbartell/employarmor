import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export default function IllinoisAIHiringLawPage() {
  return (
    <ArticleLayout
      title="Illinois AI Hiring Law (HB 3773): Everything Employers Need to Know"
      description="A complete guide to Illinois's AI in hiring regulations, effective January 1, 2026. Learn what's required, who's covered, and how to comply."
      category="State Law"
      readTime="12 min read"
      publishedDate="January 15, 2026"
    >
      <AuthorByline publishDate="2025-02-20" />

      <p>
        Illinois House Bill 3773, signed into law in 2024, establishes new requirements for employers 
        using artificial intelligence in hiring and employment decisions. If you hire in Illinois, 
        here's everything you need to know.
      </p>

      <h2>Key Dates</h2>
      <ul>
        <li><strong>Effective Date:</strong> January 1, 2026</li>
        <li><strong>Applies To:</strong> All employers using AI in employment decisions in Illinois</li>
      </ul>

      <h2>What Does the Law Require?</h2>
      
      <h3>1. Notice to Applicants and Employees</h3>
      <p>
        Employers must notify applicants and employees when AI is used to make or assist in making 
        employment decisions. This notification must include:
      </p>
      <ul>
        <li>That AI is being used in the decision-making process</li>
        <li>What specific purposes the AI serves</li>
        <li>What data or inputs the AI uses to make decisions</li>
        <li>How the AI's output influences the employment decision</li>
      </ul>

      <h3>2. Non-Discrimination Requirements</h3>
      <p>
        The law prohibits employers from using AI that discriminates against employees or applicants 
        based on protected characteristics, including:
      </p>
      <ul>
        <li>Race, color, national origin</li>
        <li>Religion, sex, sexual orientation, gender identity</li>
        <li>Age, disability, military status</li>
        <li>Any other protected class under Illinois law</li>
      </ul>

      <h3>3. Record Keeping</h3>
      <p>
        While the law doesn't specify exact record-keeping requirements, best practice is to maintain:
      </p>
      <ul>
        <li>Documentation of all AI tools used in hiring</li>
        <li>Copies of notices provided to applicants</li>
        <li>Evidence of bias testing and monitoring</li>
        <li>Audit trails of AI-assisted decisions</li>
      </ul>

      <h2>What Counts as "AI" Under This Law?</h2>
      <p>
        The law defines AI broadly to include any machine-based system that can make predictions, 
        recommendations, or decisions influencing real or virtual environments. Common examples include:
      </p>
      <ul>
        <li><strong>Resume Screening Tools:</strong> Software that automatically filters or ranks resumes</li>
        <li><strong>Video Interview Analysis:</strong> Platforms that analyze facial expressions, tone, or word choice</li>
        <li><strong>Skills Assessments:</strong> AI-scored tests or games that evaluate candidates</li>
        <li><strong>Chatbots:</strong> Automated systems that screen or interact with applicants</li>
        <li><strong>ATS Features:</strong> Applicant tracking systems with AI-powered matching or scoring</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Important Note</p>
        <p className="text-orange-700">
          Popular tools like LinkedIn Recruiter, Indeed Assessments, and HireVue may trigger these 
          requirements. Audit your hiring tech stack to identify all AI-powered tools.
        </p>
      </div>

      <h2>Penalties for Non-Compliance</h2>
      <p>
        Violations of Illinois HB 3773 may result in:
      </p>
      <ul>
        <li>Civil rights violations under the Illinois Human Rights Act</li>
        <li>Investigation by the Illinois Department of Human Rights</li>
        <li>Private right of action by affected individuals</li>
        <li>Compensatory and punitive damages</li>
        <li>Attorneys' fees and costs</li>
      </ul>

      <h2>How to Comply: Step-by-Step</h2>

      <h3>Step 1: Audit Your Hiring Tools</h3>
      <p>
        Create an inventory of every tool used in your hiring process. For each tool, determine:
      </p>
      <ul>
        <li>Does it use AI, machine learning, or automated decision-making?</li>
        <li>What data does it collect and analyze?</li>
        <li>How does it influence hiring decisions?</li>
      </ul>

      <h3>Step 2: Create Disclosure Notices</h3>
      <p>
        Draft clear, understandable notices that explain your AI use. The notice should be provided:
      </p>
      <ul>
        <li>Before or at the time AI is first used on an individual</li>
        <li>In a format the applicant can save or print</li>
        <li>In plain language (avoid technical jargon)</li>
      </ul>

      <h3>Step 3: Test for Bias</h3>
      <p>
        Regularly evaluate your AI tools for discriminatory outcomes:
      </p>
      <ul>
        <li>Compare outcomes across demographic groups</li>
        <li>Review AI vendor's bias testing documentation</li>
        <li>Consider third-party audits for high-risk tools</li>
      </ul>

      <h3>Step 4: Train Your Team</h3>
      <p>
        Ensure HR staff and hiring managers understand:
      </p>
      <ul>
        <li>Which tools are covered by the law</li>
        <li>When and how to provide disclosures</li>
        <li>How to document compliance efforts</li>
      </ul>

      <h3>Step 5: Establish Ongoing Monitoring</h3>
      <p>
        Compliance isn't one-and-done. Set up processes to:
      </p>
      <ul>
        <li>Review new tools before deployment</li>
        <li>Update notices when tools change</li>
        <li>Conduct periodic bias reviews</li>
        <li>Stay informed about regulatory guidance</li>
      </ul>

      <h2>Sample Disclosure Language</h2>
      <p>
        While you should customize for your specific tools, here's a starting point:
      </p>
      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="italic text-gray-700">
          "[Company Name] uses artificial intelligence to assist in evaluating candidates for 
          employment. Specifically, we use [Tool Name] to [specific purpose, e.g., "screen resumes 
          for relevant qualifications"]. This tool analyzes [data inputs, e.g., "your resume text, 
          work history, and skills"] to [output, e.g., "generate a compatibility score"]. The AI's 
          output is one factor among many that our hiring team considers when making employment 
          decisions. You have the right to request information about how AI was used in evaluating 
          your application."
        </p>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Does this apply to small businesses?</h3>
      <p>
        Yes, the law applies to all employers using AI in employment decisions in Illinois, 
        regardless of company size.
      </p>

      <h3>What if my AI vendor handles compliance?</h3>
      <p>
        Ultimately, the employer is responsible for compliance. Vendor support is helpful, but 
        you must ensure notices are provided and non-discrimination requirements are met.
      </p>

      <h3>Can I still use AI in hiring?</h3>
      <p>
        Absolutely. The law doesn't prohibit AI use—it regulates it. With proper disclosures and 
        bias monitoring, you can continue to benefit from AI-powered hiring tools.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/compliance/illinois" className="text-blue-600 hover:underline">Illinois Compliance Page</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/templates/ai-disclosure-notice" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
      <LegalDisclaimer />
    </ArticleLayout>
  )
}
