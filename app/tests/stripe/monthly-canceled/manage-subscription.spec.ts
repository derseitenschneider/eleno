import { test, expect, type Route } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()
})

test('can go to stripes subscription management page', async ({ page }) => {
  await page.route('**/stripe/customers/**', async (route: Route) => {
    const response = await route.fetch()
    const body = await response.body()

    const responseJson = JSON.parse(body.toString())
    const portalUrl = responseJson.data.url
    expect(portalUrl).toContain('billing.stripe.com')
    await route.continue()
  })

  const responsePromise = page.waitForResponse('**/stripe/customers/**')

  await page.getByRole('button', { name: 'Abo verwalten' }).click()

  await responsePromise
})
