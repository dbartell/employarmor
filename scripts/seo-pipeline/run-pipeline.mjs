#!/usr/bin/env node

/**
 * run-pipeline.mjs
 * 
 * Orchestrator that runs the full SEO pipeline:
 * 1. keyword-research
 * 2. serp-analyzer
 * 3. competitor-backlinks
 * 4. content-cluster
 * 5. internal-linking
 * 6. technical-audit
 * 
 * Generates final REPORT.md with all findings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runKeywordResearch } from './keyword-research.mjs';
import { runSerpAnalysis } from './serp-analyzer.mjs';
import { runBacklinkAnalysis } from './competitor-backlinks.mjs';
import { runContentClustering } from './content-cluster.mjs';
import { runInternalLinkingAnalysis } from './internal-linking.mjs';
import { runTechnicalAudit } from './technical-audit.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load config
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    seedKeywords: config.seedKeywords,
    competitors: config.competitors,
    skip: [],
    dryRun: false,
    targetUrl: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--seed-keywords' && args[i + 1]) {
      options.seedKeywords = args[i + 1].split(',').map(k => k.trim());
      i++;
    } else if (arg === '--competitors' && args[i + 1]) {
      options.competitors = args[i + 1].split(',').map(c => c.trim());
      i++;
    } else if (arg === '--skip' && args[i + 1]) {
      options.skip = args[i + 1].split(',').map(s => s.trim());
      i++;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--target-url' && args[i + 1]) {
      options.targetUrl = args[i + 1];
      i++;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
SEO Pipeline Orchestrator

Usage: node run-pipeline.mjs [options]

Options:
  --seed-keywords <keywords>   Comma-separated seed keywords (overrides config)
  --competitors <domains>      Comma-separated competitor domains (overrides config)
  --skip <steps>               Skip specific steps (comma-separated)
                               Available: keyword-research, serp-analyzer, 
                                         competitor-backlinks, content-cluster,
                                         internal-linking, technical-audit
  --target-url <url>           Target URL for technical audit (default: https://employarmor.com)
  --dry-run                    Show what would run without executing
  --help, -h                   Show this help message

Examples:
  # Run full pipeline
  node run-pipeline.mjs

  # Run with custom keywords
  node run-pipeline.mjs --seed-keywords "AI compliance,bias audit"

  # Skip technical audit
  node run-pipeline.mjs --skip technical-audit

  # Dry run to see what would execute
  node run-pipeline.mjs --dry-run
`);
}

/**
 * Main pipeline execution
 */
