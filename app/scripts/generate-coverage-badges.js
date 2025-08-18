#!/usr/bin/env node

/**
 * Coverage Badge Generator
 * Generates coverage badges with threshold indicators and status colors
 */

const fs = require('fs');
const path = require('path');

// Badge color scheme based on coverage levels
const getBadgeColor = (percentage) => {
  if (percentage >= 95) return 'brightgreen';
  if (percentage >= 90) return 'green';
  if (percentage >= 80) return 'yellowgreen';
  if (percentage >= 70) return 'yellow';
  if (percentage >= 60) return 'orange';
  return 'red';
};

// Get threshold status emoji
const getThresholdStatus = (percentage, threshold) => {
  if (percentage >= threshold) return '✅';
  if (percentage >= threshold - 5) return '⚠️';
  return '❌';
};

/**
 * Generate shields.io badge URL
 */
function generateBadgeUrl(label, message, color, style = 'flat-square') {
  const encodedLabel = encodeURIComponent(label);
  const encodedMessage = encodeURIComponent(message);
  return `https://img.shields.io/badge/${encodedLabel}-${encodedMessage}-${color}?style=${style}`;
}

/**
 * Generate coverage badges
 */
function generateCoverageBadges(coverageData) {
  const badges = {};
  const total = coverageData.total;
  
  // Individual metric badges
  const metrics = {
    statements: { label: 'Statements', threshold: 80 },
    branches: { label: 'Branches', threshold: 80 },
    functions: { label: 'Functions', threshold: 80 },
    lines: { label: 'Lines', threshold: 80 }
  };
  
  Object.entries(metrics).forEach(([key, config]) => {
    const percentage = total[key].pct;
    const color = getBadgeColor(percentage);
    const status = getThresholdStatus(percentage, config.threshold);
    
    badges[key] = {
      url: generateBadgeUrl(config.label, `${percentage.toFixed(1)}%`, color),
      markdown: `![${config.label} Coverage](${generateBadgeUrl(config.label, `${percentage.toFixed(1)}%`, color)})`,
      html: `<img src="${generateBadgeUrl(config.label, `${percentage.toFixed(1)}%`, color)}" alt="${config.label} Coverage" />`,
      percentage: percentage,
      threshold: config.threshold,
      status: status,
      passing: percentage >= config.threshold
    };
  });
  
  // Overall coverage badge
  const overallPercentage = total.lines.pct; // Use lines as overall metric
  const overallColor = getBadgeColor(overallPercentage);
  const overallStatus = getThresholdStatus(overallPercentage, 80);
  
  badges.overall = {
    url: generateBadgeUrl('Coverage', `${overallPercentage.toFixed(1)}%`, overallColor),
    markdown: `![Coverage](${generateBadgeUrl('Coverage', `${overallPercentage.toFixed(1)}%`, overallColor)})`,
    html: `<img src="${generateBadgeUrl('Coverage', `${overallPercentage.toFixed(1)}%`, overallColor)}" alt="Coverage" />`,
    percentage: overallPercentage,
    threshold: 80,
    status: overallStatus,
    passing: overallPercentage >= 80
  };
  
  // Threshold compliance badge
  const passingMetrics = Object.values(badges).filter(badge => badge.passing && badge.threshold).length;
  const totalMetrics = Object.keys(metrics).length;
  const compliancePercentage = (passingMetrics / totalMetrics) * 100;
  const complianceColor = compliancePercentage === 100 ? 'brightgreen' : 
                         compliancePercentage >= 75 ? 'yellow' : 'red';
  
  badges.compliance = {
    url: generateBadgeUrl('Threshold Compliance', `${passingMetrics}/${totalMetrics}`, complianceColor),
    markdown: `![Threshold Compliance](${generateBadgeUrl('Threshold Compliance', `${passingMetrics}/${totalMetrics}`, complianceColor)})`,
    html: `<img src="${generateBadgeUrl('Threshold Compliance', `${passingMetrics}/${totalMetrics}`, complianceColor)}" alt="Threshold Compliance" />`,
    percentage: compliancePercentage,
    passing: compliancePercentage === 100,
    passingMetrics: passingMetrics,
    totalMetrics: totalMetrics
  };
  
  return badges;
}

/**
 * Generate quality gate badge
 */
