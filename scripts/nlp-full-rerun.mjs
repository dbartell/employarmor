#!/usr/bin/env node

/**
 * Full NLP Re-run: Analyzes ALL content pages across resources, blog, comparisons, tools
 * Saves to content-analysis/post-optimization-scores/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GOOGLE_NLP_API_KEY || 'AIzaSyAZypQ2lVM0whm8Mo9EWTjGhMHx4ckk3C8';
const BASE_URL = 'https://language.googleapis.com/v1/documents';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MARKETING_DIR = path.join(PROJECT_ROOT, 'src/app/(marketing)');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'content-analysis/post-optimization-scores');

// Content directories to scan
const CONTENT_DIRS = [
  'resources',
  'blog',
  'comparisons',
  'tools',
];

// Index/listing pages to skip
const SKIP_SLUGS = new Set([
  'resources/page.tsx',
  'resources/guides/page.tsx', 
  'resources/templates/page.tsx',
  'blog/page.tsx',
  'tools/page.tsx',
  'tools/directory/page.tsx',
  'tools/directory/[slug]/page.tsx',
  'comparisons/page.tsx',
]);

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function extractTextFromTSX(tsxContent) {
  let text = tsxContent;
  text = text.replace(/\/\*[\s\S]*?\*\//g, '');
  text = text.replace(/\/\/.*/g, '');
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  text = text.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
  text = text.replace(/export\s+(const|default|function|class)\s+[\s\S]*?\{/g, '');
  text = text.replace(/export\s+const\s+\w+\s*=\s*\{[\s\S]*?\}/g, '');
  text = text.replace(/className=["'][^"']*["']/g, '');
  text = text.replace(/\bhref=["'][^"']*["']/g, '');
  text = text.replace(/<\w+[^>]*\/>/g, ' ');
  text = text.replace(/<\w+[^>]*>/g, ' ');
  text = text.replace(/<\/\w+>/g, ' ');
  text = text.replace(/\{[^}]+\}/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

async function callNLP(text, endpoint) {
  const url = `${BASE_URL}:${endpoint}?key=${API_KEY}`;
  const payload = {
    document: { type: 'PLAIN_TEXT', content: text.substring(0, 100000) }
  };
  if (endpoint !== 'classifyText') payload.encodingType = 'UTF8';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`  API error (${endpoint}): ${response.status} - ${error.substring(0, 200)}`);
    return null;
  }
  return await response.json();
}

function computeScore(analysis) {
  let score = 0;
  const wordCount = analysis.wordCount || 0;
  const entityCount = (analysis.entities?.entities || []).length;
  const categoryCount = (analysis.categories?.categories || []).length;
  const topEntities = analysis.topEntities || [];
  
  // Word count score (0-25)
  if (wordCount >= 2500) score += 25;
  else if (wordCount >= 1500) score += 20;
  else if (wordCount >= 1000) score += 15;
  else if (wordCount >= 500) score += 10;
  else score += 5;

  // Entity richness (0-25)
  if (entityCount >= 80) score += 25;
  else if (entityCount >= 50) score += 20;
  else if (entityCount >= 30) score += 15;
  else if (entityCount >= 15) score += 10;
  else score += 5;

  // Category classification (0-25)
  if (categoryCount >= 3) score += 25;
  else if (categoryCount >= 2) score += 20;
  else if (categoryCount >= 1) score += 15;
  else score += 5;

  // Entity diversity & salience (0-25)
  const entityTypes = new Set(topEntities.map(e => e.type));
  if (entityTypes.size >= 4) score += 15;
  else if (entityTypes.size >= 3) score += 10;
  else if (entityTypes.size >= 2) score += 7;
  else score += 3;

  // High-salience entities
  const highSalience = topEntities.filter(e => parseFloat(e.salience) > 0.05).length;
  if (highSalience >= 5) score += 10;
  else if (highSalience >= 3) score += 7;
  else if (highSalience >= 1) score += 4;
  else score += 2;

  return Math.min(100, score);
}

function findAllContentPages() {
  const pages = [];
  
  for (const dir of CONTENT_DIRS) {
    const fullDir = path.join(MARKETING_DIR, dir);
    if (!fs.existsSync(fullDir)) {
      console.log(`  Directory not found: ${dir} (skipping)`);
      continue;
    }
    
    function walk(d) {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('[')) {
          const pagePath = path.join(d, entry.name, 'page.tsx');
          if (fs.existsSync(pagePath)) {
            const relPath = path.relative(MARKETING_DIR, pagePath);
            if (!SKIP_SLUGS.has(relPath)) {
              const slug = path.relative(MARKETING_DIR, path.join(d, entry.name));
              pages.push({ slug, pagePath, section: dir });
            }
          }
          walk(path.join(d, entry.name));
        }
      }
    }
    
    walk(fullDir);
  }
  
  return pages;
}

