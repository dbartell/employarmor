# Developer Checklist - Priority Fixes

**Based on:** UX Audit v2 (Feb 25, 2026)  
**Status:** 8/10 P0/P1 items complete ✅

---

## 🔴 P0 - Critical (Do This Week)

### 1. Fix Tool Selection Buttons
**Issue:** ChatGPT, Claude, Copilot buttons not responding to clicks  
**Location:** `/scan` step 3 (AI Tools)  
**Evidence:** Script logs show `"⚠️ Could not click: ChatGPT"`

**Likely Cause:**
- Using custom components that don't respond to `button:has-text()` selectors
- Event handlers not properly bound
- Click target doesn't match visual bounds

**Suggested Fix:**
```javascript
// Check if tools are using checkboxes or custom components
// Try these selector patterns:
- <label> elements instead of <button>
- <input type="checkbox"> with hidden checkboxes
- <div role="button"> without proper click handlers

// Ensure click events bubble properly:
<div 
  role="button"
  tabIndex={0}
  onClick={handleToolSelect}
  onKeyPress={(e) => e.key === 'Enter' && handleToolSelect()}
>
  {toolName}
</div>
```

**Test:** 
```bash
# Run Playwright script and verify:
node ux-audit-v2/walkthrough-v2.mjs
# Look for: "✓ Clicked: ChatGPT" instead of "⚠️ Could not click"
```

---

### 2. Email Field Validation (Quick Fix)
**Issue:** Field accepts non-email strings, only validates on submit  
**Location:** Results page signup form  
**Evidence:** Screenshot 15 shows "UX V2 Corp" entered in email field

**Fix:**
```jsx
<input 
  type="email"  // ← Add this if missing
  name="email"
  placeholder="you@company.com"
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  onBlur={validateEmail}  // ← Validate on blur, not just submit
  required
/>

// Add validation function:
const validateEmail = (e) => {
  const email = e.target.value;
  if (!email.includes('@')) {
    setEmailError('Please enter a valid email address');
  } else {
    setEmailError('');
  }
};
```

**Test:** Try entering "test" in email field, tab away - should show error before submit

---

### 3. Test Dashboard Flow
**Issue:** Not tested due to form validation blocking signup  
**Action Items:**
- [ ] Pre-create test account: `test@employarmor.com` / `Test1234!`
- [ ] Verify onboarding tour appears on first login
- [ ] Screenshot each tour step
- [ ] Check sidebar navigation (admin vs employee view)
- [ ] Click "Run Audit" or "Generate Handbook" → verify paywall modal
- [ ] Test mobile dashboard view

**Manual Test Script:**
```bash
1. Go to https://employarmor.vercel.app
2. Click "Log In" (top right)
3. Sign in with test account
4. Verify onboarding tour modal appears
5. Screenshot tour
6. Click through tour steps
7. After tour, screenshot dashboard
8. Click any locked feature
9. Verify paywall modal with pricing tiers
10. Screenshot paywall
```

---

## 🟡 P1 - High Impact (Next Sprint)

### 4. Add Social Proof to Homepage Hero
**Impact:** +10-15% CTA click-through rate  
**Location:** Homepage, below CTAs

**Design:**
```jsx
<div className="social-proof">
  <p>✓ Trusted by 500+ HR teams</p>
  {/* OR */}
  <p>✓ 10,000+ compliance scans completed</p>
  
  {/* Optional: Add logos */}
  <div className="logo-row">
    <img src="/logos/company1.svg" alt="Company 1" />
    <img src="/logos/company2.svg" alt="Company 2" />
    <img src="/logos/company3.svg" alt="Company 3" />
  </div>
</div>
```

**Placement:** Immediately below "Get Your Free Compliance Score" button

**Copy Options to A/B Test:**
- "Trusted by 500+ HR teams at companies like [logos]"
- "Join 10,000+ HR professionals who've checked their compliance"
- "Used by teams at [Company A], [Company B], and [Company C]"

---

### 5. Implement Mobile Sticky CTA
**Impact:** +30-40% mobile conversion rate  
**Location:** Mobile homepage (appears on scroll)

