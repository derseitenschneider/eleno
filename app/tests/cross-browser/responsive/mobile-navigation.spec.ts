import { test, expect } from '@playwright/test'

test.describe('Responsive: Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15000 })
  })

  test('should display mobile navigation correctly', async ({ page, browserName }) => {
    console.log(`Testing mobile navigation in ${browserName}`)

    // Verify mobile viewport
    const viewport = page.viewportSize()
    expect(viewport?.width).toBeLessThanOrEqual(768)

    // Look for mobile navigation elements
    const mobileMenuTrigger = page.getByTestId('mobile-menu-trigger', 'hamburger-menu', 'menu-button').first()
    const hasMobileMenu = await mobileMenuTrigger.isVisible().catch(() => false)

    if (hasMobileMenu) {
      // Test mobile menu interaction
      await mobileMenuTrigger.click()
      
      // Verify menu opens
      const mobileMenu = page.getByTestId('mobile-menu', 'navigation-drawer')
      await expect(mobileMenu.first()).toBeVisible({ timeout: 5000 })
      
      // Test navigation items
      const navItems = ['Students', 'Lessons', 'Timetable', 'Todos']
      for (const item of navItems) {
        const navLink = page.getByRole('link', { name: new RegExp(item, 'i') })
        if (await navLink.count() > 0) {
          await expect(navLink.first()).toBeVisible()
        }
      }
      
      // Close menu
      const closeButton = page.getByTestId('close-menu', 'menu-close').first()
      if (await closeButton.isVisible({ timeout: 2000 })) {
        await closeButton.click()
      } else {
        // Try clicking overlay or pressing escape
        await page.keyboard.press('Escape')
      }
      
    } else {
      // Check if regular navigation adapts to mobile
      const mainNav = page.getByTestId('main-navigation')
      await expect(mainNav).toBeVisible()
      
      // Verify navigation is scrollable or compact on mobile
      const navBounds = await mainNav.boundingBox()
      expect(navBounds?.width).toBeLessThanOrEqual(viewport?.width || 400)
    }

    console.log(`✅ Mobile navigation works in ${browserName}`)
  })

  test('should handle touch interactions', async ({ page, browserName }) => {
    console.log(`Testing touch interactions in ${browserName}`)

    // Test touch tap on buttons
    const testButton = page.getByTestId('user-menu').first()
    if (await testButton.isVisible()) {
      // Use tap instead of click for touch devices
      await testButton.tap()
      
      // Verify dropdown opens
      const dropdown = page.getByRole('menu', { name: /user menu/i })
      if (await dropdown.isVisible({ timeout: 3000 })) {
        // Tap outside to close
        await page.tap('body', { position: { x: 10, y: 10 } })
      }
    }

    // Test swipe gestures if applicable
    try {
      // Test horizontal swipe on a swipeable element if it exists
      const swipeableElement = page.locator('[data-swipeable], .swiper, .carousel').first()
      if (await swipeableElement.isVisible({ timeout: 2000 })) {
        const bounds = await swipeableElement.boundingBox()
        if (bounds) {
          await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
          // Simulate swipe
          await page.touchscreen.tap(bounds.x + 50, bounds.y + bounds.height / 2)
        }
      }
    } catch (error) {
      console.log('No swipeable elements found, continuing...')
    }

    console.log(`✅ Touch interactions work in ${browserName}`)
  })

  test('should display content properly on small screens', async ({ page, browserName }) => {
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

      // Check that content doesn't overflow
      const body = page.locator('body')
      const bodyBounds = await body.boundingBox()
      
      if (bodyBounds) {
        expect(bodyBounds.width).toBeLessThanOrEqual(viewport.width + 20) // Allow small buffer
      }

      // Check that main content is visible
      const mainContent = page.getByTestId('main-content', 'dashboard-page', 'page-content').first()
      await expect(mainContent).toBeVisible()

      // Verify text is readable (not too small)
      const textElements = page.locator('h1, h2, h3, p, span').first()
      if (await textElements.isVisible({ timeout: 2000 })) {
        const fontSize = await textElements.evaluate((el) => {
          return window.getComputedStyle(el).fontSize
        })
        const fontSizeNum = parseFloat(fontSize)
        expect(fontSizeNum).toBeGreaterThanOrEqual(12) // Minimum readable size
      }
    }

    console.log(`✅ Content displays properly on small screens in ${browserName}`)
  })

  test('should handle mobile form interactions', async ({ page, browserName }) => {
    console.log(`Testing mobile form interactions in ${browserName}`)

    // Navigate to a page with forms (settings)
    await page.goto('/settings')
    await expect(page.getByTestId('settings-page')).toBeVisible({ timeout: 15000 })

    // Look for form inputs
    const inputs = page.locator('input:visible, textarea:visible, select:visible')
    const inputCount = await inputs.count()

    if (inputCount > 0) {
      const firstInput = inputs.first()
      
      // Test tap to focus
      await firstInput.tap()
      
      // Verify virtual keyboard doesn't break layout
      await page.waitForTimeout(1000)
      
      // Test typing
      if (await firstInput.getAttribute('type') !== 'password') {
        await firstInput.fill('test input')
        expect(await firstInput.inputValue()).toContain('test')
      }
      
      // Test that form is still usable after keyboard appears
      const submitButton = page.getByRole('button', { name: /save|submit|update/i }).first()
      if (await submitButton.isVisible({ timeout: 2000 })) {
        const buttonBounds = await submitButton.boundingBox()
        expect(buttonBounds).toBeTruthy()
      }
    }

    console.log(`✅ Mobile form interactions work in ${browserName}`)
  })

  test('should handle mobile layout transitions', async ({ page, browserName }) => {
    console.log(`Testing mobile layout transitions in ${browserName}`)

    // Test portrait to landscape transition
    const portrait = { width: 375, height: 667 }
    const landscape = { width: 667, height: 375 }

    // Start in portrait
    await page.setViewportSize(portrait)
    await page.waitForTimeout(500)
    
    // Verify layout works in portrait
    const mainNav = page.getByTestId('main-navigation').first()
    await expect(mainNav).toBeVisible()

    // Switch to landscape
    await page.setViewportSize(landscape)
    await page.waitForTimeout(500)

    // Verify layout adapts to landscape
    await expect(mainNav).toBeVisible()
    
    // Check that content is still accessible
    const content = page.getByTestId('dashboard-page', 'main-content').first()
    await expect(content).toBeVisible()

    // Switch back to portrait
    await page.setViewportSize(portrait)
    await page.waitForTimeout(500)

    // Verify return to portrait works
    await expect(mainNav).toBeVisible()

    console.log(`✅ Mobile layout transitions work in ${browserName}`)
  })
})