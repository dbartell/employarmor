#!/usr/bin/env node

/**
 * content-cluster.mjs
 * 
 * Takes keyword research output and:
 * - Clusters keywords by topical relevance
 * - Identifies pillar topics and supporting subtopics
 * - Maps to existing pages on the site
 * - Identifies content gaps
 * - Generates prioritized content calendar
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

/**
 * Calculate semantic similarity using simple word overlap
 * (In production, you'd use embeddings API like OpenAI)
 */
function calculateSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  // Jaccard similarity
  return intersection.size / union.size;
}

/**
 * Extract existing pages from marketing directory
 */
function getExistingPages() {
  const pages = [];
  const marketingDir = config.marketingPagesDir;

  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory() && !item.startsWith('.') && !item.startsWith('_')) {
        scanDirectory(fullPath, path.join(basePath, item));
      } else if (item === 'page.tsx') {
        // Extract page metadata
        const content = fs.readFileSync(fullPath, 'utf8');
        const title = extractTitle(content);
        const description = extractDescription(content);
        const headings = extractHeadings(content);
        
        pages.push({
          path: basePath || '/',
          fullPath,
          title,
          description,
          headings,
          url: `https://${config.domain}${basePath}`
        });
      }
    });
  }

  if (fs.existsSync(marketingDir)) {
    scanDirectory(marketingDir);
  }

  return pages;
}

/**
 * Extract title from page content
 */
