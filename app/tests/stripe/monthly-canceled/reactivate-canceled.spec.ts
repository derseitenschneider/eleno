import { test, expect } from '@playwright/test'
import { SubscriptionPOM } from '../../pom/SubscriptionPOM'

test.beforeEach(async ({ page }) => {
  const subscrptionPom = new SubscriptionPOM(page)
  subscrptionPom.goto()
})

test('can reactivate and cancel subscription', async ({ page }) => {
  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Auslaufend',
  )
  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()
  await page.getByRole('button', { name: 'Abo wiederherstellen' }).click()

  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Aktiv',
  )

  await page.getByRole('button', { name: 'Abo kündigen' }).click()
  await page.getByRole('button', { name: 'Abo kündigen' }).click()

  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Auslaufend',
  )
})
