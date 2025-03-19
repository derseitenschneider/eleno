import { type Project, devices } from '@playwright/test'
type SubscriptionStates = {
  state: string
  hasAccess: boolean
}
const subscriptionStates: Array<SubscriptionStates> = [
  // { state: 'trial-active', hasAccess: true },
  { state: 'monthly-active', hasAccess: true },
  { state: 'monthly-canceled', hasAccess: true },
]

export const subscriptionsConfig: Array<Project> = [
  {
    name: 'base-teardown',
    testMatch: '**/tests/stripe/teardown.base.ts',
  },
]

subscriptionStates.forEach((subscriptionState) => {
  const { state, hasAccess } = subscriptionState
  const setup = {
    name: `setup-${state}`,
    testMatch: `**/tests/stripe/setup/setup.${state}.ts`,
    teardown: 'base-teardown',
  }
  const test = {
    name: `subscription-${state}`,
    testMatch: [
      `**/tests/stripe/${state}/**/*.spec.ts`,
      `**/tests/stripe/common/access-${hasAccess ? 'granted' : 'blocked'}.spec.ts`,
    ],
    dependencies: [`setup-${state}`],
    use: {
      ...devices['Desktop Chrome'],
      storageState: `playwright/.auth/${state}.json`,
    },
  }

  subscriptionsConfig.push(setup, test)
})
