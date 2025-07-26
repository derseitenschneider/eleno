import { test as setup, expect } from '@playwright/test'
import { setupTrialLifetime } from '../../utils/setupHelpers'
import { loginUser } from '../../utils/loginUser'

setup(
  'create trial user, subscribe to lifetime and authenticate',
  async ({ page }) => {
    const { email, password, authFile } = await setupTrialLifetime()

    await loginUser(email, password, authFile, page)

    // Close toast, check activation message and delete it.
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

    await expect(async () => {
      await page.getByRole('button', { name: 'Upgrade erfolgreich' }).click()
      await page.reload()
    }).toPass({ timeout: 30_000 })

    await expect(page.getByTestId('message-header')).toContainText(/upgrade/i)
    await page.getByRole('button', { name: 'Löschen' }).click()
  },
)
