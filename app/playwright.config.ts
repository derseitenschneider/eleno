import { defineConfig } from '@playwright/test'
import { shareHomeworkConfig } from './tests/share-homework/shareHomeworkConfig'
import { subscriptionsConfig } from './tests/subscriptions/subscriptionsConfig'
import { visualRegressionConfig } from './tests/visual-regression/visualRegressionConfig'
import { accessibilityConfig } from './tests/accessibility/accessibilityConfig'
import { performanceConfig } from './tests/performance/performanceConfig'
import { edgeCaseConfig } from './tests/edge-cases/edgeCaseConfig'
import { crossBrowserConfig } from './tests/cross-browser/crossBrowserConfig'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  webServer: {
    command: `
      VITE_ENV=${process.env.VITE_ENV} \
      VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL} \
      VITE_SUPABASE_KEY=${process.env.VITE_SUPABASE_KEY} \
      VITE_STRIPE_PUBLISHABLE_KEY=${process.env.VITE_STRIPE_PUBLISHABLE_KEY} \
      VITE_API_URL=${process.env.VITE_API_URL} \
      VITE_STRIPE_PRICE_ID_MONTHLY=${process.env.VITE_STRIPE_PRICE_ID_MONTHLY} \
      VITE_STRIPE_PRICE_ID_YEARLY=${process.env.VITE_STRIPE_PRICE_ID_YEARLY} \
      VITE_STRIPE_PRICE_ID_LIFETIME=${process.env.VITE_STRIPE_PRICE_ID_LIFETIME} \    
      npm run build:ci`,
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: process.env.CI
      ? 'http://localhost:5000'
      : process.env.LOCAL_TEST
        ? 'http://localhost:5173'
        : 'https://dev.eleno.net',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      slowMo: process.env.SLOMO ? 1_000 : 0,
    },
  },

  projects: [
    ...subscriptionsConfig,
    ...shareHomeworkConfig,
    ...visualRegressionConfig,
    ...accessibilityConfig,
    ...performanceConfig,
    ...edgeCaseConfig,
    ...crossBrowserConfig,
  ],
})
