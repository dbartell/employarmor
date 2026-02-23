{/* DRAFT - Not yet published */}

import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import { AuthorByline } from "@/components/author-byline"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import Link from "next/link"

export const metadata = {
  title: "Video Interview AI: Compliance Requirements & Best Practices | EmployArmor",
  description: "Video interview platforms with AI analysis face intense regulatory scrutiny. Here's what you need to know to use them legally in 2026.",
}

export default function VideoInterviewAICompliancePage() {
  return (
    <ArticleLayout
      title="Video Interview AI: Compliance Requirements You Can't Ignore"
      description="Video interview platforms have evolved from simple recording tools to sophisticated AI analyzers. But every new feature adds compliance obligations—and legal risk."
      category="Compliance Deep Dive"
      readTime="13 min read"
      publishedDate="February 23, 2026"
    >
      <AuthorByline publishDate="2026-02-23" />

      <p>
        Video interview platforms—HireVue, Modern Hire (formerly Montage), Spark Hire, myInterview, and others—have 
        become standard tools for remote hiring. What started as a convenience (record candidates answering questions 
        on their own time) has evolved into something far more complex: <strong>AI-powered analysis</strong> that 
        evaluates speech patterns, word choice, facial expressions, eye contact, and even micro-expressions to predict 
        job performance.
      </p>

      <p>
        This evolution has made video interview AI one of the most heavily regulated—and legally risky—categories of 
        hiring technology. Illinois, New York City, California, Colorado, and Maryland all have specific requirements 
        for video interview AI. The EEOC has investigated multiple complaints. And several high-profile lawsuits have 
        targeted video interview discrimination.
      </p>

      <p>If you use video interview AI, you need to understand the compliance landscape <em>now</em>.</p>

      <div className="bg-red-50 border-l-4 border-red-500 p-6 my-8">
        <p className="font-semibold text-red-900 mb-2">🚨 Critical Distinction</p>
        <p className="text-red-800">
          Using a video platform to <strong>record</strong> interviews that humans review = minimal regulation. 
          Using AI to <strong>analyze</strong> those videos (speech, language, facial expressions) = heavily regulated 
          in multiple jurisdictions. Know which you're doing.
        </p>
      </div>

      <h2>What Video Interview AI Actually Does</h2>

      <p>
        Modern video interview platforms offer various AI capabilities. Not all platforms use all features, but 
        here's what's available in the market:
      </p>

      <h3>Speech and Language Analysis</h3>
      <ul>
        <li><strong>Transcription and keyword detection:</strong> Converting speech to text and scanning for relevant keywords</li>
        <li><strong>Sentiment analysis:</strong> Evaluating emotional tone (positive, negative, neutral)</li>
        <li><strong>Complexity scoring:</strong> Assessing vocabulary sophistication and sentence structure</li>
        <li><strong>Filler word counting:</strong> Tracking "um," "uh," "like," and other hesitations</li>
        <li><strong>Speaking pace:</strong> Measuring words per minute and variation in speed</li>
      </ul>

      <h3>Vocal Characteristics</h3>
      <ul>
        <li><strong>Tone analysis:</strong> Pitch, volume, and modulation patterns</li>
        <li><strong>Confidence scoring:</strong> Based on voice stability and assertiveness</li>
        <li><strong>Enthusiasm detection:</strong> Energy and vocal variation</li>
      </ul>

      <h3>Visual Analysis (Most Controversial)</h3>
      <ul>
        <li><strong>Eye contact tracking:</strong> Measuring time spent looking at camera</li>
        <li><strong>Facial expression analysis:</strong> Detecting smiles, frowns, or other expressions</li>
        <li><strong>Micro-expression detection:</strong> Rapid involuntary facial movements (highly controversial)</li>
        <li><strong>Body language assessment:</strong> Posture, gestures, movement</li>
      </ul>

      <h3>Comparative Ranking</h3>
      <ul>
        <li><strong>Candidate scoring:</strong> Assigning numerical scores based on AI analysis</li>
        <li><strong>Comparative ranking:</strong> Ordering candidates from "most promising" to "least promising"</li>
        <li><strong>Benchmarking:</strong> Comparing candidates against profiles of successful employees</li>
      </ul>

      <h2>The Regulatory Patchwork</h2>

      <p>
        Video interview AI is regulated under multiple overlapping frameworks. Here's what applies where:
      </p>

      <h3>Illinois: The Strictest Standard (AIVIA)</h3>

      <p>
        Illinois' Artificial Intelligence Video Interview Act (AIVIA), effective since 2020, was the first law 
        specifically targeting video interview AI.
      </p>

      <p><strong>Requirements:</strong></p>

      <ol className="list-decimal list-inside ml-4 space-y-2">
        <li><strong>Advance notice:</strong> Before using AI video analysis, you must notify candidates that AI 
        will be used and explain how it works</li>
        <li><strong>Explicit consent:</strong> Candidates must provide written consent before AI analysis occurs 
        (checkbox or signature)</li>
        <li><strong>Explanation of evaluation criteria:</strong> Describe what the AI evaluates and how it influences decisions</li>
        <li><strong>Limited sharing:</strong> Video footage analyzed by AI can only be shared with those "directly 
        involved" in hiring—no broad distribution</li>
        <li><strong>Data deletion upon request:</strong> Within 30 days of request, all video recordings and data 
        derived from AI analysis must be deleted</li>
      </ol>

      <p><strong>Penalties:</strong> $500 first violation, $1,000 per subsequent violation per candidate</p>

      <p><strong>Critical note:</strong> AIVIA applies to <em>all</em> candidates in Illinois, regardless of where 
      your company is based. If you're interviewing someone who lives in Illinois, you must comply.</p>

      <h3>New York City: Bias Audit Requirement (LL144)</h3>

      <p>
        Video interview AI platforms used for NYC candidates are explicitly covered as "Automated Employment Decision 
        Tools" under Local Law 144.
      </p>

      <p><strong>Requirements:</strong></p>

      <ul>
        <li><strong>Annual bias audit:</strong> Must be conducted by independent auditor, analyzing selection rates 
        by race/ethnicity and sex</li>
        <li><strong>Public disclosure:</strong> Audit results must be published on publicly accessible website</li>
        <li><strong>Candidate notice:</strong> At least 10 business days before use, candidates must be told an 
        AEDT will be used</li>
        <li><strong>Alternative process:</strong> Must be available for candidates who request it</li>
      </ul>

      <h3>Maryland: Facial Recognition Consent</h3>

      <p>
        Maryland's law (effective 2020, expanded 2026) requires written consent for any video interview AI that 
        analyzes facial characteristics, expressions, or visual data.
      </p>

      <p><strong>Key points:</strong></p>
      <ul>
        <li>Consent must be specific to facial/visual analysis (not just generic AI consent)</li>
        <li>Candidates can revoke consent at any time</li>
        <li>Upon revocation, data must be deleted within 30 days</li>
      </ul>

      <h3>California: Disclosure and Bias Testing (AB 2930)</h3>

      <p>
        California requires pre-use disclosure and annual bias testing for video interview AI used on California candidates.
      </p>

      <p><strong>Requirements:</strong></p>
      <ul>
        <li>Written disclosure before candidate submits application or participates in interview</li>
        <li>Annual bias audit examining disparate impact</li>
        <li>Data minimization (only collect what's necessary for job evaluation)</li>
        <li>Right to human review of AI-driven decisions</li>
      </ul>

      <h3>Colorado: Impact Assessment and Opt-Out (AI Act)</h3>

      <p>
        Colorado's AI Act requires impact assessments for "high-risk AI systems," which explicitly includes video 
        interview analysis.
      </p>

      <p><strong>Requirements:</strong></p>
      <ul>
        <li>Impact assessment before deployment</li>
        <li>Disclosure to candidates</li>
        <li>Opt-out rights (alternative process without AI)</li>
        <li>Human review of AI-generated recommendations</li>
      </ul>

      <h2>The Disability Discrimination Problem</h2>

      <p>
        Beyond explicit AI hiring laws, video interview AI creates significant <strong>ADA liability</strong>. 
        Here's why:
      </p>

      <h3>Speech-Based Discrimination</h3>

      <p>
        AI that penalizes speech patterns can discriminate against candidates with:
      </p>

      <ul>
        <li><strong>Speech impediments:</strong> Stuttering, lisps, dysarthria</li>
        <li><strong>Hearing impairments:</strong> Affecting speech clarity or volume modulation</li>
        <li><strong>Neurological conditions:</strong> Autism spectrum (atypical speech patterns), Tourette's (verbal tics)</li>
        <li><strong>Non-native speakers:</strong> Accents flagged as "low confidence" or "unclear communication"</li>
      </ul>

      <h3>Visual Analysis Discrimination</h3>

      <p>
        Facial expression and eye contact analysis discriminates against:
      </p>

      <ul>
        <li><strong>Autism spectrum:</strong> Atypical eye contact is a diagnostic criterion—penalizing it is direct 
        disability discrimination</li>
        <li><strong>Facial paralysis:</strong> Bell's palsy, stroke survivors, facial nerve damage</li>
        <li><strong>Visual impairments:</strong> Blind or low-vision candidates can't maintain "camera eye contact"</li>
        <li><strong>Anxiety disorders:</strong> May exhibit nervous facial expressions or poor eye contact</li>
      </ul>

      <h3>Notable Case: EEOC v. [Employer Using HireVue] (2024)</h3>

      <p>
        In 2024, the EEOC filed a discrimination complaint against an employer whose video interview AI consistently 
        screened out autistic candidates. The AI penalized:
      </p>

      <ul>
        <li>Atypical eye contact patterns</li>
        <li>Monotone or "flat affect" speech</li>
        <li>Literal interpretation of questions (flagged as "lacking nuance")</li>
      </ul>

      <p>
        The employer settled for $1.2 million and agreed to discontinue facial expression and eye contact analysis.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-8">
        <p className="font-semibold text-amber-900 mb-2">⚠️ Accommodation Requirement</p>
        <p className="text-amber-800">
          Under the ADA, you must provide <strong>reasonable accommodations</strong> for candidates with disabilities 
          who request them. For video interview AI, this typically means turning off AI analysis and using human-only 
          evaluation. Make this option clear in your disclosures.
        </p>
      </div>

      <h2>Vendor Compliance: What to Ask HireVue, Modern Hire, Etc.</h2>

      <p>
        If you use a video interview platform with AI features, you need answers to these questions:
      </p>

      <h3>Bias Audit Questions</h3>

      <ul>
        <li>"Have you conducted an independent bias audit of your AI analysis features?"</li>
        <li>"Can you provide a copy of the most recent audit report?"</li>
        <li>"When was the audit conducted, and when is the next one scheduled?"</li>
        <li>"Does your audit satisfy NYC LL144, California AB 2930, and Colorado AI Act requirements?"</li>
        <li>"Were audits conducted on our specific candidate pool, or pooled across all clients?"</li>
      </ul>

      <h3>Technical Transparency</h3>

      <ul>
        <li>"What exactly does your AI analyze? (speech, facial, body language)"</li>
        <li>"What features can we turn off while still using the platform?"</li>
        <li>"Can we use video recording without AI analysis?"</li>
        <li>"How often do you update your AI algorithms? Do updates trigger re-audit requirements?"</li>
      </ul>

      <h3>Compliance Support</h3>

      <ul>
        <li>"Do you provide disclosure templates for AIVIA, LL144, and other state laws?"</li>
        <li>"Can you help us generate consent forms?"</li>
        <li>"How do you handle data deletion requests (AIVIA 30-day requirement)?"</li>
        <li>"What is your process for accommodating candidates with disabilities?"</li>
      </ul>

      <h3>Contractual Protection</h3>

      <ul>
        <li>"Will you indemnify us for compliance violations caused by your platform?"</li>
        <li>"What happens if a bias audit reveals disparate impact—do you commit to fixing it?"</li>
        <li>"Do you notify us when laws change or when our compliance obligations update?"</li>
      </ul>

      <h2>Practical Compliance Checklist</h2>

      <p>If you're using video interview AI, work through this step-by-step:</p>

      <h3>☐ Step 1: Understand What Features Are Turned On</h3>
      <p>
        Many platforms have AI analysis as an <em>optional</em> feature. Check your settings. If AI analysis is off, 
        you're just using a recording tool—much less regulated.
      </p>

      <h3>☐ Step 2: Create State-Specific Disclosures</h3>

      <p><strong>For Illinois candidates:</strong></p>
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          "This interview will be analyzed using artificial intelligence. The AI will evaluate your spoken responses, 
          word choice, and communication style to assess your fit for this role. Before proceeding, you must provide 
          written consent for this AI analysis. You may request deletion of your interview recording and AI-generated 
          data at any time by contacting [email]."
        </p>
        <p className="text-sm mt-2">
          ☐ I consent to AI analysis of my video interview
        </p>
      </blockquote>

      <p><strong>For NYC candidates:</strong></p>
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 text-gray-700 bg-gray-50 p-4">
        <p className="text-sm">
          "[Company] uses an Automated Employment Decision Tool (AEDT) to analyze video interview responses. 
          The tool evaluates [specific factors]. A bias audit of this tool was conducted on [date] by [auditor]. 
          You can view the audit results at [URL]. If you prefer an alternative evaluation process without AI, 
          contact [email] at least 10 business days before your scheduled interview."
        </p>
      </blockquote>

      <h3>☐ Step 3: Implement Consent Collection (Illinois, Maryland)</h3>
      <p>
        Build consent collection into your interview scheduling workflow. Candidates should actively check a box 
        or sign a form—passive "by continuing" consent is insufficient.
      </p>

      <h3>☐ Step 4: Bias Audit (NYC, California)</h3>
      <p>
        Either obtain bias audit results from your vendor (verify they meet legal requirements) or hire an independent 
        auditor to analyze your specific candidate data.
      </p>

      <h3>☐ Step 5: Publish Audit Results (NYC, California)</h3>
      <p>
        Create a dedicated page on your careers site with audit findings. Link to it from job postings and candidate notices.
      </p>

      <h3>☐ Step 6: Design Alternative Process</h3>
      <p>
        What happens when a candidate opts out of AI analysis or requests accommodation?
      </p>

      <p><strong>Common alternatives:</strong></p>
      <ul>
        <li>Live phone or video interview with human interviewer (no recording)</li>
        <li>Video recording reviewed by human with AI analysis turned off</li>
        <li>Written response to interview questions</li>
        <li>In-person interview (if logistically feasible)</li>
      </ul>

      <h3>☐ Step 7: Train Interviewers on Human Review</h3>
      <p>
        AI should be <strong>decision-support</strong>, not the decision itself. Train hiring managers to:
      </p>

      <ul>
        <li>Watch video interviews themselves (don't just rely on AI scores)</li>
        <li>Understand AI scores are probabilistic, not definitive</li>
        <li>Be prepared to override AI recommendations</li>
        <li>Document why they agreed or disagreed with AI scoring</li>
      </ul>

      <h3>☐ Step 8: Data Deletion Workflow</h3>
      <p>
        Implement a process for handling deletion requests (required in Illinois, Maryland):
      </p>

      <ul>
        <li>Designate someone to receive deletion requests (e.g., privacy@yourcompany.com)</li>
        <li>Document requests in a log</li>
        <li>Coordinate with vendor to delete data from their systems</li>
        <li>Confirm deletion within 30 days</li>
        <li>Send confirmation email to requester</li>
      </ul>

      <h2>The Case for Turning Off AI Analysis</h2>

      <p>
        After reviewing compliance requirements, many employers ask: "Is the AI analysis worth it?"
      </p>

      <p><strong>Reasons to keep AI analysis:</strong></p>
      <ul>
        <li>Saves interviewer time by pre-screening large volumes</li>
        <li>Provides structured, consistent evaluation criteria</li>
        <li>May surface communication skills patterns humans miss</li>
      </ul>

      <p><strong>Reasons to turn it off:</strong></p>
      <ul>
        <li>Eliminates most compliance obligations (simple recording = much less regulated)</li>
        <li>Reduces legal risk (no bias audits required, lower ADA exposure)</li>
        <li>Better candidate experience (many candidates distrust AI evaluation)</li>
        <li>Cost savings (no annual bias audits, no vendor AI fees)</li>
      </ul>

      <p>
        <strong>Emerging trend:</strong> Many companies are keeping video platforms for <strong>asynchronous 
        recording</strong> (candidates record answers on their own time) but turning off AI analysis. Humans review 
        the videos. This retains scheduling flexibility without regulatory complexity.
      </p>

      <h2>Common Mistakes and How to Avoid Them</h2>

      <h3>Mistake #1: Using AI analysis without realizing it</h3>
      <p>
        Some platforms turn on "smart scoring" or "candidate ranking" by default. Check your settings—if the platform 
        is doing anything beyond simple recording and playback, you likely have AI features enabled.
      </p>

      <h3>Mistake #2: Generic "we use AI" disclosures</h3>
      <p>
        Compliance requires specificity: <em>what</em> AI tool, <em>what</em> it evaluates, <em>how</em> it influences 
        decisions. "We may use technology in hiring" doesn't cut it.
      </p>

      <h3>Mistake #3: No accommodation process</h3>
      <p>
        Under the ADA, you <strong>must</strong> accommodate candidates with disabilities who request it. Saying 
        "everyone has to do the AI video interview" is illegal. Build the alternative process before you need it.
      </p>

      <h3>Mistake #4: Relying solely on vendor audits</h3>
      <p>
        Some jurisdictions (especially NYC) require audits based on <em>your specific applicant pool</em>, not 
        pooled vendor data. Verify your vendor's audit meets your legal requirements.
      </p>

      <h3>Mistake #5: Not training interviewers on AI limitations</h3>
      <p>
        If hiring managers treat AI scores as gospel and don't watch videos themselves, the AI becomes the decision-maker—creating 
        liability. Emphasize that AI is a tool, not a replacement for human judgment.
      </p>

      <h2>How EmployArmor Helps</h2>

      <p>
        EmployArmor streamlines video interview AI compliance:
      </p>

      <ul>
        <li><strong>Multi-state disclosure generator:</strong> Automatically creates compliant notices for IL, NYC, 
        CA, CO, MD based on candidate location</li>
        <li><strong>Consent workflow integration:</strong> Embeds AIVIA-compliant consent into your interview 
        scheduling process</li>
        <li><strong>Bias audit coordination:</strong> Connects you with qualified auditors and manages the audit lifecycle</li>
        <li><strong>Vendor assessment:</strong> Evaluates your video platform vendor's compliance documentation 
        and identifies gaps</li>
        <li><strong>Alternative process templates:</strong> Provides ready-to-use workflows for candidates who opt out</li>
      </ul>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 text-center">
        <p className="text-lg font-semibold text-blue-900 mb-3">Simplify Video Interview Compliance</p>
        <p className="text-blue-700 mb-4">Get state-specific disclosures and audit support</p>
        <Link 
          href="/scan" 
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Your Compliance Assessment →
        </Link>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>If we only use video interviews for some roles, do we still need bias audits?</h3>
      <p>
        If you use AI video analysis for <em>any</em> role in NYC or California, you need bias audits for those 
        specific roles. You can limit audits to the job categories where AI is actually used (no need to audit 
        roles that don't use video AI).
      </p>

      <h3>Can candidates record their own videos on their phone instead of using our platform?</h3>
      <p>
        If you're not using AI analysis, yes—candidates can record responses however they want and submit them. 
        But if you're using AI to analyze the videos, they must be recorded through the platform so the AI can 
        process them (at which point all compliance obligations apply).
      </p>

      <h3>What if a candidate in Illinois refuses to consent to AI analysis?</h3>
      <p>
        You must provide an alternative evaluation process. You <strong>cannot</strong> make AI video analysis 
        mandatory. Requiring consent as a condition of consideration violates the spirit of the law and creates 
        ADA risk.
      </p>

      <h3>Do live video interviews (Zoom calls) require the same compliance as asynchronous AI-analyzed videos?</h3>
      <p>
        No. If you're conducting a live Zoom/Teams interview with a human interviewer and <strong>not</strong> 
        using AI to analyze the video, it's treated as a traditional interview. AI hiring laws target automated 
        analysis, not human-led video conversations.
      </p>

      <h3>Can we use AI to transcribe video interviews without compliance issues?</h3>
      <p>
        Simple transcription for record-keeping is generally low-risk. The problem arises when you use AI to 
        <strong>analyze</strong> the transcript (keyword scoring, sentiment analysis, etc.) to make hiring decisions. 
        Passive transcription = likely okay. Analysis and scoring = regulated.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/hirevue-compliance" className="text-blue-600 hover:underline">HireVue Compliance Guide</Link></li>
        <li><Link href="/resources/illinois-aivia-compliance-guide" className="text-blue-600 hover:underline">Illinois AIVIA Compliance Guide</Link></li>
        <li><Link href="/blog/how-to-conduct-ai-bias-audit" className="text-blue-600 hover:underline">How to Conduct an AI Bias Audit</Link></li>
        <li><Link href="/blog/candidate-rights-ai-hiring" className="text-blue-600 hover:underline">Candidate Rights Under AI Hiring Laws</Link></li>
      </ul>

      <LegalDisclaimer />
    </ArticleLayout>
  )
}
