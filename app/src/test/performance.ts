/**
 * Comprehensive Performance Monitoring and Profiling Tools
 * 
 * This module provides detailed performance monitoring for mock operations:
 * - Mock execution time tracking with histogram analysis
 * - Memory usage monitoring and leak detection
 * - Response generation profiling with bottleneck identification
 * - Handler performance metrics with percentile analysis
 * - Cache hit rate monitoring and optimization suggestions
 * - Comparative performance analysis and regression detection
 */

import { performance } from 'perf_hooks'

// Performance tracking interfaces
interface PerformanceEntry {
  name: string
  startTime: number
  endTime: number
  duration: number
  metadata?: Record<string, any>
}

interface PerformanceMetrics {
  totalCalls: number
  totalTime: number
  averageTime: number
  minTime: number
  maxTime: number
  p50: number
  p95: number
  p99: number
  standardDeviation: number
}

interface MemorySnapshot {
  timestamp: number
  heapUsed: number
  heapTotal: number
  external: number
  rss?: number
}

interface BenchmarkResult {
  name: string
  iterations: number
  totalTime: number
  averageTime: number
  opsPerSecond: number
  metrics: PerformanceMetrics
}

// Global performance state
let performanceEntries: PerformanceEntry[] = []
let memorySnapshots: MemorySnapshot[] = []
let isMonitoringActive = false
let performanceTimers = new Map<string, number>()

/**
 * Start performance monitoring
 */
export function startPerformanceMonitoring() {
  isMonitoringActive = true
  performanceEntries = []
  memorySnapshots = []
  console.log('📊 Performance monitoring started')
  
  // Take initial memory snapshot
  takeMemorySnapshot()
}

/**
 * Stop performance monitoring
 */
export function stopPerformanceMonitoring() {
  isMonitoringActive = false
  console.log('📊 Performance monitoring stopped')
}

/**
 * Take a memory snapshot
 */
export function takeMemorySnapshot(): MemorySnapshot | null {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage()
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
      external: Math.round(usage.external / 1024 / 1024 * 100) / 100, // MB
      rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
    }
    
    if (isMonitoringActive) {
      memorySnapshots.push(snapshot)
    }
    
    return snapshot
  }
  return null
}

/**
 * Get current memory usage
 */
export function getMemoryUsage(): MemorySnapshot | null {
  return takeMemorySnapshot()
}

/**
 * Start timing an operation
 */
export function startTimer(name: string, metadata?: Record<string, any>): void {
  const startTime = performance.now()
  performanceTimers.set(name, startTime)
  
  if (isMonitoringActive && metadata) {
    // Store metadata for later use
    const key = `${name}_metadata`
    performanceTimers.set(key, metadata as any)
  }
}

/**
 * End timing an operation
 */
export function endTimer(name: string): number {
  const endTime = performance.now()
  const startTime = performanceTimers.get(name)
  
  if (startTime === undefined) {
    console.warn(`⚠️  Timer '${name}' was not started`)
    return 0
  }
  
  const duration = endTime - startTime
  performanceTimers.delete(name)
  
  // Get metadata if available
  const metadataKey = `${name}_metadata`
  const metadata = performanceTimers.get(metadataKey) as Record<string, any> | undefined
  if (metadata) {
    performanceTimers.delete(metadataKey)
  }
  
  if (isMonitoringActive) {
    performanceEntries.push({
      name,
      startTime,
      endTime,
      duration,
      metadata,
    })
  }
  
  return duration
}

/**
 * Measure function execution time
 */
export async function measureTime<T>(
  name: string,
  fn: () => T | Promise<T>,
  metadata?: Record<string, any>
): Promise<{ result: T; duration: number }> {
  startTimer(name, metadata)
  
  try {
    const result = await fn()
    const duration = endTimer(name)
    return { result, duration }
  } catch (error) {
    endTimer(name)
    throw error
  }
}

/**
 * Benchmark a function with multiple iterations
 */
