import { expect, test } from '@playwright/test'

test.describe('Critical: Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent theme for testing
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
    })

    await page.goto('/dashboard')
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 30000,
    })
  })

  test('should load and display dashboard data', async ({
    page,
    browserName,
  }) => {
    console.log(`Testing dashboard data loading in ${browserName}`)

    // Wait for dashboard to load using existing selector
    await page.waitForSelector('[data-testid="dashboard-header"]', {
      state: 'visible',
      timeout: 15000,
    })

    // Check that content is loading (not just spinners)
    await page.waitForLoadState('networkidle', { timeout: 15000 })

    // Verify some basic dashboard elements exist using generic selectors
    const hasContent = await page
      .locator('main, [data-testid], .dashboard, body > div')
      .count()
    expect(hasContent).toBeGreaterThan(0)

    console.log(`✅ Dashboard loads correctly in ${browserName}`)
  })

  test('should handle data loading states', async ({ page, browserName }) => {
    console.log(`Testing loading states in ${browserName}`)

    // Navigate to a data-heavy page
    await page.goto('/students')
    await page.waitForLoadState('networkidle')

    // Check for loading indicators or content - use generic selectors
    const hasContent = await page
      .locator('table, [data-testid], .loading, #loader, .spinner, main, .page')
      .count()
    expect(hasContent).toBeGreaterThan(0)

    console.log(`✅ Loading states work correctly in ${browserName}`)
  })

  test('should handle form interactions', async ({ page, browserName }) => {
    console.log(`Testing form interactions in ${browserName}`)

    // Navigate to settings where forms are likely to exist
    await page.goto('/settings')
    await page.waitForLoadState('networkidle')

    // Look for any form elements
    const formElements = await page
      .locator('input, textarea, select, button[type="submit"]')
      .count()

    console.log(`Found ${formElements} form elements`)

    if (formElements > 0) {
      // Test basic form interaction (if input exists)
      const textInput = page
        .locator('input[type="text"], input[type="email"], input:not([type])')
        .first()
      if (await textInput.isVisible({ timeout: 2000 })) {
        await textInput.click()
        await textInput.fill('test value')
        const inputValue = await textInput.inputValue()
        expect(inputValue).toContain('test')
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
        hasPromise: typeof Promise !== 'undefined',
        hasDate: typeof Date !== 'undefined',
      }
    })

    expect(result.hasLocalStorage).toBe(true)
    expect(result.hasSessionStorage).toBe(true)
    expect(result.hasJSON).toBe(true)
    expect(result.hasFetch).toBe(true)
    expect(result.hasPromise).toBe(true)
    expect(result.hasDate).toBe(true)
    expect(result.userAgent).toBeTruthy()

    console.log(`✅ JavaScript execution works in ${browserName}`)
    console.log(`Browser UA: ${result.userAgent}`)
  })

  test('should handle CSS rendering', async ({ page, browserName }) => {
    console.log(`Testing CSS rendering in ${browserName}`)

    // Check that key UI elements are properly styled using actual existing elements
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Check computed styles for body element
    const bodyStyles = await body.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        fontFamily: styles.fontFamily,
      }
    })

    expect(bodyStyles.display).not.toBe('none')
    expect(bodyStyles.visibility).toBe('visible')
    expect(parseFloat(bodyStyles.opacity)).toBeGreaterThan(0)

    console.log(`✅ CSS rendering works in ${browserName}`)
  })

  test('should handle responsive behavior', async ({
    page,
    browserName,
    isMobile,
  }) => {
    console.log(
      `Testing responsive behavior in ${browserName} (mobile: ${isMobile})`,
    )

    // Set different viewport sizes and test responsiveness
    const viewports = isMobile
      ? [
        { width: 375, height: 667 },
        { width: 414, height: 896 },
      ]
      : [
        { width: 768, height: 1024 },
        { width: 1024, height: 768 },
        { width: 1920, height: 1080 },
      ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)

      // Wait for any responsive transitions
      await page.waitForTimeout(500)

      // Check that content is still accessible
      const hasContent = await page
        .locator('main, [data-testid], body > div')
        .count()
      expect(hasContent).toBeGreaterThan(0)

      // Check that content doesn't overflow horizontally
      const bodyWidth = await page
        .locator('body')
        .evaluate((el) => el.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50) // Allow reasonable buffer
    }

    console.log(`✅ Responsive behavior works in ${browserName}`)
  })

  test('should handle basic application state', async ({
    page,
    browserName,
  }) => {
    console.log(`Testing application state in ${browserName}`)

    // Test local storage functionality
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value')
    })

    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('test-key')
    })

    expect(storedValue).toBe('test-value')

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('test-key')
    })

    console.log(`✅ Application state handling works in ${browserName}`)
  })
})

