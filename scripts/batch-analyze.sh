#!/bin/bash

# Batch process all remaining pages with rate limiting
# API Key for Google NLP
export GOOGLE_NLP_API_KEY="AIzaSyAZypQ2lVM0whm8Mo9EWTjGhMHx4ckk3C8"

cd /Users/henry/projects/hireshield

# Array of remaining pages and their competitor URLs
declare -A pages=(
  ["indeed-ai-compliance"]="https://www.indeed.com/hire/c/info/ai-hiring-compliance"
  ["linkedin-recruiter-ai-compliance"]="https://business.linkedin.com/talent-solutions/resources/talent-acquisition/ai-recruiting"
  ["greenhouse-ats-compliance"]="https://www.greenhouse.com/blog/greenhouse-ai-compliance"
  ["ai-bias-audit-guide"]="https://www.shrm.org/topics-tools/news/technology/understanding-ai-bias-audits-nyc-law-144"
  ["ai-hiring-laws-by-state"]="https://www.natlawreview.com/article/state-state-guide-to-ai-employment-laws"
  ["nyc-local-law-144"]="https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page"
  ["illinois-aivia-compliance-guide"]="https://www2.illinois.gov/sites/dhr/Training/Pages/AIVIA.aspx"
  ["california-ccpa-admt"]="https://oag.ca.gov/privacy/ccpa"
  ["colorado-ai-act-employers"]="https://coag.gov/resources/colorado-ai-act/"
  ["eeoc-ai-hiring-guidance"]="https://www.eeoc.gov/ai"
  ["federal-ai-hiring-laws"]="https://www.dol.gov/general/ai-policy"
  ["eu-ai-act-hiring"]="https://artificialintelligenceact.eu/high-risk-ai-systems/"
  ["what-counts-as-ai-hiring"]="https://www.shrm.org/topics-tools/news/technology/what-is-ai-hiring"
  ["compliance-checklist-2026"]="https://www.natlawreview.com/article/ai-hiring-compliance-checklist-2026"
  ["compliance-program-guide"]="https://www.shrm.org/topics-tools/tools/toolkits/managing-ai-workplace"
  ["vendor-assessment-guide"]="https://www.gartner.com/en/human-resources/insights/ai-vendor-assessment"
  ["hr-training-guide"]="https://www.shrm.org/certification/educators/pages/ai-hr-training.aspx"
  ["ai-disclosure-notice-template"]="https://www.workplacefairness.org/ai-disclosure-templates"
  ["ai-disclosure-decision-tree"]="https://www.natlawreview.com/article/when-disclose-ai-use-hiring"
  ["illinois-ai-hiring-law"]="https://www2.illinois.gov/sites/dhr/Training/Pages/AIVIA.aspx"
  ["maryland-ai-hiring-law"]="https://mgaleg.maryland.gov/mgawebsite/Legislation/Details/HB1202"
  ["texas-ai-hiring-law"]="https://capitol.texas.gov/BillLookup/History.aspx?LegSess=88R&Bill=HB2060"
  ["washington-ai-hiring-law"]="https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bills/Senate%20Bills/5116.pdf"
  ["employarmor-vs-manual-compliance"]="https://www.capterra.com/compliance-software/"
  ["employarmor-vs-consultants"]="https://www.clutch.co/hr/compliance"
  ["faq"]="https://www.shrm.org/topics-tools/news/technology/ai-hiring-faqs"
)

echo "Starting batch analysis of ${#pages[@]} pages..."
echo "=============================================="

for slug in "${!pages[@]}"; do
  url="${pages[$slug]}"
  echo ""
  echo "Processing: $slug"
  echo "Competitor: $url"
  
  # Run analyzer
  node scripts/nlp-content-analyzer.mjs "$slug" "$url"
  
  # Wait 3 seconds between pages to respect API rate limits
  echo "Waiting 3 seconds before next page..."
  sleep 3
done

echo ""
echo "✅ Batch analysis complete!"
echo "Processed ${#pages[@]} pages"
