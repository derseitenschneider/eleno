#!/usr/bin/env node

/**
 * Test Result Summary Generator
 * 
 * This script generates comprehensive test summaries from various test outputs
 * including coverage data, Playwright results, and Vitest results.
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Read and parse JSON file safely
 */
function readJsonFile(filePath) {
  try {
    if (!existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to parse JSON file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Generate coverage badge color based on percentage
 */
function getCoverageColor(percentage) {
  if (percentage >= 95) return 'brightgreen';
  if (percentage >= 80) return 'green';
  if (percentage >= 70) return 'yellow';
  if (percentage >= 50) return 'orange';
  return 'red';
}

/**
 * Generate coverage summary from coverage data
 */
function generateCoverageSummary() {
  const coverageSummaryPath = join(rootDir, 'coverage/coverage-summary.json');
  const coverageData = readJsonFile(coverageSummaryPath);
  
  if (!coverageData || !coverageData.total) {
    return {
      error: 'Coverage data not available',
      badges: {}
    };
  }

  const { total } = coverageData;
  
  const summary = {
    statements: {
      covered: total.statements.covered,
      total: total.statements.total,
      percentage: Math.round(total.statements.pct * 100) / 100
    },
    branches: {
      covered: total.branches.covered,
      total: total.branches.total,
      percentage: Math.round(total.branches.pct * 100) / 100
    },
    functions: {
      covered: total.functions.covered,
      total: total.functions.total,
      percentage: Math.round(total.functions.pct * 100) / 100
    },
    lines: {
      covered: total.lines.covered,
      total: total.lines.total,
      percentage: Math.round(total.lines.pct * 100) / 100
    }
  };

  // Generate shield.io badge URLs
  const badges = {
    statements: `https://img.shields.io/badge/Coverage%20Statements-${summary.statements.percentage}%25-${getCoverageColor(summary.statements.percentage)}`,
    branches: `https://img.shields.io/badge/Coverage%20Branches-${summary.branches.percentage}%25-${getCoverageColor(summary.branches.percentage)}`,
    functions: `https://img.shields.io/badge/Coverage%20Functions-${summary.functions.percentage}%25-${getCoverageColor(summary.functions.percentage)}`,
    lines: `https://img.shields.io/badge/Coverage%20Lines-${summary.lines.percentage}%25-${getCoverageColor(summary.lines.percentage)}`
  };

  return { summary, badges };
}

/**
 * Generate Playwright test summary
 */
function generatePlaywrightSummary() {
  const resultsPath = join(rootDir, 'test-results/results.json');
  const resultsData = readJsonFile(resultsPath);
  
  if (!resultsData) {
    return {
      error: 'Playwright results not available',
      summary: null
    };
  }

  const summary = {
    total: resultsData.stats?.expected || 0,
    passed: resultsData.stats?.passed || 0,
    failed: resultsData.stats?.failed || 0,
    flaky: resultsData.stats?.flaky || 0,
    skipped: resultsData.stats?.skipped || 0,
    duration: resultsData.stats?.duration || 0,
    suites: resultsData.suites?.length || 0
  };

  const passRate = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;
  
  return {
    summary,
    passRate,
    badge: `https://img.shields.io/badge/E2E%20Tests-${summary.passed}%2F${summary.total}%20passed-${passRate >= 95 ? 'brightgreen' : passRate >= 80 ? 'green' : 'red'}`
  };
}

/**
 * Generate GitHub Step Summary format
 */
function generateGitHubSummary() {
  const coverage = generateCoverageSummary();
  const playwright = generatePlaywrightSummary();
  
  let summary = `# 📊 Test Results Summary\n\n`;
  
  // Coverage Section
  summary += `## 📈 Code Coverage\n\n`;
  if (coverage.error) {
    summary += `❌ ${coverage.error}\n\n`;
  } else {
    const { summary: cov } = coverage;
    summary += `| Metric | Coverage | Covered/Total |\n`;
    summary += `|--------|----------|---------------|\n`;
    summary += `| Statements | ${cov.statements.percentage}% | ${cov.statements.covered}/${cov.statements.total} |\n`;
    summary += `| Branches | ${cov.branches.percentage}% | ${cov.branches.covered}/${cov.branches.total} |\n`;
    summary += `| Functions | ${cov.functions.percentage}% | ${cov.functions.covered}/${cov.functions.total} |\n`;
    summary += `| Lines | ${cov.lines.percentage}% | ${cov.lines.covered}/${cov.lines.total} |\n\n`;
    
    summary += `### Coverage Badges\n`;
    summary += `![Statements](${coverage.badges.statements}) `;
    summary += `![Branches](${coverage.badges.branches}) `;
    summary += `![Functions](${coverage.badges.functions}) `;
    summary += `![Lines](${coverage.badges.lines})\n\n`;
  }
  
  // Playwright Section
  summary += `## 🎭 End-to-End Tests\n\n`;
  if (playwright.error) {
    summary += `❌ ${playwright.error}\n\n`;
  } else {
    const { summary: pw } = playwright;
    summary += `| Metric | Count |\n`;
    summary += `|--------|-------|\n`;
    summary += `| Total Tests | ${pw.total} |\n`;
    summary += `| Passed | ${pw.passed} |\n`;
    summary += `| Failed | ${pw.failed} |\n`;
    summary += `| Flaky | ${pw.flaky} |\n`;
    summary += `| Skipped | ${pw.skipped} |\n`;
    summary += `| Test Suites | ${pw.suites} |\n`;
    summary += `| Duration | ${Math.round(pw.duration / 1000)}s |\n\n`;
    
    summary += `**Pass Rate**: ${playwright.passRate}%\n\n`;
    summary += `![E2E Tests](${playwright.badge})\n\n`;
  }
  
  // Artifacts Section
  summary += `## 📦 Available Artifacts\n\n`;
  summary += `- 📊 [Coverage Report HTML](./coverage/index.html)\n`;
  summary += `- 🎭 [Playwright Report HTML](./playwright-report/index.html)\n`;
  summary += `- 📋 [Test Results JSON](./test-results/results.json)\n`;
  summary += `- 🧾 [JUnit XML](./test-results/junit.xml)\n\n`;
  
  return summary;
}

/**
 * Generate badge markdown for README
 */
function generateBadgeMarkdown() {
  const coverage = generateCoverageSummary();
  const playwright = generatePlaywrightSummary();
  
  let badges = `<!-- TEST BADGES - Auto-generated, do not edit manually -->\n`;
  
  if (!coverage.error) {
    badges += `![Coverage Statements](${coverage.badges.statements})\n`;
    badges += `![Coverage Branches](${coverage.badges.branches})\n`;
    badges += `![Coverage Functions](${coverage.badges.functions})\n`;
    badges += `![Coverage Lines](${coverage.badges.lines})\n`;
  }
  
  if (!playwright.error) {
    badges += `![E2E Tests](${playwright.badge})\n`;
  }
  
  badges += `<!-- END TEST BADGES -->\n`;
  
  return badges;
}

/**
 * Main execution
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'github':
      console.log(generateGitHubSummary());
      break;
    case 'badges':
      console.log(generateBadgeMarkdown());
      break;
    case 'coverage':
      console.log(JSON.stringify(generateCoverageSummary(), null, 2));
      break;
    case 'playwright':
      console.log(JSON.stringify(generatePlaywrightSummary(), null, 2));
      break;
    default:
      console.log('Usage: node generate-test-summary.js [github|badges|coverage|playwright]');
      console.log('  github     - Generate GitHub Step Summary format');
      console.log('  badges     - Generate badge markdown for README');
      console.log('  coverage   - Generate coverage summary JSON');
      console.log('  playwright - Generate Playwright summary JSON');
      process.exit(1);
  }
}

main();