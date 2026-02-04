# HireShield E2E Test Plan

## Onboarding Flow Analysis

### Current Flow (5 Steps)
1. **Where do you hire?** - State selection with compliance indicators (⚠️ on CA, CO, IL, NYC)
2. **What hiring tools do you use?** - Tool grid with categories
3. **How is AI used in decisions?** - Use case selection
4. **How many employees?** - Company size tiers
5. **Almost there!** - Lead capture (email + company name)

### Improvements Identified

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Button disabled logic unclear | Low | Add validation feedback (show why button is disabled) |
| No progress saving | Medium | Save progress to localStorage so users can resume |
| No "Select All" for states | Low | Add "Nationwide" option for companies hiring everywhere |
| Tool list is static | Medium | Add search/filter for tools, "Other" text input |
| No industry selection | Medium | Add industry to personalize compliance recommendations |
| Email validation on blur | Low | Show validation earlier (on type) vs waiting for submit |

---

## Testable Application Flows

### 1. **Onboarding Flow** (Pre-auth)
```
/onboard → 5-step wizard → /preview (compliance plan)
```
**Test points:**
- State selection enables Continue
- Tool selection persists through steps
- Back button preserves selections
- Lead saved to `leads` table with states/tools
- Compliance plan shows correct tasks based on states

### 2. **Signup/Login Flow** (Auth)
```
/signup → email verification → /set-password → /dashboard
/login → /dashboard
```
**Test points:**
- Signup creates user in Supabase auth
- Password requirements enforced
- Magic link flow works
- Redirect to dashboard after auth

### 3. **Impact Assessment Wizard** (Authenticated)
```
/documents/impact-assessment
```
**Test points:**
- Multi-step wizard navigation
- Form validation
- Document generation
- PDF export
- State-specific requirements (CO vs CA)

### 4. **Document Generation** (Authenticated)
```
/documents → Generate → Download/Copy
```
**Test points:**
- Pre-Use Notice generation (CA)
- Candidate Disclosure Notice (CO)
- Employee Handbook Policy
- Document customization with company info
- PDF/text export

### 5. **Training Flow** (Authenticated + Invited)
```
/training/start/[token] → /training/[track]/[section] → /training/certificate/[number]
```
**Test points:**
- Invite link validation
- Video playback completion tracking
- Quiz scoring
- Certificate generation
- Role-based training paths

### 6. **Consent Collection** (Authenticated)
```
/consent → track candidate acknowledgments
```
**Test points:**
- Consent form generation
- Candidate record creation
- Consent status tracking
- Audit log

### 7. **Disclosure Page** (Public)
```
/disclosures → Public-facing disclosure
```
**Test points:**
- Public accessibility (no auth)
- Content matches generated documents
- Mobile responsive

### 8. **Team Management** (Authenticated)
```
/settings/team → Invite → Accept
```
**Test points:**
- Invite email sent
- Role assignment
- Invite acceptance flow
- Permission enforcement

### 9. **Billing/Upgrade Flow** (Authenticated)
```
/pricing → Stripe checkout → /dashboard (upgraded)
```
**Test points:**
- Price display matches Stripe
- Checkout redirect works
- Webhook processes payment
- Features unlock after payment

---

## E2E Test Files Structure

```
scripts/e2e/
├── daily-e2e-test.sh           # Main runner (existing)
├── delete-test-user.ts         # Cleanup (existing)
├── playwright.e2e.config.ts    # Config (existing)
├── flows/
│   ├── onboarding.spec.ts      # Full onboarding wizard
│   ├── signup.spec.ts          # Signup + email verification
│   ├── impact-assessment.spec.ts
│   ├── document-generation.spec.ts
│   ├── training.spec.ts
│   ├── consent-tracking.spec.ts
│   ├── team-invite.spec.ts
│   └── billing.spec.ts
└── helpers/
    ├── auth.ts                 # Login/signup utilities
    ├── stripe.ts               # Stripe test helpers
    └── cleanup.ts              # Test data cleanup
```

---

## Priority Order

1. **Onboarding** - First touch, highest conversion impact
2. **Signup/Login** - Auth is critical path
3. **Impact Assessment** - Core value prop, wizard is complex
4. **Document Generation** - Second core feature
5. **Training** - Revenue driver (certificates)
6. **Consent Tracking** - Differentiator feature
7. **Billing** - Revenue protection
8. **Team Management** - Growth feature

---

## Environment Requirements

- **Test email**: Need a real email domain (not `.test`)
- **Supabase**: Either upgrade plan for higher email limits, or use admin API
- **Stripe**: Use test mode keys (already configured)
- **Chrome profile**: Pre-signed for any OAuth flows (if added later)

---

## Next Steps

1. [ ] Create individual flow test files
2. [ ] Add admin API user creation to bypass email rate limits
3. [ ] Set up daily schedule (launchd)
4. [ ] Add Trello integration for bug filing (done)
5. [ ] Create test data fixtures
