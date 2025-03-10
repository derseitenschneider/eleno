import { test, expect, type Request } from '@playwright/test'
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
    test.only('it creates a monthly checkout session for CHF', async ({
      page,
    }) => {
      const subscriptionPmo = new SubscriptionPMO(page)

      // 1. Set up to intercept navigation to Stripe (prevents actually going to Stripe)
      await page.route('https://checkout.stripe.com/**', (route) => {
        route.fulfill({
          status: 200,
          body: 'Stripe checkout intercepted',
        })
      })

      // 2. Prepare to wait for the request before taking action
      const stripeRequestPromise = page.waitForRequest((request) =>
        request.url().startsWith('https://checkout.stripe.com/'),
      )

      // 3. Take actions that trigger the checkout flow
      await subscriptionPmo.currencySwitchCHF.click()
      await subscriptionPmo.buttonCheckoutMonthly.click()

      // 4. Wait for the Stripe request and get its URL
      const stripeRequest = await stripeRequestPromise
      const stripeCheckoutUrl = stripeRequest.url()
      console.log(stripeCheckoutUrl)

      // 5. Run assertions on the URL
      expect(stripeCheckoutUrl).toContain('checkout.stripe.com')
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
