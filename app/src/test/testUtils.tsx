/**
 * Optimized Test Utilities with Provider Chain Optimization
 *
 * This module provides high-performance test utilities that:
 * - Use memoized providers to avoid unnecessary re-renders
 * - Support selective provider rendering for lighter tests
 * - Implement provider pooling and reuse strategies
 * - Provide performance monitoring for render operations
 * - Support minimal test environments for faster execution
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderOptions, render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Performance tracking
interface RenderMetrics {
  renderCount: number
  totalRenderTime: number
  averageRenderTime: number
  providerInitTime: number
  queryClientCreations: number
}

let renderMetrics: RenderMetrics = {
  renderCount: 0,
  totalRenderTime: 0,
  averageRenderTime: 0,
  providerInitTime: 0,
  queryClientCreations: 0,
}

// Provider component cache for reuse
const providerCache = new Map<
  string,
  React.ComponentType<{ children: ReactNode }>
>()

// Optimized mock providers with memoization
export const OptimizedMockUserLocaleProvider = memo(
  ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  },
)
OptimizedMockUserLocaleProvider.displayName = 'OptimizedMockUserLocaleProvider'

export const OptimizedMockLoadingProvider = memo(
  ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  },
)
OptimizedMockLoadingProvider.displayName = 'OptimizedMockLoadingProvider'

export const OptimizedMockAuthProvider = memo(
  ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  },
)
OptimizedMockAuthProvider.displayName = 'OptimizedMockAuthProvider'

export const OptimizedMockSubscriptionProvider = memo(
  ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  },
)
OptimizedMockSubscriptionProvider.displayName =
  'OptimizedMockSubscriptionProvider'

export const OptimizedMockMainContext = memo(
  ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  },
)
OptimizedMockMainContext.displayName = 'OptimizedMockMainContext'

export const OptimizedMockDarkModeProvider = memo(
  ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  },
)
OptimizedMockDarkModeProvider.displayName = 'OptimizedMockDarkModeProvider'

// Cached QueryClient instances with different configurations
const queryClientCache = new Map<string, QueryClient>()

function getOrCreateQueryClient(
  config?: 'fast' | 'standard' | 'minimal',
): QueryClient {
  const cacheKey = config || 'standard'

  if (queryClientCache.has(cacheKey)) {
    return queryClientCache.get(cacheKey)!
  }

  let queryClient: QueryClient

  switch (config) {
    case 'fast':
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
            staleTime: 0,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
          },
          mutations: {
            retry: false,
          },
        },
      })
      break

    case 'minimal':
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
            staleTime: Number.POSITIVE_INFINITY, // Never refetch in minimal mode
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            networkMode: 'always',
          },
          mutations: {
            retry: false,
            networkMode: 'always',
          },
        },
      })
      break

    default:
      queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
          },
          mutations: {
            retry: false,
          },
        },
      })
  }

  queryClientCache.set(cacheKey, queryClient)
  renderMetrics.queryClientCreations++

  return queryClient
}

// Provider configuration options
interface ProviderConfig {
  queryClientMode?: 'fast' | 'standard' | 'minimal'
  enableRouter?: boolean
  enableAuth?: boolean
  enableSubscription?: boolean
  enableLoading?: boolean
  enableDarkMode?: boolean
  enableMainContext?: boolean
  enableUserLocale?: boolean
}

// Optimized provider chain with selective rendering
interface OptimizedTestProviderProps {
  children: ReactNode
  initialEntries?: string[]
  queryClient?: QueryClient
  config?: ProviderConfig
}

export const OptimizedTestProviders = memo(
  ({
    children,
    initialEntries = ['/'],
    queryClient: customQueryClient,
    config = {},
  }: OptimizedTestProviderProps) => {
    const {
      queryClientMode = 'standard',
      enableRouter = true,
      enableAuth = true,
      enableSubscription = true,
      enableLoading = true,
      enableDarkMode = true,
      enableMainContext = true,
      enableUserLocale = true,
    } = config

    const queryClient = useMemo(() => {
      return customQueryClient || getOrCreateQueryClient(queryClientMode)
    }, [customQueryClient, queryClientMode])

    const wrappedChildren = useMemo(() => {
      let content = children

      // Apply providers in reverse order (innermost first)
      if (enableDarkMode) {
        content = (
          <OptimizedMockDarkModeProvider>
            {content}
          </OptimizedMockDarkModeProvider>
        )
      }

      if (enableMainContext) {
        content = <OptimizedMockMainContext>{content}</OptimizedMockMainContext>
      }

      if (enableSubscription) {
        content = (
          <OptimizedMockSubscriptionProvider>
            {content}
          </OptimizedMockSubscriptionProvider>
        )
      }

      if (enableAuth) {
        content = (
          <OptimizedMockAuthProvider>{content}</OptimizedMockAuthProvider>
        )
      }

      if (enableLoading) {
        content = (
          <OptimizedMockLoadingProvider>{content}</OptimizedMockLoadingProvider>
        )
      }

      if (enableUserLocale) {
        content = (
          <OptimizedMockUserLocaleProvider>
            {content}
          </OptimizedMockUserLocaleProvider>
        )
      }

      // QueryClient provider (always needed if any providers are enabled)
      content = (
        <QueryClientProvider client={queryClient}>
          {content}
        </QueryClientProvider>
      )

      // Router provider (outer most)
      if (enableRouter) {
        content = <BrowserRouter>{content}</BrowserRouter>
      }

      return content
    }, [
      children,
      queryClient,
      enableRouter,
      enableAuth,
      enableSubscription,
      enableLoading,
      enableDarkMode,
      enableMainContext,
      enableUserLocale,
    ])

    return <>{wrappedChildren}</>
  },
)
OptimizedTestProviders.displayName = 'OptimizedTestProviders'

// Standard test provider configurations
export const FullTestProviders = memo(
  ({ children, ...props }: OptimizedTestProviderProps) => (
    <OptimizedTestProviders {...props}>{children}</OptimizedTestProviders>
  ),
)
FullTestProviders.displayName = 'FullTestProviders'

export const MinimalTestProviders = memo(
  ({ children, ...props }: OptimizedTestProviderProps) => (
    <OptimizedTestProviders
      {...props}
      config={{
        queryClientMode: 'minimal',
        enableAuth: false,
        enableSubscription: false,
        enableLoading: false,
        enableDarkMode: false,
        enableMainContext: false,
        enableUserLocale: false,
        ...props.config,
      }}
    >
      {children}
    </OptimizedTestProviders>
  ),
)
MinimalTestProviders.displayName = 'MinimalTestProviders'

export const FastTestProviders = memo(
  ({ children, ...props }: OptimizedTestProviderProps) => (
    <OptimizedTestProviders
      {...props}
      config={{
        queryClientMode: 'fast',
        ...props.config,
      }}
    >
      {children}
    </OptimizedTestProviders>
  ),
)
FastTestProviders.displayName = 'FastTestProviders'

// Custom render options with performance tracking
interface OptimizedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  queryClient?: QueryClient
  config?: ProviderConfig
  wrapper?: React.ComponentType<any>
  trackPerformance?: boolean
}

/**
 * High-performance render function with provider optimization
 */
