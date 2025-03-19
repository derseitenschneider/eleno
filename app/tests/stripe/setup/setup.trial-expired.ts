import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import { setupBaseUser } from '../../utils/setupBaseUser'
import { expireSubscription } from '../../utils/expireSubscription'

const authFile = path.resolve(
  path.dirname('.'),
  './playwright/.auth/trial-expired.json',
)

setup(
  'create trial user, authenticate and then expire subscription',
  async ({ page }) => {
    const { email, password, userId } = await setupBaseUser('trial-expired')

    expireSubscription(userId)
    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    await page.context().storageState({ path: authFile })
  },
)
