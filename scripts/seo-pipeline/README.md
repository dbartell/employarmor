# EmployArmor SEO Automation Pipeline

Complete SEO automation pipeline using Keywords Everywhere API and DataForSEO API.

## Overview

This pipeline automates:
- Keyword research and opportunity analysis
- SERP analysis and competitor gap identification
- Backlink opportunity discovery
- Content clustering and content calendar generation
- Internal linking recommendations
- Technical SEO audits

## Prerequisites

### API Keys

1. **Keywords Everywhere API**
   - Sign up at https://keywordseverywhere.com/api
   - Set environment variable: `KEYWORDS_EVERYWHERE_API_KEY`

2. **DataForSEO API**
   - Sign up at https://dataforseo.com
   - Set environment variables: `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`

### Environment Setup

Add to your `.env.local`:
```bash
KEYWORDS_EVERYWHERE_API_KEY=your_api_key_here
DATAFORSEO_LOGIN=your_login_here
DATAFORSEO_PASSWORD=your_password_here
```

Or export them in your shell:
```bash
export KEYWORDS_EVERYWHERE_API_KEY="your_api_key_here"
export DATAFORSEO_LOGIN="your_login_here"
export DATAFORSEO_PASSWORD="your_password_here"
```

## Installation

No installation needed! All scripts use Node.js built-in modules and native fetch.

Requirements:
- Node.js 18+ (for native fetch support)

## Scripts

### 1. keyword-research.mjs

Discovers keyword opportunities using Keywords Everywhere API.

**Usage:**
```bash
# Use default seed keywords from config.json
node keyword-research.mjs

# Use custom seed keywords
node keyword-research.mjs "AI hiring compliance" "bias audit" "AEDT compliance"
```

**What it does:**
- Fetches metrics for seed keywords (volume, CPC, competition)
- Discovers related keywords
- Finds "people also search for" keywords
- Calculates opportunity scores
- Outputs sorted keyword universe

**Output:**
- `seo-analysis/keyword-research-TIMESTAMP.json`

### 2. serp-analyzer.mjs

Analyzes SERP rankings and identifies gaps using DataForSEO.

**Usage:**
```bash
# Analyze top 50 keywords from keyword research
node serp-analyzer.mjs path/to/keyword-research.json

# Analyze specific number of keywords
node serp-analyzer.mjs path/to/keyword-research.json 100

# Use default seed keywords
node serp-analyzer.mjs
```

**What it does:**
- Checks SERP rankings for each keyword
- Identifies where competitors rank
- Finds SERP features (featured snippets, PAA, etc.)
- Calculates gap opportunities
- Outputs SERP data and gap analysis

**Output:**
- `seo-analysis/serp-analysis-TIMESTAMP.json`

### 3. competitor-backlinks.mjs

Discovers backlink opportunities using DataForSEO Backlinks API.

**Usage:**
```bash
# Use default competitors from config.json
node competitor-backlinks.mjs

# Use custom competitors
node competitor-backlinks.mjs clio.com littler.com shrm.org
```

**What it does:**
- Finds sites linking to competitors but not to us
- Analyzes domain authority and backlink profiles
- Calculates opportunity scores
- Generates outreach list with contact URLs

**Output:**
- `seo-analysis/backlink-opportunities-TIMESTAMP.json`
- `seo-analysis/backlink-outreach-TIMESTAMP.csv`

### 4. content-cluster.mjs

Clusters keywords and generates content calendar.

**Usage:**
```bash
node content-cluster.mjs path/to/keyword-research.json
```

**What it does:**
- Clusters keywords by topical relevance
- Maps clusters to existing pages
- Identifies content gaps
- Generates prioritized content calendar
- Recommends new content and optimizations

**Output:**
- `seo-analysis/content-clusters-TIMESTAMP.json`
- `seo-analysis/content-calendar-TIMESTAMP.md`

### 5. internal-linking.mjs

Analyzes pages and recommends internal linking opportunities.

**Usage:**
```bash
# Without content clusters
node internal-linking.mjs

# With content clusters
node internal-linking.mjs path/to/content-clusters.json
```

**What it does:**
- Scans all marketing pages
- Extracts existing internal links
- Calculates page relevance scores
- Recommends new internal links with anchor text
- Generates linking map

**Output:**
- `seo-analysis/internal-linking-map-TIMESTAMP.json`
- `seo-analysis/internal-linking-recommendations-TIMESTAMP.md`

### 6. technical-audit.mjs

Performs technical SEO audit using DataForSEO On-Page API.

**Usage:**
```bash
# Audit production site
node technical-audit.mjs

# Audit custom URL
node technical-audit.mjs https://employarmor.com

# Audit localhost
node technical-audit.mjs http://localhost:3000
```

**What it does:**
- Crawls the site
- Identifies technical SEO issues
- Checks for missing meta tags, broken links, thin content
- Analyzes page speed and load times
- Generates fix recommendations

**Output:**
- `seo-analysis/technical-audit-TIMESTAMP.json`
- `seo-analysis/technical-audit-report-TIMESTAMP.md`

### 7. run-pipeline.mjs

Orchestrator that runs all steps in sequence.

**Usage:**
```bash
# Run full pipeline with defaults
node run-pipeline.mjs

# Customize seed keywords and competitors
node run-pipeline.mjs \
  --seed-keywords "AI compliance,bias audit,AEDT" \
  --competitors "clio.com,littler.com"

# Skip specific steps
node run-pipeline.mjs --skip technical-audit,competitor-backlinks

# Dry run (see what would execute)
node run-pipeline.mjs --dry-run

# Audit localhost instead of production
node run-pipeline.mjs --target-url http://localhost:3000
```

