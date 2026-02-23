#!/usr/bin/env node
/**
 * EmployArmor Comprehensive E2E Test Suite
 * 
 * Covers the full workflow of a real company doing maximum compliance:
 * - Admin onboarding & setup
 * - Compliance management (audits, notices, disclosures, packets)
 * - Employee portal (employee login, disclosures, training, tool requests)
 * - Candidate/public flow (homepage, scan, resources)
 * - Full tool governance cycle
 * 
 * Connects to existing Chrome via CDP (port 18800) to avoid OOM.
 * 
 * Usage: node e2e/run-e2e.mjs [options]
 * 
 * Options:
 *   --cdp-port <port>          CDP port (default: 18800)
 *   --scenarios <list>         Comma-separated: all|onboarding|compliance|portal|candidate|governance
 *   --base-url <url>           Base URL (default: env or https://employarmor.vercel.app)
 *   --visual-board             Create Confluence visual flow board (default: true)
 * 
 * Environment:
 *   E2E_BASE_URL              Base URL override
 *   CDP_PORT                  CDP port override
 *   SCREENSHOT_DIR            Screenshot directory (default: e2e-screenshots)
 *   CONFLUENCE_UPLOAD         Set to 'false' to skip Confluence upload
 */

import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ============ CONFIG ============

const BASE_URL = parseArgs().baseUrl || process.env.E2E_BASE_URL || 'https://employarmor.vercel.app';
const CDP_PORT = parseArgs().cdpPort || parseInt(process.env.CDP_PORT || '18800');
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || path.join(PROJECT_ROOT, 'e2e-screenshots');
const VISUAL_BOARD = parseArgs().visualBoard !== false;
const SCENARIOS_ARG = parseArgs().scenarios || 'all';

// Supabase config
const envPath = path.join(PROJECT_ROOT, '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [key, ...valueParts] = line.split('=');
      return [key, valueParts.join('=').replace(/^"(.*)"$/, '$1')];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Test accounts
const ADMIN_EMAIL = 'test-e2e@employarmor.com';
const ADMIN_PASSWORD = 'TestE2E!2026';
const EMPLOYEE_EMAIL = 'test-employee@employarmor.com';
const EMPLOYEE_PASSWORD = 'TestEmployee!2026';

// State
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
let stepNum = 0;
const results = [];

// ============ HELPERS ============

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cdp-port' && args[i + 1]) {
      parsed.cdpPort = parseInt(args[++i]);
    } else if (args[i] === '--base-url' && args[i + 1]) {
      parsed.baseUrl = args[++i];
    } else if (args[i] === '--scenarios' && args[i + 1]) {
      parsed.scenarios = args[++i];
    } else if (args[i] === '--visual-board') {
      parsed.visualBoard = true;
    } else if (args[i] === '--no-visual-board') {
      parsed.visualBoard = false;
    }
  }
  
  return parsed;
}

async function snap(page, name, description, scenario) {
  stepNum++;
  const filename = `${String(stepNum).padStart(3, '0')}-${scenario}-${name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  
  try {
    await page.screenshot({ path: filepath, fullPage: false, timeout: 10000 });
    const size = fs.statSync(filepath).size;
    results.push({ 
      step: stepNum, 
      name, 
      filename, 
      description, 
      scenario,
      url: page.url(), 
      size 
    });
    console.log(`📸 ${stepNum}. [${scenario}] ${name} (${(size/1024).toFixed(0)}KB) — ${page.url()}`);
    return filepath;
  } catch (err) {
    console.error(`   ❌ Screenshot failed: ${err.message}`);
    results.push({
      step: stepNum,
      name,
      filename,
      description,
      scenario,
      url: page.url(),
      size: 0,
      error: err.message
    });
  }
}

async function connectBrowser() {
  try {
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`, { timeout: 5000 });
    console.log(`✅ Connected to existing Chrome on port ${CDP_PORT}`);
    return { browser, launched: false };
  } catch (e) {
    console.log(`⚠️  No Chrome on port ${CDP_PORT}, launching headless...`);
    const browser = await chromium.launch({
      channel: 'chrome',
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--no-sandbox',
        '--single-process',
        '--disable-setuid-sandbox',
        '--js-flags=--max-old-space-size=256',
      ]
    });
    console.log('✅ Launched headless Chrome');
    return { browser, launched: true };
  }
}