async function runPipeline() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           EmployArmor SEO Automation Pipeline                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const options = parseArgs();
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];

  // Create timestamped output directory
  const outputDir = path.join(config.outputDir, timestamp);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Output directory: ${outputDir}\n`);
  console.log('Configuration:');
  console.log(`  Seed keywords: ${options.seedKeywords.join(', ')}`);
  console.log(`  Competitors: ${options.competitors.join(', ')}`);
  if (options.skip.length > 0) {
    console.log(`  Skipping: ${options.skip.join(', ')}`);
  }
  console.log(`  Dry run: ${options.dryRun}\n`);

  const steps = [
    { id: 'keyword-research', name: 'Keyword Research', fn: runKeywordResearch },
    { id: 'serp-analyzer', name: 'SERP Analysis', fn: runSerpAnalysis },
    { id: 'competitor-backlinks', name: 'Competitor Backlinks', fn: runBacklinkAnalysis },
    { id: 'content-cluster', name: 'Content Clustering', fn: runContentClustering },
    { id: 'internal-linking', name: 'Internal Linking', fn: runInternalLinkingAnalysis },
    { id: 'technical-audit', name: 'Technical Audit', fn: runTechnicalAudit }
  ];

  const stepsToRun = steps.filter(step => !options.skip.includes(step.id));

  console.log('Pipeline Steps:');
  stepsToRun.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step.name}`);
  });
  console.log('');

  if (options.dryRun) {
    console.log('DRY RUN - No steps will be executed.\n');
    return;
  }

  const results = {
    timestamp: new Date().toISOString(),
    configuration: options,
    steps: [],
    summary: {
      totalSteps: stepsToRun.length,
      completedSteps: 0,
      failedSteps: 0,
      totalDuration: 0
    }
  };

  let keywordResearchFile = null;
  let contentClustersFile = null;

  // Execute pipeline steps
  for (let i = 0; i < stepsToRun.length; i++) {
    const step = stepsToRun[i];
    const stepNumber = i + 1;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`STEP ${stepNumber}/${stepsToRun.length}: ${step.name.toUpperCase()}`);
    console.log('='.repeat(70) + '\n');

    const stepResult = {
      id: step.id,
      name: step.name,
      status: 'running',
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      error: null,
      output: null
    };

    const startTime = Date.now();

    try {
      let output;

      // Execute step with appropriate arguments
      switch (step.id) {
        case 'keyword-research':
          output = await step.fn(options.seedKeywords);
          // Save the latest keyword research file path
          keywordResearchFile = findLatestFile(config.outputDir, 'keyword-research-');
          break;

        case 'serp-analyzer':
          output = await step.fn(keywordResearchFile, 50);
          break;

        case 'competitor-backlinks':
          output = await step.fn(options.competitors);
          break;

        case 'content-cluster':
          if (!keywordResearchFile) {
            throw new Error('Keyword research file not found. Run keyword-research first.');
          }
          output = await step.fn(keywordResearchFile);
          contentClustersFile = findLatestFile(config.outputDir, 'content-clusters-');
          break;

        case 'internal-linking':
          output = await step.fn(contentClustersFile);
          break;

        case 'technical-audit':
          output = await step.fn(options.targetUrl);
          break;

        default:
          throw new Error(`Unknown step: ${step.id}`);
      }

      const endTime = Date.now();
      stepResult.status = 'completed';
      stepResult.endTime = new Date().toISOString();
      stepResult.duration = endTime - startTime;
      stepResult.output = output;

      results.summary.completedSteps++;
      
      console.log(`\n✓ ${step.name} completed in ${(stepResult.duration / 1000).toFixed(2)}s`);

    } catch (error) {
      const endTime = Date.now();
      stepResult.status = 'failed';
      stepResult.endTime = new Date().toISOString();
      stepResult.duration = endTime - startTime;
      stepResult.error = error.message;

      results.summary.failedSteps++;

      console.error(`\n✗ ${step.name} failed: ${error.message}`);
      
      // Ask whether to continue
      if (i < stepsToRun.length - 1) {
        console.log('\nContinuing to next step...\n');
      }
    }

    results.steps.push(stepResult);
    results.summary.totalDuration += stepResult.duration;
  }

  // Generate final report
  console.log(`\n${'='.repeat(70)}`);
  console.log('GENERATING FINAL REPORT');
  console.log('='.repeat(70) + '\n');

  const reportPath = path.join(outputDir, 'REPORT.md');
  const report = generateFinalReport(results);
  fs.writeFileSync(reportPath, report);

  // Save results JSON
  const resultsPath = path.join(outputDir, 'pipeline-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  // Print summary
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                     PIPELINE COMPLETE                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('Summary:');
  console.log(`  Total steps: ${results.summary.totalSteps}`);
  console.log(`  Completed: ${results.summary.completedSteps}`);
  console.log(`  Failed: ${results.summary.failedSteps}`);
  console.log(`  Total duration: ${(results.summary.totalDuration / 1000).toFixed(2)}s`);
  console.log(`\nOutput directory: ${outputDir}`);
  console.log(`Final report: ${reportPath}\n`);

  if (results.summary.failedSteps > 0) {
    console.log('⚠️  Some steps failed. Check the report for details.\n');
    process.exit(1);
  } else {
    console.log('✓ All steps completed successfully!\n');
    process.exit(0);
  }
}

/**
 * Find latest file matching pattern
 */
