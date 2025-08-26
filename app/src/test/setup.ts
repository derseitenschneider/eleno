/**
 * Optimized Test Setup with Performance Enhancements
 *
 * This setup file integrates all mock performance improvements:
 * - Optimized MSW server with pre-computed responses
 * - Factory pooling and object reuse
 * - Provider chain optimization
 * - Cache warming and management
 * - Performance monitoring integration
 * - Memory leak prevention
 */

import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, expect, vi } from 'vitest'
import {
  clearFactoryPools,
  resetFactoryStats,
  warmupFactoryPools,
} from './factories'
import { cleanupAllCaches, resetAllCaches } from './mockCache'
import {
  resetLightweightMocks,
  setupLightweightMocks,
} from './mocks.lightweight'
// Optimized implementations
import { optimizedServer, preWarmMockCache, resetOptimizedServer } from './msw'
import {
  resetAllPerformanceTracking,
  startPerformanceMonitoring,
  stopPerformanceMonitoring,
} from './performance'
import { cleanupAllTestUtils, resetRenderMetrics } from './testUtils'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Performance monitoring flag
let isPerformanceMonitoringEnabled = false

// Setup optimized MSW server
beforeAll(async () => {
  console.log('🚀 Initializing optimized test environment...')

  // Start performance monitoring if enabled
  if (process.env.VITEST_PERFORMANCE_MONITORING === 'true') {
    isPerformanceMonitoringEnabled = true
    startPerformanceMonitoring()
    console.log('📊 Performance monitoring enabled')
  }

  // Setup optimized MSW server
  optimizedServer.listen({
    onUnhandledRequest: 'error',
  })

  // Pre-warm all caches and pools for better performance
  console.log('🔥 Pre-warming caches and pools...')
  await Promise.all([preWarmMockCache(), warmupFactoryPools()])

  // Setup global lightweight mocks
  setupLightweightMocks()

  console.log('✅ Optimized test environment ready')
})

// Optimized cleanup after each test
afterEach(() => {
  // Reset MSW handlers but keep server running for performance
  optimizedServer.resetHandlers()

  // Clean up React Testing Library
  cleanup()

  // Reset lightweight mocks (very fast operation)
  resetLightweightMocks()

  // Reset factory stats but keep pools warm
  resetFactoryStats()

  // Reset render metrics
  resetRenderMetrics()

  // Note: We don't clear caches or pools here for performance
  // They will be cleaned up in afterAll
})

// Cleanup after all tests
afterAll(async () => {
  // Stop MSW server
  optimizedServer.close()

  // Stop performance monitoring
  if (isPerformanceMonitoringEnabled) {
    stopPerformanceMonitoring()
  }

  // Clean up all optimized systems
  await Promise.all([
    cleanupAllTestUtils(),
    cleanupAllCaches(),
    clearFactoryPools(),
  ])

  // Reset optimized server state
  resetOptimizedServer()

  // Reset performance tracking
  resetAllPerformanceTracking()

  console.log('🧹 Optimized test environment cleaned up')
})

// Optimized global mocks with better performance
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Optimized IntersectionObserver mock
const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
global.IntersectionObserver = mockIntersectionObserver

// Optimized ResizeObserver mock
const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
global.ResizeObserver = mockResizeObserver

// Optimized localStorage mock with caching
const localStorageCache = new Map<string, string>()
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn((key: string) => localStorageCache.get(key) || null),
    setItem: vi.fn((key: string, value: string) => {
      localStorageCache.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      localStorageCache.delete(key)
    }),
    clear: vi.fn(() => {
      localStorageCache.clear()
    }),
  },
  writable: true,
})

// Optimized sessionStorage mock with caching
const sessionStorageCache = new Map<string, string>()
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn((key: string) => sessionStorageCache.get(key) || null),
    setItem: vi.fn((key: string, value: string) => {
      sessionStorageCache.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      sessionStorageCache.delete(key)
    }),
    clear: vi.fn(() => {
      sessionStorageCache.clear()
    }),
  },
  writable: true,
})

// Pre-allocated mock functions for better performance
const mockCreateObjectURL = vi.fn(() => 'mock-object-url')
const mockRevokeObjectURL = vi.fn()
const mockScrollTo = vi.fn()