function generateQualityGateBadge(badges) {
  const allPassing = Object.values(badges).every(badge => 
    badge.threshold ? badge.passing : true
  );
  
  const status = allPassing ? 'PASSED' : 'FAILED';
  const color = allPassing ? 'brightgreen' : 'red';
  
  return {
    url: generateBadgeUrl('Quality Gate', status, color),
    markdown: `![Quality Gate](${generateBadgeUrl('Quality Gate', status, color)})`,
    html: `<img src="${generateBadgeUrl('Quality Gate', status, color)}" alt="Quality Gate" />`,
    passing: allPassing,
    status: status
  };
}

/**
 * Generate badge README section
 */
function generateBadgeMarkdown(badges, qualityGate) {
  const md = [];
  
  md.push('## 📊 Code Coverage & Quality');
  md.push('');
  md.push('<!-- Coverage badges start -->');
  md.push(`${qualityGate.markdown} ${badges.overall.markdown} ${badges.compliance.markdown}`);
  md.push('');
  md.push('| Metric | Coverage | Status | Threshold |');
  md.push('|--------|----------|---------|-----------|');
  
  const metrics = ['statements', 'branches', 'functions', 'lines'];
  metrics.forEach(metric => {
    const badge = badges[metric];
    md.push(`| ${badge.markdown.match(/alt="([^"]*)/)[1]} | ${badge.percentage.toFixed(1)}% | ${badge.status} | ${badge.threshold}% |`);
  });
  
  md.push('');
  md.push('<!-- Coverage badges end -->');
  md.push('');
  
  if (!qualityGate.passing) {
    md.push('⚠️ **Quality Gate Failed**: Some coverage thresholds are not met. Please add tests to improve coverage.');
    md.push('');
  }
  
  md.push('### 🎯 Coverage Targets');
  md.push('');
  md.push('- **Global Minimum**: 80% for all metrics');
  md.push('- **Critical Paths**: 90% (API services, utilities)');
  md.push('- **Business Logic**: 85% (hooks, context providers)');
  md.push('- **UI Components**: 60% (presentational components)');
  md.push('');
  
  return md.join('\n');
}

/**
 * Generate JSON badge data for GitHub Actions
 */
function generateBadgeData(badges, qualityGate) {
  return {
    qualityGate: qualityGate,
    coverage: badges,
    summary: {
      overall: badges.overall.percentage,
      compliance: badges.compliance.percentage,
      passing: qualityGate.passing,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Main function
 */
function main() {
  const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  
  if (!fs.existsSync(coveragePath)) {
    console.error('❌ Coverage file not found. Run tests with coverage first: npm run test:cov');
    process.exit(1);
  }
  
  const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  
  console.log('🎨 Generating coverage badges...');
  
  const badges = generateCoverageBadges(coverageData);
  const qualityGate = generateQualityGateBadge(badges);
  const badgeMarkdown = generateBadgeMarkdown(badges, qualityGate);
  const badgeData = generateBadgeData(badges, qualityGate);
  
  // Write badge data
  const outputDir = path.join(process.cwd(), 'coverage');
  fs.writeFileSync(path.join(outputDir, 'badges.json'), JSON.stringify(badgeData, null, 2));
  fs.writeFileSync(path.join(outputDir, 'badges.md'), badgeMarkdown);
  
  // Console output
  console.log('✅ Coverage badges generated successfully!');
  console.log('');
  console.log('📋 Badge URLs:');
  console.log(`   Quality Gate: ${qualityGate.url}`);
  console.log(`   Overall: ${badges.overall.url}`);
  console.log(`   Compliance: ${badges.compliance.url}`);
  console.log('');
  
  if (qualityGate.passing) {
    console.log('🎉 Quality Gate: PASSED');
  } else {
    console.log('⚠️ Quality Gate: FAILED');
    console.log('   Some coverage thresholds are not met.');
  }
  
  // GitHub Actions output
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::set-output name=quality-gate::${qualityGate.passing ? 'passed' : 'failed'}`);
    console.log(`::set-output name=overall-coverage::${badges.overall.percentage}`);
    console.log(`::set-output name=badge-data::${JSON.stringify(badgeData)}`);
  }
  
  return badgeData;
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateCoverageBadges,
  generateQualityGateBadge,
  generateBadgeMarkdown,
  getBadgeColor,
  getThresholdStatus
};