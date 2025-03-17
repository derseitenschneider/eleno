import { defineConfig, devices } from '@playwright/test'
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
    // {
    //   name: 'setup',
    //   testMatch: /.*\auth.setup\.ts/,
    // },
    {
      name: 'setup-trial',
      testMatch: '**/tests/stripe/setup.trial.ts',
      teardown: 'teardown-trial',
    },
    {
      name: 'teardown-trial',
      testMatch: '**/tests/stripe/teardown.trial.ts',
    },
    {
      name: 'trial',
      testMatch: [
        // '**/tests/stripe/trial/**/*.spec.ts',
        // '**/tests/stripe/common/pricing-table/**/*.spec.ts',
        '**/tests/stripe/common/access-granted.spec.ts',
      ],
      dependencies: ['setup-trial'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
    },
    // {
    //   name: 'monthly-active',
    //   testMatch: [
    //     '**/tests/stripe/monthly-active/**/*.spec.ts',
    //     '**/tests/stripe/common/lifetime-teaser/**/*.spec.ts',
    //     '**/tests/stripe/common/access-granted.spec.ts',
    //     '**/tests/stripe/common/manage-subscription/manage-active.spec.ts',
    //   ],
    //   dependencies: ['setup'],
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    // },
  ],
})
