import { test as base } from '@playwright/test'

type MyFixture = {
  trialState: Record<string, string>
}
export const test = base.extend<MyFixture>({
  trialState: async ({ page }, use) => {
    const state = {}
    await use(state)
  },
})
