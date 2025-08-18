#!/usr/bin/env node

/**
 * Coverage Threshold Checker
 * Validates coverage against configured thresholds and provides detailed reporting
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

// Threshold configurations from vitest.config.ts
const thresholds = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  paths: {
    '**/services/api/**': { branches: 90, functions: 90, lines: 90, statements: 90 },
    '**/services/context/**': { branches: 85, functions: 85, lines: 85, statements: 85 },
    '**/hooks/**': { branches: 85, functions: 85, lines: 85, statements: 85 },
    '**/utils/**': { branches: 90, functions: 90, lines: 90, statements: 90 },
    '**/components/features/**': { branches: 75, functions: 75, lines: 75, statements: 75 },
    '**/router/**': { branches: 85, functions: 85, lines: 85, statements: 85 },
    '**/components/ui/**': { branches: 60, functions: 60, lines: 60, statements: 60 },
  }
};

// Emergency bypass configuration
const emergencyBypass = {
  enabled: process.env.COVERAGE_EMERGENCY_BYPASS === 'true',
  approver: process.env.COVERAGE_BYPASS_APPROVER || null,
  reason: process.env.COVERAGE_BYPASS_REASON || null,
  ticket: process.env.COVERAGE_BYPASS_TICKET || null
};

/**
 * Load coverage data from file
 */
