/**
 * Mock Response Caching System
 *
 * Provides intelligent caching for mock responses to reduce computation overhead
 * and improve test execution speed through:
 * - Response memoization with configurable TTL
 * - Request fingerprinting for cache keys
 * - Memory-efficient cache eviction policies
 * - Cache hit rate monitoring
 */

import { performance } from 'node:perf_hooks'

interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  computationTime: number
}

interface CacheMetrics {
  totalRequests: number
  cacheHits: number
  cacheMisses: number
  totalComputationTime: number
  totalCacheTime: number
  hitRate: number
  averageComputationTime: number
  averageCacheTime: number
}

interface CacheConfig {
  defaultTTL: number
  maxEntries: number
  enableMetrics: boolean
  cleanupInterval: number
}

class MockResponseCache {
  private cache = new Map<string, CacheEntry>()
  private metrics: CacheMetrics = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalComputationTime: 0,
    totalCacheTime: 0,
    hitRate: 0,
    averageComputationTime: 0,
    averageCacheTime: 0,
  }

  private config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes default
    maxEntries: 1000,
    enableMetrics: true,
    cleanupInterval: 60 * 1000, // 1 minute
  }

  private cleanupTimer?: NodeJS.Timeout

  constructor(config?: Partial<CacheConfig>) {
    this.config = { ...this.config, ...config }
    this.startCleanupTimer()
  }

  /**
   * Get cached response or compute new one
   */
  async get<T>(
    key: string,
    factory: () => T | Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const startTime = performance.now()
    this.metrics.totalRequests++

    const entry = this.cache.get(key)
    const now = Date.now()

    // Check if cached entry is valid
    if (entry && now - entry.timestamp < entry.ttl) {
      entry.hits++
      this.metrics.cacheHits++
      this.metrics.totalCacheTime += performance.now() - startTime
      this.updateMetrics()
      return entry.data
    }

    // Cache miss - compute new value
    this.metrics.cacheMisses++
    const computeStart = performance.now()

    try {
      const data = await factory()
      const computationTime = performance.now() - computeStart

      // Store in cache
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl: ttl || this.config.defaultTTL,
        hits: 1,
        computationTime,
      })

      this.metrics.totalComputationTime += computationTime
      this.enforceMaxEntries()
      this.updateMetrics()

      return data
    } catch (error) {
      this.metrics.totalComputationTime += performance.now() - computeStart
      throw error
    }
  }

  /**
   * Generate cache key from request parameters
   */
  generateKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params
      ? JSON.stringify(params, Object.keys(params).sort())
      : ''
    return `${endpoint}:${paramString}`
  }

  /**
   * Pre-warm cache with common responses
   */
  async preWarm(
    entries: Array<{ key: string; factory: () => any; ttl?: number }>,
  ) {
    const promises = entries.map(({ key, factory, ttl }) =>
      this.get(key, factory, ttl),
    )
    await Promise.all(promises)
  }

  /**
   * Clear cache entries
   */
  clear(pattern?: string) {
    if (!pattern) {
      this.cache.clear()
      return
    }

    const regex = new RegExp(pattern)
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Invalidate specific cache entries
   */
  invalidate(keys: string | string[]) {
    const keyArray = Array.isArray(keys) ? keys : [keys]
    keyArray.forEach((key) => this.cache.delete(key))
  }

  /**
   * Get cache statistics
   */
  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalComputationTime: 0,
      totalCacheTime: 0,
      hitRate: 0,
      averageComputationTime: 0,
      averageCacheTime: 0,
    }
  }

  /**
   * Get cache size and memory usage estimate
   */
  getCacheInfo() {
    const entries = Array.from(this.cache.entries())
    const memoryEstimate = entries.reduce((total, [key, entry]) => {
      return total + key.length * 2 + this.estimateObjectSize(entry)
    }, 0)

    return {
      entryCount: this.cache.size,
      memoryEstimateBytes: memoryEstimate,
      memoryEstimateMB: (memoryEstimate / 1024 / 1024).toFixed(2),
      oldestEntry: Math.min(...entries.map(([, entry]) => entry.timestamp)),
      newestEntry: Math.max(...entries.map(([, entry]) => entry.timestamp)),
      mostHitEntry: entries.reduce(
        (max, [key, entry]) =>
          entry.hits > max.hits ? { key, hits: entry.hits } : max,
        { key: '', hits: 0 },
      ),
    }
  }

  /**
   * Destroy cache and cleanup timers
   */
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.cache.clear()
  }

  private updateMetrics() {
    this.metrics.hitRate =
      this.metrics.totalRequests > 0
        ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100
        : 0

    this.metrics.averageComputationTime =
      this.metrics.cacheMisses > 0
        ? this.metrics.totalComputationTime / this.metrics.cacheMisses
        : 0

    this.metrics.averageCacheTime =
      this.metrics.cacheHits > 0
        ? this.metrics.totalCacheTime / this.metrics.cacheHits
        : 0
  }

  private enforceMaxEntries() {
    if (this.cache.size <= this.config.maxEntries) return

    // Remove oldest entries
    const entries = Array.from(this.cache.entries())
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp)

    const entriesToRemove = this.cache.size - this.config.maxEntries
    for (let i = 0; i < entriesToRemove && i < entries.length; i++) {
      const entry = entries[i]
      if (entry) {
        this.cache.delete(entry[0])
      }
    }
  }

  private startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredEntries()
    }, this.config.cleanupInterval)
  }

  private cleanupExpiredEntries() {
    const now = Date.now()
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  private estimateObjectSize(obj: any): number {
    // Rough estimate of object size in bytes
    const jsonString = JSON.stringify(obj)
    return jsonString.length * 2 // Assuming UTF-16 encoding
  }
}

