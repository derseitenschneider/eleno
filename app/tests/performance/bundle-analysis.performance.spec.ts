import { test, expect } from '@playwright/test'
import {
  collectPerformanceMetrics,
  waitForPageLoad,
  createPerformanceReport,
} from './helpers/performanceHelpers'

/**
 * Bundle Size Impact Analysis Tests
 *
 * These tests analyze the current bundle sizes, lazy loading performance,
 * and code splitting effectiveness to establish baselines and identify
 * opportunities for optimization.
 */

test.describe('Bundle Size Impact Analysis', () => {
  test.use({
    storageState: 'tests/performance/.auth/user.json',
  })

  let performanceReports: string[] = []

  test.afterAll(async () => {
    const consolidatedReport = {
      testSuite: 'Bundle Size Impact Analysis',
      timestamp: new Date().toISOString(),
      reports: performanceReports,
    }

    console.log('\n📊 BUNDLE SIZE IMPACT ANALYSIS REPORT')
    console.log('======================================')
    console.log(JSON.stringify(consolidatedReport, null, 2))
  })

  test('initial bundle load analysis', async ({ page }) => {
    console.log('📦 Analyzing initial bundle load performance...')

    // Track network requests during initial page load
    const networkRequests: Array<{
      url: string
      method: string
      resourceType: string
      size: number
      duration: number
    }> = []

    page.on('response', async (response) => {
      try {
        const request = response.request()
        const url = request.url()

        // Only track JavaScript, CSS, and other relevant resources
        if (
          url.includes('.js') ||
          url.includes('.css') ||
          url.includes('chunk') ||
          url.includes('vendor')
        ) {
          const body = await response.body().catch(() => Buffer.alloc(0))

          networkRequests.push({
            url: url.replace(
              process.env.CI
                ? 'http://localhost:5000'
                : 'http://localhost:5173',
              '',
            ),
            method: request.method(),
            resourceType: request.resourceType(),
            size: body.length,
            duration: response.timing().responseEnd,
          })
        }
      } catch (error) {
        // Ignore errors for resources that can't be analyzed
      }
    })

    const startTime = Date.now()

    // Navigate to application
    await page.goto('/')
    await waitForPageLoad(page)

    // Ensure application is fully loaded
    await expect(
      page.getByRole('heading', { name: 'Quick Links' }),
    ).toBeVisible()

    const endTime = Date.now()
    const totalLoadTime = endTime - startTime

    // Analyze bundle sizes
    const jsFiles = networkRequests.filter(
      (req) => req.url.includes('.js') && !req.url.includes('node_modules'),
    )
    const cssFiles = networkRequests.filter((req) => req.url.includes('.css'))
    const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0)
    const totalCSSSize = cssFiles.reduce((sum, file) => sum + file.size, 0)
    const totalBundleSize = totalJSSize + totalCSSSize

    // Collect performance metrics
    const metrics = await collectPerformanceMetrics(page)

    const report = createPerformanceReport(
      'Initial Bundle Load Analysis',
      metrics,
      {
        totalLoadTime,
        networkRequests: networkRequests.length,
        bundleAnalysis: {
          totalJSFiles: jsFiles.length,
          totalCSSFiles: cssFiles.length,
          totalJSSizeKB: Math.round(totalJSSize / 1024),
          totalCSSSizeKB: Math.round(totalCSSSize / 1024),
          totalBundleSizeKB: Math.round(totalBundleSize / 1024),
          largestJSFile:
            jsFiles.length > 0
              ? {
                  url: jsFiles.sort((a, b) => b.size - a.size)[0].url,
                  sizeKB: Math.round(
                    jsFiles.sort((a, b) => b.size - a.size)[0].size / 1024,
                  ),
                }
              : null,
        },
        resourceBreakdown: {
          javascript: jsFiles.map((file) => ({
            url: file.url,
            sizeKB: Math.round(file.size / 1024),
            duration: file.duration,
          })),
          css: cssFiles.map((file) => ({
            url: file.url,
            sizeKB: Math.round(file.size / 1024),
            duration: file.duration,
          })),
        },
      },
    )
    performanceReports.push(report)

    // Bundle size assertions (baseline establishment)
    expect(totalBundleSize).toBeLessThan(5 * 1024 * 1024) // Under 5MB total bundle size
    expect(jsFiles.length).toBeLessThan(20) // Reasonable number of JS files

    console.log(`✅ Bundle analysis complete:`)
    console.log(`   Total bundle size: ${Math.round(totalBundleSize / 1024)}KB`)
    console.log(
      `   JavaScript: ${Math.round(totalJSSize / 1024)}KB (${
        jsFiles.length
      } files)`,
    )
    console.log(
      `   CSS: ${Math.round(totalCSSSize / 1024)}KB (${cssFiles.length} files)`,
    )
    console.log(`   Load time: ${totalLoadTime}ms`)
  })

  test('lazy loading performance', async ({ page }) => {
    console.log('⚡ Testing lazy loading performance...')

    const lazyLoadMetrics: Array<{
      route: string
      loadTime: number
      newResources: number
      additionalSizeKB: number
    }> = []

    // Start from dashboard
    await page.goto('/')
    await waitForPageLoad(page)

    // Track initial resource count
    let initialResourceCount = 0

    const routes = [
      {
        name: 'Lessons',
        action: async () => {
          const requestPromises: Promise<any>[] = []
          let newResourceSize = 0

          page.on('response', async (response) => {
            const url = response.request().url()
            if (
              url.includes('.js') ||
              url.includes('.css') ||
              url.includes('chunk')
            ) {
              try {
                const body = await response.body()
                newResourceSize += body.length
              } catch (error) {
                // Ignore
              }
            }
          })

          const startTime = Date.now()
          await page.getByTestId('lesson-nav-sidebar').click()
          await waitForPageLoad(page)
          await expect(
            page.getByRole('heading', { name: 'notizen' }),
          ).toBeVisible()
          const endTime = Date.now()

          return {
            loadTime: endTime - startTime,
            additionalSizeKB: Math.round(newResourceSize / 1024),
          }
        },
      },
      {
        name: 'AllLessons',
        action: async () => {
          let newResourceSize = 0

          const responseHandler = async (response: any) => {
            const url = response.request().url()
            if (
              url.includes('.js') ||
              url.includes('.css') ||
              url.includes('chunk')
            ) {
              try {
                const body = await response.body()
                newResourceSize += body.length
              } catch (error) {
                // Ignore
              }
            }
          }

          page.on('response', responseHandler)

          const startTime = Date.now()
          await page.getByRole('link', { name: 'Alle Lektionen' }).click()
          await waitForPageLoad(page)
          await expect(page.getByRole('table')).toBeVisible()
          const endTime = Date.now()

          page.off('response', responseHandler)

          return {
            loadTime: endTime - startTime,
            additionalSizeKB: Math.round(newResourceSize / 1024),
          }
        },
      },
      {
        name: 'Students',
        action: async () => {
          let newResourceSize = 0

          const responseHandler = async (response: any) => {
            const url = response.request().url()
            if (
              url.includes('.js') ||
              url.includes('.css') ||
              url.includes('chunk')
            ) {
              try {
                const body = await response.body()
                newResourceSize += body.length
              } catch (error) {
                // Ignore
              }
            }
          }

          page.on('response', responseHandler)

          const startTime = Date.now()
          await page.getByRole('link', { name: 'Schüler' }).click()
          await waitForPageLoad(page)
          await expect(
            page.getByRole('heading', { name: 'Active students' }),
          ).toBeVisible()
          const endTime = Date.now()

          page.off('response', responseHandler)

          return {
            loadTime: endTime - startTime,
            additionalSizeKB: Math.round(newResourceSize / 1024),
          }
        },
      },
    ]

    for (const route of routes) {
      console.log(`   Testing lazy loading for ${route.name}...`)

      const result = await route.action()

      lazyLoadMetrics.push({
        route: route.name,
        loadTime: result.loadTime,
        newResources: 0, // Would need more sophisticated tracking
        additionalSizeKB: result.additionalSizeKB,
      })

      console.log(
        `     ${route.name}: ${result.loadTime}ms, ${result.additionalSizeKB}KB additional`,
      )
    }

    const metrics = await collectPerformanceMetrics(page)

    const report = createPerformanceReport(
      'Lazy Loading Performance',
      metrics,
      {
        lazyLoadMetrics,
        averageLazyLoadTime:
          lazyLoadMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) /
          lazyLoadMetrics.length,
        totalAdditionalSizeKB: lazyLoadMetrics.reduce(
          (sum, metric) => sum + metric.additionalSizeKB,
          0,
        ),
      },
    )
    performanceReports.push(report)

    // Lazy loading assertions
    const averageLoadTime =
      lazyLoadMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) /
      lazyLoadMetrics.length
    expect(averageLoadTime).toBeLessThan(3000) // Average lazy load under 3 seconds

    lazyLoadMetrics.forEach((metric) => {
      expect(metric.loadTime).toBeLessThan(5000) // Each route loads under 5 seconds
    })

    console.log(`✅ Lazy loading performance analysis complete`)
    console.log(`   Average load time: ${Math.round(averageLoadTime)}ms`)
  })

  test('code splitting effectiveness', async ({ page }) => {
    console.log('✂️ Analyzing code splitting effectiveness...')

    // Analyze how resources are loaded across different routes
    const routeResourceMap: Record<
      string,
      Array<{
        url: string
        size: number
        type: string
      }>
    > = {}

    const analyzeRoute = async (
      routeName: string,
      navigationAction: () => Promise<void>,
    ) => {
      const resources: Array<{
        url: string
        size: number
        type: string
      }> = []

      const responseHandler = async (response: any) => {
        const url = response.request().url()
        const resourceType = response.request().resourceType()

        if (
          url.includes('.js') ||
          url.includes('.css') ||
          url.includes('chunk')
        ) {
          try {
            const body = await response.body()
            resources.push({
              url: url.replace(
                process.env.CI
                  ? 'http://localhost:5000'
                  : 'http://localhost:5173',
                '',
              ),
              size: body.length,
              type: resourceType,
            })
          } catch (error) {
            // Ignore
          }
        }
      }

      page.on('response', responseHandler)

      await navigationAction()
      await waitForPageLoad(page)
      await page.waitForTimeout(2000) // Let all resources load

      page.off('response', responseHandler)

      routeResourceMap[routeName] = resources

      return resources
    }

    // Analyze initial load
    await page.goto('/')
    const dashboardResources = await analyzeRoute('Dashboard', async () => {
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()
    })

    // Analyze lessons route
    const lessonsResources = await analyzeRoute('Lessons', async () => {
      await page.getByTestId('lesson-nav-sidebar').click()
      await expect(page.getByRole('heading', { name: 'notizen' })).toBeVisible()
    })

    // Analyze students route
    const studentsResources = await analyzeRoute('Students', async () => {
      await page.getByRole('link', { name: 'Schüler' }).click()
      await expect(
        page.getByRole('heading', { name: 'Active students' }),
      ).toBeVisible()
    })

    // Calculate code splitting metrics
    const allResources = [
      ...dashboardResources,
      ...lessonsResources,
      ...studentsResources,
    ]

    const uniqueResources = Array.from(
      new Set(allResources.map((r) => r.url)),
    ).map((url) => allResources.find((r) => r.url === url)!)

    const sharedResources = uniqueResources.filter((resource) => {
      const routes = Object.values(routeResourceMap).filter((routeResources) =>
        routeResources.some((r) => r.url === resource.url),
      )
      return routes.length > 1
    })

    const routeSpecificResources = uniqueResources.filter((resource) => {
      const routes = Object.values(routeResourceMap).filter((routeResources) =>
        routeResources.some((r) => r.url === resource.url),
      )
      return routes.length === 1
    })

    const metrics = await collectPerformanceMetrics(page)

    const report = createPerformanceReport(
      'Code Splitting Effectiveness',
      metrics,
      {
        totalUniqueResources: uniqueResources.length,
        sharedResources: {
          count: sharedResources.length,
          totalSizeKB: Math.round(
            sharedResources.reduce((sum, r) => sum + r.size, 0) / 1024,
          ),
        },
        routeSpecificResources: {
          count: routeSpecificResources.length,
          totalSizeKB: Math.round(
            routeSpecificResources.reduce((sum, r) => sum + r.size, 0) / 1024,
          ),
        },
        splittingEffectiveness: {
          sharedResourcesPercentage: Math.round(
            (sharedResources.length / uniqueResources.length) * 100,
          ),
          routeSpecificPercentage: Math.round(
            (routeSpecificResources.length / uniqueResources.length) * 100,
          ),
        },
        routeBreakdown: Object.entries(routeResourceMap).reduce(
          (acc, [route, resources]) => {
            acc[route] = {
              totalResources: resources.length,
              totalSizeKB: Math.round(
                resources.reduce((sum, r) => sum + r.size, 0) / 1024,
              ),
              jsFiles: resources.filter((r) => r.url.includes('.js')).length,
              cssFiles: resources.filter((r) => r.url.includes('.css')).length,
            }
            return acc
          },
          {} as Record<string, any>,
        ),
      },
    )
    performanceReports.push(report)

    // Code splitting assertions
    const splittingRatio =
      routeSpecificResources.length / uniqueResources.length
    expect(splittingRatio).toBeGreaterThan(0.3) // At least 30% route-specific resources

    console.log(`✅ Code splitting analysis complete:`)
    console.log(`   Total unique resources: ${uniqueResources.length}`)
    console.log(
      `   Shared resources: ${sharedResources.length} (${Math.round(
        (sharedResources.length / uniqueResources.length) * 100,
      )}%)`,
    )
    console.log(
      `   Route-specific resources: ${
        routeSpecificResources.length
      } (${Math.round(
        (routeSpecificResources.length / uniqueResources.length) * 100,
      )}%)`,
    )
  })

  test('resource caching effectiveness', async ({ page }) => {
    console.log('💾 Testing resource caching effectiveness...')

    const cacheMetrics: Array<{
      url: string
      firstLoadTime: number
      cachedLoadTime: number
      cacheHit: boolean
    }> = []

    // First load - populate cache
    console.log('   First load (populating cache)...')

    const firstLoadResources: Record<string, number> = {}

    page.on('response', async (response) => {
      const url = response.request().url()
      if (
        url.includes('.js') ||
        url.includes('.css') ||
        url.includes('chunk')
      ) {
        firstLoadResources[url] = response.timing().responseEnd
      }
    })

    await page.goto('/')
    await waitForPageLoad(page)
    await expect(
      page.getByRole('heading', { name: 'Quick Links' }),
    ).toBeVisible()

    // Clear page but keep cache
    await page.evaluate(() => {
      // Clear DOM but keep cache
      window.stop()
    })

    // Second load - test cache
    console.log('   Second load (testing cache)...')

    const secondLoadResources: Record<string, number> = {}
    let cacheHitCount = 0
    let totalRequestCount = 0

    page.on('response', async (response) => {
      const url = response.request().url()
      if (
        url.includes('.js') ||
        url.includes('.css') ||
        url.includes('chunk')
      ) {
        totalRequestCount++
        secondLoadResources[url] = response.timing().responseEnd

        // Check if this was served from cache (status 304 or very fast response)
        if (response.status() === 304 || response.timing().responseEnd < 50) {
          cacheHitCount++
        }
      }
    })

    await page.reload()
    await waitForPageLoad(page)
    await expect(
      page.getByRole('heading', { name: 'Quick Links' }),
    ).toBeVisible()

    // Compare load times
    Object.keys(firstLoadResources).forEach((url) => {
      if (secondLoadResources[url] !== undefined) {
        cacheMetrics.push({
          url: url.replace(
            process.env.CI ? 'http://localhost:5000' : 'http://localhost:5173',
            '',
          ),
          firstLoadTime: firstLoadResources[url],
          cachedLoadTime: secondLoadResources[url],
          cacheHit: secondLoadResources[url] < firstLoadResources[url] * 0.5, // 50% faster indicates cache hit
        })
      }
    })

    const metrics = await collectPerformanceMetrics(page)

    const cacheHitRate =
      totalRequestCount > 0 ? (cacheHitCount / totalRequestCount) * 100 : 0
    const averageFirstLoad =
      cacheMetrics.reduce((sum, m) => sum + m.firstLoadTime, 0) /
      cacheMetrics.length
    const averageCachedLoad =
      cacheMetrics.reduce((sum, m) => sum + m.cachedLoadTime, 0) /
      cacheMetrics.length
    const cacheSpeedupRatio =
      averageCachedLoad > 0 ? averageFirstLoad / averageCachedLoad : 1

    const report = createPerformanceReport(
      'Resource Caching Effectiveness',
      metrics,
      {
        totalResources: cacheMetrics.length,
        cacheHitRate: Math.round(cacheHitRate),
        averageFirstLoadTime: Math.round(averageFirstLoad),
        averageCachedLoadTime: Math.round(averageCachedLoad),
        cacheSpeedupRatio: Math.round(cacheSpeedupRatio * 100) / 100,
        resourceDetails: cacheMetrics.map((m) => ({
          url: m.url,
          firstLoadTime: Math.round(m.firstLoadTime),
          cachedLoadTime: Math.round(m.cachedLoadTime),
          speedupRatio:
            Math.round((m.firstLoadTime / m.cachedLoadTime) * 100) / 100,
          cacheHit: m.cacheHit,
        })),
      },
    )
    performanceReports.push(report)

    // Caching assertions
    expect(cacheSpeedupRatio).toBeGreaterThan(1.5) // At least 50% faster on cached loads

    console.log(`✅ Caching effectiveness analysis complete:`)
    console.log(`   Cache hit rate: ${Math.round(cacheHitRate)}%`)
    console.log(
      `   Average speedup: ${Math.round(cacheSpeedupRatio * 100) / 100}x`,
    )
    console.log(`   First load: ${Math.round(averageFirstLoad)}ms`)
    console.log(`   Cached load: ${Math.round(averageCachedLoad)}ms`)
  })
})
