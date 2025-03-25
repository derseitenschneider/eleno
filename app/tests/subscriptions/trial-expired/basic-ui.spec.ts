import { test, expect } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  await subscrptionPom.goto()
})

test('subscription status is inactive', async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)

  await expect(subscriptionPom.statusBadge).toHaveText(/inaktiv/i)
})

test('plan is "Testabo" ', async ({ page }) => {
  const { plan } = new SubscriptionPOM(page)

  await expect(plan).toHaveText(/test/i)
})

test('period start and end are not empty', async ({ page }) => {
  const { startDate, endDate } = new SubscriptionPOM(page)

  await expect(startDate).not.toBeEmpty()
  await expect(endDate).not.toBeEmpty()
})

test('pricing table title is visible', async ({ page }) => {
  const { pricingTable } = new SubscriptionPOM(page)
  await expect(pricingTable).toBeVisible()
})

test('lifetime teaser is hidden', async ({ page }) => {
  const { lifetimeTeaser } = new SubscriptionPOM(page)
  await expect(lifetimeTeaser).not.toBeVisible()
})

test('trial banner expired is visible', async ({ page }) => {
  const trialBannerExpired = page.getByTestId('banner-trial-expired')

  await expect(trialBannerExpired).toBeVisible()
})
