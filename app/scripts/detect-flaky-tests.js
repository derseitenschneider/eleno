#!/usr/bin/env node

/**
 * Flaky Test Detection Script
 * 
 * Runs tests multiple times and analyzes flakiness patterns
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const DEFAULT_ITERATIONS = 10
const DEFAULT_PARALLEL_THREADS = 6

class FlakyTestRunner {
  constructor(iterations = DEFAULT_ITERATIONS, threads = DEFAULT_PARALLEL_THREADS) {
    this.iterations = iterations
    this.threads = threads
    this.results = new Map()
  }

  async runTestSuite() {
    console.log(`🧪 Running test suite ${this.iterations} times with ${this.threads} threads`)
    console.log('This may take several minutes...\n')

    for (let i = 1; i <= this.iterations; i++) {
      console.log(`📊 Run ${i}/${this.iterations}`)
      
      try {
        const output = execSync(
          `npm run test -- --run --poolOptions.threads.maxThreads=${this.threads} --reporter=json`,
          { 
            encoding: 'utf8',
            stdio: 'pipe',
            timeout: 300000 // 5 minutes timeout
          }
        )
        
        this.parseTestResults(output, i)
      } catch (error) {
        console.error(`❌ Run ${i} failed:`, error.message)
        // Parse stderr for test results even if process failed
        if (error.stdout) {
          this.parseTestResults(error.stdout, i)
        }
      }
    }

    this.generateReport()
  }

  parseTestResults(output, runNumber) {
    try {
      // Extract JSON from output (vitest may have extra output)
      const lines = output.split('\n')
      const jsonLine = lines.find(line => line.trim().startsWith('{') && line.includes('"testResults"'))
      
      if (!jsonLine) {
        console.warn(`⚠️  No JSON results found in run ${runNumber}`)
        return
      }

      const results = JSON.parse(jsonLine)
      
      if (results.testResults) {
        results.testResults.forEach(fileResult => {
          if (fileResult.assertionResults) {
            fileResult.assertionResults.forEach(test => {
              const testKey = `${fileResult.name} > ${test.title}`
              
              if (!this.results.has(testKey)) {
                this.results.set(testKey, {
                  passes: 0,
                  failures: 0,
                  errors: new Set(),
                  durations: []
                })
              }
              
              const testData = this.results.get(testKey)
              
              if (test.status === 'passed') {
                testData.passes++
              } else {
                testData.failures++
                if (test.failureMessages && test.failureMessages.length > 0) {
                  test.failureMessages.forEach(msg => testData.errors.add(msg))
                }
              }
              
              if (test.duration) {
                testData.durations.push(test.duration)
              }
            })
          }
        })
      }
    } catch (error) {
      console.error(`❌ Failed to parse results for run ${runNumber}:`, error.message)
    }
  }

  generateReport() {
    console.log('\n📈 FLAKY TEST ANALYSIS REPORT')
    console.log('=' * 50)

    const flakyTests = []
    const stableTests = []

    this.results.forEach((data, testName) => {
      const total = data.passes + data.failures
      const passRate = (data.passes / total) * 100
      const flakiness = (Math.min(data.passes, data.failures) / total) * 100
      const avgDuration = data.durations.length > 0 
        ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length 
        : 0

      const testInfo = {
        name: testName,
        total,
        passes: data.passes,
        failures: data.failures,
        passRate,
        flakiness,
        avgDuration,
        errors: Array.from(data.errors)
      }

      if (flakiness > 0) {
        flakyTests.push(testInfo)
      } else {
        stableTests.push(testInfo)
      }
    })

    // Sort by flakiness (highest first)
    flakyTests.sort((a, b) => b.flakiness - a.flakiness)

    console.log(`\n🔴 FLAKY TESTS (${flakyTests.length} found):`)
    if (flakyTests.length === 0) {
      console.log('✅ No flaky tests detected!')
    } else {
      flakyTests.forEach(test => {
        console.log(`\n🚨 ${test.name}`)
        console.log(`   Pass rate: ${test.passRate.toFixed(1)}% (${test.passes}/${test.total})`)
        console.log(`   Flakiness: ${test.flakiness.toFixed(1)}%`)
        console.log(`   Avg duration: ${test.avgDuration.toFixed(1)}ms`)
        
        if (test.errors.length > 0) {
          console.log(`   Common errors:`)
          test.errors.slice(0, 3).forEach(error => {
            const shortError = error.substring(0, 100) + (error.length > 100 ? '...' : '')
            console.log(`     - ${shortError}`)
          })
        }
      })
    }

    console.log(`\n✅ STABLE TESTS: ${stableTests.length}`)
    
    // Summary statistics
    console.log(`\n📊 SUMMARY:`)
    console.log(`   Total test runs: ${this.iterations}`)
    console.log(`   Total unique tests: ${this.results.size}`)
    console.log(`   Flaky tests: ${flakyTests.length}`)
    console.log(`   Stability rate: ${((stableTests.length / this.results.size) * 100).toFixed(1)}%`)

    // Save detailed report
    this.saveReport({ flakyTests, stableTests, summary: {
      iterations: this.iterations,
      threads: this.threads,
      totalTests: this.results.size,
      flakyCount: flakyTests.length,
      stabilityRate: (stableTests.length / this.results.size) * 100
    }})
  }

  saveReport(report) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `flaky-test-report-${timestamp}.json`
    const filepath = path.join(process.cwd(), 'test-reports', filename)
    
    // Ensure directory exists
    fs.mkdirSync(path.dirname(filepath), { recursive: true })
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2))
    console.log(`\n💾 Detailed report saved to: ${filepath}`)
  }
}

// CLI interface
const iterations = parseInt(process.argv[2]) || DEFAULT_ITERATIONS
const threads = parseInt(process.argv[3]) || DEFAULT_PARALLEL_THREADS

const runner = new FlakyTestRunner(iterations, threads)
runner.runTestSuite().catch(console.error)