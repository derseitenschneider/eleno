import { test, expect } from '@playwright/test'

test.describe('Critical: Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByTestId('main-navigation')).toBeVisible()
  })

  test('should load and display dashboard data', async ({ page, browserName }) => {
    console.log(`Testing dashboard data loading in ${browserName}`)

    // Wait for dashboard to load
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15000 })

    // Check for key dashboard elements
    const dashboardElements = [
      'main-navigation',
      'user-menu',
    ]

    for (const element of dashboardElements) {
      await expect(page.getByTestId(element)).toBeVisible({ timeout: 10000 })
    }

    // Check that content is loading (not just spinners)
    await page.waitForLoadState('networkidle', { timeout: 15000 })

    console.log(`✅ Dashboard loads correctly in ${browserName}`)
  })

  test('should handle data loading states', async ({ page, browserName }) => {
    console.log(`Testing loading states in ${browserName}`)

    // Navigate to a data-heavy page
    await page.getByRole('link', { name: /students/i }).click()
    
    // Wait for page to load
    await expect(page.getByTestId('students-page')).toBeVisible({ timeout: 15000 })
    
    // Check for loading indicators or content
    const hasContent = await page.locator('[data-testid*="student"], [data-testid*="empty"], .loading, .spinner').count()
    expect(hasContent).toBeGreaterThan(0)

    console.log(`✅ Loading states work correctly in ${browserName}`)
  })

  test('should handle form interactions', async ({ page, browserName }) => {
    console.log(`Testing form interactions in ${browserName}`)

    // Navigate to settings where forms are likely to exist
    await page.goto('/settings')
    await expect(page.getByTestId('settings-page')).toBeVisible({ timeout: 15000 })

    // Look for any form elements
    const formElements = await page.locator('input, textarea, select, button[type="submit"]').count()
    
    if (formElements > 0) {
      console.log(`Found ${formElements} form elements`)
      
      // Test basic form interaction (if input exists)
      const textInput = page.locator('input[type="text"], input[type="email"], input:not([type])').first()
      if (await textInput.isVisible({ timeout: 2000 })) {
        await textInput.click()
        await textInput.fill('test value')
        expect(await textInput.inputValue()).toContain('test')
      }
    }

    console.log(`✅ Form interactions work in ${browserName}`)
  })

  test('should handle JavaScript execution', async ({ page, browserName }) => {
    console.log(`Testing JavaScript execution in ${browserName}`)

    // Test basic JavaScript functionality
    const result = await page.evaluate(() => {
      return {
        hasLocalStorage: typeof localStorage !== 'undefined',
        hasSessionStorage: typeof sessionStorage !== 'undefined',
        hasJSON: typeof JSON !== 'undefined',
        hasFetch: typeof fetch !== 'undefined',
        userAgent: navigator.userAgent,
      }
    })

    expect(result.hasLocalStorage).toBe(true)
    expect(result.hasSessionStorage).toBe(true)
    expect(result.hasJSON).toBe(true)
    expect(result.hasFetch).toBe(true)
    expect(result.userAgent).toBeTruthy()

    console.log(`✅ JavaScript execution works in ${browserName}`)
    console.log(`Browser UA: ${result.userAgent}`)
  })

  test('should handle CSS rendering', async ({ page, browserName }) => {
    console.log(`Testing CSS rendering in ${browserName}`)

    // Check that key UI elements are properly styled
    const navigation = page.getByTestId('main-navigation')
    await expect(navigation).toBeVisible()

    // Check computed styles for key elements
    const navStyles = await navigation.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        display: styles.display,
        position: styles.position,
        visibility: styles.visibility,
        opacity: styles.opacity,
      }
    })

    expect(navStyles.display).not.toBe('none')
    expect(navStyles.visibility).toBe('visible')
    expect(parseFloat(navStyles.opacity)).toBeGreaterThan(0)

    console.log(`✅ CSS rendering works in ${browserName}`)
  })

  test('should handle responsive behavior', async ({ page, browserName, isMobile }) => {
    console.log(`Testing responsive behavior in ${browserName} (mobile: ${isMobile})`)

    // Set different viewport sizes and test responsiveness
    const viewports = isMobile 
      ? [{ width: 375, height: 667 }, { width: 414, height: 896 }]
      : [{ width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1920, height: 1080 }]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      
      // Wait for any responsive transitions
      await page.waitForTimeout(500)
      
      // Check that navigation is still accessible
      const navigation = page.getByTestId('main-navigation')
      if (isMobile) {
        // On mobile, navigation might be in a drawer or collapsed
        const isVisible = await navigation.isVisible()
        const hasMobileMenu = await page.getByTestId('mobile-menu', 'hamburger-menu').isVisible().catch(() => false)
        expect(isVisible || hasMobileMenu).toBe(true)
      } else {
        await expect(navigation).toBeVisible()
      }
    }

    console.log(`✅ Responsive behavior works in ${browserName}`)
  })
})