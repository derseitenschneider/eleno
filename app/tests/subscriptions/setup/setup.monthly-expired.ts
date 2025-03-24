import { test as setup, expect } from '@playwright/test'
import { setupMonthlyExpired } from '../../utils/setupHelpers'

setup(
  'create a trial user, run checkout fixture and activate',
  async ({ page }) => {
    setup.slow()

    // Setup monthly expired subscription.
    const { email, password, authFile } = await setupMonthlyExpired()

    // Login
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    // Clean up notifications and messages.
    await expect(page.getByRole('status')).toContainText('2 neue Nachrichten')
    await page.getByRole('button', { name: 'Close toast' }).click()
    await page.getByRole('link', { name: 'Nachrichten' }).click()
    await page.getByRole('button', { name: 'aktiviert' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()
    await page.getByRole('button', { name: 'Aktion erforderlich' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    // Store login state in auth file.
    await page.context().storageState({ path: authFile })
  },
)
