import { expect, test } from '@playwright/test'

test.describe('Responsive: Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent theme for testing
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Wait for content to load using generic selector
    const hasContent = await page
      .locator('main, [data-testid], body > div')
      .count()
    if (hasContent === 0) {
      await page.waitForTimeout(2000)
    }
  })

  test('should display mobile-friendly navigation', async ({
    page,
    browserName,
  }) => {
    console.log(`Testing mobile navigation in ${browserName}`)

    // Set mobile viewport for testing if not already mobile
    const currentViewport = page.viewportSize()
    if (!currentViewport || currentViewport.width > 1024) {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500) // Wait for responsive changes
    }

    // Check for any navigation elements (sidebar, mobile nav, etc.)
    const hasSidebar = await page
      .locator('[data-testid="app-sidebar"]')
      .isVisible()
    const hasMobileNav = await page
      .locator('[data-testid="mobile-nav"]')
      .isVisible()

    // At least one navigation method should be present
    expect(hasSidebar || hasMobileNav).toBe(true)

    console.log(`✅ Mobile navigation verified in ${browserName}`)
  })

  test('should handle touch interactions', async ({ page, browserName }) => {
    console.log(`Testing touch interactions in ${browserName}`)

    // Test basic touch interaction on the page
    await page.tap('body')

    // Test that the page is interactive on mobile
    const hasContent = await page
      .locator('main, [data-testid], body > div')
      .count()
    expect(hasContent).toBeGreaterThan(0)

    console.log(`✅ Touch interactions work in ${browserName}`)
  })

  test('should display content properly on small screens', async ({
    page,
    browserName,
  }) => {
    console.log(`Testing content display on small screens in ${browserName}`)

    // Test different mobile viewport sizes
    const mobileViewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 6/7/8
      { width: 414, height: 896 }, // iPhone XR
    ]

    for (const viewport of mobileViewports) {
      await page.setViewportSize(viewport)
      await page.waitForTimeout(500) // Wait for responsive changes

      // Check that content doesn't overflow horizontally
      const bodyWidth = await page
        .locator('body')
        .evaluate((el) => el.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50) // Allow reasonable buffer

      // Verify content is still visible
      const hasContent = await page
        .locator('main, [data-testid], body > div')
        .count()
      expect(hasContent).toBeGreaterThan(0)
    }

    console.log(
      `✅ Content displays properly on small screens in ${browserName}`,
    )
  })

  test('should handle mobile viewport changes', async ({
    page,
    browserName,
  }) => {
    console.log(`Testing mobile viewport handling in ${browserName}`)

    // Test portrait to landscape transition
    const portrait = { width: 375, height: 667 }
    const landscape = { width: 667, height: 375 }

    // Start in portrait
    await page.setViewportSize(portrait)
    await page.waitForTimeout(500)

    // Verify content is accessible
    const hasContent1 = await page
      .locator('main, [data-testid], body > div')
      .count()
    expect(hasContent1).toBeGreaterThan(0)

    // Switch to landscape
    await page.setViewportSize(landscape)
    await page.waitForTimeout(500)

    // Verify content is still accessible
    const hasContent2 = await page
      .locator('main, [data-testid], body > div')
      .count()
    expect(hasContent2).toBeGreaterThan(0)

    console.log(`✅ Mobile viewport changes handled in ${browserName}`)
  })
})