function extractTitle(content) {
  // Look for <h1> or title metadata
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const titleMatch = content.match(/title:\s*['"](.*?)['"]/i);
  const metaTitleMatch = content.match(/metadata\s*=\s*{[^}]*title:\s*['"](.*?)['"]/s);
  
  return h1Match?.[1] || titleMatch?.[1] || metaTitleMatch?.[1] || 'Untitled';
}

/**
 * Extract description from page content
 */
function extractDescription(content) {
  const descMatch = content.match(/description:\s*['"](.*?)['"]/i);
  const metaDescMatch = content.match(/metadata\s*=\s*{[^}]*description:\s*['"](.*?)['"]/s);
  
  return descMatch?.[1] || metaDescMatch?.[1] || '';
}

/**
 * Extract headings from page content
 */
function extractHeadings(content) {
  const headings = [];
  const h2Matches = content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi);
  const h3Matches = content.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi);
  
  for (const match of h2Matches) {
    headings.push(match[1].replace(/<[^>]*>/g, ''));
  }
  for (const match of h3Matches) {
    headings.push(match[1].replace(/<[^>]*>/g, ''));
  }
  
  return headings;
}

/**
 * Cluster keywords by topic similarity
 */
function clusterKeywords(keywords, similarityThreshold = 0.3) {
  const clusters = [];
  const assigned = new Set();

  keywords.forEach(kw => {
    if (assigned.has(kw.keyword)) return;

    // Create new cluster
    const cluster = {
      pillarKeyword: kw.keyword,
      pillarVolume: kw.volume,
      keywords: [kw],
      totalVolume: kw.volume,
      avgCompetition: kw.competition,
      topics: extractTopics(kw.keyword)
    };

    assigned.add(kw.keyword);

    // Find similar keywords
    keywords.forEach(otherKw => {
      if (assigned.has(otherKw.keyword)) return;

      const similarity = calculateSimilarity(kw.keyword, otherKw.keyword);
      
      if (similarity >= similarityThreshold) {
        cluster.keywords.push(otherKw);
        cluster.totalVolume += otherKw.volume;
        assigned.add(otherKw.keyword);
      }
    });

    // Calculate average competition
    cluster.avgCompetition = Math.round(
      cluster.keywords.reduce((sum, k) => sum + k.competition, 0) / cluster.keywords.length
    );

    // Sort cluster keywords by volume
    cluster.keywords.sort((a, b) => b.volume - a.volume);

    clusters.push(cluster);
  });

  // Sort clusters by total volume
  clusters.sort((a, b) => b.totalVolume - a.totalVolume);

  return clusters;
}

/**
 * Extract topics from keyword
 */
function extractTopics(keyword) {
  const topics = [];
  const kw = keyword.toLowerCase();
  
  // Common topic patterns
  const topicPatterns = {
    'compliance': ['compliance', 'law', 'legal', 'regulation'],
    'audit': ['audit', 'assessment', 'evaluation'],
    'hiring': ['hiring', 'recruitment', 'employment'],
    'ai': ['ai', 'artificial intelligence', 'automated', 'algorithm'],
    'bias': ['bias', 'discrimination', 'fairness'],
    'disclosure': ['disclosure', 'transparency', 'notice'],
    'state-law': ['nyc', 'illinois', 'colorado', 'maryland', 'california']
  };

  Object.entries(topicPatterns).forEach(([topic, patterns]) => {
    if (patterns.some(pattern => kw.includes(pattern))) {
      topics.push(topic);
    }
  });

  return topics;
}

/**
 * Map clusters to existing pages
 */
function mapClustersToPages(clusters, pages) {
  clusters.forEach(cluster => {
    let bestMatch = null;
    let bestScore = 0;

    pages.forEach(page => {
      // Check similarity with title, description, and headings
      const pageText = `${page.title} ${page.description} ${page.headings.join(' ')}`;
      const clusterText = cluster.keywords.map(kw => kw.keyword).join(' ');
      
      const score = calculateSimilarity(pageText, clusterText);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = page;
      }
    });

    if (bestScore > 0.2) { // Threshold for matching
      cluster.matchedPage = {
        path: bestMatch.path,
        url: bestMatch.url,
        title: bestMatch.title,
        matchScore: bestScore
      };
    } else {
      cluster.matchedPage = null; // Content gap!
    }
  });

  return clusters;
}

/**
 * Generate content calendar
 */
function generateContentCalendar(clusters) {
  const calendar = [];

  clusters.forEach((cluster, index) => {
    if (!cluster.matchedPage) {
      // This is a content gap - needs new content
      calendar.push({
        priority: calculatePriority(cluster, index),
        title: `Create: ${cluster.pillarKeyword}`,
        type: 'new',
        pillarKeyword: cluster.pillarKeyword,
        targetKeywords: cluster.keywords.slice(0, 10).map(kw => kw.keyword),
        estimatedTraffic: cluster.totalVolume,
        competition: cluster.avgCompetition,
        topics: cluster.topics,
        suggestedUrl: `/${cluster.pillarKeyword.replace(/\s+/g, '-')}`,
        reason: 'Content gap - high volume keywords with no matching page'
      });
    } else if (cluster.matchedPage.matchScore < 0.5) {
      // Existing content needs optimization
      calendar.push({
        priority: calculatePriority(cluster, index) - 1, // Slightly lower priority
        title: `Optimize: ${cluster.matchedPage.title}`,
        type: 'optimize',
        existingUrl: cluster.matchedPage.url,
        pillarKeyword: cluster.pillarKeyword,
        targetKeywords: cluster.keywords.slice(0, 10).map(kw => kw.keyword),
        estimatedTraffic: cluster.totalVolume,
        competition: cluster.avgCompetition,
        topics: cluster.topics,
        reason: 'Existing content could better target these keywords'
      });
    }
  });

  // Sort by priority
  calendar.sort((a, b) => b.priority - a.priority);

  return calendar;
}

/**
 * Calculate content priority
 */
function calculatePriority(cluster, index) {
  // Factors: volume, competition, position in list
  const volumeScore = Math.min(cluster.totalVolume / 1000, 10);
  const competitionScore = (100 - cluster.avgCompetition) / 10;
  const positionScore = Math.max(10 - index, 0);
  
  return Math.round(volumeScore + competitionScore + positionScore);
}

/**
 * Main content clustering function
 */
async function runContentClustering(keywordFile) {
  console.log('=== Starting Content Clustering ===\n');

  // Load keyword research results
  let keywords = [];
  if (keywordFile) {
    const data = JSON.parse(fs.readFileSync(keywordFile, 'utf8'));
    keywords = data.keywords;
  } else {
    throw new Error('Keyword file required. Run keyword-research.mjs first.');
  }

  console.log(`Loaded ${keywords.length} keywords\n`);

  // Get existing pages
  console.log('Scanning existing pages...');
  const existingPages = getExistingPages();
  console.log(`Found ${existingPages.length} existing pages\n`);

  // Cluster keywords
  console.log('Clustering keywords by topic...');
  const clusters = clusterKeywords(keywords);
  console.log(`Created ${clusters.length} topic clusters\n`);

  // Map clusters to pages
  console.log('Mapping clusters to existing pages...');
  const mappedClusters = mapClustersToPages(clusters, existingPages);
  
  const withPages = mappedClusters.filter(c => c.matchedPage).length;
  const withoutPages = mappedClusters.filter(c => !c.matchedPage).length;
  
  console.log(`Clusters with matching pages: ${withPages}`);
  console.log(`Content gaps (no matching page): ${withoutPages}\n`);

  // Generate content calendar
  console.log('Generating content calendar...');
  const calendar = generateContentCalendar(mappedClusters);

  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalKeywords: keywords.length,
      totalClusters: clusters.length,
      existingPages: existingPages.length,
      clustersWithPages: withPages,
      contentGaps: withoutPages,
      calendarItems: calendar.length
    },
    clusters: mappedClusters,
    existingPages,
    contentCalendar: calendar
  };

  // Save results
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const jsonPath = path.join(config.outputDir, `content-clusters-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  // Generate markdown content calendar
  const mdPath = path.join(config.outputDir, `content-calendar-${timestamp}.md`);
  const markdown = generateCalendarMarkdown(calendar, results.summary);
  fs.writeFileSync(mdPath, markdown);

  console.log('\n=== Content Clustering Complete ===');
  console.log(`Total clusters: ${results.summary.totalClusters}`);
  console.log(`Content gaps: ${results.summary.contentGaps}`);
  console.log(`Calendar items: ${results.summary.calendarItems}`);
  console.log(`JSON saved to: ${jsonPath}`);
  console.log(`Calendar saved to: ${mdPath}`);

  return results;
}

/**
 * Generate markdown content calendar
 */
function generateCalendarMarkdown(calendar, summary) {
  let md = '# Content Calendar\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += '## Summary\n\n';
  md += `- Total Keywords: ${summary.totalKeywords}\n`;
  md += `- Topic Clusters: ${summary.totalClusters}\n`;
  md += `- Existing Pages: ${summary.existingPages}\n`;
  md += `- Content Gaps: ${summary.contentGaps}\n`;
  md += `- Recommended Actions: ${summary.calendarItems}\n\n`;
  
  md += '## High Priority (Score 15+)\n\n';
  calendar.filter(item => item.priority >= 15).forEach((item, i) => {
    md += formatCalendarItem(item, i + 1);
  });

  md += '\n## Medium Priority (Score 10-14)\n\n';
  calendar.filter(item => item.priority >= 10 && item.priority < 15).forEach((item, i) => {
    md += formatCalendarItem(item, i + 1);
  });

  md += '\n## Lower Priority (Score <10)\n\n';
  calendar.filter(item => item.priority < 10).forEach((item, i) => {
    md += formatCalendarItem(item, i + 1);
  });

  return md;
}

/**
 * Format calendar item as markdown
 */
function formatCalendarItem(item, index) {
  let md = `### ${index}. ${item.title}\n\n`;
  md += `**Priority Score:** ${item.priority}\n`;
  md += `**Type:** ${item.type === 'new' ? '📝 New Content' : '🔄 Optimize Existing'}\n`;
  md += `**Estimated Traffic Potential:** ${item.estimatedTraffic.toLocaleString()} monthly searches\n`;
  md += `**Competition:** ${item.competition}/100\n\n`;
  
  if (item.existingUrl) {
    md += `**Existing URL:** ${item.existingUrl}\n`;
  } else {
    md += `**Suggested URL:** https://${config.domain}${item.suggestedUrl}\n`;
  }
  
  md += `\n**Target Keywords:**\n`;
  item.targetKeywords.slice(0, 5).forEach(kw => {
    md += `- ${kw}\n`;
  });
  
  md += `\n**Topics:** ${item.topics.join(', ')}\n`;
  md += `\n**Reason:** ${item.reason}\n\n`;
  md += '---\n\n';
  
  return md;
}

// CLI execution
if (process.argv[1] === __filename) {
  const keywordFile = process.argv[2];

  if (!keywordFile) {
    console.error('Usage: node content-cluster.mjs <keyword-research-file.json>');
    process.exit(1);
  }

  runContentClustering(keywordFile)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { runContentClustering };
