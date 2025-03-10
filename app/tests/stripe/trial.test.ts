import { test, expect } from '@playwright/test'
import { SubscriptionPMO } from '../pmo/SubscriptionPMO'

test.describe('trial user', () => {
  test.beforeEach(async ({ page }) => {
    const subscrptionPMO = new SubscriptionPMO(page)
    subscrptionPMO.goto()
  })

  test.describe('show correct elements on subscrition page', () => {
    test('subscription status should be active', async ({ page }) => {
      const subscriptionPmo = new SubscriptionPMO(page)

      await expect(subscriptionPmo.statusBadge).toHaveText(/aktiv/i)
    })

    test('plan should be "Testabo" ', async ({ page }) => {
      const { plan } = new SubscriptionPMO(page)

      await expect(plan).toHaveText(/test/i)
    })

    test('period start and end should not be empty', async ({ page }) => {
      const { startDate } = new SubscriptionPMO(page)
      const { endDate } = new SubscriptionPMO(page)

      await expect(startDate).not.toBeEmpty()
      await expect(endDate).not.toBeEmpty()
    })

    test('pricing table title should be visible', async ({ page }) => {
      const { pricingTitle } = new SubscriptionPMO(page)
      await expect(pricingTitle).toBeVisible()
    })
  })

  test.describe('upgrade', () => {
    test('it creates a monthly checkout session for CHF', async ({ page }) => {
      const navigationPromise = page.waitForURL('**/checkout.stripe.com/**', {
        timeout: 10000,
      })

      await page.getByTestId('currency-switcher-chf').click()
      await page.getByTestId('pricing-checkout-monthly').click()

      await navigationPromise

      // Verify we're on the Stripe page
      const url = page.url()
      expect(url).toContain('checkout.stripe.com')
    })

    test('it creates a yearly checkout session for CHF', async ({ page }) => {
      const navigationPromise = page.waitForURL('**/checkout.stripe.com/**', {
        timeout: 10000,
      })

      await page.getByTestId('currency-switcher-chf').click()
      await page.getByTestId('pricing-checkout-yearly').click()

      await navigationPromise

      // Verify we're on the Stripe page
      const url = page.url()
      expect(url).toContain('checkout.stripe.com')
    })

    test('it creates a lifetime checkout session for CHF', async ({ page }) => {
      const navigationPromise = page.waitForURL('**/checkout.stripe.com/**', {
        timeout: 10000,
      })

      await page.getByTestId('currency-switcher-chf').click()
      await page.getByTestId('pricing-checkout-lifetime').click()

      await navigationPromise

      // Verify we're on the Stripe page
      const url = page.url()
      expect(url).toContain('checkout.stripe.com')
    })
  })
  //TODO: EUR checkouts

  test.describe('user has access to otherwise blocked functionality', () => {
    test.fixme('create lesson is not blocked', () => { })
    test.fixme('edit lesson is not blocked', () => { })
    test.fixme('delete lesson is not blocked', () => { })
    test.fixme('create student is not blocked', () => { })
    //...
  })
})