// Mock URL methods
global.URL.createObjectURL = mockCreateObjectURL
global.URL.revokeObjectURL = mockRevokeObjectURL

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

// Performance optimization: Mock console methods in test environment
// to reduce I/O overhead (can be enabled via environment variable)
if (process.env.VITEST_MOCK_CONSOLE === 'true') {
  const originalConsole = { ...console }

  beforeAll(() => {
    Object.assign(console, {
      log: vi.fn(),
      warn: vi.fn(),
      error: originalConsole.error, // Keep error for important messages
      info: vi.fn(),
      debug: vi.fn(),
    })
  })

  afterAll(() => {
    Object.assign(console, originalConsole)
  })
}

// Memory optimization: Clean up DOM more aggressively
if (process.env.VITEST_AGGRESSIVE_CLEANUP === 'true') {
  afterEach(() => {
    // Clear any remaining DOM elements
    document.body.innerHTML = ''

    // Clear any remaining timers
    vi.clearAllTimers()

    // Clear storage caches
    localStorageCache.clear()
    sessionStorageCache.clear()
  })
}

export {
  getFactoryStats,
  printFactoryReport,
  resetFactoryStats,
} from './factories'

export {
  lessonCache,
  mockCache,
  printCacheReport,
  resetAllCaches,
  studentCache,
} from './mockCache'
// Performance testing utilities for individual tests
export {
  printPerformanceReport,
  resetAllPerformanceTracking,
  startPerformanceMonitoring,
  stopPerformanceMonitoring,
} from './performance'

export {
  getRenderMetrics,
  printRenderReport,
  resetRenderMetrics,
} from './testUtils'

// Utility function to enable performance monitoring for specific tests
export function withPerformanceMonitoring<T>(testFn: () => T): T {
  const wasEnabled = isPerformanceMonitoringEnabled

  if (!wasEnabled) {
    startPerformanceMonitoring()
  }

  try {
    return testFn()
  } finally {
    if (!wasEnabled) {
      stopPerformanceMonitoring()
    }
  }
}

// Utility function to benchmark a test function
export async function benchmarkTest<T>(
  testFn: () => T | Promise<T>,
  testName: string,
  iterations = 10,
): Promise<{ result: T; averageTime: number; totalTime: number }> {
  const times: number[] = []
  let result: T

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    result = await testFn()
    const end = performance.now()
    times.push(end - start)

    // Clean up between iterations
    cleanup()
    resetLightweightMocks()
  }

  const totalTime = times.reduce((sum, time) => sum + time, 0)
  const averageTime = totalTime / iterations

  console.log(
    `⏱️  ${testName}: ${averageTime.toFixed(2)}ms avg (${iterations} iterations)`,
  )

  return {
    result: result!,
    averageTime,
    totalTime,
  }
}

// Environment-specific optimizations
if (process.env.NODE_ENV === 'test') {
  // Reduce promise scheduling overhead in test environment
  if (typeof queueMicrotask !== 'undefined') {
    const originalQueueMicrotask = queueMicrotask
    // Use globalThis to safely override queueMicrotask in test environment
    ;(globalThis as any).queueMicrotask = (callback: () => void) => {
      // In tests, execute microtasks synchronously for better performance
      if (process.env.VITEST_SYNC_MICROTASKS === 'true') {
        callback()
      } else {
        originalQueueMicrotask(callback)
      }
    }
  }
}

// Export performance configuration for tests
export const PERFORMANCE_CONFIG = {
  isMonitoringEnabled: isPerformanceMonitoringEnabled,
  cachePreWarmed: true,
  poolsWarmed: true,
  optimizedSetup: true,
} as const

console.log('📦 Optimized test setup loaded successfully')

// Polyfill for hasPointerCapture
if (!('hasPointerCapture' in Element.prototype)) {
  Element.prototype.hasPointerCapture = function (pointerId) {
    return this.getPointerCapture(pointerId) !== undefined
  }
}

if (!('releasePointerCapture' in Element.prototype)) {
  Element.prototype.releasePointerCapture = function (pointerId) {
    // No-op
  }
}

if (!('setPointerCapture' in Element.prototype)) {
  Element.prototype.setPointerCapture = function (pointerId) {
    // No-op
  }
}

