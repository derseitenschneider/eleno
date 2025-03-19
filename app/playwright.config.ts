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
  ],
})
