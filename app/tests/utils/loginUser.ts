import { expect, type Page } from '@playwright/test'
import { TestUser } from './TestUser'

export async function loginUser(
  email: string,
  password: string,
  authFile: string,
  page: Page,
) {
  await page.goto('/?page=login')
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-submit').click()
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()

  await expect(page.getByTestId('dashboard-heading')).toBeVisible()

  await page.context().storageState({ path: authFile })
}
