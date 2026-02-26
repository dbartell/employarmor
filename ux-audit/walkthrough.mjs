import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, filename, description) {
  try {
    await page.screenshot({ 
      path: join(__dirname, filename), 
      fullPage: true 
    });
    console.log(`✅ ${filename}: ${description}`);
  } catch (error) {
    console.error(`❌ Failed to take screenshot ${filename}:`, error.message);
  }
}

async function safeClick(page, selector, description) {
  try {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.click(selector);
    await sleep(1000);
    console.log(`✅ Clicked: ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to click ${description}:`, error.message);
    return false;
  }
}

async function main() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  let stepNumber = 1;

  try {
    // Step 1: Homepage
    console.log('\n📍 Step 1: Homepage');
    await page.goto('https://employarmor.vercel.app', { waitUntil: 'networkidle' });
    await sleep(1000);
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_homepage.png`, 'Homepage - hero section');

    // Step 2: Navigate to scan
    console.log('\n📍 Step 2: Find and click scan CTA');
    // Try multiple possible selectors for the scan CTA
    const scanSelectors = [
      'a[href="/scan"]',
      'a[href*="scan"]',
      'button:has-text("Scan")',
      'button:has-text("Check Compliance")',
      'a:has-text("Get Started")',
      'a:has-text("Start")'
    ];
    
    let clickedScan = false;
    for (const selector of scanSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        await page.click(selector);
        await page.waitForLoadState('networkidle');
        await sleep(1000);
        clickedScan = true;
        console.log(`✅ Clicked scan CTA with selector: ${selector}`);
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!clickedScan) {
      console.log('⚠️ Could not find scan CTA, navigating directly to /scan');
      await page.goto('https://employarmor.vercel.app/scan', { waitUntil: 'networkidle' });
      await sleep(1000);
    }
    
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_scan_start.png`, 'Scan page loaded');

    // Step 3: Scan Step 1 - States (Colorado and California)
    console.log('\n📍 Step 3: Select states (Colorado, California)');
    
    // Try to find and click Colorado
    const coloradoSelectors = [
      'text=Colorado',
      '[data-state="Colorado"]',
      'button:has-text("Colorado")',
      'div:has-text("Colorado")',
      'label:has-text("Colorado")'
    ];
    
    for (const selector of coloradoSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        await page.click(selector);
        await sleep(800);
        console.log('✅ Clicked Colorado');
        break;
      } catch (e) {
        continue;
      }
    }
    
    // Try to find and click California
    const californiaSelectors = [
      'text=California',
      '[data-state="California"]',
      'button:has-text("California")',
      'div:has-text("California")',
      'label:has-text("California")'
    ];
    
    for (const selector of californiaSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        await page.click(selector);
        await sleep(800);
        console.log('✅ Clicked California');
        break;
      } catch (e) {
        continue;
      }
    }
    
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_scan_states_selected.png`, 'States selected');
    
    // Click Next
    const nextSelectors = [
      'button:has-text("Next")',
      'button:has-text("Continue")',
      '[type="submit"]'
    ];
    
    let clickedNext = false;
    for (const selector of nextSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        await page.click(selector, { timeout: 5000 });
        await sleep(1500);
        console.log('✅ Clicked Next button');
        clickedNext = true;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!clickedNext) {
      console.log('⚠️ Could not click Next button, continuing anyway');
    }

    // Step 4: Scan Step 2 - Employees (11-50)
    console.log('\n📍 Step 4: Select employee count (11-50)');
    
    const employeeSelectors = [
      'text=11-50',
      'button:has-text("11-50")',
      'div:has-text("11-50")',
      'label:has-text("11-50")',
      '[data-employees="11-50"]'
    ];
    
    for (const selector of employeeSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 3000 });
        await page.click(selector);
        await sleep(800);
        console.log('✅ Clicked 11-50 employees');
        break;
      } catch (e) {
        continue;
      }
    }
    
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_scan_employees_selected.png`, 'Employee count selected');
    
    // Click Next
    clickedNext = false;
    for (const selector of nextSelectors) {
      try {
        await page.click(selector, { timeout: 5000 });
        await sleep(1500);
        console.log('✅ Clicked Next button');
        clickedNext = true;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!clickedNext) {
      console.log('⚠️ Could not click Next button, continuing anyway');
    }

    // Step 5: Scan Step 3 - Tools (select a few AI tools)
    console.log('\n📍 Step 5: Select AI tools');
    
    // Try to find checkboxes or clickable tool items
    const toolSelectors = [
      'input[type="checkbox"]',
      '[role="checkbox"]',
      'button[data-tool]',
      'div[data-tool]'
    ];
    
    let toolsFound = false;
    for (const selector of toolSelectors) {
      try {
        const tools = await page.$$(selector);
        if (tools.length > 0) {
          // Click first 3-4 tools
          for (let i = 0; i < Math.min(4, tools.length); i++) {
            await tools[i].click();
            await sleep(400);
            console.log(`✅ Clicked tool #${i + 1}`);
          }
          toolsFound = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!toolsFound) {
      console.log('⚠️ Could not find tool selectors, trying text-based selection');
      const commonTools = ['ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot'];
      for (const tool of commonTools) {
        try {
          await page.click(`text=${tool}`, { timeout: 2000 });
          await sleep(400);
          console.log(`✅ Clicked ${tool}`);
        } catch (e) {
          // Tool not found, continue
        }
      }
    }
    
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_scan_tools_selected.png`, 'AI tools selected');
    
    // Click Next
    clickedNext = false;
    for (const selector of nextSelectors) {
      try {
        await page.click(selector, { timeout: 5000 });
        await sleep(2000);
        console.log('✅ Clicked Next button');
        clickedNext = true;
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!clickedNext) {
      console.log('⚠️ Could not click Next button, continuing anyway');
    }

    // Step 6: Scan Step 4 - Results
    console.log('\n📍 Step 6: View results');
    await sleep(2000); // Wait for results to calculate
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_scan_results.png`, 'Risk score and results');

    // Step 7: Scroll to signup form
    console.log('\n📍 Step 7: Scroll to signup form');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await sleep(1000);
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_signup_form.png`, 'Inline signup form');

    // Step 8: Fill signup form
    console.log('\n📍 Step 8: Fill signup form');
    
    // Try to find and fill email
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[placeholder*="email" i]'
    ];
    
    for (const selector of emailSelectors) {
      try {
        await page.fill(selector, 'ux-test-feb25@employarmor.com', { timeout: 3000 });
        console.log('✅ Filled email');
        break;
      } catch (e) {
        continue;
      }
    }
    
    // Try to find and fill password
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[placeholder*="password" i]'
    ];
    
    for (const selector of passwordSelectors) {
      try {
        await page.fill(selector, 'UxTest!2026', { timeout: 3000 });
        console.log('✅ Filled password');
        break;
      } catch (e) {
        continue;
      }
    }
    
    // Try to find and fill company
    const companySelectors = [
      'input[name="company"]',
      'input[placeholder*="company" i]',
      'input[name="companyName"]'
    ];
    
    for (const selector of companySelectors) {
      try {
        await page.fill(selector, 'UX Test Corp', { timeout: 3000 });
        console.log('✅ Filled company');
        break;
      } catch (e) {
        continue;
      }
    }
    
    await sleep(500);
    
    // Submit form
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Sign Up")',
      'button:has-text("Create Account")',
      'button:has-text("Get Started")'
    ];
    
    for (const selector of submitSelectors) {
      try {
        await page.click(selector, { timeout: 3000 });
        console.log('✅ Clicked submit button');
        break;
      } catch (e) {
        continue;
      }
    }

    // Step 9: Wait for dashboard redirect
    console.log('\n📍 Step 9: Wait for dashboard');
    await sleep(3000);
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_dashboard_landing.png`, 'Dashboard after signup');

    // Step 10: Check sidebar nav
    console.log('\n📍 Step 10: Analyze sidebar navigation');
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_dashboard_sidebar.png`, 'Sidebar navigation view');

    // Step 11: Try clicking an action button
    console.log('\n📍 Step 11: Click action button to test paywall');
    
    const actionSelectors = [
      'button:has-text("Run Audit")',
      'button:has-text("Generate Handbook")',
      'button:has-text("Create")',
      'button:has-text("Start")',
      'a:has-text("Run Audit")',
      'a:has-text("Generate")'
    ];
    
    for (const selector of actionSelectors) {
      try {
        await page.click(selector, { timeout: 3000 });
        await sleep(1500);
        console.log(`✅ Clicked action button: ${selector}`);
        break;
      } catch (e) {
        continue;
      }
    }
    
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_paywall_modal.png`, 'Paywall/action modal');

    // Step 12: Navigate to sidebar sections
    console.log('\n📍 Step 12: Navigate sidebar sections');
    
    const sidebarLinks = await page.$$('nav a, aside a, [role="navigation"] a');
    const sectionsToVisit = Math.min(4, sidebarLinks.length);
    
    for (let i = 0; i < sectionsToVisit; i++) {
      try {
        // Re-query links to avoid stale elements
        const links = await page.$$('nav a, aside a, [role="navigation"] a');
        if (links[i]) {
          await links[i].click();
          await sleep(1500);
          await page.waitForLoadState('networkidle');
          const url = page.url();
          console.log(`✅ Navigated to section #${i + 1}: ${url}`);
          await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_dashboard_section_${i + 1}.png`, `Dashboard section ${i + 1}`);
        }
      } catch (e) {
        console.error(`⚠️ Could not navigate to section #${i + 1}:`, e.message);
      }
    }

    // Step 13: Mobile viewport testing
    console.log('\n📍 Step 13: Mobile viewport testing');
    
    await page.setViewportSize({ width: 375, height: 812 });
    await sleep(1000);
    
    // Go to homepage
    await page.goto('https://employarmor.vercel.app', { waitUntil: 'networkidle' });
    await sleep(1500);
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_mobile_homepage.png`, 'Mobile homepage');
    
    // Go to dashboard
    await page.goto('https://employarmor.vercel.app/dashboard', { waitUntil: 'networkidle' });
    await sleep(1500);
    await takeScreenshot(page, `${String(stepNumber++).padStart(2, '0')}_mobile_dashboard.png`, 'Mobile dashboard');

    console.log('\n✅ Audit complete! Screenshots saved to /Users/henry/projects/hireshield/ux-audit/');

  } catch (error) {
    console.error('\n❌ Fatal error during audit:', error);
    await takeScreenshot(page, 'error_screenshot.png', 'Error state');
  } finally {
    await browser.close();
  }
}

main();
