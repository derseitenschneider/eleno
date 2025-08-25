import { expect, test } from '@playwright/test'

test.describe('Critical: Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent theme for testing
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
    })
  })

  test('should be authenticated from setup', async ({ page, browserName }) => {
    console.log(`Testing authentication state in ${browserName}`)

    // Navigate to dashboard (should be authenticated from setup)
    await page.goto('/')

    // Wait for any loading states to complete
    await page.waitForLoadState('networkidle')

    // Wait for dashboard to load using the same selector as setup
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 30000,
    })

    // Wait for application to be fully loaded
    await page.waitForLoadState('networkidle')

    console.log(`✅ Authentication verified in ${browserName}`)
  })

  test('should maintain session after navigation', async ({
    page,
    browserName,
  }) => {
    console.log(`Testing navigation with authentication in ${browserName}`)

    // Start on dashboard
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 30000,
    })

    // Navigate to students page
    await page.goto('/students')
    await page.waitForLoadState('networkidle')

    // Verify we can access students page (requires authentication)
    await expect(page).toHaveURL(/\/students/)

    // Navigate back to dashboard
    await page.goto('/')
    await page.waitForSelector('[data-testid="dashboard"], .dashboard, main', {
      state: 'visible',
      timeout: 15000,
    })
  })

  test('should remember user session after page reload', async ({ page }) => {
    // Navigate to dashboard (should be authenticated from setup)
    await page.goto('/')
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 30000,
    })

    // Reload page
    await page.reload()

    // Verify user is still authenticated
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 15000,
    })
  })

  test('should handle authentication state across browser tabs', async ({
    page,
    context,
    browserName,
  }) => {
    console.log(`Testing authentication across tabs in ${browserName}`)

    // Navigate to dashboard in first tab
    await page.goto('/dashboard')
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 30000,
    })

    // Open new tab
    const newPage = await context.newPage()
    await newPage.goto('/students')

    // Verify authentication is maintained in new tab
    await newPage.waitForLoadState('networkidle')
    await expect(newPage).toHaveURL(/\/students/)

    // Close new tab
    await newPage.close()

    console.log(`✅ Authentication across tabs works in ${browserName}`)
  })
})