function findLatestFile(dir, pattern) {
  const files = fs.readdirSync(dir)
    .filter(f => f.startsWith(pattern) && f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(dir, f),
      time: fs.statSync(path.join(dir, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);

  return files.length > 0 ? files[0].path : null;
}

/**
 * Generate final report markdown
 */
function generateFinalReport(results) {
  let md = '# EmployArmor SEO Automation Pipeline Report\n\n';
  md += `Generated: ${results.timestamp}\n\n`;
  
  md += '## Executive Summary\n\n';
  md += `- **Total Steps**: ${results.summary.totalSteps}\n`;
  md += `- **Completed**: ${results.summary.completedSteps} ✓\n`;
  md += `- **Failed**: ${results.summary.failedSteps}\n`;
  md += `- **Total Duration**: ${(results.summary.totalDuration / 1000 / 60).toFixed(2)} minutes\n\n`;

  md += '## Configuration\n\n';
  md += `- **Seed Keywords**: ${results.configuration.seedKeywords.join(', ')}\n`;
  md += `- **Competitors**: ${results.configuration.competitors.join(', ')}\n\n`;

  md += '## Pipeline Steps\n\n';
  
  results.steps.forEach((step, i) => {
    const status = step.status === 'completed' ? '✓' : '✗';
    md += `### ${i + 1}. ${step.name} ${status}\n\n`;
    md += `- **Status**: ${step.status}\n`;
    md += `- **Duration**: ${(step.duration / 1000).toFixed(2)}s\n`;
    
    if (step.error) {
      md += `- **Error**: ${step.error}\n`;
    }
    
    if (step.output) {
      md += `\n**Key Findings:**\n\n`;
      md += formatStepOutput(step.id, step.output);
    }
    
    md += '\n';
  });

  md += '## Next Steps\n\n';
  md += generateNextSteps(results);

  return md;
}

/**
 * Format step output for report
 */
function formatStepOutput(stepId, output) {
  let md = '';

  switch (stepId) {
    case 'keyword-research':
      md += `- Total Keywords Found: ${output.totalKeywords}\n`;
      md += `- Top Opportunity: ${output.keywords[0]?.keyword} (Volume: ${output.keywords[0]?.volume})\n`;
      break;

    case 'serp-analyzer':
      md += `- Keywords We Rank For: ${output.summary.keywordsWeRank}\n`;
      md += `- Keywords We Don't Rank For: ${output.summary.keywordsWeDoNotRank}\n`;
      md += `- Gap Opportunities: ${output.gapOpportunities.length}\n`;
      break;

    case 'competitor-backlinks':
      md += `- Total Opportunities: ${output.summary.totalOpportunities}\n`;
      md += `- High Priority: ${output.summary.highPriorityOpportunities}\n`;
      md += `- Average Domain Rank: ${output.summary.avgDomainRank}\n`;
      break;

    case 'content-cluster':
      md += `- Total Clusters: ${output.summary.totalClusters}\n`;
      md += `- Content Gaps: ${output.summary.contentGaps}\n`;
      md += `- Calendar Items: ${output.summary.calendarItems}\n`;
      break;

    case 'internal-linking':
      md += `- Total Pages: ${output.summary.totalPages}\n`;
      md += `- Existing Links: ${output.summary.totalExistingLinks}\n`;
      md += `- New Link Opportunities: ${output.summary.totalRecommendations}\n`;
      break;

    case 'technical-audit':
      md += `- Pages Crawled: ${output.stats.totalPages}\n`;
      md += `- Critical Issues: ${output.stats.criticalIssues}\n`;
      md += `- High Priority Issues: ${output.stats.highIssues}\n`;
      break;
  }

  return md;
}

/**
 * Generate next steps recommendations
 */
function generateNextSteps(results) {
  let md = '';

  md += '1. **Review Keyword Research**\n';
  md += '   - Validate high-opportunity keywords\n';
  md += '   - Add to content strategy\n\n';

  md += '2. **Address SERP Gaps**\n';
  md += '   - Focus on keywords where competitors rank but we don\'t\n';
  md += '   - Create targeted content for high-opportunity gaps\n\n';

  md += '3. **Backlink Outreach**\n';
  md += '   - Prioritize high-domain-rank opportunities\n';
  md += '   - Create outreach templates\n';
  md += '   - Track outreach progress\n\n';

  md += '4. **Content Creation**\n';
  md += '   - Follow content calendar priorities\n';
  md += '   - Address content gaps first\n';
  md += '   - Optimize existing content\n\n';

  md += '5. **Internal Linking**\n';
  md += '   - Implement high-priority internal links\n';
  md += '   - Use recommended anchor texts\n';
  md += '   - Track implementation\n\n';

  md += '6. **Technical Fixes**\n';
  md += '   - Address critical issues immediately\n';
  md += '   - Schedule high-priority fixes\n';
  md += '   - Re-audit after fixes\n\n';

  return md;
}

// CLI execution
if (process.argv[1] === __filename) {
  runPipeline().catch(error => {
    console.error('\n❌ Pipeline failed:', error);
    process.exit(1);
  });
}

export { runPipeline };
