#!/usr/bin/env node

/**
 * NLP Content Analyzer
 * 
 * Analyzes content using Google Cloud Natural Language API to:
 * 1. Extract entities and sentiment
 * 2. Classify content by category
 * 3. Compare against competitor content
 * 4. Generate SEO optimization recommendations
 * 
 * Usage:
 *   node nlp-content-analyzer.mjs <slug> [competitor-url]
 *   node nlp-content-analyzer.mjs all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GOOGLE_NLP_API_KEY || 'AIzaSyAZypQ2lVM0whm8Mo9EWTjGhMHx4ckk3C8';
const BASE_URL = 'https://language.googleapis.com/v1/documents';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src/app/(marketing)/resources');
const ANALYSIS_DIR = path.join(PROJECT_ROOT, 'content-analysis');

// Ensure analysis directory exists
if (!fs.existsSync(ANALYSIS_DIR)) {
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });
}

/**
 * Extract text content from TSX file by stripping JSX tags
 */
function extractTextFromTSX(tsxContent) {
  let text = tsxContent;
  
  // Remove comments (both /* */ and //)
  text = text.replace(/\/\*[\s\S]*?\*\//g, '');
  text = text.replace(/\/\/.*/g, '');
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // Remove import statements
  text = text.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
  
  // Remove export statements
  text = text.replace(/export\s+(const|default|function|class)\s+[\s\S]*?\{/g, '');
  text = text.replace(/export\s+const\s+\w+\s*=\s*\{[\s\S]*?\}/g, '');
  
  // Remove script-like content in curly braces but preserve quoted strings
  text = text.replace(/className=["'][^"']*["']/g, '');
  text = text.replace(/\bhref=["'][^"']*["']/g, '');
  
  // Remove JSX self-closing tags
  text = text.replace(/<\w+[^>]*\/>/g, ' ');
  
  // Remove opening tags but keep content
  text = text.replace(/<\w+[^>]*>/g, ' ');
  
  // Remove closing tags
  text = text.replace(/<\/\w+>/g, ' ');
  
  // Extract string values from JS data objects (FAQ answers, descriptions, etc.)
  // before removing curly brace expressions
  const stringValues = [];
  const stringPattern = /(?:q|a|question|answer|title|description|content|text|name|label):\s*["'`]([\s\S]*?)["'`]/g;
  let match;
  while ((match = stringPattern.exec(tsxContent)) !== null) {
    if (match[1].length > 20) { // Only meaningful text
      stringValues.push(match[1]);
    }
  }
  
  // Remove remaining curly brace expressions
  text = text.replace(/\{[^}]+\}/g, '');
  
  // Append extracted string values
  if (stringValues.length > 0) {
    text += ' ' + stringValues.join(' ');
  }
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Fetch content from URL
 */
async function fetchCompetitorContent(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic HTML stripping (more sophisticated than TSX stripping)
    let text = html;
    
    // Remove script and style tags
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (error) {
    console.error(`Error fetching competitor content: ${error.message}`);
    return null;
  }
}

/**
 * Call Google Natural Language API
 */
async function analyzeWithGoogleNLP(text, endpoint) {
  const url = `${BASE_URL}:${endpoint}?key=${API_KEY}`;
  
  const payload = {
    document: {
      type: 'PLAIN_TEXT',
      content: text.substring(0, 100000) // API limit
    }
  };
  
  // Only add encodingType for endpoints that support it (not classifyText)
  if (endpoint !== 'classifyText') {
    payload.encodingType = 'UTF8';
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} ${error}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint}: ${error.message}`);
    return null;
  }
}

/**
 * Analyze entities
 */
async function analyzeEntities(text) {
  return await analyzeWithGoogleNLP(text, 'analyzeEntities');
}

/**
 * Analyze entity sentiment
 */
async function analyzeEntitySentiment(text) {
  return await analyzeWithGoogleNLP(text, 'analyzeEntitySentiment');
}

/**
 * Classify text
 */
async function classifyText(text) {
  return await analyzeWithGoogleNLP(text, 'classifyText');
}

/**
 * Compare two sets of analysis results
 */
function compareAnalysis(ourAnalysis, competitorAnalysis) {
  const recommendations = [];
  
  // Entity gap analysis
  if (ourAnalysis.entities && competitorAnalysis.entities) {
    const ourEntities = new Set(
      ourAnalysis.entities.entities
        .filter(e => e.salience > 0.01)
        .map(e => e.name.toLowerCase())
    );
    
    const competitorEntities = competitorAnalysis.entities.entities
      .filter(e => e.salience > 0.01)
      .map(e => ({ name: e.name, salience: e.salience, type: e.type }));
    
    const missingEntities = competitorEntities
      .filter(e => !ourEntities.has(e.name.toLowerCase()))
      .sort((a, b) => b.salience - a.salience)
      .slice(0, 10);
    
    if (missingEntities.length > 0) {
      recommendations.push({
        type: 'entity_gaps',
        priority: 'high',
        message: 'Add missing key entities that competitor covers',
        entities: missingEntities.map(e => ({
          name: e.name,
          salience: e.salience.toFixed(3),
          type: e.type
        }))
      });
    }
  }
  
  // Salience comparison for shared entities
  if (ourAnalysis.entities && competitorAnalysis.entities) {
    const ourEntitiesMap = new Map(
      ourAnalysis.entities.entities.map(e => [e.name.toLowerCase(), e.salience])
    );
    
    const salienceDifferences = competitorAnalysis.entities.entities
      .filter(e => ourEntitiesMap.has(e.name.toLowerCase()))
      .map(e => ({
        name: e.name,
        ourSalience: ourEntitiesMap.get(e.name.toLowerCase()),
        theirSalience: e.salience,
        difference: e.salience - ourEntitiesMap.get(e.name.toLowerCase())
      }))
      .filter(e => Math.abs(e.difference) > 0.02)
      .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
      .slice(0, 5);
    
    if (salienceDifferences.length > 0) {
      recommendations.push({
        type: 'salience_optimization',
        priority: 'medium',
        message: 'Adjust entity emphasis to match or exceed competitor',
        entities: salienceDifferences.map(e => ({
          name: e.name,
          ourSalience: e.ourSalience.toFixed(3),
          competitorSalience: e.theirSalience.toFixed(3),
          recommendation: e.difference > 0 ? 
            `Increase mentions (competitor emphasizes ${Math.abs(e.difference * 100).toFixed(1)}% more)` :
            `Good coverage (${Math.abs(e.difference * 100).toFixed(1)}% more than competitor)`
        }))
      });
    }
  }
  
  // Category alignment
  if (ourAnalysis.categories && competitorAnalysis.categories) {
    const ourCategories = new Set(
      ourAnalysis.categories.categories.map(c => c.name)
    );
    
    const missingCategories = competitorAnalysis.categories.categories
      .filter(c => !ourCategories.has(c.name))
      .map(c => ({ name: c.name, confidence: c.confidence }));
    
    if (missingCategories.length > 0) {
      recommendations.push({
        type: 'category_alignment',
        priority: 'medium',
        message: 'Consider adding content to align with competitor categories',
        categories: missingCategories
      });
    }
  }
  
  return recommendations;
}

/**
 * Analyze a single page
 */
async function analyzePage(slug, competitorUrl = null) {
  console.log(`\n📊 Analyzing: ${slug}`);
  
  // Find the TSX file
  const pagePath = path.join(CONTENT_DIR, slug, 'page.tsx');
  
  if (!fs.existsSync(pagePath)) {
    console.error(`❌ Page not found: ${pagePath}`);
    return null;
  }
  
  // Extract text
  const tsxContent = fs.readFileSync(pagePath, 'utf-8');
  const ourText = extractTextFromTSX(tsxContent);
  
  console.log(`   Extracted ${ourText.length} characters from TSX`);
  
  // Analyze our content
  console.log('   Analyzing entities...');
  const ourEntities = await analyzeEntities(ourText);
  
  console.log('   Analyzing entity sentiment...');
  const ourEntitySentiment = await analyzeEntitySentiment(ourText);
  
  console.log('   Classifying content...');
  const ourCategories = await classifyText(ourText);
  
  const analysis = {
    slug,
    analyzedAt: new Date().toISOString(),
    wordCount: ourText.split(/\s+/).length,
    entities: ourEntities,
    entitySentiment: ourEntitySentiment,
    categories: ourCategories,
    topEntities: ourEntities?.entities
      ?.sort((a, b) => b.salience - a.salience)
      .slice(0, 10)
      .map(e => ({
        name: e.name,
        type: e.type,
        salience: e.salience.toFixed(3)
      })) || [],
    topCategories: ourCategories?.categories
      ?.map(c => ({
        name: c.name,
        confidence: c.confidence.toFixed(3)
      })) || []
  };
  
  // Compare with competitor if URL provided
  if (competitorUrl) {
    console.log(`\n   🔍 Comparing with competitor: ${competitorUrl}`);
    
    const competitorText = await fetchCompetitorContent(competitorUrl);
    
    if (competitorText) {
      console.log(`   Extracted ${competitorText.length} characters from competitor`);
      
      const competitorEntities = await analyzeEntities(competitorText);
      const competitorCategories = await classifyText(competitorText);
      
      const competitorAnalysis = {
        url: competitorUrl,
        wordCount: competitorText.split(/\s+/).length,
        entities: competitorEntities,
        categories: competitorCategories
      };
      
      analysis.competitor = competitorAnalysis;
      analysis.recommendations = compareAnalysis(analysis, competitorAnalysis);
      
      console.log(`\n   💡 Generated ${analysis.recommendations.length} recommendations`);
    }
  }
  
  // Save analysis
  const outputPath = path.join(ANALYSIS_DIR, `${slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  
  console.log(`   ✅ Analysis saved to: ${outputPath}`);
  
  // Print summary
  console.log(`\n   📈 Summary:`);
  console.log(`   - Word count: ${analysis.wordCount}`);
  console.log(`   - Top entities: ${analysis.topEntities.map(e => e.name).join(', ')}`);
  console.log(`   - Categories: ${analysis.topCategories.map(c => c.name).join(', ')}`);
  
  if (analysis.recommendations) {
    console.log(`\n   🎯 Recommendations:`);
    analysis.recommendations.forEach(rec => {
      console.log(`   - [${rec.priority.toUpperCase()}] ${rec.message}`);
    });
  }
  
  return analysis;
}

/**
 * Find all draft pages
 */
function findDraftPages() {
  const pages = [];
  
  function searchDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const pagePath = path.join(dir, entry.name, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          const content = fs.readFileSync(pagePath, 'utf-8');
          if (content.includes('/* DRAFT')) {
            const slug = path.relative(CONTENT_DIR, path.join(dir, entry.name));
            pages.push(slug);
          }
        }
        searchDir(path.join(dir, entry.name));
      }
    }
  }
  
  searchDir(CONTENT_DIR);
  return pages;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node nlp-content-analyzer.mjs <slug> [competitor-url]');
    console.error('   or: node nlp-content-analyzer.mjs all');
    process.exit(1);
  }
  
  const slug = args[0];
  const competitorUrl = args[1] || null;
  
  console.log('🚀 NLP Content Analyzer');
  console.log('=======================\n');
  
  if (slug === 'all') {
    const draftPages = findDraftPages();
    console.log(`Found ${draftPages.length} draft pages\n`);
    
    for (const page of draftPages) {
      await analyzePage(page);
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } else {
    await analyzePage(slug, competitorUrl);
  }
  
  console.log('\n✅ Analysis complete!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
