import { expect, test as setup } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'
import { loginUser } from '../../utils/loginUser'
import { setupYearlyCanceledExpired } from '../../utils/setupHelpers'

setup(
  'create a trial user, run yearly checkout fixture, cancel and then expire.',
  async ({ page }) => {
    // Setup test data.
    const { email, password, authFile } = await setupYearlyCanceledExpired()

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
    await page.getByRole('button', { name: 'Team ELENO' }).click()
    await expect(page.getByTestId('message-header')).toContainText('aktiviert')
    await page.getByRole('button', { name: 'Löschen' }).click()

    const subscriptionPom = new SubscriptionPOM(page)
    await subscriptionPom.goto()
  },
)
