import { type Project, devices } from '@playwright/test'
import { subscriptionStates } from './subscriptionStates'

export const subscriptionsConfig: Array<Project> = [
  {
    name: 'base-teardown',
    testMatch: '**/tests/subscriptions/teardown.subscriptions.ts',
  },
]

for (const subscriptionState of subscriptionStates) {
  const noTeardown = process.env.NO_TEARDOWN
  const noSetup = process.env.NO_SETUP
  const noTest = process.env.NO_TEST

  const {
    state,
    access,
    pricingTable,
    lifetimeTeaser,
    manageSubscription,
    downloadInvoice,
    chfOnly,
    cancelReactivate,
    reactivateCancel,
  } = subscriptionState

  // Test setup
  const setup: Project = {
    name: `setup-${state}`,
    testMatch: `**/tests/subscriptions/setup/setup.${state}.ts`,
    teardown: noTeardown ? '' : 'base-teardown',
  }

  // Main test
  const test: Project = {
    name: `subscription-${state}`,
    testMatch: noTest
      ? ''
      : [
          `**/tests/subscriptions/userflows/${state}/**/*.spec.ts`,
          `**/tests/subscriptions/common/access-${
            access ? 'granted' : 'blocked'
          }.spec.ts`,
        ],
    dependencies: noSetup ? undefined : [`setup-${state}`],
    use: {
      ...devices['Desktop Chrome'],
      storageState: `playwright/.auth/${state}.json`,
    },
  }

  if (Array.isArray(test.testMatch)) {
    if (pricingTable) {
      test.testMatch.push(
        '**/tests/subscriptions/common/pricing-table/chf/*.spec.ts',
      )

      if (!chfOnly) {
        test.testMatch.push(
          '**/tests/subscriptions/common/pricing-table/eur/*.spec.ts',
        )
      }
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

    if (downloadInvoice) {
      test.testMatch.push(
        '**/tests/subscriptions/common/download-invoice.spec.ts',
      )
    }

    if (cancelReactivate) {
      test.testMatch.push(
        '**/tests/subscriptions/common/cancel-reactivate.spec.ts',
      )
    }

    if (reactivateCancel) {
      test.testMatch.push(
        '**/tests/subscriptions/common/reactivate-cancel.spec.ts',
      )
    }
  }

  subscriptionsConfig.push(setup, test)
}