function loadCoverageData() {
  const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  
  if (!fs.existsSync(coveragePath)) {
    console.error(`${colors.red}${colors.bold}❌ Coverage file not found: ${coveragePath}${colors.reset}`);
    process.exit(1);
  }

  try {
    return JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  } catch (error) {
    console.error(`${colors.red}${colors.bold}❌ Failed to parse coverage data: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Check if a file path matches a pattern
 */
function pathMatches(filePath, pattern) {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]');
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
}

/**
 * Get applicable thresholds for a file path
 */
function getFileThresholds(filePath) {
  for (const [pattern, threshold] of Object.entries(thresholds.paths)) {
    if (pathMatches(filePath, pattern)) {
      return threshold;
    }
  }
  return thresholds.global; // Default to global thresholds
}

/**
 * Format percentage with color coding
 */
function formatPercentage(value, threshold) {
  const pct = `${value.toFixed(2)}%`;
  if (value >= threshold) {
    return `${colors.green}${pct}${colors.reset}`;
  } else if (value >= threshold - 5) {
    return `${colors.yellow}${pct}${colors.reset}`;
  } else {
    return `${colors.red}${pct}${colors.reset}`;
  }
}

/**
 * Get status emoji based on coverage vs threshold
 */
function getStatusEmoji(value, threshold) {
  if (value >= threshold + 10) return '🟢';
  if (value >= threshold) return '✅';
  if (value >= threshold - 5) return '🟡';
  return '🔴';
}

/**
 * Check global thresholds
 */
function checkGlobalThresholds(coverage) {
  const global = coverage.total;
  const failures = [];
  
  console.log(`${colors.bold}${colors.cyan}📊 Global Coverage Thresholds${colors.reset}`);
  console.log(''.padEnd(60, '─'));
  
  const metrics = ['statements', 'branches', 'functions', 'lines'];
  
  metrics.forEach(metric => {
    const value = global[metric].pct;
    const threshold = thresholds.global[metric];
    const status = getStatusEmoji(value, threshold);
    const formattedPct = formatPercentage(value, threshold);
    
    console.log(`${status} ${metric.padEnd(12)} ${formattedPct.padEnd(20)} (threshold: ${threshold}%)`);
    
    if (value < threshold) {
      failures.push({
        type: 'global',
        metric,
        actual: value,
        threshold,
        deficit: threshold - value
      });
    }
  });
  
  console.log();
  return failures;
}

/**
 * Check per-file thresholds
 */
function checkPerFileThresholds(coverage) {
  const failures = [];
  const files = Object.keys(coverage).filter(key => key !== 'total');
  
  console.log(`${colors.bold}${colors.cyan}📁 Per-File Coverage Analysis${colors.reset}`);
  console.log(''.padEnd(60, '─'));
  
  let totalFiles = 0;
  let passingFiles = 0;
  
  files.forEach(filePath => {
    const fileCoverage = coverage[filePath];
    const fileThresholds = getFileThresholds(filePath);
    const fileFailures = [];
    
    totalFiles++;
    
    const metrics = ['statements', 'branches', 'functions', 'lines'];
    let filePassingMetrics = 0;
    
    metrics.forEach(metric => {
      const value = fileCoverage[metric].pct;
      const threshold = fileThresholds[metric];
      
      if (value >= threshold) {
        filePassingMetrics++;
      } else {
        fileFailures.push({
          type: 'per-file',
          file: filePath,
          metric,
          actual: value,
          threshold,
          deficit: threshold - value
        });
      }
    });
    
    if (filePassingMetrics === metrics.length) {
      passingFiles++;
    }
    
    if (fileFailures.length > 0) {
      const shortPath = filePath.replace(process.cwd(), '').replace(/^\//, '');
      console.log(`${colors.red}❌ ${shortPath}${colors.reset}`);
      
      fileFailures.forEach(failure => {
        const formattedPct = formatPercentage(failure.actual, failure.threshold);
        console.log(`   ${failure.metric}: ${formattedPct} (needs ${failure.threshold}%)`);
      });
      
      failures.push(...fileFailures);
      console.log();
    }
  });
  
  const passRate = totalFiles > 0 ? (passingFiles / totalFiles) * 100 : 0;
  const status = passRate >= 90 ? '🟢' : passRate >= 80 ? '✅' : passRate >= 70 ? '🟡' : '🔴';
  
  console.log(`${status} File Coverage Summary: ${passingFiles}/${totalFiles} files passing (${passRate.toFixed(1)}%)`);
  console.log();
  
  return failures;
}

/**
 * Generate detailed failure report
 */
function generateFailureReport(failures) {
  if (failures.length === 0) return;
  
  console.log(`${colors.bold}${colors.red}🚨 Coverage Threshold Failures${colors.reset}`);
  console.log(''.padEnd(60, '─'));
  
  const globalFailures = failures.filter(f => f.type === 'global');
  const fileFailures = failures.filter(f => f.type === 'per-file');
  
  if (globalFailures.length > 0) {
    console.log(`${colors.bold}Global Threshold Failures:${colors.reset}`);
    globalFailures.forEach(failure => {
      console.log(`  • ${failure.metric}: ${failure.actual.toFixed(2)}% (need ${failure.threshold}%, deficit: ${failure.deficit.toFixed(2)}%)`);
    });
    console.log();
  }
  
  if (fileFailures.length > 0) {
    console.log(`${colors.bold}Per-File Threshold Failures:${colors.reset}`);
    const groupedByFile = fileFailures.reduce((acc, failure) => {
      if (!acc[failure.file]) acc[failure.file] = [];
      acc[failure.file].push(failure);
      return acc;
    }, {});
    
    Object.entries(groupedByFile).forEach(([file, fileFailures]) => {
      const shortPath = file.replace(process.cwd(), '').replace(/^\//, '');
      console.log(`  📄 ${shortPath}`);
      fileFailures.forEach(failure => {
        console.log(`    • ${failure.metric}: ${failure.actual.toFixed(2)}% (need ${failure.threshold}%, deficit: ${failure.deficit.toFixed(2)}%)`);
      });
    });
    console.log();
  }
}

/**
 * Generate improvement suggestions
 */
function generateImprovementSuggestions(failures) {
  if (failures.length === 0) return;
  
  console.log(`${colors.bold}${colors.blue}💡 Improvement Suggestions${colors.reset}`);
  console.log(''.padEnd(60, '─'));
  
  console.log('To improve coverage:');
  console.log('  1. Run tests with coverage: npm run test:cov');
  console.log('  2. Open coverage/index.html to see uncovered lines');
  console.log('  3. Add tests for red-highlighted code sections');
  console.log('  4. Focus on business logic and error paths');
  console.log('  5. Consider edge cases and boundary conditions');
  console.log();
  
  const globalFailures = failures.filter(f => f.type === 'global');
  if (globalFailures.length > 0) {
    console.log('For global threshold failures:');
    console.log('  • Add comprehensive integration tests');
    console.log('  • Test error handling paths');
    console.log('  • Include happy path and edge case scenarios');
    console.log();
  }
  
  const fileFailures = failures.filter(f => f.type === 'per-file');
  if (fileFailures.length > 0) {
    console.log('For specific file failures:');
    console.log('  • Focus testing efforts on the listed files');
    console.log('  • Pay special attention to untested branches');
    console.log('  • Add unit tests for each public function');
    console.log();
  }
}

/**
 * Handle emergency bypass
 */
function handleEmergencyBypass() {
  if (!emergencyBypass.enabled) return false;
  
  console.log(`${colors.bold}${colors.yellow}🚨 EMERGENCY COVERAGE BYPASS ACTIVATED 🚨${colors.reset}`);
  console.log(''.padEnd(60, '─'));
  console.log(`Approver: ${emergencyBypass.approver || 'Not specified'}`);
  console.log(`Reason: ${emergencyBypass.reason || 'Not specified'}`);
  console.log(`Ticket: ${emergencyBypass.ticket || 'Not specified'}`);
  console.log();
  console.log(`${colors.yellow}⚠️  This bypass should only be used for critical production fixes.${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Coverage thresholds must be addressed in a follow-up PR.${colors.reset}`);
  console.log();
  
  // Log bypass usage for tracking
  const bypassLog = {
    timestamp: new Date().toISOString(),
    approver: emergencyBypass.approver,
    reason: emergencyBypass.reason,
    ticket: emergencyBypass.ticket,
    commit: process.env.GITHUB_SHA || 'local',
    branch: process.env.GITHUB_REF_NAME || 'local'
  };
  
  const logPath = path.join(process.cwd(), 'coverage-bypass.log');
  fs.appendFileSync(logPath, JSON.stringify(bypassLog) + '\n');
  
  return true;
}

/**
 * Generate GitHub Actions output
 */
function generateGitHubOutput(failures, coverageData) {
  if (!process.env.GITHUB_ACTIONS) return;
  
  const summary = {
    totalFailures: failures.length,
    globalFailures: failures.filter(f => f.type === 'global').length,
    fileFailures: failures.filter(f => f.type === 'per-file').length,
    overallCoverage: {
      statements: coverageData.total.statements.pct,
      branches: coverageData.total.branches.pct,
      functions: coverageData.total.functions.pct,
      lines: coverageData.total.lines.pct
    }
  };
  
  // Set outputs for GitHub Actions
  console.log(`::set-output name=coverage-status::${failures.length === 0 ? 'passed' : 'failed'}`);
  console.log(`::set-output name=failure-count::${failures.length}`);
  console.log(`::set-output name=coverage-summary::${JSON.stringify(summary)}`);
  
  if (failures.length > 0) {
    console.log(`::error title=Coverage Thresholds Failed::${failures.length} coverage thresholds failed. See job summary for details.`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bold}${colors.cyan}🧪 Coverage Threshold Checker${colors.reset}`);
  console.log(`${colors.dim}Enforcing code quality through comprehensive coverage validation${colors.reset}`);
  console.log(''.padEnd(60, '='));
  console.log();
  
  // Check for emergency bypass first
  if (handleEmergencyBypass()) {
    console.log(`${colors.green}✅ Emergency bypass activated - build will continue${colors.reset}`);
    process.exit(0);
  }
  
  const coverageData = loadCoverageData();
  
  const globalFailures = checkGlobalThresholds(coverageData);
  const fileFailures = checkPerFileThresholds(coverageData);
  
  const allFailures = [...globalFailures, ...fileFailures];
  
  if (allFailures.length === 0) {
    console.log(`${colors.bold}${colors.green}🎉 All coverage thresholds passed!${colors.reset}`);
    console.log(`${colors.green}✅ Build can proceed - excellent test coverage maintained${colors.reset}`);
    console.log();
  } else {
    generateFailureReport(allFailures);
    generateImprovementSuggestions(allFailures);
    
    console.log(`${colors.bold}${colors.red}❌ Coverage thresholds not met - build failed${colors.reset}`);
    console.log();
    console.log(`${colors.yellow}To bypass temporarily (emergency only):${colors.reset}`);
    console.log(`${colors.dim}  COVERAGE_EMERGENCY_BYPASS=true \\${colors.reset}`);
    console.log(`${colors.dim}  COVERAGE_BYPASS_APPROVER="<approver-name>" \\${colors.reset}`);
    console.log(`${colors.dim}  COVERAGE_BYPASS_REASON="<reason>" \\${colors.reset}`);
    console.log(`${colors.dim}  COVERAGE_BYPASS_TICKET="<ticket-id>" \\${colors.reset}`);
    console.log(`${colors.dim}  npm run test:cov${colors.reset}`);
    console.log();
  }
  
  generateGitHubOutput(allFailures, coverageData);
  
  process.exit(allFailures.length > 0 ? 1 : 0);
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = {
  checkGlobalThresholds,
  checkPerFileThresholds,
  loadCoverageData,
  getFileThresholds,
  pathMatches
};