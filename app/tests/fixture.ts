import { test as base, type Page } from '@playwright/test'

export const test = base.extend<{ forwardOneMonth: Page }>({
  forwardOneMonth: async ({ page }, use) => {
    await page.clock.install()
    await page.clock.runFor(32 * 24 * 60 * 60 * 1000)
    await use(page)
  },
})
