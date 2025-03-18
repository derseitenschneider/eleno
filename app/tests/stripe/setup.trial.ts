import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'
import createUser from '../utils/createUser'
import { createCustomer } from '../utils/createStripeCustomer'
import { createSubscriptionRow } from '../utils/createSubscriptionRow'

const authFile = path.resolve(path.dirname('.'), './playwright/.auth/user.json')
const dataPath = path.resolve(path.dirname('.'), './tests/stripe/data')

setup('create trial user and authenticate', async ({ page }) => {
  const user = await createUser()
  const email = user.email || ''
  const password = 'password123'

  const stripeCustomer = await createCustomer(email, user.id)
  await createSubscriptionRow(user.id, stripeCustomer.id)

  const data = {
    userId: user.id,
    customerId: stripeCustomer.id,
  }

  fs.writeFile(`${dataPath}/trial-user.json`, JSON.stringify(data), (err) => {
    if (err) throw err
    console.log('User data file created.')
  })

  console.log('Testuser setup completed!')

  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
