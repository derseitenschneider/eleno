import { test as setup, expect } from '@playwright/test'
import { setupMonthlyExpiredCanceled } from '../../utils/setupHelpers'

setup(
  'create a montly subscription, attach failing payment, move clock two months.',
  async ({ page }) => {
    setup.slow()

    // Setup monthly expired subscription.
    const { email, password, authFile } = await setupMonthlyExpiredCanceled()

    // Login
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    // Await inactive banner
    await expect(async () => {
      await page.reload()
      await expect(page.getByText('Dein Abo ist inaktiv')).toBeVisible()
    }).toPass({ timeout: 30_000 })

    // Clean up notifications.
    const toasts = await page.getByRole('status').all()
    for (const toast of toasts) {
      try {
        const closeButton = toast.getByRole('button', {
          name: 'Close toast',
        })
        await closeButton.click()
      } catch (error) {
        console.warn(
          'Could not find or click the close button on a toast.',
          error,
        )
      }
    }

    // Clean up messages.
    await page.goto('/inbox')


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
