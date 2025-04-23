import { test, expect } from '@playwright/test'
import { SubscriptionPOM } from '../../../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()
  await subscrptionPom.currencySwitchCHF.click()
})

test('sends correct post data to the api.', async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)

  subscriptionPom.interceptAPIResponse()

  const serverRequestPromise = page.waitForRequest((request) =>
    request.url().includes('stripe/session/create'),
  )

  await subscriptionPom.buttonCheckoutYearly.click()

  const serverRequest = await serverRequestPromise
  const postData = JSON.parse(serverRequest.postData() || '')

  expect(postData.mode).toBe('subscription')
  expect(postData.currency).toBe('CHF')
  expect(postData.price_id).not.toBe('')
  expect(postData.user_id).not.toBe('')
  expect(postData.stripe_customer_id).not.toBe('')
})

test('create a yearly checkout session', async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)

  subscriptionPom.interceptStripeResponse()

  // 2. Prepare to wait for the request before taking action
  const stripeRequestPromise = page.waitForRequest((request) =>
    request.url().startsWith('https://checkout.stripe.com/'),
  )

  // 3. Take actions that trigger the checkout flow
  await subscriptionPom.buttonCheckoutYearly.click()

  // 4. Wait for the Stripe request and get its URL
  const stripeRequest = await stripeRequestPromise
  const stripeCheckoutUrl = stripeRequest.url()

  // 5. Run assertions on the URL
  expect(stripeCheckoutUrl).toContain('checkout.stripe.com')
})
