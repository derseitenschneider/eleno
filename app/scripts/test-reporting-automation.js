#!/usr/bin/env node

/**
 * Test Reporting Automation
 * 
 * Generates automated weekly and monthly test reports with trends analysis,
 * quality metrics, and performance insights for stakeholders
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const REPORTS_DIR = join(rootDir, '.test-metrics/reports');
const WEEKLY_DIR = join(REPORTS_DIR, 'weekly');
const MONTHLY_DIR = join(REPORTS_DIR, 'monthly');

/**
 * Ensure reports directories exist
 */
function ensureReportsDir() {
  [REPORTS_DIR, WEEKLY_DIR, MONTHLY_DIR].forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
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
 * Get date ranges for reporting periods
 */
function getDateRanges() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    week: {
      start: weekAgo.toISOString(),
      end: now.toISOString(),
      label: `${weekAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`
    },
    month: {
      start: monthAgo.toISOString(),
      end: now.toISOString(),
      label: `${monthAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`
    }
  };
}

/**
 * Load all metrics data
 */
function loadAllMetricsData() {
  const metricsPath = join(rootDir, '.test-metrics/metrics-history.json');
  const performancePath = join(rootDir, '.test-metrics/performance/performance-history.json');
  const alertsPath = join(rootDir, '.test-metrics/alerts.json');
  const regressionsPath = join(rootDir, '.test-metrics/performance/regressions.json');
  
  return {
    metrics: readJsonFile(metricsPath),
    performance: readJsonFile(performancePath),
    alerts: readJsonFile(alertsPath),
    regressions: readJsonFile(regressionsPath)
  };
}

/**
 * Filter data by date range
 */
function filterDataByDateRange(data, startDate, endDate) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  });
}

/**
 * Calculate coverage statistics
 */
function calculateCoverageStats(metrics) {
  if (!metrics || metrics.length === 0) return null;
  
  const coverageMetrics = metrics.filter(m => m.coverage);
  if (coverageMetrics.length === 0) return null;
  
  const stats = {
    count: coverageMetrics.length,
    statements: { values: [], avg: 0, min: 100, max: 0, trend: 'stable' },
    branches: { values: [], avg: 0, min: 100, max: 0, trend: 'stable' },
    functions: { values: [], avg: 0, min: 100, max: 0, trend: 'stable' },
    lines: { values: [], avg: 0, min: 100, max: 0, trend: 'stable' }
  };
  
  coverageMetrics.forEach(m => {
    ['statements', 'branches', 'functions', 'lines'].forEach(type => {
      const value = m.coverage[type].percentage;
      stats[type].values.push(value);
      stats[type].min = Math.min(stats[type].min, value);
      stats[type].max = Math.max(stats[type].max, value);
    });
  });
  
  // Calculate averages and trends
  Object.keys(stats).forEach(key => {
    if (key === 'count') return;
    
    const values = stats[key].values;
    stats[key].avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Calculate trend (comparing first half to second half)
    if (values.length >= 4) {
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      const diff = secondAvg - firstAvg;
      if (diff > 2) stats[key].trend = 'improving';
      else if (diff < -2) stats[key].trend = 'declining';
      else stats[key].trend = 'stable';
    }
  });
  
  return stats;
}

/**
 * Calculate test statistics
 */
