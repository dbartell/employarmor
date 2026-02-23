{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "Candidate Rights Under AI Hiring Laws: What Job Seekers Can Demand | EmployArmor",
  description: "From disclosure to opt-out rights to data deletion, here's what candidates can legally demand when AI is used in hiring.",
}

export default function CandidateRightsAIHiringPage() {
  return (
    <ArticleLayout
      title="Candidate Rights Under AI Hiring Laws: What You Can Demand"
      description="Job seekers have more rights than ever when AI is used in hiring decisions. Here's what the law guarantees—and how to exercise those rights."
      category="Candidate Rights"
      readTime="12 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        If you're applying for jobs in 2026, there's a good chance artificial intelligence will evaluate your 
        application before any human sees it. AI might screen your resume, analyze your video interview, score 
        your assessment responses, or rank you against other candidates. This isn't speculation—it's standard 
        practice at many employers.
      </p>

      <p>
        But here's what many job seekers don't know: <strong>you have legal rights</strong> when employers use AI 
        in hiring. Depending on where you live or where the job is located, you may have the right to know when AI 
        is being used, understand how it evaluates you, opt out of AI evaluation, request human review, and even 
        demand deletion of your data.
      </p>

      <p>This guide explains those rights—and how to exercise them.</p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
        <p className="font-semibold text-blue-900 mb-2">Know Your Rights:</p>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>✓ Right to disclosure (know when AI is used)</li>
          <li>✓ Right to explanation (understand what AI evaluates)</li>
          <li>✓ Right to opt out (request non-AI evaluation)</li>
          <li>✓ Right to human review</li>
          <li>✓ Right to data deletion</li>
          <li>✓ Right to accommodation (if you have a disability)</li>
        </ul>
      </div>

      <h2>Your Rights Vary by Location</h2>

      <p>
        AI hiring laws are <strong>state and local</strong>, not federal (yet). Your rights depend on where you live 
        or where the job is located. Here's the breakdown:
      </p>

      <h3>Strongest Protections: Illinois, NYC, California, Colorado, Maryland</h3>

      <p>
        If you're applying for jobs in these jurisdictions, you have the most comprehensive rights:
      </p>

      <ul>
        <li><strong>Illinois:</strong> Right to notice and consent before AI video analysis; right to data deletion within 30 days</li>
        <li><strong>New York City:</strong> Right to know AI is used at least 10 days in advance; right to alternative evaluation</li>
        <li><strong>California:</strong> Right to disclosure before application; right to annual bias audit transparency</li>
        <li><strong>Colorado:</strong> Right to opt out of AI evaluation; right to human review</li>
        <li><strong>Maryland:</strong> Right to consent before facial analysis; right to revoke consent and delete data</li>
      </ul>

      <h3>Moderate Protections: Washington, Other Emerging States</h3>

      <p>
        States with newer or narrower laws provide some protections, typically around disclosure and notice.
      </p>

      <h3>Baseline Federal Rights: Everywhere</h3>

      <p>
        Even in states without specific AI hiring laws, you have baseline protections under federal law:
      </p>

      <ul>
        <li><strong>Title VII (Civil Rights Act):</strong> Protection from race, sex, national origin, religion discrimination—including algorithmic discrimination</li>
        <li><strong>ADA (Americans with Disabilities Act):</strong> Right to reasonable accommodation if AI tools disadvantage you due to disability</li>
        <li><strong>ADEA (Age Discrimination in Employment Act):</strong> Protection from age-based algorithmic bias (if you're 40+)</li>
      </ul>

      <h2>The Right to Know: Disclosure</h2>

      <p>
        The most fundamental right: <strong>you must be told when AI is being used to evaluate you.</strong>
      </p>

      <h3>What Employers Must Disclose</h3>

      <p>In jurisdictions with strong laws, employers must tell you:</p>

      <ul>
        <li><strong>That AI is being used:</strong> Not just "technology" or "software"—specifically AI or automated decision-making</li>
        <li><strong>What the AI evaluates:</strong> Resume keywords? Video interview responses? Speech patterns? Facial expressions?</li>
        <li><strong>How it affects decisions:</strong> Does it screen you out automatically? Rank you? Provide recommendations to humans?</li>
        <li><strong>What data is collected:</strong> Video recordings? Voice patterns? Personal information?</li>
      </ul>

      <h3>When Disclosure Must Occur</h3>

      <ul>
        <li><strong>NYC:</strong> At least 10 business days before AI is used</li>
        <li><strong>California:</strong> Before you submit your application</li>
        <li><strong>Illinois:</strong> Before AI video analysis occurs</li>
        <li><strong>Colorado:</strong> At or before data collection</li>
      </ul>

      <h3>What to Look For</h3>

      <p>Check for AI disclosures in:</p>
      <ul>
        <li>Job postings (often at the bottom)</li>
        <li>Company career pages</li>
        <li>Application forms (before you submit)</li>
        <li>Interview scheduling emails</li>
      </ul>

      <h3>Red Flag: No Disclosure</h3>

      <p>
        If you suspect AI is being used but see no disclosure, the employer may be in violation. In NYC, California, 
        Colorado, and Illinois, you can file a complaint with state regulators.
      </p>

      <h2>The Right to Explanation</h2>

      <p>
        It's not enough to be told "AI is used." You have the right to understand <strong>what the AI evaluates 
        and how</strong>.
      </p>

      <h3>Questions You Can Ask</h3>

      <p>Employers must be able to answer:</p>

      <ul>
        <li>"What specific factors does the AI evaluate?" (keywords, speech patterns, facial expressions, etc.)</li>
        <li>"What job qualifications is the AI assessing?"</li>
        <li>"Does the AI's recommendation determine my outcome, or do humans make the final decision?"</li>
        <li>"Has the AI been tested for bias? Can I see the results?"</li>
      </ul>

      <h3>NYC Transparency Requirement</h3>

      <p>
        In NYC, employers must <strong>publicly publish bias audit results</strong> showing how their AI affects 
        different demographic groups. You can request the URL where this information is posted.
      </p>

      <h2>The Right to Opt Out</h2>

      <p>
        In Colorado and (via accommodation requests) other states, you can <strong>decline AI evaluation and request 
        an alternative process</strong>.
      </p>

      <h3>What "Alternative Process" Means</h3>

      <p>
        Employers must offer a genuinely different evaluation method:
      </p>

      <ul>
        <li>Phone or live video interview instead of AI-analyzed asynchronous video</li>
        <li>Human resume review instead of AI screening</li>
        <li>Different assessment format (e.g., work sample instead of gamified AI test)</li>
      </ul>

      <h3>How to Opt Out</h3>

      <p>Look for opt-out instructions in the AI disclosure. Common methods:</p>

      <ul>
        <li>Email address: "To request alternative evaluation, contact hiring@company.com"</li>
        <li>Checkbox during application: "I prefer human-only evaluation"</li>
        <li>Phone number or contact form</li>
      </ul>

      <h3>Important: Opting Out Cannot Hurt You</h3>

      <p>
        Laws explicitly prohibit employers from penalizing candidates who opt out. If you request alternative 
        evaluation, you should not experience:
      </p>

      <ul>
        <li>Longer wait times</li>
        <li>More difficult evaluation standards</li>
        <li>Automatic rejection</li>
        <li>Any other adverse treatment</li>
      </ul>

      <p>
        If you believe you were penalized for opting out, document it and file a complaint with your state's 
        labor/employment agency.
      </p>

      <h2>The Right to Human Review</h2>

      <p>
        Colorado law explicitly requires that <strong>humans make the final hiring decision</strong>, not AI alone. 
        California and other states are moving in this direction.
      </p>

      <h3>What This Means</h3>

      <ul>
        <li>AI can provide recommendations or scores</li>
        <li>But a human must review those recommendations</li>
        <li>The human must be able to override AI decisions</li>
        <li>Fully automated rejection (no human involvement) is prohibited</li>
      </ul>

      <h3>How to Verify Human Review Happened</h3>

      <p>If you're rejected, you can ask:</p>

      <ul>
        <li>"Was my application reviewed by a human, or was I automatically screened out by AI?"</li>
        <li>"Can you tell me which person reviewed my application?"</li>
        <li>"Was the AI's recommendation the sole basis for my rejection, or did a human consider other factors?"</li>
      </ul>

      <p>
        Employers aren't always required to answer these questions, but asking signals that you know your rights—and 
        may prompt more careful review.
      </p>

      <h2>The Right to Data Deletion</h2>

      <h3>Illinois: 30-Day Deletion Right</h3>

      <p>
        If you're in Illinois and an employer used AI to analyze your video interview, you can <strong>request 
        deletion of the video and all AI-generated data within 30 days</strong>.
      </p>

      <p>How to request:</p>
      <ul>
        <li>Send an email to the contact address in the AI disclosure</li>
        <li>Subject line: "Video Interview Data Deletion Request"</li>
        <li>Include: Your name, email, position applied for, date of interview</li>
        <li>Request confirmation of deletion</li>
      </ul>

      <h3>Maryland: Consent Revocation</h3>

      <p>
        Maryland allows you to <strong>revoke consent</strong> for facial analysis at any time. Upon revocation, 
        the employer must delete your data within 30 days.
      </p>

      <h3>GDPR (If You're in the EU)</h3>

      <p>
        EU residents have a robust "right to erasure" under GDPR. If you're applying for a job with an EU-based 
        employer or a U.S. company with EU operations, you can request deletion of your data.
      </p>

      <h2>The Right to Accommodation (ADA)</h2>

      <p>
        If you have a disability, you have <strong>federal ADA rights</strong> to reasonable accommodation—even if 
        your state has no specific AI hiring law.
      </p>

      <h3>When to Request Accommodation</h3>

      <p>Request accommodation if the AI tool disadvantages you due to:</p>

      <ul>
        <li><strong>Speech impediments:</strong> AI analyzes speech patterns or clarity</li>
        <li><strong>Hearing impairments:</strong> Affecting your speech or ability to respond to audio prompts</li>
        <li><strong>Vision impairments:</strong> AI expects eye contact or visual tasks</li>
        <li><strong>Autism spectrum:</strong> AI penalizes atypical eye contact, facial expressions, or speech patterns</li>
        <li><strong>Anxiety/PTSD:</strong> AI-analyzed video interviews trigger severe anxiety</li>
        <li><strong>Cognitive disabilities:</strong> Timed AI assessments or complex gamified tests</li>
      </ul>

      <h3>How to Request Accommodation</h3>

      <p><strong>Timing:</strong> As soon as you learn AI will be used, preferably before the AI evaluation occurs.</p>

      <p><strong>Method:</strong> Email or call the HR contact listed in the job posting or AI disclosure.</p>

      <p><strong>What to say:</strong></p>

      <blockquote className="border-l-4 border-gray-300 pl-4 my-6 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          "I am applying for [position] and I have a disability that may affect my performance on the [AI video 
          interview/assessment]. Under the ADA, I am requesting a reasonable accommodation. Specifically, I request 
          [describe alternative: e.g., 'a phone interview instead of video,' 'extended time on the assessment,' 
          'turning off facial expression analysis'].
        </p>
        <p className="text-sm mt-2">
          Please let me know what documentation you need and how we can proceed."
        </p>
      </blockquote>

      <h3>What Employers Must Do</h3>

      <p>
        Employers must engage in an "interactive process"—a conversation about what accommodation is needed and 
        what's reasonable. They cannot:
      </p>

      <ul>
        <li>Automatically reject your request</li>
        <li>Require extensive medical documentation for obvious accommodations</li>
        <li>Penalize you for requesting accommodation</li>
        <li>Force you to use the AI tool despite your disability-related concerns</li>
      </ul>

      <h2>How to File a Complaint</h2>

      <p>
        If an employer violates your AI hiring rights, you can file complaints with multiple agencies:
      </p>

      <h3>State/Local Agencies</h3>

      <ul>
        <li><strong>NYC:</strong> Department of Consumer and Worker Protection (for LL144 violations)</li>
        <li><strong>California:</strong> Attorney General's Office</li>
        <li><strong>Colorado:</strong> Attorney General's Office</li>
        <li><strong>Illinois:</strong> Department of Labor (for AIVIA violations)</li>
      </ul>

      <h3>Federal Agencies</h3>

      <ul>
        <li><strong>EEOC:</strong> For race, sex, age, disability, or other protected class discrimination claims</li>
        <li><strong>DOL (Department of Labor):</strong> In some cases, for systemic violations</li>
      </ul>

      <h3>What to Include in Your Complaint</h3>

      <ul>
        <li>Company name and job title you applied for</li>
        <li>Date of application/interview</li>
        <li>Description of AI tool used (if known)</li>
        <li>What disclosure you did or didn't receive</li>
        <li>What rights violation occurred (no disclosure, no opt-out offered, penalized for accommodation request, etc.)</li>
        <li>Any documentation (screenshots, emails, job posting copies)</li>
      </ul>

      <h2>Practical Tips for Job Seekers</h2>

      <h3>Tip 1: Read Everything Carefully</h3>

      <p>
        Don't skip the fine print. AI disclosures are often buried in privacy policies, terms of use, or at the 
        bottom of job postings. Read them before applying.
      </p>

      <h3>Tip 2: Screenshot Everything</h3>

      <p>
        If you later need to prove you weren't disclosed to, or that you requested accommodation, you'll need 
        evidence. Screenshot:
      </p>

      <ul>
        <li>Job postings</li>
        <li>AI disclosures (or lack thereof)</li>
        <li>Application pages</li>
        <li>Emails from employers</li>
      </ul>

      <h3>Tip 3: Ask Questions</h3>

      <p>
        Don't be afraid to email HR and ask about AI use. Questions like:
      </p>

      <ul>
        <li>"Do you use AI in your hiring process?"</li>
        <li>"What does the AI evaluate?"</li>
        <li>"Can I request human-only review?"</li>
      </ul>

      <p>
        Professional employers will answer. Evasive responses are a red flag.
      </p>

      <h3>Tip 4: Optimize for AI (If You Don't Opt Out)</h3>

      <p>
        If you choose to proceed with AI evaluation, understand how to optimize:
      </p>

      <ul>
        <li><strong>Resumes:</strong> Use keywords from the job description; avoid weird formatting that AI can't parse</li>
        <li><strong>Video interviews:</strong> Good lighting, quiet environment, look at the camera, speak clearly</li>
        <li><strong>Assessments:</strong> Practice similar assessments beforehand; read instructions carefully</li>
      </ul>

      <h3>Tip 5: Know When to Opt Out</h3>

      <p>Consider opting out if:</p>

      <ul>
        <li>You have a disability that AI might penalize</li>
        <li>You're a non-native English speaker and the AI analyzes speech</li>
        <li>The AI evaluates things not clearly job-related (facial expressions, personality traits)</li>
        <li>You're uncomfortable with video analysis</li>
      </ul>

      <h2>The Future: Rights That Are Coming</h2>

      <p>
        Proposed legislation and emerging trends suggest candidates will gain additional rights:
      </p>

      <h3>Right to Explanation of Decisions</h3>

      <p>
        Future laws may require employers to explain <strong>why</strong> AI rejected you—what factors led to the 
        decision.
      </p>

      <h3>Right to Appeal/Contest</h3>

      <p>
        Ability to challenge AI decisions and have a human reconsider without the AI's influence.
      </p>

      <h3>Right to Bias Audit Transparency</h3>

      <p>
        Expansion of NYC's model: all employers must publish bias audit results, not just those in NYC.
      </p>

      <h3>Right to AI-Free Hiring</h3>

      <p>
        Some advocates are pushing for opt-out to be the default—candidates must opt <em>in</em> to AI evaluation, 
        not opt out.
      </p>

      <h2>Resources for Job Seekers</h2>

      <h3>Where to Learn More</h3>

      <ul>
        <li><strong>EEOC AI Guidance:</strong> eeoc.gov (search "AI hiring")</li>
        <li><strong>NYC DCWP:</strong> Information on Local Law 144 rights</li>
        <li><strong>ACLU:</strong> Resources on AI and civil rights</li>
        <li><strong>Electronic Privacy Information Center (EPIC):</strong> AI accountability resources</li>
      </ul>

      <h3>Legal Aid</h3>

      <p>
        If you believe you've been discriminated against by AI hiring tools and need legal help:
      </p>

      <ul>
        <li>Contact your state's Legal Aid Society</li>
        <li>EEOC offers free investigation and potential representation</li>
        <li>Employment lawyers often work on contingency (no upfront fees)</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">For Employers: Respect Candidate Rights</p>
        <p className="text-blue-700 mb-4">EmployArmor helps you comply with all candidate rights requirements</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Compliant →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>If I opt out of AI evaluation, will employers think I have something to hide?</h3>
      <p>
        Opting out is a legal right, not a red flag. Many legitimate reasons exist: disability, discomfort with 
        video analysis, belief that AI doesn't capture your strengths. Professional employers understand this and 
        won't penalize you.
      </p>

      <h3>Can I find out my AI score after being rejected?</h3>
      <p>
        Currently, most laws don't require employers to disclose individual scores. However, you can ask—some 
        employers will provide feedback. If there's evidence the AI score was the sole reason for rejection and 
        you're in a protected class, an EEOC complaint might compel disclosure during investigation.
      </p>

      <h3>What if I'm applying from one state for a job in another state—which laws apply?</h3>
      <p>
        Generally, the laws of <strong>both</strong> your location and the job location may apply. If you're in 
        Illinois applying for a California job, you get the protections of both states. Employers should comply 
        with the stricter standard.
      </p>

      <h3>Can I sue an employer for AI hiring discrimination?</h3>
      <p>
        Yes, under federal laws (Title VII, ADA, ADEA) and some state laws. You typically must file an EEOC or 
        state agency complaint first. If the agency doesn't resolve it, you can file a lawsuit. Consult an 
        employment lawyer.
      </p>

      <h3>How do I know if AI was used if there was no disclosure?</h3>
      <p>
        Signs: automated immediate rejection, instructions to record video responses on your own time, online 
        assessments with games or puzzles, very fast screening (minutes after applying). If you suspect AI was 
        used without disclosure, ask the employer directly or file a complaint.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">Complete AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/blog/video-interview-ai-compliance" className="text-blue-600 hover:underline">Video Interview AI Compliance</Link></li>
        <li><Link href="/blog/ai-hiring-laws-2026" className="text-blue-600 hover:underline">2026 AI Hiring Laws: What Changed</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
