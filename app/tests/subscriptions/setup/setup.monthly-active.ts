import { test as setup, expect } from '@playwright/test'
import { TestUser } from '../../utils/TestUser'

setup(
  'create a trial user, run checkout fixture and activate',
  async ({ page }) => {
    const testUser = new TestUser({ userflow: 'monthly-active' })
    await testUser.init()
    await testUser.runStripeFixture('monthly-checkout')

    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(testUser.email)
    await page.getByTestId('login-password').fill(testUser.password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    await page.context().storageState({ path: testUser.authFile })
  },
)
