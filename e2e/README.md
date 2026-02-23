# EmployArmor E2E Test Suite

Comprehensive end-to-end testing covering the full workflow of a real company doing maximum compliance.

## Test Accounts

### Admin Account
- **Email:** test-e2e@employarmor.com
- **Password:** TestE2E!2026
- **Role:** Owner/Admin
- **Access:** Full admin dashboard, compliance management, approvals, settings

### Employee Account
- **Email:** test-employee@employarmor.com
- **Password:** TestEmployee!2026
- **Role:** Employee
- **Access:** Employee portal, disclosures, training, tool requests

## Scenarios

### 1. Admin Onboarding & Setup
Journey: New admin logs in and explores core admin pages
- Dashboard (compliance score overview)
- Employee management
- AI tool catalog
- Approval queue
- Organization settings

### 2. Compliance Management
Journey: Admin manages all compliance aspects
- Bias impact audit
- Candidate notice management
- Employee disclosure management
- Complete compliance packet
- AI policy handbook
- Training module management

### 3. Employee Portal
Journey: Employee logs in and uses self-service features
- Employee dashboard
- Pending disclosure acknowledgments
- Assigned training courses
- AI tool request form

### 4. Candidate/Public Flow
Journey: Public visitor explores site and runs compliance scan
- Marketing homepage
- Compliance scan flow (states → employees → tools → results)
- Resource hub
- Compliance information hub

### 5. Tool Governance Cycle
Journey: Complete tool governance workflow
- Employee requests AI tool
- Admin reviews pending approvals
- Approval/denial workflow

## Usage

### Run All Scenarios
```bash
cd /Users/henry/projects/hireshield
source .env.local
node e2e/run-e2e.mjs --scenarios all
```

### Run Specific Scenarios
```bash
# Single scenario
node e2e/run-e2e.mjs --scenarios portal

# Multiple scenarios
node e2e/run-e2e.mjs --scenarios onboarding,compliance,portal
```

### Options
- `--cdp-port <port>` - CDP port for Chrome connection (default: 18800)
- `--base-url <url>` - Base URL to test (default: https://employarmor.vercel.app)
- `--scenarios <list>` - Scenarios to run: all|onboarding|compliance|portal|candidate|governance
- `--visual-board` - Create Confluence visual flow board (default: true)
- `--no-visual-board` - Skip visual flow board, create standard report

### Environment Variables
- `E2E_BASE_URL` - Override base URL
- `CDP_PORT` - Override CDP port
- `SCREENSHOT_DIR` - Screenshot output directory (default: e2e-screenshots)
- `CONFLUENCE_UPLOAD` - Set to 'false' to skip Confluence upload

## Outputs

### Screenshots
All screenshots saved to `e2e-screenshots/` with naming pattern:
```
<step>-<scenario>-<name>.png
```
Example: `001-onboarding-dashboard.png`

### Report
JSON report saved to `e2e-screenshots/report.json` with:
- Timestamp and configuration
- Scenarios run
- All screenshot metadata
- Bugs found
- Errors encountered

### Confluence
Automatically uploads to Confluence (SD space):
- **Visual Flow Board Mode** (default): Screenshots grouped by scenario with flow arrows
- **Standard Mode**: Linear timeline of all screenshots

## Creating Test Accounts

### Recreate Employee Account
```bash
node e2e/create-test-employee.mjs
```

The script will:
1. Find the admin's organization
2. Create auth user (if doesn't exist)
3. Create employee_profile record
4. Link to the same organization as admin

## Automated Testing

The E2E suite runs automatically via cron:
- **Schedule:** 9 AM and 5 PM MST daily
- **Cron ID:** 28b42e70-f92d-43a8-98c7-7414074acdc0
- **Command:** `openclaw cron runs --id 28b42e70-f92d-43a8-98c7-7414074acdc0`

View recent runs:
```bash
openclaw cron runs --id 28b42e70-f92d-43a8-98c7-7414074acdc0 --limit 5
```

## Troubleshooting

### Chrome Connection Issues
If CDP connection fails (port 18800), the script will fallback to launching headless Chrome. To use CDP:
```bash
# Start OpenClaw browser
openclaw browser start --profile openclaw

# Check it's running on port 18800
lsof -i :18800
```

### Authentication Issues
If login fails, verify:
1. Test accounts exist in Supabase
2. `.env.local` has correct SUPABASE_URL and keys
3. Auth cookies are being set correctly

### Screenshot Failures
If screenshots fail:
- Check page load timeouts (default: 12s)
- Verify pages are accessible and rendering
- Check browser memory (may need to increase if running many scenarios)

## Development

### Adding New Scenarios
1. Create new scenario function in `run-e2e.mjs`
2. Add to `scenariosToRun` array in main()
3. Update README with scenario details
4. Update cron job message if needed

### Modifying Confluence Upload
Visual flow board HTML/CSS is in `buildVisualFlowBoard()` function.
Standard report format is in `buildStandardReport()` function.

## Architecture

- **CDP Connection:** Connects to existing Chrome on port 18800 (avoids OOM on 8GB machines)
- **Supabase Auth:** Direct API authentication with cookie injection
- **Playwright:** Browser automation via playwright-core
- **Confluence API:** REST API upload with form-data for attachments
- **Screenshots:** Full-page disabled (faster, consistent viewport)
- **Session Management:** Proper logout between scenarios to avoid auth bleed
