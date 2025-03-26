import { test, expect } from '@playwright/test'
import { SubscriptionPOM } from '../../../pom/SubscriptionPOM'

test('can reactivate  and cancel subscription', async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()

  // Check if default is active subscription.
  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Auslaufend',
  )

  // Reactivate subscription.
  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()
  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()
  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Aktiv',
  )

  // Close toast, check for reactivation Message and delete it.
  await page.getByRole('button', { name: 'Close toast' }).click()
  await page.getByRole('link', { name: 'Nachrichten' }).click()
  await page.getByRole('button', { name: 'Team ELENO' }).click()
  await expect(page.getByTestId('message-header')).toContainText('aktiv')
  await page.getByRole('button', { name: 'Löschen' }).click()

  // Navigate back to subscription settings.
  subscrptionPom.goto()

  // Cancel subscription.
  await page.getByRole('button', { name: 'Abo kündigen' }).click()
  await page.getByRole('button', { name: 'Abo kündigen' }).click()
  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Auslaufend',
  )

  // Close toast, check cancellation message and delete it.
  await page.getByRole('button', { name: 'Close toast' }).click()
  await page.getByRole('link', { name: 'Nachrichten' }).click()
  await page.getByRole('button', { name: 'Team ELENO' }).click()
  await expect(page.getByTestId('message-header')).toContainText('gekündigt')
  await page.getByRole('button', { name: 'Löschen' }).click()
})