export function renderWithProviders(
  ui: ReactElement,
  options: OptimizedRenderOptions = {},
) {
  const {
    initialEntries,
    queryClient,
    config,
    wrapper: Wrapper,
    trackPerformance = true,
    ...renderOptions
  } = options

  const startTime = trackPerformance ? performance.now() : 0

  // Don't cache providers when custom queryClient is provided
  let AllTheProviders: React.ComponentType<{ children: ReactNode }>

  if (queryClient) {
    // Create a fresh provider wrapper for custom queryClient
    AllTheProviders = ({ children }: { children: ReactNode }) => {
      if (Wrapper) {
        return (
          <OptimizedTestProviders
            initialEntries={initialEntries}
            queryClient={queryClient}
            config={config}
          >
            <Wrapper>{children}</Wrapper>
          </OptimizedTestProviders>
        )
      }
      return (
        <OptimizedTestProviders
          initialEntries={initialEntries}
          queryClient={queryClient}
          config={config}
        >
          {children}
        </OptimizedTestProviders>
      )
    }
  } else {
    // Use caching for default queryClient
    const cacheKey = JSON.stringify({ config, hasWrapper: !!Wrapper })

    const cachedProvider = providerCache.get(cacheKey)

    if (!cachedProvider) {
      AllTheProviders = ({ children }: { children: ReactNode }) => {
        if (Wrapper) {
          return (
            <OptimizedTestProviders
              initialEntries={initialEntries}
              queryClient={queryClient}
              config={config}
            >
              <Wrapper>{children}</Wrapper>
            </OptimizedTestProviders>
          )
        }
        return (
          <OptimizedTestProviders
            initialEntries={initialEntries}
            queryClient={queryClient}
            config={config}
          >
            {children}
          </OptimizedTestProviders>
        )
      }

      providerCache.set(cacheKey, AllTheProviders)
    } else {
      AllTheProviders = cachedProvider
    }
  }

  const result = render(ui, { wrapper: AllTheProviders, ...renderOptions })

  if (trackPerformance) {
    const renderTime = performance.now() - startTime
    renderMetrics.renderCount++
    renderMetrics.totalRenderTime += renderTime
    renderMetrics.averageRenderTime =
      renderMetrics.totalRenderTime / renderMetrics.renderCount
  }

  return result
}

