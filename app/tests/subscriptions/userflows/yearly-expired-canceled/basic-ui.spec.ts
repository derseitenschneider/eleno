import { expect, test } from '@playwright/test'
import { SubscriptionPOM } from '../../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  await subscrptionPom.goto()
})

test('subscription status is inactive', async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)

  await expect(subscriptionPom.statusBadge).toHaveText(/inaktiv/i)
})

test('plan is "Jährlich" ', async ({ page }) => {
  const { plan } = new SubscriptionPOM(page)

  await expect(plan).toHaveText(/jährlich/i)
})

test('period start and end hidden', async ({ page }) => {
  const { startDate, endDate } = new SubscriptionPOM(page)

  await expect(startDate).toBeHidden()
  await expect(endDate).toBeHidden()
})

test('pricing table title is visible', async ({ page }) => {
  const { pricingTable } = new SubscriptionPOM(page)
  await expect(pricingTable).toBeVisible()
})

test('lifetime teaser is hidden', async ({ page }) => {
  const { lifetimeTeaser } = new SubscriptionPOM(page)
  await expect(lifetimeTeaser).not.toBeVisible()
})

test('subscription inactive  banner expired is visible', async ({ page }) => {
  const trialBannerExpired = page.getByTestId('banner-subscription-inactive')

  await expect(trialBannerExpired).toBeVisible()
})
