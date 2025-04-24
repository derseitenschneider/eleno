import { test as setup, expect } from '@playwright/test'
import { setupMonthlyActive } from '../../utils/setupHelpers'

setup(
  'create a trial user, run checkout fixture and activate',
  async ({ page }) => {
    // Setup test data.
    const testUser = await setupMonthlyActive()

    // Login
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(testUser.email)
    await page.getByTestId('login-password').fill(testUser.password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

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
      await page.reload()
      await expect(page.getByRole('button', { name: 'Team ELENO' })).toBeVisible()
    }).toPass({
      timeout: 60_000
    })

    await page.getByRole('button', { name: 'Team ELENO' }).click()
    await expect(page.getByTestId('message-header')).toContainText('aktiviert')
    await page.getByRole('button', { name: 'Löschen' }).click()

    // Store login state in auth file.
    await page.context().storageState({ path: testUser.authFile })
  },
)
