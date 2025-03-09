import { test, expect } from '@playwright/test'
import { request } from 'http'

test.describe('trial user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('localhost:5173')
    await page.getByTestId('sidebar-nav-settings').click()
    await page.getByTestId('settings-nav-subscription').click()
  })

  test.describe('show correct settings page', () => {
    test('it shows that it status is active', async ({ page }) => {
      const statusBadge = page.getByTestId('subscription-status-badge')
      expect(statusBadge).toHaveText('aktiv', {
        ignoreCase: true,
      })
    })

    test('it shows pricing plans', async ({ page }) => {
      const pricingTable = page.getByTestId('pricing-table')

      expect(pricingTable).toBeVisible()
    })
  })

  test.describe('upgrade', () => {
    test('it creates a monthly checkout session for CHF', async ({ page }) => {
      await page.getByTestId('currency-switcher-chf').click()
      await page.getByTestId('pricing-checkout-monthly').click()

      // await page.route('**/stripe/session/create', async (route) => {
      await page.route('checkout.stripe.com/**', async (route) => {
        const response = await route.fetch()
        const responseBody = await response.json()

        expect(response.status()).toBe('exsdfasdf')
        expect(responseBody.data.url).toContain('checkout.stripe.com/**')

        await route.continue()
      })
      await page.waitForTimeout(2000)
    })
  })
})
