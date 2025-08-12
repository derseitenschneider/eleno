import { expect, test } from '@playwright/test'
import { SubscriptionPOM } from '../../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  await subscrptionPom.goto()
})

test('subscription status is expired', async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)

  await expect(async () => {
    await expect(subscriptionPom.statusBadge).toHaveText(/abgelaufen/i)
    await page.reload()
  }).toPass({ timeout: 30_000 })
})

test('plan is "Jährlich" ', async ({ page }) => {
  const { plan } = new SubscriptionPOM(page)

  await expect(plan).toHaveText(/jährlich/i)
})

test('period start and end are not empty', async ({ page }) => {
  const { startDate, endDate } = new SubscriptionPOM(page)

  await expect(startDate).not.toBeEmpty()
  await expect(endDate).not.toBeEmpty()
})

test('pricing table title is hidden', async ({ page }) => {
  const { pricingTable } = new SubscriptionPOM(page)
  await expect(pricingTable).not.toBeVisible()
})

test('payment-failed banner is visible', async ({ page }) => {
  const { paymentFailedBanner } = new SubscriptionPOM(page)

  await expect(async () => {
    await expect(paymentFailedBanner).toBeVisible()
    await page.reload()
  }).toPass({ timeout: 30_000 })
})

test('payment-failed notification is visible', async ({ page }) => {
  await expect(async () => {
    await expect(page.getByTestId('notification-payment-failed')).toBeVisible()
    await page.reload()
  }).toPass({ timeout: 30_000 })
})