// Global cache instance
export const mockCache = new MockResponseCache({
  defaultTTL: 2 * 60 * 1000, // 2 minutes for test environment
  maxEntries: 500,
  enableMetrics: true,
})

// Specialized caches for different types of mock data
export const studentCache = new MockResponseCache({
  defaultTTL: 5 * 60 * 1000,
  maxEntries: 200,
})

export const lessonCache = new MockResponseCache({
  defaultTTL: 3 * 60 * 1000,
  maxEntries: 300,
})

export const quickCache = new MockResponseCache({
  defaultTTL: 30 * 1000, // 30 seconds for frequently changing data
  maxEntries: 100,
})

/**
 * Utility function to create a cached response factory
 */
export function createCachedFactory<T>(
  cache: MockResponseCache,
  keyPrefix: string,
  factory: (params?: any) => T,
) {
  return async (params?: any): Promise<T> => {
    const key = cache.generateKey(keyPrefix, params)
    return cache.get(key, () => factory(params))
  }
}

/**
 * Decorator for caching method results
 */
export function cached(
  cache: MockResponseCache = mockCache,
  ttl?: number,
  keyGenerator?: (...args: any[]) => string,
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator
        ? keyGenerator(...args)
        : cache.generateKey(`${target.constructor.name}.${propertyKey}`, args)

      return cache.get(key, () => originalMethod.apply(this, args), ttl)
    }

    return descriptor
  }
}

// Cleanup function for test teardown
export function cleanupAllCaches() {
  mockCache.clear()
  studentCache.clear()
  lessonCache.clear()
  quickCache.clear()
}

// Reset all caches for test isolation
export function resetAllCaches() {
  mockCache.resetMetrics()
  studentCache.resetMetrics()
  lessonCache.resetMetrics()
  quickCache.resetMetrics()
  cleanupAllCaches()
}

// Print cache performance report
export function printCacheReport() {
  console.log('\n📊 Mock Cache Performance Report:')

  const caches = [
    { name: 'Global Cache', cache: mockCache },
    { name: 'Student Cache', cache: studentCache },
    { name: 'Lesson Cache', cache: lessonCache },
    { name: 'Quick Cache', cache: quickCache },
  ]

  for (const { name, cache } of caches) {
    const metrics = cache.getMetrics()
    const info = cache.getCacheInfo()

    if (metrics.totalRequests === 0) continue

    console.log(`\n  ${name}:`)
    console.log(`    • Requests: ${metrics.totalRequests}`)
    console.log(`    • Hit rate: ${metrics.hitRate.toFixed(1)}%`)
    console.log(`    • Cache entries: ${info.entryCount}`)
    console.log(`    • Memory usage: ${info.memoryEstimateMB}MB`)
    console.log(
      `    • Avg computation time: ${metrics.averageComputationTime.toFixed(2)}ms`,
    )
    console.log(
      `    • Avg cache time: ${metrics.averageCacheTime.toFixed(2)}ms`,
    )

    if (info.mostHitEntry.hits > 0) {
      console.log(
        `    • Most hit entry: ${info.mostHitEntry.key} (${info.mostHitEntry.hits} hits)`,
      )
    }
  }
}
