import { test as setup, expect } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'
import { setupMonthlyCanceled } from '../../utils/setupHelpers'

setup(
  'create a trial user, run checkout fixture and then cancel',
  async ({ page }) => {
    // Setup test data.
    const { email, password, authFile } = await setupMonthlyCanceled()

    // Login
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    // Close toast, check activation message and delete it.
    await page.getByRole('button', { name: 'Close toast' }).click()
    await page.getByRole('link', { name: 'Nachrichten' }).click()
    await page.getByRole('button', { name: 'Team ELENO' }).click()
    await expect(page.getByTestId('message-header')).toContainText('aktiviert')
    await page.getByRole('button', { name: 'Löschen' }).click()

    const subscriptionPom = new SubscriptionPOM(page)
    await subscriptionPom.goto()
    // // Check if default is active subscription.
    // await expect(page.getByTestId('subscription-status-badge')).toContainText(
    //   'Aktiv',
    // )
    //
    // // Cancel subscription.
    // await page.getByRole('button', { name: 'Abo kündigen' }).click()
    // await page.getByRole('button', { name: 'Abo kündigen' }).click()
    // await expect(page.getByTestId('subscription-status-badge')).toContainText(
    //   'Auslaufend',
    // )
    // Store login state in auth file.
    await page.context().storageState({ path: authFile })
  },
)
