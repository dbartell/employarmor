#!/usr/bin/env node
/**
 * EmployArmor E2E Visual Journey
 * 
 * Connects to an existing Chrome via CDP (port 18800) instead of launching new Chrome.
 * This avoids OOM on 8GB machines where OpenClaw browser is already running.
 * 
 * Usage: node e2e/run-e2e.mjs [--cdp-port 18800] [--scenarios all|scan|auth|pages]
 * 
 * For sub-agent / cron usage:
 *   1. OpenClaw browser must be running (openclaw browser start)
 *   2. Script connects via CDP, opens new tabs, takes screenshots
 *   3. Uploads results to Confluence
 *   4. Cleans up tabs when done
 */

import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Config
const BASE_URL = process.env.E2E_BASE_URL || 'https://employarmor.vercel.app';
const CDP_PORT = parseInt(process.env.CDP_PORT || '18800');
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || path.join(PROJECT_ROOT, 'e2e-screenshots');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dgiggocsiyfhwtepjrgs.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TEST_EMAIL = process.env.E2E_EMAIL || 'test-e2e@employarmor.com';
const TEST_PASSWORD = process.env.E2E_PASSWORD || 'TestE2E!2026';

// Parse args
const args = process.argv.slice(2);
const scenario = args.includes('--scenarios') ? args[args.indexOf('--scenarios') + 1] : 'all';

// Ensure screenshot dir
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let stepNum = 0;
const results = [];

async function snap(page, name, description) {
  stepNum++;
  const filename = `${String(stepNum).padStart(2, '0')}-${name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false, timeout: 10000 });
  const size = fs.statSync(filepath).size;
  results.push({ step: stepNum, name, filename, description, url: page.url(), size });
  console.log(`📸 ${stepNum}. ${name} (${(size/1024).toFixed(0)}KB) — ${page.url()}`);
  return filepath;
}

async function connectBrowser() {
  // Try connecting to existing CDP
  try {
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`, { timeout: 5000 });
    console.log(`✅ Connected to existing Chrome on port ${CDP_PORT}`);
    return { browser, launched: false };
  } catch (e) {
    console.log(`⚠️  No Chrome on port ${CDP_PORT}, launching headless...`);
    // Fallback: launch headless with minimal memory
    const browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--no-sandbox',
        '--single-process',  // Critical for low-memory
        '--disable-setuid-sandbox',
        '--js-flags=--max-old-space-size=256',
      ]
    });
    console.log('✅ Launched headless Chrome');
    return { browser, launched: true };
  }
}

async function loginViaSupabase(context) {
  // Login via Supabase API and set cookies directly
  console.log('🔐 Authenticating via Supabase API...');
  
  const page = await context.newPage();
  
  // Use Supabase REST API to get tokens
  const loginResp = await page.evaluate(async ({ url, key, email, password }) => {
    const resp = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return resp.json();
  }, { url: SUPABASE_URL, key: SUPABASE_ANON_KEY, email: TEST_EMAIL, password: TEST_PASSWORD });

  if (!loginResp.access_token) {
    console.error('❌ Login failed:', loginResp.error_description || loginResp.message);
    await page.close();
    return null;
  }

  // Set the auth cookie that Supabase SSR expects
  const cookieValue = JSON.stringify({
    access_token: loginResp.access_token,
    refresh_token: loginResp.refresh_token,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now()/1000) + 3600
  });

  const domain = new URL(BASE_URL).hostname;
  await context.addCookies([{
    name: 'sb-dgiggocsiyfhwtepjrgs-auth-token',
    value: cookieValue,
    domain: domain,
    path: '/',
    httpOnly: false,
    secure: true,
    sameSite: 'Lax'
  }]);

  console.log(`✅ Authenticated as ${TEST_EMAIL}`);
  await page.close();
  return loginResp;
}

// ============ SCENARIOS ============

