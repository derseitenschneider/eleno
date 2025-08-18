/**
 * Flaky Test Detection Utilities
 * 
 * Tools to identify and monitor test flakiness, especially in parallel execution
 */

export interface TestRun {
  id: string
  name: string
  status: 'pass' | 'fail'
  duration: number
  timestamp: number
  error?: string
}

export interface FlakinesReport {
  testName: string
  totalRuns: number
  passCount: number
  failCount: number
  flakiness: number // percentage 0-100
  failureReasons: string[]
  avgDuration: number
}

export class FlakyTestDetector {
  private testRuns: Map<string, TestRun[]> = new Map()

  recordTestRun(testName: string, status: 'pass' | 'fail', duration: number, error?: string) {
    const run: TestRun = {
      id: crypto.randomUUID(),
      name: testName,
      status,
      duration,
      timestamp: Date.now(),
      error
    }

    if (!this.testRuns.has(testName)) {
      this.testRuns.set(testName, [])
    }
    
    this.testRuns.get(testName)!.push(run)
  }

  generateReport(testName: string): FlakinesReport | null {
    const runs = this.testRuns.get(testName)
    if (!runs || runs.length === 0) return null

    const passCount = runs.filter(r => r.status === 'pass').length
    const failCount = runs.filter(r => r.status === 'fail').length
    const totalRuns = runs.length
    const flakiness = (Math.min(passCount, failCount) / totalRuns) * 100
    
    const failureReasons = runs
      .filter(r => r.status === 'fail' && r.error)
      .map(r => r.error!)
      .filter((error, index, array) => array.indexOf(error) === index) // unique
    
    const avgDuration = runs.reduce((sum, r) => sum + r.duration, 0) / totalRuns

    return {
      testName,
      totalRuns,
      passCount,
      failCount,
      flakiness,
      failureReasons,
      avgDuration
    }
  }

  getAllReports(): FlakinesReport[] {
    return Array.from(this.testRuns.keys())
      .map(testName => this.generateReport(testName))
      .filter((report): report is FlakinesReport => report !== null)
      .sort((a, b) => b.flakiness - a.flakiness) // highest flakiness first
  }

  getFlakyTests(threshold: number = 5): FlakinesReport[] {
    return this.getAllReports().filter(report => report.flakiness >= threshold)
  }

  clear() {
    this.testRuns.clear()
  }

  exportData(): string {
    const reports = this.getAllReports()
    return JSON.stringify(reports, null, 2)
  }
}

export const globalFlakyDetector = new FlakyTestDetector()

/**
 * Vitest reporter integration to automatically track test runs
 */
export function createFlakinessReporter() {
  return {
    onTestFinished(test: any) {
      const testName = `${test.file?.name || 'unknown'} > ${test.name}`
      const status = test.result?.state === 'pass' ? 'pass' : 'fail'
      const duration = test.result?.duration || 0
      const error = test.result?.errors?.[0]?.message
      
      globalFlakyDetector.recordTestRun(testName, status, duration, error)
    }
  }
}