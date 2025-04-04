import { test as setup, expect } from '@playwright/test'
import { setupYearlyLifetime } from '../../utils/setupHelpers'

setup(
  'create a trial user, run yearly checkout fixture, run lifetime checkout and activate',
  async ({ page }) => {
    // Setup test data.
    const testUser = await setupYearlyLifetime()

    // Login
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(testUser.email)
    await page.getByTestId('login-password').fill(testUser.password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    // Close toast, check activation message and delete it.
    try {
      await page.getByRole('button', { name: 'Close toast' }).click()
    } catch (error) {
      console.warn('Toast message not found or no need to close it.')
    }

    await page.goto('/inbox')

    // Check and delete yearly subscription message
    try {
      await expect(page.getByRole('button', { name: 'aktiviert' })).toBeVisible(
        { timeout: 10000 },
      )
    } catch (error) {
      console.warn(
        'Warning: Activation message for monthly subscription not received.',
      )
    }

    await page.getByRole('button', { name: 'aktiviert' }).click()
    await expect(page.getByTestId('message-header')).toContainText(/aktiviert/i)
    await page.getByRole('button', { name: 'Löschen' }).click()

    // Check and delete lifetime upgrade message
    try {
      await expect(
        page.getByRole('button', { name: 'Upgrade erfolgreich' }),
      ).toBeVisible({
        timeout: 10000,
      })
    } catch (error) {
      console.warn(
        'Warning: Activation message for lifetime upgrade not received.',
      )
    }

    await page.getByRole('button', { name: 'Upgrade erfolgreich' }).click()
    await expect(page.getByTestId('message-header')).toContainText(/upgrade/i)
    await page.getByRole('button', { name: 'Löschen' }).click()

    // Store login state in auth file.
    await page.context().storageState({ path: testUser.authFile })
  },
)
