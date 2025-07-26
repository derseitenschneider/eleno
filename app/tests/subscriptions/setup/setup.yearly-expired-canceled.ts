import { expect, test as setup } from '@playwright/test'
import { setupYearlyExpiredCanceled } from '../../utils/setupHelpers'
import { cleanupToasts } from '../../utils/cleanupToasts'
import { loginUser } from '../../utils/loginUser'

setup(
  'create a yearly subscription, attach failing payment, move clock two months.',
  async ({ page }) => {
    setup.slow()

    // Setup monthly expired subscription.
    const { email, password, authFile } = await setupYearlyExpiredCanceled()

    await loginUser(email, password, authFile, page)

    // Await inactive banner
    await expect(async () => {
      await page.reload()
      await expect(page.getByText('Dein Abo ist inaktiv')).toBeVisible()
    }).toPass({ timeout: 30_000 })

    // Clean up notifications.
    cleanupToasts(page)

    // Clean up messages.
    await page.goto('/inbox')

    await page.getByRole('button', { name: 'Zugang ist aktiviert' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    await page.getByRole('button', { name: 'Aktion erforderlich' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    await page.getByRole('button', { name: 'dringend' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()

    await page.getByRole('button', { name: 'beendet' }).click()
    await page.getByRole('button', { name: 'Löschen' }).click()
  },
)
