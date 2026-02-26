import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://employarmor.vercel.app';
const OUTPUT_DIR = __dirname;

let stepCounter = 1;

async function takeScreenshot(page, name, description) {
  const filename = `${String(stepCounter).padStart(2, '0')}_${name}.png`;
  const path = join(OUTPUT_DIR, filename);
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ ${filename}: ${description}`);
  stepCounter++;
  return path;
}

async function safeClick(page, selectors, description, timeout = 5000) {
  for (const selector of selectors) {
    try {
      const element = page.locator(selector).first();
      await element.waitFor({ state: 'visible', timeout });
      await element.click();
      console.log(`  ✓ Clicked: ${description} (${selector})`);
      return true;
    } catch (e) {
      // Try next selector
    }
  }
  console.log(`  ⚠️ Could not click: ${description}`);
  return false;
}

async function safeFill(page, selectors, value, description, timeout = 5000) {
  for (const selector of selectors) {
    try {
      const element = page.locator(selector).first();
      await element.waitFor({ state: 'visible', timeout });
      await element.fill(value);
      console.log(`  ✓ Filled: ${description} = ${value}`);
      return true;
    } catch (e) {
      // Try next selector
    }
  }
  console.log(`  ⚠️ Could not fill: ${description}`);
  return false;
}

async function runAudit() {
  console.log('🚀 Starting EmployArmor UX Audit v2 (Robust Edition)...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // STEP 1: Homepage
    console.log('\n📍 STEP 1: Homepage');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'homepage', 'Full homepage');

    // STEP 2: Navigate to /scan
    console.log('\n📍 STEP 2: Scan wizard');
    await page.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'scan_start', 'Scan wizard initial page');

    // Check if it's the scan page (might be step 1 already)
    const url = page.url();
    console.log(`  Current URL: ${url}`);

    // STEP 3: States selection
    console.log('\n📍 STEP 3: States (if available)');
    await takeScreenshot(page, 'states_or_current', 'Current page state');
    
    // Try to select states if available
    await page.waitForTimeout(1000);
    const stateButtons = ['Colorado', 'California', 'Illinois'];
    for (const state of stateButtons) {
      await safeClick(page, [
        `button:has-text("${state}")`,
        `[role="button"]:has-text("${state}")`,
        `div:has-text("${state}")`,
      ], state, 3000);
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'states_selected', 'After state selections');
    
    // Try to click Next/Continue
    await safeClick(page, [
      'button:has-text("Next")',
      'button:has-text("Continue")',
      'button[type="submit"]',
      '[role="button"]:has-text("Next")',
    ], 'Next button', 5000);
    await page.waitForTimeout(2000);

    // STEP 4: Employees
    console.log('\n📍 STEP 4: Employees');
    await takeScreenshot(page, 'employees_page', 'Employees selection page');
    
    await safeClick(page, [
      'button:has-text("16-50")',
      '[role="button"]:has-text("16-50")',
      'div:has-text("16-50")',
    ], '16-50 employees', 3000);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'employees_selected', 'Employees selected');
    
    await safeClick(page, [
      'button:has-text("Next")',
      'button:has-text("Continue")',
      'button[type="submit"]',
    ], 'Next button', 5000);
    await page.waitForTimeout(2000);

    // STEP 5: Tools
    console.log('\n📍 STEP 5: AI Tools');
    await takeScreenshot(page, 'tools_page', 'AI Tools selection page');
    
    // Try search if available
    await safeFill(page, [
      'input[type="text"]',
      'input[type="search"]',
      'input[placeholder*="search" i]',
    ], 'chat', 'Search', 3000);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'tools_search', 'Tools search results');
    
    // Clear search
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(1000);
    
    // Select tools
    const tools = ['ChatGPT', 'Claude', 'Copilot'];
    for (const tool of tools) {
      await safeClick(page, [
        `button:has-text("${tool}")`,
        `[role="button"]:has-text("${tool}")`,
        `div:has-text("${tool}")`,
      ], tool, 3000);
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'tools_selected', 'Tools selected');
    
    await safeClick(page, [
      'button:has-text("Next")',
      'button:has-text("Continue")',
      'button[type="submit"]',
    ], 'Next button', 5000);
    await page.waitForTimeout(3000);

    // STEP 6: Results
    console.log('\n📍 STEP 6: Results');
    await takeScreenshot(page, 'results_top', 'Results page - compliance score');
    
    // Try to expand "How we calculated"
    await safeClick(page, [
      'button:has-text("How we calculated")',
      '[role="button"]:has-text("How")',
      'text="How we calculated"',
    ], 'How we calculated', 3000);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'results_calculation', 'Results - calculation details');
    
    // Scroll to trust signals
    console.log('  Scrolling to trust signals...');
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'trust_signals', 'Trust signals section');
    
    // Scroll to signup
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'signup_form_empty', 'Signup form');
    
    // Fill signup form
    console.log('  Filling signup form...');
    await safeFill(page, [
      'input[type="email"]',
      'input[name="email"]',
      'input[placeholder*="email" i]',
    ], 'ux-v2-test@employarmor.com', 'Email', 5000);
    await page.waitForTimeout(500);
    
    await safeFill(page, [
      'input[type="password"]',
      'input[name="password"]',
    ], 'UxTest!2026', 'Password', 5000);
    await page.waitForTimeout(1500);
    
    await safeFill(page, [
      'input[name="company"]',
      'input[name="companyName"]',
      'input[placeholder*="company" i]',
    ], 'UX V2 Corp', 'Company', 5000);
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'signup_filled', 'Signup form filled');
    
    // Submit
    const submitted = await safeClick(page, [
      'button[type="submit"]',
      'button:has-text("Sign up")',
      'button:has-text("Get Started")',
      'button:has-text("Create Account")',
    ], 'Submit signup', 5000);
    
    if (submitted) {
      await page.waitForTimeout(3000);
      console.log('\n📍 STEP 7: Dashboard (if signup succeeded)');
      await takeScreenshot(page, 'post_signup', 'After signup submission');
      
      // Check for dashboard
      if (page.url().includes('/dashboard') || page.url().includes('/app')) {
        await takeScreenshot(page, 'dashboard', 'Dashboard page');
        
        // Look for tour modal
        const modalVisible = await page.locator('[role="dialog"], .modal').first().isVisible().catch(() => false);
        if (modalVisible) {
          console.log('  ✓ Tour modal visible');
          await takeScreenshot(page, 'tour_modal', 'Onboarding tour');
          
          // Try to close or skip
          await safeClick(page, [
            'button:has-text("Skip")',
            'button:has-text("Close")',
            'button:has-text("Finish")',
            'button[aria-label="Close"]',
          ], 'Close tour', 3000);
          await page.waitForTimeout(1000);
        }
        
        await takeScreenshot(page, 'dashboard_clean', 'Dashboard without modals');
        
        // Try to trigger paywall
        await safeClick(page, [
          'button:has-text("Run Audit")',
          'button:has-text("Generate Handbook")',
          'button:has-text("Upgrade")',
        ], 'Paywall trigger', 3000);
        await page.waitForTimeout(1500);
        await takeScreenshot(page, 'paywall', 'Paywall modal (if triggered)');
      }
    }

    // STEP 8: Mobile
    console.log('\n📍 STEP 8: Mobile views');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'mobile_homepage', 'Mobile homepage');
    
    // Try dashboard if logged in
    try {
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'mobile_dashboard', 'Mobile dashboard');
    } catch (e) {
      console.log('  ⚠️ Could not access mobile dashboard');
    }

  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    await page.screenshot({ path: join(OUTPUT_DIR, 'ERROR_fatal.png'), fullPage: true });
  } finally {
    await browser.close();
    console.log('\n✅ Audit complete! Check:', OUTPUT_DIR);
  }
}

runAudit().catch(console.error);
