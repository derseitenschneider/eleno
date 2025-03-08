import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'
const dotenvPath = '../../.env'
dotenv.config({ path: path.dirname(dotenvPath) })

const TESTUSER_EMAIL = process.env.TESTUSER_EMAIL || ''
const TESTUSER_PASSWORD = process.env.TESTUSER_PASSWORD || ''

test.describe('trial user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dev.eleno.net/?page=login')
    await page
      .getByRole('textbox', { name: 'E-Mail Adresse' })
      .fill(TESTUSER_EMAIL)
    await page
      .getByRole('textbox', { name: 'Passwort' })
      .fill(TESTUSER_PASSWORD)
    await page.getByRole('button', { name: 'Login' }).click()
    await page.getByTitle('Einstellungen').click()
    await page.getByRole('link', { name: /Abo/i }).click()
  })

  test('it shows that it status is active', async ({ page }) => {
    const statusBadge = page.getByText(/Aktiv/i)
    expect(statusBadge).toBeVisible()
  })
  test('it shows pricing plans', async ({ page }) => {
    const titlePricingSection = page.getByRole('heading', { name: /upgrade/i })

    expect(titlePricingSection).toBeVisible()
  })
})
