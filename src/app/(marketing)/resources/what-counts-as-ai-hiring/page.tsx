import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function WhatCountsAsAIPage() {
  return (
    <ArticleLayout
      title="What Counts as AI in Hiring? A Complete Guide"
      description="LinkedIn Recruiter, Indeed assessments, HireVue — do they trigger compliance requirements? Here's how to know if your tools are covered."
      category="Guide"
      readTime="8 min read"
      publishedDate="January 10, 2026"
    >
      <p>
        One of the most common questions we hear is: "Do I even use AI in hiring?" The answer might 
        surprise you. Many everyday recruiting tools that don't explicitly market themselves as "AI" 
        still qualify under new regulations.
      </p>

      <h2>The Legal Definition</h2>
      <p>
        Most AI hiring laws define covered technologies broadly. Generally, you're looking at any 
        <strong> machine-based system</strong> that:
      </p>
      <ul>
        <li>Makes predictions, recommendations, or decisions</li>
        <li>Uses computation to process data</li>
        <li>Influences employment decisions (hiring, firing, promotion, etc.)</li>
      </ul>
      <p>
        This includes traditional machine learning, statistical algorithms, and even rule-based 
        systems that automate decision-making.
      </p>

      <h2>Common Tools That Trigger Compliance</h2>
      
      <h3>✅ Almost Certainly Covered</h3>
      <table className="w-full my-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3">Tool Type</th>
            <th className="text-left p-3">Examples</th>
            <th className="text-left p-3">Why It's Covered</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3 font-medium">Video Interview Platforms</td>
            <td className="p-3">HireVue, Spark Hire, myInterview</td>
            <td className="p-3">Analyzes facial expressions, tone, word choice</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 font-medium">AI Resume Screeners</td>
            <td className="p-3">Ideal, Pymetrics, Eightfold</td>
            <td className="p-3">Automatically filters/ranks candidates</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 font-medium">Skills Assessments</td>
            <td className="p-3">Codility, HackerRank, Criteria</td>
            <td className="p-3">AI-scored evaluations that influence decisions</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 font-medium">Chatbots & Virtual Assistants</td>
            <td className="p-3">Olivia (Paradox), Mya, XOR</td>
            <td className="p-3">Screens candidates through conversation</td>
          </tr>
        </tbody>
      </table>

      <h3>⚠️ Likely Covered (Check Your Configuration)</h3>
      <table className="w-full my-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3">Tool Type</th>
            <th className="text-left p-3">Examples</th>
            <th className="text-left p-3">When It's Covered</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-3 font-medium">LinkedIn Recruiter</td>
            <td className="p-3">LinkedIn Recruiter, Sales Navigator</td>
            <td className="p-3">Uses AI for candidate matching and recommendations</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 font-medium">Indeed</td>
            <td className="p-3">Indeed Hiring Platform, Assessments</td>
            <td className="p-3">Smart matching, AI assessments, screening questions</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 font-medium">ATS with AI Features</td>
            <td className="p-3">Greenhouse, Lever, Workday</td>
            <td className="p-3">If using AI-powered matching, scoring, or ranking</td>
          </tr>
          <tr className="border-b">
            <td className="p-3 font-medium">Background Check Services</td>
            <td className="p-3">Checkr, Sterling, HireRight</td>
            <td className="p-3">If using automated adjudication/decision features</td>
          </tr>
        </tbody>
      </table>

      <h3>❌ Generally Not Covered</h3>
      <ul>
        <li><strong>Basic job boards</strong> — Just posting jobs without AI matching</li>
        <li><strong>Calendar scheduling</strong> — Tools like Calendly for interview scheduling</li>
        <li><strong>Video conferencing</strong> — Zoom, Teams for live interviews (no analysis)</li>
        <li><strong>Manual ATS features</strong> — Storing resumes without automated screening</li>
        <li><strong>Reference check calls</strong> — Human-conducted reference checks</li>
      </ul>

      <h2>The "LinkedIn Question"</h2>
      <p>
        We get asked about LinkedIn more than any other tool. Here's the breakdown:
      </p>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">LinkedIn Recruiter</p>
        <p className="text-blue-700">
          <strong>Yes, likely covered.</strong> LinkedIn uses AI to recommend candidates, surface 
          "best matches," and predict candidate interest. If you're using these features to decide 
          who to contact or consider, disclosure is probably required.
        </p>
      </div>

      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-6">
        <p className="font-semibold text-gray-800">LinkedIn Basic</p>
        <p className="text-gray-700">
          <strong>Likely not covered.</strong> If you're just searching for profiles manually and 
          reviewing them yourself, there's no AI making or assisting decisions.
        </p>
      </div>

      <h2>How to Audit Your Stack</h2>
      
      <h3>Step 1: List Every Tool</h3>
      <p>
        Create a spreadsheet with every piece of software used in your hiring process, from sourcing 
        to offer letter.
      </p>

      <h3>Step 2: Ask Key Questions</h3>
      <p>For each tool, ask:</p>
      <ol>
        <li>Does it score, rank, or filter candidates automatically?</li>
        <li>Does it analyze video, audio, or text to assess candidates?</li>
        <li>Does it provide recommendations about who to hire?</li>
        <li>Does the vendor describe it as using AI, ML, or algorithms?</li>
      </ol>
      <p>If you answer "yes" to any of these, the tool is likely covered.</p>

      <h3>Step 3: Check Vendor Documentation</h3>
      <p>
        Review your vendors' websites, documentation, and privacy policies. Look for terms like:
      </p>
      <ul>
        <li>Artificial intelligence, AI, machine learning, ML</li>
        <li>Algorithm, automated decision-making</li>
        <li>Predictive analytics, matching technology</li>
        <li>Natural language processing, NLP</li>
        <li>Computer vision, facial analysis</li>
      </ul>

      <h3>Step 4: Ask Your Vendors Directly</h3>
      <p>
        Send a simple email: "Does [Product Name] use artificial intelligence, machine learning, or 
        automated decision-making in any features we use? If so, please describe how."
      </p>

      <h2>Decision Framework</h2>
      <p>
        When in doubt, use this simple test:
      </p>
      <div className="bg-orange-50 border rounded-lg p-6 my-6">
        <p className="font-semibold text-orange-800 mb-4">The Replacement Test</p>
        <p className="text-orange-700">
          "If a human had to do what this software does, would that require judgment, analysis, 
          or decision-making?"
        </p>
        <p className="text-orange-700 mt-2">
          If yes → probably covered by AI hiring laws.<br />
          If no (purely administrative) → probably not covered.
        </p>
      </div>

      <h2>What To Do If You're Covered</h2>
      <p>
        If your tools qualify as AI under these laws, you'll generally need to:
      </p>
      <ol>
        <li><strong>Notify candidates</strong> before or when AI is used</li>
        <li><strong>Explain what the AI does</strong> and what data it uses</li>
        <li><strong>Monitor for bias</strong> in AI-driven outcomes</li>
        <li><strong>Document your compliance</strong> efforts</li>
      </ol>
      <p>
        The specifics vary by state. Check our guides for{" "}
        <Link href="/resources/illinois-ai-hiring-law" className="text-blue-600 hover:underline">Illinois</Link>,{" "}
        <Link href="/resources/colorado-ai-act-employers" className="text-blue-600 hover:underline">Colorado</Link>,{" "}
        <Link href="/resources/california-ccpa-admt" className="text-blue-600 hover:underline">California</Link>, and{" "}
        <Link href="/compliance/nyc" className="text-blue-600 hover:underline">NYC</Link>.
      </p>

      <h2>Need Help?</h2>
      <p>
        Not sure if your tools are covered? Our free{" "}
        <Link href="/scorecard" className="text-blue-600 hover:underline">Compliance Scorecard</Link>{" "}
        walks you through the key questions and gives you a personalized assessment in under 2 minutes.
      </p>
    </ArticleLayout>
  )
}