/**
 * Minimal render function for simple tests (fastest option)
 */
export function renderMinimal(
  ui: ReactElement,
  options: OptimizedRenderOptions = {},
) {
  return renderWithProviders(ui, {
    ...options,
    config: {
      queryClientMode: 'minimal',
      enableAuth: false,
      enableSubscription: false,
      enableLoading: false,
      enableDarkMode: false,
      enableMainContext: false,
      enableUserLocale: false,
      ...options.config,
    },
  })
}

/**
 * Fast render function with optimized query client
 */
export function renderFast(
  ui: ReactElement,
  options: OptimizedRenderOptions = {},
) {
  return renderWithProviders(ui, {
    ...options,
    config: {
      queryClientMode: 'fast',
      ...options.config,
    },
  })
}

/**
 * Router-only render function for routing tests
 */
export function renderWithRouter(
  ui: ReactElement,
  options: OptimizedRenderOptions = {},
) {
  return renderWithProviders(ui, {
    ...options,
    config: {
      queryClientMode: 'minimal',
      enableAuth: false,
      enableSubscription: false,
      enableLoading: false,
      enableDarkMode: false,
      enableMainContext: false,
      enableUserLocale: false,
      enableRouter: true,
      ...options.config,
    },
  })
}

/**
 * Performance monitoring utilities
 */
export function getRenderMetrics(): RenderMetrics {
  return { ...renderMetrics }
}

export function resetRenderMetrics() {
  renderMetrics = {
    renderCount: 0,
    totalRenderTime: 0,
    averageRenderTime: 0,
    providerInitTime: 0,
    queryClientCreations: 0,
  }
}

export function printRenderReport() {
  console.log('\n🎭 Render Performance Report:')
  console.log(`  • Total renders: ${renderMetrics.renderCount}`)
  console.log(
    `  • Average render time: ${renderMetrics.averageRenderTime.toFixed(2)}ms`,
  )
  console.log(
    `  • Total render time: ${renderMetrics.totalRenderTime.toFixed(2)}ms`,
  )
  console.log(
    `  • QueryClient instances created: ${renderMetrics.queryClientCreations}`,
  )
  console.log(`  • Provider cache entries: ${providerCache.size}`)
  console.log(`  • QueryClient cache entries: ${queryClientCache.size}`)
}

/**
 * Performance wrapper for timing render operations
 */
export function withRenderTiming<T extends (...args: any[]) => any>(
  renderFn: T,
  label?: string,
): T {
  return ((...args: any[]) => {
    const start = performance.now()
    const result = renderFn(...args)
    const end = performance.now()

    if (label) {
      console.log(`⏱️  ${label}: ${(end - start).toFixed(2)}ms`)
    }

    return result
  }) as T
}

/**
 * Cleanup functions for test teardown
 */
export function cleanupProviderCache() {
  providerCache.clear()
}

export function cleanupQueryClientCache() {
  // Clear all query clients
  for (const client of queryClientCache.values()) {
    client.clear()
  }
  queryClientCache.clear()
}

export function cleanupAllTestUtils() {
  cleanupProviderCache()
  cleanupQueryClientCache()
  resetRenderMetrics()
}

/**
 * Batch render function for performance testing
 */
export async function batchRender(
  renderFn: () => void,
  iterations: number,
  batchSize = 10,
): Promise<{ totalTime: number; averageTime: number; batchResults: number[] }> {
  const batchResults: number[] = []
  const totalStart = performance.now()

  for (let i = 0; i < iterations; i += batchSize) {
    const batchStart = performance.now()
    const currentBatchSize = Math.min(batchSize, iterations - i)

    for (let j = 0; j < currentBatchSize; j++) {
      renderFn()
    }

    const batchTime = performance.now() - batchStart
    batchResults.push(batchTime)

    // Yield control between batches
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  const totalTime = performance.now() - totalStart
  const averageTime = totalTime / iterations

  return {
    totalTime,
    averageTime,
    batchResults,
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Export optimized render as default render
export { renderWithProviders as render }
