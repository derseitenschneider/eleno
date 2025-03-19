import test, { expect } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

test('can deactivate and activate subscription', async ({ page }) => {
  const subscriptionPom = new SubscriptionPOM(page)
  subscriptionPom.goto()
  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Aktiv',
  )
  await page.getByRole('button', { name: 'Abo kündigen' }).click()
  await page.getByRole('button', { name: 'Abo kündigen' }).click()

  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Auslaufend',
  )

  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()
  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()
  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Aktiv',
  )
})