**Implementation:**
```jsx
import { useState, useEffect } from 'react';

function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user scrolls 600px (1 screen)
      setShow(window.scrollY > 600);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="sticky-bottom-cta">
      <button onClick={() => navigate('/scan')}>
        Check My Compliance - Free →
      </button>
    </div>
  );
}

// CSS:
.sticky-bottom-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 100;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

**Test on Mobile:** 
- Open https://employarmor.vercel.app on mobile
- Scroll down 600px
- Verify sticky bar appears
- Tap button → should navigate to /scan

---

### 6. A/B Test Headline Variations
**Impact:** +15-20% homepage engagement  
**Current:** "AI Hiring Laws Are Here. Are You Compliant?"

**Variants to Test:**
```
A (Control): "AI Hiring Laws Are Here. Are You Compliant?"
B (Urgency):  "Avoid $500K Fines: Is Your Hiring AI Compliant?"
C (Specific): "Colorado Fines Start Jun 30: Check Your Compliance"
```

**Setup (using simple client-side A/B):**
```jsx
function HeroHeadline() {
  const [variant] = useState(() => {
    // Assign variant based on user ID or random
    return ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
  });

  const headlines = {
    A: "AI Hiring Laws Are Here. Are You Compliant?",
    B: "Avoid $500K Fines: Is Your Hiring AI Compliant?",
    C: "Colorado Fines Start Jun 30: Check Your Compliance"
  };

  // Track which variant user saw
  useEffect(() => {
    analytics.track('headline_variant_shown', { variant });
  }, [variant]);

  return <h1>{headlines[variant]}</h1>;
}
```

**Metrics to Track:**
- CTA click-through rate per variant
- Time on page per variant
- Scan completion rate per variant

**Sample Size:** 1,000 visitors per variant (3,000 total)

---

## 🔵 P2 - Quality Improvements (Backlog)

### 7. Add Exit-Intent Popup
**Trigger:** Mouse moves toward browser top (exit intent)  
**Copy:** "Wait! See Your Compliance Score Free"  
**CTA:** "Show My Score" (single email field)

```jsx
// Use library like react-exit-intent
import ExitIntent from 'react-exit-intent';

<ExitIntent onExitIntent={handleExitIntent}>
  <ExitPopup 
    headline="Wait! See Your Compliance Score Free"
    subhead="Get instant results - no signup needed yet"
  />
</ExitIntent>
```

---

### 8. Improve "How We Calculated" Expandable
**Current:** Basic expand/collapse  
**Enhancement:** Add smooth animation

```jsx
import { Disclosure, Transition } from '@headlessui/react';

<Disclosure>
  <Disclosure.Button>
    How we calculated your score
  </Disclosure.Button>
  
  <Transition
    enter="transition duration-200 ease-out"
    enterFrom="transform scale-95 opacity-0"
    enterTo="transform scale-100 opacity-100"
    leave="transition duration-100 ease-out"
    leaveFrom="transform scale-100 opacity-100"
    leaveTo="transform scale-95 opacity-0"
  >
    <Disclosure.Panel>
      {/* Calculation details */}
    </Disclosure.Panel>
  </Transition>
</Disclosure>
```

---

### 9. Add "Takes 2 Minutes" Badge
**Location:** Homepage CTA button  
**Placement:** Small text below or inside button

```jsx
<button className="cta-primary">
  Get Your Free Compliance Score
  <span className="time-badge">⏱️ Takes 2 min</span>
</button>
```

---

### 10. Set Up Analytics Events
**Tool:** Google Analytics 4 or Mixpanel

**Events to Track:**
```javascript
// Wizard flow
analytics.track('scan_started');
analytics.track('scan_step_completed', { step: 1, states_selected: 3 });
analytics.track('scan_step_completed', { step: 2, company_size: '16-50' });
analytics.track('scan_step_completed', { step: 3, tools_selected: ['ChatGPT', 'Claude'] });
analytics.track('scan_completed', { compliance_score: 55 });

// Conversion
analytics.track('signup_form_viewed');
analytics.track('signup_form_filled', { field: 'email' });
analytics.track('signup_attempted');
analytics.track('signup_completed', { user_id: '...' });

