import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots')
const BASE_URL = 'https://employarmor.vercel.app'

const personas = [
  {
    name: 'TechCorp Solutions',
    industry: 'technology',
    employeeTier: '201-500',
    states: ['CA', 'IL', 'NY', 'TX'],
    tools: ['hirevue', 'eightfold', 'greenhouse', 'chatgpt'],
    usages: ['screening', 'ranking', 'interview-analysis', 'assessment-scoring'],
  },
  {
    name: 'Midwest Manufacturing',
    industry: 'manufacturing',
    employeeTier: '51-200',
    states: ['OH', 'MI', 'IN', 'IL'],
    tools: ['indeed', 'bamboohr', 'checkr'],
    usages: ['screening', 'background-check', 'matching'],
  },
  {
    name: 'National Retail Chain',
    industry: 'retail',
    employeeTier: '1000+',
    states: ['CA', 'NY', 'NYC', 'TX', 'FL', 'IL', 'CO', 'PA', 'OH', 'GA'],
    tools: ['pymetrics', 'hirevue', 'checkr', 'workday', 'paradox-olivia'],
    usages: ['screening', 'ranking', 'interview-analysis', 'assessment-scoring', 'video-recording', 'chatbot-screening', 'third-party-reports'],
  },
  {
    name: 'Denver Law Firm',
    industry: 'professional-services',
    employeeTier: '1-50',
    states: ['CO', 'CA'],
    tools: ['linkedin-recruiter', 'chatgpt'],
    usages: ['screening', 'job-description'],
  },
  {
    name: 'Healthcare Staffing Inc',
    industry: 'healthcare',
    employeeTier: '501-1000',
    states: ['FL', 'TX', 'CA', 'NY', 'PA'],
    tools: ['spark-hire', 'checkr', 'hireright', 'lever'],
    usages: ['screening', 'ranking', 'video-recording', 'background-check', 'third-party-reports'],
  },
]

const stateNames: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NYC: 'New York City', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  DC: 'Washington D.C.', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

const toolNames: Record<string, string> = {
  'linkedin-recruiter': 'LinkedIn Recruiter', 'hirevue': 'HireVue', 'pymetrics': 'Pymetrics',
  'eightfold': 'Eightfold AI', 'greenhouse': 'Greenhouse', 'lever': 'Lever',
  'workday': 'Workday Recruiting', 'textio': 'Textio', 'paradox-olivia': 'Paradox (Olivia)',
  'spark-hire': 'Spark Hire', 'criteria': 'Criteria Corp', 'indeed': 'Indeed',
  'ziprecruiter': 'ZipRecruiter', 'glassdoor': 'Glassdoor', 'handshake': 'Handshake',
  'dice': 'Dice', 'rippling': 'Rippling', 'adp': 'ADP', 'gusto': 'Gusto',
  'trinet': 'TriNet', 'paylocity': 'Paylocity', 'bamboohr': 'BambooHR',
  'paychex': 'Paychex', 'slack': 'Slack', 'microsoft-teams': 'Microsoft Teams',
  'zoom': 'Zoom', 'google-meet': 'Google Meet', 'checkr': 'Checkr',
  'hireright': 'HireRight', 'sterling': 'Sterling', 'goodhire': 'GoodHire',
  'chatgpt': 'ChatGPT', 'claude': 'Claude', 'copilot': 'Microsoft Copilot',
  'gemini': 'Gemini', 'pave': 'Pave', 'salary-com': 'Salary.com',
  'payscale': 'PayScale', 'hubstaff': 'Hubstaff', 'time-doctor': 'Time Doctor',
  'activtrak': 'ActivTrak',
}

const usageLabels: Record<string, string> = {
  'screening': 'Resume/Application Screening',
  'ranking': 'Candidate Ranking/Scoring',
  'matching': 'Job Matching',
  'interview-analysis': 'Interview Analysis',
  'assessment-scoring': 'Assessment Scoring',
  'chatbot-screening': 'Chatbot Screening',
  'scheduling': 'Interview Scheduling',
  'job-description': 'Job Description Writing',
  'background-check': 'Background Check Review',
  'compensation': 'Compensation Decisions',
  'promotion': 'Promotion Decisions',
  'termination': 'Termination Decisions',
  'video-recording': 'Video Interview Recording',
  'facial-analysis': 'Facial/Emotion Analysis',
  'voice-analysis': 'Voice/Speech Analysis',
  'integrity-scoring': 'Integrity/Honesty Scoring',
  'salary-filtering': 'Salary-Based Filtering',
  'third-party-reports': 'Third-Party Screening Reports',
}

