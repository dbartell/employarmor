import { chromium } from 'playwright';

const SCREENSHOT_DIR = '/Users/henry/projects/hireshield/ux-audit';
const BASE_URL = 'http://localhost:3000';

let stepNum = 1;

async function screenshot(page, name) {
  await page.waitForTimeout(1000);
  const filename = `${String(stepNum++).padStart(2, '0')}_${name}.png`;
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${filename}`, fullPage: true });
  console.log(`✓ ${filename}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    console.log('🚀 Starting EmployArmor UX Audit\n');

    // 1. Homepage
    console.log('1️⃣ Homepage');
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await screenshot(page, 'homepage');

    // 2. Navigate to scan
    console.log('2️⃣ Navigate to /scan');
    await page.goto(`${BASE_URL}/scan`);
    await page.waitForLoadState('networkidle');
    await screenshot(page, 'scan_start');

    // 3. Select states
    console.log('3️⃣ Select states');
    // Find all buttons/elements and click ones with state names
    await page.getByText('Colorado', { exact: false }).first().click();
    await page.waitForTimeout(300);
    await page.getByText('California', { exact: false }).first().click();
    await page.waitForTimeout(500);
    await screenshot(page, 'scan_states');
    
    // Click next
    await page.getByRole('button', { name: /^(next|continue)$/i }).first().click();
    await page.waitForTimeout(1500);

    // 4. Select employees
    console.log('4️⃣ Select employees');
    await page.waitForLoadState('networkidle');
    
    // Select "16-50 employees" option
    try {
      await page.getByText('16-50 employees').click({ timeout: 5000 });
    } catch {
      // If exact match fails, try finding the div/button containing this text
      await page.locator('text=16-50').first().click();
    }
    await page.waitForTimeout(500);
    await screenshot(page, 'scan_employees');
    
    // Wait for Next button to be enabled and click
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /^(next|continue)$/i }).first().click();
    await page.waitForTimeout(1500);

    // 5. Select tools
    console.log('5️⃣ Select AI tools');
    await page.waitForLoadState('networkidle');
    
    const tools = ['ChatGPT', 'Claude', 'Midjourney', 'Copilot'];
    for (const tool of tools) {
      try {
        await page.getByText(tool, { exact: false }).first().click({ timeout: 2000 });
        await page.waitForTimeout(300);
      } catch (e) {
        console.log(`   ⚠ Couldn't find ${tool}`);
      }
    }
    await screenshot(page, 'scan_tools');
    
    // Submit scan
    await page.getByRole('button', { name: /^(next|continue|submit|see results)$/i }).first().click();
    await page.waitForTimeout(2000);

    // 6. Results page
    console.log('6️⃣ Results page');
    await page.waitForLoadState('networkidle');
    await screenshot(page, 'scan_results');

    // 7. Signup form
    console.log('7️⃣ Signup form');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await screenshot(page, 'signup_form');

    // 8. Fill signup
    console.log('8️⃣ Fill signup');
    await page.getByRole('textbox', { name: /email/i }).fill('ux-audit-test@employarmor.com');
    await page.getByRole('textbox', { name: /password/i }).fill('UxAudit!2026');
    
    // Find company field
    try {
      await page.getByRole('textbox', { name: /company|organization/i }).fill('UX Audit Corp');
    } catch {
      await page.locator('input[name*="company"], input[placeholder*="company"]').first().fill('UX Audit Corp');
    }
    
    await page.waitForTimeout(500);
    await screenshot(page, 'signup_filled');
    
    // Submit
    await page.getByRole('button', { name: /sign up|create account|get started/i }).click();
    await page.waitForTimeout(3000);

    // 9. Dashboard
    console.log('9️⃣ Dashboard');
    await page.waitForLoadState('networkidle');
    await screenshot(page, 'dashboard');

    // 10. Try action (paywall)
    console.log('🔟 Trigger paywall');
    try {
      await page.getByRole('button', { name: /run audit|start audit|generate/i }).first().click({ timeout: 5000 });
      await page.waitForTimeout(2000);
      await screenshot(page, 'paywall_modal');
      
      // Close modal
      try {
        await page.getByRole('button', { name: /close/i }).click({ timeout: 2000 });
      } catch {}
    } catch {
      console.log('   ⚠ No paywall trigger found');
    }

    // 11. Navigate sidebar
    console.log('1️⃣1️⃣ Sidebar sections');
    const sections = ['Training', 'Handbook', 'Employees'];
    for (const section of sections) {
      try {
        await page.getByRole('link', { name: section }).click({ timeout: 3000 });
        await page.waitForTimeout(1500);
        await page.waitForLoadState('networkidle');
        await screenshot(page, `section_${section.toLowerCase()}`);
      } catch (e) {
        console.log(`   ⚠ Couldn't navigate to ${section}`);
      }
    }

    // 12. Mobile viewport
    console.log('1️⃣2️⃣ Mobile testing');
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await screenshot(page, 'mobile_homepage');
    
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await screenshot(page, 'mobile_dashboard');

    console.log('\n✅ Audit complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/error.png`, fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

run().catch(console.error);
