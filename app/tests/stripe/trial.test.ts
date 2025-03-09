import { test, expect } from '@playwright/test'

test.describe('trial user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // await page.goto('/settings/subscription')
    // await page.locator('#loader').waitFor({ state: 'hidden' })
    await expect(page.locator('#loader')).toBeHidden()
    await page.getByTestId('sidebar-nav-settings').click()
    await page.getByTestId('settings-nav-subscription').click()
  })

  test.describe('show correct settings page', () => {
    test('it shows that it status is active', async ({ page }) => {
      const statusBadge = page.getByText('Aktiv')

      expect(statusBadge).toBeVisible()
      // const statusBadge = page.getByTestId('subscription-status-badge')
      // expect(statusBadge).toBeVisible()
      // expect(statusBadge).toHaveText('aktiv', {
      //   ignoreCase: true,
      // })
    })

    test('it shows pricing plan heading', async ({ page }) => {
      // const pricingTable = page.getByText('pricing-table')

      const heading = page.getByText(/jetzt upgraden/i)
      // const heading = page.getByRole('heading', { name: /jetzt upgraden/i })
      expect(heading).toBeVisible()
      // expect(page.getByText(/jetzt upgraden/i)).toBeVisible()
      // expect(pricingTable).toBeVisible()
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
  })
})
