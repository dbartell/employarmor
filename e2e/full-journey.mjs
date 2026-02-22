#!/usr/bin/env node
/**
 * EmployArmor — Full Company E2E Journey
 * 
 * Simulates a complex hiring company going through the entire EmployArmor experience:
 * 
 * ACT 1: DISCOVERY
 *   1. Land on homepage
 *   2. Run compliance scan (multi-state, many tools)
 *   3. See risk results
 * 
 * ACT 2: ONBOARDING
 *   4. Sign up (or login to existing test account)
 *   5. Land on dashboard — see compliance agent overview
 *   6. Explore state compliance map
 * 
 * ACT 3: TOOL GOVERNANCE
 *   7. View Tool Registry (pre-populated from scan)
 *   8. Request a new tool (from employee portal perspective)
 *   9. View Approvals queue
 * 
 * ACT 4: COMPLIANCE DOCUMENTS
 *  10. Generate Candidate Disclosure Notice
 *  11. Create Public Disclosure Page
 *  12. Generate Handbook AI Policy
 *  13. View/export Compliance Packet (audit bundle)
 * 
 * ACT 5: EMPLOYEE MANAGEMENT
 *  14. Invite an employee
 *  15. View team page with new invite
 *  16. Send employee disclosure notification
 *  17. View Employee Disclosures dashboard
 * 
 * ACT 6: TRAINING & CERTIFICATION
 *  18. Start solo training ("Just me")
 *  19. View training content/sections
 *  20. Complete training section
 * 
 * ACT 7: RISK & AUDIT
 *  21. View Risk Assessment / Audit page
 *  22. View Remediation items
 *  23. View Compliance Packet (full audit bundle)
 * 
 * ACT 8: SETTINGS & CONFIG
 *  24. Organization settings
 *  25. Disclosure settings
 *  26. Training settings
 *  27. Integration settings
 */

import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const BASE_URL = process.env.E2E_BASE_URL || 'https://employarmor.vercel.app';
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || path.join(PROJECT_ROOT, 'e2e-screenshots');
const TEST_EMAIL = process.env.E2E_EMAIL || 'test-e2e@employarmor.com';
const TEST_PASSWORD = process.env.E2E_PASSWORD || 'TestE2E!2026';

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// Company profile for this simulation
const COMPANY = {
  name: 'Meridian Technologies',
  states: ['IL', 'CA', 'CO', 'NYC', 'MD', 'TX'],
  employeeCount: '100+',
  tools: [
    'LinkedIn Recruiter', 'HireVue', 'Greenhouse', 'Lever',
    'Workday Recruiting', 'Pymetrics', 'Textio', 'Paradox',
    'Indeed', 'ZipRecruiter', 'BambooHR', 'Rippling'
  ],
  newEmployee: {
    email: 'jane.doe@meridian-tech.test',
    role: 'manager',
    department: 'Engineering'
  },
  newToolRequest: {
    name: 'Claude AI Screener',
    url: 'https://claude.ai',
    useCase: 'Resume screening and candidate shortlisting using AI analysis',
    dataTypes: ['resumes', 'interview-notes']
  }
};

let stepNum = 0;
const results = [];
const bugs = [];

