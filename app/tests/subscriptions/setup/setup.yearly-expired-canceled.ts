import { expect, test as setup } from '@playwright/test'
import { setupYearlyExpiredCanceled } from '../../utils/setupHelpers'

setup(
  'create a yearly subscription, attach failing payment, move clock two months.',
  async ({ page }) => {
    setup.slow()

    // Setup monthly expired subscription.
    const { email, password, authFile } = await setupYearlyExpiredCanceled()

    // Login
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    // Clean up notifications.
    await expect(page.getByRole('status')).toContainText('4 neue Nachrichten')
    await page.getByRole('button', { name: 'Close toast' }).click()

    // Clean up messages.
    await page.getByRole('link', { name: 'Nachrichten' }).click()

    await page.getByRole('button', { name: 'Zugang ist aktiviert' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    await page.getByRole('button', { name: 'Aktion erforderlich' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    await page.getByRole('button', { name: 'dringend' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    await page.getByRole('button', { name: 'beendet' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    // Store login state in auth file.
    await page.context().storageState({ path: authFile })
  },
)
