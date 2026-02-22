const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://employarmor.vercel.app';
const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots/full-flow');
const TIMESTAMP = Date.now();
const TEST_EMAIL = `test-fullflow-${TIMESTAMP}@employarmor.com`;
let screenshotCount = 0;
const results = { success: [], errors: [] };

async function ss(page, name) {
  screenshotCount++;
  const filename = `${String(screenshotCount).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ fullPage: true, path: path.join(SCREENSHOT_DIR, filename) });
  console.log(`📸 ${filename}`);
  return filename;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    // ===== QUIZ: States =====
    console.log('\n=== QUIZ: States ===');
    await page.goto(`${BASE_URL}/quiz`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await ss(page, 'quiz-states-initial');

    for (const state of ['Illinois', 'California', 'Colorado']) {
      const btn = page.locator('button').filter({ hasText: new RegExp(`^.*${state}$`) }).first();
      await btn.click();
      await page.waitForTimeout(300);
    }
    await ss(page, 'quiz-states-selected');
    results.success.push('Quiz: States');

    await page.locator('button:has-text("Continue")').first().click();
    await page.waitForTimeout(2000);

    // ===== QUIZ: Tools =====
    console.log('\n=== QUIZ: Tools ===');
    await ss(page, 'quiz-tools-initial');

    // Select tools (category is expanded by default)
    // Click on the tool button that contains "HireVue" in a child div
    await page.locator('button', { has: page.locator('div:text-is("HireVue")') }).first().click();
    await page.waitForTimeout(300);
    await page.locator('button', { has: page.locator('div:text-is("Workday Recruiting")') }).first().click();
    await page.waitForTimeout(300);
    await ss(page, 'quiz-tools-selected');
    results.success.push('Quiz: Tools');

    await page.locator('button:has-text("Continue")').first().click();
    await page.waitForTimeout(2000);

    // ===== QUIZ: Usage =====
    console.log('\n=== QUIZ: Usage ===');
    await ss(page, 'quiz-usage-initial');

    await page.locator('button:has-text("Video Interview Recording")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Facial/Emotion Analysis")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Resume/Application Screening")').first().click();
    await page.waitForTimeout(300);
    await ss(page, 'quiz-usage-selected');
    results.success.push('Quiz: Usage');

    await page.locator('button:has-text("Continue")').first().click();
    await page.waitForTimeout(2000);

    // ===== QUIZ: Employees =====
    console.log('\n=== QUIZ: Employees ===');
    await ss(page, 'quiz-employees-initial');

    await page.locator('button:has-text("201-500 employees")').first().click();
    await page.waitForTimeout(300);
    await ss(page, 'quiz-employees-selected');
    results.success.push('Quiz: Employees');

    await page.locator('button:has-text("Continue")').first().click();
    await page.waitForTimeout(2000);

    // ===== QUIZ: Email =====
    console.log('\n=== QUIZ: Email ===');
    await ss(page, 'quiz-email-initial');

    await page.locator('input[placeholder*="company.com"]').first().fill(TEST_EMAIL);
    await page.waitForTimeout(200);
    await page.locator('input[placeholder*="Acme"]').first().fill('National Staffing Corp');
    await page.waitForTimeout(200);
    await ss(page, 'quiz-email-filled');
    results.success.push('Quiz: Email');

    // Submit
    await page.locator('button:has-text("See My Compliance Plan")').first().click();
    await page.waitForTimeout(2000);
    await ss(page, 'quiz-submitting');

    // Wait for /results
    try {
      await page.waitForURL('**/results**', { timeout: 15000 });
    } catch {
      console.log('Did not redirect to /results, current:', page.url());
    }
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(3000);
    await ss(page, 'results-page');
    results.success.push('Results page');

    // ===== SIGNUP =====
    console.log('\n=== SIGNUP ===');
    // Look for signup CTA on results
    const signupLink = page.locator('a:has-text("Sign up"), a:has-text("Create account"), a:has-text("Get started"), a:has-text("Start free"), a:has-text("Free trial"), a[href*="signup"]').first();
    if (await signupLink.isVisible().catch(() => false)) {
      await signupLink.click();
      await page.waitForTimeout(3000);
    } else {
      await page.goto(`${BASE_URL}/signup`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    await ss(page, 'signup-page');
    results.success.push('Signup page');

    // Fill form
    const companyField = page.locator('#companyName').first();
    if (await companyField.isVisible().catch(() => false)) {
      await companyField.fill('National Staffing Corp');
    }
    const emailField = page.locator('#email').first();
    if (await emailField.isVisible().catch(() => false)) {
      await emailField.fill(TEST_EMAIL);
    }
    const passField = page.locator('#password').first();
    if (await passField.isVisible().catch(() => false)) {
      await passField.fill('TestFullFlow!2026');
    }
    await ss(page, 'signup-filled');

    const createBtn = page.locator('button:has-text("Create account")').first();
    if (await createBtn.isVisible().catch(() => false)) {
      await createBtn.click();
      await page.waitForTimeout(5000);
      await ss(page, 'signup-submitted');
      results.success.push('Signup submitted');
    }

    console.log('URL after signup:', page.url());

    // ===== DASHBOARD =====
    console.log('\n=== DASHBOARD ===');
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(3000);
    await ss(page, 'dashboard');

    if (page.url().includes('login')) {
      results.errors.push('Dashboard: redirected to login (email confirmation required?)');
      await ss(page, 'login-redirect');
      // Try logging in
      const loginEmail = page.locator('input[type="email"]').first();
      if (await loginEmail.isVisible().catch(() => false)) {
        await loginEmail.fill(TEST_EMAIL);
        await page.locator('input[type="password"]').first().fill('TestFullFlow!2026');
        await page.locator('button[type="submit"]').first().click();
        await page.waitForTimeout(5000);
        await ss(page, 'login-attempt');
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.waitForTimeout(3000);
        await ss(page, 'dashboard-after-login');
      }
    } else {
      results.success.push('Dashboard');
    }

    // ===== TRAINING =====
    console.log('\n=== TRAINING ===');
    await page.goto(`${BASE_URL}/training`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(3000);
    await ss(page, 'training');
    results.success.push('Training page');

    // ===== COMPLIANCE PAGES =====
    console.log('\n=== COMPLIANCE PAGES ===');
    for (const p of ['compliance-packet', 'documents', 'disclosures', 'consent']) {
      await page.goto(`${BASE_URL}/${p}`);
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);
      await ss(page, p);
      results.success.push(p);
    }

    // ===== SETTINGS =====
    console.log('\n=== SETTINGS ===');
    await page.goto(`${BASE_URL}/settings`);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
    await ss(page, 'settings');
    results.success.push('Settings');

    // ===== OTHER PAGES =====
    console.log('\n=== OTHER PAGES ===');
    for (const p of ['pricing', 'profile', 'reports']) {
      await page.goto(`${BASE_URL}/${p}`);
      await page.waitForTimeout(2000);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (!bodyText.includes('404') && bodyText.length > 100) {
        await ss(page, p);
        results.success.push(p);
      }
    }

  } catch (e) {
    console.error('Error:', e.message);
    results.errors.push(e.message);
    await ss(page, 'error-state').catch(() => {});
  }

  await browser.close();

  console.log('\n========== RESULTS ==========');
  console.log(`Total screenshots: ${screenshotCount}`);
  console.log(`Test email: ${TEST_EMAIL}`);
  console.log(`Successful pages: ${results.success.join(', ')}`);
  console.log(`Errors: ${results.errors.length ? results.errors.join(', ') : 'None'}`);
})();
