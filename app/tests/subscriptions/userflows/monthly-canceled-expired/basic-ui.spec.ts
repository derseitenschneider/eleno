import { expect } from '@playwright/test'
import { test } from '../../../fixture'
import { SubscriptionPOM } from '../../../pom/SubscriptionPOM'

test.beforeEach(async ({ forwardOneMonth }) => {
  const subscrptionPom = new SubscriptionPOM(forwardOneMonth)
  await subscrptionPom.goto()
})

test('subscription status is inactive', async ({ forwardOneMonth }) => {
  const subscriptionPom = new SubscriptionPOM(forwardOneMonth)

  await expect(subscriptionPom.statusBadge).toHaveText(/inaktiv/i)
})

test('plan is "Monatlich" ', async ({ forwardOneMonth }) => {
  const { plan } = new SubscriptionPOM(forwardOneMonth)

  await expect(plan).toHaveText(/monat/i)
})

test('period start and end hidden', async ({ forwardOneMonth }) => {
  const { startDate, endDate } = new SubscriptionPOM(forwardOneMonth)

  await expect(startDate).toBeHidden()
  await expect(endDate).toBeHidden()
})

test('pricing table title is visible', async ({ forwardOneMonth }) => {
  const { pricingTable } = new SubscriptionPOM(forwardOneMonth)
  await expect(pricingTable).toBeVisible()
})

test('lifetime teaser is hidden', async ({ forwardOneMonth }) => {
  const { lifetimeTeaser } = new SubscriptionPOM(forwardOneMonth)
  await expect(lifetimeTeaser).not.toBeVisible()
})

test('subscription inactive  banner expired is visible', async ({
  forwardOneMonth,
}) => {
  const trialBannerExpired = forwardOneMonth.getByTestId(
    'banner-subscription-inactive',
  )

  await expect(trialBannerExpired).toBeVisible()
})
