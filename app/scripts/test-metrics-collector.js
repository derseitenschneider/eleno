#!/usr/bin/env node

/**
 * Test Metrics Collector
 * 
 * Collects, stores, and tracks test metrics over time for trend analysis
 * and performance monitoring. Integrates with existing GitHub Actions
 * and provides historical data tracking.
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Configuration
const METRICS_DIR = join(rootDir, '.test-metrics');
const METRICS_FILE = join(METRICS_DIR, 'metrics-history.json');
const TRENDS_FILE = join(METRICS_DIR, 'trends.json');
const ALERTS_FILE = join(METRICS_DIR, 'alerts.json');

/**
 * Ensure metrics directory exists
 */
function ensureMetricsDir() {
  if (!existsSync(METRICS_DIR)) {
    mkdirSync(METRICS_DIR, { recursive: true });
  }
}

/**
 * Read and parse JSON file safely
 */
function readJsonFile(filePath) {
  try {
    if (!existsSync(filePath)) {
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
 * Write JSON file safely
 */
function writeJsonFile(filePath, data) {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Failed to write JSON file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Get current timestamp
 */
function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * Get git information
 */
function getGitInfo() {
  try {
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const author = execSync('git log -1 --pretty=format:"%an"', { encoding: 'utf8' }).trim();
    return { commit, branch, author };
  } catch (error) {
    console.warn('Git info collection failed:', error.message);
    return { commit: 'unknown', branch: 'unknown', author: 'unknown' };
  }
}

/**
 * Collect coverage metrics
 */
function collectCoverageMetrics() {
  const coverageSummaryPath = join(rootDir, 'coverage/coverage-summary.json');
  const coverageData = readJsonFile(coverageSummaryPath);
  
  if (!coverageData || !coverageData.total) {
    return null;
  }

  const { total } = coverageData;
  
  return {
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
}

/**
 * Collect Playwright metrics
 */
function collectPlaywrightMetrics() {
  const resultsPath = join(rootDir, 'test-results/results.json');
  const resultsData = readJsonFile(resultsPath);
  
  if (!resultsData) {
    return null;
  }

  const stats = resultsData.stats || {};
  
  return {
    total: stats.expected || 0,
    passed: stats.passed || 0,
    failed: stats.failed || 0,
    flaky: stats.flaky || 0,
    skipped: stats.skipped || 0,
    duration: stats.duration || 0,
    suites: resultsData.suites?.length || 0,
    passRate: stats.expected > 0 ? Math.round((stats.passed / stats.expected) * 100) : 0
  };
}

/**
 * Collect unit test metrics from Vitest
 */
function collectUnitTestMetrics() {
  // Try to read from different possible locations
  const possiblePaths = [
    join(rootDir, 'test-results/vitest-results.json'),
    join(rootDir, 'vitest-results.json'),
    join(rootDir, 'coverage/vitest-report.json'),
    // Check the Vite cache location for Vitest results
    join(rootDir, 'node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json')
  ];
  
  for (const path of possiblePaths) {
    const data = readJsonFile(path);
    if (data) {
      // Handle Vitest internal format with results array
      if (data.results && Array.isArray(data.results)) {
        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;
        let totalDuration = 0;
        
        data.results.forEach(([testFile, testResult]) => {
          totalTests++;
          if (testResult.failed === false) {
            passedTests++;
          } else if (testResult.failed === true) {
            failedTests++;
          }
          if (testResult.duration) {
            totalDuration += testResult.duration;
          }
        });
        
        return {
          total: totalTests,
          passed: passedTests,
          failed: failedTests,
          duration: Math.round(totalDuration),
          suites: totalTests // Each file is essentially a suite in Vitest
        };
      }
      
      // Handle standard test result formats
      if (data.testResults || data.results) {
        const results = data.testResults || data.results;
        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;
        let duration = 0;
        
        if (Array.isArray(results)) {
          results.forEach(result => {
            if (result.assertionResults) {
              result.assertionResults.forEach(test => {
                totalTests++;
                if (test.status === 'passed') passedTests++;
                if (test.status === 'failed') failedTests++;
              });
            }
            if (result.duration) duration += result.duration;
          });
        }
        
        return {
          total: totalTests,
          passed: passedTests,
          failed: failedTests,
          duration: duration,
          suites: results.length || 0
        };
      }
      
      // Handle other formats
      return {
        total: data.numTotalTests || data.tests?.length || 0,
        passed: data.numPassedTests || data.passed || 0,
        failed: data.numFailedTests || data.failed || 0,
        duration: data.testDuration || data.duration || 0,
        suites: data.numTotalTestSuites || data.suites || 0
      };
    }
  }
  
  return null;
}

/**
 * Collect performance metrics
 */
function collectPerformanceMetrics() {
  const performanceFiles = [
    join(rootDir, 'test-results/performance-results.json'),
    join(rootDir, 'playwright-report/performance.json')
  ];
  
  for (const path of performanceFiles) {
    const data = readJsonFile(path);
    if (data) {
      return data;
    }
  }
  
  // Default performance tracking
  return {
    buildTime: null,
    testExecutionTime: null,
    bundleSize: null
  };
}

/**
 * Collect build metrics
 */
function collectBuildMetrics() {
  const distPath = join(rootDir, 'dist');
  
  if (!existsSync(distPath)) {
    console.warn('Build directory not found, checking for alternative build outputs...');
    // Check for alternative build directories
    const alternativePaths = [
      join(rootDir, 'build'),
      join(rootDir, 'public/build'),
      join(rootDir, 'out')
    ];
    
    let foundPath = null;
    for (const altPath of alternativePaths) {
      if (existsSync(altPath)) {
        foundPath = altPath;
        break;
      }
    }
    
    if (!foundPath) {
      return {
        size: 0,
        sizeFormatted: '0 Bytes',
        timestamp: getCurrentTimestamp(),
        note: 'No build directory found'
      };
    }
  }
  
  try {
    const targetPath = existsSync(distPath) ? distPath : join(rootDir, 'build');
    // Use -k flag for kilobytes and convert to bytes (compatible with both macOS and Linux)
    const sizeOutput = execSync(`du -sk "${targetPath}"`, { encoding: 'utf8' });
    const sizeInKB = parseInt(sizeOutput.split(/\s+/)[0]);
    const size = sizeInKB * 1024; // Convert to bytes
    
    return {
      size: size,
      sizeFormatted: formatBytes(size),
      timestamp: getCurrentTimestamp()
    };
  } catch (error) {
    console.warn('Failed to calculate build size:', error.message);
    return {
      size: 0,
      sizeFormatted: '0 Bytes',
      timestamp: getCurrentTimestamp(),
      note: 'Size calculation failed'
    };
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Collect all metrics
 */
function collectAllMetrics() {
  const timestamp = getCurrentTimestamp();
  const gitInfo = getGitInfo();
  
  const metrics = {
    timestamp,
    git: gitInfo,
    environment: {
      nodeVersion: process.version,
      ci: process.env.CI === 'true',
      runner: process.env.RUNNER_OS || 'local',
      workflow: process.env.GITHUB_WORKFLOW || null,
      runId: process.env.GITHUB_RUN_ID || null
    },
    coverage: collectCoverageMetrics(),
    playwright: collectPlaywrightMetrics(),
    unitTests: collectUnitTestMetrics(),
    performance: collectPerformanceMetrics(),
    build: collectBuildMetrics()
  };
  
  return metrics;
}

/**
 * Load historical metrics
 */
function loadHistoricalMetrics() {
  const data = readJsonFile(METRICS_FILE);
  return data || { metrics: [], lastUpdated: null };
}

/**
 * Save metrics to history
 */
function saveMetrics(newMetric) {
  ensureMetricsDir();
  
  const history = loadHistoricalMetrics();
  history.metrics.push(newMetric);
  history.lastUpdated = getCurrentTimestamp();
  
  // Keep last 100 entries to prevent file from growing too large
  if (history.metrics.length > 100) {
    history.metrics = history.metrics.slice(-100);
  }
  
  return writeJsonFile(METRICS_FILE, history);
}

/**
 * Calculate trends
 */
function calculateTrends(metrics) {
  if (metrics.length < 2) {
    return null;
  }
  
  const latest = metrics[metrics.length - 1];
  const previous = metrics[metrics.length - 2];
  
  const trends = {
    timestamp: getCurrentTimestamp(),
    coverage: null,
    playwright: null,
    performance: null
  };
  
  // Coverage trends
  if (latest.coverage && previous.coverage) {
    trends.coverage = {
      statements: latest.coverage.statements.percentage - previous.coverage.statements.percentage,
      branches: latest.coverage.branches.percentage - previous.coverage.branches.percentage,
      functions: latest.coverage.functions.percentage - previous.coverage.functions.percentage,
      lines: latest.coverage.lines.percentage - previous.coverage.lines.percentage
    };
  }
  
  // Playwright trends
  if (latest.playwright && previous.playwright) {
    trends.playwright = {
      passRate: latest.playwright.passRate - previous.playwright.passRate,
      duration: latest.playwright.duration - previous.playwright.duration,
      total: latest.playwright.total - previous.playwright.total
    };
  }
  
  // Performance trends
  if (latest.build && previous.build) {
    trends.performance = {
      buildSize: latest.build.size - previous.build.size,
      buildSizePercent: ((latest.build.size - previous.build.size) / previous.build.size) * 100
    };
  }
  
  return trends;
}

/**
 * Detect alerts
 */
function detectAlerts(metrics, trends) {
  const alerts = [];
  const latest = metrics[metrics.length - 1];
  
  // Coverage alerts
  if (latest.coverage) {
    if (latest.coverage.statements.percentage < 80) {
      alerts.push({
        type: 'coverage',
        severity: 'high',
        message: `Statement coverage dropped to ${latest.coverage.statements.percentage}% (below 80% threshold)`,
        value: latest.coverage.statements.percentage,
        threshold: 80
      });
    }
    
    if (trends?.coverage?.statements < -5) {
      alerts.push({
        type: 'coverage',
        severity: 'medium',
        message: `Statement coverage decreased by ${Math.abs(trends.coverage.statements).toFixed(1)}%`,
        value: trends.coverage.statements,
        threshold: -5
      });
    }
  }
  
  // Test failure alerts
  if (latest.playwright) {
    if (latest.playwright.failed > 0) {
      alerts.push({
        type: 'test-failure',
        severity: latest.playwright.failed > 5 ? 'high' : 'medium',
        message: `${latest.playwright.failed} E2E tests failed`,
        value: latest.playwright.failed,
        threshold: 0
      });
    }
    
    if (latest.playwright.passRate < 95 && latest.playwright.total > 0) {
      alerts.push({
        type: 'pass-rate',
        severity: latest.playwright.passRate < 80 ? 'high' : 'medium',
        message: `E2E pass rate dropped to ${latest.playwright.passRate}%`,
        value: latest.playwright.passRate,
        threshold: 95
      });
    }
  }
  
  // Performance alerts
  if (trends?.performance?.buildSizePercent > 10) {
    alerts.push({
      type: 'performance',
      severity: 'medium',
      message: `Build size increased by ${trends.performance.buildSizePercent.toFixed(1)}%`,
      value: trends.performance.buildSizePercent,
      threshold: 10
    });
  }
  
  return alerts;
}

/**
 * Generate metrics summary for CI
 */
function generateCISummary(metrics) {
  const latest = metrics[metrics.length - 1];
  
  let summary = `## 📊 Test Metrics Summary\n\n`;
  summary += `**Timestamp**: ${latest.timestamp}\n`;
  summary += `**Commit**: \`${latest.git.commit.substring(0, 8)}\`\n`;
  summary += `**Branch**: \`${latest.git.branch}\`\n\n`;
  
  // Coverage summary
  if (latest.coverage) {
    summary += `### 📈 Coverage Metrics\n`;
    summary += `- **Statements**: ${latest.coverage.statements.percentage}%\n`;
    summary += `- **Branches**: ${latest.coverage.branches.percentage}%\n`;
    summary += `- **Functions**: ${latest.coverage.functions.percentage}%\n`;
    summary += `- **Lines**: ${latest.coverage.lines.percentage}%\n\n`;
  }
  
  // Test results summary
  if (latest.playwright) {
    summary += `### 🎭 E2E Test Results\n`;
    summary += `- **Total**: ${latest.playwright.total}\n`;
    summary += `- **Passed**: ${latest.playwright.passed}\n`;
    summary += `- **Failed**: ${latest.playwright.failed}\n`;
    summary += `- **Pass Rate**: ${latest.playwright.passRate}%\n\n`;
  }
  
  // Build metrics
  if (latest.build) {
    summary += `### 🔨 Build Metrics\n`;
    summary += `- **Bundle Size**: ${latest.build.sizeFormatted}\n\n`;
  }
  
  return summary;
}

/**
 * Main execution
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'collect':
      console.log('📊 Collecting test metrics...');
      const metrics = collectAllMetrics();
      const saved = saveMetrics(metrics);
      
      if (saved) {
        console.log('✅ Metrics collected and saved successfully');
        console.log(JSON.stringify(metrics, null, 2));
      } else {
        console.error('❌ Failed to save metrics');
        process.exit(1);
      }
      break;
      
    case 'trends':
      const history = loadHistoricalMetrics();
      const trends = calculateTrends(history.metrics);
      
      if (trends) {
        ensureMetricsDir();
        writeJsonFile(TRENDS_FILE, trends);
        console.log('📈 Trends calculated:');
        console.log(JSON.stringify(trends, null, 2));
      } else {
        console.log('⚠️ Not enough data to calculate trends');
      }
      break;
      
    case 'alerts':
      const historyForAlerts = loadHistoricalMetrics();
      const trendsForAlerts = calculateTrends(historyForAlerts.metrics);
      const alerts = detectAlerts(historyForAlerts.metrics, trendsForAlerts);
      
      ensureMetricsDir();
      const alertData = {
        timestamp: getCurrentTimestamp(),
        alerts,
        count: alerts.length
      };
      writeJsonFile(ALERTS_FILE, alertData);
      
      console.log(`🚨 Detected ${alerts.length} alerts:`);
      console.log(JSON.stringify(alertData, null, 2));
      
      // Exit with error code if high severity alerts exist
      const highSeverityAlerts = alerts.filter(a => a.severity === 'high');
      if (highSeverityAlerts.length > 0) {
        console.error(`❌ ${highSeverityAlerts.length} high severity alerts detected`);
        process.exit(1);
      }
      break;
      
    case 'summary':
      const summaryHistory = loadHistoricalMetrics();
      if (summaryHistory.metrics.length > 0) {
        const summary = generateCISummary(summaryHistory.metrics);
        console.log(summary);
      } else {
        console.log('⚠️ No metrics data available');
      }
      break;
      
    case 'history':
      const fullHistory = loadHistoricalMetrics();
      console.log(JSON.stringify(fullHistory, null, 2));
      break;
      
    default:
      console.log('Usage: node test-metrics-collector.js [collect|trends|alerts|summary|history]');
      console.log('  collect  - Collect current test metrics');
      console.log('  trends   - Calculate trends from historical data');
      console.log('  alerts   - Detect and report alerts');
      console.log('  summary  - Generate CI summary');
      console.log('  history  - Show full metrics history');
      process.exit(1);
  }
}

main();