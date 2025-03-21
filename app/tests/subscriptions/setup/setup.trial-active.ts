import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import { setupBaseUser } from '../../utils/setupBaseUser'

const authFile = path.resolve(
  path.dirname('.'),
  './playwright/.auth/trial-active.json',
)

setup('create trial user and authenticate', async ({ page }) => {
  const { email, password } = await setupBaseUser('trial-active')
  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