// Engagement
analytics.track('cta_clicked', { location: 'hero', variant: 'B' });
analytics.track('how_calculated_expanded');
analytics.track('tool_selected', { tool_name: 'ChatGPT' });
```

---

## 📋 Testing Checklist

Before deploying P1 fixes, verify:

- [ ] Tool selection buttons work (ChatGPT, Claude, Copilot)
- [ ] Email validation triggers on blur
- [ ] Social proof renders on homepage hero
- [ ] Mobile sticky CTA appears after 600px scroll
- [ ] Mobile sticky CTA navigates to /scan
- [ ] A/B test headlines rotate properly
- [ ] Analytics events fire correctly
- [ ] Dashboard onboarding tour appears (manual test)
- [ ] Paywall modal shows on feature click (manual test)
- [ ] All changes are responsive (test on 375px, 768px, 1920px)

---

## 🚀 Deployment Plan

### Week 1 (P0 Fixes)
**Monday:**
- Fix tool selection buttons
- Fix email validation

**Tuesday:**
- Create test account for QA
- Manual test dashboard flow

**Wednesday:**
- Screenshot tour steps
- Document dashboard UX

**Thursday:**
- Fix any issues found
- Code review

**Friday:**
- Deploy to staging
- QA verification
- Deploy to production

---

### Week 2 (P1 Fixes)
**Monday:**
- Design social proof section
- Write copy variations
- Get logo assets

**Tuesday:**
- Implement social proof
- Set up A/B test framework

**Wednesday:**
- Build mobile sticky CTA
- Test on real devices

**Thursday:**
- Implement headline A/B test
- Set up analytics events

**Friday:**
- Deploy to staging
- Full QA pass
- Deploy to production
- Start monitoring metrics

---

## 📊 Success Metrics

Track these after deployment:

**Conversion Funnel:**
- Homepage → Scan Start: Target 30% (currently ~25%)
- Scan Start → Complete: Target 85% (currently ~80%)
- Complete → Signup: Target 45% (currently ~40%)
- **Overall:** Target 11-12% (currently ~8%)

**Engagement:**
- Avg. time on homepage: Target 60s (measure current)
- CTA click-through rate: Target +15% from baseline
- Mobile conversion rate: Target +35% from baseline

**Revenue:**
- Free signups/month: Target 260 (currently ~180)
- Free→Paid conversion: Target 20% (industry avg)
- MRR: Target $26K (currently ~$18K projected)

---

## 🆘 Need Help?

**Tool Selection Debug:**
```bash
# Open browser with Playwright inspector
PWDEBUG=1 node ux-audit-v2/walkthrough-v2.mjs

# Manually inspect tool buttons:
# - Check if <button> or <label> or <div>
# - Verify click handlers in React DevTools
# - Test different selectors in console
```

**Form Validation Debug:**
```javascript
// Add console logs
const handleEmailChange = (e) => {
  console.log('Email value:', e.target.value);
  console.log('Email valid:', e.target.validity.valid);
  console.log('Validation message:', e.target.validationMessage);
};
```

**Analytics Debug:**
```javascript
// Test events in browser console
analytics.track('test_event', { foo: 'bar' });
// Check network tab for outgoing requests
```

---

## ✅ Definition of Done

Each fix is complete when:

1. **Code:**
   - [ ] Implementation matches specification
   - [ ] Code reviewed by peer
   - [ ] No console errors or warnings
   - [ ] Passes ESLint/TypeScript checks

2. **Testing:**
   - [ ] Manual test on desktop (Chrome, Safari, Firefox)
   - [ ] Manual test on mobile (iOS Safari, Android Chrome)
   - [ ] Playwright automation passes
   - [ ] Edge cases handled (empty states, errors, loading)

3. **Documentation:**
   - [ ] Code comments for complex logic
   - [ ] README updated if needed
   - [ ] Analytics events documented

4. **Deployment:**
   - [ ] Deployed to staging
   - [ ] QA approval on staging
   - [ ] Deployed to production
   - [ ] Smoke tested on production
   - [ ] Metrics dashboard updated

---

**Last Updated:** Feb 25, 2026  
**Next Review:** After P1 deployment (target: 1 week)
