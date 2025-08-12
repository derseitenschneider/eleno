import { test as setup } from '@playwright/test'
import { loginUser } from '../../utils/loginUser'
import { setupYearlyExpired } from '../../utils/setupHelpers'

setup(
  'create a montly subscription, attach failing payment, move clock.',
  async ({ page }) => {
    setup.slow()

    // Setup monthly expired subscription.
    const { email, password, authFile } = await setupYearlyExpired()

    await loginUser(email, password, authFile, page)

    // Clean up notifications and messages.
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

    await page.goto('/inbox')
    await page.getByRole('button', { name: 'aktiviert' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()
    await page.getByRole('button', { name: 'Aktion erforderlich' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()
  },
)
