import { test, expect } from '@playwright/test'
import {
  collectPerformanceMetrics,
  waitForPageLoad,
  createLargeDataset,
  measureRenderTime,
  performanceAssertions,
  createPerformanceReport,
  type PerformanceMetrics
} from './helpers/performanceHelpers'

/**
 * Large Dataset Performance Tests
 * 
 * These tests evaluate application performance when handling large amounts of data,
 * specifically testing with 100+, 500+, and 1000+ lessons to establish performance
 * baselines and identify potential bottlenecks.
 */

test.describe('Large Dataset Performance', () => {
  test.use({ 
    storageState: 'tests/performance/.auth/user.json'
  })

  let performanceReports: string[] = []

  test.afterAll(async () => {
    const consolidatedReport = {
      testSuite: 'Large Dataset Performance',
      timestamp: new Date().toISOString(),
      reports: performanceReports
    }
    
    console.log('\n📊 LARGE DATASET PERFORMANCE REPORT')
    console.log('====================================')
    console.log(JSON.stringify(consolidatedReport, null, 2))
  })

  test('performance with 100 lessons', async ({ page }) => {
    console.log('📚 Testing performance with 100 lessons...')

    // Navigate to lessons page
    await page.goto('/')
    await waitForPageLoad(page)
    
    // Create mock dataset
    await createLargeDataset(page, 100)
    
    const startTime = Date.now()
    
    // Navigate to All Lessons page
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Alle Lektionen' }).click()
    await waitForPageLoad(page)
    
    // Wait for table to be visible
    await expect(page.getByRole('table')).toBeVisible()
    
    // Measure table rendering time
    const tableRenderTime = await measureRenderTime(page, '[role="table"]')
    
    const endTime = Date.now()
    const totalTime = endTime - startTime

    // Collect performance metrics
    const metrics = await collectPerformanceMetrics(page)
    
    // Count visible rows (for verification)
    const visibleRows = await page.locator('tbody tr').count()
    
    const report = createPerformanceReport('100 Lessons Performance', metrics, {
      datasetSize: 100,
      tableRenderTime,
      totalTime,
      visibleRows,
      rowsPerSecond: visibleRows / (totalTime / 1000)
    })
    performanceReports.push(report)

    // Performance assertions (baseline establishment)
    expect(totalTime).toBeLessThan(20000) // 20 seconds max for 100 lessons
    expect(tableRenderTime).toBeLessThan(5000) // 5 seconds max for table render
    performanceAssertions.expectTTIWithin(metrics, 25000) // 25 seconds max

    console.log(`✅ 100 lessons loaded in ${totalTime}ms`)
    console.log(`   Table render: ${Math.round(tableRenderTime)}ms`)
    console.log(`   Visible rows: ${visibleRows}`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('performance with 500 lessons', async ({ page }) => {
    console.log('📚 Testing performance with 500 lessons...')

    await page.goto('/')
    await waitForPageLoad(page)
    
    await createLargeDataset(page, 500)
    
    const startTime = Date.now()
    
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Alle Lektionen' }).click()
    await waitForPageLoad(page)
    
    await expect(page.getByRole('table')).toBeVisible()
    
    const tableRenderTime = await measureRenderTime(page, '[role="table"]')
    
    const endTime = Date.now()
    const totalTime = endTime - startTime

    const metrics = await collectPerformanceMetrics(page)
    const visibleRows = await page.locator('tbody tr').count()
    
    const report = createPerformanceReport('500 Lessons Performance', metrics, {
      datasetSize: 500,
      tableRenderTime,
      totalTime,
      visibleRows,
      rowsPerSecond: visibleRows / (totalTime / 1000)
    })
    performanceReports.push(report)

    // Performance assertions (expect slower performance with larger dataset)
    expect(totalTime).toBeLessThan(40000) // 40 seconds max for 500 lessons
    expect(tableRenderTime).toBeLessThan(10000) // 10 seconds max for table render
    performanceAssertions.expectTTIWithin(metrics, 45000) // 45 seconds max

    console.log(`✅ 500 lessons loaded in ${totalTime}ms`)
    console.log(`   Table render: ${Math.round(tableRenderTime)}ms`)
    console.log(`   Visible rows: ${visibleRows}`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('performance with 1000 lessons', async ({ page }) => {
    console.log('📚 Testing performance with 1000 lessons...')

    await page.goto('/')
    await waitForPageLoad(page)
    
    await createLargeDataset(page, 1000)
    
    const startTime = Date.now()
    
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Alle Lektionen' }).click()
    await waitForPageLoad(page)
    
    await expect(page.getByRole('table')).toBeVisible()
    
    const tableRenderTime = await measureRenderTime(page, '[role="table"]')
    
    const endTime = Date.now()
    const totalTime = endTime - startTime

    const metrics = await collectPerformanceMetrics(page)
    const visibleRows = await page.locator('tbody tr').count()
    
    const report = createPerformanceReport('1000 Lessons Performance', metrics, {
      datasetSize: 1000,
      tableRenderTime,
      totalTime,
      visibleRows,
      rowsPerSecond: visibleRows / (totalTime / 1000)
    })
    performanceReports.push(report)

    // Performance assertions (expect significantly slower performance)
    expect(totalTime).toBeLessThan(60000) // 60 seconds max for 1000 lessons
    expect(tableRenderTime).toBeLessThan(20000) // 20 seconds max for table render
    performanceAssertions.expectTTIWithin(metrics, 70000) // 70 seconds max

    console.log(`✅ 1000 lessons loaded in ${totalTime}ms`)
    console.log(`   Table render: ${Math.round(tableRenderTime)}ms`)
    console.log(`   Visible rows: ${visibleRows}`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('pagination performance with large dataset', async ({ page }) => {
    console.log('📄 Testing pagination performance...')

    await page.goto('/')
    await waitForPageLoad(page)
    
    await createLargeDataset(page, 500) // Use 500 lessons for pagination testing
    
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Alle Lektionen' }).click()
    await waitForPageLoad(page)
    
    await expect(page.getByRole('table')).toBeVisible()
    
    const paginationTimes: Array<{page: number, time: number}> = []
    
    // Test pagination through first few pages
    for (let pageNum = 1; pageNum <= 3; pageNum++) {
      const startTime = Date.now()
      
      // Look for pagination controls
      const nextButton = page.locator('[aria-label="Go to next page"], button:has-text("Next")')
      
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await waitForPageLoad(page)
        
        // Wait for table update
        await expect(page.getByRole('table')).toBeVisible()
        
        const endTime = Date.now()
        const paginationTime = endTime - startTime
        
        paginationTimes.push({ page: pageNum, time: paginationTime })
        
        console.log(`   Page ${pageNum + 1} navigation: ${paginationTime}ms`)
      } else {
        break // No more pages
      }
    }

    const metrics = await collectPerformanceMetrics(page)
    
    const report = createPerformanceReport('Pagination Performance', metrics, {
      datasetSize: 500,
      paginationTimes,
      averagePaginationTime: paginationTimes.length > 0 
        ? paginationTimes.reduce((sum, p) => sum + p.time, 0) / paginationTimes.length 
        : 0
    })
    performanceReports.push(report)

    // Assert pagination performance
    if (paginationTimes.length > 0) {
      const avgPaginationTime = paginationTimes.reduce((sum, p) => sum + p.time, 0) / paginationTimes.length
      expect(avgPaginationTime).toBeLessThan(5000) // 5 seconds max per page navigation
      
      console.log(`✅ Average pagination time: ${Math.round(avgPaginationTime)}ms`)
    }
  })

  test('search performance with large dataset', async ({ page }) => {
    console.log('🔍 Testing search performance...')

    await page.goto('/')
    await waitForPageLoad(page)
    
    await createLargeDataset(page, 1000) // Use 1000 lessons for search testing
    
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Alle Lektionen' }).click()
    await waitForPageLoad(page)
    
    await expect(page.getByRole('table')).toBeVisible()
    
    // Test search functionality if available
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="Suche"]').first()
    
    if (await searchInput.isVisible()) {
      const searchTimes: Array<{query: string, time: number, results: number}> = []
      const searchQueries = ['Performance', 'Test', 'Lesson 100', 'Piano']
      
      for (const query of searchQueries) {
        const startTime = Date.now()
        
        await searchInput.fill(query)
        await page.waitForTimeout(1000) // Wait for search to process
        
        const endTime = Date.now()
        const searchTime = endTime - startTime
        
        // Count results
        const resultCount = await page.locator('tbody tr').count()
        
        searchTimes.push({ query, time: searchTime, results: resultCount })
        
        console.log(`   Search "${query}": ${searchTime}ms (${resultCount} results)`)
        
        // Clear search for next iteration
        await searchInput.fill('')
        await page.waitForTimeout(500)
      }

      const metrics = await collectPerformanceMetrics(page)
      
      const report = createPerformanceReport('Search Performance', metrics, {
        datasetSize: 1000,
        searchTimes,
        averageSearchTime: searchTimes.reduce((sum, s) => sum + s.time, 0) / searchTimes.length
      })
      performanceReports.push(report)

      // Assert search performance
      const avgSearchTime = searchTimes.reduce((sum, s) => sum + s.time, 0) / searchTimes.length
      expect(avgSearchTime).toBeLessThan(3000) // 3 seconds max per search
      
      console.log(`✅ Average search time: ${Math.round(avgSearchTime)}ms`)
    } else {
      console.log('⚠️ Search functionality not found, skipping search performance test')
    }
  })

  test('sorting performance with large dataset', async ({ page }) => {
    console.log('🔄 Testing sorting performance...')

    await page.goto('/')
    await waitForPageLoad(page)
    
    await createLargeDataset(page, 500) // Use 500 lessons for sorting testing
    
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Alle Lektionen' }).click()
    await waitForPageLoad(page)
    
    await expect(page.getByRole('table')).toBeVisible()
    
    // Test sorting functionality
    const sortableHeaders = page.locator('th[role="columnheader"]')
    const headerCount = await sortableHeaders.count()
    
    if (headerCount > 0) {
      const sortTimes: Array<{column: string, time: number}> = []
      
      // Test sorting on first few columns
      for (let i = 0; i < Math.min(3, headerCount); i++) {
        const header = sortableHeaders.nth(i)
        const headerText = await header.textContent() || `Column ${i + 1}`
        
        if (await header.isVisible()) {
          const startTime = Date.now()
          
          await header.click()
          await page.waitForTimeout(1000) // Wait for sort to complete
          
          const endTime = Date.now()
          const sortTime = endTime - startTime
          
          sortTimes.push({ column: headerText, time: sortTime })
          
          console.log(`   Sort "${headerText}": ${sortTime}ms`)
        }
      }

      const metrics = await collectPerformanceMetrics(page)
      
      const report = createPerformanceReport('Sorting Performance', metrics, {
        datasetSize: 500,
        sortTimes,
        averageSortTime: sortTimes.length > 0 
          ? sortTimes.reduce((sum, s) => sum + s.time, 0) / sortTimes.length 
          : 0
      })
      performanceReports.push(report)

      // Assert sorting performance
      if (sortTimes.length > 0) {
        const avgSortTime = sortTimes.reduce((sum, s) => sum + s.time, 0) / sortTimes.length
        expect(avgSortTime).toBeLessThan(5000) // 5 seconds max per sort operation
        
        console.log(`✅ Average sort time: ${Math.round(avgSortTime)}ms`)
      }
    } else {
      console.log('⚠️ Sortable columns not found, skipping sorting performance test')
    }
  })
})