function calculateTestStats(metrics) {
  if (!metrics || metrics.length === 0) return null;
  
  const testMetrics = metrics.filter(m => m.playwright);
  if (testMetrics.length === 0) return null;
  
  const stats = {
    count: testMetrics.length,
    totalTests: 0,
    totalPassed: 0,
    totalFailed: 0,
    totalFlaky: 0,
    avgPassRate: 0,
    passRatesTrend: 'stable',
    failuresByType: {},
    avgDuration: 0
  };
  
  let passRates = [];
  let durations = [];
  
  testMetrics.forEach(m => {
    stats.totalTests += m.playwright.total;
    stats.totalPassed += m.playwright.passed;
    stats.totalFailed += m.playwright.failed;
    stats.totalFlaky += m.playwright.flaky;
    passRates.push(m.playwright.passRate);
    
    if (m.playwright.duration) {
      durations.push(m.playwright.duration);
    }
  });
  
  stats.avgPassRate = passRates.reduce((a, b) => a + b, 0) / passRates.length;
  stats.avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
  
  // Calculate pass rate trend
  if (passRates.length >= 4) {
    const firstHalf = passRates.slice(0, Math.floor(passRates.length / 2));
    const secondHalf = passRates.slice(Math.floor(passRates.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    if (diff > 5) stats.passRatesTrend = 'improving';
    else if (diff < -5) stats.passRatesTrend = 'declining';
    else stats.passRatesTrend = 'stable';
  }
  
  return stats;
}

/**
 * Calculate performance statistics
 */
function calculatePerformanceStats(performance) {
  if (!performance || !performance.benchmarks || performance.benchmarks.length === 0) return null;
  
  const benchmarks = performance.benchmarks;
  const stats = {
    count: benchmarks.length,
    avgBuildTime: 0,
    avgTestTime: 0,
    avgTotalTime: 0,
    buildTimeTrend: 'stable',
    testTimeTrend: 'stable',
    avgBundleSize: 0,
    bundleSizeTrend: 'stable'
  };
  
  let buildTimes = [];
  let testTimes = [];
  let bundleSizes = [];
  
  benchmarks.forEach(b => {
    if (b.totals) {
      buildTimes.push(b.totals.buildTime);
      testTimes.push(b.totals.testTime);
    }
    
    if (b.build?.production?.bundleSize) {
      bundleSizes.push(b.build.production.bundleSize);
    }
  });
  
  if (buildTimes.length > 0) {
    stats.avgBuildTime = buildTimes.reduce((a, b) => a + b, 0) / buildTimes.length;
  }
  
  if (testTimes.length > 0) {
    stats.avgTestTime = testTimes.reduce((a, b) => a + b, 0) / testTimes.length;
  }
  
  stats.avgTotalTime = stats.avgBuildTime + stats.avgTestTime;
  
  if (bundleSizes.length > 0) {
    stats.avgBundleSize = bundleSizes.reduce((a, b) => a + b, 0) / bundleSizes.length;
  }
  
  // Calculate trends
  if (buildTimes.length >= 4) {
    const firstHalf = buildTimes.slice(0, Math.floor(buildTimes.length / 2));
    const secondHalf = buildTimes.slice(Math.floor(buildTimes.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const diff = ((secondAvg - firstAvg) / firstAvg) * 100;
    if (diff > 10) stats.buildTimeTrend = 'slower';
    else if (diff < -10) stats.buildTimeTrend = 'faster';
    else stats.buildTimeTrend = 'stable';
  }
  
  return stats;
}

/**
 * Generate quality score
 */
function calculateQualityScore(coverageStats, testStats, performanceStats, alerts) {
  let score = 100;
  const factors = [];
  
  // Coverage factor (40% of score)
  if (coverageStats) {
    const avgCoverage = (
      coverageStats.statements.avg +
      coverageStats.branches.avg +
      coverageStats.functions.avg +
      coverageStats.lines.avg
    ) / 4;
    
    if (avgCoverage < 70) score -= 20;
    else if (avgCoverage < 80) score -= 10;
    else if (avgCoverage < 90) score -= 5;
    
    factors.push(`Coverage: ${avgCoverage.toFixed(1)}%`);
  }
  
  // Test reliability factor (30% of score)
  if (testStats) {
    if (testStats.avgPassRate < 80) score -= 20;
    else if (testStats.avgPassRate < 95) score -= 10;
    else if (testStats.avgPassRate < 99) score -= 5;
    
    factors.push(`Pass Rate: ${testStats.avgPassRate.toFixed(1)}%`);
  }
  
  // Performance factor (20% of score)
  if (performanceStats) {
    if (performanceStats.buildTimeTrend === 'slower') score -= 10;
    if (performanceStats.bundleSizeTrend === 'larger') score -= 5;
    
    factors.push(`Performance: ${performanceStats.buildTimeTrend} build, ${performanceStats.bundleSizeTrend} bundle`);
  }
  
  // Alert penalty (10% of score)
  if (alerts && alerts.alerts) {
    const highAlerts = alerts.alerts.filter(a => a.severity === 'high').length;
    const mediumAlerts = alerts.alerts.filter(a => a.severity === 'medium').length;
    
    score -= highAlerts * 10 + mediumAlerts * 5;
    factors.push(`Alerts: ${highAlerts} high, ${mediumAlerts} medium`);
  }
  
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    factors
  };
}

/**
 * Generate report summary
 */
function generateReportSummary(period, data) {
  const { metrics, performance, alerts, regressions } = data;
  const dateRanges = getDateRanges();
  const range = dateRanges[period];
  
  // Filter data by period
  const periodMetrics = filterDataByDateRange(metrics?.metrics || [], range.start, range.end);
  const periodPerformance = {
    benchmarks: filterDataByDateRange(performance?.benchmarks || [], range.start, range.end)
  };
  
  // Calculate statistics
  const coverageStats = calculateCoverageStats(periodMetrics);
  const testStats = calculateTestStats(periodMetrics);
  const performanceStats = calculatePerformanceStats(periodPerformance);
  const qualityScore = calculateQualityScore(coverageStats, testStats, performanceStats, alerts);
  
  return {
    period,
    dateRange: range.label,
    generated: new Date().toISOString(),
    summary: {
      dataPoints: periodMetrics.length,
      qualityScore,
      coverage: coverageStats,
      tests: testStats,
      performance: performanceStats,
      alerts: alerts?.alerts?.length || 0,
      regressions: regressions?.count || 0
    }
  };
}

/**
 * Generate HTML report
 */
function generateHTMLReport(reportData) {
  const { period, dateRange, summary } = reportData;
  const title = `${period.charAt(0).toUpperCase() + period.slice(1)} Test Report`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Eleno</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 0;
            font-size: 1.2em;
            opacity: 0.9;
        }
        .quality-score {
            background: ${summary.qualityScore.score >= 90 ? '#10b981' : summary.qualityScore.score >= 70 ? '#f59e0b' : '#ef4444'};
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        .quality-score h2 {
            margin: 0 0 10px 0;
            font-size: 3em;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .card h3 {
            margin: 0 0 15px 0;
            color: #374151;
            font-size: 1.2em;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-label {
            color: #6b7280;
        }
        .metric-value {
            font-weight: 600;
            color: #111827;
        }
        .trend-improving { color: #10b981; }
        .trend-declining { color: #ef4444; }
        .trend-stable { color: #6b7280; }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 0.9em;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 ${title}</h1>
        <p>Period: ${dateRange}</p>
        <p>Generated: ${new Date(reportData.generated).toLocaleString()}</p>
    </div>
    
    <div class="quality-score">
        <h2>${summary.qualityScore.score}/100</h2>
        <p>Overall Quality Score</p>
        <small>${summary.qualityScore.factors.join(' • ')}</small>
    </div>
    
    <div class="grid">
        ${summary.coverage ? `
        <div class="card">
            <h3>📈 Code Coverage</h3>
            <div class="metric">
                <span class="metric-label">Average Statements</span>
                <span class="metric-value">${summary.coverage.statements.avg.toFixed(1)}%</span>
            </div>
            <div class="metric">
                <span class="metric-label">Average Branches</span>
                <span class="metric-value">${summary.coverage.branches.avg.toFixed(1)}%</span>
            </div>
            <div class="metric">
                <span class="metric-label">Average Functions</span>
                <span class="metric-value">${summary.coverage.functions.avg.toFixed(1)}%</span>
            </div>
            <div class="metric">
                <span class="metric-label">Average Lines</span>
                <span class="metric-value">${summary.coverage.lines.avg.toFixed(1)}%</span>
            </div>
            <div class="metric">
                <span class="metric-label">Trend</span>
                <span class="metric-value trend-${summary.coverage.statements.trend}">
                    ${summary.coverage.statements.trend.charAt(0).toUpperCase() + summary.coverage.statements.trend.slice(1)}
                </span>
            </div>
        </div>
        ` : ''}
        
        ${summary.tests ? `
        <div class="card">
            <h3>🎭 Test Results</h3>
            <div class="metric">
                <span class="metric-label">Total Tests</span>
                <span class="metric-value">${summary.tests.totalTests}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Passed</span>
                <span class="metric-value">${summary.tests.totalPassed}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Failed</span>
                <span class="metric-value">${summary.tests.totalFailed}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Average Pass Rate</span>
                <span class="metric-value">${summary.tests.avgPassRate.toFixed(1)}%</span>
            </div>
            <div class="metric">
                <span class="metric-label">Trend</span>
                <span class="metric-value trend-${summary.tests.passRatesTrend}">
                    ${summary.tests.passRatesTrend.charAt(0).toUpperCase() + summary.tests.passRatesTrend.slice(1)}
                </span>
            </div>
        </div>
        ` : ''}
        
        ${summary.performance ? `
        <div class="card">
            <h3>⚡ Performance</h3>
            <div class="metric">
                <span class="metric-label">Average Build Time</span>
                <span class="metric-value">${Math.round(summary.performance.avgBuildTime / 1000)}s</span>
            </div>
            <div class="metric">
                <span class="metric-label">Average Test Time</span>
                <span class="metric-value">${Math.round(summary.performance.avgTestTime / 1000)}s</span>
            </div>
            <div class="metric">
                <span class="metric-label">Average Total Time</span>
                <span class="metric-value">${Math.round(summary.performance.avgTotalTime / 1000)}s</span>
            </div>
            <div class="metric">
                <span class="metric-label">Build Trend</span>
                <span class="metric-value trend-${summary.performance.buildTimeTrend === 'slower' ? 'declining' : summary.performance.buildTimeTrend === 'faster' ? 'improving' : 'stable'}">
                    ${summary.performance.buildTimeTrend.charAt(0).toUpperCase() + summary.performance.buildTimeTrend.slice(1)}
                </span>
            </div>
        </div>
        ` : ''}
        
        <div class="card">
            <h3>🚨 Issues & Alerts</h3>
            <div class="metric">
                <span class="metric-label">Active Alerts</span>
                <span class="metric-value">${summary.alerts}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Performance Regressions</span>
                <span class="metric-value">${summary.regressions}</span>
            </div>
            <div class="metric">
                <span class="metric-label">Data Points</span>
                <span class="metric-value">${summary.dataPoints}</span>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>This report was automatically generated by the Eleno test monitoring system.</p>
        <p>For detailed metrics and interactive charts, view the full dashboard.</p>
    </div>
</body>
</html>`;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(reportData) {
  const { period, dateRange, summary } = reportData;
  const title = `${period.charAt(0).toUpperCase() + period.slice(1)} Test Report`;
  
  let report = `# 📊 ${title}\n\n`;
  report += `**Period**: ${dateRange}\n`;
  report += `**Generated**: ${new Date(reportData.generated).toLocaleString()}\n`;
  report += `**Data Points**: ${summary.dataPoints}\n\n`;
  
  // Quality Score
  const scoreEmoji = summary.qualityScore.score >= 90 ? '🟢' : summary.qualityScore.score >= 70 ? '🟡' : '🔴';
  report += `## ${scoreEmoji} Quality Score: ${summary.qualityScore.score}/100\n\n`;
  report += `${summary.qualityScore.factors.map(f => `- ${f}`).join('\n')}\n\n`;
  
  // Coverage
  if (summary.coverage) {
    report += `## 📈 Code Coverage\n\n`;
    report += `| Metric | Average | Range | Trend |\n`;
    report += `|--------|---------|--------|-------|\n`;
    report += `| Statements | ${summary.coverage.statements.avg.toFixed(1)}% | ${summary.coverage.statements.min.toFixed(1)}% - ${summary.coverage.statements.max.toFixed(1)}% | ${summary.coverage.statements.trend} |\n`;
    report += `| Branches | ${summary.coverage.branches.avg.toFixed(1)}% | ${summary.coverage.branches.min.toFixed(1)}% - ${summary.coverage.branches.max.toFixed(1)}% | ${summary.coverage.branches.trend} |\n`;
    report += `| Functions | ${summary.coverage.functions.avg.toFixed(1)}% | ${summary.coverage.functions.min.toFixed(1)}% - ${summary.coverage.functions.max.toFixed(1)}% | ${summary.coverage.functions.trend} |\n`;
    report += `| Lines | ${summary.coverage.lines.avg.toFixed(1)}% | ${summary.coverage.lines.min.toFixed(1)}% - ${summary.coverage.lines.max.toFixed(1)}% | ${summary.coverage.lines.trend} |\n\n`;
  }
  
  // Test Results
  if (summary.tests) {
    report += `## 🎭 Test Results\n\n`;
    report += `- **Total Tests**: ${summary.tests.totalTests}\n`;
    report += `- **Passed**: ${summary.tests.totalPassed}\n`;
    report += `- **Failed**: ${summary.tests.totalFailed}\n`;
    report += `- **Flaky**: ${summary.tests.totalFlaky}\n`;
    report += `- **Average Pass Rate**: ${summary.tests.avgPassRate.toFixed(1)}%\n`;
    report += `- **Pass Rate Trend**: ${summary.tests.passRatesTrend}\n`;
    if (summary.tests.avgDuration > 0) {
      report += `- **Average Duration**: ${Math.round(summary.tests.avgDuration / 1000)}s\n`;
    }
    report += '\n';
  }
  
  // Performance
  if (summary.performance) {
    report += `## ⚡ Performance Metrics\n\n`;
    report += `- **Average Build Time**: ${Math.round(summary.performance.avgBuildTime / 1000)}s\n`;
    report += `- **Average Test Time**: ${Math.round(summary.performance.avgTestTime / 1000)}s\n`;
    report += `- **Total Time**: ${Math.round(summary.performance.avgTotalTime / 1000)}s\n`;
    report += `- **Build Time Trend**: ${summary.performance.buildTimeTrend}\n`;
    if (summary.performance.avgBundleSize > 0) {
      report += `- **Average Bundle Size**: ${(summary.performance.avgBundleSize / (1024 * 1024)).toFixed(2)} MB\n`;
    }
    report += '\n';
  }
  
  // Issues & Alerts
  report += `## 🚨 Issues Summary\n\n`;
  report += `- **Active Alerts**: ${summary.alerts}\n`;
  report += `- **Performance Regressions**: ${summary.regressions}\n\n`;
  
  report += `---\n`;
  report += `*This report was automatically generated by the Eleno test monitoring system.*`;
  
  return report;
}

/**
 * Main execution
 */
function main() {
  const command = process.argv[2];
  const period = process.argv[3] || 'week';
  
  if (!['week', 'month'].includes(period)) {
    console.error('Period must be "week" or "month"');
    process.exit(1);
  }
  
  switch (command) {
    case 'generate':
      console.log(`📊 Generating ${period}ly test report...`);
      ensureReportsDir();
      
      const data = loadAllMetricsData();
      const reportData = generateReportSummary(period, data);
      
      // Generate both HTML and Markdown reports
      const htmlReport = generateHTMLReport(reportData);
      const markdownReport = generateMarkdownReport(reportData);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const htmlPath = join(period === 'week' ? WEEKLY_DIR : MONTHLY_DIR, `${timestamp}.html`);
      const mdPath = join(period === 'week' ? WEEKLY_DIR : MONTHLY_DIR, `${timestamp}.md`);
      const jsonPath = join(period === 'week' ? WEEKLY_DIR : MONTHLY_DIR, `${timestamp}.json`);
      
      writeFileSync(htmlPath, htmlReport);
      writeFileSync(mdPath, markdownReport);
      writeJsonFile(jsonPath, reportData);
      
      console.log(`✅ Reports generated:`);
      console.log(`   HTML: ${htmlPath}`);
      console.log(`   Markdown: ${mdPath}`);
      console.log(`   JSON: ${jsonPath}`);
      console.log(`📊 Quality Score: ${reportData.summary.qualityScore.score}/100`);
      break;
      
    case 'summary':
      const summaryData = loadAllMetricsData();
      const summary = generateReportSummary(period, summaryData);
      const summaryReport = generateMarkdownReport(summary);
      console.log(summaryReport);
      break;
      
    case 'quality':
      const qualityData = loadAllMetricsData();
      const qualitySummary = generateReportSummary(period, qualityData);
      console.log(`Quality Score: ${qualitySummary.summary.qualityScore.score}/100`);
      console.log('Factors:');
      qualitySummary.summary.qualityScore.factors.forEach(factor => {
        console.log(`  - ${factor}`);
      });
      break;
      
    default:
      console.log('Usage: node test-reporting-automation.js [generate|summary|quality] [week|month]');
      console.log('  generate - Generate comprehensive HTML and Markdown reports');
      console.log('  summary  - Generate text summary for CI/CD');
      console.log('  quality  - Show quality score and factors');
      console.log('');
      console.log('Period options: week (default), month');
      process.exit(1);
  }
}

main();