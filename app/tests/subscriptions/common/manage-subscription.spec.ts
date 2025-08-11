import { expect, test } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()
})

test('can go to stripes subscription management page', async ({ page }) => {
  // 1. Intercept stripe server response
  await page.route('https://billing.stripe.com/**', (route) => {
    route.fulfill({
      status: 200,
      body: 'Stripe checkout intercepted',
    })
  })

  // 2. Prepare to wait for the request before taking action
  const stripeRequestPromise = page.waitForRequest((request) =>
    request.url().startsWith('https://billing.stripe.com/'),
  )

  // 3. Take actions that trigger the checkout flow
  await page.getByRole('button', { name: 'Abo verwalten' }).click()

  // 4. Wait for the Stripe request and get its URL
  const stripeRequest = await stripeRequestPromise
  const stripeCheckoutUrl = stripeRequest.url()

  // 5. Run assertions on the URL
  expect(stripeCheckoutUrl).toContain('billing.stripe.com')
})
