#!/usr/bin/env node

/**
 * internal-linking.mjs
 * 
 * Analyzes existing pages and recommends internal linking opportunities:
 * - Crawls marketing pages
 * - Extracts existing internal links
 * - Uses keyword clusters to recommend new links
 * - Generates linking map and recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

/**
 * Extract internal links from TSX content
 */
function extractLinks(content, currentPath) {
  const links = [];
  
  // Match <Link href="...">
  const linkMatches = content.matchAll(/<Link[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/Link>/gis);
  for (const match of linkMatches) {
    links.push({
      url: match[1],
      anchorText: match[2].replace(/<[^>]*>/g, '').trim(),
      type: 'Link'
    });
  }
  
  // Match <a href="...">
  const aMatches = content.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis);
  for (const match of aMatches) {
    const url = match[1];
    // Only internal links (starts with /)
    if (url.startsWith('/') && !url.startsWith('//')) {
      links.push({
        url,
        anchorText: match[2].replace(/<[^>]*>/g, '').trim(),
        type: 'anchor'
      });
    }
  }

  return links;
}

/**
 * Scan all marketing pages and extract metadata
 */
function scanPages() {
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
        const content = fs.readFileSync(fullPath, 'utf8');
        
        pages.push({
          path: basePath || '/',
          url: basePath || '/',
          fullPath,
          title: extractTitle(content),
          description: extractDescription(content),
          headings: extractHeadings(content),
          content: content,
          keywords: extractKeywords(content),
          existingLinks: extractLinks(content, basePath),
          wordCount: content.split(/\s+/).length
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
 * Extract title from page
 */
function extractTitle(content) {
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const titleMatch = content.match(/title:\s*['"](.*?)['"]/i);
  const metaTitleMatch = content.match(/metadata\s*=\s*{[^}]*title:\s*['"](.*?)['"]/s);
  
  return (h1Match?.[1] || titleMatch?.[1] || metaTitleMatch?.[1] || 'Untitled')
    .replace(/<[^>]*>/g, '').trim();
}

/**
 * Extract description from page
 */
function extractDescription(content) {
  const descMatch = content.match(/description:\s*['"](.*?)['"]/i);
  const metaDescMatch = content.match(/metadata\s*=\s*{[^}]*description:\s*['"](.*?)['"]/s);
  
  return descMatch?.[1] || metaDescMatch?.[1] || '';
}

/**
 * Extract headings from page
 */
function extractHeadings(content) {
  const headings = [];
  const h2Matches = content.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi);
  const h3Matches = content.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi);
  
  for (const match of h2Matches) {
    headings.push(match[1].replace(/<[^>]*>/g, '').trim());
  }
  for (const match of h3Matches) {
    headings.push(match[1].replace(/<[^>]*>/g, '').trim());
  }
  
  return headings;
}

/**
 * Extract keywords/topics from page content
 */
function extractKeywords(content) {
  const text = content.toLowerCase();
  const keywords = [];
  
  // Common AI hiring compliance keywords
  const patterns = [
    'ai hiring', 'bias audit', 'compliance', 'aedt', 'automated employment',
    'local law 144', 'illinois', 'colorado', 'maryland', 'california',
    'discrimination', 'fairness', 'transparency', 'disclosure',
    'algorithm', 'machine learning', 'eeoc', 'regulation'
  ];

  patterns.forEach(pattern => {
    if (text.includes(pattern)) {
      keywords.push(pattern);
    }
  });

  return keywords;
}

/**
 * Calculate relevance score between two pages
 */
function calculateRelevance(sourcePage, targetPage) {
  // Compare keywords, headings, and topics
  const sourceText = `${sourcePage.title} ${sourcePage.description} ${sourcePage.keywords.join(' ')}`.toLowerCase();
  const targetText = `${targetPage.title} ${targetPage.description} ${targetPage.keywords.join(' ')}`.toLowerCase();
  
  const sourceWords = new Set(sourceText.split(/\s+/));
  const targetWords = new Set(targetText.split(/\s+/));
  
  const intersection = new Set([...sourceWords].filter(w => targetWords.has(w)));
  const union = new Set([...sourceWords, ...targetWords]);
  
  return intersection.size / union.size;
}

/**
 * Check if link already exists
 */
function linkExists(sourcePage, targetUrl) {
  return sourcePage.existingLinks.some(link => 
    link.url === targetUrl || link.url === `${targetUrl}/`
  );
}

/**
 * Generate internal linking recommendations
 */
function generateLinkingRecommendations(pages, clusters = null) {
  const recommendations = [];
  
  pages.forEach(sourcePage => {
    // Find related pages
    const relatedPages = pages
      .filter(p => p.url !== sourcePage.url)
      .map(targetPage => ({
        targetPage,
        relevance: calculateRelevance(sourcePage, targetPage)
      }))
      .filter(r => r.relevance > 0.2) // Minimum relevance threshold
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10); // Top 10 most relevant

    relatedPages.forEach(({ targetPage, relevance }) => {
      // Check if link already exists
      if (linkExists(sourcePage, targetPage.url)) {
        return; // Skip if link exists
      }

      // Find best anchor text from target page keywords/title
      const anchorText = suggestAnchorText(sourcePage, targetPage);

      recommendations.push({
        sourcePage: {
          url: sourcePage.url,
          title: sourcePage.title
        },
        targetPage: {
          url: targetPage.url,
          title: targetPage.title
        },
        suggestedAnchorText: anchorText,
        relevanceScore: Math.round(relevance * 100),
        reason: `Related content: ${targetPage.keywords.slice(0, 3).join(', ')}`,
        priority: calculateLinkPriority(sourcePage, targetPage, relevance)
      });
    });
  });

  // Sort by priority
  recommendations.sort((a, b) => b.priority - a.priority);

  return recommendations;
}

/**
 * Suggest anchor text for link
 */
function suggestAnchorText(sourcePage, targetPage) {
  // Use target page's primary keyword or title
  if (targetPage.keywords.length > 0) {
    return targetPage.keywords[0];
  }
  
  // Fall back to title
  return targetPage.title;
}

/**
 * Calculate link priority
 */
function calculateLinkPriority(sourcePage, targetPage, relevance) {
  // Factors:
  // - Relevance score
  // - Source page word count (longer pages = better linking opportunities)
  // - Target page importance (based on keywords)
  
  const relevanceScore = relevance * 100;
  const wordCountScore = Math.min(sourcePage.wordCount / 100, 10);
  const targetImportance = targetPage.keywords.length * 2;
  
  return Math.round(relevanceScore + wordCountScore + targetImportance);
}

/**
 * Generate linking map (graph structure)
 */
function generateLinkingMap(pages) {
  const map = {
    nodes: [],
    links: []
  };

  // Add nodes
  pages.forEach(page => {
    map.nodes.push({
      id: page.url,
      title: page.title,
      keywords: page.keywords,
      existingOutLinks: page.existingLinks.length,
      wordCount: page.wordCount
    });
  });

  // Add existing links
  pages.forEach(sourcePage => {
    sourcePage.existingLinks.forEach(link => {
      // Check if target is an internal page
      const targetPage = pages.find(p => p.url === link.url);
      if (targetPage) {
        map.links.push({
          source: sourcePage.url,
          target: link.url,
          anchorText: link.anchorText,
          type: 'existing'
        });
      }
    });
  });

  return map;
}

/**
 * Main internal linking analysis
 */
async function runInternalLinkingAnalysis(clusterFile = null) {
  console.log('=== Starting Internal Linking Analysis ===\n');

  // Load clusters if provided
  let clusters = null;
  if (clusterFile) {
    const data = JSON.parse(fs.readFileSync(clusterFile, 'utf8'));
    clusters = data.clusters;
    console.log(`Loaded ${clusters.length} content clusters\n`);
  }

  // Scan all pages
  console.log('Scanning marketing pages...');
  const pages = scanPages();
  console.log(`Found ${pages.length} pages\n`);

  // Calculate existing link statistics
  const totalExistingLinks = pages.reduce((sum, p) => sum + p.existingLinks.length, 0);
  const avgLinksPerPage = Math.round(totalExistingLinks / pages.length);
  
  console.log(`Total existing internal links: ${totalExistingLinks}`);
  console.log(`Average links per page: ${avgLinksPerPage}\n`);

  // Generate linking map
  console.log('Generating linking map...');
  const linkingMap = generateLinkingMap(pages);

  // Generate recommendations
  console.log('Analyzing linking opportunities...');
  const recommendations = generateLinkingRecommendations(pages, clusters);

  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: pages.length,
      totalExistingLinks: totalExistingLinks,
      avgLinksPerPage: avgLinksPerPage,
      totalRecommendations: recommendations.length,
      highPriorityRecommendations: recommendations.filter(r => r.priority >= 50).length,
      mediumPriorityRecommendations: recommendations.filter(r => r.priority >= 30 && r.priority < 50).length
    },
    pages: pages.map(p => ({
      url: p.url,
      title: p.title,
      keywords: p.keywords,
      existingLinks: p.existingLinks,
      wordCount: p.wordCount
    })),
    linkingMap,
    recommendations
  };

  // Save JSON results
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const jsonPath = path.join(config.outputDir, `internal-linking-map-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  // Generate markdown recommendations
  const mdPath = path.join(config.outputDir, `internal-linking-recommendations-${timestamp}.md`);
  const markdown = generateRecommendationsMarkdown(recommendations, results.summary);
  fs.writeFileSync(mdPath, markdown);

  console.log('\n=== Internal Linking Analysis Complete ===');
  console.log(`Total recommendations: ${results.summary.totalRecommendations}`);
  console.log(`High priority: ${results.summary.highPriorityRecommendations}`);
  console.log(`Medium priority: ${results.summary.mediumPriorityRecommendations}`);
  console.log(`JSON saved to: ${jsonPath}`);
  console.log(`Recommendations saved to: ${mdPath}`);

  // Print top 10 recommendations
  console.log('\nTop 10 Internal Linking Opportunities:');
  recommendations.slice(0, 10).forEach((rec, i) => {
    console.log(`${i + 1}. ${rec.sourcePage.title} → ${rec.targetPage.title}`);
    console.log(`   Anchor: "${rec.suggestedAnchorText}"`);
    console.log(`   Priority: ${rec.priority} | Relevance: ${rec.relevanceScore}%`);
  });

  return results;
}

/**
 * Generate markdown recommendations
 */
function generateRecommendationsMarkdown(recommendations, summary) {
  let md = '# Internal Linking Recommendations\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;
  md += '## Summary\n\n';
  md += `- Total Pages: ${summary.totalPages}\n`;
  md += `- Existing Internal Links: ${summary.totalExistingLinks}\n`;
  md += `- Average Links per Page: ${summary.avgLinksPerPage}\n`;
  md += `- New Linking Opportunities: ${summary.totalRecommendations}\n`;
  md += `- High Priority: ${summary.highPriorityRecommendations}\n`;
  md += `- Medium Priority: ${summary.mediumPriorityRecommendations}\n\n`;

  md += '## High Priority Links (Priority 50+)\n\n';
  recommendations.filter(r => r.priority >= 50).forEach((rec, i) => {
    md += formatRecommendation(rec, i + 1);
  });

  md += '\n## Medium Priority Links (Priority 30-49)\n\n';
  recommendations.filter(r => r.priority >= 30 && r.priority < 50).forEach((rec, i) => {
    md += formatRecommendation(rec, i + 1);
  });

  md += '\n## Lower Priority Links (Priority <30)\n\n';
  recommendations.filter(r => r.priority < 30).slice(0, 20).forEach((rec, i) => {
    md += formatRecommendation(rec, i + 1);
  });

  return md;
}

/**
 * Format recommendation as markdown
 */
function formatRecommendation(rec, index) {
  let md = `### ${index}. Link from "${rec.sourcePage.title}" to "${rec.targetPage.title}"\n\n`;
  md += `**Priority:** ${rec.priority} | **Relevance:** ${rec.relevanceScore}%\n\n`;
  md += `**Source:** ${rec.sourcePage.url}\n`;
  md += `**Target:** ${rec.targetPage.url}\n`;
  md += `**Suggested Anchor Text:** "${rec.suggestedAnchorText}"\n`;
  md += `**Reason:** ${rec.reason}\n\n`;
  md += '---\n\n';
  
  return md;
}

// CLI execution
if (process.argv[1] === __filename) {
  const clusterFile = process.argv[2] || null;

  runInternalLinkingAnalysis(clusterFile)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { runInternalLinkingAnalysis };
