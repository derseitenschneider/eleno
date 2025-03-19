import { test as setup, expect } from '@playwright/test'
import { SubscriptionPOM } from '../pom/SubscriptionPOM'
import path from 'node:path'
import { setupBaseUser } from '../utils/setupBaseUser'
import { runStripeFixture } from '../utils/runStripeFixture'
import { stripeClient } from '../utils/stripeClient'

const SUBSCRIPTION_STATE = 'monthly-canceled'

const authFile = path.resolve(
  path.dirname('.'),
  `./playwright/.auth/${SUBSCRIPTION_STATE}.json`,
)

setup(
  'create a trial user, run checkout fixture and activate',
  async ({ page }) => {
    const { email, password, customerId, userId } =
      await setupBaseUser(SUBSCRIPTION_STATE)

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

    const subscriptionPom = new SubscriptionPOM(page)
    subscriptionPom.goto()

    await page.getByRole('button', { name: 'Abo kündigen' }).click()
    await page.getByRole('button', { name: 'Abo kündigen' }).click()

    await expect(page.getByTestId('subscription-status-badge')).toContainText(
      'Auslaufend',
    )

    await page.context().storageState({ path: authFile })
  },
)