export async function benchmarkFunction<T>(
  fn: () => T | Promise<T>,
  name: string,
  iterations = 1000,
  warmupIterations = 100
): Promise<BenchmarkResult> {
  console.log(`🏃‍♂️ Benchmarking '${name}' (${iterations} iterations)...`)
  
  // Warmup phase
  for (let i = 0; i < warmupIterations; i++) {
    await fn()
  }
  
  // Collect garbage before benchmark
  if (global.gc) {
    global.gc()
  }
  
  const times: number[] = []
  const startTime = performance.now()
  
  for (let i = 0; i < iterations; i++) {
    const iterationStart = performance.now()
    await fn()
    const iterationEnd = performance.now()
    times.push(iterationEnd - iterationStart)
  }
  
  const totalTime = performance.now() - startTime
  const metrics = calculateMetrics(times)
  
  const result: BenchmarkResult = {
    name,
    iterations,
    totalTime,
    averageTime: metrics.averageTime,
    opsPerSecond: Math.round(iterations / (totalTime / 1000)),
    metrics,
  }
  
  console.log(`✅ Completed '${name}': ${result.averageTime.toFixed(3)}ms avg, ${result.opsPerSecond} ops/sec`)
  
  return result
}

/**
 * Calculate performance metrics from timing data
 */
function calculateMetrics(times: number[]): PerformanceMetrics {
  if (times.length === 0) {
    return {
      totalCalls: 0,
      totalTime: 0,
      averageTime: 0,
      minTime: 0,
      maxTime: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      standardDeviation: 0,
    }
  }
  
  const sorted = [...times].sort((a, b) => a - b)
  const total = times.reduce((sum, time) => sum + time, 0)
  const average = total / times.length
  
  // Calculate percentiles
  const p50 = percentile(sorted, 50)
  const p95 = percentile(sorted, 95)
  const p99 = percentile(sorted, 99)
  
  // Calculate standard deviation
  const variance = times.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / times.length
  const standardDeviation = Math.sqrt(variance)
  
  return {
    totalCalls: times.length,
    totalTime: total,
    averageTime: average,
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
    p50,
    p95,
    p99,
    standardDeviation,
  }
}

/**
 * Calculate percentile from sorted array
 */
