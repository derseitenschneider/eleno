import { test, expect } from '@playwright/test'

test.describe('trial user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.goto('/settings/subscription')
    await expect(page.locator('#loader')).toBeHidden()
  })

  test.describe('show correct elements on subscrition page', () => {
    test('it shows that it status is active.', async ({ page }) => {
      const statusBadge = page.getByTestId('subscription-status-badge')

      await expect(statusBadge).toHaveText(/aktiv/i)
    })

    test('it shows correct subscription plan.', async ({ page }) => {
      const plan = page.getByTestId('subscription-plan')

      await expect(plan).toHaveText(/test/i)
    })

    test('it shows subscription period.', async ({ page }) => {
      const startDate = page.getByTestId('subscription-period-start')
      const endDate = page.getByTestId('subscription-period-end')

      await expect(startDate).not.toBeEmpty()
      await expect(endDate).not.toBeEmpty()
    })

    test('it shows pricing table.', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'upgrade' })
      await expect(heading).toBeVisible()
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

  test.describe('user has access to otherwise blocked functionality', () => {
    test.fixme('create lesson is not blocked', () => { })
    test.fixme('edit lesson is not blocked', () => { })
    test.fixme('delete lesson is not blocked', () => { })
    test.fixme('create student is not blocked', () => { })
    //...
  })
})
