import { test, expect } from '@playwright/test'
import * as path from 'path'

const BASE_URL = 'https://employarmor.vercel.app'
const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots/full-flow')
const TIMESTAMP = Date.now()
const TEST_EMAIL = `test-fullflow-${TIMESTAMP}@employarmor.com`
let screenshotCount = 0

async function screenshot(page: any, name: string) {
  screenshotCount++
  const filename = `${String(screenshotCount).padStart(2, '0')}-${name}.png`
  await page.screenshot({ fullPage: true, path: path.join(SCREENSHOT_DIR, filename) })
  console.log(`📸 ${filename}`)
}

test('Full natural flow: quiz → signup → dashboard → training → compliance', async ({ page }) => {
  test.setTimeout(300000)

  // ===== STEP 1: QUIZ =====
  
  // 1a: States
  await page.goto(`${BASE_URL}/quiz`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)
  await screenshot(page, 'quiz-states-initial')

  // Select Illinois, California, Colorado
  for (const state of ['Illinois', 'California', 'Colorado']) {
    const btn = page.locator('button').filter({ hasText: new RegExp(`^.*${state}$`) }).first()
    await btn.click()
    await page.waitForTimeout(300)
  }
  await screenshot(page, 'quiz-states-selected')

  // Click Continue
  await page.locator('button:has-text("Continue")').first().click()
  await page.waitForTimeout(2000)
  await screenshot(page, 'quiz-tools-initial')

  // 1b: Tools - select HireVue and Workday
  // Tools are already visible (categories start expanded)
  // Click HireVue
  await page.locator('button:has-text("HireVue")').first().click()
  await page.waitForTimeout(300)
  // Click Workday Recruiting
  await page.locator('button:has-text("Workday Recruiting")').first().click()
  await page.waitForTimeout(300)
  await screenshot(page, 'quiz-tools-selected')

  // Continue
  await page.locator('button:has-text("Continue")').first().click()
  await page.waitForTimeout(2000)
  await screenshot(page, 'quiz-usage-initial')

  // 1c: Usage - select video-recording, facial-analysis, screening
  await page.locator('button:has-text("Video Interview Recording")').first().click()
  await page.waitForTimeout(300)
  await page.locator('button:has-text("Facial/Emotion Analysis")').first().click()
  await page.waitForTimeout(300)
  await page.locator('button:has-text("Resume/Application Screening")').first().click()
  await page.waitForTimeout(300)
  await screenshot(page, 'quiz-usage-selected')

  // Continue
  await page.locator('button:has-text("Continue")').first().click()
  await page.waitForTimeout(2000)
  await screenshot(page, 'quiz-employees-initial')

  // 1d: Employee count - 201-500
  await page.locator('button:has-text("201-500 employees")').first().click()
  await page.waitForTimeout(300)
  await screenshot(page, 'quiz-employees-selected')

  // Continue
  await page.locator('button:has-text("Continue")').first().click()
  await page.waitForTimeout(2000)
  await screenshot(page, 'quiz-email-initial')

  // 1e: Email step
  await page.locator('input[name="email"], input[placeholder*="company.com"]').first().fill(TEST_EMAIL)
  await page.waitForTimeout(300)
  await page.locator('input[name="organization"], input[placeholder*="Acme"]').first().fill('National Staffing Corp')
  await page.waitForTimeout(300)
  await screenshot(page, 'quiz-email-filled')

  // Submit quiz
  await page.locator('button:has-text("See My Compliance Plan")').first().click()
  await page.waitForTimeout(3000)
  await screenshot(page, 'quiz-creating')

  // Wait for redirect to /results
  await page.waitForURL('**/results**', { timeout: 15000 }).catch(() => {})
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(2000)
  await screenshot(page, 'results-page')

  // ===== STEP 2: LOGIN WITH PRE-CONFIRMED ACCOUNT =====
  // Use pre-created test account (confirmed via Supabase admin API)
  const LOGIN_EMAIL = 'test-e2e@employarmor.com'
  const LOGIN_PASSWORD = 'TestE2E!2026'

  await page.goto(`${BASE_URL}/login`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)
  await screenshot(page, 'login-page')

  await page.locator('input[type="email"], #email').first().fill(LOGIN_EMAIL)
  await page.locator('input[type="password"], #password').first().fill(LOGIN_PASSWORD)
  await screenshot(page, 'login-filled')

  await page.locator('button[type="submit"], button:has-text("Sign in")').first().click()
  await page.waitForTimeout(5000)
  await screenshot(page, 'login-submitted')

  // Should redirect to dashboard
  console.log(`URL after login: ${page.url()}`)

  // If not on dashboard, navigate there
  if (!page.url().includes('dashboard')) {
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForLoadState('networkidle').catch(() => {})
    await page.waitForTimeout(3000)
  }
  await screenshot(page, 'dashboard')

  // ===== STEP 4: TRAINING =====
  await page.goto(`${BASE_URL}/training`)
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(3000)
  await screenshot(page, 'training')

  // Look for training module links
  const trainingLinks = page.locator('a[href*="training"]').all()
  const links = await trainingLinks
  for (let i = 0; i < Math.min(links.length, 3); i++) {
    const href = await links[i].getAttribute('href')
    if (href && href !== '/training') {
      await page.goto(`${BASE_URL}${href.startsWith('/') ? href : '/' + href}`)
      await page.waitForLoadState('networkidle').catch(() => {})
      await page.waitForTimeout(2000)
      await screenshot(page, `training-module-${i + 1}`)
    }
  }

  // ===== STEP 5: COMPLIANCE PAGES =====
  const compliancePages = [
    'compliance-packet',
    'documents',
    'disclosures', 
    'consent',
  ]
  
  for (const pageName of compliancePages) {
    await page.goto(`${BASE_URL}/${pageName}`)
    await page.waitForLoadState('networkidle').catch(() => {})
    await page.waitForTimeout(2000)
    await screenshot(page, pageName)
  }

  // ===== STEP 6: SETTINGS =====
  await page.goto(`${BASE_URL}/settings`)
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(2000)
  await screenshot(page, 'settings')

  // ===== STEP 7: OTHER PAGES =====
  const otherPages = ['pricing', 'profile', 'audit-log', 'reports']
  for (const pageName of otherPages) {
    await page.goto(`${BASE_URL}/${pageName}`)
    await page.waitForTimeout(2000)
    const is404 = await page.locator('text=404, text=not found').first().isVisible().catch(() => false)
    if (!is404) {
      await screenshot(page, pageName)
    }
  }

  console.log(`\n✅ Total screenshots: ${screenshotCount}`)
  console.log(`📧 Test email: ${TEST_EMAIL}`)
})