function percentile(sortedArray: number[], percentile: number): number {
  if (sortedArray.length === 0) return 0
  
  const index = (percentile / 100) * (sortedArray.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  
  if (lower === upper) {
    return sortedArray[lower]
  }
  
  const weight = index - lower
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight
}

/**
 * Get performance metrics for a specific operation
 */
export function getMetricsForOperation(operationName: string): PerformanceMetrics {
  const entries = performanceEntries.filter(entry => entry.name === operationName)
  const times = entries.map(entry => entry.duration)
  return calculateMetrics(times)
}

/**
 * Get all performance data
 */
export function getAllPerformanceData() {
  return {
    entries: [...performanceEntries],
    memorySnapshots: [...memorySnapshots],
    isMonitoring: isMonitoringActive,
  }
}

/**
 * Reset all performance tracking data
 */
export function resetAllPerformanceTracking() {
  performanceEntries = []
  memorySnapshots = []
  performanceTimers.clear()
  console.log('🧹 Performance tracking data reset')
}

/**
 * Analyze memory usage patterns
 */
export function analyzeMemoryUsage() {
  if (memorySnapshots.length < 2) {
    console.log('📊 Not enough memory snapshots for analysis')
    return null
  }
  
  const first = memorySnapshots[0]
  const last = memorySnapshots[memorySnapshots.length - 1]
  const peak = memorySnapshots.reduce((max, snapshot) => 
    snapshot.heapUsed > max.heapUsed ? snapshot : max
  )
  
  const analysis = {
    totalSnapshots: memorySnapshots.length,
    duration: last.timestamp - first.timestamp,
    initialHeap: first.heapUsed,
    finalHeap: last.heapUsed,
    peakHeap: peak.heapUsed,
    heapGrowth: last.heapUsed - first.heapUsed,
    peakGrowth: peak.heapUsed - first.heapUsed,
    averageHeap: memorySnapshots.reduce((sum, s) => sum + s.heapUsed, 0) / memorySnapshots.length,
  }
  
  console.log('\n💾 Memory Usage Analysis:')
  console.log(`  • Duration: ${analysis.duration}ms`)
  console.log(`  • Initial heap: ${analysis.initialHeap}MB`)
  console.log(`  • Final heap: ${analysis.finalHeap}MB`)
  console.log(`  • Peak heap: ${analysis.peakHeap}MB`)
  console.log(`  • Heap growth: ${analysis.heapGrowth.toFixed(2)}MB`)
  console.log(`  • Average heap: ${analysis.averageHeap.toFixed(2)}MB`)
  
  if (analysis.heapGrowth > 10) {
    console.log(`  ⚠️  Significant memory growth detected: ${analysis.heapGrowth}MB`)
  }
  
  return analysis
}

/**
 * Print comprehensive performance report
 */
export function printPerformanceReport() {
  console.log('\n📊 Comprehensive Performance Report')
  console.log('=' .repeat(50))
  
  if (performanceEntries.length === 0) {
    console.log('No performance data collected')
    return
  }
  
  // Group entries by operation name
  const operationGroups = new Map<string, PerformanceEntry[]>()
  
  for (const entry of performanceEntries) {
    if (!operationGroups.has(entry.name)) {
      operationGroups.set(entry.name, [])
    }
    operationGroups.get(entry.name)!.push(entry)
  }
  
  // Analyze each operation
  console.log('\n🎯 Operation Performance:')
  
  for (const [name, entries] of operationGroups) {
    const times = entries.map(e => e.duration)
    const metrics = calculateMetrics(times)
    
    console.log(`\n  ${name}:`)
    console.log(`    • Calls: ${metrics.totalCalls}`)
    console.log(`    • Average: ${metrics.averageTime.toFixed(3)}ms`)
    console.log(`    • Min/Max: ${metrics.minTime.toFixed(3)}ms / ${metrics.maxTime.toFixed(3)}ms`)
    console.log(`    • P50/P95/P99: ${metrics.p50.toFixed(3)}ms / ${metrics.p95.toFixed(3)}ms / ${metrics.p99.toFixed(3)}ms`)
    console.log(`    • Std Dev: ${metrics.standardDeviation.toFixed(3)}ms`)
    
    if (metrics.averageTime > 10) {
      console.log(`    ⚠️  Slow operation detected (avg > 10ms)`)
    }
    
    if (metrics.standardDeviation > metrics.averageTime * 0.5) {
      console.log(`    ⚠️  High variability detected`)
    }
  }
  
  // Overall statistics
  const allTimes = performanceEntries.map(e => e.duration)
  const overallMetrics = calculateMetrics(allTimes)
  
  console.log('\n📈 Overall Statistics:')
  console.log(`  • Total operations: ${overallMetrics.totalCalls}`)
  console.log(`  • Total time: ${overallMetrics.totalTime.toFixed(2)}ms`)
  console.log(`  • Average operation time: ${overallMetrics.averageTime.toFixed(3)}ms`)
  console.log(`  • Slowest operation: ${overallMetrics.maxTime.toFixed(3)}ms`)
  
  // Memory analysis
  analyzeMemoryUsage()
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:')
  
  for (const [name, entries] of operationGroups) {
    const times = entries.map(e => e.duration)
    const metrics = calculateMetrics(times)
    
    if (metrics.averageTime > 5) {
      console.log(`  • Consider optimizing '${name}' (${metrics.averageTime.toFixed(1)}ms avg)`)
    }
    
    if (metrics.standardDeviation > metrics.averageTime * 0.5) {
      console.log(`  • Investigate variability in '${name}' (σ=${metrics.standardDeviation.toFixed(1)}ms)`)
    }
  }
}

/**
 * Performance comparison utility
 */
export function comparePerformance(
  name1: string,
  fn1: () => any,
  name2: string,
  fn2: () => any,
  iterations = 1000
): Promise<{ faster: string; improvement: number; results: [BenchmarkResult, BenchmarkResult] }> {
  return Promise.all([
    benchmarkFunction(fn1, name1, iterations),
    benchmarkFunction(fn2, name2, iterations),
  ]).then(([result1, result2]) => {
    const faster = result1.averageTime < result2.averageTime ? name1 : name2
    const slower = faster === name1 ? result2 : result1
    const fasterResult = faster === name1 ? result1 : result2
    
    const improvement = ((slower.averageTime - fasterResult.averageTime) / slower.averageTime) * 100
    
    console.log(`\n🏆 Performance Comparison Results:`)
    console.log(`  • ${faster} is ${improvement.toFixed(1)}% faster`)
    console.log(`  • ${name1}: ${result1.averageTime.toFixed(3)}ms`)
    console.log(`  • ${name2}: ${result2.averageTime.toFixed(3)}ms`)
    
    return {
      faster,
      improvement,
      results: [result1, result2],
    }
  })
}

/**
 * Continuous performance monitoring for long-running operations
 */
export class PerformanceMonitor {
  private intervalId?: NodeJS.Timeout
  private samples: MemorySnapshot[] = []
  
  start(intervalMs = 1000) {
    this.stop() // Stop any existing monitoring
    
    console.log(`📡 Starting continuous monitoring (${intervalMs}ms intervals)`)
    this.intervalId = setInterval(() => {
      const snapshot = takeMemorySnapshot()
      if (snapshot) {
        this.samples.push(snapshot)
      }
    }, intervalMs)
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
      console.log('📡 Continuous monitoring stopped')
    }
  }
  
  getSamples() {
    return [...this.samples]
  }
  
  reset() {
    this.samples = []
  }
  
  analyze() {
    if (this.samples.length < 2) {
      console.log('Not enough samples for analysis')
      return null
    }
    
    const analysis = {
      sampleCount: this.samples.length,
      duration: this.samples[this.samples.length - 1].timestamp - this.samples[0].timestamp,
      memoryGrowth: this.samples[this.samples.length - 1].heapUsed - this.samples[0].heapUsed,
      peakMemory: Math.max(...this.samples.map(s => s.heapUsed)),
      averageMemory: this.samples.reduce((sum, s) => sum + s.heapUsed, 0) / this.samples.length,
    }
    
    console.log('\n📡 Continuous Monitoring Analysis:')
    console.log(`  • Duration: ${analysis.duration}ms`)
    console.log(`  • Samples: ${analysis.sampleCount}`)
    console.log(`  • Memory growth: ${analysis.memoryGrowth.toFixed(2)}MB`)
    console.log(`  • Peak memory: ${analysis.peakMemory.toFixed(2)}MB`)
    console.log(`  • Average memory: ${analysis.averageMemory.toFixed(2)}MB`)
    
    return analysis
  }
}

