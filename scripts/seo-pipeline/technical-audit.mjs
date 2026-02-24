#!/usr/bin/env node

/**
 * technical-audit.mjs
 * 
 * Uses DataForSEO On-Page API to:
 * - Crawl the site (employarmor.com or localhost)
 * - Find technical SEO issues
 * - Generate fix recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// API Configuration
const API_LOGIN = process.env.DATAFORSEO_LOGIN || 'YOUR_LOGIN_HERE';
const API_PASSWORD = process.env.DATAFORSEO_PASSWORD || 'YOUR_PASSWORD_HERE';
const API_BASE = 'https://api.dataforseo.com/v3';

// Rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make DataForSEO API request with Basic Auth
 */
async function apiRequest(endpoint, data = null, method = 'POST') {
  const url = `${API_BASE}${endpoint}`;
  const auth = Buffer.from(`${API_LOGIN}:${API_PASSWORD}`).toString('base64');
  
  const options = {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    // Rate limiting delay
    await delay(config.rateLimits.dataForSEO.delayMs);
    
    return result;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Submit on-page crawl task
 */
async function submitCrawlTask(targetUrl) {
  const data = [{
    target: targetUrl,
    max_crawl_pages: 100,
    load_resources: true,
    enable_javascript: true,
    custom_js: null,
    validate_micromarkup: true,
    checks_threshold: {
      broken_links: 1,
      duplicate_title: 1,
      duplicate_description: 1,
      duplicate_content: 1,
      low_content_rate: 1,
      small_page_size: 1,
      large_page_size: 1
    }
  }];

  return await apiRequest('/on_page/task_post', data);
}

/**
 * Get crawl task results
 */
async function getTaskResults(taskId) {
  return await apiRequest(`/on_page/summary/${taskId}`, null, 'GET');
}

/**
 * Get detailed page issues
 */
async function getPageIssues(taskId) {
  return await apiRequest(`/on_page/pages/${taskId}`, null, 'GET');
}

/**
 * Analyze technical issues
 */
function analyzeTechnicalIssues(summary, pages) {
  const issues = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };

  const recommendations = [];

  // Analyze summary data
  if (summary) {
    // Missing meta titles
    if (summary.onpage_score?.checks?.no_title > 0) {
      issues.critical.push({
        type: 'missing_title',
        count: summary.onpage_score.checks.no_title,
        severity: 'critical',
        description: 'Pages missing meta title tags'
      });
      recommendations.push({
        issue: 'Missing Meta Titles',
        severity: 'critical',
        fix: 'Add unique, descriptive title tags (50-60 characters) to all pages',
        impact: 'Critical for SEO - titles are the most important on-page factor'
      });
    }

    // Missing meta descriptions
    if (summary.onpage_score?.checks?.no_description > 0) {
      issues.high.push({
        type: 'missing_description',
        count: summary.onpage_score.checks.no_description,
        severity: 'high',
        description: 'Pages missing meta descriptions'
      });
      recommendations.push({
        issue: 'Missing Meta Descriptions',
        severity: 'high',
        fix: 'Add compelling meta descriptions (150-160 characters) to all pages',
        impact: 'Important for click-through rates from search results'
      });
    }

    // Duplicate titles
    if (summary.onpage_score?.checks?.duplicate_title > 0) {
      issues.high.push({
        type: 'duplicate_title',
        count: summary.onpage_score.checks.duplicate_title,
        severity: 'high',
        description: 'Pages with duplicate title tags'
      });
      recommendations.push({
        issue: 'Duplicate Title Tags',
        severity: 'high',
        fix: 'Make each page title unique and descriptive',
        impact: 'Reduces SEO effectiveness and confuses search engines'
      });
    }

    // Duplicate descriptions
    if (summary.onpage_score?.checks?.duplicate_description > 0) {
      issues.medium.push({
        type: 'duplicate_description',
        count: summary.onpage_score.checks.duplicate_description,
        severity: 'medium',
        description: 'Pages with duplicate meta descriptions'
      });
      recommendations.push({
        issue: 'Duplicate Meta Descriptions',
        severity: 'medium',
        fix: 'Write unique meta descriptions for each page',
        impact: 'Reduces uniqueness signals to search engines'
      });
    }

    // Broken links
    if (summary.onpage_score?.checks?.broken_links > 0) {
      issues.high.push({
        type: 'broken_links',
        count: summary.onpage_score.checks.broken_links,
        severity: 'high',
        description: 'Broken internal or external links'
      });
      recommendations.push({
        issue: 'Broken Links',
        severity: 'high',
        fix: 'Fix or remove all broken links (404 errors)',
        impact: 'Hurts user experience and crawlability'
      });
    }

    // Low content
    if (summary.onpage_score?.checks?.low_content_rate > 0) {
      issues.medium.push({
        type: 'thin_content',
        count: summary.onpage_score.checks.low_content_rate,
        severity: 'medium',
        description: 'Pages with thin/low content'
      });
      recommendations.push({
        issue: 'Thin Content',
        severity: 'medium',
        fix: 'Expand content on thin pages to at least 300-500 words',
        impact: 'Thin content pages struggle to rank well'
      });
    }

    // Large page size
    if (summary.onpage_score?.checks?.large_page_size > 0) {
      issues.medium.push({
        type: 'large_page_size',
        count: summary.onpage_score.checks.large_page_size,
        severity: 'medium',
        description: 'Pages with large file size (slow loading)'
      });
      recommendations.push({
        issue: 'Large Page Size',
        severity: 'medium',
        fix: 'Optimize images, minify CSS/JS, enable compression',
        impact: 'Slow loading pages hurt user experience and rankings'
      });
    }

    // Missing H1
    if (summary.onpage_score?.checks?.no_h1_tag > 0) {
      issues.high.push({
        type: 'missing_h1',
        count: summary.onpage_score.checks.no_h1_tag,
        severity: 'high',
        description: 'Pages missing H1 heading'
      });
      recommendations.push({
        issue: 'Missing H1 Tags',
        severity: 'high',
        fix: 'Add one unique H1 tag per page with primary keyword',
        impact: 'H1 tags help search engines understand page topic'
      });
    }

    // Missing schema markup
    if (summary.onpage_score?.checks?.no_micromarkup > 0) {
      issues.low.push({
        type: 'missing_schema',
        count: summary.onpage_score.checks.no_micromarkup,
        severity: 'low',
        description: 'Pages missing schema markup'
      });
      recommendations.push({
        issue: 'Missing Schema Markup',
        severity: 'low',
        fix: 'Add relevant schema.org markup (Organization, Article, FAQPage, etc.)',
        impact: 'Schema helps search engines understand content and enables rich snippets'
      });
    }
  }

  // Analyze individual pages
  const pageIssues = [];
  if (pages?.tasks?.[0]?.result) {
    pages.tasks[0].result.forEach(page => {
      const pageProblems = [];

      if (!page.meta?.title) {
        pageProblems.push('Missing meta title');
      }
      if (!page.meta?.description) {
        pageProblems.push('Missing meta description');
      }
      if (!page.meta?.h1) {
        pageProblems.push('Missing H1 tag');
      }
      if (page.checks?.duplicate_title) {
        pageProblems.push('Duplicate title');
      }
      if (page.checks?.duplicate_description) {
        pageProblems.push('Duplicate description');
      }
      if (page.checks?.broken_links) {
        pageProblems.push(`${page.checks.broken_links} broken link(s)`);
      }
      if (page.checks?.low_content_rate) {
        pageProblems.push('Thin content');
      }
      if (page.page_timing?.time_to_interactive > 3000) {
        pageProblems.push('Slow loading (>3s)');
      }

      if (pageProblems.length > 0) {
        pageIssues.push({
          url: page.url,
          title: page.meta?.title || 'Untitled',
          issues: pageProblems,
          wordCount: page.content?.plain_text_word_count || 0,
          loadTime: page.page_timing?.time_to_interactive || 0
        });
      }
    });
  }

  return { issues, recommendations, pageIssues };
}

/**
 * Main technical audit function
 */
async function runTechnicalAudit(targetUrl = null) {
  console.log('=== Starting Technical SEO Audit ===\n');

  const url = targetUrl || `https://${config.domain}`;
  console.log(`Target URL: ${url}\n`);

  const results = {
    timestamp: new Date().toISOString(),
    targetUrl: url,
    crawlStatus: null,
    summary: null,
    issues: null,
    recommendations: null,
    pageIssues: null,
    stats: {
      totalPages: 0,
      pagesWithIssues: 0,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0
    }
  };

  try {
    // Submit crawl task
    console.log('Submitting crawl task...');
    const taskResponse = await submitCrawlTask(url);
    
    if (!taskResponse.tasks?.[0]?.id) {
      throw new Error('Failed to create crawl task');
    }

    const taskId = taskResponse.tasks[0].id;
    console.log(`Task ID: ${taskId}`);
    console.log('Crawling site... this may take a few minutes.\n');

    // Wait for task to complete
    let attempts = 0;
    let taskComplete = false;
    
    while (!taskComplete && attempts < 30) {
      await delay(10000); // Wait 10 seconds between checks
      attempts++;
      
      console.log(`Checking task status (attempt ${attempts}/30)...`);
      
      const summary = await getTaskResults(taskId);
      
      if (summary.tasks?.[0]?.status_code === 20000) {
        // Task complete
        taskComplete = true;
        results.crawlStatus = 'complete';
        results.summary = summary.tasks[0].result[0];
        
        console.log('✓ Crawl complete!\n');
      } else if (summary.tasks?.[0]?.status_code >= 40000) {
        throw new Error(`Task failed: ${summary.tasks[0].status_message}`);
      }
    }

    if (!taskComplete) {
      throw new Error('Task timeout - crawl did not complete in time');
    }

    // Get detailed page issues
    console.log('Analyzing page issues...');
    const pageData = await getPageIssues(taskId);

    // Analyze issues
    const analysis = analyzeTechnicalIssues(results.summary, pageData);
    results.issues = analysis.issues;
    results.recommendations = analysis.recommendations;
    results.pageIssues = analysis.pageIssues;

    // Calculate stats
    results.stats.totalPages = results.summary?.total_checks || 0;
    results.stats.pagesWithIssues = analysis.pageIssues.length;
    results.stats.criticalIssues = analysis.issues.critical.length;
    results.stats.highIssues = analysis.issues.high.length;
    results.stats.mediumIssues = analysis.issues.medium.length;
    results.stats.lowIssues = analysis.issues.low.length;

    // Save JSON results
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const jsonPath = path.join(config.outputDir, `technical-audit-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

    // Generate markdown report
    const mdPath = path.join(config.outputDir, `technical-audit-report-${timestamp}.md`);
    const markdown = generateAuditReport(results);
    fs.writeFileSync(mdPath, markdown);

    console.log('\n=== Technical Audit Complete ===');
    console.log(`Pages crawled: ${results.stats.totalPages}`);
    console.log(`Pages with issues: ${results.stats.pagesWithIssues}`);
    console.log(`Critical issues: ${results.stats.criticalIssues}`);
    console.log(`High priority issues: ${results.stats.highIssues}`);
    console.log(`Medium priority issues: ${results.stats.mediumIssues}`);
    console.log(`Low priority issues: ${results.stats.lowIssues}`);
    console.log(`JSON saved to: ${jsonPath}`);
    console.log(`Report saved to: ${mdPath}`);

    // Print recommendations
    console.log('\nTop Recommendations:');
    results.recommendations
      .filter(r => r.severity === 'critical' || r.severity === 'high')
      .forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.severity.toUpperCase()}] ${rec.issue}`);
        console.log(`   Fix: ${rec.fix}`);
      });

    return results;

  } catch (error) {
    console.error('\n❌ Technical audit failed:', error.message);
    throw error;
  }
}

