import { expect, test } from '@playwright/test'
import { SubscriptionPOM } from '../../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)
  await subscriptionPom.goto()
})

test('plan is "Monatlich" ', async ({ page }) => {
  const { plan } = new SubscriptionPOM(page)

  await expect(plan).toHaveText(/monat/i)
})

test('pricing table title is hidden', async ({ page }) => {
  const { pricingTable } = new SubscriptionPOM(page)
  await expect(pricingTable).not.toBeVisible()
})

test('trial banner is hidden', async ({ page }) => {
  const { trialBanner } = new SubscriptionPOM(page)

  await expect(trialBanner).not.toBeVisible()
})
