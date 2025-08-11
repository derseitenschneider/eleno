import { expect, test } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()
})

test('sends correct post data to api.', async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)

  // Intercept api call so we don't create a session.
  subscriptionPom.interceptAPIResponse('**/stripe/customers/**')

  const serverRequestPromise = page.waitForRequest((request) =>
    request.url().includes('stripe/customers'),
  )

  await page.getByRole('button', { name: 'Rechnung herunterladen' }).click()

  const serverRequest = await serverRequestPromise
  const postData = JSON.parse(serverRequest.postData() || '')

  expect(postData.invoiceId).not.toBe('')
})
