#!/usr/bin/env node
// E2E journey via CDP connection to OpenClaw's Chrome
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const DIR = '/Users/henry/projects/hireshield/e2e-screenshots';
fs.mkdirSync(DIR, { recursive: true });
// Clear old screenshots
fs.readdirSync(DIR).forEach(f => fs.unlinkSync(path.join(DIR, f)));

let n = 0;
async function snap(page, name) {
  n++;
  const f = path.join(DIR, `${String(n).padStart(2,'0')}-${name}.png`);
  await page.screenshot({ path: f, fullPage: false });
  console.log(`📸 ${n}: ${name}`);
}

async function snapFull(page, name) {
  n++;
  const f = path.join(DIR, `${String(n).padStart(2,'0')}-${name}.png`);
  await page.screenshot({ path: f, fullPage: true });
  console.log(`📸 ${n}: ${name} (full)`);
}

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:18800');
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  page.setDefaultTimeout(10000);

  try {
    // 1. Homepage
    console.log('\n=== HOMEPAGE ===');
    await page.goto('https://employarmor.vercel.app', { waitUntil: 'networkidle', timeout: 20000 });
    await snapFull(page, 'homepage');

    // 2. Click "Free Compliance Score" or go to /scan
    console.log('\n=== SCAN WIZARD ===');
    await page.goto('https://employarmor.vercel.app/scan', { waitUntil: 'networkidle', timeout: 20000 });
    await snap(page, 'scan-step1-states');

    // Select IL, CA, CO
    await page.click('button:has-text("IL")');
    await page.click('button:has-text("CA")');
    await page.click('button:has-text("CO")');
    await page.waitForTimeout(300);
    await snap(page, 'scan-step1-selected');

    // Click Continue
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    await snap(page, 'scan-step2-employees');

    // Select 51-100
    await page.click('button:has-text("51-100")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    await snap(page, 'scan-step3-tools');

    // Select some tools (if they render now)
    const toolButtons = await page.$$('button:has-text("LinkedIn"), button:has-text("Greenhouse"), button:has-text("HireVue")');
    for (const btn of toolButtons.slice(0, 3)) {
      await btn.click();
      await page.waitForTimeout(200);
    }
    await snap(page, 'scan-step3-tools-selected');

    // Continue to email
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    await snap(page, 'scan-step4-email');

    // Fill email
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.fill('e2e-journey@employarmor.com');
      await page.waitForTimeout(300);
    }
    await snap(page, 'scan-step4-email-filled');

    // Submit to get results
    const getResultsBtn = await page.$('button:has-text("Get"), button:has-text("See"), button:has-text("Submit"), button[type="submit"]');
    if (getResultsBtn) {
      await getResultsBtn.click();
      await page.waitForTimeout(3000);
    }
    await snap(page, 'scan-results-top');
    await snapFull(page, 'scan-results-full');

    // 3. Signup from results or go to signup
    console.log('\n=== SIGNUP ===');
    const signupBtn = await page.$('button:has-text("Sign Up"), a:has-text("Sign Up"), button:has-text("Get Started"), button:has-text("Create")');
    if (signupBtn) {
      await signupBtn.click();
      await page.waitForTimeout(1500);
    } else {
      await page.goto('https://employarmor.vercel.app/signup', { waitUntil: 'networkidle', timeout: 15000 });
    }
    await snap(page, 'signup-form');

    // Fill signup
    const sEmail = await page.$('input[type="email"], input[name="email"]');
    const sPass = await page.$('input[type="password"], input[name="password"]');
    const sCompany = await page.$('input[name="company"], input[name="companyName"], input[placeholder*="ompany"], input[placeholder*="Company"]');
    
    if (sEmail) await sEmail.fill('e2e-journey@employarmor.com');
    if (sPass) await sPass.fill('TestJourney!2026');
    if (sCompany) await sCompany.fill('Journey Test Corp');
    await page.waitForTimeout(500);
    await snap(page, 'signup-filled');

    // Submit signup
    const createBtn = await page.$('button[type="submit"], button:has-text("Create"), button:has-text("Sign Up")');
    if (createBtn) {
      await createBtn.click();
      await page.waitForTimeout(5000);
    }
    await snap(page, 'signup-result');
    console.log(`  URL after signup: ${page.url()}`);

    // 4. Login with known test account
    console.log('\n=== LOGIN ===');
    await page.goto('https://employarmor.vercel.app/login', { waitUntil: 'networkidle', timeout: 15000 });
    await snap(page, 'login-page');

    await page.fill('input[type="email"]', 'test-e2e@employarmor.com');
    await page.fill('input[type="password"]', 'TestE2E!2026');
    await page.waitForTimeout(300);
    await snap(page, 'login-filled');

    await page.click('button[type="submit"], button:has-text("Sign In"), button:has-text("Log in")');
    await page.waitForTimeout(5000);
    console.log(`  URL after login: ${page.url()}`);
    await snap(page, 'post-login');

    // 5. Dashboard & key pages
    console.log('\n=== DASHBOARD ===');
    if (!page.url().includes('/dashboard')) {
      await page.goto('https://employarmor.vercel.app/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
    }
    await snap(page, 'dashboard');

    const pages = [
      ['/employees', 'team'],
      ['/tools', 'tool-registry'],
      ['/candidate-notices', 'candidate-notices'],
      ['/employee-disclosures', 'employee-disclosures'],
      ['/handbook', 'handbook-policy'],
      ['/training', 'training'],
      ['/compliance-packet', 'audit-packet'],
      ['/settings', 'settings'],
    ];

    for (const [pg, name] of pages) {
      console.log(`  ${pg}`);
      await page.goto(`https://employarmor.vercel.app${pg}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(500);
      await snap(page, `page-${name}`);
    }

    console.log(`\n✅ Complete! ${n} screenshots in ${DIR}`);
  } catch (err) {
    console.error('ERROR:', err.message);
    await snap(page, 'error').catch(() => {});
  } finally {
    await page.close();
    browser.close();
  }
})();