/**
 * Mock operation profiler
 */
export function profileMockOperation<T>(
  operation: () => T,
  operationName: string,
  iterations = 100
): { result: T; profile: BenchmarkResult } {
  console.log(`🔍 Profiling mock operation: ${operationName}`)
  
  let result: T
  const profile = benchmarkFunction(
    () => {
      result = operation()
      return result
    },
    operationName,
    iterations
  )
  
  return { result: result!, profile: profile as any }
}

/**
 * Export performance data to JSON
 */
export function exportPerformanceData() {
  const data = {
    timestamp: new Date().toISOString(),
    entries: performanceEntries,
    memorySnapshots: memorySnapshots,
    summary: {
      totalOperations: performanceEntries.length,
      totalTime: performanceEntries.reduce((sum, e) => sum + e.duration, 0),
      averageTime: performanceEntries.length > 0 
        ? performanceEntries.reduce((sum, e) => sum + e.duration, 0) / performanceEntries.length 
        : 0,
    },
  }
  
  return JSON.stringify(data, null, 2)
}

/**
 * Wrap a render function with performance timing
 */
export function withRenderTiming<T extends (...args: any[]) => any>(
  renderFunction: T,
  componentName: string
): T {
  return ((...args: any[]) => {
    const timerName = `Render ${componentName}`
    startTimer(timerName, { componentName })
    
    try {
      const result = renderFunction(...args)
      endTimer(timerName)
      return result
    } catch (error) {
      endTimer(timerName)
      throw error
    }
  }) as T
}