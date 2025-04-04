import { test as setup, expect } from '@playwright/test'
import { setupTrialLifetime } from '../../utils/setupHelpers'

setup(
  'create trial user, subscribe to lifetime and authenticate',
  async ({ page }) => {
    const { email, password, authFile } = await setupTrialLifetime()

    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    // Close toast, check activation message and delete it.
    try {
      await page.getByRole('button', { name: 'Close toast' }).click()
    } catch (error) {
      console.warn('Toast message not found or no need to close it.')
    }

    await page.goto('/inbox')
    await page.getByRole('button', { name: 'Upgrade erfolgreich' }).click()
    await expect(page.getByTestId('message-header')).toContainText(/upgrade/i)
    await page.getByRole('button', { name: 'Löschen' }).click()

    await page.context().storageState({ path: authFile })
  },
)
