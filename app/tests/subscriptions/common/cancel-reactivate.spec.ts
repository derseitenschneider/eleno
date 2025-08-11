import { expect, test } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'
import { cleanupToasts } from '../../utils/cleanupToasts'

test('can cancel and reactivate subscription', async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()

  // Check if default is active subscription.
  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Aktiv',
  )

  // Cancel subscription.
  await page.getByRole('button', { name: 'Abo kündigen' }).click()
  await page.getByRole('button', { name: 'Abo kündigen' }).click()

  await expect(async () => {
    await expect(page.getByTestId('subscription-status-badge')).toContainText(
      'Auslaufend',
    )
    await page.reload()
  }).toPass({ timeout: 30_000 })

  // Close toast, check cancellation message and delete it.
  await cleanupToasts(page)

  await page.getByRole('link', { name: 'Nachrichten' }).click()
  await page.getByRole('button', { name: 'Abo gekündigt' }).click()
  await expect(page.getByTestId('message-header')).toContainText('gekündigt')
  await page.getByRole('button', { name: 'Löschen' }).click()

  // Navigate back to subscription settings.
  subscrptionPom.goto()

  // Reactivate subscription.
  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()
  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()

  await expect(async () => {
    await page.reload()
    await expect(page.getByTestId('subscription-status-badge')).toContainText(
      'Aktiv',
    )
  }).toPass({ timeout: 30_000 })

  // Close toast, check for reactivation Message and delete it.
  await cleanupToasts(page)

  await page.getByRole('link', { name: 'Nachrichten' }).click()
  await page.getByRole('button', { name: 'Abo ist wieder aktiv' }).click()

  await expect(page.getByTestId('message-header')).toContainText('aktiv')
  await page.getByRole('button', { name: 'Löschen' }).click()
})
