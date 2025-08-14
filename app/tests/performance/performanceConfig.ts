import { defineConfig, devices, type Project } from '@playwright/test'

/**
 * Performance Testing Configuration
 *
 * This configuration sets up comprehensive performance testing for the Eleno application,
 * including page load metrics, memory usage monitoring, and large dataset performance testing.
 */

const performanceConfig: Project[] = [
  {
    name: 'performance-chrome',
    use: {
      ...devices['Desktop Chrome'],
      // Enable performance tracing
      trace: 'on',
      // Take screenshots on failure for performance debugging
      screenshot: 'only-on-failure',
      // Video recording for performance analysis
      video: 'retain-on-failure',
      // Channel options for performance monitoring
      channel: 'chrome',
      launchOptions: {
        // Enable performance monitoring flags
        args: [
          '--enable-performance-logging',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--log-level=0',
          '--enable-logging',
          '--v=1',
        ],
      },
    },
    testDir: './tests/performance',
    testMatch: '**/*.performance.spec.ts',
    timeout: 120000, // 2 minutes for performance tests
    expect: {
      timeout: 30000, // 30 seconds for expect assertions
    },
  },
  {
    name: 'performance-memory-profiling',
    use: {
      ...devices['Desktop Chrome'],
      trace: 'on',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      channel: 'chrome',
      launchOptions: {
        args: [
          '--enable-performance-logging',
          '--disable-web-security',
          '--enable-memory-info',
          '--js-flags=--expose-gc',
          '--log-level=0',
        ],
      },
    },
    testDir: './tests/performance',
    testMatch: '**/*.memory.performance.spec.ts',
    timeout: 180000, // 3 minutes for memory profiling
    expect: {
      timeout: 45000,
    },
  },
  {
    name: 'performance-load-testing',
    use: {
      ...devices['Desktop Chrome'],
      trace: 'on',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      channel: 'chrome',
      launchOptions: {
        args: [
          '--enable-performance-logging',
          '--disable-web-security',
          '--max_old_space_size=4096',
          '--log-level=0',
        ],
      },
    },
    testDir: './tests/performance',
    testMatch: '**/*.load.performance.spec.ts',
    timeout: 300000, // 5 minutes for load testing
    expect: {
      timeout: 60000,
    },
  },
]

export { performanceConfig }
