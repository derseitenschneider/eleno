import { test, expect } from '@playwright/test'
import { SubscriptionPMO } from '../../pmo/SubscriptionPMO'

test.beforeEach(async ({ page }) => {
  const subscrptionPMO = new SubscriptionPMO(page)
  subscrptionPMO.goto()
})

test('can cancel and reactivate subscription', async ({ page }) => {
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