async function loginViaSupabase(context, email, password) {
  console.log(`🔐 Authenticating as ${email}...`);
  
  const page = await context.newPage();
  
  const loginResp = await page.evaluate(async ({ url, key, email, password }) => {
    const resp = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return resp.json();
  }, { url: SUPABASE_URL, key: SUPABASE_ANON_KEY, email, password });

  if (!loginResp.access_token) {
    console.error(`❌ Login failed for ${email}:`, loginResp.error_description || loginResp.message);
    await page.close();
    return null;
  }

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

  console.log(`✅ Authenticated as ${email}`);
  await page.close();
  return loginResp;
}

async function logout(context) {
  const domain = new URL(BASE_URL).hostname;
  await context.clearCookies({ domain });
  console.log('🚪 Logged out');
}

// ============ SCENARIOS ============

/**
 * Scenario 1: Admin Onboarding & Setup
 * Journey: New admin logs in, explores dashboard and core admin pages
 */
async function scenarioOnboarding(context) {
  console.log('\n🎯 === SCENARIO 1: ADMIN ONBOARDING & SETUP ===');
  const scenario = 'onboarding';
  
  await loginViaSupabase(context, ADMIN_EMAIL, ADMIN_PASSWORD);
  const page = await context.newPage();
  page.setDefaultTimeout(12000);

  try {
    // Dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await snap(page, 'dashboard', 'Admin dashboard with compliance score', scenario);

    // Employees page
    await page.goto(`${BASE_URL}/employees`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'employees', 'Employee management page', scenario);

    // Tools page
    await page.goto(`${BASE_URL}/tools`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'tools', 'AI tool catalog', scenario);

    // Approvals page
    await page.goto(`${BASE_URL}/approvals`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'approvals', 'Tool approval queue', scenario);

    // Settings page
    await page.goto(`${BASE_URL}/settings`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'settings', 'Organization settings', scenario);

  } finally {
    await page.close();
  }
}

/**
 * Scenario 2: Compliance Management
 * Journey: Admin manages all compliance aspects (audits, notices, disclosures, packets)
 */
