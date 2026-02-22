const BASE = 'https://employarmor.vercel.app';
const results = [];

async function checkPage(route, label) {
  try {
    const resp = await fetch(`${BASE}${route}`, { 
      redirect: 'manual',
      signal: AbortSignal.timeout(15000)
    });
    
    const status = resp.status;
    const location = resp.headers.get('location') || '';
    let body = '';
    try { body = await resp.text(); } catch {}
    
    const titleMatch = body.match(/<title[^>]*>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/&#x27;/g,"'") : '';
    
    let result, note;
    
    if (status === 404) {
      result = '404'; note = '404 Not Found';
    } else if (status >= 300 && status < 400) {
      result = 'redirect'; note = `${status} → ${location.replace(BASE, '')}`;
    } else if (status >= 500) {
      result = 'error'; note = `Server Error (${status})`;
    } else if (status === 200) {
      // Check if the visible content is actually a 404 page (Next.js soft 404)
      const hasContent = body.includes('class="') && body.length > 5000;
      // Check for actual page-specific content vs just the shell
      const isBlankShell = !body.includes('<section') && !body.includes('<form') && !body.includes('<main');
      result = 'ok'; note = title.slice(0, 60);
    } else {
      result = 'other'; note = `HTTP ${status}`;
    }
    
    const icon = result === 'ok' ? '✅' : result === '404' ? '⚠️' : result === 'redirect' ? '↩️' : '❌';
    console.log(`${icon} ${route} — ${note}`);
    results.push({ route, label, status: result, httpStatus: status, title, note });
  } catch (err) {
    console.log(`❌ ${route} — ${err.message?.slice(0, 60)}`);
    results.push({ route, label, status: 'error', httpStatus: 0, title: '', note: err.message?.slice(0, 80) });
  }
}

async function run() {
  console.log('=== PUBLIC PAGES ===');
  await checkPage('/', 'Homepage');
  await checkPage('/scan', 'Compliance Scan');
  await checkPage('/pricing', 'Pricing');
  await checkPage('/integrations', 'Integrations');
  await checkPage('/demo', 'Demo');
  await checkPage('/login', 'Login');
  await checkPage('/signup', 'Signup');
  
  console.log('\n=== STATE LAW PAGES ===');
  await checkPage('/compliance', 'Compliance Hub');
  await checkPage('/compliance/illinois', 'Illinois');
  await checkPage('/compliance/colorado', 'Colorado');
  await checkPage('/compliance/california', 'California');
  await checkPage('/compliance/nyc', 'NYC');
  await checkPage('/compliance/maryland', 'Maryland');
  
  console.log('\n=== RESOURCE PAGES ===');
  await checkPage('/resources', 'Resources');
  await checkPage('/tools', 'Tools');
  await checkPage('/compare', 'Compare');
  await checkPage('/glossary', 'Glossary');
  await checkPage('/about', 'About');
  await checkPage('/contact', 'Contact');
  await checkPage('/privacy', 'Privacy');
  await checkPage('/terms', 'Terms');
  
  console.log('\n=== AUTH PAGES (unauthenticated) ===');
  await checkPage('/dashboard', 'Dashboard');
  await checkPage('/candidate-notices', 'Candidate Notices');
  await checkPage('/employee-disclosures', 'Employee Disclosures');
  await checkPage('/handbook', 'Handbook');
  await checkPage('/tool-registry', 'Tool Registry');
  await checkPage('/approvals', 'Approvals');
  await checkPage('/risk-assessment', 'Risk Assessment');
  await checkPage('/training', 'Training');
  await checkPage('/audit-packet', 'Audit Packet');
  await checkPage('/employees', 'Team');
  await checkPage('/portal', 'Portal');
  await checkPage('/portal/disclosures', 'Portal Disclosures');
  await checkPage('/portal/training', 'Portal Training');
  await checkPage('/portal/tools', 'Portal Tools');
  await checkPage('/settings', 'Settings');
  await checkPage('/documents', 'Documents (old)');
  await checkPage('/disclosures', 'Disclosures (old)');
  await checkPage('/consent', 'Consent (old)');

  const ok = results.filter(r => r.status === 'ok').length;
  const notFound = results.filter(r => r.status === '404').length;
  const redirects = results.filter(r => r.status === 'redirect').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total: ${results.length} | ✅ OK: ${ok} | ⚠️ 404: ${notFound} | ↩️ Redirect: ${redirects} | ❌ Error: ${errors}`);
  
  const fs = await import('fs');
  fs.mkdirSync('/Users/henry/projects/hireshield/e2e-screenshots', {recursive:true});
  fs.writeFileSync('/Users/henry/projects/hireshield/e2e-screenshots/results.json', JSON.stringify(results, null, 2));
}

run().catch(console.error);
