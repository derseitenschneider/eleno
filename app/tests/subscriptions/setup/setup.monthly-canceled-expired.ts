import { expect } from '@playwright/test'
import { test as setup } from '../../fixture'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'
import { setupMonthlyCanceledExpired } from '../../utils/setupHelpers'

setup(
  'create a trial user, run checkout fixture, cancel and then expire.',
  async ({ forwardOneMonth }) => {
    // Setup test data.
    const { email, password, authFile } = await setupMonthlyCanceledExpired()

    // Login
    await forwardOneMonth.goto('/?page=login')
    await forwardOneMonth.getByTestId('login-email').fill(email)
    await forwardOneMonth.getByTestId('login-password').fill(password)
    await forwardOneMonth.getByTestId('login-submit').click()
    await expect(forwardOneMonth.getByTestId('dashboard-heading')).toBeVisible()

    // Close toast, check activation message and delete it.
    try {
      await forwardOneMonth.getByRole('button', { name: 'Close toast' }).click()
    } catch (error) {
      console.warn('Toast message not found or no need to close it.')
    }

    await forwardOneMonth.getByRole('link', { name: 'Nachrichten' }).click()
    await forwardOneMonth.getByRole('button', { name: 'Team ELENO' }).click()
    await expect(forwardOneMonth.getByTestId('message-header')).toContainText(
      'aktiviert',
    )
    await forwardOneMonth.getByRole('button', { name: 'Löschen' }).click()

    const subscriptionPom = new SubscriptionPOM(forwardOneMonth)
    await subscriptionPom.goto()

    // Store login state in auth file.
    await forwardOneMonth.context().storageState({ path: authFile })
  },
)
