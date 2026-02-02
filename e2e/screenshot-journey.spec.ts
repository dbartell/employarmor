import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const screenshotDir = path.join(__dirname, '../screenshots/journey')

test.beforeAll(async () => {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true })
  }
})

test('capture full user journey screenshots', async ({ page }) => {
  let step = 1
  
  const screenshot = async (name: string) => {
    const filename = `${String(step).padStart(2, '0')}-${name}.png`
    await page.screenshot({ path: path.join(screenshotDir, filename), fullPage: true })
    console.log(`📸 ${filename}`)
    step++
  }

  // 1. Homepage
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await screenshot('homepage')

  // 2. Scroll to show features
  await page.evaluate(() => window.scrollBy(0, 600))
  await screenshot('homepage-features')

  // 3. Pricing page
  await page.goto('/pricing')
  await page.waitForLoadState('networkidle')
  await screenshot('pricing')

  // 4. Signup page
  await page.goto('/signup')
  await page.waitForLoadState('networkidle')
  await screenshot('signup')

  // 5. Login page
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await screenshot('login')

  // 6. Resources page
  await page.goto('/resources')
  await page.waitForLoadState('networkidle')
  await screenshot('resources')

  // 7. Compliance overview
  await page.goto('/compliance')
  await page.waitForLoadState('networkidle')
  await screenshot('compliance-overview')

  // 8. NYC compliance
  await page.goto('/compliance/nyc')
  await page.waitForLoadState('networkidle')
  await screenshot('compliance-nyc')

  // 9. Colorado compliance
  await page.goto('/compliance/colorado')
  await page.waitForLoadState('networkidle')
  await screenshot('compliance-colorado')

  // 10. Glossary
  await page.goto('/glossary')
  await page.waitForLoadState('networkidle')
  await screenshot('glossary')

  // 11. Compare page
  await page.goto('/compare')
  await page.waitForLoadState('networkidle')
  await screenshot('compare')

  // 12. Scorecard
  await page.goto('/scorecard')
  await page.waitForLoadState('networkidle')
  await screenshot('scorecard')

  // --- Log in to capture authenticated pages ---
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('input[type="email"]', 'bartelldevyn@gmail.com')
  await page.fill('input[type="password"]', '$SYp1k$^yKv8')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 })
  await page.waitForLoadState('networkidle')

  // --- Authenticated app pages ---

  // 13. Dashboard
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')
  await screenshot('dashboard')

  // 14. Audit page
  await page.goto('/audit')
  await page.waitForLoadState('networkidle')
  await screenshot('audit')

  // 15. Training page
  await page.goto('/training')
  await page.waitForLoadState('networkidle')
  await screenshot('training')

  // 16. Consent page
  await page.goto('/consent')
  await page.waitForLoadState('networkidle')
  await screenshot('consent')

  // 17. Documents page
  await page.goto('/documents')
  await page.waitForLoadState('networkidle')
  await screenshot('documents')

  // 18. Settings page
  await page.goto('/settings')
  await page.waitForLoadState('networkidle')
  await screenshot('settings')

  // 19. Team settings
  await page.goto('/settings/team')
  await page.waitForLoadState('networkidle')
  await screenshot('settings-team')

  // 20. Disclosure settings
  await page.goto('/settings/disclosure')
  await page.waitForLoadState('networkidle')
  await screenshot('settings-disclosure')

  // 21. Integrations
  await page.goto('/settings/integrations')
  await page.waitForLoadState('networkidle')
  await screenshot('settings-integrations')

  // 22. Training settings
  await page.goto('/settings/training')
  await page.waitForLoadState('networkidle')
  await screenshot('settings-training')

  // 23. Compliance documents
  await page.goto('/compliance/documents')
  await page.waitForLoadState('networkidle')
  await screenshot('compliance-documents')

  // 24. Onboarding team setup
  await page.goto('/onboarding/team-setup')
  await page.waitForLoadState('networkidle')
  await screenshot('onboarding-team-setup')

  console.log(`\n✅ Captured ${step - 1} screenshots to: ${screenshotDir}`)
})
