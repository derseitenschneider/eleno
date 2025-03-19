import { type Project, devices } from '@playwright/test'

export const subscriptionsConfig: Array<Project> = [
  {
    name: 'base-teardown',
    testMatch: '**/tests/stripe/teardown.base.ts',
  },
  {
    name: 'setup-trial-active',
    testMatch: '**/tests/stripe/setup.trial-active.ts',
    teardown: 'base-teardown',
  },
  {
    name: 'subscription-trial-active',
    testMatch: [
      '**/tests/stripe/trial/**/*.spec.ts',
      '**/tests/stripe/common/pricing-table/**/*.spec.ts',
      '**/tests/stripe/common/access-granted.spec.ts',
    ],
    dependencies: ['setup-trial-active'],
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/trial-active.json',
    },
  },
  {
    name: 'setup-monthly-active',
    testMatch: '**/tests/stripe/setup.monthly-active.ts',
    teardown: 'base-teardown',
  },
  {
    name: 'subscription-monthly-active',
    testMatch: [
      '**/tests/stripe/monthly-active/**/*.spec.ts',
      '**/tests/stripe/common/access-granted.spec.ts',
    ],
    dependencies: ['setup-monthly-active'],
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/monthly-active.json',
    },
  },
]