const tierLabels: Record<string, string> = {
  '1-50': '1-50 employees',
  '51-200': '51-200 employees',
  '201-500': '201-500 employees',
  '501-1000': '501-1,000 employees',
  '1000+': '1,000+ employees',
}

// Pick a random persona
const persona = personas[Math.floor(Math.random() * personas.length)]

test('Complete full E2E flow: quiz → results → training → compliance', async ({ page }) => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })

  const ts = Date.now()
  let stepNum = 0

  const screenshot = async (label: string) => {
    stepNum++
    const filename = `${String(stepNum).padStart(2, '0')}-${label}.png`
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: true })
    console.log(`📸 Screenshot ${stepNum}: ${filename}`)
  }

  console.log('=== PERSONA ===')
  console.log(JSON.stringify(persona, null, 2))

  // ================================================================
  // PHASE 1: QUIZ FLOW
  // ================================================================
  console.log('\n=== PHASE 1: QUIZ FLOW ===')

  await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await screenshot('quiz-landing')

  // Step 1: Select states
  console.log('Selecting states:', persona.states)
  for (const stateCode of persona.states) {
    const name = stateNames[stateCode]
    if (name) {
      const btn = page.locator('button', { hasText: new RegExp(`^.*${name}$`) }).first()
      await btn.click()
      await page.waitForTimeout(150)
    }
  }
  await screenshot('states-selected')

  await page.locator('button:has-text("Continue")').click()
  await page.waitForTimeout(1000)
  await screenshot('tools-page')

  // Step 2: Select tools - expand all categories first
  console.log('Selecting tools:', persona.tools)
  // Expand all collapsed categories
  let collapsed = page.locator('button:has(svg.lucide-chevron-down)')
  let count = await collapsed.count()
  for (let i = 0; i < count; i++) {
    await collapsed.nth(i).click()
    await page.waitForTimeout(150)
  }

  for (const toolId of persona.tools) {
    const name = toolNames[toolId]
    if (name) {
      // Re-expand if any collapsed after clicking
      collapsed = page.locator('button:has(svg.lucide-chevron-down)')
      count = await collapsed.count()
      for (let i = 0; i < count; i++) {
        await collapsed.nth(i).click()
        await page.waitForTimeout(100)
      }
      
      const toolBtn = page.locator('button', { hasText: name }).first()
      try {
        await toolBtn.scrollIntoViewIfNeeded()
        await toolBtn.click()
        await page.waitForTimeout(150)
      } catch (e) {
        console.log(`⚠️ Could not click tool: ${name}`)
      }
    }
  }
  await screenshot('tools-selected')

  await page.locator('button:has-text("Continue")').click()
  await page.waitForTimeout(1000)
  await screenshot('usage-page')

  // Step 3: Select usages
  console.log('Selecting usages:', persona.usages)
  for (const usageId of persona.usages) {
    const label = usageLabels[usageId]
    if (label) {
      const btn = page.locator('button', { hasText: label }).first()
      try {
        await btn.scrollIntoViewIfNeeded()
        await btn.click()
        await page.waitForTimeout(150)
      } catch (e) {
        console.log(`⚠️ Could not click usage: ${label}`)
      }
    }
  }
  await screenshot('usages-selected')

  await page.locator('button:has-text("Continue")').click()
  await page.waitForTimeout(1000)
  await screenshot('employees-page')

  // Step 4: Select employee count
  console.log('Selecting employee tier:', persona.employeeTier)
  const tierLabel = tierLabels[persona.employeeTier]
  if (tierLabel) {
    await page.locator('button', { hasText: tierLabel }).click()
    await page.waitForTimeout(300)
  }
  await screenshot('employees-selected')

  await page.locator('button:has-text("Continue")').click()
  await page.waitForTimeout(1000)
  await screenshot('email-page')

  // Step 5: Fill email form
  const email = `test-${ts}@employarmor.com`
  console.log('Filling email:', email, 'Company:', persona.name)
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="organization"]').fill(persona.name)
  if (persona.industry) {
    await page.locator('select').selectOption(persona.industry)
  }
  await screenshot('email-filled')

  // Submit
  await page.locator('button:has-text("See My Compliance Plan")').click()
  await page.waitForURL('**/results', { timeout: 15000 })
  await page.waitForTimeout(2000)
  await screenshot('results-page-top')

  // Scroll down to capture full results
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3))
  await page.waitForTimeout(500)
  await screenshot('results-tool-analysis')

  await page.evaluate(() => window.scrollTo(0, (document.body.scrollHeight * 2) / 3))
  await page.waitForTimeout(500)
  await screenshot('results-compliance-tasks')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  await screenshot('results-page-bottom')

  // Capture results summary text
  const resultsText = await page.locator('body').innerText()
  console.log('\n=== RESULTS SUMMARY (first 3000 chars) ===')
  console.log(resultsText.substring(0, 3000))

  // ================================================================
  // PHASE 2: TRAINING PAGES
  // ================================================================
  console.log('\n=== PHASE 2: TRAINING PAGES ===')

  // Try navigating to training - may redirect to login (auth-gated)
  await page.goto(`${BASE_URL}/training`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(2000)
  await screenshot('training-page')
  const trainingUrl = page.url()
  console.log('Training page URL:', trainingUrl)

  // If we hit login, screenshot that too
  if (trainingUrl.includes('login')) {
    console.log('Training requires auth — documenting login page')
    await screenshot('training-login-redirect')
  } else {
    // We're on the training page - screenshot it
    // Try clicking "Just me" path if visible
    const justMeCard = page.locator('text=Just me')
    if (await justMeCard.isVisible().catch(() => false)) {
      await justMeCard.click()
      await page.waitForTimeout(500)
      await screenshot('training-path-selected')

      // Try starting solo training
      const startBtn = page.locator('button:has-text("Start My Training Now")')
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click()
        await page.waitForTimeout(2000)
        await screenshot('training-started')
      }
    }

    // Navigate to training section directly
    await page.goto(`${BASE_URL}/training/admin/1`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(2000)
    await screenshot('training-section-1')

    // Check if content loaded
    const contentToggle = page.locator('text=Read text version')
    if (await contentToggle.isVisible().catch(() => false)) {
      await contentToggle.click()
      await page.waitForTimeout(500)
      await screenshot('training-section-1-content')

      // Mark video complete to get to quiz
      const markCompleteBtn = page.locator('button:has-text("Mark as Complete")')
      if (await markCompleteBtn.isVisible().catch(() => false)) {
        await markCompleteBtn.click()
        await page.waitForTimeout(1000)
        await screenshot('training-section-1-quiz')

        // Answer quiz questions - select first option for each, screenshot each
        const radioButtons = page.locator('input[type="radio"]')
        const radioCount = await radioButtons.count()
        if (radioCount > 0) {
          // For each question, pick the correct answers from training data
          // Section 1 correct answers: 1, 2, 2 (0-indexed)
          const quizOptions = page.locator('[role="radiogroup"], .space-y-6 > div, form > div > div')
          
          // Just click options and screenshot
          for (let q = 0; q < Math.min(radioCount, 12); q += 4) {
            // Click an option for each question group
            await radioButtons.nth(q + 1).click().catch(() => {})
            await page.waitForTimeout(200)
          }
          await screenshot('training-quiz-answers')
        }

        // Try submitting quiz
        const submitBtn = page.locator('button:has-text("Submit")')
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click()
          await page.waitForTimeout(1000)
          await screenshot('training-quiz-results')
        }
      }
    }

    // Navigate through remaining training sections
    for (let sectionNum = 2; sectionNum <= 5; sectionNum++) {
      await page.goto(`${BASE_URL}/training/admin/${sectionNum}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(1500)
      
      const currentUrl = page.url()
      if (currentUrl.includes('login') || currentUrl.includes('training') === false) break
      
      await screenshot(`training-section-${sectionNum}`)
      
      // Expand text content
      const textToggle = page.locator('text=Read text version')
      if (await textToggle.isVisible().catch(() => false)) {
        await textToggle.click()
        await page.waitForTimeout(500)
        await screenshot(`training-section-${sectionNum}-content`)
      }

      // Try completing section
      const markBtn = page.locator('button:has-text("Mark as Complete")')
      if (await markBtn.isVisible().catch(() => false)) {
        await markBtn.click()
        await page.waitForTimeout(1000)
        await screenshot(`training-section-${sectionNum}-quiz`)
        
        // Submit quiz with random answers
        const submitBtn2 = page.locator('button:has-text("Submit")')
        if (await submitBtn2.isVisible().catch(() => false)) {
          // Click some radio buttons first
          const radios = page.locator('input[type="radio"]')
          const rCount = await radios.count()
          for (let r = 0; r < rCount; r += 4) {
            await radios.nth(r + 1).click().catch(() => {})
          }
          await submitBtn2.click()
          await page.waitForTimeout(1000)
          await screenshot(`training-section-${sectionNum}-quiz-results`)
        }
      }
    }

    // Tool-specific training pages
    console.log('\n=== TOOL-SPECIFIC TRAINING ===')
    const toolSlugs = persona.tools.map(t => t) // tool IDs are the slugs
    for (const slug of toolSlugs) {
      await page.goto(`${BASE_URL}/training/tool/${slug}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(1500)
      
      const tUrl = page.url()
      if (tUrl.includes('login')) break
      
      await screenshot(`training-tool-${slug}`)
      
      // Expand content sections
      const details = page.locator('details summary, button:has-text("Read"), [data-state="closed"]')
      const dCount = await details.count()
      for (let d = 0; d < Math.min(dCount, 3); d++) {
        await details.nth(d).click().catch(() => {})
        await page.waitForTimeout(300)
      }
      if (dCount > 0) {
        await screenshot(`training-tool-${slug}-expanded`)
      }
    }
  }

  // ================================================================
  // PHASE 3: COMPLIANCE / STATE PAGES
  // ================================================================
  console.log('\n=== PHASE 3: COMPLIANCE & STATE PAGES ===')

  // Dashboard (may need auth)
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(2000)
  await screenshot('dashboard')

  // State-specific compliance pages (in (app) group — auth-gated)
  const regulatedStates = persona.states.filter(s => ['IL', 'CO', 'CA', 'NYC', 'MD', 'NY'].includes(s))
  for (const stateCode of regulatedStates) {
    // Try the app state page
    await page.goto(`${BASE_URL}/state/${stateCode}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(1500)
    
    const sUrl = page.url()
    if (sUrl.includes('login')) {
      await screenshot(`state-${stateCode}-login-required`)
      break // All app pages will require login
    }
    
    await screenshot(`state-${stateCode}-overview`)
    
    // Scroll to see all requirements
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    await screenshot(`state-${stateCode}-requirements`)
  }

  // Marketing compliance pages (public, no auth needed!)
  console.log('\n=== PUBLIC COMPLIANCE PAGES (no auth) ===')
  
  // State compliance marketing pages
  const stateSlugMap: Record<string, string> = {
    'IL': 'illinois', 'CO': 'colorado', 'CA': 'california',
    'NYC': 'nyc', 'MD': 'maryland', 'NY': 'new-york',
  }
  
  for (const stateCode of regulatedStates) {
    const slug = stateSlugMap[stateCode]
    if (!slug) continue
    
    await page.goto(`${BASE_URL}/compliance/${slug}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(1500)
    await screenshot(`compliance-${stateCode}-public`)
    
    // Scroll to capture full page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(500)
    await screenshot(`compliance-${stateCode}-public-mid`)
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    await screenshot(`compliance-${stateCode}-public-bottom`)
  }

  // Tool-specific compliance pages (public)
  for (const toolId of persona.tools) {
    await page.goto(`${BASE_URL}/compliance/${toolId}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    await page.waitForTimeout(1500)
    
    const tUrl = page.url()
    if (tUrl.includes('404') || tUrl === `${BASE_URL}/`) continue
    
    await screenshot(`compliance-tool-${toolId}`)
    
    // Scroll for full content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    await screenshot(`compliance-tool-${toolId}-bottom`)
  }

  // Tool + State specific pages
  for (const toolId of persona.tools.slice(0, 2)) { // First 2 tools to avoid too many screenshots
    for (const stateCode of regulatedStates.slice(0, 2)) {
      const slug = stateSlugMap[stateCode]
      if (!slug) continue
      
      await page.goto(`${BASE_URL}/compliance/${toolId}/${slug}`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(1500)
      
      const url = page.url()
      if (url.includes('404') || url === `${BASE_URL}/`) continue
      
      await screenshot(`compliance-${toolId}-${stateCode}`)
      
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(500)
      await screenshot(`compliance-${toolId}-${stateCode}-bottom`)
    }
  }

  // Impact assessment page (may need auth)
  await page.goto(`${BASE_URL}/documents/impact-assessment`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await screenshot('impact-assessment-page')

  // Disclosures page
  await page.goto(`${BASE_URL}/disclosures`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await screenshot('disclosures-page')

  // Consent page
  await page.goto(`${BASE_URL}/consent`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await screenshot('consent-page')

  // States overview
  await page.goto(`${BASE_URL}/states`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await screenshot('states-overview')

  // Resources/guides (public)
  console.log('\n=== PUBLIC RESOURCES ===')
  await page.goto(`${BASE_URL}/resources/compliance-checklist-2026`, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await screenshot('compliance-checklist-2026')

  console.log(`\n✅ Full E2E flow complete! ${stepNum} screenshots captured.`)
  console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`)
})
