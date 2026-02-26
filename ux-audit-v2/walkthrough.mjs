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

async function takeErrorScreenshot(page, stepName) {
  const filename = `ERROR_${stepName}_${Date.now()}.png`;
  const path = join(OUTPUT_DIR, filename);
  try {
    await page.screenshot({ path, fullPage: true });
    console.log(`✗ Error screenshot saved: ${filename}`);
  } catch (e) {
    console.log(`✗ Could not save error screenshot: ${e.message}`);
  }
}

async function runAudit() {
  console.log('🚀 Starting EmployArmor UX Audit v2...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    // STEP 1: Homepage
    console.log('\n📍 STEP 1: Homepage');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    await takeScreenshot(page, 'homepage', 'Full homepage with mobile sticky CTA check');

    // STEP 2: Navigate to /scan
    console.log('\n📍 STEP 2: Navigate to scan wizard');
    await page.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    await takeScreenshot(page, 'scan_start', 'Scan wizard landing page');

    // STEP 3: Step 1 - States
    console.log('\n📍 STEP 3: States selection');
    try {
      await takeScreenshot(page, 'states_initial', 'Step 1 of 4 - States selection with progress indicator');
      
      // Select Colorado, California, Illinois
      const states = ['Colorado', 'California', 'Illinois'];
      for (const state of states) {
        try {
          const stateButton = page.locator(`button:has-text("${state}")`).first();
          await stateButton.click();
          await page.waitForTimeout(500);
        } catch (e) {
          console.log(`  ⚠️ Could not select ${state}: ${e.message}`);
        }
      }
      
      await page.waitForTimeout(1000);
      await takeScreenshot(page, 'states_selected', '3 states selected with counter and checkmarks');
      
      // Test "Select All" button
      try {
        const selectAllButton = page.locator('button:has-text("Select All")').first();
        if (await selectAllButton.isVisible()) {
          await selectAllButton.click();
          await page.waitForTimeout(1000);
          await takeScreenshot(page, 'states_select_all', 'All states selected');
          
          // Deselect all to go back to 3 states
          const deselectButton = page.locator('button:has-text("Deselect All")').or(page.locator('button:has-text("Clear All")')).first();
          if (await deselectButton.isVisible()) {
            await deselectButton.click();
            await page.waitForTimeout(500);
            // Re-select the 3 states
            for (const state of states) {
              await page.locator(`button:has-text("${state}")`).first().click();
              await page.waitForTimeout(500);
            }
          }
        }
      } catch (e) {
        console.log(`  ⚠️ Select All test: ${e.message}`);
      }
      
      // Click Next
      const nextButton = page.locator('button:has-text("Next")').first();
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log(`✗ States step error: ${e.message}`);
      await takeErrorScreenshot(page, 'states');
    }

    // STEP 4: Step 2 - Employees
    console.log('\n📍 STEP 4: Employee count selection');
    try {
      await takeScreenshot(page, 'employees_initial', 'Step 2 of 4 - Employee count with 50% progress');
      
      // Select 16-50 employees
      const employeeButton = page.locator('button:has-text("16-50")').first();
      await employeeButton.click();
      await page.waitForTimeout(1000);
      await takeScreenshot(page, 'employees_selected', '16-50 employees selected');
      
      // Click Next
      const nextButton = page.locator('button:has-text("Next")').first();
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log(`✗ Employees step error: ${e.message}`);
      await takeErrorScreenshot(page, 'employees');
    }

    // STEP 5: Step 3 - Tools
    console.log('\n📍 STEP 5: AI Tools selection');
    try {
      await takeScreenshot(page, 'tools_initial', 'Step 3 - Tools with collapsed categories, Popular section, and search bar');
      
      // Try searching "chat"
      try {
        const searchInput = page.locator('input[type="text"]').or(page.locator('input[placeholder*="search" i]')).first();
        await searchInput.fill('chat');
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'tools_search_chat', 'Search results filtered by "chat"');
        
        // Clear search
        await searchInput.clear();
        await page.waitForTimeout(500);
      } catch (e) {
        console.log(`  ⚠️ Search test: ${e.message}`);
      }
      
      // Select ChatGPT, Claude, Copilot
      const tools = ['ChatGPT', 'Claude', 'Copilot'];
      for (const tool of tools) {
        try {
          const toolButton = page.locator(`button:has-text("${tool}")`).first();
          await toolButton.click();
          await page.waitForTimeout(500);
        } catch (e) {
          console.log(`  ⚠️ Could not select ${tool}: ${e.message}`);
        }
      }
      
      await page.waitForTimeout(1000);
      await takeScreenshot(page, 'tools_selected', 'ChatGPT, Claude, Copilot selected');
      
      // Check "I don't use AI tools" option exists
      try {
        const noToolsOption = page.locator('text="I don\'t use AI tools"').or(page.locator('text="No AI tools"')).first();
        if (await noToolsOption.isVisible({ timeout: 2000 })) {
          console.log('  ✓ "I don\'t use AI tools" option found');
        }
      } catch (e) {
        console.log(`  ⚠️ "I don't use AI tools" check: ${e.message}`);
      }
      
      // Click Next
      const nextButton = page.locator('button:has-text("Next")').first();
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
    } catch (e) {
      console.log(`✗ Tools step error: ${e.message}`);
      await takeErrorScreenshot(page, 'tools');
    }

    // STEP 6: Step 4 - Results
    console.log('\n📍 STEP 6: Results page');
    try {
      await takeScreenshot(page, 'results_score', 'Compliance score and Your Compliance Gaps section');
      
      // Try to expand "How we calculated"
      try {
        const expandButton = page.locator('text="How we calculated"').or(page.locator('button:has-text("How")')).first();
        if (await expandButton.isVisible({ timeout: 2000 })) {
          await expandButton.click();
          await page.waitForTimeout(1000);
          await takeScreenshot(page, 'results_calculation', 'How we calculated expanded');
        }
      } catch (e) {
        console.log(`  ⚠️ "How we calculated" expand: ${e.message}`);
      }
      
      // Scroll to trust signals
      console.log('  Scrolling to trust signals...');
      try {
        const trustSignals = page.locator('text="Trusted by"').or(page.locator('text="1,000+ companies"')).first();
        await trustSignals.scrollIntoViewIfNeeded({ timeout: 5000 });
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'trust_signals', 'Trusted by 1,000+ companies section');
      } catch (e) {
        console.log(`  ⚠️ Trust signals scroll: ${e.message}`);
        // Try scrolling manually
        await page.evaluate(() => window.scrollBy(0, 800));
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'trust_signals_alt', 'Trust signals section (alt method)');
      }
      
      // Scroll to signup form
      console.log('  Scrolling to signup form...');
      try {
        const signupForm = page.locator('input[type="email"]').or(page.locator('input[placeholder*="email" i]')).first();
        await signupForm.scrollIntoViewIfNeeded({ timeout: 5000 });
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'signup_form', 'Signup form with password requirements and trust signals');
      } catch (e) {
        console.log(`  ⚠️ Signup form scroll: ${e.message}`);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'signup_form_alt', 'Signup form (alt method)');
      }
      
      // Fill signup form
      console.log('  Filling signup form...');
      try {
        const emailInput = page.locator('input[type="email"]').first();
        await emailInput.fill('ux-v2-test@employarmor.com');
        await page.waitForTimeout(500);
        
        const passwordInput = page.locator('input[type="password"]').first();
        await passwordInput.fill('UxTest!2026');
        await page.waitForTimeout(1000);
        
        const companyInput = page.locator('input[placeholder*="company" i]').or(page.locator('input[name*="company" i]')).first();
        await companyInput.fill('UX V2 Corp');
        await page.waitForTimeout(1000);
        
        await takeScreenshot(page, 'signup_filled', 'Signup form filled with real-time password validation');
        
        // Submit signup
        const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Sign up")')).or(page.locator('button:has-text("Get Started")')).first();
        await submitButton.click();
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        await page.waitForTimeout(2000);
      } catch (e) {
        console.log(`  ⚠️ Signup form fill/submit: ${e.message}`);
        await takeErrorScreenshot(page, 'signup');
      }
    } catch (e) {
      console.log(`✗ Results step error: ${e.message}`);
      await takeErrorScreenshot(page, 'results');
    }

    // STEP 7: Dashboard
    console.log('\n📍 STEP 7: Dashboard');
    try {
      await page.waitForTimeout(2000);
      await takeScreenshot(page, 'dashboard_initial', 'Dashboard - checking for onboarding tour modal');
      
      // Check for onboarding tour modal
      try {
        const tourModal = page.locator('[role="dialog"]').or(page.locator('.modal')).or(page.locator('text="Welcome"')).first();
        if (await tourModal.isVisible({ timeout: 3000 })) {
          console.log('  ✓ Onboarding tour modal found');
          await takeScreenshot(page, 'tour_step_1', 'Onboarding tour - Step 1');
          
          // Click through tour steps
          let tourStep = 2;
          while (tourStep <= 5) {
            try {
              const nextTourButton = page.locator('button:has-text("Next")').or(page.locator('button:has-text("Continue")')).first();
              if (await nextTourButton.isVisible({ timeout: 2000 })) {
                await nextTourButton.click();
                await page.waitForTimeout(1000);
                await takeScreenshot(page, `tour_step_${tourStep}`, `Onboarding tour - Step ${tourStep}`);
                tourStep++;
              } else {
                break;
              }
            } catch (e) {
              console.log(`  Tour step ${tourStep} ended`);
              break;
            }
          }
          
          // Close tour
          try {
            const finishButton = page.locator('button:has-text("Finish")').or(page.locator('button:has-text("Done")').or(page.locator('button:has-text("Get Started")'))).first();
            await finishButton.click();
            await page.waitForTimeout(1000);
          } catch (e) {
            console.log(`  ⚠️ Could not close tour: ${e.message}`);
          }
        } else {
          console.log('  ⚠️ No onboarding tour modal found');
        }
      } catch (e) {
        console.log(`  ⚠️ Tour modal check: ${e.message}`);
      }
      
      await takeScreenshot(page, 'dashboard_post_tour', 'Dashboard after tour');
      
      // Check sidebar navigation
      console.log('  Checking sidebar navigation...');
      try {
        const sidebarItems = await page.locator('nav a, aside a, [role="navigation"] a').count();
        console.log(`  Found ${sidebarItems} navigation items`);
        if (sidebarItems === 4) {
          console.log('  → Employee view (4 items)');
        } else if (sidebarItems > 4) {
          console.log('  → Admin view (full sidebar)');
        }
        await takeScreenshot(page, 'sidebar_nav', 'Sidebar navigation check');
      } catch (e) {
        console.log(`  ⚠️ Sidebar check: ${e.message}`);
      }
      
      // Click action button to trigger paywall
      console.log('  Testing paywall modal...');
      try {
        const actionButton = page.locator('button:has-text("Run Audit")').or(page.locator('button:has-text("Generate Handbook")')).first();
        if (await actionButton.isVisible({ timeout: 3000 })) {
          await actionButton.click();
          await page.waitForTimeout(2000);
          await takeScreenshot(page, 'paywall_modal', 'Paywall modal with pricing tiers');
        } else {
          console.log('  ⚠️ No action button found for paywall test');
        }
      } catch (e) {
        console.log(`  ⚠️ Paywall test: ${e.message}`);
        await takeErrorScreenshot(page, 'paywall');
      }
    } catch (e) {
      console.log(`✗ Dashboard error: ${e.message}`);
      await takeErrorScreenshot(page, 'dashboard');
    }

    // STEP 8: Mobile views
    console.log('\n📍 STEP 8: Mobile viewport testing');
    try {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      await takeScreenshot(page, 'mobile_homepage', 'Mobile homepage with sticky bottom CTA');
      
      // Try to go to dashboard
      try {
        await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(1500);
        await takeScreenshot(page, 'mobile_dashboard', 'Mobile dashboard view');
      } catch (e) {
        console.log(`  ⚠️ Mobile dashboard: ${e.message}`);
      }
    } catch (e) {
      console.log(`✗ Mobile testing error: ${e.message}`);
      await takeErrorScreenshot(page, 'mobile');
    }

  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    await takeErrorScreenshot(page, 'fatal');
  } finally {
    await browser.close();
    console.log('\n✅ Audit complete! Screenshots saved to:', OUTPUT_DIR);
  }
}

runAudit().catch(console.error);
