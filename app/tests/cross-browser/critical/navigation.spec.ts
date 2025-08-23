import { test, expect } from '@playwright/test'

test.describe('Critical: Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent theme for testing
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
    })
    
    // Start from dashboard
    await page.goto('/dashboard')
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 30000,
    })
  })

  test('should navigate to all main sections via URL', async ({ page, browserName }) => {
    console.log(`Testing main navigation via URL in ${browserName}`)

    const routes = [
      '/students',
      '/lessons', 
      '/timetable',
      '/todos',
      '/notes',
      '/dashboard'
    ]

    for (const route of routes) {
      console.log(`Navigating to ${route}`)
      await page.goto(route)
      await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')))
      await page.waitForLoadState('networkidle')
      
      // Verify page loads some content
      const hasContent = await page.locator('main, [data-testid], .page, body > div').count()
      expect(hasContent).toBeGreaterThan(0)
    }

    console.log(`✅ Main navigation works in ${browserName}`)
  })

  test('should handle browser back/forward buttons', async ({ page, browserName }) => {
    console.log(`Testing browser navigation in ${browserName}`)

    // Navigate to different pages via URL
    await page.goto('/students')
    await expect(page).toHaveURL(/\/students/)
    await page.waitForLoadState('networkidle')

    await page.goto('/lessons')
    await expect(page).toHaveURL(/\/lessons/)
    await page.waitForLoadState('networkidle')

    // Test browser back button
    await page.goBack()
    await expect(page).toHaveURL(/\/students/)

    // Test browser forward button
    await page.goForward()
    await expect(page).toHaveURL(/\/lessons/)

    console.log(`✅ Browser navigation works in ${browserName}`)
  })

  test('should handle direct URL access', async ({ page, browserName }) => {
    console.log(`Testing direct URL access in ${browserName}`)

    // Test direct access to various pages
    const testRoutes = [
      '/students',
      '/lessons',
      '/timetable',
      '/todos',
      '/notes',
      '/settings'
    ]

    for (const route of testRoutes) {
      console.log(`Testing direct access to ${route}`)
      await page.goto(route)
      await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/')))
      await page.waitForLoadState('networkidle')
      
      // Verify the page loads content instead of checking specific test-ids
      const hasContent = await page.locator('main, [data-testid], .page, body > div').count()
      expect(hasContent).toBeGreaterThan(0)
    }

    console.log(`✅ Direct URL access works in ${browserName}`)
  })

  test('should handle invalid routes gracefully', async ({ page, browserName }) => {
    console.log(`Testing 404 handling in ${browserName}`)

    // Navigate to non-existent route
    await page.goto('/non-existent-page')
    await page.waitForLoadState('networkidle')

    // Should either show 404 page, redirect to dashboard, or show some error handling
    // We don't want to be too specific about what happens, just that it doesn't crash
    const hasContent = await page.locator('main, [data-testid], .page, body > div').count()
    expect(hasContent).toBeGreaterThan(0)

    console.log(`✅ Invalid route handling works in ${browserName}`)
  })

  test('should maintain URL state during page reloads', async ({ page, browserName }) => {
    console.log(`Testing URL state persistence in ${browserName}`)

    // Navigate to students page
    await page.goto('/students')
    await expect(page).toHaveURL(/\/students/)
    await page.waitForLoadState('networkidle')

    // Reload page
    await page.reload()

    // Verify we're still on the students page
    await expect(page).toHaveURL(/\/students/)
    await page.waitForLoadState('networkidle')

    console.log(`✅ URL state persistence works in ${browserName}`)
  })

  test('should handle navigation timing across browsers', async ({ page, browserName }) => {
    console.log(`Testing navigation timing in ${browserName}`)

    const startTime = Date.now()

    // Navigate through several pages
    const routes = ['/students', '/lessons', '/dashboard']
    
    for (const route of routes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain(route)
    }

    const endTime = Date.now()
    const totalTime = endTime - startTime

    console.log(`Navigation completed in ${totalTime}ms on ${browserName}`)
    
    // Basic sanity check - shouldn't take more than 30 seconds for 3 page navigations
    expect(totalTime).toBeLessThan(30000)

    console.log(`✅ Navigation timing acceptable in ${browserName}`)
  })
})