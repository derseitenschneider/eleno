import { expect } from '@playwright/test'
import { test as setup } from '../fixtures'
import path from 'node:path'
import createUser from '../utils/createUser'

const authFile = path.resolve(path.dirname('.'), './playwright/.auth/user.json')

setup('create trial user and authenticate', async ({ page, trialState }) => {
  const user = await createUser()
  const email = user.email || ''
  const password = 'password123'
  trialState.userId = user.id

  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
