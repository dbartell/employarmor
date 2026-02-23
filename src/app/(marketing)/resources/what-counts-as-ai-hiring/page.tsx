import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export default function WhatCountsAsAIPage() {
  return (
    <ArticleLayout
      title="What Counts as AI in Hiring? The Definitive 2026 Guide"
      description="LinkedIn Recruiter, Indeed assessments, HireVue, Workday, Greenhouse — do they trigger compliance requirements? Complete technical breakdown of what qualifies as AI under federal and state laws."
      category="Compliance Guide"
      readTime="12 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        One of the most common—and most critical—questions employers ask is: <strong>"Do I even use AI in hiring?"</strong> The answer might surprise you. Many everyday recruiting tools that don't explicitly market themselves as "artificial intelligence" still qualify as AI, automated decision-making technology (ADMT), or algorithmic employment tools under current regulations.
      </p>

      <p>
        Misunderstanding this question has real consequences. Employers using AI without realizing it face compliance violations, penalties, and discrimination liability. Meanwhile, employers who mistakenly believe basic tools are "AI" waste resources on unnecessary compliance overhead. This guide cuts through the confusion.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8">
        <p className="font-semibold text-amber-900 mb-2">🎯 Key Takeaway</p>
        <p className="text-amber-800">
          If a system uses computation to substantially assist or automate employment decisions—scoring, filtering, ranking, 
          or recommending candidates—it likely qualifies as AI under at least one regulatory framework, regardless of the 
          underlying technology. Machine learning is sufficient but not necessary.
        </p>
      </div>

      <h2>Legal Definitions: How Regulations Define AI</h2>

      <p>
        There is no single universal definition of "AI in hiring." Different jurisdictions use different terminology 
        and capture different technologies. Understanding these variations is critical because you might be compliant 
        in one state but non-compliant in another using the same tool.
      </p>

      <h3>New York City Local Law 144: "Automated Employment Decision Tool" (AEDT)</h3>

      <p>
        NYC's definition (Administrative Code §20-870) is the most technically specific:
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700 bg-blue-50 p-4">
        "Any computational process, derived from machine learning, statistical modeling, data analytics, or artificial 
        intelligence, that issues simplified output, including a score, classification, or recommendation, that is used 
        to substantially assist or replace discretionary decision making for making employment decisions."
      </blockquote>

      <p><strong>Key elements:</strong></p>
      <ul>
        <li><strong>"Computational process"</strong> — Broad enough to include traditional algorithms, not just modern AI</li>
        <li><strong>"Machine learning, statistical modeling, data analytics, or artificial intelligence"</strong> — Explicitly 
        includes ML/AI but also covers statistical and analytical approaches</li>
        <li><strong>"Simplified output"</strong> — Scores, rankings, classifications, pass/fail decisions, recommendations</li>
        <li><strong>"Substantially assist or replace"</strong> — Doesn't need to make the final decision; influencing human 
        decisions qualifies</li>
        <li><strong>"Employment decisions"</strong> — Hiring, promotion, or any selection decision for employment</li>
      </ul>

      <h3>Illinois HB 3773: "Artificial Intelligence"</h3>

      <p>
        Illinois (775 ILCS 5/2-108) defines AI for employment purposes as:
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700 bg-blue-50 p-4">
        "A machine-based system that, for explicit or implicit objectives, infers, from the input it receives, how to 
        generate outputs such as predictions, content, recommendations, or decisions that can influence physical or 
        virtual environments."
      </blockquote>

      <p><strong>Key elements:</strong></p>
      <ul>
        <li><strong>"Machine-based system"</strong> — Any computational system, not limited to advanced AI</li>
        <li><strong>"Infers... how to generate outputs"</strong> — Systems that learn patterns or apply rules to produce 
        decisions</li>
        <li><strong>"Predictions, content, recommendations, or decisions"</strong> — Covers a wide range of outputs</li>
        <li><strong>"Influence... environments"</strong> — Includes systems that affect real-world decisions (hiring, 
        promotions, etc.)</li>
      </ul>

      <h3>California CCPA/CPRA: "Automated Decision-Making Technology" (ADMT)</h3>

      <p>
        California (Cal. Code Regs. Title 11, §7002(c)) focuses on privacy and consumer rights:
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700 bg-blue-50 p-4">
        "Technology that processes personal information to make, or substantially facilitate human decision-making, 
        of decisions that produce legal or similarly significant effects concerning a consumer."
      </blockquote>

      <p><strong>Key elements:</strong></p>
      <ul>
        <li><strong>"Processes personal information"</strong> — Focuses on data processing aspect</li>
        <li><strong>"Make or substantially facilitate"</strong> — Again, influence is enough; doesn't need sole authority</li>
        <li><strong>"Legal or similarly significant effects"</strong> — Employment decisions clearly qualify as significant</li>
        <li>**Notably broad:** Includes rule-based systems, not just ML/AI</li>
      </ul>

      <h3>Colorado AI Act (SB24-205): "High-Risk Artificial Intelligence System"</h3>

      <p>
        Colorado takes a risk-based approach, regulating "high-risk" systems that pose substantial risk of algorithmic 
        discrimination. For employment, any AI system used in hiring, promotion, or termination decisions is presumptively 
        high-risk.
      </p>

      <h3>Federal: EEOC and DOL Guidance</h3>

      <p>
        The EEOC doesn't define "AI" in its guidance but makes clear that <em>any</em> selection procedure—whether 
        algorithmic, AI-driven, or human—must comply with Title VII, the ADA, and ADEA. The EEOC's focus is on 
        discriminatory outcomes, not the technology's classification.
      </p>

      <div className="bg-blue-50 border rounded-lg p-6 my-8">
        <p className="font-semibold text-blue-900 mb-3">The Practical Standard</p>
        <p className="text-blue-800">
          Given these varying definitions, the safest operational standard is: <strong>If a system uses computation 
          to filter, score, rank, evaluate, or recommend candidates—and those outputs influence your employment 
          decisions—treat it as AI/ADMT under at least one regulatory framework.</strong>
        </p>
      </div>

      <h2>Common Tools: What Qualifies and Why</h2>

      <h3>✅ Almost Certainly Covered: High-Confidence AI Tools</h3>

      <p>
        These tools are universally recognized as AI/ADMT across all regulatory frameworks:
      </p>

      <table className="w-full my-6 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3 border border-gray-300">Tool Type</th>
            <th className="text-left p-3 border border-gray-300">Examples</th>
            <th className="text-left p-3 border border-gray-300">Why It's AI</th>
            <th className="text-left p-3 border border-gray-300">Compliance Required</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3 border border-gray-300 font-medium">Video Interview Analysis</td>
            <td className="p-3 border border-gray-300">HireVue, Spark Hire, myInterview, Modern Hire</td>
            <td className="p-3 border border-gray-300">Analyzes facial expressions, tone, word choice, speech patterns using ML/NLP</td>
            <td className="p-3 border border-gray-300">NYC bias audit, IL notice, CO assessment, CA disclosure/opt-out</td>
          </tr>
          <tr className="border-b bg-gray-50">
            <td className="p-3 border border-gray-300 font-medium">AI Resume Screeners</td>
            <td className="p-3 border border-gray-300">Ideal, Pymetrics, Eightfold, Textio, Beamery</td>
            <td className="p-3 border border-gray-300">Automatically parses, scores, filters, and ranks candidates using ML models</td>
            <td className="p-3 border border-gray-300">All jurisdictions</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border border-gray-300 font-medium">Predictive Assessments</td>
            <td className="p-3 border border-gray-300">Pymetrics, Codility, HackerRank (AI scoring), Criteria</td>
            <td className="p-3 border border-gray-300">Uses algorithms/ML to predict job performance, culture fit, or likelihood of success</td>
            <td className="p-3 border border-gray-300">All jurisdictions</td>
          </tr>
          <tr className="border-b bg-gray-50">
            <td className="p-3 border border-gray-300 font-medium">Chatbots & Virtual Recruiters</td>
            <td className="p-3 border border-gray-300">Olivia (Paradox), Mya, XOR, Phenom</td>
            <td className="p-3 border border-gray-300">Screens candidates through automated conversation; filters based on responses</td>
            <td className="p-3 border border-gray-300">All jurisdictions</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 border border-gray-300 font-medium">Candidate Matching Engines</td>
            <td className="p-3 border border-gray-300">Eightfold, Phenom, SeekOut, HiredScore</td>
            <td className="p-3 border border-gray-300">Uses ML to match candidates to jobs based on skills, experience, and predicted fit</td>
            <td className="p-3 border border-gray-300">All jurisdictions</td>
          </tr>
        </tbody>
      </table>

      <h3>⚠️ Context-Dependent: Requires Configuration Analysis</h3>

      <p>
        These tools may or may not qualify depending on how you configure and use them:
      </p>

      <h4>LinkedIn Recruiter</h4>
      <ul className="my-4">
        <li><strong>AI Features (Covered):</strong> "Recommended Matches," "Likely to Engage" predictions, "Similar Candidates," 
        AI-powered search ranking</li>
        <li><strong>Non-AI Features (Not Covered):</strong> Manual boolean search, profile viewing, direct outreach without 
        AI recommendations</li>
        <li><strong>Verdict:</strong> If you rely on LinkedIn's AI recommendations or matching algorithms to decide who to 
        contact or consider, disclosure is required. If you only use manual search and your own judgment, likely not covered.</li>
      </ul>

      <h4>Indeed Hiring Platform</h4>
      <ul className="my-4">
        <li><strong>AI Features (Covered):</strong> Smart Sourcing (AI-powered candidate matching), Indeed Assessments with 
        auto-scoring, "Best Match" candidate ranking, screening questions with automated filtering</li>
        <li><strong>Non-AI Features (Not Covered):</strong> Basic job posting, receiving applications, manual resume review</li>
        <li><strong>Verdict:</strong> If you use Indeed Assessments with auto-scoring, Smart Sourcing, or screening question 
        filters that automatically eliminate candidates, you're using AI and must comply.</li>
      </ul>

      <h4>Applicant Tracking Systems (Greenhouse, Lever, Workday, iCIMS, Taleo)</h4>
      <ul className="my-4">
        <li><strong>AI Features (Covered):</strong> Resume parsing with automated scoring, candidate ranking algorithms, 
        knockout questions with auto-rejection, diversity analytics that influence decisions, predictive hiring tools</li>
        <li><strong>Non-AI Features (Not Covered):</strong> Simple data storage, calendar scheduling, email communications, 
        manual stage progression, workflow automation (moving candidates between stages without evaluation)</li>
        <li><strong>Verdict:</strong> Most modern ATS platforms offer AI features—often enabled by default. You must audit 
        your specific configuration. If the system scores, ranks, or automatically rejects candidates, it's AI.</li>
      </ul>

      <h4>Background Check Services (Checkr, Sterling, HireRight)</h4>
      <ul className="my-4">
        <li><strong>AI Features (Covered):</strong> Automated adjudication (AI decides pass/fail based on background check 
        results), risk scoring algorithms, predictive criminal recidivism models</li>
        <li><strong>Non-AI Features (Not Covered):</strong> Pulling records and presenting them for human review without 
        automated decision-making</li>
        <li><strong>Verdict:</strong> If you use "auto-adjudication" or "recommended decision" features, you're using AI. 
        Human-only review of raw background check data is not AI.</li>
      </ul>

      <h4>Skills Assessment Platforms (Codility, HackerRank, TestGorilla)</h4>
      <ul className="my-4">
        <li><strong>AI Features (Covered):</strong> AI-powered plagiarism detection that disqualifies candidates, predictive 
        scoring that estimates job performance, adaptive testing that adjusts difficulty based on ML models</li>
        <li><strong>Non-AI Features (Not Covered):</strong> Fixed assessments with manual scoring, code playback for human 
        review</li>
        <li><strong>Verdict:</strong> Check whether the platform uses AI to score responses or predict outcomes. Many modern 
        platforms do—especially for soft skills assessments.</li>
      </ul>

      <h3>❌ Generally Not Covered: Administrative and Non-Evaluative Tools</h3>

      <ul className="my-6 space-y-2">
        <li><strong>Basic job boards</strong> (ZipRecruiter basic posting, Monster, CareerBuilder without AI matching)</li>
        <li><strong>Calendar scheduling tools</strong> (Calendly, Chili Piper for interview booking)</li>
        <li><strong>Video conferencing</strong> (Zoom, Teams, Google Meet for live interviews without analysis)</li>
        <li><strong>Email/communication tools</strong> (Gmail, Outlook, candidate messaging)</li>
        <li><strong>Manual resume review</strong> (Humans reading resumes without algorithmic assistance)</li>
        <li><strong>Reference checking</strong> (Human-conducted phone or email reference checks)</li>
        <li><strong>HRIS data storage</strong> (Systems that store employee data without making decisions)</li>
      </ul>

      <h2>The Gray Areas: Emerging Technologies</h2>

      <h3>Large Language Models (ChatGPT, Claude, etc.)</h3>

      <p>
        If you use ChatGPT or similar tools to evaluate resumes, draft screening questions, or assess candidate responses, 
        you're using AI. Even though these are general-purpose tools not marketed for hiring, using them to assist 
        employment decisions brings them within regulatory scope.
      </p>

      <h3>Browser Extensions and Plugins</h3>

      <p>
        Chrome extensions that analyze LinkedIn profiles, score candidates, or provide recommendations likely qualify as AI 
        tools even if they're not "official" hiring software.
      </p>

      <h3>Custom Internal Tools</h3>

      <p>
        If your engineering team built a custom tool—even a simple one—that scores, filters, or ranks candidates algorithmically, 
        it's an AI hiring tool under most definitions. Home-grown tools are not exempt.
      </p>

      <h2>Common Misconceptions</h2>

      <h3>Myth #1: "It's not machine learning, so it's not AI"</h3>
      <p>
        <strong>Reality:</strong> Most regulations define AI broadly to include rule-based systems, statistical models, and 
        data analytics—not just modern machine learning. NYC explicitly includes "statistical modeling and data analytics." 
        A rule-based system that auto-rejects candidates without a bachelor's degree qualifies as AI in many jurisdictions.
      </p>

      <h3>Myth #2: "A human makes the final decision, so we're exempt"</h3>
      <p>
        <strong>Reality:</strong> Regulations cover tools that "substantially assist" or "facilitate" human decisions. If the 
        AI narrows your candidate pool from 1,000 to 20, even though a human picks the final 5, the AI substantially assisted. 
        You're not exempt.
      </p>

      <h3>Myth #3: "Our vendor says they're compliant, so we're covered"</h3>
      <p>
        <strong>Reality:</strong> Most AI hiring laws place compliance obligations on the <em>employer using the tool</em>, 
        not just the vendor. Vendor compliance is necessary but not sufficient. You must independently ensure your use of the 
        tool complies with applicable laws.
      </p>

      <h3>Myth #4: "We don't call it AI, so it's not AI"</h3>
      <p>
        <strong>Reality:</strong> Regulatory definitions are based on functionality, not marketing labels. If a tool functions 
        as AI under a legal definition—using computation to evaluate candidates—it's AI regardless of what the vendor calls it.
      </p>

      <h3>Myth #5: "Small tools or free tools don't count"</h3>
      <p>
        <strong>Reality:</strong> There is no "de minimis" exception for small-scale or low-cost AI. A free Chrome extension 
        that scores LinkedIn profiles is still an AI tool if it influences your decisions.
      </p>

      <h2>How to Conduct an AI Tool Audit</h2>

      <h3>Phase 1: Complete Inventory</h3>

      <p>Create a comprehensive spreadsheet listing every software tool, platform, or system involved in your hiring process:</p>

      <ul>
        <li>Sourcing tools (LinkedIn, Indeed, job boards, referral platforms)</li>
        <li>Application collection (ATS, careers site, application forms)</li>
        <li>Screening tools (resume parsers, knockout questions, pre-screen assessments)</li>
        <li>Assessment platforms (skills tests, personality assessments, situational judgment tests)</li>
        <li>Interview tools (video platforms, scheduling, interview guides)</li>
        <li>Background checks (criminal history, employment verification, education verification)</li>
        <li>Reference checking (automated surveys, phone systems)</li>
        <li>Decision support (hiring committee tools, offer management)</li>
      </ul>

      <h3>Phase 2: Functional Analysis</h3>

      <p>For each tool, answer these questions:</p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <ol className="space-y-3">
          <li><strong>1. Does it analyze candidate data?</strong> (Parsing resumes, analyzing video, scoring responses)</li>
          <li><strong>2. Does it generate scores, rankings, or classifications?</strong> (Qualification scores, culture fit 
          ratings, pass/fail decisions)</li>
          <li><strong>3. Does it provide recommendations?</strong> ("Best matches," "top candidates," "recommended for 
          interview")</li>
          <li><strong>4. Does it automate decisions?</strong> (Auto-rejecting candidates, filtering applicants, knockout 
          questions)</li>
          <li><strong>5. Does it use algorithms, machine learning, or statistical models?</strong> (Look in vendor 
          documentation)</li>
          <li><strong>6. Do the outputs influence your hiring decisions?</strong> (Do you actually use the scores/rankings 
          to decide who advances?)</li>
        </ol>
        <p className="mt-4 text-gray-700">
          <strong>If you answer "yes" to questions 1 AND (2, 3, or 4) AND 6 → the tool likely qualifies as AI.</strong>
        </p>
      </div>

      <h3>Phase 3: Vendor Documentation Review</h3>

      <p>Review each vendor's:</p>

      <ul>
        <li><strong>Marketing materials:</strong> Do they mention AI, ML, algorithms, or automation?</li>
        <li><strong>Technical documentation:</strong> What does the system actually do behind the scenes?</li>
        <li><strong>Privacy policy:</strong> Often describes data processing and algorithmic decision-making</li>
        <li><strong>Terms of service:</strong> May include language about automated systems</li>
      </ul>

      <p>Key search terms:</p>
      <ul>
        <li>Artificial intelligence, AI, machine learning, ML, deep learning</li>
        <li>Algorithm, automated decision-making, computational model</li>
        <li>Predictive analytics, matching technology, recommendation engine</li>
        <li>Natural language processing (NLP), computer vision</li>
        <li>Facial analysis, sentiment analysis, emotion recognition</li>
        <li>Statistical modeling, data science, analytics</li>
      </ul>

      <h3>Phase 4: Direct Vendor Inquiry</h3>

      <p>For any ambiguous tools, send this standard inquiry email:</p>

      <div className="bg-gray-100 border rounded-lg p-6 my-6 font-mono text-sm">
        <p className="mb-3">Subject: AI/ADMT Compliance Information Request</p>
        <p className="mb-3">Dear [Vendor Name],</p>
        <p className="mb-3">
          As part of our compliance with AI hiring regulations (NYC Local Law 144, Illinois HB 3773, Colorado SB24-205, 
          California CCPA ADMT, and related laws), we need to understand whether [Product Name] uses artificial intelligence, 
          machine learning, or automated decision-making technology.
        </p>
        <p className="mb-3">Please provide the following information:</p>
        <ul className="list-decimal list-inside mb-3 ml-4">
          <li>Does [Product Name] use AI, machine learning, statistical modeling, or algorithmic decision-making in any 
          features we use?</li>
          <li>If yes, which specific features involve AI/automation?</li>
          <li>What data does the AI process and what outputs does it generate?</li>
          <li>Have you conducted bias testing or disparate impact analysis on the AI components?</li>
          <li>Can you provide documentation of compliance with applicable AI hiring laws?</li>
        </ul>
        <p>Thank you for your prompt response.</p>
      </div>

      <h3>Phase 5: Document Your Findings</h3>

      <p>Create a final compliance matrix:</p>

      <table className="w-full my-6 border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border border-gray-300">Tool Name</th>
            <th className="text-left p-2 border border-gray-300">Vendor</th>
            <th className="text-left p-2 border border-gray-300">Function</th>
            <th className="text-left p-2 border border-gray-300">Uses AI?</th>
            <th className="text-left p-2 border border-gray-300">Compliance Required?</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2 border border-gray-300">Greenhouse</td>
            <td className="p-2 border border-gray-300">Greenhouse Software</td>
            <td className="p-2 border border-gray-300">ATS with candidate scoring</td>
            <td className="p-2 border border-gray-300 text-green-700 font-semibold">Yes</td>
            <td className="p-2 border border-gray-300">Disclosure, bias monitoring</td>
          </tr>
          <tr className="border-b bg-gray-50">
            <td className="p-2 border border-gray-300">Calendly</td>
            <td className="p-2 border border-gray-300">Calendly</td>
            <td className="p-2 border border-gray-300">Interview scheduling</td>
            <td className="p-2 border border-gray-300 text-red-700 font-semibold">No</td>
            <td className="p-2 border border-gray-300">None</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 border border-gray-300">HireVue</td>
            <td className="p-2 border border-gray-300">HireVue</td>
            <td className="p-2 border border-gray-300">Video interview analysis</td>
            <td className="p-2 border border-gray-300 text-green-700 font-semibold">Yes</td>
            <td className="p-2 border border-gray-300">Full compliance (audits, disclosure, etc.)</td>
          </tr>
        </tbody>
      </table>

      <h2>Decision Tree: Is This Tool AI?</h2>

      <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 my-8">
        <p className="font-bold text-blue-900 mb-4 text-lg">Start Here: Does the tool process candidate data?</p>
        <div className="ml-4">
          <p className="font-semibold text-blue-800 mb-2">→ No: <span className="font-normal">Not AI. No compliance needed.</span></p>
          <p className="font-semibold text-blue-800 mb-2">→ Yes: Go to next question ↓</p>
        </div>
        
        <p className="font-bold text-blue-900 my-4">Does it generate scores, rankings, recommendations, or automated decisions?</p>
        <div className="ml-4">
          <p className="font-semibold text-blue-800 mb-2">→ No: <span className="font-normal">Likely not AI. Probably just data storage/admin.</span></p>
          <p className="font-semibold text-blue-800 mb-2">→ Yes: Go to next question ↓</p>
        </div>
        
        <p className="font-bold text-blue-900 my-4">Do you use those outputs to make employment decisions?</p>
        <div className="ml-4">
          <p className="font-semibold text-blue-800 mb-2">→ No: <span className="font-normal">Low risk, but still document that outputs are ignored.</span></p>
          <p className="font-semibold text-blue-800 mb-2">→ Yes: Go to next question ↓</p>
        </div>
        
        <p className="font-bold text-blue-900 my-4">Does it use algorithms, ML, statistical models, or computational analysis?</p>
        <div className="ml-4">
          <p className="font-semibold text-green-700 mb-2">→ Yes: <span className="font-extrabold">This is AI. Compliance required.</span></p>
          <p className="font-semibold text-blue-800 mb-2">→ Unsure: <span className="font-normal">Ask the vendor. If they won't answer clearly, assume yes.</span></p>
        </div>
      </div>

      <h2>What To Do If You're Using AI</h2>

      <p>
        Once you've identified AI tools in your hiring process, compliance typically requires:
      </p>

      <h3>1. Candidate Notification (All Jurisdictions)</h3>
      <ul>
        <li>Provide clear notice that AI is used in hiring</li>
        <li>Explain what the AI evaluates and how it influences decisions</li>
        <li>Timing: at or before AI is used (job posting, application, or assessment invitation)</li>
        <li>Method: prominent disclosure on careers page, job postings, or application forms</li>
      </ul>

      <h3>2. Bias Testing and Audits (NYC, Emerging in Other Jurisdictions)</h3>
      <ul>
        <li>NYC requires annual independent bias audits testing for disparate impact</li>
        <li>Other jurisdictions recommend regular bias monitoring</li>
        <li>Test AI outputs for statistically significant disparities across race, gender, and other protected categories</li>
      </ul>

      <h3>3. Impact Assessments (Colorado, California)</h3>
      <ul>
        <li>Document the purpose, functionality, and risks of high-risk AI systems</li>
        <li>Evaluate potential for discrimination and implement safeguards</li>
        <li>Submit to regulators upon request</li>
      </ul>

      <h3>4. Opt-Out or Alternative Processes (California)</h3>
      <ul>
        <li>Provide mechanisms for candidates to opt out of automated decision-making</li>
        <li>Offer human review as an alternative</li>
      </ul>

      <h3>5. Documentation and Recordkeeping</h3>
      <ul>
        <li>Maintain records of AI tools used, disclosures provided, and compliance efforts</li>
        <li>Retention period: typically 3-4 years</li>
      </ul>

      <h2>Tools by Use Case</h2>

      <p>Still unsure about specific tools? Here's a detailed breakdown by category:</p>

      <h3>Sourcing & Candidate Discovery</h3>
      <ul>
        <li><strong>LinkedIn Recruiter (AI features):</strong> AI</li>
        <li><strong>SeekOut:</strong> AI (ML-powered sourcing)</li>
        <li><strong>Phenom:</strong> AI (AI talent marketplace)</li>
        <li><strong>Entelo:</strong> AI (predictive sourcing)</li>
        <li><strong>Basic Boolean search on job boards:</strong> Not AI</li>
      </ul>

      <h3>Resume Screening</h3>
      <ul>
        <li><strong>Ideal:</strong> AI</li>
        <li><strong>Eightfold.ai:</strong> AI</li>
        <li><strong>HiredScore:</strong> AI</li>
        <li><strong>Pymetrics:</strong> AI</li>
        <li><strong>Manual resume reading:</strong> Not AI</li>
      </ul>

      <h3>Video Interviews</h3>
      <ul>
        <li><strong>HireVue (with assessment scoring):</strong> AI</li>
        <li><strong>Spark Hire (basic recording only):</strong> Not AI</li>
        <li><strong>Modern Hire:</strong> AI (if using scoring features)</li>
        <li><strong>Zoom/Teams for live interviews:</strong> Not AI</li>
      </ul>

      <h3>Skills Assessments</h3>
      <ul>
        <li><strong>Codility (with AI scoring):</strong> AI</li>
        <li><strong>HackerRank (with predictive scoring):</strong> AI</li>
        <li><strong>TestGorilla:</strong> AI (if using AI proctoring or adaptive testing)</li>
        <li><strong>Fixed assessments with manual scoring:</strong> Not AI</li>
      </ul>

      <h2>Next Steps</h2>

      <p className="mb-4">
        Now that you know what counts as AI, the next critical step is understanding your specific compliance obligations 
        based on where you hire and what tools you use.
      </p>

      <div className="grid md:grid-cols-2 gap-4 my-8">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 hover:border-blue-500 transition-all">
          <h3 className="font-bold text-gray-900 mb-2">Take the Free Scorecard</h3>
          <p className="text-gray-600 mb-4">Answer 5 quick questions and get a personalized compliance assessment.</p>
          <Link href="/scorecard" className="text-blue-600 hover:underline font-semibold">
            Get Your Compliance Score →
          </Link>
        </div>
        
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 hover:border-blue-500 transition-all">
          <h3 className="font-bold text-gray-900 mb-2">State-by-State Guides</h3>
          <p className="text-gray-600 mb-4">Detailed compliance requirements for every jurisdiction.</p>
          <Link href="/resources/ai-hiring-laws-by-state" className="text-blue-600 hover:underline font-semibold">
            View All State Laws →
          </Link>
        </div>
      </div>

      <h2>Related Resources</h2>
      <ul className="space-y-2">
        <li><Link href="/resources/ai-hiring-compliance-guide-2026" className="text-blue-600 hover:underline">→ Complete AI Hiring Compliance Guide 2026</Link></li>
        <li><Link href="/resources/ai-bias-audit-guide" className="text-blue-600 hover:underline">→ Bias Audit Implementation Guide</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">→ AI Disclosure Notice Templates</Link></li>
        <li><Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:underline">→ How to Assess AI Vendors</Link></li>
        <li><Link href="/resources/hirevue-compliance" className="text-blue-600 hover:underline">→ HireVue Compliance Guide</Link></li>
        <li><Link href="/resources/linkedin-recruiter-ai-compliance" className="text-blue-600 hover:underline">→ LinkedIn Recruiter Compliance</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
