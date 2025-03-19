import { type Project, devices } from '@playwright/test'
import { subscriptionStates } from './subscriptionStates'

export const subscriptionsConfig: Array<Project> = [
  {
    name: 'base-teardown',
    testMatch: '**/tests/stripe/teardown.base.ts',
  },
]

subscriptionStates.forEach((subscriptionState) => {
  const { state, access, pricingTable, lifetimeTeaser, manageSubscription } =
    subscriptionState
  const setup: Project = {
    name: `setup-${state}`,
    testMatch: `**/tests/stripe/setup/setup.${state}.ts`,
    teardown: 'base-teardown',
  }
  const test: Project = {
    name: `subscription-${state}`,
    testMatch: [
      `**/tests/stripe/${state}/**/*.spec.ts`,
      `**/tests/stripe/common/access-${access ? 'granted' : 'blocked'}.spec.ts`,
    ],
    dependencies: [`setup-${state}`],
    use: {
      ...devices['Desktop Chrome'],
      storageState: `playwright/.auth/${state}.json`,
    },
  }

  if (Array.isArray(test.testMatch)) {
    if (pricingTable) {
      test.testMatch.push('**/tests/stripe/common/pricing-table/*.spec.ts')
    }

    if (lifetimeTeaser) {
      test.testMatch.push('**/tests/stripe/common/lifetime-teaser/*.spec.ts')
    }

    if (manageSubscription) {
      test.testMatch.push('**/tests/stripe/common/manage-subscription.spec.ts')
    }
  }

  subscriptionsConfig.push(setup, test)
})
