import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots')
const BASE_URL = 'https://employarmor.vercel.app'

let stepNum = 11 // Continue from quiz flow screenshots

test.describe('Training & Compliance Flow', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })
  })

  const screenshot = async (page: any, label: string) => {
    stepNum++
    const filename = `${String(stepNum).padStart(2, '0')}-${label}.png`
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: true })
    console.log(`📸 Screenshot: ${filename}`)
  }

  test('Dashboard and app pages (auth-gated)', async ({ page }) => {
    // Try to access dashboard — will redirect to login
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    await screenshot(page, 'login-redirect')

    // Screenshot login page
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'login-page')

    // Screenshot signup page
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'signup-page')
  })

  test('Training landing (auth-gated)', async ({ page }) => {
    await page.goto(`${BASE_URL}/training`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    await screenshot(page, 'training-landing-or-login')
  })

  test('Public compliance hub', async ({ page }) => {
    await page.goto(`${BASE_URL}/compliance`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'compliance-hub')
  })

  test('State compliance pages', async ({ page }) => {
    const states = ['california', 'colorado', 'illinois', 'maryland', 'nyc']
    for (const state of states) {
      await page.goto(`${BASE_URL}/compliance/${state}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
      await screenshot(page, `compliance-${state}`)
    }
  })

  test('Public resources pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/resources`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'resources-hub')

    const resourcePages = [
      'hr-training-guide',
      'compliance-checklist-2026',
      'ai-disclosure-notice-template',
      'ai-disclosure-decision-tree',
      'vendor-assessment-guide',
      'compliance-program-guide',
    ]
    for (const resource of resourcePages) {
      await page.goto(`${BASE_URL}/resources/${resource}`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
      await screenshot(page, `resource-${resource}`)
    }
  })

  test('Glossary and about pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/glossary`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'glossary')

    await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'about')
  })

  test('Scorecard / free compliance check', async ({ page }) => {
    await page.goto(`${BASE_URL}/scorecard`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'scorecard')
  })

  test('Tool directory', async ({ page }) => {
    await page.goto(`${BASE_URL}/tools/directory`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'tools-directory')
  })

  test('Compare page', async ({ page }) => {
    await page.goto(`${BASE_URL}/compare`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'compare')
  })

  test('FAQ page', async ({ page }) => {
    await page.goto(`${BASE_URL}/resources/faq`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await screenshot(page, 'faq')
  })
})
