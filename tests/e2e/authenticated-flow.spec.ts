import { test, expect } from '@playwright/test'
import path from 'path'

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'auth')
const BASE_URL = 'https://employarmor.vercel.app'

const quizData = {
  states: ['IL', 'CA', 'CO'],
  tools: ['hirevue', 'workday', 'chatgpt'],
  usages: ['video-recording', 'facial-analysis', 'screening'],
  employeeCount: '201-500',
  riskScore: 82,
  email: 'test-e2e@employarmor.com',
  company: 'E2E Test Corp',
}

const ROUTES = [
  { name: '02-dashboard', path: '/dashboard' },
  { name: '03-training', path: '/training' },
  { name: '04-compliance-packet', path: '/compliance-packet' },
  { name: '05-documents', path: '/documents' },
  { name: '06-impact-assessment', path: '/documents/impact-assessment' },
  { name: '07-compliance-documents', path: '/compliance/documents' },
  { name: '08-disclosures', path: '/disclosures' },
  { name: '09-consent', path: '/consent' },
  { name: '10-approvals', path: '/approvals' },
  { name: '11-audit', path: '/audit' },
  { name: '12-audit-remediation', path: '/audit/remediation' },
  { name: '13-states', path: '/states' },
  { name: '14-state-IL', path: '/state/IL' },
  { name: '15-tools', path: '/tools' },
  { name: '16-tools-request', path: '/tools/request' },
  { name: '17-settings', path: '/settings' },
  { name: '18-settings-team', path: '/settings/team' },
  { name: '19-settings-contact', path: '/settings/contact' },
  { name: '20-settings-training', path: '/settings/training' },
  { name: '21-settings-disclosure', path: '/settings/disclosure' },
  { name: '22-settings-integrations', path: '/settings/integrations' },
  { name: '23-settings-adverse', path: '/settings/adverse-decisions' },
  { name: '24-onboarding-team', path: '/onboarding/team-setup' },
]

test('Authenticated flow — all pages', async ({ page }) => {
  // Step 1: Go to app root to set localStorage
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.evaluate((data) => {
    localStorage.setItem('quizData', JSON.stringify(data))
  }, quizData)

  // Step 2: Login
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-login.png'), fullPage: true })

  // Fill credentials
  await page.fill('input[type="email"], input[name="email"]', 'test-e2e@employarmor.com')
  await page.fill('input[type="password"], input[name="password"]', 'TestE2E!2026')
  
  // Submit
  await page.click('button[type="submit"]')

  // Wait for dashboard redirect
  await page.waitForURL('**/dashboard**', { timeout: 30000 })
  await page.waitForTimeout(3000) // let dashboard bootstrap
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-dashboard.png'), fullPage: true })

  // Step 3: Try clicking compliance phases on dashboard
  const phaseButtons = await page.$$('text=/Phase [1-4]/i')
  for (let i = 0; i < phaseButtons.length; i++) {
    try {
      await phaseButtons[i].click()
      await page.waitForTimeout(2000)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `02-dashboard-phase${i + 1}.png`),
        fullPage: true,
      })
      // Go back to dashboard
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
    } catch { /* phase not clickable */ }
  }

  // Step 4: Visit all routes
  for (const route of ROUTES) {
    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForTimeout(2000)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${route.name}.png`),
        fullPage: true,
      })
      console.log(`✅ ${route.name}: ${route.path}`)
    } catch (e: any) {
      console.log(`❌ ${route.name}: ${route.path} — ${e.message?.slice(0, 100)}`)
      try {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${route.name}-error.png`),
          fullPage: true,
        })
      } catch { /* ignore */ }
    }
  }

  // Step 5: Training — try to click into sections
  try {
    await page.goto(`${BASE_URL}/training`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)
    
    // Find training module links/buttons
    const trainingLinks = await page.$$('a[href*="/training/"]')
    const hrefs: string[] = []
    for (const link of trainingLinks) {
      const href = await link.getAttribute('href')
      if (href && !hrefs.includes(href) && !href.includes('/certificate/')) {
        hrefs.push(href)
      }
    }

    for (let i = 0; i < hrefs.length && i < 10; i++) {
      try {
        await page.goto(`${BASE_URL}${hrefs[i]}`, { waitUntil: 'networkidle', timeout: 20000 })
        await page.waitForTimeout(2000)
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `30-training-module-${i + 1}.png`),
          fullPage: true,
        })
        console.log(`✅ Training module ${i + 1}: ${hrefs[i]}`)
      } catch (e: any) {
        console.log(`❌ Training module ${i + 1}: ${hrefs[i]} — ${e.message?.slice(0, 100)}`)
      }
    }
  } catch { /* training page failed */ }
})
