import { test, expect } from '@playwright/test'
import {
  getMemoryInfo,
  forceGarbageCollection,
  waitForPageLoad,
  performanceAssertions,
  createPerformanceReport,
  type MemoryInfo,
} from './helpers/performanceHelpers'

/**
 * Memory Usage and Leak Detection Tests
 *
 * These tests monitor memory usage patterns, detect potential memory leaks,
 * and establish baselines for memory consumption during normal application usage.
 */

test.describe('Memory Usage Monitoring', () => {
  test.use({
    storageState: 'tests/performance/.auth/user.json',
  })

  let performanceReports: string[] = []

  test.afterAll(async () => {
    const consolidatedReport = {
      testSuite: 'Memory Usage Monitoring',
      timestamp: new Date().toISOString(),
      reports: performanceReports,
    }

    console.log('\n📊 MEMORY USAGE PERFORMANCE REPORT')
    console.log('===================================')
    console.log(JSON.stringify(consolidatedReport, null, 2))
  })

  test('baseline memory usage', async ({ page }) => {
    console.log('🧠 Establishing baseline memory usage...')

    // Navigate to dashboard and wait for full load
    await page.goto('/')
    await waitForPageLoad(page)

    await expect(
      page.getByRole('heading', { name: 'Quick Links' }),
    ).toBeVisible()

    // Force garbage collection to get clean baseline
    await forceGarbageCollection(page)
    await page.waitForTimeout(2000)

    // Get baseline memory info
    const baselineMemory = await getMemoryInfo(page)

    const report = createPerformanceReport('Baseline Memory Usage', {} as any, {
      memoryInfo: baselineMemory,
      usedMB: Math.round(baselineMemory.usedJSHeapSize / (1024 * 1024)),
      totalMB: Math.round(baselineMemory.totalJSHeapSize / (1024 * 1024)),
      limitMB: Math.round(baselineMemory.jsHeapSizeLimit / (1024 * 1024)),
      page: 'Dashboard',
    })
    performanceReports.push(report)

    // Baseline assertions (establish acceptable memory usage)
    performanceAssertions.expectMemoryWithin(baselineMemory, 100) // Under 100MB for dashboard

    console.log(
      `✅ Baseline memory usage: ${Math.round(
        baselineMemory.usedJSHeapSize / (1024 * 1024),
      )}MB`,
    )
    console.log(
      `   Total heap: ${Math.round(
        baselineMemory.totalJSHeapSize / (1024 * 1024),
      )}MB`,
    )
    console.log(
      `   Heap limit: ${Math.round(
        baselineMemory.jsHeapSizeLimit / (1024 * 1024),
      )}MB`,
    )
  })

  test('memory usage during navigation', async ({ page }) => {
    console.log('🔄 Testing memory usage during navigation...')

    await page.goto('/')
    await waitForPageLoad(page)

    // Force initial garbage collection
    await forceGarbageCollection(page)
    const initialMemory = await getMemoryInfo(page)

    const memorySnapshots: Array<{
      page: string
      memory: MemoryInfo
      usedMB: number
      growth: number
    }> = []

    const pages = [
      {
        name: 'Dashboard',
        action: async () => {
          await page.getByRole('link', { name: 'Dashboard' }).click()
          await expect(
            page.getByRole('heading', { name: 'Quick Links' }),
          ).toBeVisible()
        },
      },
      {
        name: 'Lessons',
        action: async () => {
          await page.getByTestId('lesson-nav-sidebar').click()
          await expect(
            page.getByRole('heading', { name: 'notizen' }),
          ).toBeVisible()
        },
      },
      {
        name: 'Students',
        action: async () => {
          await page.getByRole('link', { name: 'Schüler' }).click()
          await expect(
            page.getByRole('heading', { name: 'Active students' }),
          ).toBeVisible()
        },
      },
      {
        name: 'Settings',
        action: async () => {
          await page.getByRole('link', { name: 'Settings' }).click()
          await expect(
            page.getByRole('heading', { name: 'Profile' }),
          ).toBeVisible()
        },
      },
    ]

    for (const pageInfo of pages) {
      await pageInfo.action()
      await waitForPageLoad(page)
      await page.waitForTimeout(2000) // Let memory stabilize

      const currentMemory = await getMemoryInfo(page)
      const usedMB = Math.round(currentMemory.usedJSHeapSize / (1024 * 1024))
      const growth = currentMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      const growthMB = Math.round(growth / (1024 * 1024))

      memorySnapshots.push({
        page: pageInfo.name,
        memory: currentMemory,
        usedMB,
        growth: growthMB,
      })

      console.log(
        `   ${pageInfo.name}: ${usedMB}MB (${
          growthMB >= 0 ? '+' : ''
        }${growthMB}MB)`,
      )
    }

    const report = createPerformanceReport(
      'Navigation Memory Usage',
      {} as any,
      {
        initialMemoryMB: Math.round(
          initialMemory.usedJSHeapSize / (1024 * 1024),
        ),
        memorySnapshots,
        maxUsedMB: Math.max(...memorySnapshots.map((s) => s.usedMB)),
        totalGrowthMB: memorySnapshots[memorySnapshots.length - 1]?.growth || 0,
      },
    )
    performanceReports.push(report)

    // Memory growth assertions
    const maxGrowth = Math.max(...memorySnapshots.map((s) => s.growth))
    expect(maxGrowth).toBeLessThan(50 * 1024 * 1024) // Less than 50MB growth during navigation

    console.log(
      `✅ Max memory growth during navigation: ${Math.round(
        maxGrowth / (1024 * 1024),
      )}MB`,
    )
  })

  test('memory leak detection through repeated navigation', async ({
    page,
  }) => {
    console.log('🕵️ Testing for memory leaks through repeated navigation...')

    await page.goto('/')
    await waitForPageLoad(page)

    // Force garbage collection and get baseline
    await forceGarbageCollection(page)
    await page.waitForTimeout(2000)
    const initialMemory = await getMemoryInfo(page)

    const memoryReadings: Array<{
      iteration: number
      memory: MemoryInfo
      usedMB: number
      growthMB: number
    }> = []

    // Perform repeated navigation cycles
    const navigationCycles = 5

    for (let cycle = 1; cycle <= navigationCycles; cycle++) {
      console.log(`   Navigation cycle ${cycle}/${navigationCycles}...`)

      // Navigate through key pages
      await page.getByTestId('lesson-nav-sidebar').click()
      await waitForPageLoad(page)

      await page.getByRole('link', { name: 'Schüler' }).click()
      await waitForPageLoad(page)

      await page.getByRole('link', { name: 'Dashboard' }).click()
      await waitForPageLoad(page)

      // Force garbage collection between cycles
      await forceGarbageCollection(page)
      await page.waitForTimeout(3000) // Let memory stabilize

      const currentMemory = await getMemoryInfo(page)
      const usedMB = Math.round(currentMemory.usedJSHeapSize / (1024 * 1024))
      const growthMB = Math.round(
        (currentMemory.usedJSHeapSize - initialMemory.usedJSHeapSize) /
          (1024 * 1024),
      )

      memoryReadings.push({
        iteration: cycle,
        memory: currentMemory,
        usedMB,
        growthMB,
      })

      console.log(
        `     After cycle ${cycle}: ${usedMB}MB (${
          growthMB >= 0 ? '+' : ''
        }${growthMB}MB)`,
      )
    }

    const report = createPerformanceReport('Memory Leak Detection', {} as any, {
      initialMemoryMB: Math.round(initialMemory.usedJSHeapSize / (1024 * 1024)),
      navigationCycles,
      memoryReadings,
      finalGrowthMB: memoryReadings[memoryReadings.length - 1]?.growthMB || 0,
      averageGrowthPerCycleMB:
        memoryReadings.length > 0
          ? (memoryReadings[memoryReadings.length - 1]?.growthMB || 0) /
            navigationCycles
          : 0,
    })
    performanceReports.push(report)

    // Memory leak assertions
    const finalGrowthMB =
      memoryReadings[memoryReadings.length - 1]?.growthMB || 0
    const averageGrowthPerCycle = finalGrowthMB / navigationCycles

    // Assert that memory growth is reasonable (not leaking significantly)
    expect(finalGrowthMB).toBeLessThan(30) // Less than 30MB total growth after 5 cycles
    expect(averageGrowthPerCycle).toBeLessThan(8) // Less than 8MB average growth per cycle

    console.log(
      `✅ Final memory growth: ${finalGrowthMB}MB (${averageGrowthPerCycle.toFixed(
        1,
      )}MB per cycle)`,
    )

    if (finalGrowthMB > 20) {
      console.log(
        '⚠️ Warning: Significant memory growth detected - potential memory leak',
      )
    }
  })

  test('memory usage with large datasets', async ({ page }) => {
    console.log('📊 Testing memory usage with large datasets...')

    await page.goto('/')
    await waitForPageLoad(page)

    // Get baseline memory
    await forceGarbageCollection(page)
    const baselineMemory = await getMemoryInfo(page)

    const datasetSizes = [100, 500, 1000]
    const datasetMemoryUsage: Array<{
      size: number
      memory: MemoryInfo
      usedMB: number
      growthMB: number
    }> = []

    for (const size of datasetSizes) {
      console.log(`   Testing with ${size} lessons...`)

      // Create large dataset
      await page.evaluate((lessonCount) => {
        const mockLessons = Array.from({ length: lessonCount }, (_, i) => ({
          id: `lesson-${i + 1}`,
          title: `Performance Test Lesson ${i + 1}`,
          description: `Test description ${i + 1}`.repeat(10), // Larger description
          date: new Date().toISOString(),
          student_id: `student-${(i % 20) + 1}`,
          notes: `Test notes ${i + 1}`.repeat(20), // Larger notes
        }))

        sessionStorage.setItem(
          'performance_test_lessons',
          JSON.stringify(mockLessons),
        )
      }, size)

      // Navigate to all lessons to load the data
      await page.getByTestId('lesson-nav-sidebar').click()
      await waitForPageLoad(page)

      await page.getByRole('link', { name: 'Alle Lektionen' }).click()
      await waitForPageLoad(page)

      // Wait for data to be rendered
      await expect(page.getByRole('table')).toBeVisible()
      await page.waitForTimeout(3000) // Let memory stabilize

      const currentMemory = await getMemoryInfo(page)
      const usedMB = Math.round(currentMemory.usedJSHeapSize / (1024 * 1024))
      const growthMB = Math.round(
        (currentMemory.usedJSHeapSize - baselineMemory.usedJSHeapSize) /
          (1024 * 1024),
      )

      datasetMemoryUsage.push({
        size,
        memory: currentMemory,
        usedMB,
        growthMB,
      })

      console.log(
        `     ${size} lessons: ${usedMB}MB (${
          growthMB >= 0 ? '+' : ''
        }${growthMB}MB)`,
      )

      // Clear dataset for next test
      await page.evaluate(() => {
        sessionStorage.removeItem('performance_test_lessons')
      })
    }

    const report = createPerformanceReport(
      'Large Dataset Memory Usage',
      {} as any,
      {
        baselineMemoryMB: Math.round(
          baselineMemory.usedJSHeapSize / (1024 * 1024),
        ),
        datasetMemoryUsage,
        maxGrowthMB: Math.max(...datasetMemoryUsage.map((d) => d.growthMB)),
        memoryEfficiency: {
          '100lessons': datasetMemoryUsage[0]?.growthMB || 0,
          '500lessons': datasetMemoryUsage[1]?.growthMB || 0,
          '1000lessons': datasetMemoryUsage[2]?.growthMB || 0,
        },
      },
    )
    performanceReports.push(report)

    // Memory usage assertions for large datasets
    const maxGrowth = Math.max(...datasetMemoryUsage.map((d) => d.growthMB))
    expect(maxGrowth).toBeLessThan(200) // Less than 200MB growth for largest dataset

    console.log(`✅ Max memory growth with large datasets: ${maxGrowth}MB`)
  })

  test('component cleanup memory test', async ({ page }) => {
    console.log('🧹 Testing component cleanup and memory release...')

    await page.goto('/')
    await waitForPageLoad(page)

    // Get initial memory state
    await forceGarbageCollection(page)
    const initialMemory = await getMemoryInfo(page)

    const cleanupTests: Array<{
      component: string
      beforeMB: number
      afterMB: number
      cleanupMB: number
    }> = []

    // Test lesson planning component cleanup
    console.log('   Testing lesson planning component...')

    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)

    // Wait for component to fully load
    await expect(page.getByRole('heading', { name: 'notizen' })).toBeVisible()
    await page.waitForTimeout(2000)

    const beforeNavAway = await getMemoryInfo(page)

    // Navigate away to trigger component cleanup
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await waitForPageLoad(page)
    await expect(
      page.getByRole('heading', { name: 'Quick Links' }),
    ).toBeVisible()

    // Force garbage collection to ensure cleanup
    await forceGarbageCollection(page)
    await page.waitForTimeout(3000)

    const afterNavAway = await getMemoryInfo(page)

    cleanupTests.push({
      component: 'Lesson Planning',
      beforeMB: Math.round(beforeNavAway.usedJSHeapSize / (1024 * 1024)),
      afterMB: Math.round(afterNavAway.usedJSHeapSize / (1024 * 1024)),
      cleanupMB: Math.round(
        (beforeNavAway.usedJSHeapSize - afterNavAway.usedJSHeapSize) /
          (1024 * 1024),
      ),
    })

    // Test students component cleanup
    console.log('   Testing students component...')

    await page.getByRole('link', { name: 'Schüler' }).click()
    await waitForPageLoad(page)
    await expect(
      page.getByRole('heading', { name: 'Active students' }),
    ).toBeVisible()
    await page.waitForTimeout(2000)

    const beforeStudentsNavAway = await getMemoryInfo(page)

    await page.getByRole('link', { name: 'Dashboard' }).click()
    await waitForPageLoad(page)
    await forceGarbageCollection(page)
    await page.waitForTimeout(3000)

    const afterStudentsNavAway = await getMemoryInfo(page)

    cleanupTests.push({
      component: 'Students',
      beforeMB: Math.round(
        beforeStudentsNavAway.usedJSHeapSize / (1024 * 1024),
      ),
      afterMB: Math.round(afterStudentsNavAway.usedJSHeapSize / (1024 * 1024)),
      cleanupMB: Math.round(
        (beforeStudentsNavAway.usedJSHeapSize -
          afterStudentsNavAway.usedJSHeapSize) /
          (1024 * 1024),
      ),
    })

    const report = createPerformanceReport(
      'Component Cleanup Memory Test',
      {} as any,
      {
        initialMemoryMB: Math.round(
          initialMemory.usedJSHeapSize / (1024 * 1024),
        ),
        cleanupTests,
        averageCleanupMB:
          cleanupTests.reduce((sum, test) => sum + test.cleanupMB, 0) /
          cleanupTests.length,
      },
    )
    performanceReports.push(report)

    // Component cleanup assertions
    cleanupTests.forEach((test) => {
      console.log(
        `     ${test.component}: ${test.beforeMB}MB → ${test.afterMB}MB (${
          test.cleanupMB >= 0 ? '+' : ''
        }${test.cleanupMB}MB)`,
      )

      // Assert that components don't cause significant memory growth
      expect(test.cleanupMB).toBeGreaterThan(-20) // Allow up to 20MB cleanup
    })

    console.log(`✅ Component cleanup tests completed`)
  })
})
