#!/usr/bin/env node

/**
 * serp-analyzer.mjs
 * 
 * Uses DataForSEO API to:
 * - Take keyword list from keyword research
 * - Check SERP for each keyword
 * - Identify ranking competitors and SERP features
 * - Find gaps where competitors rank but we don't
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
 * Submit SERP task for a keyword
 */
async function submitSerpTask(keyword) {
  const data = [{
    keyword: keyword,
    language_code: 'en',
    location_code: 2840, // United States
    device: 'desktop',
    os: 'windows',
    depth: 100 // Get top 100 results
  }];

  return await apiRequest('/serp/google/organic/task_post', data);
}

/**
 * Get SERP results for a task
 */
async function getSerpResults(taskId) {
  return await apiRequest(`/serp/google/organic/task_get/advanced/${taskId}`, null, 'GET');
}

/**
 * Analyze SERP results for a keyword
 */
function analyzeSerpResults(keyword, serpData, ourDomain, competitors) {
  const analysis = {
    keyword,
    ourRanking: null,
    ourUrl: null,
    competitorRankings: [],
    serpFeatures: [],
    topRankingDomains: [],
    totalResults: 0,
    gapAnalysis: {
      competitorsRanking: [],
      weRank: false,
      opportunityScore: 0
    }
  };

  if (!serpData?.tasks?.[0]?.result?.[0]?.items) {
    return analysis;
  }

  const items = serpData.tasks[0].result[0].items;
  analysis.totalResults = serpData.tasks[0].result[0].items_count || 0;

  // Extract SERP features
  const features = new Set();
  items.forEach(item => {
    if (item.type && item.type !== 'organic') {
      features.add(item.type);
    }
  });
  analysis.serpFeatures = Array.from(features);

  // Analyze organic results
  const organicResults = items.filter(item => item.type === 'organic');
  
  organicResults.forEach((item, index) => {
    const domain = item.domain || extractDomain(item.url);
    const ranking = item.rank_absolute || index + 1;

    // Check if it's our domain
    if (domain === ourDomain) {
      analysis.ourRanking = ranking;
      analysis.ourUrl = item.url;
      analysis.gapAnalysis.weRank = true;
    }

    // Check if it's a competitor
    if (competitors.includes(domain)) {
      analysis.competitorRankings.push({
        domain,
        ranking,
        url: item.url,
        title: item.title
      });
      analysis.gapAnalysis.competitorsRanking.push(domain);
    }

    // Track top 10 domains
    if (ranking <= 10) {
      analysis.topRankingDomains.push({
        domain,
        ranking,
        url: item.url,
        title: item.title
      });
    }
  });

  // Calculate opportunity score
  // Higher score = more competitors ranking, we don't rank, and it's a good keyword
  const competitorCount = analysis.gapAnalysis.competitorsRanking.length;
  const weRank = analysis.gapAnalysis.weRank;
  
  if (competitorCount > 0 && !weRank) {
    // High opportunity: multiple competitors rank, we don't
    analysis.gapAnalysis.opportunityScore = competitorCount * 10;
  } else if (competitorCount > 0 && weRank && analysis.ourRanking > 10) {
    // Medium opportunity: competitors rank better than us
    analysis.gapAnalysis.opportunityScore = competitorCount * 5;
  } else {
    analysis.gapAnalysis.opportunityScore = 0;
  }

  return analysis;
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Main SERP analysis function
 */
async function runSerpAnalysis(keywordFile, limit = 50) {
  console.log('=== Starting SERP Analysis ===\n');

  // Load keyword research results
  let keywords = [];
  if (keywordFile) {
    const data = JSON.parse(fs.readFileSync(keywordFile, 'utf8'));
    keywords = data.keywords.slice(0, limit).map(kw => kw.keyword);
  } else {
    // Use seed keywords if no file provided
    keywords = config.seedKeywords.slice(0, limit);
  }

  console.log(`Analyzing SERPs for ${keywords.length} keywords...\n`);

  const results = {
    timestamp: new Date().toISOString(),
    domain: config.domain,
    competitors: config.competitors,
    totalKeywords: keywords.length,
    serpAnalysis: [],
    gapOpportunities: [],
    summary: {
      keywordsWeRank: 0,
      keywordsWeDoNotRank: 0,
      keywordsWithCompetitors: 0,
      topGapOpportunities: []
    }
  };

  try {
    for (const keyword of keywords) {
      console.log(`Analyzing SERP for: "${keyword}"`);

      // Submit SERP task
      const taskResponse = await submitSerpTask(keyword);
      
      if (taskResponse.tasks?.[0]?.id) {
        const taskId = taskResponse.tasks[0].id;
        
        // Wait for task to complete
        await delay(5000); // DataForSEO tasks usually complete quickly
        
        // Get results
        const serpData = await getSerpResults(taskId);
        
        // Analyze results
        const analysis = analyzeSerpResults(
          keyword,
          serpData,
          config.domain,
          config.competitors
        );
        
        results.serpAnalysis.push(analysis);
        
        // Track gap opportunities
        if (analysis.gapAnalysis.opportunityScore > 0) {
          results.gapOpportunities.push({
            keyword,
            opportunityScore: analysis.gapAnalysis.opportunityScore,
            competitorsRanking: analysis.gapAnalysis.competitorsRanking,
            ourRanking: analysis.ourRanking,
            serpFeatures: analysis.serpFeatures
          });
        }

        // Update summary
        if (analysis.gapAnalysis.weRank) {
          results.summary.keywordsWeRank++;
        } else {
          results.summary.keywordsWeDoNotRank++;
        }
        
        if (analysis.competitorRankings.length > 0) {
          results.summary.keywordsWithCompetitors++;
        }

        console.log(`  ✓ Our ranking: ${analysis.ourRanking || 'Not ranking'}`);
        console.log(`  ✓ Competitors ranking: ${analysis.competitorRankings.length}`);
        console.log(`  ✓ Opportunity score: ${analysis.gapAnalysis.opportunityScore}\n`);
      }
    }

    // Sort gap opportunities by score
    results.gapOpportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
    results.summary.topGapOpportunities = results.gapOpportunities.slice(0, 20);

    // Save results
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const outputPath = path.join(config.outputDir, `serp-analysis-${timestamp}.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('\n=== SERP Analysis Complete ===');
    console.log(`Keywords we rank for: ${results.summary.keywordsWeRank}`);
    console.log(`Keywords we don't rank for: ${results.summary.keywordsWeDoNotRank}`);
    console.log(`Keywords with competitors: ${results.summary.keywordsWithCompetitors}`);
    console.log(`Gap opportunities found: ${results.gapOpportunities.length}`);
    console.log(`Output saved to: ${outputPath}`);
    
    // Print top gap opportunities
    console.log('\nTop 10 Gap Opportunities:');
    results.summary.topGapOpportunities.slice(0, 10).forEach((gap, i) => {
      console.log(`${i + 1}. ${gap.keyword} (Score: ${gap.opportunityScore})`);
      console.log(`   Competitors ranking: ${gap.competitorsRanking.join(', ')}`);
    });

    return results;

  } catch (error) {
    console.error('\n❌ SERP analysis failed:', error.message);
    throw error;
  }
}

// CLI execution
if (process.argv[1] === __filename) {
  const keywordFile = process.argv[2] || null;
  const limit = parseInt(process.argv[3]) || 50;

  runSerpAnalysis(keywordFile, limit)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { runSerpAnalysis };
