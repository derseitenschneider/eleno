import { test, expect } from '@playwright/test'
import { SubscriptionPMO } from '../../../pmo/SubscriptionPMO'

test.describe
  .only('monthly subscription EUR', () => {
    test.beforeEach(async ({ page }) => {
      const subscrptionPMO = new SubscriptionPMO(page)
      subscrptionPMO.goto()
      await subscrptionPMO.currencySwitchEUR.click()
    })

    test('send the right post data to the server', async ({ page }) => {
      const subscriptionPmo = new SubscriptionPMO(page)

      subscriptionPmo.interceptServerResponse()

      const serverRequestPromise = page.waitForRequest((request) =>
        request.url().includes('stripe/session/create'),
      )

      await subscriptionPmo.buttonCheckoutMonthly.click()

      const serverRequest = await serverRequestPromise
      const postData = JSON.parse(serverRequest.postData() || '')

      expect(postData.mode).toBe('subscription')
      expect(postData.currency).toBe('EUR')
      expect(postData.price_id).not.toBe('')
      expect(postData.user_id).not.toBe('')
      expect(postData.stripe_customer_id).not.toBe('')
    })

    test('create a monthly checkout session', async ({ page }) => {
      const subscriptionPmo = new SubscriptionPMO(page)

      subscriptionPmo.interceptStripeResponse()

      // 2. Prepare to wait for the request before taking action
      const stripeRequestPromise = page.waitForRequest((request) =>
        request.url().startsWith('https://checkout.stripe.com/'),
      )

      // 3. Take actions that trigger the checkout flow
      await subscriptionPmo.buttonCheckoutMonthly.click()

      // 4. Wait for the Stripe request and get its URL
      const stripeRequest = await stripeRequestPromise
      const stripeCheckoutUrl = stripeRequest.url()

      // 5. Run assertions on the URL
      expect(stripeCheckoutUrl).toContain('checkout.stripe.com')
    })
  })
