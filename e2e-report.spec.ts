import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://employarmor.vercel.app';
const SCREENSHOT_DIR = path.join(__dirname, 'e2e-screenshots');
const TEST_EMAIL = 'test-e2e@employarmor.com';
const TEST_PASSWORD = 'TestE2E!2026';

interface PageResult {
  route: string;
  status: 'ok' | 'error' | 'redirect';
  title: string;
  screenshot: string;
  note?: string;
}

async function run() {
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const results: PageResult[] = [];
  let idx = 0;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  async function visit(route: string, label: string) {
    idx++;
    const num = String(idx).padStart(2, '0');
    const filename = `${num}-${label}.png`;
    try {
      const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      const title = await page.title();
      const bodyText = await page.textContent('body') || '';
      let status: 'ok' | 'error' | 'redirect' = 'ok';
      let note = '';

      if (bodyText.includes('Application error') || bodyText.includes('Internal Server Error') || bodyText.includes('This page could not be found')) {
        status = 'error';
        note = bodyText.includes('404') ? '404 Not Found' : 'Server Error';
      }
      if (resp && resp.url() !== `${BASE_URL}${route}` && resp.url() !== `${BASE_URL}${route}/`) {
        note = `Redirected to ${resp.url().replace(BASE_URL, '')}`;
      }

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: false });
      results.push({ route, status, title, screenshot: filename, note });
      console.log(`${status === 'ok' ? '✅' : '❌'} ${route} — ${note || title}`);
    } catch (err: any) {
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: false }).catch(() => {});
      results.push({ route, status: 'error', title: '', screenshot: filename, note: err.message?.slice(0, 100) });
      console.log(`❌ ${route} — ${err.message?.slice(0, 80)}`);
    }
  }

  // Public pages
  console.log('\n=== PUBLIC PAGES ===');
  await visit('/', 'homepage');
  await visit('/scan', 'scan');
  await visit('/pricing', 'pricing');
  await visit('/integrations', 'integrations');
  await visit('/demo', 'demo');
  await visit('/login', 'login');
  await visit('/signup', 'signup');

  // Marketing pages
  console.log('\n=== MARKETING PAGES ===');
  await visit('/compliance', 'compliance');
  await visit('/resources', 'resources');
  await visit('/tools', 'tools');
  await visit('/compare', 'compare');

  // Login
  console.log('\n=== LOGIN ===');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  try {
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    const afterLoginUrl = page.url();
    console.log(`Login → landed on: ${afterLoginUrl.replace(BASE_URL, '')}`);
  } catch (err: any) {
    console.log(`Login failed: ${err.message?.slice(0, 80)}`);
  }

  // Authenticated pages
  console.log('\n=== AUTHENTICATED PAGES ===');
  await visit('/dashboard', 'dashboard');
  await visit('/candidate-notices', 'candidate-notices');
  await visit('/employee-disclosures', 'employee-disclosures');
  await visit('/handbook', 'handbook');
  await visit('/tool-registry', 'tool-registry');
  await visit('/approvals', 'approvals');
  await visit('/risk-assessment', 'risk-assessment');
  await visit('/training', 'training');
  await visit('/audit-packet', 'audit-packet');
  await visit('/employees', 'team');
  await visit('/portal', 'portal');
  await visit('/portal/disclosures', 'portal-disclosures');
  await visit('/portal/training', 'portal-training');
  await visit('/portal/tools', 'portal-tools');
  await visit('/settings', 'settings');
  await visit('/documents', 'documents-old');
  await visit('/disclosures', 'disclosures-old');
  await visit('/consent', 'consent-old');

  await browser.close();

  // Write JSON results
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'results.json'), JSON.stringify(results, null, 2));

  // Summary
  const ok = results.filter(r => r.status === 'ok').length;
  const err = results.filter(r => r.status === 'error').length;
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total: ${results.length} | ✅ ${ok} | ❌ ${err}`);
}

run().catch(console.error);
