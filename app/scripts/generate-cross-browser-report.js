#!/usr/bin/env node

/**
 * Cross-Browser Test Report Generator
 * Generates comprehensive reports for cross-browser testing results
 */

const fs = require('fs')
const path = require('path')

const { compatibilityMatrix } = require('../tests/cross-browser/crossBrowserConfig')

function generateCrossBrowserReport(resultsDir = './test-results') {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalBrowsers: 0,
      passedBrowsers: 0,
      failedBrowsers: 0,
      skippedBrowsers: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
    },
    browsers: {},
    suites: {},
    compatibility: compatibilityMatrix,
    issues: [],
    recommendations: [],
  }

  try {
    // Read all result files from the test results directory
    if (fs.existsSync(resultsDir)) {
      const files = fs.readdirSync(resultsDir)
      const jsonFiles = files.filter(file => file.endsWith('.json') && file.includes('cross-browser'))

      jsonFiles.forEach(file => {
        try {
          const filePath = path.join(resultsDir, file)
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          
          // Extract browser and suite info from filename
          const match = file.match(/cross-browser-(.+?)-(.+?)-(.+?)\.json/)
          if (match) {
            const [, suite, browser, os] = match
            
            if (!report.browsers[browser]) {
              report.browsers[browser] = {
                name: browser,
                suites: {},
                totalTests: 0,
                passedTests: 0,
                failedTests: 0,
                issues: [],
              }
            }
            
            if (!report.suites[suite]) {
              report.suites[suite] = {
                name: suite,
                browsers: {},
                totalTests: 0,
                passedTests: 0,
                failedTests: 0,
              }
            }

            // Update browser data
            const browserData = report.browsers[browser]
            browserData.suites[suite] = {
              ...data.summary,
              os,
            }
            browserData.totalTests += data.summary?.total || 0
            browserData.passedTests += data.summary?.passed || 0
            browserData.failedTests += data.summary?.failed || 0

            // Update suite data
            const suiteData = report.suites[suite]
            suiteData.browsers[browser] = {
              ...data.summary,
              os,
            }
            suiteData.totalTests += data.summary?.total || 0
            suiteData.passedTests += data.summary?.passed || 0
            suiteData.failedTests += data.summary?.failed || 0

            // Update overall summary
            report.summary.totalTests += data.summary?.total || 0
            report.summary.passedTests += data.summary?.passed || 0
            report.summary.failedTests += data.summary?.failed || 0

            // Collect issues
            if (data.summary?.failed > 0) {
              report.issues.push({
                browser,
                suite,
                os,
                failedTests: data.summary.failed,
                totalTests: data.summary.total,
              })
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not parse ${file}:`, error.message)
        }
      })
    }

    // Calculate browser summary
    Object.keys(report.browsers).forEach(browser => {
      const browserData = report.browsers[browser]
      if (browserData.failedTests === 0 && browserData.totalTests > 0) {
        report.summary.passedBrowsers++
      } else if (browserData.totalTests > 0) {
        report.summary.failedBrowsers++
      } else {
        report.summary.skippedBrowsers++
      }
    })
    report.summary.totalBrowsers = Object.keys(report.browsers).length

    // Generate recommendations
    generateRecommendations(report)

    return report
  } catch (error) {
    console.error('Error generating cross-browser report:', error)
    return report
  }
}

function generateRecommendations(report) {
  const recommendations = []

  // Check for browser-specific issues
  Object.entries(report.browsers).forEach(([browser, data]) => {
    const failureRate = data.totalTests > 0 ? (data.failedTests / data.totalTests) * 100 : 0
    
    if (failureRate > 50) {
      recommendations.push({
        type: 'critical',
        browser,
        issue: `High failure rate (${failureRate.toFixed(1)}%) in ${browser}`,
        suggestion: `Review ${browser}-specific compatibility issues and consider browser-specific fixes`,
      })
    } else if (failureRate > 20) {
      recommendations.push({
        type: 'warning',
        browser,
        issue: `Moderate failure rate (${failureRate.toFixed(1)}%) in ${browser}`,
        suggestion: `Monitor ${browser} test results and investigate failing tests`,
      })
    }
  })

  // Check for suite-specific issues
  Object.entries(report.suites).forEach(([suite, data]) => {
    const failureRate = data.totalTests > 0 ? (data.failedTests / data.totalTests) * 100 : 0
    
    if (failureRate > 30) {
      recommendations.push({
        type: 'warning',
        suite,
        issue: `${suite} suite has high cross-browser failure rate (${failureRate.toFixed(1)}%)`,
        suggestion: `Review ${suite} tests for browser compatibility issues`,
      })
    }
  })

  // Feature recommendations
  if (report.browsers.webkit && report.browsers.webkit.failedTests > 0) {
    recommendations.push({
      type: 'info',
      browser: 'webkit',
      issue: 'WebKit/Safari specific failures detected',
      suggestion: 'Check for Safari-specific CSS and JavaScript compatibility issues',
    })
  }

  if (report.browsers.firefox && report.browsers.firefox.failedTests > 0) {
    recommendations.push({
      type: 'info',
      browser: 'firefox',
      issue: 'Firefox specific failures detected',
      suggestion: 'Review Gecko engine compatibility and CSS Grid/Flexbox implementations',
    })
  }

  // Mobile recommendations
  if (report.suites.responsive && report.suites.responsive.failedTests > 0) {
    recommendations.push({
      type: 'info',
      suite: 'responsive',
      issue: 'Mobile/responsive tests failing',
      suggestion: 'Check viewport meta tags, touch interactions, and mobile-specific CSS',
    })
  }

  report.recommendations = recommendations
}

function formatReportAsMarkdown(report) {
  let markdown = `# 🌐 Cross-Browser Test Report\n\n`
  markdown += `**Generated**: ${report.timestamp}\n\n`

  // Summary
  markdown += `## 📊 Summary\n\n`
  markdown += `| Metric | Count | Percentage |\n`
  markdown += `|--------|-------|------------|\n`
  markdown += `| Total Browsers | ${report.summary.totalBrowsers} | 100% |\n`
  markdown += `| Passed Browsers | ${report.summary.passedBrowsers} | ${((report.summary.passedBrowsers / report.summary.totalBrowsers) * 100).toFixed(1)}% |\n`
  markdown += `| Failed Browsers | ${report.summary.failedBrowsers} | ${((report.summary.failedBrowsers / report.summary.totalBrowsers) * 100).toFixed(1)}% |\n`
  markdown += `| Total Tests | ${report.summary.totalTests} | 100% |\n`
  markdown += `| Passed Tests | ${report.summary.passedTests} | ${((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1)}% |\n`
  markdown += `| Failed Tests | ${report.summary.failedTests} | ${((report.summary.failedTests / report.summary.totalTests) * 100).toFixed(1)}% |\n\n`

  // Browser Results
  markdown += `## 🌐 Browser Results\n\n`
  markdown += `| Browser | Total Tests | Passed | Failed | Success Rate |\n`
  markdown += `|---------|-------------|--------|--------|--------------|\n`
  
  Object.entries(report.browsers).forEach(([browser, data]) => {
    const successRate = data.totalTests > 0 ? ((data.passedTests / data.totalTests) * 100).toFixed(1) : '0.0'
    const status = data.failedTests === 0 ? '✅' : '❌'
    markdown += `| ${status} ${browser} | ${data.totalTests} | ${data.passedTests} | ${data.failedTests} | ${successRate}% |\n`
  })

  // Suite Results
  markdown += `\n## 🧪 Test Suite Results\n\n`
  markdown += `| Suite | Total Tests | Passed | Failed | Success Rate |\n`
  markdown += `|-------|-------------|--------|--------|--------------|\n`
  
  Object.entries(report.suites).forEach(([suite, data]) => {
    const successRate = data.totalTests > 0 ? ((data.passedTests / data.totalTests) * 100).toFixed(1) : '0.0'
    const status = data.failedTests === 0 ? '✅' : '❌'
    markdown += `| ${status} ${suite} | ${data.totalTests} | ${data.passedTests} | ${data.failedTests} | ${successRate}% |\n`
  })

  // Issues
  if (report.issues.length > 0) {
    markdown += `\n## ⚠️ Issues Detected\n\n`
    report.issues.forEach(issue => {
      markdown += `- **${issue.browser}** (${issue.suite} suite): ${issue.failedTests}/${issue.totalTests} tests failed\n`
    })
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    markdown += `\n## 💡 Recommendations\n\n`
    report.recommendations.forEach(rec => {
      const icon = rec.type === 'critical' ? '🚨' : rec.type === 'warning' ? '⚠️' : 'ℹ️'
      markdown += `${icon} **${rec.browser || rec.suite}**: ${rec.issue}\n`
      markdown += `   - ${rec.suggestion}\n\n`
    })
  }

  return markdown
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2)
  const format = args.includes('--format=json') ? 'json' : 'markdown'
  const output = args.find(arg => arg.startsWith('--output='))?.split('=')[1]
  const resultsDir = args.find(arg => !arg.startsWith('--')) || './test-results'

  const report = generateCrossBrowserReport(resultsDir)

  let content
  if (format === 'json') {
    content = JSON.stringify(report, null, 2)
  } else {
    content = formatReportAsMarkdown(report)
  }

  if (output) {
    fs.writeFileSync(output, content)
    console.log(`Cross-browser report written to ${output}`)
  } else {
    console.log(content)
  }
}

module.exports = { generateCrossBrowserReport, formatReportAsMarkdown }