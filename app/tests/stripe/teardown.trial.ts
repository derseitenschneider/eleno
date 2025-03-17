import { expect } from '@playwright/test'
import { test as teardown } from '../fixtures'
import path from 'node:path'

const authFile = path.resolve(
  path.dirname('../../'),
  'playwright/.auth/user.json',
)

teardown('create trial user and authenticate', async ({ page, trialState }) => {
  console.log(trialState)
  // const user = await createUser()
  // const email = user.email || ''
  // const password = 'password123'
  //
  // await page.goto('/?page=login')
  // await page.getByTestId('login-email').fill(email)
  // await page.getByTestId('login-password').fill(password)
  // await page.getByTestId('login-submit').click()
  // await expect(page.getByTestId('dashboard-heading')).toBeVisible()
  //
  // await page.context().storageState({ path: authFile })
})
