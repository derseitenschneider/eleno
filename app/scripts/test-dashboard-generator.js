#!/usr/bin/env node

/**
 * Test Dashboard Generator
 * 
 * Generates visual dashboards for test health metrics, trends, and analytics
 * Creates HTML dashboards with charts, graphs, and real-time status
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const DASHBOARD_DIR = join(rootDir, '.test-metrics/dashboard');
const DASHBOARD_HTML = join(DASHBOARD_DIR, 'index.html');

/**
 * Ensure dashboard directory exists
 */
function ensureDashboardDir() {
  if (!existsSync(DASHBOARD_DIR)) {
    mkdirSync(DASHBOARD_DIR, { recursive: true });
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
 * Load metrics data
 */
function loadMetricsData() {
  const metricsPath = join(rootDir, '.test-metrics/metrics-history.json');
  const trendsPath = join(rootDir, '.test-metrics/trends.json');
  const alertsPath = join(rootDir, '.test-metrics/alerts.json');
  
  return {
    metrics: readJsonFile(metricsPath),
    trends: readJsonFile(trendsPath),
    alerts: readJsonFile(alertsPath)
  };
}

/**
 * Generate coverage chart data
 */
function generateCoverageChartData(metrics) {
  if (!metrics || !metrics.metrics) return null;
  
  const data = metrics.metrics
    .filter(m => m.coverage)
    .slice(-30) // Last 30 data points
    .map(m => ({
      timestamp: new Date(m.timestamp).toISOString().split('T')[0],
      statements: m.coverage.statements.percentage,
      branches: m.coverage.branches.percentage,
      functions: m.coverage.functions.percentage,
      lines: m.coverage.lines.percentage
    }));
  
  return {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Statements',
        data: data.map(d => d.statements),
        borderColor: '#10B981',
        backgroundColor: '#10B98120',
        fill: false
      },
      {
        label: 'Branches',
        data: data.map(d => d.branches),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
        fill: false
      },
      {
        label: 'Functions',
        data: data.map(d => d.functions),
        borderColor: '#8B5CF6',
        backgroundColor: '#8B5CF620',
        fill: false
      },
      {
        label: 'Lines',
        data: data.map(d => d.lines),
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B20',
        fill: false
      }
    ]
  };
}

/**
 * Generate test results chart data
 */
function generateTestResultsChartData(metrics) {
  if (!metrics || !metrics.metrics) return null;
  
  // Combine unit test and E2E test data
  const data = metrics.metrics
    .filter(m => m.playwright || m.unitTests)
    .slice(-30)
    .map(m => {
      const unitTests = m.unitTests || { passed: 0, failed: 0, total: 0 };
      const e2eTests = m.playwright || { passed: 0, failed: 0, flaky: 0, total: 0, passRate: 100 };
      
      return {
        timestamp: new Date(m.timestamp).toISOString().split('T')[0],
        unitPassed: unitTests.passed,
        unitFailed: unitTests.failed,
        e2ePassed: e2eTests.passed,
        e2eFailed: e2eTests.failed,
        e2eFlaky: e2eTests.flaky || 0,
        e2ePassRate: e2eTests.passRate || 0,
        totalPassed: unitTests.passed + e2eTests.passed,
        totalFailed: unitTests.failed + e2eTests.failed,
        overallPassRate: unitTests.total + e2eTests.total > 0 ? 
          Math.round(((unitTests.passed + e2eTests.passed) / (unitTests.total + e2eTests.total)) * 100) : 100
      };
    });
  
  return {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Unit Tests (Passed)',
        data: data.map(d => d.unitPassed),
        backgroundColor: '#10B981',
        stack: 'unit'
      },
      {
        label: 'Unit Tests (Failed)',
        data: data.map(d => d.unitFailed),
        backgroundColor: '#EF4444',
        stack: 'unit'
      },
      {
        label: 'E2E Tests (Passed)',
        data: data.map(d => d.e2ePassed),
        backgroundColor: '#3B82F6',
        stack: 'e2e'
      },
      {
        label: 'E2E Tests (Failed)',
        data: data.map(d => d.e2eFailed),
        backgroundColor: '#DC2626',
        stack: 'e2e'
      },
      {
        label: 'E2E Tests (Flaky)',
        data: data.map(d => d.e2eFlaky),
        backgroundColor: '#F59E0B',
        stack: 'e2e'
      }
    ],
    passRateData: {
      labels: data.map(d => d.timestamp),
      data: data.map(d => d.overallPassRate),
      borderColor: '#6366F1',
      backgroundColor: '#6366F120',
      fill: true
    }
  };
}