async function snap(page, name, description) {
  stepNum++;
  const filename = `${String(stepNum).padStart(2, '0')}-${name}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  try {
    await page.screenshot({ path: filepath, fullPage: false, timeout: 10000 });
    const size = fs.statSync(filepath).size;
    results.push({ step: stepNum, name, filename, description, url: page.url(), size });
    console.log(`  📸 ${stepNum}. ${description}`);
  } catch (err) {
    console.log(`  ⚠️  Screenshot failed: ${err.message}`);
    results.push({ step: stepNum, name, filename, description, url: page.url(), size: 0, error: err.message });
  }
}

function bug(msg) {
  bugs.push(msg);
  console.log(`  🐛 ${msg}`);
}

async function scrollSnap(page, name, description) {
  await snap(page, name, description);
  // Also capture scrolled view if page is long
  const height = await page.evaluate(() => document.body.scrollHeight);
  if (height > 1200) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await page.waitForTimeout(300);
    await snap(page, `${name}-scrolled`, `${description} (scrolled)`);
    await page.evaluate(() => window.scrollTo(0, 0));
  }
}

// ============ ACT 1: DISCOVERY ============

async function act1_discovery(page) {
  console.log('\n🌐 ACT 1: DISCOVERY');

  // Homepage
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await snap(page, 'homepage', 'Homepage — first impression');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
  await page.waitForTimeout(300);
  await snap(page, 'homepage-features', 'Homepage — features & integrations');

  // Navigate to scan
  await page.goto(`${BASE_URL}/scan`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await snap(page, 'scan-start', 'Compliance Scan — step 1: states');

  // Select multiple states (complex company)
  for (const state of COMPANY.states) {
    const btn = page.locator(`button:has-text("${state}")`).first();
    if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(150);
    }
  }
  await snap(page, 'scan-states-selected', `States selected: ${COMPANY.states.join(', ')}`);

  // Continue to employees
  await clickButton(page, 'Continue');
  await page.waitForTimeout(800);
  await snap(page, 'scan-employees', 'Step 2: Employee count');

  // Select 100+
  const empBtn = page.locator(`button:has-text("${COMPANY.employeeCount}")`).first();
  if (await empBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await empBtn.click();
    await page.waitForTimeout(500);
  }
  await snap(page, 'scan-employees-selected', `Selected: ${COMPANY.employeeCount} employees`);

  // Continue to tools
  await clickButton(page, 'Continue');
  await page.waitForTimeout(800);
  await snap(page, 'scan-tools', 'Step 3: AI tool selection');

  // Select many tools
  let selectedCount = 0;
  for (const tool of COMPANY.tools) {
    const toolBtn = page.locator(`button:has-text("${tool}")`).first();
    if (await toolBtn.isVisible({ timeout: 800 }).catch(() => false)) {
      await toolBtn.click();
      selectedCount++;
      await page.waitForTimeout(100);
    }
  }
  console.log(`  Selected ${selectedCount}/${COMPANY.tools.length} tools`);
  
  // Scroll to show all selected
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(300);
  await snap(page, 'scan-tools-selected', `${selectedCount} tools selected`);

  // Continue to email
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  await clickButton(page, 'Continue');
  await page.waitForTimeout(800);

  // Email step
  const emailInput = page.locator('input[type="email"]').first();
  if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emailInput.fill('cto@meridian-tech.com');
    await page.waitForTimeout(300);
  }
  await snap(page, 'scan-email', 'Step 4: Email capture');

  // Submit scan
  const submitBtn = page.locator('button[type="submit"], button:has-text("Get"), button:has-text("See"), button:has-text("Submit")').first();
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(3000);
  }
  await scrollSnap(page, 'scan-results', 'Compliance scan results');
}

// ============ ACT 2: ONBOARDING ============

async function act2_onboarding(page) {
  console.log('\n🔐 ACT 2: ONBOARDING');

  // Login
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await snap(page, 'login', 'Login page');

  await page.locator('input[type="email"]').first().fill(TEST_EMAIL);
  await page.locator('input[type="password"]').first().fill(TEST_PASSWORD);
  await page.waitForTimeout(300);
  await snap(page, 'login-filled', 'Credentials entered');

  await page.locator('button:has-text("Sign in"), button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  if (page.url().includes('/dashboard')) {
    console.log('  ✅ Login successful');
  } else {
    bug(`Login redirect: landed on ${page.url()} instead of /dashboard`);
  }

  await scrollSnap(page, 'dashboard', 'Dashboard — compliance agent overview');

  // Check state compliance
  await page.goto(`${BASE_URL}/states`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await snap(page, 'states-overview', 'State compliance overview');
}

// ============ ACT 3: TOOL GOVERNANCE ============

async function act3_tools(page) {
  console.log('\n🔧 ACT 3: TOOL GOVERNANCE');

  // Tool Registry
  await page.goto(`${BASE_URL}/tools`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'tool-registry', 'Tool Registry — tracked AI tools');

  // Request a new tool
  await page.goto(`${BASE_URL}/tools/request`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await snap(page, 'tool-request-form', 'New tool request form');

  // Fill tool request
  const nameInput = page.locator('input[name="toolName"], input[placeholder*="name" i], input[placeholder*="tool" i]').first();
  if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await nameInput.fill(COMPANY.newToolRequest.name);
  }
  const urlInput = page.locator('input[name="toolUrl"], input[placeholder*="url" i], input[type="url"]').first();
  if (await urlInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await urlInput.fill(COMPANY.newToolRequest.url);
  }
  const useCaseInput = page.locator('textarea, input[name="useCase"]').first();
  if (await useCaseInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await useCaseInput.fill(COMPANY.newToolRequest.useCase);
  }
  await page.waitForTimeout(300);
  await snap(page, 'tool-request-filled', 'Tool request filled — Claude AI Screener');

  // Submit (but don't actually submit to avoid test data pollution — just screenshot)
  // If we want to actually test submission:
  // await clickButton(page, 'Submit');
  // await page.waitForTimeout(2000);
  // await snap(page, 'tool-request-submitted', 'Tool request submitted');

  // Approvals
  await page.goto(`${BASE_URL}/approvals`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await snap(page, 'approvals', 'Approvals queue');
}

// ============ ACT 4: COMPLIANCE DOCUMENTS ============

async function act4_documents(page) {
  console.log('\n📄 ACT 4: COMPLIANCE DOCUMENTS');

  // Candidate Notices
  await page.goto(`${BASE_URL}/candidate-notices`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'candidate-notices', 'Candidate Disclosure Notices');

  // Try to generate a notice
  const generateBtn = page.locator('button:has-text("Generate")').first();
  if (await generateBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await generateBtn.click();
    await page.waitForTimeout(5000); // AI generation takes time
    await scrollSnap(page, 'notice-generated', 'Generated candidate disclosure notice');
  }

  // Create disclosure page
  const createPageBtn = page.locator('button:has-text("Create Disclosure Page"), button:has-text("Create")').first();
  if (await createPageBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await createPageBtn.click();
    await page.waitForTimeout(3000);
    await snap(page, 'disclosure-page-created', 'Public disclosure page created');
  }

  // Employee Disclosures
  await page.goto(`${BASE_URL}/employee-disclosures`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'employee-disclosures', 'Employee Disclosures dashboard');

  // Handbook Policy
  await page.goto(`${BASE_URL}/handbook`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await snap(page, 'handbook', 'Handbook AI Policy');

  // Generate policy
  const genPolicyBtn = page.locator('button:has-text("Generate Policy"), button:has-text("Generate")').first();
  if (await genPolicyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await genPolicyBtn.click();
    await page.waitForTimeout(8000); // AI generation
    await scrollSnap(page, 'handbook-generated', 'Generated AI use policy for handbook');
  }

  // Compliance Packet
  await page.goto(`${BASE_URL}/compliance-packet`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'compliance-packet', 'Audit-ready compliance packet');
}

// ============ ACT 5: EMPLOYEE MANAGEMENT ============

async function act5_employees(page) {
  console.log('\n👥 ACT 5: EMPLOYEE MANAGEMENT');

  // Team page
  await page.goto(`${BASE_URL}/employees`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await snap(page, 'team-before', 'Team page — before invite');

  // Click Invite Employee button
  const inviteBtn = page.locator('button:has-text("Invite")').first();
  if (await inviteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await inviteBtn.click();
    await page.waitForTimeout(1000);
    await snap(page, 'invite-dialog', 'Invite Employee dialog');

    // Fill invite form
    const emailField = page.locator('input[type="email"], input[placeholder*="email" i]').first();
    if (await emailField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailField.fill(COMPANY.newEmployee.email);
    }

    // Select role — inside dialog, use dialog scope
    const dialog = page.locator('[role="dialog"], .fixed.inset-0');
    const roleSelect = dialog.locator('select, [role="combobox"]').first();
    if (await roleSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
      await roleSelect.selectOption(COMPANY.newEmployee.role).catch(() => {});
    }
    // Try radio/button role selection
    const roleBtn = dialog.locator(`button:has-text("${COMPANY.newEmployee.role}"), label:has-text("${COMPANY.newEmployee.role}")`).first();
    if (await roleBtn.isVisible({ timeout: 500 }).catch(() => false)) {
      await roleBtn.click().catch(() => {});
    }

    // Department
    const deptField = dialog.locator('input[placeholder*="department" i], input[name="department"]').first();
    if (await deptField.isVisible({ timeout: 1000 }).catch(() => false)) {
      await deptField.fill(COMPANY.newEmployee.department);
    }

    await page.waitForTimeout(300);
    await snap(page, 'invite-filled', `Invite form filled — ${COMPANY.newEmployee.email}`);

    // Submit invite — click the submit button INSIDE the dialog
    const sendInviteBtn = dialog.locator('button[type="submit"], button:has-text("Send Invite"), button:has-text("Invite")').first();
    if (await sendInviteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sendInviteBtn.click();
      await page.waitForTimeout(3000);
      await snap(page, 'invite-sent', 'Invite sent — confirmation');
    }

    // Close dialog if still open
    const closeBtn = dialog.locator('button:has-text("Close"), button:has-text("Done"), [aria-label="Close"]').first();
    if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // Refresh team page to see invite
  await page.goto(`${BASE_URL}/employees`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await snap(page, 'team-after', 'Team page — after invite');

  // Send disclosure to employees
  await page.goto(`${BASE_URL}/employee-disclosures`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Look for Send All / Send button
  const sendAllBtn = page.locator('button:has-text("Send All"), button:has-text("Send Disclosure"), button:has-text("Notify")').first();
  if (await sendAllBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await snap(page, 'disclosure-send-ready', 'Ready to send employee disclosures');
    // Click to send
    await sendAllBtn.click();
    await page.waitForTimeout(3000);
    await snap(page, 'disclosure-sent', 'Employee disclosures sent');
  }
}

// ============ ACT 6: TRAINING ============

async function act6_training(page) {
  console.log('\n🎓 ACT 6: TRAINING & CERTIFICATION');

  // Training page
  await page.goto(`${BASE_URL}/training`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'training-overview', 'Training — AI Hiring Compliance Certification');

  // Start solo training
  const soloBtn = page.locator('button:has-text("Just me"), text="Just me"').first();
  if (await soloBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await soloBtn.click();
    await page.waitForTimeout(1000);
  }

  // Look for start button
  const startBtn = page.locator('button:has-text("Start"), button:has-text("Begin"), a:has-text("Start")').first();
  if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await snap(page, 'training-start-ready', 'Ready to start training');
    await startBtn.click();
    await page.waitForTimeout(3000);
    await scrollSnap(page, 'training-content', 'Training content / first section');
  }

  // Try navigating to a training section directly
  await page.goto(`${BASE_URL}/training/ai-compliance/understanding-ai-laws`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(2000);
  if (!page.url().includes('/login')) {
    await scrollSnap(page, 'training-section', 'Training section — Understanding AI Laws');
  }

  // Settings > Training 
  await page.goto(`${BASE_URL}/settings/training`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await snap(page, 'settings-training', 'Training settings & assignments');
}

// ============ ACT 7: RISK & AUDIT ============

async function act7_audit(page) {
  console.log('\n🛡️ ACT 7: RISK & AUDIT');

  // Risk Assessment
  await page.goto(`${BASE_URL}/audit`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'risk-assessment', 'Risk Assessment overview');

  // Remediation
  await page.goto(`${BASE_URL}/audit/remediation`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'remediation', 'Remediation items');

  // Documents / Impact Assessment
  await page.goto(`${BASE_URL}/documents/impact-assessment`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'impact-assessment', 'AI Impact Assessment');

  // Full compliance packet
  await page.goto(`${BASE_URL}/compliance-packet`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await scrollSnap(page, 'audit-packet', 'Complete audit packet');
}

// ============ ACT 8: SETTINGS ============

async function act8_settings(page) {
  console.log('\n⚙️ ACT 8: SETTINGS & CONFIGURATION');

  const settingsPages = [
    ['/settings', 'Organization Settings'],
    ['/settings/disclosure', 'Disclosure Settings — customize notices'],
    ['/settings/integrations', 'Integration Settings — ATS/HRIS connections'],
    ['/settings/adverse-decisions', 'Adverse Decision Settings'],
    ['/settings/employees', 'Employee Management Settings'],
  ];

  for (const [route, desc] of settingsPages) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await scrollSnap(page, `settings-${route.split('/').pop()}`, desc);
  }
}

// ============ HELPERS ============

async function clickButton(page, text) {
  const btn = page.locator(`button:has-text("${text}")`).first();
  if (await btn.isEnabled({ timeout: 3000 }).catch(() => false)) {
    await btn.click();
  }
}

// ============ CONFLUENCE UPLOAD ============

async function uploadToConfluence(report) {
  const CONFLUENCE_URL = 'https://devynbartell.atlassian.net/wiki';
  const CONFLUENCE_EMAIL = 'bartelldevyn@gmail.com';

  let CONFLUENCE_TOKEN;
  try {
    const mcpConfig = JSON.parse(fs.readFileSync(path.join(process.env.HOME, '.mcporter/mcporter.json'), 'utf8'));
    CONFLUENCE_TOKEN = mcpConfig.mcpServers.atlassian.env.CONFLUENCE_API_TOKEN;
  } catch {
    console.log('⚠️  No Confluence token, skipping upload');
    return null;
  }

  const auth = Buffer.from(`${CONFLUENCE_EMAIL}:${CONFLUENCE_TOKEN}`).toString('base64');
  const headers = { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' };
  const date = new Date().toISOString().slice(0, 10);
  const time = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Denver', hour12: false });

  // Group results by act
  const acts = {};
  let currentAct = 'Setup';
  for (const r of report.results) {
    if (r.description.includes('Homepage')) currentAct = 'Act 1: Discovery';
    if (r.description.includes('Login')) currentAct = 'Act 2: Onboarding';
    if (r.description.includes('Tool Registry')) currentAct = 'Act 3: Tool Governance';
    if (r.description.includes('Candidate')) currentAct = 'Act 4: Compliance Documents';
    if (r.description.includes('Team') || r.description.includes('Invite')) currentAct = 'Act 5: Employee Management';
    if (r.description.includes('Training')) currentAct = 'Act 6: Training';
    if (r.description.includes('Risk') || r.description.includes('Audit') || r.description.includes('Remediation')) currentAct = 'Act 7: Risk & Audit';
    if (r.description.includes('Settings') || r.description.includes('Disclosure Settings')) currentAct = 'Act 8: Settings';
    if (!acts[currentAct]) acts[currentAct] = [];
    acts[currentAct].push(r);
  }

  let screenshotHtml = '';
  for (const [actName, items] of Object.entries(acts)) {
    screenshotHtml += `<h2>${actName}</h2>\n`;
    for (const r of items) {
      const bugTag = r.bug ? `<ac:structured-macro ac:name="warning"><ac:rich-text-body><p>🐛 ${r.bug}</p></ac:rich-text-body></ac:structured-macro>` : '';
      screenshotHtml += `<h3>${r.step}. ${r.description}</h3>\n${bugTag}\n<p><small>${r.url}</small></p>\n<p><ac:image ac:width="800"><ri:attachment ri:filename="${r.filename}"/></ac:image></p>\n`;
    }
  }

  const bugsHtml = report.bugs.length > 0
    ? `<ac:structured-macro ac:name="warning"><ac:rich-text-body><h2>Bugs Found (${report.bugs.length})</h2><ul>${report.bugs.map(b => `<li>${b}</li>`).join('')}</ul></ac:rich-text-body></ac:structured-macro>`
    : '<ac:structured-macro ac:name="info"><ac:rich-text-body><p>✅ No bugs found</p></ac:rich-text-body></ac:structured-macro>';

  const body = `<h1>EmployArmor Full Journey — ${COMPANY.name}</h1>
<p><strong>Date:</strong> ${date} ${time} MST | <strong>Company:</strong> ${COMPANY.name} | <strong>States:</strong> ${COMPANY.states.join(', ')} | <strong>Tools:</strong> ${COMPANY.tools.length} | <strong>Screenshots:</strong> ${report.totalScreenshots}</p>
<hr/>
${bugsHtml}
<hr/>
${screenshotHtml}`;

  const title = `EmployArmor Full Journey — ${COMPANY.name} — ${date} ${time}`;

  console.log('\n📤 Uploading to Confluence...');
  try {
    const createResp = await fetch(`${CONFLUENCE_URL}/rest/api/content`, {
      method: 'POST', headers,
      body: JSON.stringify({ type: 'page', title, space: { key: 'SD' }, body: { storage: { value: body, representation: 'storage' } } })
    });
    const pageData = await createResp.json();
    const pageId = pageData.id;
    if (!pageId) { console.error('❌ Page creation failed:', pageData.message); return null; }

    console.log(`✅ Page: https://devynbartell.atlassian.net/wiki/spaces/SD/pages/${pageId}`);

    for (const r of report.results) {
      const filepath = path.join(SCREENSHOT_DIR, r.filename);
      if (!fs.existsSync(filepath)) continue;
      const formData = new FormData();
      formData.append('file', new Blob([fs.readFileSync(filepath)], { type: 'image/png' }), r.filename);
      const resp = await fetch(`${CONFLUENCE_URL}/rest/api/content/${pageId}/child/attachment`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${auth}`, 'X-Atlassian-Token': 'nocheck' },
        body: formData
      });
      console.log(`  📎 ${r.filename} → ${resp.ok ? 'ok' : resp.status}`);
    }
    return `https://devynbartell.atlassian.net/wiki/spaces/SD/pages/${pageId}`;
  } catch (err) {
    console.error('Confluence error:', err.message);
    return null;
  }
}

// ============ MAIN ============

async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  EmployArmor — Full Company E2E Journey');
  console.log(`  Company: ${COMPANY.name}`);
  console.log(`  States: ${COMPANY.states.join(', ')}`);
  console.log(`  Tools: ${COMPANY.tools.length} AI hiring tools`);
  console.log(`  URL: ${BASE_URL}`);
  console.log('═══════════════════════════════════════════');

  // Clean old screenshots
  fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg')).forEach(f => fs.unlinkSync(path.join(SCREENSHOT_DIR, f)));

  let browser, launched = false;
  try {
    browser = await chromium.connectOverCDP('http://127.0.0.1:18800', { timeout: 5000 });
    console.log('✅ Connected to existing Chrome (CDP)');
  } catch {
    browser = await chromium.launch({
      channel: 'chrome', headless: true,
      args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox', '--single-process', '--js-flags=--max-old-space-size=256']
    });
    launched = true;
    console.log('✅ Launched headless Chrome');
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);

  const acts = [
    ['Act 1', act1_discovery],
    ['Act 2', act2_onboarding],
    ['Act 3', act3_tools],
    ['Act 4', act4_documents],
    ['Act 5', act5_employees],
    ['Act 6', act6_training],
    ['Act 7', act7_audit],
    ['Act 8', act8_settings],
  ];

  for (const [actName, actFn] of acts) {
    try {
      await actFn(page);
    } catch (err) {
      console.error(`\n💥 ${actName} error: ${err.message}`);
      bug(`${actName} crashed: ${err.message.slice(0, 100)}`);
      await snap(page, `${actName.toLowerCase().replace(' ', '-')}-error`, `${actName} error`).catch(() => {});
      // Navigate to dashboard to reset state for next act
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(1000);
    }
  }

  await page.close();

  // Report
  const report = {
    timestamp: new Date().toISOString(),
    company: COMPANY,
    baseUrl: BASE_URL,
    totalScreenshots: results.length,
    bugs,
    results,
  };
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'report.json'), JSON.stringify(report, null, 2));

  console.log('\n═══════════════════════════════════════════');
  console.log(`  📸 Screenshots: ${results.length}`);
  console.log(`  🐛 Bugs: ${bugs.length}`);
  console.log('═══════════════════════════════════════════');

  const confluenceUrl = await uploadToConfluence(report);
  if (confluenceUrl) console.log(`\n🔗 ${confluenceUrl}`);

  await context.close();
  if (launched) await browser.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
