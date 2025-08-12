import { test, expect } from '@playwright/test'
import {
  collectPerformanceMetrics,
  waitForPageLoad,
  performanceAssertions,
  createPerformanceReport,
  type PerformanceMetrics
} from './helpers/performanceHelpers'

/**
 * Page Load Performance Tests
 * 
 * These tests measure and establish baselines for page load performance
 * across critical user journeys in the Eleno application.
 */

test.describe('Page Load Performance', () => {
  test.use({ 
    storageState: 'tests/performance/.auth/user.json'
  })

  let performanceReports: string[] = []

  test.afterAll(async () => {
    // Create consolidated performance report
    const consolidatedReport = {
      testSuite: 'Page Load Performance',
      timestamp: new Date().toISOString(),
      reports: performanceReports
    }
    
    console.log('\n📊 PAGE LOAD PERFORMANCE REPORT')
    console.log('================================')
    console.log(JSON.stringify(consolidatedReport, null, 2))
  })

  test('dashboard page load performance', async ({ page }) => {
    console.log('🏠 Testing dashboard page load performance...')

    // Start timing
    const startTime = Date.now()
    
    // Navigate to dashboard
    await page.goto('/')
    
    // Wait for complete page load
    await waitForPageLoad(page)
    
    // Ensure dashboard is fully loaded
    await expect(
      page.getByRole('heading', { name: 'Quick Links' })
    ).toBeVisible()
    
    await expect(
      page.getByTestId('lesson-nav-sidebar')
    ).toBeEnabled()

    const endTime = Date.now()
    const totalLoadTime = endTime - startTime

    // Collect performance metrics
    const metrics = await collectPerformanceMetrics(page)
    
    // Create performance report
    const report = createPerformanceReport('Dashboard Page Load', metrics, {
      totalLoadTime,
      url: page.url()
    })
    performanceReports.push(report)

    // Performance assertions (baseline establishment)
    performanceAssertions.expectFCPWithin(metrics, 5000) // 5 seconds max
    performanceAssertions.expectDOMLoadWithin(metrics, 10000) // 10 seconds max
    performanceAssertions.expectTTIWithin(metrics, 15000) // 15 seconds max

    console.log(`✅ Dashboard loaded in ${totalLoadTime}ms`)
    console.log(`   FCP: ${Math.round(metrics.firstContentfulPaint)}ms`)
    console.log(`   DOM: ${Math.round(metrics.domContentLoaded)}ms`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('lesson planning page load performance', async ({ page }) => {
    console.log('📚 Testing lesson planning page load performance...')

    const startTime = Date.now()
    
    // Navigate to lessons
    await page.goto('/')
    await waitForPageLoad(page)
    
    // Navigate to lessons page
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    // Ensure lesson planning page is loaded
    await expect(
      page.getByRole('heading', { name: 'notizen' })
    ).toBeVisible()

    const endTime = Date.now()
    const totalLoadTime = endTime - startTime

    // Collect performance metrics
    const metrics = await collectPerformanceMetrics(page)
    
    const report = createPerformanceReport('Lesson Planning Page Load', metrics, {
      totalLoadTime,
      url: page.url()
    })
    performanceReports.push(report)

    // Performance assertions
    performanceAssertions.expectFCPWithin(metrics, 6000) // 6 seconds max
    performanceAssertions.expectDOMLoadWithin(metrics, 12000) // 12 seconds max
    performanceAssertions.expectTTIWithin(metrics, 18000) // 18 seconds max

    console.log(`✅ Lesson planning page loaded in ${totalLoadTime}ms`)
    console.log(`   FCP: ${Math.round(metrics.firstContentfulPaint)}ms`)
    console.log(`   DOM: ${Math.round(metrics.domContentLoaded)}ms`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('all lessons page load performance', async ({ page }) => {
    console.log('📋 Testing all lessons page load performance...')

    const startTime = Date.now()
    
    // Navigate to all lessons page
    await page.goto('/')
    await waitForPageLoad(page)
    
    await page.getByTestId('lesson-nav-sidebar').click()
    await waitForPageLoad(page)
    
    // Click on "All Lessons" link
    await page.getByRole('link', { name: 'Alle Lektionen' }).click()
    await waitForPageLoad(page)
    
    // Ensure all lessons table is loaded
    await expect(
      page.getByRole('table')
    ).toBeVisible()

    const endTime = Date.now()
    const totalLoadTime = endTime - startTime

    // Collect performance metrics
    const metrics = await collectPerformanceMetrics(page)
    
    const report = createPerformanceReport('All Lessons Page Load', metrics, {
      totalLoadTime,
      url: page.url()
    })
    performanceReports.push(report)

    // Performance assertions
    performanceAssertions.expectFCPWithin(metrics, 7000) // 7 seconds max
    performanceAssertions.expectDOMLoadWithin(metrics, 15000) // 15 seconds max
    performanceAssertions.expectTTIWithin(metrics, 20000) // 20 seconds max

    console.log(`✅ All lessons page loaded in ${totalLoadTime}ms`)
    console.log(`   FCP: ${Math.round(metrics.firstContentfulPaint)}ms`)
    console.log(`   DOM: ${Math.round(metrics.domContentLoaded)}ms`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('students page load performance', async ({ page }) => {
    console.log('👥 Testing students page load performance...')

    const startTime = Date.now()
    
    // Navigate to students page
    await page.goto('/')
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Schüler' }).click()
    await waitForPageLoad(page)
    
    // Ensure students page is loaded
    await expect(
      page.getByRole('heading', { name: 'Active students' })
    ).toBeVisible()

    const endTime = Date.now()
    const totalLoadTime = endTime - startTime

    // Collect performance metrics
    const metrics = await collectPerformanceMetrics(page)
    
    const report = createPerformanceReport('Students Page Load', metrics, {
      totalLoadTime,
      url: page.url()
    })
    performanceReports.push(report)

    // Performance assertions
    performanceAssertions.expectFCPWithin(metrics, 6000) // 6 seconds max
    performanceAssertions.expectDOMLoadWithin(metrics, 12000) // 12 seconds max
    performanceAssertions.expectTTIWithin(metrics, 18000) // 18 seconds max

    console.log(`✅ Students page loaded in ${totalLoadTime}ms`)
    console.log(`   FCP: ${Math.round(metrics.firstContentfulPaint)}ms`)
    console.log(`   DOM: ${Math.round(metrics.domContentLoaded)}ms`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('settings page load performance', async ({ page }) => {
    console.log('⚙️ Testing settings page load performance...')

    const startTime = Date.now()
    
    // Navigate to settings page
    await page.goto('/')
    await waitForPageLoad(page)
    
    await page.getByRole('link', { name: 'Settings' }).click()
    await waitForPageLoad(page)
    
    // Ensure settings page is loaded
    await expect(
      page.getByRole('heading', { name: 'Profile' })
    ).toBeVisible()

    const endTime = Date.now()
    const totalLoadTime = endTime - startTime

    // Collect performance metrics
    const metrics = await collectPerformanceMetrics(page)
    
    const report = createPerformanceReport('Settings Page Load', metrics, {
      totalLoadTime,
      url: page.url()
    })
    performanceReports.push(report)

    // Performance assertions
    performanceAssertions.expectFCPWithin(metrics, 5000) // 5 seconds max
    performanceAssertions.expectDOMLoadWithin(metrics, 10000) // 10 seconds max
    performanceAssertions.expectTTIWithin(metrics, 15000) // 15 seconds max

    console.log(`✅ Settings page loaded in ${totalLoadTime}ms`)
    console.log(`   FCP: ${Math.round(metrics.firstContentfulPaint)}ms`)
    console.log(`   DOM: ${Math.round(metrics.domContentLoaded)}ms`)
    console.log(`   TTI: ${Math.round(metrics.timeToInteractive)}ms`)
  })

  test('page navigation performance', async ({ page }) => {
    console.log('🔄 Testing page navigation performance...')

    await page.goto('/')
    await waitForPageLoad(page)

    const navigationTimes: Array<{page: string, time: number}> = []

    // Test navigation between main pages
    const pages = [
      { name: 'Lessons', selector: 'lesson-nav-sidebar', heading: 'notizen' },
      { name: 'Students', selector: 'link', text: 'Schüler', heading: 'Active students' },
      { name: 'Dashboard', selector: 'link', text: 'Dashboard', heading: 'Quick Links' },
      { name: 'Settings', selector: 'link', text: 'Settings', heading: 'Profile' }
    ]

    for (const pageInfo of pages) {
      const startTime = Date.now()
      
      if (pageInfo.selector === 'lesson-nav-sidebar') {
        await page.getByTestId(pageInfo.selector).click()
      } else if (pageInfo.text) {
        await page.getByRole(pageInfo.selector as any, { name: pageInfo.text }).click()
      }
      
      await waitForPageLoad(page)
      
      // Wait for page-specific content
      await expect(
        page.getByRole('heading', { name: pageInfo.heading })
      ).toBeVisible()
      
      const endTime = Date.now()
      const navigationTime = endTime - startTime
      
      navigationTimes.push({ page: pageInfo.name, time: navigationTime })
      
      console.log(`   ${pageInfo.name}: ${navigationTime}ms`)
    }

    // Collect final metrics
    const metrics = await collectPerformanceMetrics(page)
    
    const report = createPerformanceReport('Page Navigation Performance', metrics, {
      navigationTimes,
      averageNavigationTime: navigationTimes.reduce((sum, nav) => sum + nav.time, 0) / navigationTimes.length
    })
    performanceReports.push(report)

    // Assert that navigation is reasonably fast
    const averageTime = navigationTimes.reduce((sum, nav) => sum + nav.time, 0) / navigationTimes.length
    expect(averageTime).toBeLessThan(5000) // Average navigation under 5 seconds

    console.log(`✅ Average navigation time: ${Math.round(averageTime)}ms`)
  })
})