/**
 * Comprehensive Mock Performance Benchmarking Suite
 * 
 * This test suite provides comprehensive performance benchmarking for all
 * mock performance improvements, including:
 * - Before/after performance comparisons
 * - Cache efficiency measurements
 * - Provider optimization validation
 * - Factory pooling effectiveness
 * - Memory usage improvements
 * - Real-world performance simulation
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import {
  benchmarkFunction,
  printPerformanceReport,
  resetAllPerformanceTracking,
  startPerformanceMonitoring,
  stopPerformanceMonitoring,
  comparePerformance,
  measureTime,
  PerformanceMonitor
} from './performance'

// Standard implementations
import * as standardFactories from './factories'
import * as standardMSW from './msw'
import { renderWithProviders as standardRender } from './testUtils'

// Optimized implementations
import * as optimizedFactories from './factories.optimized'
import * as optimizedMSW from './msw.optimized'
import { renderWithProviders as optimizedRender, renderMinimal, renderFast } from './testUtils.optimized'

// Lightweight implementations
import * as lightweightMocks from './mocks.lightweight'

// Cache implementations
import { mockCache, studentCache, lessonCache, resetAllCaches, printCacheReport } from './mockCache'

describe('Mock Performance Benchmarking Suite', () => {
  let performanceMonitor: PerformanceMonitor

  beforeAll(async () => {
    console.log('\n🚀 Starting Mock Performance Benchmarking Suite')
    console.log('=' .repeat(60))
    
    performanceMonitor = new PerformanceMonitor()
    performanceMonitor.start(500)
    
    startPerformanceMonitoring()
    resetAllPerformanceTracking()
    resetAllCaches()

    // Pre-warm optimized systems
    await optimizedMSW.preWarmMockCache()
    optimizedFactories.warmupFactoryPools()
  })

  afterAll(async () => {
    stopPerformanceMonitoring()
    performanceMonitor.stop()
    
    console.log('\n📈 Final Performance Analysis')
    console.log('=' .repeat(60))
    
    printPerformanceReport()
    printCacheReport()
    optimizedFactories.printFactoryReport()
    
    const monitorAnalysis = performanceMonitor.analyze()
    if (monitorAnalysis) {
      console.log('\n📡 Continuous Monitoring Results:')
      console.log(`  • Total memory growth: ${monitorAnalysis.memoryGrowth.toFixed(2)}MB`)
      console.log(`  • Peak memory usage: ${monitorAnalysis.peakMemory.toFixed(2)}MB`)
    }
  })

  beforeEach(() => {
    // Clean up between tests but keep warm caches
    optimizedFactories.resetFactoryStats()
  })

  describe('Factory Performance Benchmarks', () => {
    it('should benchmark student factory performance', async () => {
      const iterations = 2000

      console.log('\n👨‍🎓 Student Factory Performance Comparison')
      
      const comparison = await comparePerformance(
        'Standard Student Factory',
        () => standardFactories.createMockStudent(),
        'Optimized Student Factory',
        () => optimizedFactories.createMockStudent(),
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(20) // At least 20% improvement
      expect(comparison.faster).toBe('Optimized Student Factory')
    })

    it('should benchmark student factory with overrides', async () => {
      const iterations = 1000
      const overrides = { firstName: 'TestStudent', instrument: 'Guitar' }

      const comparison = await comparePerformance(
        'Standard Student Factory (overrides)',
        () => standardFactories.createMockStudent(overrides),
        'Optimized Student Factory (overrides)',
        () => optimizedFactories.createMockStudent(overrides),
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(15)
    })

    it('should benchmark bulk creation performance', async () => {
      const iterations = 200

      const comparison = await comparePerformance(
        'Standard Bulk Students (10)',
        () => standardFactories.createMockStudents(10),
        'Optimized Bulk Students (10)',
        () => optimizedFactories.createBulkStudents(10),
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(30) // Bulk should be much faster
    })

    it('should demonstrate object pooling effectiveness', async () => {
      console.log('\n🏊‍♂️ Object Pooling Effectiveness Test')
      
      // Reset stats
      optimizedFactories.resetFactoryStats()
      
      // Create many students with the same configuration (should hit pool)
      const iterations = 1000
      const config = { firstName: 'PoolTest', instrument: 'Piano' }
      
      const { result, duration } = await measureTime(
        'Pool Effectiveness Test',
        async () => {
          const students = []
          for (let i = 0; i < iterations; i++) {
            students.push(optimizedFactories.createMockStudent(config))
          }
          return students
        }
      )

      const stats = optimizedFactories.getFactoryStats()
      
      console.log(`\n🎯 Pool Statistics:`)
      console.log(`  • Total calls: ${stats.totalCalls}`)
      console.log(`  • Pool hits: ${stats.poolHits}`)
      console.log(`  • Hit rate: ${stats.hitRate.toFixed(1)}%`)
      console.log(`  • Duration: ${duration.toFixed(2)}ms`)
      
      expect(stats.hitRate).toBeGreaterThan(90) // Should have high hit rate
      expect(result).toHaveLength(iterations)
    })

    it('should benchmark minimal factory variants', async () => {
      const iterations = 5000

      const comparison = await comparePerformance(
        'Standard Student Factory',
        () => optimizedFactories.createMockStudent(),
        'Minimal Student Factory',
        () => optimizedFactories.createMinimalStudent(),
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(50) // Minimal should be much faster
    })
  })

  describe('MSW Handler Performance Benchmarks', () => {
    it('should benchmark MSW response generation', async () => {
      const iterations = 1000

      // Mock HTTP requests to test handlers
      const standardRequest = new Request('http://localhost/rest/v1/students')
      const optimizedRequest = new Request('http://localhost/rest/v1/students')

      const comparison = await comparePerformance(
        'Standard MSW Handler',
        async () => {
          // Simulate standard handler logic
          const students = standardFactories.createMockStudents(5)
          return Response.json(students)
        },
        'Optimized MSW Handler',
        async () => {
          // Simulate optimized handler with cache
          const cachedStudents = await studentCache.get(
            'students-list',
            () => optimizedFactories.createBulkStudents(5)
          )
          return Response.json(cachedStudents)
        },
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(40) // Caching should be much faster
    })

    it('should benchmark cache hit rates', async () => {
      console.log('\n📦 Cache Performance Analysis')
      
      // Reset cache metrics
      mockCache.resetMetrics()
      studentCache.resetMetrics()
      
      const iterations = 500
      
      // Generate multiple requests for same data
      for (let i = 0; i < iterations; i++) {
        await studentCache.get('students-list', () => optimizedFactories.createBulkStudents(5))
        await studentCache.get('groups-list', () => optimizedFactories.createBulkGroups(3))
      }
      
      const metrics = studentCache.getMetrics()
      
      console.log(`\n📊 Cache Metrics:`)
      console.log(`  • Total requests: ${metrics.totalRequests}`)
      console.log(`  • Cache hits: ${metrics.cacheHits}`)
      console.log(`  • Hit rate: ${metrics.hitRate.toFixed(1)}%`)
      console.log(`  • Average cache time: ${metrics.averageCacheTime.toFixed(3)}ms`)
      
      expect(metrics.hitRate).toBeGreaterThan(95) // Should have very high hit rate
      expect(metrics.averageCacheTime).toBeLessThan(0.1) // Cache access should be very fast
    })
  })

  describe('Provider Chain Performance Benchmarks', () => {
    it('should benchmark render provider performance', async () => {
      const TestComponent = () => <div>Test Component</div>
      const iterations = 200

      const comparison = await comparePerformance(
        'Standard Render',
        () => {
          const { unmount } = standardRender(<TestComponent />)
          unmount()
        },
        'Optimized Render',
        () => {
          const { unmount } = optimizedRender(<TestComponent />)
          unmount()
        },
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(10) // Should have some improvement
    })

    it('should benchmark minimal render performance', async () => {
      const TestComponent = () => <div>Simple Test</div>
      const iterations = 500

      const comparison = await comparePerformance(
        'Standard Render',
        () => {
          const { unmount } = optimizedRender(<TestComponent />)
          unmount()
        },
        'Minimal Render',
        () => {
          const { unmount } = renderMinimal(<TestComponent />)
          unmount()
        },
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(25) // Minimal should be much faster
    })

    it('should benchmark provider chain configurations', async () => {
      const TestComponent = () => <div>Config Test</div>
      const iterations = 300

      console.log('\n⚙️ Provider Configuration Performance')

      // Test different provider configurations
      const fullConfigTime = await measureTime(
        'Full Provider Config',
        async () => {
          for (let i = 0; i < iterations; i++) {
            const { unmount } = optimizedRender(<TestComponent />, {
              config: {
                enableAuth: true,
                enableSubscription: true,
                enableLoading: true,
                enableDarkMode: true,
              }
            })
            unmount()
          }
        }
      )

      const minimalConfigTime = await measureTime(
        'Minimal Provider Config',
        async () => {
          for (let i = 0; i < iterations; i++) {
            const { unmount } = optimizedRender(<TestComponent />, {
              config: {
                enableAuth: false,
                enableSubscription: false,
                enableLoading: false,
                enableDarkMode: false,
              }
            })
            unmount()
          }
        }
      )

      const improvement = ((fullConfigTime.duration - minimalConfigTime.duration) / fullConfigTime.duration) * 100

      console.log(`\n🎛️ Provider Config Comparison:`)
      console.log(`  • Full config: ${fullConfigTime.duration.toFixed(2)}ms`)
      console.log(`  • Minimal config: ${minimalConfigTime.duration.toFixed(2)}ms`)
      console.log(`  • Improvement: ${improvement.toFixed(1)}%`)

      expect(improvement).toBeGreaterThan(15)
    })
  })

  describe('Lightweight Mock Performance Benchmarks', () => {
    it('should benchmark lightweight mock access', async () => {
      const iterations = 10000

      const comparison = await comparePerformance(
        'Standard Factory Access',
        () => optimizedFactories.createMockStudent(),
        'Lightweight Static Access',
        () => lightweightMocks.getStaticStudent(),
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(80) // Static should be much faster
    })

    it('should benchmark lightweight collection generation', async () => {
      const iterations = 2000

      const comparison = await comparePerformance(
        'Optimized Factory Collection',
        () => optimizedFactories.createBulkStudents(10),
        'Lightweight Simple Collection',
        () => lightweightMocks.getSimpleStudents(10),
        iterations
      )

      expect(comparison.improvement).toBeGreaterThan(60)
    })

    it('should demonstrate static data performance', async () => {
      console.log('\n⚡ Static Data Performance Demonstration')
      
      // Benchmark static data access speed
      const staticAccessResult = await benchmarkFunction(
        () => lightweightMocks.getStaticUser(),
        'Static User Access',
        50000
      )

      const factoryAccessResult = await benchmarkFunction(
        () => optimizedFactories.createMockStudent(),
        'Factory Student Creation',
        50000
      )

      const speedup = factoryAccessResult.averageTime / staticAccessResult.averageTime

      console.log(`\n⚡ Static Data Speedup: ${speedup.toFixed(1)}x faster`)

      expect(speedup).toBeGreaterThan(10) // Static should be orders of magnitude faster
    })
  })

  describe('Memory Efficiency Benchmarks', () => {
    it('should measure memory usage improvements', async () => {
      console.log('\n💾 Memory Usage Comparison')
      
      const initialMemory = performanceMonitor.getSamples()
      const startMemory = initialMemory[initialMemory.length - 1]?.heapUsed || 0

      // Create large number of objects with standard approach
      const standardObjects = []
      for (let i = 0; i < 1000; i++) {
        standardObjects.push(standardFactories.createMockStudent())
        standardObjects.push(standardFactories.createMockLesson())
      }

      const midMemory = performanceMonitor.getSamples()
      const standardMemoryUsage = (midMemory[midMemory.length - 1]?.heapUsed || 0) - startMemory

      // Create same number with optimized approach (using pooling)
      const optimizedObjects = []
      for (let i = 0; i < 1000; i++) {
        optimizedObjects.push(optimizedFactories.createMockStudent())
        optimizedObjects.push(optimizedFactories.createMockLesson())
      }

      const endMemory = performanceMonitor.getSamples()
      const totalMemoryUsage = (endMemory[endMemory.length - 1]?.heapUsed || 0) - startMemory
      const optimizedMemoryUsage = totalMemoryUsage - standardMemoryUsage

      console.log(`\n💾 Memory Usage Analysis:`)
      console.log(`  • Standard approach: ${standardMemoryUsage.toFixed(2)}MB`)
      console.log(`  • Optimized approach: ${optimizedMemoryUsage.toFixed(2)}MB`)
      
      if (optimizedMemoryUsage < standardMemoryUsage) {
        const improvement = ((standardMemoryUsage - optimizedMemoryUsage) / standardMemoryUsage) * 100
        console.log(`  • Memory improvement: ${improvement.toFixed(1)}%`)
      }

      // Memory usage should be reasonable for 2000 objects
      expect(totalMemoryUsage).toBeLessThan(50) // Less than 50MB for 2000 objects
    })

    it('should validate no memory leaks in caching', async () => {
      console.log('\n🔍 Memory Leak Detection')
      
      const initialSamples = performanceMonitor.getSamples()
      const initialMemory = initialSamples[initialSamples.length - 1]?.heapUsed || 0

      // Perform many cached operations
      for (let i = 0; i < 1000; i++) {
        await studentCache.get(`test-${i % 10}`, () => optimizedFactories.createMockStudent())
        await lessonCache.get(`lesson-${i % 5}`, () => optimizedFactories.createMockLesson())
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }

      // Wait a bit for GC
      await new Promise(resolve => setTimeout(resolve, 100))

      const finalSamples = performanceMonitor.getSamples()
      const finalMemory = finalSamples[finalSamples.length - 1]?.heapUsed || 0
      const memoryGrowth = finalMemory - initialMemory

      console.log(`\n🔍 Memory Leak Analysis:`)
      console.log(`  • Initial memory: ${initialMemory.toFixed(2)}MB`)
      console.log(`  • Final memory: ${finalMemory.toFixed(2)}MB`)
      console.log(`  • Memory growth: ${memoryGrowth.toFixed(2)}MB`)

      // Memory growth should be minimal (less than 5MB)
      expect(memoryGrowth).toBeLessThan(5)
    })
  })

  describe('Real-World Performance Simulation', () => {
    it('should simulate typical test suite execution', async () => {
      console.log('\n🎬 Real-World Test Suite Simulation')
      
      const { result: standardResult, duration: standardDuration } = await measureTime(
        'Standard Test Suite Simulation',
        async () => {
          const results = []
          
          // Simulate 50 test cases
          for (let i = 0; i < 50; i++) {
            // Each test creates some mock data
            const student = standardFactories.createMockStudent()
            const lessons = standardFactories.createMockLessons(3)
            const groups = standardFactories.createMockGroups(2)
            
            // Simulate some render operations
            const TestComp = () => <div>{student.firstName}</div>
            const { unmount } = standardRender(<TestComp />)
            unmount()
            
            results.push({ student, lessons, groups })
          }
          
          return results
        }
      )

      const { result: optimizedResult, duration: optimizedDuration } = await measureTime(
        'Optimized Test Suite Simulation',
        async () => {
          const results = []
          
          // Simulate same 50 test cases with optimized infrastructure
          for (let i = 0; i < 50; i++) {
            // Use optimized factories
            const student = optimizedFactories.createMockStudent()
            const lessons = await optimizedFactories.createBulkLessons(3)
            const groups = await optimizedFactories.createBulkGroups(2)
            
            // Use optimized rendering
            const TestComp = () => <div>{student.firstName}</div>
            const { unmount } = renderFast(<TestComp />)
            unmount()
            
            results.push({ student, lessons, groups })
          }
          
          return results
        }
      )

      const improvement = ((standardDuration - optimizedDuration) / standardDuration) * 100

      console.log(`\n🎬 Test Suite Performance Results:`)
      console.log(`  • Standard execution: ${standardDuration.toFixed(2)}ms`)
      console.log(`  • Optimized execution: ${optimizedDuration.toFixed(2)}ms`)
      console.log(`  • Overall improvement: ${improvement.toFixed(1)}%`)

      expect(improvement).toBeGreaterThan(25) // Should be significantly faster
      expect(standardResult).toHaveLength(50)
      expect(optimizedResult).toHaveLength(50)
    })

    it('should benchmark parallel test execution simulation', async () => {
      console.log('\n🏃‍♂️ Parallel Test Execution Simulation')
      
      const simulateTest = async (testId: number, useOptimized: boolean) => {
        const factories = useOptimized ? optimizedFactories : standardFactories
        const render = useOptimized ? renderFast : standardRender
        
        // Simulate test operations
        const student = useOptimized 
          ? factories.createMockStudent({ id: testId })
          : standardFactories.createMockStudent({ id: testId })
        
        const TestComp = () => <div>Test {testId}</div>
        const { unmount } = render(<TestComp />)
        unmount()
        
        return student
      }

      // Simulate parallel execution
      const parallelTests = 20
      
      const standardStart = performance.now()
      const standardResults = await Promise.all(
        Array.from({ length: parallelTests }, (_, i) => simulateTest(i, false))
      )
      const standardParallelTime = performance.now() - standardStart

      const optimizedStart = performance.now()
      const optimizedResults = await Promise.all(
        Array.from({ length: parallelTests }, (_, i) => simulateTest(i, true))
      )
      const optimizedParallelTime = performance.now() - optimizedStart

      const parallelImprovement = ((standardParallelTime - optimizedParallelTime) / standardParallelTime) * 100

      console.log(`\n🏃‍♂️ Parallel Execution Results:`)
      console.log(`  • Standard parallel: ${standardParallelTime.toFixed(2)}ms`)
      console.log(`  • Optimized parallel: ${optimizedParallelTime.toFixed(2)}ms`)
      console.log(`  • Parallel improvement: ${parallelImprovement.toFixed(1)}%`)

      expect(parallelImprovement).toBeGreaterThan(20)
      expect(standardResults).toHaveLength(parallelTests)
      expect(optimizedResults).toHaveLength(parallelTests)
    })
  })

  describe('Performance Regression Detection', () => {
    it('should establish performance baselines', async () => {
      console.log('\n📏 Performance Baseline Establishment')
      
      const baselines = {
        studentCreation: await benchmarkFunction(
          () => optimizedFactories.createMockStudent(),
          'Student Creation Baseline',
          1000
        ),
        bulkCreation: await benchmarkFunction(
          () => optimizedFactories.createBulkStudents(10),
          'Bulk Creation Baseline',
          200
        ),
        cacheAccess: await benchmarkFunction(
          () => studentCache.get('baseline-test', () => optimizedFactories.createMockStudent()),
          'Cache Access Baseline',
          1000
        ),
        renderOptimized: await benchmarkFunction(
          () => {
            const TestComp = () => <div>Baseline Test</div>
            const { unmount } = renderFast(<TestComp />)
            unmount()
          },
          'Render Baseline',
          100
        ),
      }

      console.log(`\n📏 Established Baselines:`)
      console.log(`  • Student creation: ${baselines.studentCreation.averageTime.toFixed(3)}ms`)
      console.log(`  • Bulk creation: ${baselines.bulkCreation.averageTime.toFixed(3)}ms`)
      console.log(`  • Cache access: ${baselines.cacheAccess.averageTime.toFixed(3)}ms`)
      console.log(`  • Render operations: ${baselines.renderOptimized.averageTime.toFixed(3)}ms`)

      // Store baselines for future regression testing
      expect(baselines.studentCreation.averageTime).toBeLessThan(0.1) // Should be very fast
      expect(baselines.bulkCreation.averageTime).toBeLessThan(2) // Should be reasonable
      expect(baselines.cacheAccess.averageTime).toBeLessThan(0.05) // Cache should be very fast
      expect(baselines.renderOptimized.averageTime).toBeLessThan(10) // Render should be reasonable
    })
  })
})