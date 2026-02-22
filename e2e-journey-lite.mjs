#!/usr/bin/env node
// Lightweight E2E journey using playwright-core + system Chrome
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const BASE = 'https://employarmor.vercel.app';
const DIR = '/Users/henry/projects/hireshield/e2e-screenshots';
fs.mkdirSync(DIR, { recursive: true });

let n = 0;
async function snap(page, name) {
  n++;
  const f = `${String(n).padStart(2,'0')}-${name}.png`;
  await page.screenshot({ path: path.join(DIR, f), fullPage: false }); // NOT fullPage to avoid OOM
  console.log(`📸 ${f}`);
}

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  page.setDefaultTimeout(12000);

  try {
    // 1. Homepage
    console.log('1. Homepage');
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'homepage');

    // 2. Go to scan
    console.log('2. Scan page');
    await page.goto(`${BASE}/scan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'scan-start');

    // Select states
    console.log('   Selecting states...');
    for (const state of ['Illinois', 'Colorado', 'California']) {
      const el = page.locator(`text="${state}"`).first();
      if (await el.isVisible().catch(() => false)) await el.click();
    }
    await page.waitForTimeout(500);
    await snap(page, 'scan-states-selected');

    // Click Next
    const next1 = page.locator('button:has-text("Next")').first();
    if (await next1.isVisible().catch(() => false)) {
      await next1.click();
      await page.waitForTimeout(800);
    }
    await snap(page, 'scan-employees');

    // Employee count
    console.log('   Employee count...');
    for (const opt of ['51-200', '51', '50-200']) {
      const el = page.locator(`text="${opt}"`).first();
      if (await el.isVisible().catch(() => false)) { await el.click(); break; }
    }
    const next2 = page.locator('button:has-text("Next")').first();
    if (await next2.isVisible().catch(() => false)) {
      await next2.click();
      await page.waitForTimeout(800);
    }
    await snap(page, 'scan-tools');

    // Select tools
    console.log('   Selecting tools...');
    for (const tool of ['LinkedIn Recruiter', 'Greenhouse', 'HireVue', 'LinkedIn']) {
      const el = page.locator(`text="${tool}"`).first();
      if (await el.isVisible().catch(() => false)) await el.click();
    }
    await page.waitForTimeout(500);
    await snap(page, 'scan-tools-selected');

    const next3 = page.locator('button:has-text("Next")').first();
    if (await next3.isVisible().catch(() => false)) {
      await next3.click();
      await page.waitForTimeout(800);
    }
    await snap(page, 'scan-email');

    // Enter email
    console.log('   Email...');
    const emailIn = page.locator('input[type="email"]').first();
    if (await emailIn.isVisible().catch(() => false)) {
      await emailIn.fill('e2e-visual@employarmor.com');
    }
    await snap(page, 'scan-email-filled');

    // Submit
    const submitBtn = page.locator('button[type="submit"], button:has-text("Get"), button:has-text("See"), button:has-text("Submit")').first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
    await snap(page, 'scan-results');

    // Scroll results
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(500);
    await snap(page, 'scan-results-scrolled');

    // 3. Signup
    console.log('3. Signup');
    // Look for inline signup or CTA
    const signupCta = page.locator('button:has-text("Sign Up"), a:has-text("Sign Up"), button:has-text("Get Started"), a:has-text("Create Account")').first();
    if (await signupCta.isVisible().catch(() => false)) {
      await signupCta.click();
      await page.waitForTimeout(1500);
    } else {
      await page.goto(`${BASE}/signup`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
    }
    await snap(page, 'signup-form');

    // Fill signup
    const sEmail = page.locator('input[type="email"], input[name="email"]').first();
    const sPass = page.locator('input[type="password"], input[name="password"]').first();
    const sCompany = page.locator('input[name="company"], input[name="companyName"], input[placeholder*="ompany"]').first();

    if (await sEmail.isVisible().catch(() => false)) await sEmail.fill('e2e-visual@employarmor.com');
    if (await sPass.isVisible().catch(() => false)) await sPass.fill('TestVisual!2026');
    if (await sCompany.isVisible().catch(() => false)) await sCompany.fill('Visual Test Corp');
    await page.waitForTimeout(500);
    await snap(page, 'signup-filled');

    // Submit
    const createBtn = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Sign Up")').first();
    if (await createBtn.isVisible().catch(() => false)) {
      await createBtn.click();
      await page.waitForTimeout(4000);
    }
    await snap(page, 'signup-result');
    console.log(`   URL after signup: ${page.url()}`);

    // 4. Try logging in with test account (known working)
    console.log('4. Login with test account');
    await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await snap(page, 'login-page');

    const lEmail = page.locator('input[type="email"]').first();
    const lPass = page.locator('input[type="password"]').first();
    if (await lEmail.isVisible().catch(() => false)) await lEmail.fill('test-e2e@employarmor.com');
    if (await lPass.isVisible().catch(() => false)) await lPass.fill('TestE2E!2026');
    await page.waitForTimeout(300);
    await snap(page, 'login-filled');

    const loginBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log")').first();
    if (await loginBtn.isVisible().catch(() => false)) {
      await loginBtn.click();
      await page.waitForTimeout(4000);
    }
    console.log(`   URL after login: ${page.url()}`);
    await snap(page, 'post-login');

    // 5. Dashboard screenshots
    if (page.url().includes('/dashboard') || page.url().includes('/login') === false) {
      console.log('5. Dashboard & pages');
      if (!page.url().includes('/dashboard')) {
        await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
      }
      await snap(page, 'dashboard');

      for (const pg of ['/employees', '/tools', '/training', '/candidate-notices', '/settings']) {
        console.log(`   ${pg}`);
        await page.goto(`${BASE}${pg}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);
        await snap(page, `page-${pg.slice(1)}`);
      }
    }

    console.log(`\n✅ Done! ${n} screenshots in ${DIR}`);
  } catch (err) {
    console.error('ERROR:', err.message);
    await snap(page, 'error').catch(() => {});
  } finally {
    await browser.close();
  }
})();
