import { test as setup, expect } from '@playwright/test'
import { setupTrialActive } from '../../utils/setupHelpers'

setup('create trial user and authenticate', async ({ page }) => {
  const { email, password, authFile } = await setupTrialActive()

  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