async function scenarioScan(context) {
  console.log('\n🔍 === SCAN SCENARIO ===');
  const page = await context.newPage();
  page.setDefaultTimeout(12000);

  try {
    // Homepage
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await snap(page, 'homepage', 'Marketing homepage');

    // Go to scan
    await page.goto(`${BASE_URL}/scan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'scan-states', 'Scan step 1: State selection');

    // Select states
    const states = ['IL', 'CA', 'CO'];
    for (const st of states) {
      const btn = page.locator(`button:has-text("${st}")`).first();
      if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(200);
      }
    }
    await snap(page, 'scan-states-selected', `States selected: ${states.join(', ')}`);

    // Click Continue
    const cont1 = page.locator('button:has-text("Continue")').first();
    if (await cont1.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cont1.click();
      await page.waitForTimeout(800);
    }
    await snap(page, 'scan-employees', 'Scan step 2: Employee count');

    // Select 51-100
    const empBtn = page.locator('button:has-text("51-100")').first();
    if (await empBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await empBtn.click();
      await page.waitForTimeout(500);
    }
    await snap(page, 'scan-employees-selected', 'Selected 51-100 employees');

    // Continue to tools
    const cont2 = page.locator('button:has-text("Continue")').first();
    if (await cont2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cont2.click();
      await page.waitForTimeout(800);
    }
    await snap(page, 'scan-tools', 'Scan step 3: Tool selection');

    // Check if tool buttons rendered
    const toolButtons = await page.locator('.grid button').count();
    if (toolButtons === 0) {
      results[results.length - 1].bug = 'BUG: Tool grid is empty — no tool buttons rendered';
      console.log('🐛 BUG: Tool grid empty');
    } else {
      console.log(`   ${toolButtons} tool buttons found`);
      // Select some tools
      const toolsToSelect = ['LinkedIn Recruiter', 'HireVue', 'Greenhouse'];
      for (const toolName of toolsToSelect) {
        const toolBtn = page.locator(`button:has-text("${toolName}")`).first();
        if (await toolBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await toolBtn.click();
          await page.waitForTimeout(200);
        }
      }
      await snap(page, 'scan-tools-selected', `Selected tools: ${toolsToSelect.join(', ')}`);
    }

    // Continue to email
    const cont3 = page.locator('button:has-text("Continue")').first();
    if (await cont3.isEnabled({ timeout: 3000 }).catch(() => false)) {
      await cont3.click();
      await page.waitForTimeout(800);
    } else {
      console.log('⚠️  Continue button disabled (no tools selected or bug)');
    }
    await snap(page, 'scan-email', 'Scan step 4: Email capture');

    // Fill email
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailInput.fill('e2e-test@example.com');
      await page.waitForTimeout(300);
    }
    await snap(page, 'scan-email-filled', 'Email entered');

    // Submit
    const submitBtn = page.locator('button[type="submit"], button:has-text("Get"), button:has-text("See")').first();
    if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
    await snap(page, 'scan-results', 'Scan results');

  } catch (err) {
    console.error('Scan scenario error:', err.message);
    await snap(page, 'scan-error', `Error: ${err.message}`).catch(() => {});
  } finally {
    await page.close();
  }
}

async function scenarioAuth(context) {
  console.log('\n🔐 === AUTH SCENARIO ===');
  const page = await context.newPage();
  page.setDefaultTimeout(12000);

  try {
    // Login page
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'login-page', 'Login page');

    // Fill credentials
    await page.locator('input[type="email"], input[placeholder*="email"]').first().fill(TEST_EMAIL);
    await page.locator('input[type="password"]').first().fill(TEST_PASSWORD);
    await page.waitForTimeout(300);
    await snap(page, 'login-filled', 'Login credentials entered');

    // Submit
    await page.locator('button:has-text("Sign in"), button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
    await snap(page, 'post-login', `After login — landed on ${page.url()}`);

    if (page.url().includes('/dashboard')) {
      console.log('✅ Login successful — landed on dashboard');
    } else {
      console.log(`⚠️  After login, URL is: ${page.url()}`);
    }

  } catch (err) {
    console.error('Auth scenario error:', err.message);
    await snap(page, 'auth-error', `Error: ${err.message}`).catch(() => {});
  } finally {
    await page.close();
  }
}

async function scenarioPages(context) {
  console.log('\n📄 === AUTHENTICATED PAGES SCENARIO ===');
  
  // Login via API cookies
  await loginViaSupabase(context);

  const pages = [
    ['/dashboard', 'Dashboard — compliance agent overview'],
    ['/employees', 'Team — employee management'],
    ['/tools', 'Tool Registry — tracked AI tools'],
    ['/approvals', 'Approvals — tool request workflow'],
    ['/audit', 'Risk Assessment'],
    ['/candidate-notices', 'Candidate Disclosure Notices'],
    ['/employee-disclosures', 'Employee Disclosures'],
    ['/handbook', 'Handbook Policy'],
    ['/training', 'Team Training'],
    ['/compliance-packet', 'Audit Packet'],
    ['/settings', 'Organization Settings'],
  ];

  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  for (const [route, desc] of pages) {
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const pageName = route.slice(1).replace(/\//g, '-') || 'home';
      
      // Check for errors
      const html = await page.content();
      const hasError = html.includes('digest') || html.includes('Internal Server Error');
      const isRedirect = page.url().includes('/login');
      
      if (hasError) {
        await snap(page, `page-${pageName}-ERROR`, `${desc} — SERVER ERROR`);
        console.log(`💥 ${route} — server error`);
      } else if (isRedirect) {
        await snap(page, `page-${pageName}-NOAUTH`, `${desc} — auth redirect`);
        console.log(`🔒 ${route} — auth failed`);
      } else {
        await snap(page, `page-${pageName}`, desc);
        console.log(`✅ ${route}`);
      }
    } catch (err) {
      console.error(`❌ ${route}: ${err.message}`);
    }
  }

  await page.close();
}

// ============ MAIN ============

async function main() {
  console.log(`🚀 EmployArmor E2E Journey`);
  console.log(`   URL: ${BASE_URL}`);
  console.log(`   Scenario: ${scenario}`);
  console.log(`   Screenshots: ${SCREENSHOT_DIR}`);
  console.log('');

  // Clean old screenshots
  const oldFiles = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  oldFiles.forEach(f => fs.unlinkSync(path.join(SCREENSHOT_DIR, f)));

  const { browser, launched } = await connectBrowser();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  try {
    if (scenario === 'all' || scenario === 'scan') await scenarioScan(context);
    if (scenario === 'all' || scenario === 'auth') await scenarioAuth(context);
    if (scenario === 'all' || scenario === 'pages') await scenarioPages(context);

    // Write results JSON
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      scenario,
      totalScreenshots: results.length,
      bugs: results.filter(r => r.bug).map(r => r.bug),
      errors: results.filter(r => r.name.includes('error') || r.name.includes('ERROR')),
      results,
    };
    fs.writeFileSync(path.join(SCREENSHOT_DIR, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`\n📊 Report: ${SCREENSHOT_DIR}/report.json`);
    console.log(`📸 Total screenshots: ${results.length}`);
    if (report.bugs.length) console.log(`🐛 Bugs: ${report.bugs.join(', ')}`);

    // Upload to Confluence if configured
    if (process.env.CONFLUENCE_UPLOAD !== 'false') {
      await uploadToConfluence(report);
    }

  } finally {
    await context.close();
    if (launched) await browser.close();
  }
}

// ============ CONFLUENCE UPLOAD ============

async function uploadToConfluence(report) {
  const CONFLUENCE_URL = 'https://devynbartell.atlassian.net/wiki';
  const CONFLUENCE_EMAIL = 'bartelldevyn@gmail.com';

  // Read token from mcporter config
  let CONFLUENCE_TOKEN;
  try {
    const mcpConfig = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.mcporter/mcporter.json'), 'utf8'));
    CONFLUENCE_TOKEN = mcpConfig.mcpServers.atlassian.env.CONFLUENCE_API_TOKEN;
  } catch {
    console.log('⚠️  No Confluence token found, skipping upload');
    return;
  }

  const auth = Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_TOKEN}`).toString('base64');
  const headers = { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' };
  const date = new Date().toISOString().slice(0, 10);
  const time = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Denver', hour12: false });

  // Build page HTML
  const screenshotRows = report.results.map(r => {
    const bugTag = r.bug ? `<ac:structured-macro ac:name="warning"><ac:rich-text-body><p>${r.bug}</p></ac:rich-text-body></ac:structured-macro>` : '';
    return `<h3>${r.step}. ${r.description || r.name}</h3>
${bugTag}
<p><small>${r.url} — ${(r.size/1024).toFixed(0)}KB</small></p>
<p><ac:image ac:width="800"><ri:attachment ri:filename="${r.filename}"/></ac:image></p>`;
  }).join('\n');

  const bugsSection = report.bugs.length > 0
    ? `<h2>🐛 Bugs Found</h2><ul>${report.bugs.map(b => `<li>${b}</li>`).join('')}</ul>`
    : '<h2>✅ No Bugs Found</h2>';

  const passCount = report.results.filter(r => !r.bug && !r.name.includes('error')).length;
  const failCount = report.results.length - passCount;

  const body = `<h1>EmployArmor E2E Report — ${date} ${time} MST</h1>
<p><strong>URL:</strong> ${report.baseUrl} | <strong>Scenario:</strong> ${report.scenario} | <strong>Screenshots:</strong> ${report.totalScreenshots} | <strong>Pass:</strong> ${passCount} | <strong>Fail:</strong> ${failCount}</p>
<hr/>
${bugsSection}
<hr/>
${screenshotRows}`;

  const title = `EmployArmor E2E — ${date} ${time}`;

  console.log('\n📤 Uploading to Confluence...');

  try {
    // Create page
    const createResp = await fetch(`${CONFLUENCE_URL}/rest/api/content`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: 'page',
        title,
        space: { key: 'SD' },
        body: { storage: { value: body, representation: 'storage' } }
      })
    });
    const pageData = await createResp.json();
    const pageId = pageData.id;

    if (!pageId) {
      console.error('❌ Failed to create Confluence page:', pageData.message);
      return;
    }

    console.log(`✅ Page created: ${CONFLUENCE_URL.replace('/wiki', '')}/wiki/spaces/SD/pages/${pageId}`);

    // Upload screenshots as attachments
    for (const r of report.results) {
      const filepath = path.join(SCREENSHOT_DIR, r.filename);
      if (!fs.existsSync(filepath)) continue;

      const formData = new FormData();
      const fileBlob = new Blob([fs.readFileSync(filepath)], { type: 'image/png' });
      formData.append('file', fileBlob, r.filename);

      const attachResp = await fetch(`${CONFLUENCE_URL}/rest/api/content/${pageId}/child/attachment`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'X-Atlassian-Token': 'nocheck'
        },
        body: formData
      });

      if (attachResp.ok) {
        console.log(`   📎 ${r.filename}`);
      } else {
        console.log(`   ❌ ${r.filename}: ${attachResp.status}`);
      }
    }

    console.log(`\n🔗 ${CONFLUENCE_URL.replace('/wiki', '')}/wiki/spaces/SD/pages/${pageId}`);
  } catch (err) {
    console.error('Confluence upload error:', err.message);
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
