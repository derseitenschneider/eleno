import { test as setup, expect } from '@playwright/test'
import { setupYearlyMonthly } from '../../utils/setupHelpers'

setup(
  'create a trial user, run checkout fixture for yearly subscription, activate and downgrade subscription.',
  async ({ page }) => {
    // Setup test data.
    const testUser = await setupYearlyMonthly()

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

    await page.getByRole('link', { name: 'Nachrichten' }).click()
    await page.getByRole('button', { name: 'Team ELENO' }).click()
    await expect(page.getByTestId('message-header')).toContainText('aktiviert')
    await page.getByRole('button', { name: 'Löschen' }).click()

    // Store login state in auth file.
    await page.context().storageState({ path: testUser.authFile })
  },
)
