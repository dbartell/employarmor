# SEO Pipeline Quick Start

## 1. Set Up API Keys

Get your API keys:
- Keywords Everywhere: https://keywordseverywhere.com/api
- DataForSEO: https://dataforseo.com

Add to `.env.local`:
```bash
KEYWORDS_EVERYWHERE_API_KEY=your_api_key_here
DATAFORSEO_LOGIN=your_login_here
DATAFORSEO_PASSWORD=your_password_here
```

## 2. Load Environment Variables

```bash
# From project root
export $(cat .env.local | grep -v '^#' | xargs)
```

Or use `dotenv`:
```bash
npx dotenv-cli node scripts/seo-pipeline/run-pipeline.mjs
```

## 3. Run the Pipeline

### Full Pipeline (Recommended)
```bash
cd /Users/henry/projects/hireshield
node scripts/seo-pipeline/run-pipeline.mjs
```

### Individual Steps
```bash
# 1. Keyword Research
node scripts/seo-pipeline/keyword-research.mjs

# 2. SERP Analysis
node scripts/seo-pipeline/serp-analyzer.mjs seo-analysis/keyword-research-*.json

# 3. Backlink Analysis
node scripts/seo-pipeline/competitor-backlinks.mjs

# 4. Content Clustering
node scripts/seo-pipeline/content-cluster.mjs seo-analysis/keyword-research-*.json

# 5. Internal Linking
node scripts/seo-pipeline/internal-linking.mjs

# 6. Technical Audit
node scripts/seo-pipeline/technical-audit.mjs
```

## 4. Review Results

Results are saved to `seo-analysis/` directory:
- Keyword research data
- SERP analysis and gap opportunities
- Backlink outreach list (CSV)
- Content calendar (Markdown)
- Internal linking recommendations
- Technical audit report

Full pipeline report: `seo-analysis/TIMESTAMP/REPORT.md`

## 5. Take Action

1. **Immediate (Week 1)**
   - Fix critical technical issues
   - Create content for top 3 gap opportunities
   - Implement high-priority internal links

2. **Short-term (Month 1)**
   - Launch backlink outreach campaign
   - Publish new content from calendar
   - Fix high-priority technical issues

3. **Ongoing**
   - Monitor rankings for target keywords
   - Continue content creation from calendar
   - Re-run pipeline monthly to track progress

## Tips

- Start with dry run: `node run-pipeline.mjs --dry-run`
- Skip expensive steps during testing: `--skip technical-audit,serp-analyzer`
- Use custom keywords: `--seed-keywords "keyword1,keyword2,keyword3"`
- Review backlink opportunities manually - quality over quantity!

## Troubleshooting

**API errors?**
- Verify API keys are correct
- Check you have credits/active subscription

**Rate limit errors?**
- Increase delay in `config.json`
- Run fewer keywords at once

**Technical audit timeout?**
- Site may have too many pages
- Reduce `max_crawl_pages` in technical-audit.mjs

## Need Help?

See full documentation: `README.md`
