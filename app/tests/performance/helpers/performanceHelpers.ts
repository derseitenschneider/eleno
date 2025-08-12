import { type Page, type BrowserContext, expect } from '@playwright/test'

export interface PerformanceMetrics {
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay?: number
  cumulativeLayoutShift: number
  timeToInteractive: number
  totalBlockingTime: number
  domContentLoaded: number
  loadEvent: number
  navigationStart: number
  navigationEnd: number
  jsHeapUsedSize?: number
  jsHeapTotalSize?: number
  jsHeapSizeLimit?: number
}

export interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

/**
 * Collects comprehensive performance metrics from the browser
 */
export async function collectPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      // Wait for load event to ensure all metrics are available
      if (document.readyState === 'complete') {
        collectMetrics()
      } else {
        window.addEventListener('load', collectMetrics)
      }

      function collectMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType('paint')
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        
        // Get Core Web Vitals using PerformanceObserver if available
        let lcp = 0
        let cls = 0
        let tbt = 0
        
        // Try to get LCP from existing entries
        try {
          const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
          if (lcpEntries.length > 0) {
            lcp = lcpEntries[lcpEntries.length - 1].startTime
          }
        } catch (e) {
          // LCP not available
        }

        // Calculate Time to Interactive (simplified version)
        const tti = navigation.loadEventEnd - navigation.navigationStart

        // Get memory info if available
        const memoryInfo = (performance as any).memory
        
        const metrics: PerformanceMetrics = {
          firstContentfulPaint: fcp,
          largestContentfulPaint: lcp,
          cumulativeLayoutShift: cls,
          timeToInteractive: tti,
          totalBlockingTime: tbt,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          loadEvent: navigation.loadEventEnd - navigation.navigationStart,
          navigationStart: navigation.navigationStart,
          navigationEnd: navigation.loadEventEnd,
        }

        if (memoryInfo) {
          metrics.jsHeapUsedSize = memoryInfo.usedJSHeapSize
          metrics.jsHeapTotalSize = memoryInfo.totalJSHeapSize
          metrics.jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit
        }

        resolve(metrics)
      }
    })
  })
}

/**
 * Gets detailed memory information from the browser
 */
export async function getMemoryInfo(page: Page): Promise<MemoryInfo> {
  return await page.evaluate(() => {
    const memoryInfo = (performance as any).memory
    if (!memoryInfo) {
      throw new Error('Memory info not available')
    }
    
    return {
      usedJSHeapSize: memoryInfo.usedJSHeapSize,
      totalJSHeapSize: memoryInfo.totalJSHeapSize,
      jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit
    }
  })
}

/**
 * Forces garbage collection if available
 */
export async function forceGarbageCollection(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      if (window.gc) {
        window.gc()
      }
    })
  } catch (e) {
    // Garbage collection not available
    console.log('Manual garbage collection not available')
  }
}

/**
 * Waits for the page to be completely loaded and idle
 */
export async function waitForPageLoad(page: Page, timeout = 30000): Promise<void> {
  await page.waitForLoadState('load', { timeout })
  await page.waitForLoadState('networkidle', { timeout })
  
  // Additional wait for any React components to finish rendering
  await page.waitForTimeout(1000)
}

/**
 * Creates a large dataset of lessons for performance testing
 */
export async function createLargeDataset(page: Page, count: number): Promise<void> {
  await page.evaluate((lessonCount) => {
    // Mock a large dataset by injecting data into the application state
    const mockLessons = Array.from({ length: lessonCount }, (_, i) => ({
      id: `lesson-${i + 1}`,
      title: `Performance Test Lesson ${i + 1}`,
      description: `This is a test lesson created for performance testing purposes. Lesson number ${i + 1} of ${lessonCount}.`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
      notes: `Performance test notes for lesson ${i + 1}. This contains some sample text to simulate real lesson notes.`,
      student_id: `student-${Math.floor(Math.random() * 50) + 1}`,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Store in sessionStorage for the application to use
    sessionStorage.setItem('performance_test_lessons', JSON.stringify(mockLessons))
  }, count)
}

/**
 * Measures the time taken to render a component
 */
export async function measureRenderTime(page: Page, selector: string): Promise<number> {
  return await page.evaluate((sel) => {
    const startTime = performance.now()
    
    return new Promise<number>((resolve) => {
      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(sel)
        if (element) {
          const endTime = performance.now()
          observer.disconnect()
          resolve(endTime - startTime)
        }
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
      
      // Fallback timeout
      setTimeout(() => {
        observer.disconnect()
        const endTime = performance.now()
        resolve(endTime - startTime)
      }, 10000)
    })
  }, selector)
}

/**
 * Performance test assertion helpers
 */
export const performanceAssertions = {
  /**
   * Assert that First Contentful Paint is within acceptable range
   */
  expectFCPWithin: (metrics: PerformanceMetrics, maxMs: number) => {
    expect(metrics.firstContentfulPaint).toBeLessThan(maxMs)
    expect(metrics.firstContentfulPaint).toBeGreaterThan(0)
  },

  /**
   * Assert that Largest Contentful Paint is within acceptable range
   */
  expectLCPWithin: (metrics: PerformanceMetrics, maxMs: number) => {
    if (metrics.largestContentfulPaint > 0) {
      expect(metrics.largestContentfulPaint).toBeLessThan(maxMs)
    }
  },

  /**
   * Assert that Time to Interactive is within acceptable range
   */
  expectTTIWithin: (metrics: PerformanceMetrics, maxMs: number) => {
    expect(metrics.timeToInteractive).toBeLessThan(maxMs)
    expect(metrics.timeToInteractive).toBeGreaterThan(0)
  },

  /**
   * Assert that DOM Content Loaded is within acceptable range
   */
  expectDOMLoadWithin: (metrics: PerformanceMetrics, maxMs: number) => {
    expect(metrics.domContentLoaded).toBeLessThan(maxMs)
    expect(metrics.domContentLoaded).toBeGreaterThan(0)
  },

  /**
   * Assert that memory usage is within acceptable limits
   */
  expectMemoryWithin: (memoryInfo: MemoryInfo, maxMB: number) => {
    const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024)
    expect(usedMB).toBeLessThan(maxMB)
    expect(usedMB).toBeGreaterThan(0)
  }
}

/**
 * Creates a performance test report
 */
export function createPerformanceReport(
  testName: string,
  metrics: PerformanceMetrics,
  additionalData: Record<string, any> = {}
): string {
  const report = {
    testName,
    timestamp: new Date().toISOString(),
    metrics: {
      'First Contentful Paint (ms)': Math.round(metrics.firstContentfulPaint),
      'Largest Contentful Paint (ms)': Math.round(metrics.largestContentfulPaint),
      'Time to Interactive (ms)': Math.round(metrics.timeToInteractive),
      'DOM Content Loaded (ms)': Math.round(metrics.domContentLoaded),
      'Load Event (ms)': Math.round(metrics.loadEvent),
      'Total Page Load Time (ms)': Math.round(metrics.navigationEnd - metrics.navigationStart),
    },
    memory: metrics.jsHeapUsedSize ? {
      'JS Heap Used (MB)': Math.round(metrics.jsHeapUsedSize / (1024 * 1024)),
      'JS Heap Total (MB)': Math.round((metrics.jsHeapTotalSize || 0) / (1024 * 1024)),
      'JS Heap Limit (MB)': Math.round((metrics.jsHeapSizeLimit || 0) / (1024 * 1024)),
    } : null,
    additionalData
  }

  return JSON.stringify(report, null, 2)
}