/**
 * Generate markdown audit report
 */
function generateAuditReport(results) {
  let md = '# Technical SEO Audit Report\n\n';
  md += `Generated: ${new Date().toISOString()}\n`;
  md += `Target: ${results.targetUrl}\n\n`;
  
  md += '## Summary\n\n';
  md += `- Total Pages Crawled: ${results.stats.totalPages}\n`;
  md += `- Pages with Issues: ${results.stats.pagesWithIssues}\n`;
  md += `- Critical Issues: ${results.stats.criticalIssues}\n`;
  md += `- High Priority Issues: ${results.stats.highIssues}\n`;
  md += `- Medium Priority Issues: ${results.stats.mediumIssues}\n`;
  md += `- Low Priority Issues: ${results.stats.lowIssues}\n\n`;

  if (results.summary?.onpage_score) {
    md += `### OnPage Score: ${results.summary.onpage_score.onpage_score}/100\n\n`;
  }

  md += '## Critical Issues\n\n';
  if (results.issues?.critical.length > 0) {
    results.issues.critical.forEach(issue => {
      md += `- **${issue.description}**: ${issue.count} page(s)\n`;
    });
  } else {
    md += 'No critical issues found.\n';
  }

  md += '\n## High Priority Issues\n\n';
  if (results.issues?.high.length > 0) {
    results.issues.high.forEach(issue => {
      md += `- **${issue.description}**: ${issue.count} page(s)\n`;
    });
  } else {
    md += 'No high priority issues found.\n';
  }

  md += '\n## Recommendations\n\n';
  const priorityOrder = ['critical', 'high', 'medium', 'low'];
  priorityOrder.forEach(severity => {
    const recs = results.recommendations?.filter(r => r.severity === severity) || [];
    if (recs.length > 0) {
      md += `### ${severity.charAt(0).toUpperCase() + severity.slice(1)} Priority\n\n`;
      recs.forEach((rec, i) => {
        md += `#### ${i + 1}. ${rec.issue}\n\n`;
        md += `**Fix:** ${rec.fix}\n\n`;
        md += `**Impact:** ${rec.impact}\n\n`;
      });
    }
  });

  md += '\n## Pages with Issues\n\n';
  if (results.pageIssues && results.pageIssues.length > 0) {
    results.pageIssues.slice(0, 20).forEach((page, i) => {
      md += `### ${i + 1}. ${page.title}\n\n`;
      md += `**URL:** ${page.url}\n`;
      md += `**Word Count:** ${page.wordCount}\n`;
      md += `**Load Time:** ${(page.loadTime / 1000).toFixed(2)}s\n\n`;
      md += '**Issues:**\n';
      page.issues.forEach(issue => {
        md += `- ${issue}\n`;
      });
      md += '\n';
    });
  } else {
    md += 'No page-level issues found.\n';
  }

  return md;
}

// CLI execution
if (process.argv[1] === __filename) {
  const targetUrl = process.argv[2] || null;

  runTechnicalAudit(targetUrl)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { runTechnicalAudit };