async function scenarioCompliance(context) {
  console.log('\n📋 === SCENARIO 2: COMPLIANCE MANAGEMENT ===');
  const scenario = 'compliance';
  
  await loginViaSupabase(context, ADMIN_EMAIL, ADMIN_PASSWORD);
  const page = await context.newPage();
  page.setDefaultTimeout(12000);

  try {
    // Bias audit page
    await page.goto(`${BASE_URL}/audit`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await snap(page, 'audit', 'Bias impact audit page', scenario);

    // Candidate notices
    await page.goto(`${BASE_URL}/candidate-notices`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'candidate-notices', 'Candidate notice management', scenario);

    // Employee disclosures
    await page.goto(`${BASE_URL}/employee-disclosures`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'employee-disclosures', 'Employee disclosure management', scenario);

    // Compliance packet
    await page.goto(`${BASE_URL}/compliance-packet`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'compliance-packet', 'Complete compliance packet', scenario);

    // Handbook
    await page.goto(`${BASE_URL}/handbook`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'handbook', 'AI policy handbook', scenario);

    // Training management
    await page.goto(`${BASE_URL}/training`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'training', 'Training module management', scenario);

  } finally {
    await page.close();
  }
}

/**
 * Scenario 3: Employee Portal
 * Journey: Employee logs in, views dashboard, completes disclosures, accesses training, requests tool
 */
async function scenarioPortal(context) {
  console.log('\n👤 === SCENARIO 3: EMPLOYEE PORTAL ===');
  const scenario = 'portal';
  
  await logout(context);
  await loginViaSupabase(context, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  const page = await context.newPage();
  page.setDefaultTimeout(12000);

  try {
    // Employee dashboard
    await page.goto(`${BASE_URL}/portal`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await snap(page, 'dashboard', 'Employee portal dashboard', scenario);

    // Disclosures
    await page.goto(`${BASE_URL}/portal/disclosures`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'disclosures', 'Pending disclosure acknowledgments', scenario);

    // Training
    await page.goto(`${BASE_URL}/portal/training`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'training', 'Assigned training courses', scenario);

    // Tool request form
    await page.goto(`${BASE_URL}/portal/tools`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'tool-request', 'AI tool request form', scenario);

  } finally {
    await page.close();
  }
}

/**
 * Scenario 4: Candidate/Public Flow
 * Journey: Public visitor explores site, runs compliance scan, views resources
 */
async function scenarioCandidate(context) {
  console.log('\n🌍 === SCENARIO 4: CANDIDATE/PUBLIC FLOW ===');
  const scenario = 'candidate';
  
  await logout(context);
  const page = await context.newPage();
  page.setDefaultTimeout(12000);

  try {
    // Homepage
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await snap(page, 'homepage', 'Marketing homepage', scenario);

    // Scan flow - step 1: states
    await page.goto(`${BASE_URL}/scan`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'scan-states', 'Compliance scan: state selection', scenario);

    // Select states
    const states = ['IL', 'CA', 'CO'];
    for (const st of states) {
      const btn = page.locator(`button:has-text("${st}")`).first();
      if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(200);
      }
    }
    await snap(page, 'scan-states-selected', `States selected: ${states.join(', ')}`, scenario);

    // Continue to employees
    const cont1 = page.locator('button:has-text("Continue")').first();
    if (await cont1.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cont1.click();
      await page.waitForTimeout(800);
    }
    await snap(page, 'scan-employees', 'Compliance scan: employee count', scenario);

    // Select employee count
    const empBtn = page.locator('button:has-text("51-100")').first();
    if (await empBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await empBtn.click();
      await page.waitForTimeout(500);
    }
    await snap(page, 'scan-employees-selected', 'Selected 51-100 employees', scenario);

    // Continue to tools
    const cont2 = page.locator('button:has-text("Continue")').first();
    if (await cont2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cont2.click();
      await page.waitForTimeout(800);
    }
    await snap(page, 'scan-tools', 'Compliance scan: AI tool selection', scenario);

    // Select some tools if available
    const toolCount = await page.locator('.grid button').count();
    if (toolCount > 0) {
      const toolsToSelect = ['LinkedIn Recruiter', 'HireVue', 'Greenhouse'];
      for (const toolName of toolsToSelect) {
        const toolBtn = page.locator(`button:has-text("${toolName}")`).first();
        if (await toolBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await toolBtn.click();
          await page.waitForTimeout(200);
        }
      }
      await snap(page, 'scan-tools-selected', `Selected tools: ${toolsToSelect.join(', ')}`, scenario);

      // Submit to see results
      const submitBtn = page.locator('button:has-text("Submit")').or(page.locator('button:has-text("Get Your Report")')).first();
      if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }
      await snap(page, 'scan-results', 'Compliance scan results', scenario);
    } else {
      results[results.length - 1].bug = 'BUG: Tool grid is empty — no tool buttons rendered';
      console.log('🐛 BUG: Tool grid empty');
    }

    // Resources hub
    await page.goto(`${BASE_URL}/resources`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'resources', 'Resource hub for compliance education', scenario);

    // Compliance hub
    await page.goto(`${BASE_URL}/compliance`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'compliance-hub', 'Compliance information hub', scenario);

  } finally {
    await page.close();
  }
}

/**
 * Scenario 5: Full Tool Governance Cycle
 * Journey: Employee requests tool → Admin reviews → Approval workflow
 */
async function scenarioGovernance(context) {
  console.log('\n⚙️ === SCENARIO 5: TOOL GOVERNANCE CYCLE ===');
  const scenario = 'governance';
  
  // Employee side: request a tool
  await logout(context);
  await loginViaSupabase(context, EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  let page = await context.newPage();
  page.setDefaultTimeout(12000);

  try {
    // Go to tool request form
    await page.goto(`${BASE_URL}/portal/tools`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'employee-tool-form', 'Employee: AI tool request form', scenario);

    // Try to fill and submit a request (if form elements are present)
    const toolNameInput = page.locator('input[name="tool_name"]').or(page.locator('input[placeholder*="tool"]')).first();
    if (await toolNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toolNameInput.fill('Claude AI');
      await page.waitForTimeout(300);
      
      const useCaseInput = page.locator('textarea[name="use_case"]').or(page.locator('textarea')).first();
      if (await useCaseInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await useCaseInput.fill('Code review and technical documentation assistance');
        await page.waitForTimeout(300);
      }
      
      await snap(page, 'employee-tool-filled', 'Employee: Tool request form filled', scenario);
      
      // Try to submit
      const submitBtn = page.locator('button[type="submit"]').or(page.locator('button:has-text("Submit")')).first();
      if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitBtn.click();
        await page.waitForTimeout(1500);
        await snap(page, 'employee-tool-submitted', 'Employee: Tool request submitted', scenario);
      }
    } else {
      console.log('   ℹ️  Tool request form elements not found (may be protected or different structure)');
    }

    await page.close();

    // Admin side: review tools and approvals
    await logout(context);
    await loginViaSupabase(context, ADMIN_EMAIL, ADMIN_PASSWORD);
    page = await context.newPage();
    page.setDefaultTimeout(12000);

    // View all tools
    await page.goto(`${BASE_URL}/tools`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'admin-tools-catalog', 'Admin: Full tool catalog', scenario);

    // View pending approvals
    await page.goto(`${BASE_URL}/approvals`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await snap(page, 'admin-approvals-queue', 'Admin: Pending approval queue', scenario);

    // Check if there's an approve/deny UI element visible
    const approveBtn = page.locator('button:has-text("Approve")').first();
    const denyBtn = page.locator('button:has-text("Deny")').first();
    
    if (await approveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await snap(page, 'admin-approval-actions', 'Admin: Approval action buttons visible', scenario);
      console.log('   ✅ Approval workflow UI is functional');
    } else {
      console.log('   ℹ️  No pending approvals to review (expected if no requests were submitted)');
    }

  } finally {
    await page.close();
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

  let body;
  if (VISUAL_BOARD) {
    // Create visual flow board with grouped scenarios
    body = buildVisualFlowBoard(report, date, time);
  } else {
    // Standard linear report
    body = buildStandardReport(report, date, time);
  }

  const title = VISUAL_BOARD 
    ? `EmployArmor E2E Visual Flow — ${date}` 
    : `EmployArmor E2E Report — ${date} ${time}`;

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
      if (!r.filename) continue;
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

function buildVisualFlowBoard(report, date, time) {
  const scenarios = ['onboarding', 'compliance', 'portal', 'candidate', 'governance'];
  const scenarioTitles = {
    onboarding: '🎯 Admin Onboarding & Setup',
    compliance: '📋 Compliance Management',
    portal: '👤 Employee Portal',
    candidate: '🌍 Candidate/Public Flow',
    governance: '⚙️ Tool Governance Cycle'
  };

  const passCount = report.results.filter(r => !r.bug && !r.error).length;
  const failCount = report.results.length - passCount;
  const bugList = report.bugs.length > 0
    ? `<ac:structured-macro ac:name="warning"><ac:rich-text-body><p><strong>Bugs Found:</strong></p><ul>${report.bugs.map(b => `<li>${b}</li>`).join('')}</ul></ac:rich-text-body></ac:structured-macro>`
    : '<p><ac:structured-macro ac:name="info"><ac:rich-text-body><p>✅ No bugs found</p></ac:rich-text-body></ac:structured-macro></p>';

  let scenarioSections = '';
  
  for (const scenario of scenarios) {
    const steps = report.results.filter(r => r.scenario === scenario);
    if (steps.length === 0) continue;

    scenarioSections += `<h2>${scenarioTitles[scenario]}</h2>\n`;
    scenarioSections += '<div style="display: flex; flex-direction: column; gap: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">\n';
    
    for (let i = 0; i < steps.length; i++) {
      const r = steps[i];
      const bugTag = r.bug ? `<ac:structured-macro ac:name="warning"><ac:rich-text-body><p>${r.bug}</p></ac:rich-text-body></ac:structured-macro>` : '';
      const errorTag = r.error ? `<ac:structured-macro ac:name="error"><ac:rich-text-body><p>Error: ${r.error}</p></ac:rich-text-body></ac:structured-macro>` : '';
      
      scenarioSections += '<div style="padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #0052CC;">\n';
      scenarioSections += `<h4 style="margin-top: 0;">Step ${r.step}: ${r.description || r.name}</h4>\n`;
      scenarioSections += `<p><small><code>${r.url}</code> — ${(r.size/1024).toFixed(0)}KB</small></p>\n`;
      if (bugTag) scenarioSections += bugTag + '\n';
      if (errorTag) scenarioSections += errorTag + '\n';
      if (r.filename) {
        scenarioSections += `<p><ac:image ac:width="700"><ri:attachment ri:filename="${r.filename}"/></ac:image></p>\n`;
      }
      scenarioSections += '</div>\n';
      
      // Add flow arrow between steps (except last)
      if (i < steps.length - 1) {
        scenarioSections += '<div style="text-align: center; font-size: 24px; color: #0052CC;">↓</div>\n';
      }
    }
    
    scenarioSections += '</div>\n\n';
  }

  return `<h1>EmployArmor E2E Visual Flow — ${date}</h1>
<p><strong>Run Time:</strong> ${time} MST | <strong>Base URL:</strong> ${report.baseUrl}</p>
<p><strong>Scenarios:</strong> ${report.scenariosRun.join(', ')} | <strong>Screenshots:</strong> ${report.totalScreenshots} | <strong>Pass:</strong> <ac:structured-macro ac:name="status"><ac:parameter ac:name="colour">Green</ac:parameter><ac:parameter ac:name="title">${passCount}</ac:parameter></ac:structured-macro> | <strong>Fail:</strong> <ac:structured-macro ac:name="status"><ac:parameter ac:name="colour">Red</ac:parameter><ac:parameter ac:name="title">${failCount}</ac:parameter></ac:structured-macro></p>
<hr/>
${bugList}
<hr/>
${scenarioSections}
<hr/>
<p><small>Generated by EmployArmor E2E Test Suite — ${new Date().toISOString()}</small></p>`;
}

function buildStandardReport(report, date, time) {
  const screenshotRows = report.results.map(r => {
    const bugTag = r.bug ? `<ac:structured-macro ac:name="warning"><ac:rich-text-body><p>${r.bug}</p></ac:rich-text-body></ac:structured-macro>` : '';
    const errorTag = r.error ? `<ac:structured-macro ac:name="error"><ac:rich-text-body><p>Error: ${r.error}</p></ac:rich-text-body></ac:structured-macro>` : '';
    return `<h3>${r.step}. [${r.scenario}] ${r.description || r.name}</h3>
${bugTag}${errorTag}
<p><small>${r.url} — ${(r.size/1024).toFixed(0)}KB</small></p>
<p><ac:image ac:width="800"><ri:attachment ri:filename="${r.filename}"/></ac:image></p>`;
  }).join('\n');

  const bugsSection = report.bugs.length > 0
    ? `<h2>🐛 Bugs Found</h2><ul>${report.bugs.map(b => `<li>${b}</li>`).join('')}</ul>`
    : '<h2>✅ No Bugs Found</h2>';

  const passCount = report.results.filter(r => !r.bug && !r.error).length;
  const failCount = report.results.length - passCount;

  return `<h1>EmployArmor E2E Report — ${date} ${time} MST</h1>
<p><strong>URL:</strong> ${report.baseUrl} | <strong>Scenarios:</strong> ${report.scenariosRun.join(', ')} | <strong>Screenshots:</strong> ${report.totalScreenshots} | <strong>Pass:</strong> ${passCount} | <strong>Fail:</strong> ${failCount}</p>
<hr/>
${bugsSection}
<hr/>
${screenshotRows}`;
}

// ============ MAIN ============

async function main() {
  console.log('🚀 EmployArmor Comprehensive E2E Test Suite\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`CDP Port: ${CDP_PORT}`);
  console.log(`Screenshots: ${SCREENSHOT_DIR}`);
  console.log(`Visual Board: ${VISUAL_BOARD ? 'Yes' : 'No'}`);
  console.log(`Scenarios: ${SCENARIOS_ARG}\n`);

  const { browser, launched } = await connectBrowser();
  const context = await browser.newContext({ 
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const scenariosToRun = SCENARIOS_ARG === 'all' 
    ? ['onboarding', 'compliance', 'portal', 'candidate', 'governance']
    : SCENARIOS_ARG.split(',').map(s => s.trim());

  try {
    for (const scenario of scenariosToRun) {
      switch (scenario) {
        case 'onboarding':
          await scenarioOnboarding(context);
          break;
        case 'compliance':
          await scenarioCompliance(context);
          break;
        case 'portal':
          await scenarioPortal(context);
          break;
        case 'candidate':
          await scenarioCandidate(context);
          break;
        case 'governance':
          await scenarioGovernance(context);
          break;
        default:
          console.log(`⚠️  Unknown scenario: ${scenario}`);
      }
    }

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      scenariosRun: scenariosToRun,
      totalScreenshots: results.length,
      bugs: results.filter(r => r.bug).map(r => r.bug),
      errors: results.filter(r => r.error).map(r => ({ step: r.step, error: r.error })),
      results,
    };
    
    const reportPath = path.join(SCREENSHOT_DIR, 'report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📊 Report: ${reportPath}`);
    console.log(`📸 Total screenshots: ${results.length}`);
    if (report.bugs.length) console.log(`🐛 Bugs: ${report.bugs.length}`);
    if (report.errors.length) console.log(`❌ Errors: ${report.errors.length}`);

    // Upload to Confluence
    if (process.env.CONFLUENCE_UPLOAD !== 'false') {
      await uploadToConfluence(report);
    }

  } finally {
    await context.close();
    if (launched) await browser.close();
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
