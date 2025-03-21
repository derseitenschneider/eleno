import { type Project, devices } from '@playwright/test'
import { subscriptionStates } from './subscriptionStates'

export const subscriptionsConfig: Array<Project> = [
  {
    name: 'base-teardown',
    testMatch: '**/tests/subscriptions/teardown.base.ts',
  },
]

subscriptionStates.forEach((subscriptionState) => {
  const { state, access, pricingTable, lifetimeTeaser, manageSubscription } =
    subscriptionState
  const setup: Project = {
    name: `setup-${state}`,
    testMatch: `**/tests/subscriptions/setup/setup.${state}.ts`,
    teardown: 'base-teardown',
  }
  const test: Project = {
    name: `subscription-${state}`,
    testMatch: [
      `**/tests/subscriptions/${state}/**/*.spec.ts`,
      `**/tests/subscriptions/common/access-${access ? 'granted' : 'blocked'}.spec.ts`,
    ],
    dependencies: [`setup-${state}`],
    use: {
      ...devices['Desktop Chrome'],
      storageState: `playwright/.auth/${state}.json`,
    },
  }

  if (Array.isArray(test.testMatch)) {
    if (pricingTable) {
      test.testMatch.push(
        '**/tests/subscriptions/common/pricing-table/*.spec.ts',
      )
    }

    if (lifetimeTeaser) {
      test.testMatch.push(
        '**/tests/subscriptions/common/lifetime-teaser/*.spec.ts',
      )
    }

    if (manageSubscription) {
      test.testMatch.push(
        '**/tests/subscriptions/common/manage-subscription.spec.ts',
      )
    }
  }

  subscriptionsConfig.push(setup, test)
})