/**
 * Generate performance chart data
 */
function generatePerformanceChartData(metrics) {
  if (!metrics || !metrics.metrics) return null;
  
  const data = metrics.metrics
    .filter(m => m.build && m.build.size)
    .slice(-30)
    .map(m => ({
      timestamp: new Date(m.timestamp).toISOString().split('T')[0],
      buildSize: m.build.size / (1024 * 1024), // Convert to MB
      duration: m.playwright?.duration ? m.playwright.duration / 1000 : null // Convert to seconds
    }));
  
  return {
    buildSize: {
      labels: data.map(d => d.timestamp),
      datasets: [{
        label: 'Build Size (MB)',
        data: data.map(d => d.buildSize),
        borderColor: '#EC4899',
        backgroundColor: '#EC489920',
        fill: true
      }]
    },
    duration: {
      labels: data.filter(d => d.duration !== null).map(d => d.timestamp),
      datasets: [{
        label: 'Test Duration (seconds)',
        data: data.filter(d => d.duration !== null).map(d => d.duration),
        borderColor: '#14B8A6',
        backgroundColor: '#14B8A620',
        fill: true
      }]
    }
  };
}

/**
 * Generate dashboard HTML
 */
function generateDashboardHTML(data) {
  const { metrics, trends, alerts } = data;
  const latestMetrics = metrics?.metrics?.[metrics.metrics.length - 1];
  const coverageData = generateCoverageChartData(metrics);
  const testResultsData = generateTestResultsChartData(metrics);
  const performanceData = generatePerformanceChartData(metrics);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eleno Test Metrics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }
        
        .card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1e293b;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .metric:last-child {
            border-bottom: none;
        }
        
        .metric-label {
            font-weight: 500;
            color: #64748b;
        }
        
        .metric-value {
            font-weight: 700;
            font-size: 1.1rem;
        }
        
        .status-good { color: #10b981; }
        .status-warning { color: #f59e0b; }
        .status-error { color: #ef4444; }
        
        .chart-container {
            position: relative;
            height: 300px;
            margin-top: 1rem;
        }
        
        .alert {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 4px solid;
        }
        
        .alert-high {
            background: #fef2f2;
            border-color: #ef4444;
            color: #991b1b;
        }
        
        .alert-medium {
            background: #fffbeb;
            border-color: #f59e0b;
            color: #92400e;
        }
        
        .alert-low {
            background: #f0f9ff;
            border-color: #3b82f6;
            color: #1e40af;
        }
        
        .timestamp {
            font-size: 0.875rem;
            color: #64748b;
            text-align: center;
            margin-top: 2rem;
        }
        
        .no-data {
            text-align: center;
            color: #64748b;
            font-style: italic;
            padding: 2rem;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header {
                padding: 1.5rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Test Metrics Dashboard</h1>
        <p>Real-time monitoring of test health, coverage, and performance</p>
    </div>
    
    <div class="container">
        ${alerts && alerts.alerts && alerts.alerts.length > 0 ? `
        <div class="card">
            <h3>🚨 Active Alerts (${alerts.alerts.length})</h3>
            ${alerts.alerts.map(alert => `
                <div class="alert alert-${alert.severity}">
                    <strong>${alert.type.toUpperCase()}:</strong> ${alert.message}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="grid">
            ${latestMetrics && latestMetrics.coverage ? `
            <div class="card">
                <h3>📈 Current Coverage</h3>
                <div class="metric">
                    <span class="metric-label">Statements</span>
                    <span class="metric-value ${latestMetrics.coverage.statements.percentage >= 80 ? 'status-good' : latestMetrics.coverage.statements.percentage >= 70 ? 'status-warning' : 'status-error'}">${latestMetrics.coverage.statements.percentage}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Branches</span>
                    <span class="metric-value ${latestMetrics.coverage.branches.percentage >= 75 ? 'status-good' : latestMetrics.coverage.branches.percentage >= 65 ? 'status-warning' : 'status-error'}">${latestMetrics.coverage.branches.percentage}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Functions</span>
                    <span class="metric-value ${latestMetrics.coverage.functions.percentage >= 85 ? 'status-good' : latestMetrics.coverage.functions.percentage >= 75 ? 'status-warning' : 'status-error'}">${latestMetrics.coverage.functions.percentage}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Lines</span>
                    <span class="metric-value ${latestMetrics.coverage.lines.percentage >= 85 ? 'status-good' : latestMetrics.coverage.lines.percentage >= 75 ? 'status-warning' : 'status-error'}">${latestMetrics.coverage.lines.percentage}%</span>
                </div>
            </div>
            ` : '<div class="card"><div class="no-data">Coverage data not available</div></div>'}
            
            ${latestMetrics && (latestMetrics.playwright || latestMetrics.unitTests) ? `
            <div class="card">
                <h3>🧪 Test Results</h3>
                ${latestMetrics.unitTests ? `
                <div class="metric">
                    <span class="metric-label">Unit Tests (Total)</span>
                    <span class="metric-value">${latestMetrics.unitTests.total}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Unit Tests (Passed)</span>
                    <span class="metric-value status-good">${latestMetrics.unitTests.passed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Unit Tests (Failed)</span>
                    <span class="metric-value ${latestMetrics.unitTests.failed === 0 ? 'status-good' : 'status-error'}">${latestMetrics.unitTests.failed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Unit Test Duration</span>
                    <span class="metric-value">${Math.round(latestMetrics.unitTests.duration / 1000)}s</span>
                </div>
                ` : ''}
                ${latestMetrics.playwright ? `
                <div class="metric">
                    <span class="metric-label">E2E Tests (Total)</span>
                    <span class="metric-value">${latestMetrics.playwright.total}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">E2E Tests (Passed)</span>
                    <span class="metric-value status-good">${latestMetrics.playwright.passed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">E2E Tests (Failed)</span>
                    <span class="metric-value ${latestMetrics.playwright.failed === 0 ? 'status-good' : 'status-error'}">${latestMetrics.playwright.failed}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">E2E Pass Rate</span>
                    <span class="metric-value ${latestMetrics.playwright.passRate >= 95 ? 'status-good' : latestMetrics.playwright.passRate >= 80 ? 'status-warning' : 'status-error'}">${latestMetrics.playwright.passRate}%</span>
                </div>
                ` : ''}
            </div>
            ` : '<div class="card"><div class="no-data">Test results not available</div></div>'}
            
            ${latestMetrics && latestMetrics.build ? `
            <div class="card">
                <h3>🔨 Build Metrics</h3>
                <div class="metric">
                    <span class="metric-label">Bundle Size</span>
                    <span class="metric-value">${latestMetrics.build.sizeFormatted}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Last Build</span>
                    <span class="metric-value">${new Date(latestMetrics.build.timestamp).toLocaleString()}</span>
                </div>
                ${latestMetrics.playwright && latestMetrics.playwright.duration ? `
                <div class="metric">
                    <span class="metric-label">Test Duration</span>
                    <span class="metric-value">${Math.round(latestMetrics.playwright.duration / 1000)}s</span>
                </div>
                ` : ''}
            </div>
            ` : '<div class="card"><div class="no-data">Build metrics not available</div></div>'}
            
            ${latestMetrics ? `
            <div class="card">
                <h3>📋 Environment Info</h3>
                <div class="metric">
                    <span class="metric-label">Branch</span>
                    <span class="metric-value">${latestMetrics.git.branch}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Commit</span>
                    <span class="metric-value">${latestMetrics.git.commit.substring(0, 8)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Author</span>
                    <span class="metric-value">${latestMetrics.git.author}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Node Version</span>
                    <span class="metric-value">${latestMetrics.environment.nodeVersion}</span>
                </div>
            </div>
            ` : ''}
        </div>
        
        ${coverageData ? `
        <div class="card">
            <h3>📈 Coverage Trends (Last 30 Runs)</h3>
            <div class="chart-container">
                <canvas id="coverageChart"></canvas>
            </div>
        </div>
        ` : ''}
        
        ${testResultsData ? `
        <div class="grid">
            <div class="card">
                <h3>🎭 Test Results Trends</h3>
                <div class="chart-container">
                    <canvas id="testResultsChart"></canvas>
                </div>
            </div>
            <div class="card">
                <h3>📊 Pass Rate Trends</h3>
                <div class="chart-container">
                    <canvas id="passRateChart"></canvas>
                </div>
            </div>
        </div>
        ` : ''}
        
        ${performanceData ? `
        <div class="grid">
            <div class="card">
                <h3>📦 Bundle Size Trends</h3>
                <div class="chart-container">
                    <canvas id="bundleSizeChart"></canvas>
                </div>
            </div>
            <div class="card">
                <h3>⏱️ Test Duration Trends</h3>
                <div class="chart-container">
                    <canvas id="durationChart"></canvas>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="timestamp">
            Last updated: ${new Date().toLocaleString()}
            ${latestMetrics ? ` • Data from: ${new Date(latestMetrics.timestamp).toLocaleString()}` : ''}
        </div>
    </div>
    
    <script>
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        Chart.defaults.color = '#64748b';
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9'
                    }
                },
                x: {
                    grid: {
                        color: '#f1f5f9'
                    }
                }
            }
        };
        
        ${coverageData ? `
        new Chart(document.getElementById('coverageChart'), {
            type: 'line',
            data: ${JSON.stringify(coverageData)},
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        ...chartOptions.scales.y,
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
        ` : ''}
        
        ${testResultsData ? `
        new Chart(document.getElementById('testResultsChart'), {
            type: 'bar',
            data: ${JSON.stringify(testResultsData)},
            options: chartOptions
        });
        
        new Chart(document.getElementById('passRateChart'), {
            type: 'line',
            data: {
                labels: ${JSON.stringify(testResultsData.passRateData.labels)},
                datasets: [{
                    label: 'Pass Rate (%)',
                    data: ${JSON.stringify(testResultsData.passRateData.data)},
                    borderColor: '${testResultsData.passRateData.borderColor}',
                    backgroundColor: '${testResultsData.passRateData.backgroundColor}',
                    fill: ${testResultsData.passRateData.fill}
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        ...chartOptions.scales.y,
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
        ` : ''}
        
        ${performanceData && performanceData.buildSize ? `
        new Chart(document.getElementById('bundleSizeChart'), {
            type: 'line',
            data: ${JSON.stringify(performanceData.buildSize)},
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        ...chartOptions.scales.y,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(2) + ' MB';
                            }
                        }
                    }
                }
            }
        });
        ` : ''}
        
        ${performanceData && performanceData.duration ? `
        new Chart(document.getElementById('durationChart'), {
            type: 'line',
            data: ${JSON.stringify(performanceData.duration)},
            options: {
                ...chartOptions,
                scales: {
                    ...chartOptions.scales,
                    y: {
                        ...chartOptions.scales.y,
                        ticks: {
                            callback: function(value) {
                                return value + 's';
                            }
                        }
                    }
                }
            }
        });
        ` : ''}
    </script>
</body>
</html>`;
}

/**
 * Generate simple text dashboard for CI
 */
function generateTextDashboard(data) {
  const { metrics, trends, alerts } = data;
  const latestMetrics = metrics?.metrics?.[metrics.metrics.length - 1];
  
  let dashboard = `# 📊 Test Metrics Dashboard\n\n`;
  dashboard += `**Generated**: ${new Date().toISOString()}\n\n`;
  
  if (alerts && alerts.alerts && alerts.alerts.length > 0) {
    dashboard += `## 🚨 Active Alerts (${alerts.alerts.length})\n\n`;
    alerts.alerts.forEach(alert => {
      const emoji = alert.severity === 'high' ? '🚨' : alert.severity === 'medium' ? '⚠️' : 'ℹ️';
      dashboard += `- ${emoji} **${alert.type.toUpperCase()}**: ${alert.message}\n`;
    });
    dashboard += '\n';
  }
  
  if (latestMetrics) {
    dashboard += `## 📈 Current Metrics\n\n`;
    dashboard += `**Branch**: ${latestMetrics.git.branch} | **Commit**: ${latestMetrics.git.commit.substring(0, 8)}\n\n`;
    
    if (latestMetrics.coverage) {
      dashboard += `### Coverage\n`;
      dashboard += `- Statements: ${latestMetrics.coverage.statements.percentage}%\n`;
      dashboard += `- Branches: ${latestMetrics.coverage.branches.percentage}%\n`;
      dashboard += `- Functions: ${latestMetrics.coverage.functions.percentage}%\n`;
      dashboard += `- Lines: ${latestMetrics.coverage.lines.percentage}%\n\n`;
    }
    
    if (latestMetrics.playwright) {
      dashboard += `### Test Results\n`;
      dashboard += `- Total: ${latestMetrics.playwright.total}\n`;
      dashboard += `- Passed: ${latestMetrics.playwright.passed}\n`;
      dashboard += `- Failed: ${latestMetrics.playwright.failed}\n`;
      dashboard += `- Pass Rate: ${latestMetrics.playwright.passRate}%\n\n`;
    }
    
    if (latestMetrics.build) {
      dashboard += `### Build Metrics\n`;
      dashboard += `- Bundle Size: ${latestMetrics.build.sizeFormatted}\n\n`;
    }
  }
  
  if (trends) {
    dashboard += `## 📊 Trends\n\n`;
    if (trends.coverage) {
      dashboard += `### Coverage Changes\n`;
      Object.entries(trends.coverage).forEach(([key, value]) => {
        const arrow = value > 0 ? '📈' : value < 0 ? '📉' : '➡️';
        dashboard += `- ${key}: ${arrow} ${value > 0 ? '+' : ''}${value.toFixed(2)}%\n`;
      });
      dashboard += '\n';
    }
  }
  
  return dashboard;
}

/**
 * Main execution
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'generate':
      console.log('🎨 Generating test dashboard...');
      ensureDashboardDir();
      
      const data = loadMetricsData();
      const htmlDashboard = generateDashboardHTML(data);
      
      writeFileSync(DASHBOARD_HTML, htmlDashboard);
      console.log(`✅ Dashboard generated: ${DASHBOARD_HTML}`);
      break;
      
    case 'text':
      const textData = loadMetricsData();
      const textDashboard = generateTextDashboard(textData);
      console.log(textDashboard);
      break;
      
    case 'url':
      if (existsSync(DASHBOARD_HTML)) {
        console.log(`file://${DASHBOARD_HTML}`);
      } else {
        console.log('Dashboard not found. Run with "generate" first.');
        process.exit(1);
      }
      break;
      
    default:
      console.log('Usage: node test-dashboard-generator.js [generate|text|url]');
      console.log('  generate - Generate HTML dashboard');
      console.log('  text     - Generate text dashboard for CI');
      console.log('  url      - Get dashboard URL');
      process.exit(1);
  }
}

main();