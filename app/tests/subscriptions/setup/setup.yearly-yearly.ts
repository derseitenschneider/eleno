import { test as setup, expect } from '@playwright/test'
import { setupYearlyYearly } from '../../utils/setupHelpers'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'
import { loginUser } from '../../utils/loginUser'

setup(
  'create a trial user, run yearly checkout fixture, move clock forward one year and check if date has changed.',
  async ({ page }) => {
    setup.slow()
    // Setup test data.
    const testUser = await setupYearlyYearly()

    await loginUser(testUser.email, testUser.password, testUser.authFile, page)

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

    // Make sure subscription date changes over time.
    const subscriptionPom = new SubscriptionPOM(page)
    await subscriptionPom.goto()
    const initialStartDate = await subscriptionPom.startDate.textContent()
    await testUser.advanceClock({ days: 366 })
    await page.reload()
    await subscriptionPom.startDate.waitFor()
    const newStartDate = await subscriptionPom.startDate.textContent()
    expect(initialStartDate).not.toEqual(newStartDate)
  },
)
