#!/usr/bin/env node

/**
 * competitor-backlinks.mjs
 * 
 * Uses DataForSEO Backlinks API to:
 * - Find sites linking to competitors but NOT to us
 * - Identify backlink gap opportunities
 * - Extract contact information where available
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
 * Get domain intersection - sites linking to competitors but not to us
 */
async function getDomainIntersection(ourDomain, competitorDomains) {
  console.log(`Finding backlink gaps for ${ourDomain} vs competitors...`);

  const data = [{
    targets: {
      [ourDomain]: false, // Domains NOT linking to us
      ...Object.fromEntries(competitorDomains.map(domain => [domain, true])) // Domains linking to competitors
    },
    filters: [
      ["dofollow", "=", true], // Only dofollow links
      ["domain_rank", ">", 20] // Only domains with decent authority (domain rank > 20)
    ],
    order_by: ["domain_rank,desc"], // Order by domain authority
    limit: 100
  }];

  return await apiRequest('/backlinks/domain_intersection/live', data);
}

/**
 * Get backlinks summary for a domain
 */
async function getBacklinksSummary(domain) {
  const data = [{
    target: domain
  }];

  return await apiRequest('/backlinks/summary/live', data);
}

/**
 * Analyze backlink opportunity
 */
function analyzeBacklinkOpportunity(domain, linkingToCompetitors, domainRank, backlinks) {
  // Calculate opportunity score based on:
  // - Domain authority (domain_rank)
  // - Number of competitors it links to
  // - Number of backlinks it has
  
  const competitorLinkCount = linkingToCompetitors.length;
  const authorityScore = domainRank || 0;
  const backlinkScore = Math.min(backlinks || 0, 1000) / 10; // Cap at 1000, scale down
  
  // Weighted score: authority is most important, then competitor count
  const opportunityScore = (authorityScore * 0.6) + (competitorLinkCount * 20 * 0.3) + (backlinkScore * 0.1);
  
  return Math.round(opportunityScore);
}

/**
 * Main backlink analysis function
 */
