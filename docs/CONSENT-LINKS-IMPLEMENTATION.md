# Consent Links & ATS Integration Implementation

## Overview

This implementation adds candidate-facing consent collection via shareable links and enhances the Merge.dev ATS integration to auto-track consent.

## Part 1: Candidate-Facing Consent Flow

### New Files Created

1. **`/src/app/consent/[token]/page.tsx`** - Public consent page
   - Displays employer's AI disclosure
   - Collects candidate name + email
   - Records acknowledgment with timestamp and IP
   - Branded with employer's colors/logo

2. **`/src/app/api/consent/link/route.ts`** - Link management API
   - `POST` - Create new consent link
   - `GET` - List all consent links
   - `DELETE` - Delete or deactivate a link

3. **`/src/app/api/consent/link/[token]/route.ts`** - Public link API
   - `GET` - Get link details for public consent page
   - `POST` - Submit consent (creates record)

4. **`/src/lib/actions/consent-links.ts`** - Server actions for consent links

### Updated Files

1. **`/src/app/(app)/consent/page.tsx`** - Consent dashboard
   - Added "Consent Links" tab
   - Generate new links with name, position, expiration
   - View link stats (views, submissions)
   - Copy link URL or embed code
   - Records show "via link" badge for link-submitted entries

2. **`/src/lib/actions/consent.ts`** - Extended ConsentRecord type with:
   - `source`: 'manual' | 'link' | 'ats_sync'
   - `consent_link_id`: Reference to source link
   - `ip_address`: Captured at submission

3. **`/src/types/index.ts`** - Added ConsentLink interface

### Database Migration

**`/supabase/migrations/20250203_consent_links.sql`**

Creates `consent_links` table:
- `id`, `org_id`, `token` (unique)
- `name`, `position` (optional)
- `is_active`, `expires_at`
- `views_count`, `submissions_count`
- RLS policies for org-level access

Extends `consent_records` table:
- `source` - tracks origin (manual/link/ats_sync)
- `consent_link_id` - FK to consent_links
- `ip_address` - for audit trail

## Part 2: Merge.dev ATS Integration Enhancements

### New Files

1. **`/src/app/api/integrations/merge/settings/route.ts`**
   - `GET` - Get integration settings
   - `PATCH` - Update integration settings (e.g., auto_consent_tracking)

### Updated Files

1. **`/src/app/api/integrations/merge/webhook/route.ts`**
   - Added auto-consent tracking for new candidates
   - When enabled, creates pending consent record for each new candidate
   - Logs consent tracking events to audit table

2. **`/src/app/(app)/settings/integrations/page.tsx`**
   - Added "Auto-track consent" toggle per integration
   - Toggle enables/disables automatic consent record creation

### How It Works

When `auto_consent_tracking` is enabled for an ATS integration:
1. New candidate webhook arrives from Merge.dev
2. System checks if consent record exists for candidate email
3. If not, creates a "pending" consent record with source='ats_sync'
4. Record appears in consent dashboard for tracking
5. Employer can then send consent link to candidate

## Usage

### Creating a Consent Link

1. Go to `/consent` → Click "Consent Links" tab
2. Click "Generate Link"
3. Enter link name (internal reference)
4. Optionally set position and expiration
5. Copy the generated URL

### Candidate Flow

1. Candidate opens consent link URL
2. Sees employer's AI disclosure (from their disclosure page settings)
3. Enters name and email
4. Clicks "I Acknowledge"
5. Consent record created automatically

### ATS Auto-Tracking

1. Go to `/settings/integrations`
2. Find your connected ATS
3. Enable "Auto-track consent"
4. New candidates will automatically have pending consent records created

## Embed Code

Each consent link includes an embed code for adding to careers pages:

```html
<a href="https://app.aihirelaw.com/consent/[TOKEN]" 
   target="_blank" 
   rel="noopener noreferrer" 
   style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; font-family: sans-serif;">
  Review AI Disclosure
</a>
```

## Notes

- Consent links use disclosure page settings (intro text, rights, brand colors)
- Links can be deactivated without deleting (preserves existing records)
- IP addresses are captured for audit compliance
- Duplicate submissions from same email are handled gracefully
