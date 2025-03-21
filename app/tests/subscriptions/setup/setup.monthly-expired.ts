import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import { setupBaseUser } from '../../utils/setupBaseUser'
import { expireSubscription } from '../../utils/expireSubscription'
import { runStripeFixture } from '../../utils/runStripeFixture'

const authFile = path.resolve(
  path.dirname('.'),
  './playwright/.auth/monthly-expired.json',
)

setup(
  'create monthly user, authenticate and then expire subscription',
  async ({ page }) => {
    const { email, password, userId, customerId } =
      await setupBaseUser('monthly-expired')

    await runStripeFixture({
      fixture: 'monthly-checkout',
      customerId,
      userId,
    })

    await page.goto('/?page=login')
    await page.getByTestId('login-email').fill(email)
    await page.getByTestId('login-password').fill(password)
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('dashboard-heading')).toBeVisible()

    await expireSubscription(userId)
    await page.context().storageState({ path: authFile })
  },
)
