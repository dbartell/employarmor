import { chromium } from 'playwright';
import path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'homepage-to-scan');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Homepage
  await page.goto('http://localhost:3848/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-homepage.png'), fullPage: true });
  console.log('✓ Homepage screenshot');

  // 2. Navigate to /scan
  await page.goto('http://localhost:3848/scan', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-scan-landing.png'), fullPage: true });
  console.log('✓ Scan landing screenshot');

  // 3. Select states: Illinois, Colorado, Texas
  // States are buttons with the state code as bold text
  for (const stateCode of ['IL', 'CO', 'TX']) {
    await page.click(`button:has(div.font-bold:text-is("${stateCode}"))`);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-states-selected.png'), fullPage: true });
  console.log('✓ States selected screenshot');

  // 4. Click Continue
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);

  // 5. Select employee count 100+
  await page.click('button:has-text("100+ employees")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-employee-count.png'), fullPage: true });
  console.log('✓ Employee count screenshot');

  // 6. Click Continue
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);

  // 7. Select 5 AI tools
  const tools = ['LinkedIn Recruiter', 'HireVue', 'Pymetrics', 'Eightfold AI', 'Greenhouse'];
  for (const tool of tools) {
    await page.click(`button:has-text("${tool}")`);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-tools-selected.png'), fullPage: true });
  console.log('✓ Tools selected screenshot');

  // 8. Click Continue (runs analysis)
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-results.png'), fullPage: true });
  console.log('✓ Results screenshot');

  await browser.close();
  console.log('\nDone! All screenshots saved.');
}

run().catch(err => { console.error(err); process.exit(1); });
