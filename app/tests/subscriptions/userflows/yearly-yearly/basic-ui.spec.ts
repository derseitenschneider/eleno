import { test, expect } from '@playwright/test'
import { SubscriptionPOM } from '../../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)
  await subscriptionPom.goto()
})

test('plan is "Jährlich" ', async ({ page }) => {
  const { plan } = new SubscriptionPOM(page)

  await expect(plan).toHaveText(/jährlich/i)
})

test('period start and end are not empty', async ({ page }) => {
  const { startDate } = new SubscriptionPOM(page)
  const { endDate } = new SubscriptionPOM(page)

  await expect(startDate).not.toBeEmpty()
  await expect(endDate).not.toBeEmpty()
})

test('pricing table title is hidden', async ({ page }) => {
  const { pricingTable } = new SubscriptionPOM(page)
  await expect(pricingTable).not.toBeVisible()
})

test('upgrade to lifetime section to be visible', async ({ page }) => {
  const { lifetimeTeaser } = new SubscriptionPOM(page)
  await expect(lifetimeTeaser).toBeVisible()
})

test('trial banner is hidden', async ({ page }) => {
  const { trialBanner } = new SubscriptionPOM(page)

  await expect(trialBanner).not.toBeVisible()
})
