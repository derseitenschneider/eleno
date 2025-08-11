import { type Page, test as base } from '@playwright/test'

type ForwardPage = {
  forwardTime: (duration: number) => Promise<void>
  forwardOneMonth: Page
  forwardOneYear: Page
}

export const test = base.extend<ForwardPage>({
  forwardTime: async ({ page }, use) => {
    await page.clock.install()

    const forwardTimeFunc = async (durationMs: number) => {
      await page.clock.runFor(durationMs)
    }
    await use(forwardTimeFunc)
  },

  forwardOneMonth: async ({ page }, use) => {
    await page.clock.install()

    await page.clock.runFor(32 * 24 * 60 * 60 * 1000)
    use(page)
  },

  forwardOneYear: async ({ page }, use) => {
    await page.clock.install()
    await page.clock.runFor(366 * 24 * 60 * 60 * 1000)
    use(page)
  },
})
