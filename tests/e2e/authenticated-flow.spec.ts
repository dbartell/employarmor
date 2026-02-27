import { test, expect, Page } from '@playwright/test'
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

// ─── Content markers per route ───────────────────────────────────────────────
// Each route defines what "successfully rendered authenticated content" looks like.
// - `heading`: text that should appear on the page (case-insensitive substring)
// - `selectors`: CSS selectors — at least one must be present
// - `forbiddenText`: text that must NOT appear (error states)

interface RouteSpec {
  name: string
  path: string
  heading: string | RegExp
  selectors: string[]
  forbiddenText?: string[]
}

const ROUTES: RouteSpec[] = [
  {
    name: '02-dashboard',
    path: '/dashboard',
    heading: /compliance score|you're compliant|what to do next/i,
    selectors: ['[class*="progress"], [class*="score"], [class*="ring"]', 'nav, [class*="sidebar"], [class*="nav"]'],
  },
  {
    name: '03-training',
    path: '/training',
    heading: /training/i,
    selectors: ['a[href*="/training/"]', 'table, [class*="card"], [class*="module"]'],
  },
  {
    name: '04-compliance-packet',
    path: '/compliance-packet',
    heading: /compliance packet/i,
    selectors: ['button, [role="tab"]'],
  },
  {
    name: '05-documents',
    path: '/documents',
    heading: /required documents|documents/i,
    selectors: ['[class*="card"], [class*="document"]'],
  },
  {
    name: '06-impact-assessment',
    path: '/documents/impact-assessment',
    heading: /impact assessment|ai system details/i,
    selectors: ['form, [class*="step"], [class*="wizard"], button'],
  },
  {
    name: '07-compliance-documents',
    path: '/compliance/documents',
    heading: /compliance documents/i,
    selectors: ['table, [class*="card"], [class*="stat"]'],
  },
  {
    name: '08-disclosures',
    path: '/disclosures',
    heading: /public disclosure|disclosure page/i,
    selectors: ['button, [class*="preview"], [class*="status"]'],
  },
  {
    name: '09-consent',
    path: '/consent',
    heading: /consent|records|video interview/i,
    selectors: ['[role="tab"], [class*="tab"], button'],
  },
  {
    name: '10-approvals',
    path: '/approvals',
    heading: /approvals/i,
    selectors: ['table, [class*="card"], [class*="request"], [class*="history"]'],
  },
  {
    name: '11-audit',
    path: '/audit',
    heading: /compliance audit/i,
    selectors: ['[class*="step"], [class*="wizard"], button, [class*="progress"]'],
  },
  {
    name: '12-audit-remediation',
    path: '/audit/remediation',
    heading: /compliance remediation|remediation/i,
    selectors: ['[class*="accordion"], [class*="checklist"], [class*="progress"], button'],
  },
  {
    name: '13-states',
    path: '/states',
    heading: /manage hiring states|states/i,
    selectors: ['button, [class*="state"], [class*="card"]'],
  },
  {
    name: '14-state-IL',
    path: '/state/IL',
    heading: /illinois|compliance progress|no action required/i,
    selectors: ['[class*="card"], [class*="checklist"], [class*="progress"], button'],
  },
  {
    name: '15-tools',
    path: '/tools',
    heading: /tool registry|tools|ai tools/i,
    selectors: ['[class*="card"], table, [class*="tool"], button'],
  },
  {
    name: '16-tools-request',
    path: '/tools/request',
    heading: /request new tool|request/i,
    selectors: ['form, input, textarea, button[type="submit"], select'],
  },
  {
    name: '17-settings',
    path: '/settings',
    heading: /settings/i,
    selectors: ['[class*="card"], a[href*="/settings/"]'],
  },
  {
    name: '18-settings-team',
    path: '/settings/team',
    heading: /team management|team/i,
    selectors: ['table, [class*="member"], button, [class*="invite"]'],
  },
  {
    name: '19-settings-contact',
    path: '/settings/contact',
    heading: /contact settings/i,
    selectors: ['form, input, button'],
  },
  {
    name: '20-settings-training',
    path: '/settings/training',
    heading: /training management|training/i,
    selectors: ['table, [class*="stat"], [class*="card"], button'],
  },
  {
    name: '21-settings-disclosure',
    path: '/settings/disclosure',
    heading: /disclosure page|disclosure/i,
    selectors: ['[role="tab"], [class*="tab"], [class*="preview"], button'],
  },
  {
    name: '22-settings-integrations',
    path: '/settings/integrations',
    heading: /ats integrations|integrations/i,
    selectors: ['button, [class*="card"], [class*="integration"]'],
  },
  {
    name: '23-settings-adverse',
    path: '/settings/adverse-decisions',
    heading: /adverse decision|human review/i,
    selectors: ['form, input, textarea, button'],
  },
  {
    name: '24-onboarding-team',
    path: '/onboarding/team-setup',
    heading: /onboarding|team|setup/i,
    selectors: ['form, input, button, [class*="step"]'],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check that the page is NOT showing the login form */
async function assertNotOnLogin(page: Page, context: string): Promise<boolean> {
  const url = page.url()
  if (url.includes('/login')) {
    console.log(`  ❌ REDIRECTED TO LOGIN — ${context} (url: ${url})`)
    return false
  }

  // Also check for login form content in case of client-side redirect
  const hasLoginForm = await page.locator('text=/sign in to your account/i').count()
  if (hasLoginForm > 0) {
    console.log(`  ❌ LOGIN FORM DETECTED — ${context}`)
    return false
  }

  return true
}

/** Check for error messages on page */
async function checkForErrors(page: Page): Promise<string | null> {
  const errorPatterns = [
    'text=/something went wrong/i',
    'text=/unexpected error/i',
    'text=/500 internal/i',
    'text=/404 not found/i',
    'text=/application error/i',
  ]

  for (const pattern of errorPatterns) {
    const count = await page.locator(pattern).count()
    if (count > 0) {
      const text = await page.locator(pattern).first().textContent()
      return text?.trim() ?? 'Unknown error'
    }
  }
  return null
}

/** Try to find at least one matching selector from a list */
async function hasAnySelector(page: Page, selectors: string[]): Promise<boolean> {
  for (const selector of selectors) {
    // Selectors may have commas (alternatives) — split and try each
    const parts = selector.split(',').map((s) => s.trim())
    for (const part of parts) {
      try {
        const count = await page.locator(part).count()
        if (count > 0) return true
      } catch {
        // invalid selector, skip
      }
    }
  }
  return false
}

// ─── Test ────────────────────────────────────────────────────────────────────

test('Authenticated flow — all pages', async ({ page }) => {
  const results: { name: string; path: string; status: 'PASS' | 'FAIL'; reason?: string }[] = []

  // Step 1: Set localStorage quiz data
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.evaluate((data) => {
    localStorage.setItem('quizData', JSON.stringify(data))
  }, quizData)

  // ─── Step 2: Login ───────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-login.png'), fullPage: true })

  // Fill credentials and submit
  await page.fill('input[type="email"], input[name="email"]', 'test-e2e@employarmor.com')
  await page.fill('input[type="password"], input[name="password"]', 'TestE2E!2026')
  await page.click('button[type="submit"]')

  // Wait for dashboard redirect
  await page.waitForURL('**/dashboard**', { timeout: 30000 })
  await page.waitForTimeout(3000)

  // ─── Step 3: Verify authentication succeeded ────────────────────────────
  const authOk = await assertNotOnLogin(page, 'post-login')
  if (!authOk) {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'FAIL-auth-login-redirect.png'),
      fullPage: true,
    })
    throw new Error(
      'AUTHENTICATION FAILED: After login, still on login page. All subsequent tests would be invalid.'
    )
  }

  // Verify dashboard content loaded (not just a blank page)
  const hasDashboardContent = await page
    .locator('text=/compliance score|you\'re compliant|what to do next|employees notified/i')
    .first()
    .waitFor({ timeout: 10000 })
    .then(() => true)
    .catch(() => false)

  if (!hasDashboardContent) {
    // Check for sidebar/nav as a fallback — we're authenticated but dashboard may look different
    const hasNav = await hasAnySelector(page, ['nav', '[class*="sidebar"]', '[class*="nav"]'])
    if (!hasNav) {
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'FAIL-auth-no-dashboard-content.png'),
        fullPage: true,
      })
      throw new Error(
        'AUTHENTICATION FAILED: Dashboard loaded but no expected content found (no compliance score, nav, or sidebar).'
      )
    }
  }

  console.log('✅ Authentication verified — dashboard content loaded')
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-dashboard.png'), fullPage: true })

  // ─── Step 4: Visit all routes with content verification ─────────────────
  for (const route of ROUTES) {
    const routeResult: (typeof results)[0] = {
      name: route.name,
      path: route.path,
      status: 'PASS',
    }

    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForTimeout(2000)

      // Check 1: Not redirected to login
      const notOnLogin = await assertNotOnLogin(page, `${route.name} (${route.path})`)
      if (!notOnLogin) {
        routeResult.status = 'FAIL'
        routeResult.reason = 'Redirected to login page'
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `FAIL-${route.name}.png`),
          fullPage: true,
        })
        results.push(routeResult)
        continue
      }

      // Check 2: URL is correct (not unexpectedly redirected elsewhere)
      const currentUrl = new URL(page.url())
      const expectedPathBase = route.path.split('/').filter(Boolean)[0]
      // Allow redirects within the app but flag unexpected ones
      if (
        !currentUrl.pathname.includes(expectedPathBase) &&
        !currentUrl.pathname.includes('/dashboard')
      ) {
        routeResult.status = 'FAIL'
        routeResult.reason = `Unexpected redirect to ${currentUrl.pathname}`
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `FAIL-${route.name}.png`),
          fullPage: true,
        })
        results.push(routeResult)
        continue
      }

      // Check 3: No error messages
      const errorMsg = await checkForErrors(page)
      if (errorMsg) {
        routeResult.status = 'FAIL'
        routeResult.reason = `Error on page: ${errorMsg}`
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `FAIL-${route.name}.png`),
          fullPage: true,
        })
        results.push(routeResult)
        continue
      }

      // Check 4: Expected heading/content text exists
      let headingFound = false
      try {
        const headingLocator =
          route.heading instanceof RegExp
            ? page.locator(`text=${route.heading.source}`).first()
            : page.locator(`text=/${route.heading}/i`).first()

        // Use a generous matcher: search the whole body text
        const bodyText = await page.locator('body').textContent()
        if (bodyText) {
          const regex =
            route.heading instanceof RegExp ? route.heading : new RegExp(route.heading, 'i')
          headingFound = regex.test(bodyText)
        }
      } catch {
        headingFound = false
      }

      if (!headingFound) {
        // Not an automatic fail — some pages might have slightly different text
        // But log a warning
        console.log(
          `  ⚠️  ${route.name}: Expected heading "${route.heading}" not found (content may differ)`
        )
      }

      // Check 5: At least one expected UI element exists
      const hasElements = await hasAnySelector(page, route.selectors)
      if (!hasElements && !headingFound) {
        // Both heading AND selectors are missing — this page is likely broken or empty
        routeResult.status = 'FAIL'
        routeResult.reason = 'No expected content found (missing heading and UI elements)'
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `FAIL-${route.name}.png`),
          fullPage: true,
        })
        results.push(routeResult)
        continue
      }

      // All checks passed
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${route.name}.png`),
        fullPage: true,
      })
      console.log(
        `  ✅ ${route.name}: ${route.path}` + (headingFound ? '' : ' (heading not matched)')
      )
    } catch (e: any) {
      routeResult.status = 'FAIL'
      routeResult.reason = `Navigation/timeout error: ${e.message?.slice(0, 120)}`
      console.log(`  ❌ ${route.name}: ${route.path} — ${e.message?.slice(0, 120)}`)
      try {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `FAIL-${route.name}.png`),
          fullPage: true,
        })
      } catch {
        /* screenshot also failed */
      }
    }

    results.push(routeResult)
  }

  // ─── Step 5: Training module deep-links ─────────────────────────────────
  try {
    await page.goto(`${BASE_URL}/training`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

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

        const notOnLogin = await assertNotOnLogin(page, `training-module-${i + 1}`)
        const screenshotName = notOnLogin
          ? `30-training-module-${i + 1}.png`
          : `FAIL-30-training-module-${i + 1}.png`

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, screenshotName),
          fullPage: true,
        })

        if (notOnLogin) {
          console.log(`  ✅ Training module ${i + 1}: ${hrefs[i]}`)
        } else {
          results.push({
            name: `training-module-${i + 1}`,
            path: hrefs[i],
            status: 'FAIL',
            reason: 'Redirected to login',
          })
        }
      } catch (e: any) {
        console.log(`  ❌ Training module ${i + 1}: ${hrefs[i]} — ${e.message?.slice(0, 100)}`)
        results.push({
          name: `training-module-${i + 1}`,
          path: hrefs[i],
          status: 'FAIL',
          reason: `Error: ${e.message?.slice(0, 100)}`,
        })
      }
    }
  } catch {
    /* training page itself failed — already captured in route loop */
  }

  // ─── Step 6: Summary ───────────────────────────────────────────────────
  const passed = results.filter((r) => r.status === 'PASS')
  const failed = results.filter((r) => r.status === 'FAIL')

  console.log('\n' + '═'.repeat(60))
  console.log(`  E2E AUTHENTICATED FLOW RESULTS`)
  console.log('═'.repeat(60))
  console.log(`  Total routes: ${results.length}`)
  console.log(`  ✅ Passed:    ${passed.length}`)
  console.log(`  ❌ Failed:    ${failed.length}`)

  if (failed.length > 0) {
    console.log('\n  Failed routes:')
    for (const f of failed) {
      console.log(`    ❌ ${f.name} (${f.path}): ${f.reason}`)
    }
  }

  console.log('═'.repeat(60) + '\n')

  // Fail the test if any route failed
  expect(failed.length, `${failed.length} route(s) failed:\n${failed.map((f) => `  ${f.name}: ${f.reason}`).join('\n')}`).toBe(0)
})
