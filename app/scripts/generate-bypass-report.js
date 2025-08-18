#!/usr/bin/env node

/**
 * Coverage Bypass Report Generator
 * Analyzes coverage bypass usage and generates reports for tracking and accountability
 */

const fs = require('fs');
const path = require('path');

// Command line argument parsing
const args = process.argv.slice(2);
const month = args.find(arg => arg.startsWith('--month='))?.split('=')[1];
const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'console';
const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1];

/**
 * Load bypass log data
 */
function loadBypassLog() {
  const logPath = path.join(process.cwd(), 'coverage-bypass.log');
  
  if (!fs.existsSync(logPath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(logPath, 'utf8');
    return content
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  } catch (error) {
    console.error('Failed to parse bypass log:', error.message);
    return [];
  }
}

/**
 * Filter bypasses by month
 */
function filterByMonth(bypasses, targetMonth) {
  if (!targetMonth) return bypasses;
  
  return bypasses.filter(bypass => {
    const bypassDate = new Date(bypass.timestamp);
    const monthString = `${bypassDate.getFullYear()}-${String(bypassDate.getMonth() + 1).padStart(2, '0')}`;
    return monthString === targetMonth;
  });
}

/**
 * Generate bypass statistics
 */
function generateStatistics(bypasses) {
  const stats = {
    total: bypasses.length,
    byMonth: {},
    byApprover: {},
    byReason: {},
    byBranch: {},
    trends: {
      frequency: 0,
      averagePerMonth: 0,
      monthlyBreakdown: {}
    }
  };
  
  bypasses.forEach(bypass => {
    const date = new Date(bypass.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const dayKey = `${monthKey}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Monthly breakdown
    stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;
    stats.trends.monthlyBreakdown[monthKey] = (stats.trends.monthlyBreakdown[monthKey] || 0) + 1;
    
    // Approver breakdown
    const approvers = bypass.approver.split(',').map(a => a.trim());
    approvers.forEach(approver => {
      stats.byApprover[approver] = (stats.byApprover[approver] || 0) + 1;
    });
    
    // Reason categorization
    const reason = bypass.reason.toLowerCase();
    let category = 'other';
    if (reason.includes('security') || reason.includes('cve')) category = 'security';
    else if (reason.includes('outage') || reason.includes('down') || reason.includes('critical')) category = 'outage';
    else if (reason.includes('hotfix')) category = 'hotfix';
    else if (reason.includes('data') || reason.includes('corruption')) category = 'data';
    
    stats.byReason[category] = (stats.byReason[category] || 0) + 1;
    
    // Branch analysis
    const branch = bypass.branch || 'unknown';
    stats.byBranch[branch] = (stats.byBranch[branch] || 0) + 1;
  });
  
  // Calculate trends
  const months = Object.keys(stats.byMonth);
  stats.trends.averagePerMonth = months.length > 0 ? stats.total / months.length : 0;
  
  return stats;
}

/**
 * Generate recommendations based on statistics
 */
function generateRecommendations(stats) {
  const recommendations = [];
  
  // Frequency analysis
  if (stats.trends.averagePerMonth > 2) {
    recommendations.push({
      type: 'warning',
      message: `High bypass frequency: ${stats.trends.averagePerMonth.toFixed(1)} per month. Consider improving testing practices.`
    });
  }
  
  // Approver analysis
  const approverCounts = Object.values(stats.byApprover);
  const maxApprovals = Math.max(...approverCounts);
  if (maxApprovals > stats.total * 0.5) {
    recommendations.push({
      type: 'info',
      message: 'Single approver handling majority of bypasses. Consider distributing approval responsibility.'
    });
  }
  
  // Reason analysis
  if (stats.byReason.security > stats.total * 0.3) {
    recommendations.push({
      type: 'action',
      message: 'High number of security-related bypasses. Review security testing practices.'
    });
  }
  
  if (stats.byReason.other > stats.total * 0.2) {
    recommendations.push({
      type: 'action',
      message: 'Many bypasses with unclear reasons. Improve bypass reason documentation.'
    });
  }
  
  // Trend analysis
  const recentMonths = Object.keys(stats.trends.monthlyBreakdown).slice(-3);
  const recentTotal = recentMonths.reduce((sum, month) => sum + (stats.trends.monthlyBreakdown[month] || 0), 0);
  const recentAverage = recentTotal / Math.max(recentMonths.length, 1);
  
  if (recentAverage > stats.trends.averagePerMonth * 1.5) {
    recommendations.push({
      type: 'warning',
      message: 'Bypass frequency increasing in recent months. Investigate root causes.'
    });
  }
  
  return recommendations;
}

/**
 * Format console output
 */
function formatConsoleOutput(stats, recommendations, bypasses) {
  const output = [];
  
  output.push('🚨 Coverage Bypass Report');
  output.push(''.padEnd(50, '='));
  output.push('');
  
  // Summary
  output.push('📊 Summary');
  output.push(`Total Bypasses: ${stats.total}`);
  output.push(`Average per Month: ${stats.trends.averagePerMonth.toFixed(1)}`);
  output.push(`Reporting Period: ${Object.keys(stats.byMonth).sort().join(', ')}`);
  output.push('');
  
  // Monthly breakdown
  if (Object.keys(stats.byMonth).length > 0) {
    output.push('📅 Monthly Breakdown');
    Object.entries(stats.byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, count]) => {
        output.push(`  ${month}: ${count} bypasses`);
      });
    output.push('');
  }
  
  // Reason breakdown
  output.push('🎯 Bypass Reasons');
  Object.entries(stats.byReason)
    .sort(([, a], [, b]) => b - a)
    .forEach(([reason, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      output.push(`  ${reason}: ${count} (${percentage}%)`);
    });
  output.push('');
  
  // Approvers
  output.push('👥 Approvers');
  Object.entries(stats.byApprover)
    .sort(([, a], [, b]) => b - a)
    .forEach(([approver, count]) => {
      output.push(`  ${approver}: ${count} approvals`);
    });
  output.push('');
  
  // Recommendations
  if (recommendations.length > 0) {
    output.push('💡 Recommendations');
    recommendations.forEach(rec => {
      const icon = rec.type === 'warning' ? '⚠️' : rec.type === 'action' ? '🎯' : 'ℹ️';
      output.push(`  ${icon} ${rec.message}`);
    });
    output.push('');
  }
  
  // Recent bypasses
  if (bypasses.length > 0) {
    output.push('📝 Recent Bypasses (Last 5)');
    bypasses
      .slice(-5)
      .reverse()
      .forEach(bypass => {
        const date = new Date(bypass.timestamp).toLocaleString();
        output.push(`  ${date}: ${bypass.reason} (${bypass.approver})`);
      });
  }
  
  return output.join('\n');
}

/**
 * Format JSON output
 */
function formatJsonOutput(stats, recommendations, bypasses, targetMonth) {
  return JSON.stringify({
    reportGenerated: new Date().toISOString(),
    targetMonth: targetMonth || 'all',
    statistics: stats,
    recommendations: recommendations,
    recentBypasses: bypasses.slice(-10).map(bypass => ({
      ...bypass,
      relativeTime: `${Math.floor((Date.now() - new Date(bypass.timestamp)) / (1000 * 60 * 60 * 24))} days ago`
    }))
  }, null, 2);
}

/**
 * Format Markdown output
 */
function formatMarkdownOutput(stats, recommendations, bypasses, targetMonth) {
  const md = [];
  
  md.push('# 🚨 Coverage Bypass Report');
  md.push('');
  md.push(`**Generated**: ${new Date().toLocaleString()}`);
  md.push(`**Period**: ${targetMonth || 'All time'}`);
  md.push('');
  
  // Summary
  md.push('## 📊 Summary');
  md.push('');
  md.push(`- **Total Bypasses**: ${stats.total}`);
  md.push(`- **Average per Month**: ${stats.trends.averagePerMonth.toFixed(1)}`);
  md.push(`- **Months Covered**: ${Object.keys(stats.byMonth).length}`);
  md.push('');
  
  // Monthly breakdown
  if (Object.keys(stats.byMonth).length > 0) {
    md.push('## 📅 Monthly Breakdown');
    md.push('');
    md.push('| Month | Bypasses |');
    md.push('|-------|----------|');
    Object.entries(stats.byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([month, count]) => {
        md.push(`| ${month} | ${count} |`);
      });
    md.push('');
  }
  
  // Reason breakdown
  md.push('## 🎯 Bypass Reasons');
  md.push('');
  md.push('| Reason | Count | Percentage |');
  md.push('|--------|-------|------------|');
  Object.entries(stats.byReason)
    .sort(([, a], [, b]) => b - a)
    .forEach(([reason, count]) => {
      const percentage = ((count / stats.total) * 100).toFixed(1);
      md.push(`| ${reason} | ${count} | ${percentage}% |`);
    });
  md.push('');
  
  // Recommendations
  if (recommendations.length > 0) {
    md.push('## 💡 Recommendations');
    md.push('');
    recommendations.forEach(rec => {
      const icon = rec.type === 'warning' ? '⚠️' : rec.type === 'action' ? '🎯' : 'ℹ️';
      md.push(`${icon} ${rec.message}`);
      md.push('');
    });
  }
  
  return md.join('\n');
}

/**
 * Main execution
 */
function main() {
  const bypasses = loadBypassLog();
  
  if (bypasses.length === 0) {
    console.log('✅ No coverage bypasses found. Great job maintaining test coverage!');
    return;
  }
  
  const filteredBypasses = filterByMonth(bypasses, month);
  
  if (month && filteredBypasses.length === 0) {
    console.log(`ℹ️ No coverage bypasses found for ${month}`);
    return;
  }
  
  const stats = generateStatistics(filteredBypasses);
  const recommendations = generateRecommendations(stats);
  
  let reportContent;
  
  switch (format) {
    case 'json':
      reportContent = formatJsonOutput(stats, recommendations, filteredBypasses, month);
      break;
    case 'markdown':
      reportContent = formatMarkdownOutput(stats, recommendations, filteredBypasses, month);
      break;
    default:
      reportContent = formatConsoleOutput(stats, recommendations, filteredBypasses);
  }
  
  if (output) {
    fs.writeFileSync(output, reportContent);
    console.log(`Report written to: ${output}`);
  } else {
    console.log(reportContent);
  }
}

/**
 * Help text
 */
function showHelp() {
  console.log(`
Coverage Bypass Report Generator

Usage: node generate-bypass-report.js [options]

Options:
  --month=YYYY-MM     Filter by specific month (e.g., --month=2024-01)
  --format=FORMAT     Output format: console, json, markdown (default: console)
  --output=FILE       Write to file instead of stdout
  --help              Show this help message

Examples:
  node generate-bypass-report.js
  node generate-bypass-report.js --month=2024-01
  node generate-bypass-report.js --format=json --output=bypass-report.json
  node generate-bypass-report.js --format=markdown --output=bypass-report.md
`);
}

// Execute
if (args.includes('--help')) {
  showHelp();
} else {
  main();
}

module.exports = {
  loadBypassLog,
  filterByMonth,
  generateStatistics,
  generateRecommendations,
  formatConsoleOutput,
  formatJsonOutput,
  formatMarkdownOutput
};