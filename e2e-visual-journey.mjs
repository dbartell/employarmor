#!/usr/bin/env node
// Full visual E2E journey: Homepage → Scan → Signup → Dashboard
// Takes screenshots at every step

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'https://employarmor.vercel.app';
const SCREENSHOT_DIR = '/Users/henry/projects/hireshield/e2e-screenshots';
const TIMESTAMP = new Date().toISOString().slice(0, 16).replace(':', '-');

// Fresh test account for this run
const TEST_EMAIL = `e2e-visual-${Date.now()}@employarmor.com`;
const TEST_PASSWORD = 'TestVisual!2026';
const TEST_COMPANY = 'Visual Test Corp';

// Ensure screenshot dir
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let stepNum = 0;
async function screenshot(page, name) {
  stepNum++;
  const filename = `${String(stepNum).padStart(2, '0')}-${name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`📸 ${filename} (${page.url()})`);
  return filepath;
}

async function run() {
  console.log('Launching Chrome...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  try {
    // Step 1: Homepage
    console.log('\n=== STEP 1: Homepage ===');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await screenshot(page, 'homepage-top');
    
    // Scroll down to see more content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    await screenshot(page, 'homepage-middle');
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await screenshot(page, 'homepage-bottom');

    // Step 2: Click scan CTA
    console.log('\n=== STEP 2: Compliance Scan ===');
    // Find scan link
    const scanLink = await page.$('a[href="/scan"]') || await page.$('a:has-text("Assessment")') || await page.$('a:has-text("Scan")');
    if (scanLink) {
      await scanLink.click();
      await page.waitForLoadState('networkidle');
    } else {
      await page.goto(`${BASE}/scan`, { waitUntil: 'networkidle' });
    }
    await screenshot(page, 'scan-step1-states');

    // Step 2a: Select states
    console.log('  Selecting states...');
    // Try clicking state checkboxes/buttons
    const illinois = await page.$('text=Illinois') || await page.$('button:has-text("Illinois")') || await page.$('label:has-text("Illinois")');
    if (illinois) await illinois.click();
    await page.waitForTimeout(300);
    const colorado = await page.$('text=Colorado') || await page.$('button:has-text("Colorado")') || await page.$('label:has-text("Colorado")');
    if (colorado) await colorado.click();
    await page.waitForTimeout(300);
    await screenshot(page, 'scan-step1-states-selected');

    // Click Next
    const nextBtn = await page.$('button:has-text("Next")') || await page.$('button:has-text("Continue")');
    if (nextBtn) await nextBtn.click();
    await page.waitForTimeout(500);
    await screenshot(page, 'scan-step2-employees');

    // Step 2b: Employee count
    console.log('  Selecting employee count...');
    const empOption = await page.$('text=51-200') || await page.$('button:has-text("51")') || await page.$('label:has-text("51")');
    if (empOption) await empOption.click();
    await page.waitForTimeout(300);
    
    const nextBtn2 = await page.$('button:has-text("Next")') || await page.$('button:has-text("Continue")');
    if (nextBtn2) await nextBtn2.click();
    await page.waitForTimeout(500);
    await screenshot(page, 'scan-step3-tools');

    // Step 2c: Select tools
    console.log('  Selecting tools...');
    const tools = ['LinkedIn', 'Greenhouse', 'HireVue'];
    for (const tool of tools) {
      const el = await page.$(`text=${tool}`) || await page.$(`button:has-text("${tool}")`) || await page.$(`label:has-text("${tool}")`);
      if (el) await el.click();
      await page.waitForTimeout(200);
    }
    await screenshot(page, 'scan-step3-tools-selected');
    
    const nextBtn3 = await page.$('button:has-text("Next")') || await page.$('button:has-text("Continue")');
    if (nextBtn3) await nextBtn3.click();
    await page.waitForTimeout(500);
    await screenshot(page, 'scan-step4-email');

    // Step 2d: Enter email
    console.log('  Entering email...');
    const emailInput = await page.$('input[type="email"]') || await page.$('input[placeholder*="email"]');
    if (emailInput) {
      await emailInput.fill(TEST_EMAIL);
      await page.waitForTimeout(300);
    }
    await screenshot(page, 'scan-step4-email-filled');
    
    // Submit scan
    const submitBtn = await page.$('button:has-text("Get")') || await page.$('button:has-text("See")') || await page.$('button:has-text("Submit")') || await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await page.waitForTimeout(2000);
    await screenshot(page, 'scan-results');

    // Scroll results
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    await screenshot(page, 'scan-results-details');

    // Step 3: Signup flow
    console.log('\n=== STEP 3: Signup ===');
    // Look for signup CTA on results page
    const signupBtn = await page.$('button:has-text("Sign Up")') || await page.$('a:has-text("Sign Up")') || await page.$('button:has-text("Get Started")') || await page.$('a:has-text("Get Started")');
    if (signupBtn) {
      await signupBtn.click();
      await page.waitForTimeout(1000);
      await screenshot(page, 'signup-form');
    } else {
      // Navigate to signup directly
      await page.goto(`${BASE}/signup`, { waitUntil: 'networkidle' });
      await screenshot(page, 'signup-form');
    }

    // Fill signup form
    const signupEmail = await page.$('input[type="email"]') || await page.$('input[name="email"]');
    const signupPassword = await page.$('input[type="password"]') || await page.$('input[name="password"]');
    const companyInput = await page.$('input[name="company"]') || await page.$('input[placeholder*="ompany"]');

    if (signupEmail) await signupEmail.fill(TEST_EMAIL);
    if (signupPassword) await signupPassword.fill(TEST_PASSWORD);
    if (companyInput) await companyInput.fill(TEST_COMPANY);
    await page.waitForTimeout(300);
    await screenshot(page, 'signup-form-filled');

    // Submit signup
    const createBtn = await page.$('button:has-text("Create")') || await page.$('button:has-text("Sign Up")') || await page.$('button[type="submit"]');
    if (createBtn) {
      await createBtn.click();
      // Wait for redirect or confirmation
      await page.waitForTimeout(3000);
      await screenshot(page, 'signup-result');
    }

    // Step 4: Check if we landed on dashboard or need to login
    console.log('\n=== STEP 4: Dashboard ===');
    const currentUrl = page.url();
    console.log(`  Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard')) {
      await screenshot(page, 'dashboard-landed');
    } else if (currentUrl.includes('/login')) {
      // Login with the account
      console.log('  On login page, logging in...');
      await screenshot(page, 'login-page');
      const loginEmail = await page.$('input[type="email"]');
      const loginPassword = await page.$('input[type="password"]');
      if (loginEmail) await loginEmail.fill(TEST_EMAIL);
      if (loginPassword) await loginPassword.fill(TEST_PASSWORD);
      await page.waitForTimeout(300);
      await screenshot(page, 'login-filled');
      
      const loginBtn = await page.$('button:has-text("Sign In")') || await page.$('button:has-text("Log In")') || await page.$('button[type="submit"]');
      if (loginBtn) await loginBtn.click();
      await page.waitForTimeout(3000);
      await screenshot(page, 'post-login');
    } else {
      await screenshot(page, 'unexpected-page');
    }

    // If on dashboard, take detailed screenshots
    const finalUrl = page.url();
    console.log(`  Final URL: ${finalUrl}`);
    
    if (finalUrl.includes('/dashboard') || finalUrl.includes('/employees') || finalUrl.includes('/tools')) {
      console.log('  ✅ AUTHENTICATED! Taking dashboard screenshots...');
      await screenshot(page, 'dashboard-full');
      
      // Navigate to a few key pages
      for (const pg of ['/employees', '/tools', '/training', '/settings']) {
        await page.goto(`${BASE}${pg}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
        const pgName = pg.replace('/', '');
        await screenshot(page, `authed-${pgName}`);
      }
    }

    console.log('\n=== COMPLETE ===');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log(`Total screenshots: ${stepNum}`);
    
  } catch (err) {
    console.error('Error:', err.message);
    await screenshot(page, 'error-state').catch(() => {});
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
