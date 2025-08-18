import { test, expect } from '@playwright/test'

test.describe('Critical: Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from homepage to test full login flow
    await page.goto('/')
  })

  test('should login successfully across all browsers', async ({ page, browserName }) => {
    console.log(`Testing authentication in ${browserName}`)

    // Click login button
    await page.getByRole('button', { name: /sign in/i }).first().click()

    // Wait for login form to appear
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
    await expect(page.getByLabelText(/password/i)).toBeVisible()

    // Fill login form
    await page.getByRole('textbox', { name: /email/i }).fill(
      process.env.CROSS_BROWSER_TEST_EMAIL || 'test@eleno.net'
    )
    await page.getByLabelText(/password/i).fill(
      process.env.CROSS_BROWSER_TEST_PASSWORD || 'testpassword123'
    )

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()

    // Verify successful login
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
    await expect(page.getByTestId('main-navigation')).toBeVisible({ timeout: 10000 })

    // Verify user menu is accessible
    await page.getByTestId('user-menu').click()
    await expect(page.getByText(/settings/i)).toBeVisible()

    console.log(`✅ Authentication successful in ${browserName}`)
  })

  test('should handle login errors gracefully', async ({ page, browserName }) => {
    console.log(`Testing login error handling in ${browserName}`)

    // Click login button
    await page.getByRole('button', { name: /sign in/i }).first().click()

    // Fill with invalid credentials
    await page.getByRole('textbox', { name: /email/i }).fill('invalid@example.com')
    await page.getByLabelText(/password/i).fill('wrongpassword')

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()

    // Verify error message appears
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 10000 })

    // Verify user stays on login page
    await expect(page).toHaveURL(/\/login/)

    console.log(`✅ Error handling works in ${browserName}`)
  })

  test('should logout successfully', async ({ page, browserName }) => {
    console.log(`Testing logout in ${browserName}`)

    // User should be logged in from setup
    await page.goto('/dashboard')
    await expect(page.getByTestId('main-navigation')).toBeVisible()

    // Open user menu
    await page.getByTestId('user-menu').click()

    // Click logout
    await page.getByRole('button', { name: /logout/i }).click()

    // Verify redirect to homepage
    await expect(page).toHaveURL('/', { timeout: 10000 })
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

    console.log(`✅ Logout successful in ${browserName}`)
  })

  test('should remember user session after page reload', async ({ page, browserName }) => {
    console.log(`Testing session persistence in ${browserName}`)

    // Navigate to dashboard (should be authenticated from setup)
    await page.goto('/dashboard')
    await expect(page.getByTestId('main-navigation')).toBeVisible()

    // Reload page
    await page.reload()

    // Verify user is still authenticated
    await expect(page.getByTestId('main-navigation')).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL(/\/dashboard/)

    console.log(`✅ Session persistence works in ${browserName}`)
  })
})