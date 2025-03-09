import { test as setup, expect } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'

const dotenvPath = path.resolve(path.dirname('..'), '.env')
dotenv.config({
  path: dotenvPath,
})

const authFile = path.resolve(path.dirname('..'), 'playwright/.auth/user.json')

setup('authenticate', async ({ page }) => {
  const testUserEmail = process.env.TESTUSER_EMAIL || ''
  const testUserPassword = process.env.TESTUSER_PASSWORD || ''

  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(testUserEmail)
  await page.getByTestId('login-password').fill(testUserPassword)
  await page.getByTestId('login-submit').click()
  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  await page.context().storageState({ path: authFile })
})
