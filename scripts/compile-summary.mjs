#!/usr/bin/env node

/**
 * Compile Summary Report from all NLP analysis JSON files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ANALYSIS_DIR = path.join(PROJECT_ROOT, 'content-analysis');
const SUMMARY_PATH = path.join(ANALYSIS_DIR, 'SUMMARY.md');

// Read all JSON files
const files = fs.readdirSync(ANALYSIS_DIR).filter(f => f.endsWith('.json'));

console.log(`📊 Compiling summary from ${files.length} analyses...`);

const analyses = files.map(file => {
  const content = fs.readFileSync(path.join(ANALYSIS_DIR, file), 'utf-8');
  return JSON.parse(content);
});

// Calculate overall metrics
const totalWordCount = analyses.reduce((sum, a) => sum + (a.wordCount || 0), 0);
const avgWordCount = Math.round(totalWordCount / analyses.length);

// Entity gap analysis - find most common missing entities across all pages
const allMissingEntities = new Map();

analyses.forEach(analysis => {
  if (analysis.recommendations) {
    const entityGaps = analysis.recommendations.find(r => r.type === 'entity_gaps');
    if (entityGaps && entityGaps.entities) {
      entityGaps.entities.forEach(entity => {
        const key = entity.name.toLowerCase();
        if (!allMissingEntities.has(key)) {
          allMissingEntities.set(key, {
            name: entity.name,
            type: entity.type,
            occurrences: 0,
            avgSalience: 0,
            totalSalience: 0
          });
        }
        const entry = allMissingEntities.get(key);
        entry.occurrences++;
        entry.totalSalience += parseFloat(entity.salience);
        entry.avgSalience = entry.totalSalience / entry.occurrences;
      });
    }
  }
});

// Sort by occurrence frequency
const topMissingEntities = Array.from(allMissingEntities.values())
  .sort((a, b) => b.occurrences - a.occurrences)
  .slice(0, 20);

// Calculate entity coverage scores
const pageScores = analyses.map(analysis => {
  const ourEntityCount = analysis.topEntities?.length || 0;
  const competitorEntityCount = analysis.competitor?.entities?.entities?.length || 0;
  
  let coverage = 0;
  if (competitorEntityCount > 0) {
    coverage = (ourEntityCount / competitorEntityCount) * 100;
  }
  
  const categoryMatch = analysis.topCategories?.length > 0;
  const hasRecommendations = analysis.recommendations?.length || 0;
  
  return {
    slug: analysis.slug,
    wordCount: analysis.wordCount,
    entityCoverage: coverage.toFixed(1),
    categoryMatch: categoryMatch ? '✓' : '✗',
    recommendations: hasRecommendations,
    priority: hasRecommendations >= 2 ? 'HIGH' : hasRecommendations === 1 ? 'MEDIUM' : 'LOW'
  };
}).sort((a, b) => parseFloat(a.entityCoverage) - parseFloat(b.entityCoverage));

// Calculate overall health score (0-100)
const avgEntityCoverage = pageScores.reduce((sum, p) => sum + parseFloat(p.entityCoverage), 0) / pageScores.length;
const pagesWithCategories = pageScores.filter(p => p.categoryMatch === '✓').length;
const categoryScore = (pagesWithCategories / pageScores.length) * 100;
const healthScore = Math.round((avgEntityCoverage * 0.6) + (categoryScore * 0.4));

// Top 10 recommendations by impact
const allRecommendations = [];
analyses.forEach(analysis => {
  if (analysis.recommendations) {
    analysis.recommendations.forEach(rec => {
      allRecommendations.push({
        slug: analysis.slug,
        type: rec.type,
        priority: rec.priority,
        message: rec.message,
        entityCount: rec.entities?.length || 0
      });
    });
  }
});

// Group recommendations by type and priority
const recMap = new Map();
allRecommendations.forEach(rec => {
  const key = `${rec.type}-${rec.priority}`;
  if (!recMap.has(key)) {
    recMap.set(key, {
      type: rec.type,
      priority: rec.priority,
      message: rec.message,
      affectedPages: [],
      totalImpact: 0
    });
  }
  const entry = recMap.get(key);
  entry.affectedPages.push(rec.slug);
  entry.totalImpact += rec.entityCount;
});

const top10Recommendations = Array.from(recMap.values())
  .sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority === 'high' ? -1 : 1;
    }
    return b.affectedPages.length - a.affectedPages.length;
  })
  .slice(0, 10);

// Generate markdown
let markdown = fs.readFileSync(SUMMARY_PATH, 'utf-8');

// Replace placeholders
markdown = markdown.replace('[CALCULATING...]', `${healthScore}/100`);

// Add top missing entities
const missingEntitiesTable = topMissingEntities.map((e, i) => 
  `${i+1}. **${e.name}** (${e.type}) - Missing in ${e.occurrences} pages, avg salience: ${e.avgSalience.toFixed(3)}`
).join('\n');
markdown = markdown.replace('[TO BE POPULATED]', missingEntitiesTable);

// Add bottom 10 pages
const bottom10Table = pageScores.slice(0, 10).map((p, i) => 
  `${i+1}. **${p.slug}** - ${p.entityCoverage}% coverage, ${p.recommendations} recommendations`
).join('\n');
markdown = markdown.replace('[TO BE POPULATED]', bottom10Table);

// Add top 10 recommendations
const recommendationsSection = top10Recommendations.map((rec, i) => `
### ${i+1}. ${rec.message}
**Impact:** ${rec.priority}  
**Affected Pages:** ${rec.affectedPages.length}  
**Pages:** ${rec.affectedPages.slice(0, 5).join(', ')}${rec.affectedPages.length > 5 ? `, +${rec.affectedPages.length - 5} more` : ''}  
**Action:** ${rec.type === 'entity_gaps' ? 'Add missing entities to improve topical coverage' : rec.type === 'salience_optimization' ? 'Adjust emphasis on key entities' : 'Align content categories with competitors'}
`).join('\n');
markdown = markdown.replace('[TO BE POPULATED WITH TOP 10]', recommendationsSection);

// Add per-page table
const pageTable = pageScores.map(p => 
  `| ${p.slug} | ${p.wordCount} | ${p.entityCoverage}% | ${p.categoryMatch} | ${p.recommendations} recs | ${p.priority} |`
).join('\n');
markdown = markdown.replace('[TO BE POPULATED]', pageTable);

// Write final summary
fs.writeFileSync(SUMMARY_PATH, markdown);

console.log('\n✅ Summary compiled successfully!');
console.log(`\n📈 Overall Health Score: ${healthScore}/100`);
console.log(`📝 Average Word Count: ${avgWordCount}`);
console.log(`🎯 Top Missing Entity: ${topMissingEntities[0]?.name} (${topMissingEntities[0]?.occurrences} pages)`);
console.log(`⚠️  Pages Needing Attention: ${pageScores.filter(p => p.priority === 'HIGH').length}`);
console.log(`\n📄 Full summary: ${SUMMARY_PATH}`);
