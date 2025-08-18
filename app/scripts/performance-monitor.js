#!/usr/bin/env node

/**
 * Performance Monitor
 * 
 * Monitors test execution performance, build times, and detects regressions
 * Tracks performance trends and provides optimization recommendations
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const PERFORMANCE_DIR = join(rootDir, '.test-metrics/performance');
const PERFORMANCE_FILE = join(PERFORMANCE_DIR, 'performance-history.json');
const BENCHMARKS_FILE = join(PERFORMANCE_DIR, 'benchmarks.json');
const REGRESSIONS_FILE = join(PERFORMANCE_DIR, 'regressions.json');

/**
 * Ensure performance directory exists
 */
function ensurePerformanceDir() {
  if (!existsSync(PERFORMANCE_DIR)) {
    mkdirSync(PERFORMANCE_DIR, { recursive: true });
  }
}

/**
 * Read JSON file safely
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
 * Get system information
 */
function getSystemInfo() {
  try {
    const os = require('os');
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      nodeVersion: process.version,
      ci: process.env.CI === 'true',
      runner: process.env.RUNNER_OS || 'local'
    };
  } catch (error) {
    return null;
  }
}

/**
 * Measure command execution time
 */
function measureCommand(command, label) {
  console.log(`⏱️ Measuring ${label}...`);
  const start = performance.now();
  
  try {
    const output = execSync(command, { 
      stdio: 'pipe', 
      encoding: 'utf8',
      timeout: 600000 // 10 minutes timeout
    });
    
    const end = performance.now();
    const duration = end - start;
    
    return {
      success: true,
      duration: Math.round(duration),
      output: output.trim()
    };
  } catch (error) {
    const end = performance.now();
    const duration = end - start;
    
    return {
      success: false,
      duration: Math.round(duration),
      error: error.message,
      output: error.stdout?.toString() || ''
    };
  }
}

/**
 * Measure build performance
 */
function measureBuildPerformance() {
  const results = {
    staging: null,
    production: null,
    typecheck: null,
    clean: null
  };
  
  // Clean build
  console.log('🧹 Cleaning previous builds...');
  try {
    execSync('rm -rf dist', { cwd: rootDir, stdio: 'pipe' });
    results.clean = { success: true };
  } catch (error) {
    results.clean = { success: false, error: error.message };
  }
  
  // TypeScript check
  results.typecheck = measureCommand('npm run typecheck', 'TypeScript checking');
  
  // Staging build
  results.staging = measureCommand('npm run build:staging', 'Staging build');
  
  // Clean for production build
  try {
    execSync('rm -rf dist', { cwd: rootDir, stdio: 'pipe' });
  } catch (error) {
    // Ignore cleanup errors
  }
  
  // Production build
  results.production = measureCommand('npm run build', 'Production build');
  
  // Get bundle size information
  if (results.production.success && existsSync(join(rootDir, 'dist'))) {
    try {
      const sizeOutput = execSync(`du -sb "${join(rootDir, 'dist')}"`, { encoding: 'utf8' });
      const size = parseInt(sizeOutput.split('\t')[0]);
      results.production.bundleSize = size;
      results.production.bundleSizeFormatted = formatBytes(size);
    } catch (error) {
      // Ignore bundle size errors
    }
  }
  
  return results;
}

/**
 * Measure test performance
 */
function measureTestPerformance() {
  const results = {
    unit: null,
    unitCoverage: null,
    playwright: null,
    benchmarks: null
  };
  
  // Unit tests
  results.unit = measureCommand('npm run test', 'Unit tests');
  
  // Unit tests with coverage
  results.unitCoverage = measureCommand('npm run test:cov', 'Unit tests with coverage');
  
  // Playwright tests (subset for performance)
  results.playwright = measureCommand('npm run pw -- --project="*performance*" --reporter=list', 'Playwright performance tests');
  
  // Test benchmarks if available
  if (existsSync(join(rootDir, 'scripts/test-benchmark.js'))) {
    results.benchmarks = measureCommand('npm run test:benchmark', 'Test benchmarks');
  }
  
  return results;
}

/**
 * Measure cache performance
 */
