import { test as setup, expect } from '@playwright/test'
import { TestUser } from '../../utils/TestUser'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

setup(
  'create a trial user, run checkout fixture and then cancel',
  async ({ page }) => {
    // Setup test data.
    const testUser = new TestUser({ userflow: 'monthly-canceled' })
    await testUser.init()
    await testUser.runStripeFixture('monthly-checkout')

    // Login
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(testUser.email)
    await page.getByTestId('login-password').fill(testUser.password)
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
    // Check if default is active subscription.
    await expect(page.getByTestId('subscription-status-badge')).toContainText(
      'Aktiv',
    )

    // Cancel subscription, close toast, check for cancellation message
    // and delete it.
    await page.getByRole('button', { name: 'Abo kündigen' }).click()
    await page.getByRole('button', { name: 'Abo kündigen' }).click()
    await expect(page.getByTestId('subscription-status-badge')).toContainText(
      'Auslaufend',
    )
    await page.getByRole('button', { name: 'Close toast' }).click()
    await page.getByRole('link', { name: 'Nachrichten' }).click()
    await page.getByRole('button', { name: 'Team ELENO' }).click()
    await expect(page.getByTestId('message-header')).toContainText('gekündigt')
    await page.getByRole('button', { name: 'Löschen' }).click()

    // Store login state in auth file.
    await page.context().storageState({ path: testUser.authFile })
  },
)
