#!/bin/bash

# Process remaining 24 pages with competitor analysis
export GOOGLE_NLP_API_KEY="AIzaSyAZypQ2lVM0whm8Mo9EWTjGhMHx4ckk3C8"

cd /Users/henry/projects/hireshield

echo "Processing remaining 24 pages..."
echo "=================================="

# Page 6
echo -e "\n[6/24] greenhouse-ats-compliance"
node scripts/nlp-content-analyzer.mjs greenhouse-ats-compliance "https://www.greenhouse.com/blog/responsible-ai-in-recruiting"
sleep 3

# Page 7
echo -e "\n[7/24] ai-bias-audit-guide"
node scripts/nlp-content-analyzer.mjs ai-bias-audit-guide "https://www.shrm.org/topics-tools/news/technology/understanding-ai-bias-audits-nyc-law-144"
sleep 3

# Page 8
echo -e "\n[8/24] ai-hiring-laws-by-state"
node scripts/nlp-content-analyzer.mjs ai-hiring-laws-by-state "https://www.natlawreview.com/article/state-state-guide-to-ai-employment-laws"
sleep 3

# Page 9
echo -e "\n[9/24] nyc-local-law-144"
node scripts/nlp-content-analyzer.mjs nyc-local-law-144 "https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page"
sleep 3

# Page 10
echo -e "\n[10/24] illinois-aivia-compliance-guide"
node scripts/nlp-content-analyzer.mjs illinois-aivia-compliance-guide "https://www2.illinois.gov/sites/dhr/Training/Pages/AIVIA.aspx"
sleep 3

# Page 11
echo -e "\n[11/24] california-ccpa-admt"
node scripts/nlp-content-analyzer.mjs california-ccpa-admt "https://oag.ca.gov/privacy/ccpa"
sleep 3

# Page 12
echo -e "\n[12/24] colorado-ai-act-employers"
node scripts/nlp-content-analyzer.mjs colorado-ai-act-employers "https://coag.gov/resources/colorado-ai-act/"
sleep 3

# Page 13
echo -e "\n[13/24] eeoc-ai-hiring-guidance"
node scripts/nlp-content-analyzer.mjs eeoc-ai-hiring-guidance "https://www.eeoc.gov/ai"
sleep 3

# Page 14
echo -e "\n[14/24] federal-ai-hiring-laws"
node scripts/nlp-content-analyzer.mjs federal-ai-hiring-laws "https://www.dol.gov/general/ai-policy"
sleep 3

# Page 15
echo -e "\n[15/24] eu-ai-act-hiring"
node scripts/nlp-content-analyzer.mjs eu-ai-act-hiring "https://artificialintelligenceact.eu/high-risk-ai-systems/"
sleep 3

# Page 16
echo -e "\n[16/24] what-counts-as-ai-hiring"
node scripts/nlp-content-analyzer.mjs what-counts-as-ai-hiring "https://www.shrm.org/topics-tools/news/technology/what-is-ai-hiring"
sleep 3

# Page 17
echo -e "\n[17/24] compliance-checklist-2026"
node scripts/nlp-content-analyzer.mjs compliance-checklist-2026 "https://www.natlawreview.com/article/ai-hiring-compliance-checklist-2026"
sleep 3

# Page 18
echo -e "\n[18/24] compliance-program-guide"
node scripts/nlp-content-analyzer.mjs compliance-program-guide "https://www.shrm.org/topics-tools/tools/toolkits/managing-ai-workplace"
sleep 3

# Page 19
echo -e "\n[19/24] vendor-assessment-guide"
node scripts/nlp-content-analyzer.mjs vendor-assessment-guide "https://www.gartner.com/en/human-resources/insights/ai-vendor-assessment"
sleep 3

# Page 20
echo -e "\n[20/24] hr-training-guide"
node scripts/nlp-content-analyzer.mjs hr-training-guide "https://www.shrm.org/certification/educators/pages/ai-hr-training.aspx"
sleep 3

# Page 21
echo -e "\n[21/24] ai-disclosure-notice-template"
node scripts/nlp-content-analyzer.mjs ai-disclosure-notice-template "https://www.workplacefairness.org/ai-disclosure-templates"
sleep 3

# Page 22
echo -e "\n[22/24] ai-disclosure-decision-tree"
node scripts/nlp-content-analyzer.mjs ai-disclosure-decision-tree "https://www.natlawreview.com/article/when-disclose-ai-use-hiring"
sleep 3

# Page 23
echo -e "\n[23/24] illinois-ai-hiring-law"
node scripts/nlp-content-analyzer.mjs illinois-ai-hiring-law "https://www2.illinois.gov/sites/dhr/Training/Pages/AIVIA.aspx"
sleep 3

# Page 24
echo -e "\n[24/24] maryland-ai-hiring-law"
node scripts/nlp-content-analyzer.mjs maryland-ai-hiring-law "https://mgaleg.maryland.gov/mgawebsite/Legislation/Details/HB1202"
sleep 3

# Page 25
echo -e "\n[25/24] texas-ai-hiring-law"
node scripts/nlp-content-analyzer.mjs texas-ai-hiring-law "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=88R&Bill=HB2060"
sleep 3

# Page 26
echo -e "\n[26/24] washington-ai-hiring-law"
node scripts/nlp-content-analyzer.mjs washington-ai-hiring-law "https://lawfilesext.leg.wa.gov/biennium/2023-24/Pdf/Bills/Senate%20Bills/5116.pdf"
sleep 3

# Page 27
echo -e "\n[27/24] employarmor-vs-manual-compliance"
node scripts/nlp-content-analyzer.mjs employarmor-vs-manual-compliance "https://www.capterra.com/compliance-software/"
sleep 3

# Page 28
echo -e "\n[28/24] employarmor-vs-consultants"
node scripts/nlp-content-analyzer.mjs employarmor-vs-consultants "https://www.clutch.co/hr/compliance"
sleep 3

# Page 29
echo -e "\n[29/24] faq"
node scripts/nlp-content-analyzer.mjs faq "https://www.shrm.org/topics-tools/news/technology/ai-hiring-faqs"

echo -e "\n\n✅ All 24 remaining pages processed!"
