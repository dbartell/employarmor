const BASE = 'https://employarmor.vercel.app';
const SUPABASE_URL = 'https://dgiggocsiyfhwtepjrgs.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnaWdnb2NzaXlmaHd0ZXBqcmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NTQzMzksImV4cCI6MjA4NTIzMDMzOX0.aLx6pfyaJcbFDK-tdmElmuOwGpnisUY-0Pfu_3Zu8bA';

const results = [];

async function getSession() {
  const resp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
    body: JSON.stringify({ email: 'test-e2e@employarmor.com', password: 'TestE2E!2026' })
  });
  return await resp.json();
}

async function checkPage(route, label, cookie) {
  try {
    const headers = {};
    if (cookie) headers['Cookie'] = cookie;
    
    const resp = await fetch(`${BASE}${route}`, { headers, redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const status = resp.status;
    const location = resp.headers.get('location') || '';
    let body = '';
    try { body = await resp.text(); } catch {}
    
    const titleMatch = body.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = (titleMatch ? titleMatch[1] : '').replace(/&#x27;/g,"'").replace(/&amp;/g,"&");
    
    let result, note;
    if (status === 404) { result = '404'; note = '404 Not Found'; }
    else if (status >= 300 && status < 400) { result = 'redirect'; note = `${status} → ${location.replace(BASE, '')}`; }
    else if (status >= 500) {
      // Try to extract error from body
      const errMatch = body.match(/Error[:\s]+([^<"]{10,80})/i);
      result = 'error'; note = errMatch ? `${status}: ${errMatch[1].trim()}` : `Server Error (${status})`;
    }
    else if (status === 200) { result = 'ok'; note = title.slice(0, 80); }
    else { result = 'other'; note = `HTTP ${status}`; }
    
    const icon = result === 'ok' ? '✅' : result === '404' ? '⚠️' : result === 'redirect' ? '↩️' : '❌';
    console.log(`${icon} ${route} — ${note}`);
    results.push({ route, label, status: result, httpStatus: status, title, note });
  } catch (err) {
    console.log(`❌ ${route} — ${err.message?.slice(0, 60)}`);
    results.push({ route, label, status: 'error', httpStatus: 0, title: '', note: err.message?.slice(0, 80) });
  }
}

async function run() {
  // Get auth session
  console.log('Authenticating...');
  const session = await getSession();
  if (!session.access_token) { console.log('Auth failed:', JSON.stringify(session)); return; }
  console.log('Auth OK ✓\n');
  
  // Build cookie - Supabase SSR expects URL-encoded JSON in sb-<ref>-auth-token
  const cookieVal = encodeURIComponent(JSON.stringify(session));
  const cookie = `sb-dgiggocsiyfhwtepjrgs-auth-token=${cookieVal}`;
  
  console.log('=== PUBLIC PAGES ===');
  await checkPage('/', 'Homepage', '');
  await checkPage('/scan', 'Compliance Scan', '');
  await checkPage('/pricing', 'Pricing', '');
  await checkPage('/integrations', 'Integrations', '');
  await checkPage('/demo', 'Demo', '');
  await checkPage('/login', 'Login', '');
  await checkPage('/signup', 'Signup', '');
  
  console.log('\n=== STATE LAW PAGES ===');
  await checkPage('/compliance', 'Compliance Hub', '');
  await checkPage('/compliance/illinois', 'Illinois', '');
  await checkPage('/compliance/colorado', 'Colorado', '');
  await checkPage('/compliance/california', 'California', '');
  await checkPage('/compliance/nyc', 'NYC', '');
  await checkPage('/compliance/maryland', 'Maryland', '');
  
  console.log('\n=== RESOURCE PAGES ===');
  await checkPage('/resources', 'Resources', '');
  await checkPage('/tools', 'Tools', cookie);
  await checkPage('/compare', 'Compare', '');
  await checkPage('/glossary', 'Glossary', '');
  await checkPage('/about', 'About', '');
  await checkPage('/contact', 'Contact', '');
  await checkPage('/privacy', 'Privacy', '');
  await checkPage('/terms', 'Terms', '');
  
  console.log('\n=== AUTHENTICATED PAGES ===');
  await checkPage('/dashboard', 'Dashboard', cookie);
  await checkPage('/candidate-notices', 'Candidate Notices', cookie);
  await checkPage('/employee-disclosures', 'Employee Disclosures', cookie);
  await checkPage('/handbook', 'Handbook', cookie);
  await checkPage('/tool-registry', 'Tool Registry', cookie);
  await checkPage('/approvals', 'Approvals', cookie);
  await checkPage('/risk-assessment', 'Risk Assessment', cookie);
  await checkPage('/training', 'Training', cookie);
  await checkPage('/audit-packet', 'Audit Packet', cookie);
  await checkPage('/employees', 'Team', cookie);
  await checkPage('/portal', 'Portal', cookie);
  await checkPage('/portal/disclosures', 'Portal Disclosures', cookie);
  await checkPage('/portal/training', 'Portal Training', cookie);
  await checkPage('/portal/tools', 'Portal Tools', cookie);
  await checkPage('/settings', 'Settings', cookie);
  await checkPage('/documents', 'Documents (old)', cookie);
  await checkPage('/disclosures', 'Disclosures (old)', cookie);
  await checkPage('/consent', 'Consent (old)', cookie);

  const ok = results.filter(r => r.status === 'ok').length;
  const notFound = results.filter(r => r.status === '404').length;
  const redirects = results.filter(r => r.status === 'redirect').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total: ${results.length} | ✅ OK: ${ok} | ⚠️ 404: ${notFound} | ↩️ Redirect: ${redirects} | ❌ Error: ${errors}`);
  
  const fs = await import('fs');
  fs.writeFileSync('/Users/henry/projects/hireshield/e2e-screenshots/results-auth.json', JSON.stringify(results, null, 2));
}

run().catch(console.error);