async function analyzePage(pageInfo) {
  const { slug, pagePath, section } = pageInfo;
  const shortSlug = slug.replace(/^(resources|blog|comparisons|tools)\//, '');
  
  console.log(`\n📊 [${section}] ${shortSlug}`);
  
  const tsxContent = fs.readFileSync(pagePath, 'utf-8');
  const text = extractTextFromTSX(tsxContent);
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  
  console.log(`   ${wordCount} words extracted`);
  
  if (wordCount < 20) {
    console.log(`   ⚠️ Too little content, skipping NLP calls`);
    return { slug, shortSlug, section, wordCount, score: 5, entities: null, categories: null, topEntities: [], topCategories: [] };
  }

  const [entities, entitySentiment, categories] = await Promise.all([
    callNLP(text, 'analyzeEntities'),
    callNLP(text, 'analyzeEntitySentiment'),
    callNLP(text, 'classifyText'),
  ]);

  const analysis = {
    slug,
    shortSlug,
    section,
    analyzedAt: new Date().toISOString(),
    wordCount,
    entities,
    entitySentiment,
    categories,
    topEntities: entities?.entities
      ?.sort((a, b) => b.salience - a.salience)
      .slice(0, 10)
      .map(e => ({ name: e.name, type: e.type, salience: e.salience.toFixed(3) })) || [],
    topCategories: categories?.categories
      ?.map(c => ({ name: c.name, confidence: c.confidence.toFixed(3) })) || [],
  };

  analysis.score = computeScore(analysis);
  console.log(`   Score: ${analysis.score}/100 | ${(entities?.entities||[]).length} entities | ${(categories?.categories||[]).length} categories`);

  // Save
  const outputFile = path.join(OUTPUT_DIR, `${shortSlug}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));

  return analysis;
}

async function main() {
  console.log('🚀 Full NLP Content Re-Analysis');
  console.log('================================\n');

  const pages = findAllContentPages();
  console.log(`Found ${pages.length} content pages\n`);

  const results = [];
  for (const page of pages) {
    const result = await analyzePage(page);
    if (result) results.push(result);
    // Rate limit: 3 API calls per page, ~600 req/min limit
    await new Promise(r => setTimeout(r, 500));
  }

  // Load old scores for comparison
  const oldDir = path.join(PROJECT_ROOT, 'content-analysis');
  const oldScores = {};
  for (const f of fs.readdirSync(oldDir).filter(f => f.endsWith('.json'))) {
    const slug = f.replace('.json', '');
    try {
      const data = JSON.parse(fs.readFileSync(path.join(oldDir, f)));
      oldScores[slug] = {
        wordCount: data.wordCount || 0,
        entityCount: (data.entities?.entities || []).length,
        categoryCount: (data.categories?.categories || []).length,
        score: computeScore(data),
      };
    } catch {}
  }

  // Build summary
  let totalOld = 0, totalNew = 0, compared = 0;
  const rows = results.map(r => {
    const old = oldScores[r.shortSlug];
    const oldScore = old ? old.score : null;
    if (oldScore !== null) { totalOld += oldScore; totalNew += r.score; compared++; }
    return {
      page: r.shortSlug,
      section: r.section,
      oldScore,
      newScore: r.score,
      change: oldScore !== null ? r.score - oldScore : null,
      wordCount: r.wordCount,
      entityCount: (r.entities?.entities || []).length,
    };
  }).sort((a, b) => (b.change || 0) - (a.change || 0));

  const avgOld = compared > 0 ? (totalOld / compared).toFixed(1) : 'N/A';
  const avgNew = compared > 0 ? (totalNew / compared).toFixed(1) : 'N/A';

  let md = `# Post-Optimization NLP Content Scores

**Analysis Date:** ${new Date().toISOString().split('T')[0]}
**Pages Analyzed:** ${results.length}
**Scoring Method:** Google Cloud NLP (entities + categories + word count + diversity)

---

## Overall Score

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Average Score | ${avgOld}/100 | ${avgNew}/100 | ${compared > 0 ? ((totalNew - totalOld) / compared).toFixed(1) : 'N/A'} |
| Pages Compared | ${compared} | ${compared} | - |

---

## Per-Page Breakdown

| Page | Section | Old Score | New Score | Change | Words | Entities |
|------|---------|-----------|-----------|--------|-------|----------|
${rows.map(r => `| ${r.page} | ${r.section} | ${r.oldScore ?? 'N/A'} | ${r.newScore} | ${r.change !== null ? (r.change >= 0 ? '+' : '') + r.change : 'NEW'} | ${r.wordCount} | ${r.entityCount} |`).join('\n')}

---

## Top Improvers

${rows.filter(r => r.change !== null && r.change > 0).slice(0, 10).map((r, i) => `${i+1}. **${r.page}** — ${r.oldScore} → ${r.newScore} (+${r.change})`).join('\n')}

## Pages That Need Work (Score < 60)

${rows.filter(r => r.newScore < 60).map(r => `- **${r.page}** (${r.newScore}/100) — ${r.wordCount} words`).join('\n') || 'None! All pages score 60+'}

## Score Distribution

- **80-100:** ${rows.filter(r => r.newScore >= 80).length} pages
- **60-79:** ${rows.filter(r => r.newScore >= 60 && r.newScore < 80).length} pages
- **40-59:** ${rows.filter(r => r.newScore >= 40 && r.newScore < 60).length} pages
- **< 40:** ${rows.filter(r => r.newScore < 40).length} pages
`;

  const summaryPath = path.join(OUTPUT_DIR, 'SUMMARY.md');
  fs.writeFileSync(summaryPath, md);
  console.log(`\n✅ Summary saved to ${summaryPath}`);
  console.log(`📊 Average: ${avgOld} → ${avgNew}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
