import { test, expect, type Request } from '@playwright/test'
import { SubscriptionPMO } from '../../../pmo/SubscriptionPMO'

test.describe('show correct UI on subscrition page', () => {
  test.beforeEach(async ({ page }) => {
    const subscrptionPMO = new SubscriptionPMO(page)
    subscrptionPMO.goto()
  })

  test('subscription status is active', async ({ page }) => {
    const subscriptionPmo = new SubscriptionPMO(page)

    await expect(subscriptionPmo.statusBadge).toHaveText(/aktiv/i)
  })

  test('plan is "Testabo" ', async ({ page }) => {
    const { plan } = new SubscriptionPMO(page)

    await expect(plan).toHaveText(/test/i)
  })

  test('period start and end are not empty', async ({ page }) => {
    const { startDate } = new SubscriptionPMO(page)
    const { endDate } = new SubscriptionPMO(page)

    await expect(startDate).not.toBeEmpty()
    await expect(endDate).not.toBeEmpty()
  })

  test('pricing table title is visible', async ({ page }) => {
    const { pricingTitle } = new SubscriptionPMO(page)
    await expect(pricingTitle).toBeVisible()
  })

  test('trial banner with correct number of days is visible', async ({
    page,
  }) => {
    const { trialBanner } = new SubscriptionPMO(page)

    await expect(trialBanner).toBeVisible()
    await expect(trialBanner).toContainText('30')
  })
})
