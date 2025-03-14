import { test, expect } from '@playwright/test'
import { SubscriptionPMO } from '../../../pmo/SubscriptionPMO'

test.beforeEach(async ({ page }) => {
  const subscriptionPmo = new SubscriptionPMO(page)
  await subscriptionPmo.goto()
})

test.skip('subscription status is expiring', async ({ page }) => {
  const subscriptionPmo = new SubscriptionPMO(page)

  await expect(subscriptionPmo.statusBadge).toHaveText(/auslaufen/i)
})

test.skip('plan is "Monatlich" ', async ({ page }) => {
  const { plan } = new SubscriptionPMO(page)

  await expect(plan).toHaveText(/monat/i)
})

test.skip('period start and end are not empty', async ({ page }) => {
  const { startDate } = new SubscriptionPMO(page)
  const { endDate } = new SubscriptionPMO(page)

  await expect(startDate).not.toBeEmpty()
  await expect(endDate).not.toBeEmpty()
})

test.skip('pricing table title is hidden', async ({ page }) => {
  const { pricingTable } = new SubscriptionPMO(page)
  await expect(pricingTable).not.toBeVisible()
})

test.skip('upgrade to lifetime section to be visible', async ({ page }) => {
  const { lifetimeTeaser } = new SubscriptionPMO(page)
  await expect(lifetimeTeaser).toBeVisible()
})

test.skip('trial banner is hidden', async ({ page }) => {
  const { trialBanner } = new SubscriptionPMO(page)

  await expect(trialBanner).not.toBeVisible()
})
