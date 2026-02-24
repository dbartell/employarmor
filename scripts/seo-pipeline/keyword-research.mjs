#!/usr/bin/env node

/**
 * keyword-research.mjs
 * 
 * Uses Keywords Everywhere API to:
 * - Take seed keywords as input
 * - Pull related keywords + "people also search for"
 * - Get search volume, CPC, competition data
 * - Output: JSON file with full keyword universe, sorted by opportunity
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// API Configuration
const API_KEY = process.env.KEYWORDS_EVERYWHERE_API_KEY || 'YOUR_API_KEY_HERE';
const API_BASE = 'https://api.keywordseverywhere.com/v1';

// Rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make API request with error handling and rate limiting
 */
async function apiRequest(endpoint, data) {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    // Rate limiting delay
    await delay(config.rateLimits.keywordsEverywhere.delayMs);
    
    return result;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Get keyword metrics (volume, CPC, competition)
 */
async function getKeywordData(keywords) {
  console.log(`Fetching metrics for ${keywords.length} keywords...`);
  
  const data = {
    country: 'us',
    currency: 'USD',
    dataSource: 'gkp',
    kw: keywords
  };

  return await apiRequest('/get_keyword_data', data);
}

/**
 * Get related keywords
 */
async function getRelatedKeywords(keyword) {
  console.log(`Fetching related keywords for: "${keyword}"`);
  
  const data = {
    country: 'us',
    currency: 'USD',
    dataSource: 'gkp',
    kw: [keyword]
  };

  return await apiRequest('/get_related_keywords', data);
}

/**
 * Get "People Also Search For" keywords
 */
async function getPeopleAlsoSearch(keyword) {
  console.log(`Fetching "people also search" for: "${keyword}"`);
  
  const data = {
    country: 'us',
    kw: [keyword]
  };

  return await apiRequest('/get_people_also_search', data);
}

/**
 * Calculate keyword opportunity score
 * Higher volume + Lower competition = Higher opportunity
 */
function calculateOpportunity(keyword) {
  const volume = keyword.vol || 0;
  const competition = keyword.competition || 1;
  const cpc = keyword.cpc?.value || 0;
  
  // Normalize competition (0-1 scale, lower is better)
  const normalizedComp = competition / 100;
  
  // Opportunity = (volume * CPC) / (competition + 1)
  // Higher volume and CPC, lower competition = better opportunity
  const opportunity = (volume * (1 + cpc)) / (normalizedComp + 1);
  
  return Math.round(opportunity);
}

/**
 * Main keyword research function
 */
async function runKeywordResearch(seedKeywords) {
  console.log('=== Starting Keyword Research ===\n');
  console.log(`Seed keywords: ${seedKeywords.join(', ')}\n`);

  const allKeywords = new Map(); // Use Map to deduplicate
  const results = {
    timestamp: new Date().toISOString(),
    seedKeywords: seedKeywords,
    totalKeywords: 0,
    keywords: [],
    relatedKeywords: {},
    peopleAlsoSearch: {}
  };

  try {
    // Step 1: Get metrics for seed keywords
    console.log('\n--- Step 1: Fetching seed keyword metrics ---');
    const seedMetrics = await getKeywordData(seedKeywords);
    
    if (seedMetrics.data) {
      seedMetrics.data.forEach(kw => {
        allKeywords.set(kw.keyword.toLowerCase(), {
          keyword: kw.keyword,
          volume: kw.vol || 0,
          cpc: kw.cpc?.value || 0,
          competition: kw.competition || 0,
          trend: kw.trend || [],
          source: 'seed'
        });
      });
    }

    // Step 2: Get related keywords for each seed
    console.log('\n--- Step 2: Fetching related keywords ---');
    for (const seed of seedKeywords) {
      try {
        const related = await getRelatedKeywords(seed);
        
        if (related.data && related.data[0]?.results) {
          results.relatedKeywords[seed] = related.data[0].results;
          
          related.data[0].results.forEach(kw => {
            const key = kw.keyword.toLowerCase();
            if (!allKeywords.has(key)) {
              allKeywords.set(key, {
                keyword: kw.keyword,
                volume: kw.vol || 0,
                cpc: kw.cpc?.value || 0,
                competition: kw.competition || 0,
                trend: kw.trend || [],
                source: `related:${seed}`
              });
            }
          });
        }
      } catch (error) {
        console.error(`Failed to get related keywords for "${seed}":`, error.message);
      }
    }

    // Step 3: Get "People Also Search" for each seed
    console.log('\n--- Step 3: Fetching "people also search" keywords ---');
    for (const seed of seedKeywords) {
      try {
        const pasData = await getPeopleAlsoSearch(seed);
        
        if (pasData.data && pasData.data[0]?.results) {
          results.peopleAlsoSearch[seed] = pasData.data[0].results;
          
          pasData.data[0].results.forEach(kw => {
            const key = kw.keyword.toLowerCase();
            if (!allKeywords.has(key)) {
              allKeywords.set(key, {
                keyword: kw.keyword,
                volume: kw.vol || 0,
                cpc: kw.cpc?.value || 0,
                competition: kw.competition || 0,
                trend: kw.trend || [],
                source: `pas:${seed}`
              });
            }
          });
        }
      } catch (error) {
        console.error(`Failed to get "people also search" for "${seed}":`, error.message);
      }
    }

    // Step 4: Calculate opportunity scores and sort
    console.log('\n--- Step 4: Calculating opportunity scores ---');
    results.keywords = Array.from(allKeywords.values())
      .map(kw => ({
        ...kw,
        opportunity: calculateOpportunity(kw)
      }))
      .sort((a, b) => b.opportunity - a.opportunity);

    results.totalKeywords = results.keywords.length;

    // Step 5: Save results
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const outputPath = path.join(config.outputDir, `keyword-research-${timestamp}.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('\n=== Keyword Research Complete ===');
    console.log(`Total keywords found: ${results.totalKeywords}`);
    console.log(`Output saved to: ${outputPath}`);
    
    // Print top 10 opportunities
    console.log('\nTop 10 Keyword Opportunities:');
    results.keywords.slice(0, 10).forEach((kw, i) => {
      console.log(`${i + 1}. ${kw.keyword}`);
      console.log(`   Volume: ${kw.volume} | CPC: $${kw.cpc} | Competition: ${kw.competition} | Opportunity: ${kw.opportunity}`);
    });

    return results;

  } catch (error) {
    console.error('\n❌ Keyword research failed:', error.message);
    throw error;
  }
}

// CLI execution
if (process.argv[1] === __filename) {
  const seedKeywords = process.argv.slice(2).length > 0 
    ? process.argv.slice(2) 
    : config.seedKeywords;

  runKeywordResearch(seedKeywords)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { runKeywordResearch };