async function runBacklinkAnalysis(competitors = null) {
  console.log('=== Starting Backlink Gap Analysis ===\n');

  const ourDomain = config.domain;
  const competitorDomains = competitors || config.competitors;

  console.log(`Our domain: ${ourDomain}`);
  console.log(`Competitor domains: ${competitorDomains.join(', ')}\n`);

  const results = {
    timestamp: new Date().toISOString(),
    ourDomain,
    competitors: competitorDomains,
    backlinkOpportunities: [],
    summary: {
      totalOpportunities: 0,
      highPriorityOpportunities: 0,
      mediumPriorityOpportunities: 0,
      lowPriorityOpportunities: 0,
      avgDomainRank: 0,
      totalCompetitorLinks: 0
    }
  };

  try {
    // Get our backlink summary
    console.log(`Fetching backlink summary for ${ourDomain}...`);
    const ourSummary = await getBacklinksSummary(ourDomain);
    results.ourBacklinkProfile = ourSummary.tasks?.[0]?.result?.[0] || {};

    // Get competitor summaries
    console.log('\nFetching competitor backlink profiles...');
    results.competitorProfiles = {};
    
    for (const competitor of competitorDomains) {
      console.log(`  - ${competitor}`);
      const compSummary = await getBacklinksSummary(competitor);
      results.competitorProfiles[competitor] = compSummary.tasks?.[0]?.result?.[0] || {};
    }

    // Get domain intersection - sites linking to competitors but not us
    console.log('\n--- Finding Backlink Gap Opportunities ---\n');
    const intersection = await getDomainIntersection(ourDomain, competitorDomains);

    if (intersection.tasks?.[0]?.result) {
      const items = intersection.tasks[0].result;
      
      items.forEach(item => {
        const domain = item.target;
        const domainRank = item.rank || 0;
        const backlinks = item.backlinks || 0;
        
        // Determine which competitors this domain links to
        const linkingToCompetitors = [];
        competitorDomains.forEach(comp => {
          if (item.intersection_result?.[comp]) {
            linkingToCompetitors.push(comp);
          }
        });

        // Calculate opportunity score
        const opportunityScore = analyzeBacklinkOpportunity(
          domain,
          linkingToCompetitors,
          domainRank,
          backlinks
        );

        // Determine priority
        let priority = 'low';
        if (opportunityScore >= 70) {
          priority = 'high';
          results.summary.highPriorityOpportunities++;
        } else if (opportunityScore >= 40) {
          priority = 'medium';
          results.summary.mediumPriorityOpportunities++;
        } else {
          results.summary.lowPriorityOpportunities++;
        }

        results.backlinkOpportunities.push({
          domain,
          domainRank,
          backlinks,
          linkingToCompetitors,
          competitorLinkCount: linkingToCompetitors.length,
          opportunityScore,
          priority,
          potentialContactUrl: `https://${domain}/contact`,
          notes: `Links to ${linkingToCompetitors.length} competitor(s): ${linkingToCompetitors.join(', ')}`
        });

        console.log(`Found: ${domain} (Rank: ${domainRank}, Links to ${linkingToCompetitors.length} competitors)`);
      });

      // Sort by opportunity score
      results.backlinkOpportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
      
      // Calculate summary stats
      results.summary.totalOpportunities = results.backlinkOpportunities.length;
      results.summary.avgDomainRank = Math.round(
        results.backlinkOpportunities.reduce((sum, opp) => sum + opp.domainRank, 0) / 
        results.summary.totalOpportunities
      );
      results.summary.totalCompetitorLinks = results.backlinkOpportunities.reduce(
        (sum, opp) => sum + opp.competitorLinkCount, 0
      );
    }

    // Save results
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const outputPath = path.join(config.outputDir, `backlink-opportunities-${timestamp}.json`);
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('\n=== Backlink Gap Analysis Complete ===');
    console.log(`Total opportunities found: ${results.summary.totalOpportunities}`);
    console.log(`High priority: ${results.summary.highPriorityOpportunities}`);
    console.log(`Medium priority: ${results.summary.mediumPriorityOpportunities}`);
    console.log(`Low priority: ${results.summary.lowPriorityOpportunities}`);
    console.log(`Average domain rank: ${results.summary.avgDomainRank}`);
    console.log(`Output saved to: ${outputPath}`);
    
    // Print top 10 opportunities
    console.log('\nTop 10 Backlink Opportunities:');
    results.backlinkOpportunities.slice(0, 10).forEach((opp, i) => {
      console.log(`${i + 1}. ${opp.domain} (${opp.priority.toUpperCase()} priority)`);
      console.log(`   Domain Rank: ${opp.domainRank} | Score: ${opp.opportunityScore}`);
      console.log(`   Links to: ${opp.linkingToCompetitors.join(', ')}`);
      console.log(`   Contact: ${opp.potentialContactUrl}`);
    });

    // Save CSV for outreach
    const csvPath = path.join(config.outputDir, `backlink-outreach-${timestamp}.csv`);
    const csvContent = [
      'Domain,Domain Rank,Priority,Opportunity Score,Links To Competitors,Contact URL',
      ...results.backlinkOpportunities.map(opp => 
        `${opp.domain},${opp.domainRank},${opp.priority},${opp.opportunityScore},"${opp.linkingToCompetitors.join(', ')}",${opp.potentialContactUrl}`
      )
    ].join('\n');
    
    fs.writeFileSync(csvPath, csvContent);
    console.log(`\nOutreach CSV saved to: ${csvPath}`);

    return results;

  } catch (error) {
    console.error('\n❌ Backlink analysis failed:', error.message);
    throw error;
  }
}

// CLI execution
if (process.argv[1] === __filename) {
  const competitors = process.argv.slice(2).length > 0 
    ? process.argv.slice(2) 
    : null;

  runBacklinkAnalysis(competitors)
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { runBacklinkAnalysis };
