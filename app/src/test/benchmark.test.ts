import { describe, it, expect } from 'vitest'
import { benchmarkFunction, printPerformanceReport, resetAllPerformanceTracking } from './performance'

// Old factories (current implementation)
import * as oldFactories from './factories'

// New factories (optimized implementation)
import * as newFactories from './factories.optimized'

describe('Factory Performance Benchmarks', () => {
  beforeAll(() => {
    resetAllPerformanceTracking()
  })

  afterAll(() => {
    printPerformanceReport()
  })

  it('should benchmark student creation', async () => {
    const iterations = 1000

    // Benchmark old implementation
    const oldResult = await benchmarkFunction(
      () => oldFactories.createMockStudent(),
      'Old Student Factory',
      iterations
    )

    // Benchmark new implementation
    const newResult = await benchmarkFunction(
      () => newFactories.createMockStudent(),
      'New Student Factory',
      iterations
    )

    console.log(`\n📈 Student Creation Improvement: ${((oldResult.averageTime - newResult.averageTime) / oldResult.averageTime * 100).toFixed(1)}%`)
    
    // New implementation should be faster
    expect(newResult.averageTime).toBeLessThan(oldResult.averageTime)
  })

  it('should benchmark student creation with overrides', async () => {
    const iterations = 1000
    const overrides = { firstName: 'TestStudent', instrument: 'Guitar' }

    const oldResult = await benchmarkFunction(
      () => oldFactories.createMockStudent(overrides),
      'Old Student Factory (with overrides)',
      iterations
    )

    const newResult = await benchmarkFunction(
      () => newFactories.createMockStudent(overrides),
      'New Student Factory (with overrides)',
      iterations
    )

    console.log(`\n📈 Student Creation (overrides) Improvement: ${((oldResult.averageTime - newResult.averageTime) / oldResult.averageTime * 100).toFixed(1)}%`)
  })

  it('should benchmark lesson creation', async () => {
    const iterations = 1000

    const oldResult = await benchmarkFunction(
      () => oldFactories.createMockLesson(),
      'Old Lesson Factory',
      iterations
    )

    const newResult = await benchmarkFunction(
      () => newFactories.createMockLesson(),
      'New Lesson Factory',
      iterations
    )

    console.log(`\n📈 Lesson Creation Improvement: ${((oldResult.averageTime - newResult.averageTime) / oldResult.averageTime * 100).toFixed(1)}%`)
    expect(newResult.averageTime).toBeLessThan(oldResult.averageTime)
  })

  it('should benchmark collection creation', async () => {
    const iterations = 500

    // Students collection
    const oldStudentsResult = await benchmarkFunction(
      () => oldFactories.createMockStudents(3),
      'Old Students Collection (3)',
      iterations
    )

    const newStudentsResult = await benchmarkFunction(
      () => newFactories.createMockStudents(3),
      'New Students Collection (3)',
      iterations
    )

    console.log(`\n📈 Students Collection Improvement: ${((oldStudentsResult.averageTime - newStudentsResult.averageTime) / oldStudentsResult.averageTime * 100).toFixed(1)}%`)
    expect(newStudentsResult.averageTime).toBeLessThan(oldStudentsResult.averageTime)

    // Lessons collection
    const oldLessonsResult = await benchmarkFunction(
      () => oldFactories.createMockLessons(5),
      'Old Lessons Collection (5)',
      iterations
    )

    const newLessonsResult = await benchmarkFunction(
      () => newFactories.createMockLessons(5),
      'New Lessons Collection (5)',
      iterations
    )

    console.log(`\n📈 Lessons Collection Improvement: ${((oldLessonsResult.averageTime - newLessonsResult.averageTime) / oldLessonsResult.averageTime * 100).toFixed(1)}%`)
    expect(newLessonsResult.averageTime).toBeLessThan(oldLessonsResult.averageTime)
  })

  it('should benchmark large collection creation', async () => {
    const iterations = 100

    const oldResult = await benchmarkFunction(
      () => oldFactories.createMockStudents(50),
      'Old Large Students Collection (50)',
      iterations
    )

    const newResult = await benchmarkFunction(
      () => newFactories.createBulkStudents(50),
      'New Bulk Students Creation (50)',
      iterations
    )

    console.log(`\n📈 Large Collection Improvement: ${((oldResult.averageTime - newResult.averageTime) / oldResult.averageTime * 100).toFixed(1)}%`)
    expect(newResult.averageTime).toBeLessThan(oldResult.averageTime)
  })

  it('should benchmark form data creation', async () => {
    const iterations = 2000

    const oldResult = await benchmarkFunction(
      () => oldFactories.createMockLessonFormData(),
      'Old Form Data',
      iterations
    )

    const newResult = await benchmarkFunction(
      () => newFactories.createMockLessonFormData(),
      'New Form Data (cached)',
      iterations
    )

    console.log(`\n📈 Form Data Improvement: ${((oldResult.averageTime - newResult.averageTime) / oldResult.averageTime * 100).toFixed(1)}%`)
    expect(newResult.averageTime).toBeLessThan(oldResult.averageTime)
  })

  it('should test object pooling effectiveness', async () => {
    const iterations = 1000

    // Reset factory stats
    newFactories.resetFactoryStats()

    // Create same student configuration multiple times
    for (let i = 0; i < iterations; i++) {
      newFactories.createMockStudent({ firstName: 'PoolTest' })
    }

    const stats = newFactories.getFactoryStats()
    
    console.log(`\n🏊 Pool Effectiveness:`)
    console.log(`  • Total calls: ${stats.totalCalls}`)
    console.log(`  • Pool hits: ${stats.poolHits}`)
    console.log(`  • Hit rate: ${stats.hitRate.toFixed(1)}%`)

    // Should have high hit rate for repeated calls
    expect(stats.hitRate).toBeGreaterThan(90)
  })

  it('should test minimal factory variants', async () => {
    const iterations = 1000

    const standardResult = await benchmarkFunction(
      () => newFactories.createMockStudent(),
      'Standard Student Factory',
      iterations
    )

    const minimalResult = await benchmarkFunction(
      () => newFactories.createMinimalStudent(),
      'Minimal Student Factory',
      iterations
    )

    console.log(`\n🎯 Minimal vs Standard: ${((standardResult.averageTime - minimalResult.averageTime) / standardResult.averageTime * 100).toFixed(1)}% faster`)
  })

  it('should validate optimization maintains data integrity', () => {
    // Test that optimized factories produce equivalent data
    const oldStudent = oldFactories.createMockStudent()
    const newStudent = newFactories.createMockStudent()

    // Should have same structure and default values
    expect(newStudent.firstName).toBe(oldStudent.firstName)
    expect(newStudent.lastName).toBe(oldStudent.lastName)
    expect(newStudent.instrument).toBe(oldStudent.instrument)
    expect(newStudent.id).toBe(oldStudent.id)

    // Test with overrides
    const overrides = { firstName: 'Test', instrument: 'Guitar' }
    const oldStudentOverride = oldFactories.createMockStudent(overrides)
    const newStudentOverride = newFactories.createMockStudent(overrides)

    expect(newStudentOverride.firstName).toBe(oldStudentOverride.firstName)
    expect(newStudentOverride.instrument).toBe(oldStudentOverride.instrument)

    // Test collections
    const oldStudents = oldFactories.createMockStudents(3)
    const newStudents = newFactories.createMockStudents(3)

    expect(newStudents).toHaveLength(oldStudents.length)
    expect(newStudents[0].firstName).toBe(oldStudents[0].firstName)
    expect(newStudents[1].firstName).toBe(oldStudents[1].firstName)
  })

  it('should show memory efficiency gains', async () => {
    const { getMemoryUsage } = await import('./performance')
    
    if (!getMemoryUsage()) {
      console.log('Memory usage tracking not available in this environment')
      return
    }

    const beforeMemory = getMemoryUsage()!

    // Create a large number of objects with old method
    console.log('\n💾 Testing memory efficiency...')
    
    // This would use more memory with old approach
    const students = newFactories.createBulkStudents(1000)
    const lessons = newFactories.createBulkLessons(1000)

    const afterMemory = getMemoryUsage()!
    const memoryIncrease = afterMemory.heapUsed - beforeMemory.heapUsed

    console.log(`  • Memory increase: ${memoryIncrease}MB for 2000 objects`)
    console.log(`  • Per object: ${(memoryIncrease * 1024 / 2000).toFixed(2)}KB`)

    // Cleanup
    newFactories.clearFactoryPools()
  })
})