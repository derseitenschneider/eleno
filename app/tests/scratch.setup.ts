import path from 'node:path'
import { expect, test as setup } from '@playwright/test'
import dotenv from 'dotenv'
import { SubscriptionPOM } from './pom/SubscriptionPOM'
import { TestUser } from './utils/TestUser'

const dotenvPath = path.resolve(path.dirname('..'), '.env')
dotenv.config({
  path: dotenvPath,
})

const authFile = path.resolve(
  path.dirname('..'),
  'playwright/.auth/scratch.json',
)

setup('authenticate for scratch', async ({ page }) => {
  // const email = process.env.TESTUSER_EMAIL || ''
  // const password = process.env.TESTUSER_PASSWORD || ''

  //// Uncomment to create new user with new subscription state
  const testUser = new TestUser({
    userflow: 'monthly-active',
    project: 'subscriptions',
  })
  await testUser.init()

  const email = testUser.email
  const password = testUser.password

  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  const subscriptionPom = new SubscriptionPOM(page)
  await subscriptionPom.goto()

  await page.getByRole('button', { name: 'Abo kündigen' }).click()
  await page.getByRole('button', { name: 'Abo kündigen' }).click()

  await expect(page.getByTestId('subscription-status-badge')).toContainText(
    'Auslaufend',
  )

  await page.context().storageState({ path: authFile })
})