function measureCachePerformance() {
  const caches = {
    nodeModules: join(rootDir, 'node_modules'),
    dist: join(rootDir, 'dist'),
    coverage: join(rootDir, 'coverage'),
    playwright: join(require('os').homedir(), '.cache/ms-playwright'),
    testResults: join(rootDir, 'test-results')
  };
  
  const results = {};
  
  Object.entries(caches).forEach(([name, path]) => {
    try {
      if (existsSync(path)) {
        const sizeOutput = execSync(`du -sb "${path}"`, { encoding: 'utf8' });
        const size = parseInt(sizeOutput.split('\t')[0]);
        results[name] = {
          exists: true,
          size: size,
          sizeFormatted: formatBytes(size)
        };
      } else {
        results[name] = { exists: false };
      }
    } catch (error) {
      results[name] = { exists: false, error: error.message };
    }
  });
  
  return results;
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
 * Run comprehensive performance benchmark
 */
function runPerformanceBenchmark() {
  console.log('🚀 Starting comprehensive performance benchmark...');
  
  const benchmark = {
    timestamp: new Date().toISOString(),
    system: getSystemInfo(),
    build: measureBuildPerformance(),
    tests: measureTestPerformance(),
    cache: measureCachePerformance()
  };
  
  // Calculate totals
  benchmark.totals = {
    buildTime: (benchmark.build.staging?.duration || 0) + (benchmark.build.production?.duration || 0),
    testTime: (benchmark.tests.unit?.duration || 0) + (benchmark.tests.playwright?.duration || 0),
    totalTime: 0
  };
  benchmark.totals.totalTime = benchmark.totals.buildTime + benchmark.totals.testTime;
  
  return benchmark;
}

/**
 * Load performance history
 */
function loadPerformanceHistory() {
  const data = readJsonFile(PERFORMANCE_FILE);
  return data || { benchmarks: [], lastUpdated: null };
}

/**
 * Save performance benchmark
 */
function savePerformanceBenchmark(benchmark) {
  ensurePerformanceDir();
  
  const history = loadPerformanceHistory();
  history.benchmarks.push(benchmark);
  history.lastUpdated = new Date().toISOString();
  
  // Keep last 50 benchmarks to prevent file from growing too large
  if (history.benchmarks.length > 50) {
    history.benchmarks = history.benchmarks.slice(-50);
  }
  
  return writeJsonFile(PERFORMANCE_FILE, history);
}

/**
 * Detect performance regressions
 */
function detectPerformanceRegressions(benchmarks) {
  if (benchmarks.length < 2) {
    return [];
  }
  
  const latest = benchmarks[benchmarks.length - 1];
  const previous = benchmarks[benchmarks.length - 2];
  const regressions = [];
  
  // Define regression thresholds (percentage increase)
  const thresholds = {
    buildTime: 20,
    testTime: 25,
    totalTime: 20,
    bundleSize: 10
  };
  
  // Check build time regression
  if (latest.totals.buildTime && previous.totals.buildTime) {
    const increase = ((latest.totals.buildTime - previous.totals.buildTime) / previous.totals.buildTime) * 100;
    if (increase > thresholds.buildTime) {
      regressions.push({
        type: 'build-time',
        metric: 'Build Time',
        current: latest.totals.buildTime,
        previous: previous.totals.buildTime,
        increase: increase.toFixed(1),
        threshold: thresholds.buildTime,
        severity: increase > 50 ? 'high' : 'medium'
      });
    }
  }
  
  // Check test time regression
  if (latest.totals.testTime && previous.totals.testTime) {
    const increase = ((latest.totals.testTime - previous.totals.testTime) / previous.totals.testTime) * 100;
    if (increase > thresholds.testTime) {
      regressions.push({
        type: 'test-time',
        metric: 'Test Execution Time',
        current: latest.totals.testTime,
        previous: previous.totals.testTime,
        increase: increase.toFixed(1),
        threshold: thresholds.testTime,
        severity: increase > 50 ? 'high' : 'medium'
      });
    }
  }
  
  // Check bundle size regression
  if (latest.build.production?.bundleSize && previous.build.production?.bundleSize) {
    const increase = ((latest.build.production.bundleSize - previous.build.production.bundleSize) / previous.build.production.bundleSize) * 100;
    if (increase > thresholds.bundleSize) {
      regressions.push({
        type: 'bundle-size',
        metric: 'Bundle Size',
        current: latest.build.production.bundleSize,
        previous: previous.build.production.bundleSize,
        increase: increase.toFixed(1),
        threshold: thresholds.bundleSize,
        severity: increase > 25 ? 'high' : 'medium'
      });
    }
  }
  
  return regressions;
}

/**
 * Generate performance report
 */
function generatePerformanceReport(benchmarks) {
  if (benchmarks.length === 0) {
    return 'No performance data available.';
  }
  
  const latest = benchmarks[benchmarks.length - 1];
  const regressions = detectPerformanceRegressions(benchmarks);
  
  let report = `# 📊 Performance Report\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**Benchmark Date**: ${latest.timestamp}\n\n`;
  
  if (regressions.length > 0) {
    report += `## 🚨 Performance Regressions (${regressions.length})\n\n`;
    regressions.forEach(reg => {
      const emoji = reg.severity === 'high' ? '🚨' : '⚠️';
      report += `${emoji} **${reg.metric}**: Increased by ${reg.increase}% (threshold: ${reg.threshold}%)\n`;
      report += `   - Current: ${reg.current}ms\n`;
      report += `   - Previous: ${reg.previous}ms\n\n`;
    });
  }
  
  report += `## ⏱️ Performance Summary\n\n`;
  report += `| Metric | Duration | Status |\n`;
  report += `|--------|----------|--------|\n`;
  
  if (latest.build.typecheck) {
    const status = latest.build.typecheck.success ? '✅' : '❌';
    report += `| TypeScript Check | ${latest.build.typecheck.duration}ms | ${status} |\n`;
  }
  
  if (latest.build.staging) {
    const status = latest.build.staging.success ? '✅' : '❌';
    report += `| Staging Build | ${latest.build.staging.duration}ms | ${status} |\n`;
  }
  
  if (latest.build.production) {
    const status = latest.build.production.success ? '✅' : '❌';
    report += `| Production Build | ${latest.build.production.duration}ms | ${status} |\n`;
    if (latest.build.production.bundleSizeFormatted) {
      report += `| Bundle Size | ${latest.build.production.bundleSizeFormatted} | - |\n`;
    }
  }
  
  if (latest.tests.unit) {
    const status = latest.tests.unit.success ? '✅' : '❌';
    report += `| Unit Tests | ${latest.tests.unit.duration}ms | ${status} |\n`;
  }
  
  if (latest.tests.playwright) {
    const status = latest.tests.playwright.success ? '✅' : '❌';
    report += `| E2E Tests | ${latest.tests.playwright.duration}ms | ${status} |\n`;
  }
  
  report += `| **Total Time** | **${latest.totals.totalTime}ms** | - |\n\n`;
  
  // System info
  if (latest.system) {
    report += `## 🖥️ System Information\n\n`;
    report += `- Platform: ${latest.system.platform} (${latest.system.arch})\n`;
    report += `- CPUs: ${latest.system.cpus}\n`;
    report += `- Memory: ${formatBytes(latest.system.totalMemory)} total, ${formatBytes(latest.system.freeMemory)} free\n`;
    report += `- Node.js: ${latest.system.nodeVersion}\n`;
    report += `- Environment: ${latest.system.ci ? 'CI' : 'Local'} (${latest.system.runner})\n\n`;
  }
  
  // Cache information
  if (latest.cache) {
    report += `## 💾 Cache Information\n\n`;
    Object.entries(latest.cache).forEach(([name, info]) => {
      if (info.exists && info.sizeFormatted) {
        report += `- ${name}: ${info.sizeFormatted}\n`;
      }
    });
    report += '\n';
  }
  
  // Trend analysis
  if (benchmarks.length > 1) {
    report += `## 📈 Performance Trends\n\n`;
    const previous = benchmarks[benchmarks.length - 2];
    
    const buildChange = latest.totals.buildTime - previous.totals.buildTime;
    const testChange = latest.totals.testTime - previous.totals.testTime;
    const totalChange = latest.totals.totalTime - previous.totals.totalTime;
    
    const buildIcon = buildChange === 0 ? '➡️' : buildChange > 0 ? '📈' : '📉';
    const testIcon = testChange === 0 ? '➡️' : testChange > 0 ? '📈' : '📉';
    const totalIcon = totalChange === 0 ? '➡️' : totalChange > 0 ? '📈' : '📉';
    
    report += `${buildIcon} Build time: ${buildChange > 0 ? '+' : ''}${buildChange}ms\n`;
    report += `${testIcon} Test time: ${testChange > 0 ? '+' : ''}${testChange}ms\n`;
    report += `${totalIcon} Total time: ${totalChange > 0 ? '+' : ''}${totalChange}ms\n\n`;
  }
  
  return report;
}

/**
 * Generate optimization recommendations
 */
function generateOptimizationRecommendations(benchmarks) {
  if (benchmarks.length === 0) {
    return [];
  }
  
  const latest = benchmarks[benchmarks.length - 1];
  const recommendations = [];
  
  // Build optimization recommendations
  if (latest.build.production?.duration > 60000) { // > 1 minute
    recommendations.push({
      category: 'Build Performance',
      priority: 'high',
      issue: 'Slow production build',
      recommendation: 'Consider optimizing build configuration, enabling build caching, or splitting large bundles',
      impact: 'Reduce CI/CD time and improve developer productivity'
    });
  }
  
  if (latest.build.production?.bundleSize > 10 * 1024 * 1024) { // > 10MB
    recommendations.push({
      category: 'Bundle Size',
      priority: 'medium',
      issue: 'Large bundle size',
      recommendation: 'Analyze bundle composition, implement code splitting, and remove unused dependencies',
      impact: 'Improve application load time and user experience'
    });
  }
  
  // Test optimization recommendations
  if (latest.tests.unit?.duration > 30000) { // > 30 seconds
    recommendations.push({
      category: 'Test Performance',
      priority: 'medium',
      issue: 'Slow unit tests',
      recommendation: 'Optimize test setup, mock heavy dependencies, or parallelize test execution',
      impact: 'Faster feedback loop for developers'
    });
  }
  
  if (latest.tests.playwright?.duration > 300000) { // > 5 minutes
    recommendations.push({
      category: 'E2E Test Performance',
      priority: 'medium',
      issue: 'Slow E2E tests',
      recommendation: 'Optimize test scenarios, reduce wait times, or run tests in parallel',
      impact: 'Faster CI/CD pipeline execution'
    });
  }
  
  // Cache recommendations
  if (latest.cache.nodeModules?.size > 500 * 1024 * 1024) { // > 500MB
    recommendations.push({
      category: 'Dependencies',
      priority: 'low',
      issue: 'Large node_modules directory',
      recommendation: 'Review and remove unused dependencies, consider lighter alternatives',
      impact: 'Reduce disk usage and installation time'
    });
  }
  
  return recommendations;
}

/**
 * Main execution
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'benchmark':
      console.log('📊 Running performance benchmark...');
      const benchmark = runPerformanceBenchmark();
      const saved = savePerformanceBenchmark(benchmark);
      
      if (saved) {
        console.log('✅ Performance benchmark completed and saved');
        console.log(`⏱️ Total time: ${benchmark.totals.totalTime}ms`);
        console.log(`🔨 Build time: ${benchmark.totals.buildTime}ms`);
        console.log(`🧪 Test time: ${benchmark.totals.testTime}ms`);
      } else {
        console.error('❌ Failed to save benchmark results');
        process.exit(1);
      }
      break;
      
    case 'regressions':
      const history = loadPerformanceHistory();
      const regressions = detectPerformanceRegressions(history.benchmarks);
      
      ensurePerformanceDir();
      const regressionData = {
        timestamp: new Date().toISOString(),
        count: regressions.length,
        regressions
      };
      writeJsonFile(REGRESSIONS_FILE, regressionData);
      
      console.log(`🔍 Detected ${regressions.length} performance regressions`);
      regressions.forEach(reg => {
        console.log(`  ${reg.severity === 'high' ? '🚨' : '⚠️'} ${reg.metric}: +${reg.increase}%`);
      });
      
      if (regressions.some(r => r.severity === 'high')) {
        console.error('❌ High severity performance regressions detected');
        process.exit(1);
      }
      break;
      
    case 'report':
      const reportHistory = loadPerformanceHistory();
      const report = generatePerformanceReport(reportHistory.benchmarks);
      console.log(report);
      break;
      
    case 'recommendations':
      const recHistory = loadPerformanceHistory();
      const recommendations = generateOptimizationRecommendations(recHistory.benchmarks);
      
      console.log(`# 💡 Performance Optimization Recommendations\n`);
      if (recommendations.length === 0) {
        console.log('✅ No specific recommendations at this time. Performance looks good!');
      } else {
        recommendations.forEach((rec, index) => {
          const priorityEmoji = rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚡' : '💡';
          console.log(`## ${index + 1}. ${priorityEmoji} ${rec.category} (${rec.priority.toUpperCase()} priority)\n`);
          console.log(`**Issue**: ${rec.issue}\n`);
          console.log(`**Recommendation**: ${rec.recommendation}\n`);
          console.log(`**Expected Impact**: ${rec.impact}\n`);
        });
      }
      break;
      
    case 'history':
      const fullHistory = loadPerformanceHistory();
      console.log(JSON.stringify(fullHistory, null, 2));
      break;
      
    default:
      console.log('Usage: node performance-monitor.js [benchmark|regressions|report|recommendations|history]');
      console.log('  benchmark       - Run comprehensive performance benchmark');
      console.log('  regressions     - Detect performance regressions');
      console.log('  report          - Generate performance report');
      console.log('  recommendations - Generate optimization recommendations');
      console.log('  history         - Show full performance history');
      process.exit(1);
  }
}

main();