**What it does:**
- Runs all pipeline steps in order
- Passes data between steps automatically
- Generates comprehensive final report
- Tracks timing and success/failure

**Output:**
- `seo-analysis/TIMESTAMP/pipeline-results.json`
- `seo-analysis/TIMESTAMP/REPORT.md`
- All individual step outputs in timestamped directory

## Configuration

Edit `config.json` to customize:

```json
{
  "domain": "employarmor.com",
  "seedKeywords": ["AI hiring compliance", "..."],
  "competitors": ["clio.com", "..."],
  "rateLimits": {
    "keywordsEverywhere": {
      "requestsPerMinute": 60,
      "delayMs": 1000
    },
    "dataForSEO": {
      "requestsPerMinute": 20,
      "delayMs": 3000
    }
  }
}
```

## Workflow

### Option 1: Full Pipeline (Recommended)

Run everything at once:
```bash
node run-pipeline.mjs
```

This will:
1. Research keywords
2. Analyze SERPs
3. Find backlink opportunities
4. Cluster content
5. Analyze internal linking
6. Audit technical SEO
7. Generate comprehensive report

### Option 2: Step-by-Step

Run individual steps for more control:

```bash
# 1. Research keywords
node keyword-research.mjs

# 2. Analyze SERPs (pass keyword research file)
node serp-analyzer.mjs seo-analysis/keyword-research-2024-01-15T12-00-00.json

# 3. Find backlink gaps
node competitor-backlinks.mjs

# 4. Cluster content (pass keyword research file)
node content-cluster.mjs seo-analysis/keyword-research-2024-01-15T12-00-00.json

# 5. Analyze internal linking
node internal-linking.mjs seo-analysis/content-clusters-2024-01-15T12-05-00.json

# 6. Technical audit
node technical-audit.mjs
```

## Output Directory Structure

```
seo-analysis/
├── keyword-research-TIMESTAMP.json
├── serp-analysis-TIMESTAMP.json
├── backlink-opportunities-TIMESTAMP.json
├── backlink-outreach-TIMESTAMP.csv
├── content-clusters-TIMESTAMP.json
├── content-calendar-TIMESTAMP.md
├── internal-linking-map-TIMESTAMP.json
├── internal-linking-recommendations-TIMESTAMP.md
├── technical-audit-TIMESTAMP.json
├── technical-audit-report-TIMESTAMP.md
└── TIMESTAMP/
    ├── pipeline-results.json
    └── REPORT.md
```

## Rate Limits

The pipeline respects API rate limits:

- **Keywords Everywhere**: 1 request per second (60/min)
- **DataForSEO**: 1 request per 3 seconds (20/min)

Rate limits can be adjusted in `config.json`.

## Error Handling

All scripts include:
- Try-catch error handling
- Graceful failures
- Error logging
- Partial result saving (if step fails mid-execution)

## Examples

### Example 1: Quick Keyword Research

```bash
node keyword-research.mjs "AI bias audit" "NYC Local Law 144"
```

### Example 2: Audit Localhost Before Deploy

```bash
npm run build
npm run start &
node technical-audit.mjs http://localhost:3000
```

### Example 3: Custom Competitor Analysis

```bash
node competitor-backlinks.mjs clio.com smokeball.com littler.com
```

### Example 4: Content Gap Analysis Only

```bash
# First get keywords
node keyword-research.mjs

# Then cluster and find gaps
node content-cluster.mjs seo-analysis/keyword-research-*.json
```

## Tips

1. **Start with keyword research** - All other steps can use this data
2. **Run SERP analysis on top keywords** - Don't analyze all 1000+ keywords
3. **Review backlink opportunities manually** - Quality over quantity
4. **Prioritize content gaps** - Focus on high-volume, low-competition gaps
5. **Implement internal linking gradually** - Start with high-priority recommendations
6. **Fix critical technical issues first** - Then move to high/medium priority

## Troubleshooting

### API Key Issues

**Error: API Error 401**
- Check that API keys are set correctly
- Verify keys are active and have credits

### Rate Limit Errors

**Error: API Error 429**
- Increase `delayMs` in config.json
- Reduce number of keywords analyzed

### Task Timeout (Technical Audit)

**Error: Task timeout - crawl did not complete**
- Site has many pages and crawl takes too long
- Reduce `max_crawl_pages` in technical-audit.mjs
- Try auditing specific sections instead of full site

### Missing Dependencies

**Error: Cannot find module**
- Ensure Node.js 18+ is installed (`node --version`)
- All scripts use native modules - no npm install needed

## API Costs

Estimated costs per full pipeline run:

- **Keywords Everywhere**: ~$0.10-0.50 (depends on keyword volume)
- **DataForSEO**: ~$5-10 (SERP tasks, backlinks, on-page audit)

**Total per run**: ~$5-10

💡 Tip: Use `--skip` flag to avoid re-running expensive steps during testing.

## Scheduling

Run pipeline weekly or monthly:

```bash
# Add to crontab (weekly on Sunday at 2am)
0 2 * * 0 cd /path/to/hireshield && node scripts/seo-pipeline/run-pipeline.mjs
```

## License

Internal use only - EmployArmor/HireShield project

## Support

For issues or questions, contact the development team.
