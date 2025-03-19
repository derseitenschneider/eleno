import { test as setup, expect } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'
import { setupBaseUser } from './utils/setupBaseUser'
import { runStripeFixture } from './utils/runStripeFixture'

const dotenvPath = path.resolve(path.dirname('..'), '.env')
dotenv.config({
  path: dotenvPath,
})

const authFile = path.resolve(
  path.dirname('..'),
  'playwright/.auth/scratch.json',
)

setup('authenticate for scratch', async ({ page }) => {
  const email = process.env.TESTUSER_EMAIL || ''
  const password = process.env.TESTUSER_PASSWORD || ''

  //// Uncomment to create new user with new subscription state
  // const SUBSCRIPTION_STATE = 'monthly-active'
  // const { email, password, customerId, userId } =
  //   await setupBaseUser(SUBSCRIPTION_STATE)
  //
  // await runStripeFixture({
  //   fixture: 'monthly-checkout',
  //   customerId,
  //   userId,
  // })

  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
