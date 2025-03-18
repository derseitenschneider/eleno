import { defineConfig, devices } from '@playwright/test'
import { subscriptionsConfig } from './tests/stripe/subscriptionsConfig'
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    baseURL: process.env.LOCAL_TEST
      ? 'http://localhost:5173'
      : 'https://dev.eleno.net',
    trace: 'on-first-retry',
  },

  projects: [
    ...subscriptionsConfig,
    // {
    //   name: 'setup',
    //   testMatch: /.*\auth.setup\.ts/,
    // },
    // {
    //   name: 'base-teardown',
    //   testMatch: '**/tests/stripe/teardown.base.ts',
    // },
    // {
    //   name: 'setup-trial-active',
    //   testMatch: '**/tests/stripe/setup.trial-active.ts',
    //   teardown: 'base-teardown',
    // },
    // {
    //   name: 'subscription-trial-active',
    //   testMatch: [
    //     '**/tests/stripe/trial/**/*.spec.ts',
    //     '**/tests/stripe/common/pricing-table/**/*.spec.ts',
    //     '**/tests/stripe/common/access-granted.spec.ts',
    //   ],
    //   dependencies: ['setup-trial-active'],
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/trial-active.json',
    //   },
    // },
    // {
    //   name: 'setup-monthly-active',
    //   testMatch: '**/tests/stripe/setup.monthly-active.ts',
    //   teardown: 'base-teardown',
    // },
    // {
    //   name: 'subscription-monthly-active',
    //   testMatch: [
    //     '**/tests/stripe/monthly-active/**/*.spec.ts',
    //     '**/tests/stripe/common/access-granted.spec.ts',
    //   ],
    //   dependencies: ['setup-monthly-active'],
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/monthly-active.json',
    //   },
    // },
  ],
})
