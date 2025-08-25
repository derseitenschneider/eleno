import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    outputFile: {
      json: './test-results/vitest-results.json',
      junit: './test-results/vitest-junit.xml',
    },
    reporter: ['default', 'json'],
    // Parallel execution configuration with better isolation
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4, // Reduced to minimize race conditions
        minThreads: 1,
        isolate: true, // Better isolation between threads
        useAtomics: true,
      },
    },
    maxConcurrency: 3, // Reduced concurrency for stability
    fileParallelism: true,
    // Test timeout settings for async operations
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/',
        '**/dist/',
        '**/*.stories.*',
        '**/*.spec.*',
        '**/*.test.*',
        'src/vite-env.d.ts',
        'src/types/global.d.ts',
        'src/types/supabase-fix.d.ts',
        // UI-only components with minimal logic
        'src/components/ui/Logo.component.tsx',
        'src/components/ui/GoogleLogo.component.tsx',
        'src/assets/**',
        // Development utilities
        'src/initializeServiceWorker.ts',
        'src/main.tsx',
      ],
      include: [
        'src/**/*.{ts,tsx}',
        '!src/test/**',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
      ],
      all: true,
      // Comprehensive threshold configuration
      thresholds: {
        // Global minimums - builds fail if not met
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Per-file thresholds with enforcement
        perFile: true,
        // Critical business logic paths - stricter requirements
        '**/services/api/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        '**/services/context/**': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        '**/hooks/**': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        '**/utils/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        // Core business components
        '**/components/features/**': {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75,
        },
        // Router and navigation
        '**/router/**': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        // UI components - relaxed but still enforced
        '**/components/ui/**': {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
      },
      // Enhanced watermarks for better visualization
      watermarks: {
        statements: [80, 95],
        functions: [80, 95],
        branches: [80, 95],
        lines: [80, 95],
      },
      // Fail build if any threshold is not met
      skipFull: false,
      // Include uncovered files in reports
      reportOnFailure: true,
      // Generate detailed coverage reports
      cleanOnRerun: true,
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
