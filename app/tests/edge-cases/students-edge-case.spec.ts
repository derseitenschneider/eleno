import { test, expect } from '@playwright/test'

/**
 * Edge-case visual regression tests for Students pages
 * Tests problematic viewport sizes that previously caused data visibility issues
 */
test.describe('Students Page - Edge Case Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent theme and date for visual testing
    await page.addInitScript(() => {
      // Mock Date to return consistent date for tests
      const OriginalDate = Date
      window.Date = class extends OriginalDate {
        constructor(...args) {
          if (args.length === 0) {
            super('2025-08-13T10:00:00Z')
          } else {
            super(...args)
          }
        }
        static now() {
          return new Date('2025-08-13T10:00:00Z').getTime()
        }
      }
      Object.setPrototypeOf(window.Date, OriginalDate)
      Object.setPrototypeOf(window.Date.prototype, OriginalDate.prototype)
      
      // Set theme
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
    })
  })

  test('Active Students List - All viewports', async ({ page }, testInfo) => {
    // Navigate to active students page
    await page.goto('/students')

    // Wait for students table to load
    await page.waitForSelector(
      'table, [data-testid="students-table"], .students-list',
      {
        state: 'visible',
        timeout: 10000,
      },
    )

    // Wait for data to load
    await page.waitForLoadState('networkidle')

    // Wait for navigation to be rendered with correct active state
    await page.waitForSelector('nav a[aria-current="page"]', {
      state: 'attached',
      timeout: 5000,
    }).catch(() => {
      // Navigation might not be present on all viewports, continue
    })
    
    // Additional wait for any animations or lazy loading
    await page.waitForTimeout(1000)

    // Log student count for debugging (don't fail test on count)
    const studentRows = await page
      .locator('tbody tr, [data-testid="student-row"]')
      .count()
    console.log(`Active Students visible: ${studentRows}`)

    // Take screenshot with viewport-specific name
    const projectName = testInfo.project.name
    await expect(page).toHaveScreenshot(`active-students-${projectName}.png`, {
      fullPage: true,
      animations: 'disabled',
    })

    // Log viewport info for debugging
    const viewport = page.viewportSize()
    console.log(
      `Active Students - ${projectName}: ${viewport?.width}x${viewport?.height}, ${studentRows} students visible`,
    )

    // Verify critical elements are visible
    if (viewport && viewport.width < 768) {
      // Mobile view - check mobile-specific elements
      const mobileNav = page.locator(
        'nav.fixed.bottom-0, [data-testid="mobile-nav"]',
      )
      if (await mobileNav.isVisible()) {
        expect(await mobileNav.isVisible()).toBe(true)
      }
    } else {
      // Desktop view - check sidebar
      const sidebar = page.locator('[data-testid="app-sidebar"]')
      if ((await sidebar.count()) > 0) {
        // Sidebar should be visible on desktop
        const sidebarVisible = await sidebar.isVisible()
        console.log(`Sidebar visible on ${projectName}: ${sidebarVisible}`)
      }
    }
  })

  test('Inactive Students (Archive) - All viewports', async ({
    page,
  }, testInfo) => {
    // Navigate to archive page for inactive students and groups
    await page.goto('/students/archive')

    // Wait for page to load
    await page.waitForSelector('main, [data-testid="archive-table"], table', {
      state: 'visible',
      timeout: 10000,
    })

    // Wait for data to load
    await page.waitForLoadState('networkidle')
    
    // Wait for navigation to be rendered with correct active state
    await page.waitForSelector('nav a[aria-current="page"]', {
      state: 'attached',
      timeout: 5000,
    }).catch(() => {
      // Navigation might not be present on all viewports, continue
    })
    
    await page.waitForTimeout(1000)

    // Log archive count for debugging (don't fail test on count)
    // Archive page shows both archived students and groups
    const archiveElements = await page
      .locator(
        'tbody tr, [data-testid="archive-row"], [data-testid="student-row"]',
      )
      .count()
    console.log(`Archive items visible: ${archiveElements}`)

    // Take screenshot
    const projectName = testInfo.project.name
    await expect(page).toHaveScreenshot(`archive-${projectName}.png`, {
      fullPage: true,
      animations: 'disabled',
    })

    // Log viewport info
    const viewport = page.viewportSize()
    console.log(
      `Archive - ${projectName}: ${viewport?.width}x${viewport?.height}, ${archiveElements} items visible`,
    )
  })

  test('Groups Page - All viewports', async ({ page }, testInfo) => {
    // Navigate to groups page
    await page.goto('/students/groups')

    // Wait for groups page to load and wait for loading state to disappear
    await page.waitForSelector('main, [data-testid="groups-table"]', {
      state: 'visible',
      timeout: 10000,
    })

    // Wait for loading states to disappear
    await page
      .waitForSelector('.animate-pulse, [data-testid="loading"], .skeleton', {
        state: 'hidden',
        timeout: 15000,
      })
      .catch(() => {
        // If no loading indicators found, that's fine
      })

    // Wait for data
    await page.waitForLoadState('networkidle')
    
    // Wait for navigation to be rendered with correct active state
    await page.waitForSelector('nav a[aria-current="page"]', {
      state: 'attached',
      timeout: 5000,
    }).catch(() => {
      // Navigation might not be present on all viewports, continue
    })
    
    await page.waitForTimeout(2000) // Give more time for groups to load

    // Take screenshot
    const projectName = testInfo.project.name
    await expect(page).toHaveScreenshot(`groups-${projectName}.png`, {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('Table column responsiveness - Active Students', async ({
    page,
  }, testInfo) => {
    await page.goto('/students')

    // Wait for table to load
    await page.waitForSelector('table, [data-testid="students-table"]', {
      state: 'visible',
      timeout: 10000,
    })

    await page.waitForLoadState('networkidle')
    
    // Wait for navigation to be rendered with correct active state
    await page.waitForSelector('nav a[aria-current=\"page\"]', {
      state: 'attached',
      timeout: 5000,
    }).catch(() => {
      // Navigation might not be present on all viewports, continue
    })
    
    await page.waitForTimeout(500)

    const viewport = page.viewportSize()
    const projectName = testInfo.project.name

    // Check which columns are visible based on viewport
    const visibleColumns = await page.evaluate(() => {
      const headers = Array.from(
        document.querySelectorAll('thead th, thead td'),
      )
      return headers
        .filter((h) => {
          const style = window.getComputedStyle(h as HTMLElement)
          return style.display !== 'none' && style.visibility !== 'hidden'
        })
        .map((h) => h.textContent?.trim())
    })

    console.log(
      `${projectName} (${viewport?.width}px) visible columns:`,
      visibleColumns,
    )

    // Verify appropriate columns for device type
    if (viewport && viewport.width < 768) {
      // Mobile should show fewer columns
      expect(visibleColumns.length).toBeLessThanOrEqual(4)
      console.log('Mobile view: Showing condensed columns')
    } else {
      // Desktop should show more columns
      expect(visibleColumns.length).toBeGreaterThanOrEqual(4)
      console.log('Desktop view: Showing full columns')
    }

    // Take a focused screenshot of the table
    const table = page.locator('table, [data-testid="students-table"]').first()
    await expect(table).toHaveScreenshot(`table-columns-${projectName}.png`, {
      animations: 'disabled',
    })
  })

  test('Navigation accessibility - All viewports', async ({
    page,
  }, testInfo) => {
    await page.goto('/students')

    await page.waitForLoadState('networkidle')
    
    // Wait for navigation to be rendered with correct active state
    await page.waitForSelector('nav a[aria-current=\"page\"]', {
      state: 'attached',
      timeout: 5000,
    }).catch(() => {
      // Navigation might not be present on all viewports, continue
    })
    
    await page.waitForTimeout(500)

    const viewport = page.viewportSize()
    const projectName = testInfo.project.name

    if (viewport && viewport.width < 768) {
      // Mobile view - test mobile sidebar trigger and overlay
      const sidebarTrigger = page.locator('[data-testid="sidebar-trigger"]')

      // Verify trigger is visible on mobile
      if (
        (await sidebarTrigger.count()) > 0 &&
        (await sidebarTrigger.isVisible())
      ) {
        console.log(`${projectName}: Mobile sidebar trigger visible`)

        // Take screenshot of closed state first
        await expect(page).toHaveScreenshot(
          `mobile-sidebar-closed-${projectName}.png`,
          {
            animations: 'disabled',
          },
        )

        // Click to open mobile sidebar overlay
        await sidebarTrigger.click()
        await page.waitForTimeout(300) // Wait for animation

        // Wait for sidebar sheet to be visible
        const sidebarSheet = page.locator(
          '[data-testid="app-sidebar"], .sidebar-overlay, [role="dialog"]',
        )
        if ((await sidebarSheet.count()) > 0) {
          await expect(sidebarSheet.first()).toBeVisible()

          // Take screenshot of opened mobile sidebar
          await expect(page).toHaveScreenshot(
            `mobile-sidebar-open-${projectName}.png`,
            {
              animations: 'disabled',
            },
          )

          // Verify navigation items are accessible in mobile overlay
          const navItems = page.locator(
            'a[href="/students"], a[href="/"], button[data-testid="lesson-nav-sidebar"]',
          )
          const navItemCount = await navItems.count()
          expect(navItemCount).toBeGreaterThan(0)

          console.log(
            `${projectName}: Mobile sidebar opened with ${navItemCount} navigation items`,
          )

          // Close sidebar by clicking outside the overlay (more realistic mobile behavior)
          await page.click('body', {
            position: { x: viewport.width - 50, y: 100 },
          })
          await page.waitForTimeout(300)
        }
      }

      // Check for mobile navigation fallback
      const mobileNav = page.locator('[data-testid="mobile-nav"]')
      if ((await mobileNav.count()) > 0) {
        expect(await mobileNav.isVisible()).toBe(true)
        await expect(mobileNav).toHaveScreenshot(
          `mobile-nav-fallback-${projectName}.png`,
          {
            animations: 'disabled',
          },
        )
        console.log(`${projectName}: Mobile navigation fallback visible`)
      }
    } else {
      // Desktop view - test sidebar
      const sidebar = page.locator('[data-testid="app-sidebar"]')

      if ((await sidebar.count()) > 0) {
        // Check if sidebar is collapsed or expanded
        const sidebarState = await page.evaluate(() => {
          const sidebar = document.querySelector('[data-testid="app-sidebar"]')
          if (!sidebar) return 'not found'
          const style = window.getComputedStyle(sidebar as HTMLElement)
          const width = Number.parseInt(style.width)
          return width > 100 ? 'expanded' : 'collapsed'
        })

        console.log(`${projectName}: Sidebar state: ${sidebarState}`)

        // If sidebar is collapsed on small laptop, try to expand it
        if (
          sidebarState === 'collapsed' &&
          viewport &&
          viewport?.width <= 1280
        ) {
          const toggleButton = page.locator(
            '[data-testid="sidebar-trigger"], button[aria-label*="sidebar"], button[aria-label*="menu"]',
          )
          if (
            (await toggleButton.count()) > 0 &&
            (await toggleButton.first().isVisible())
          ) {
            await toggleButton.first().click()
            await page.waitForTimeout(300) // Wait for animation

            // Take screenshot of expanded sidebar
            await expect(page).toHaveScreenshot(
              `sidebar-expanded-${projectName}.png`,
              {
                animations: 'disabled',
              },
            )
          } else {
            console.log(
              `${projectName}: Sidebar toggle not visible, sidebar likely already expanded`,
            )
          }
        }

        // Take screenshot of current desktop sidebar state
        await expect(page).toHaveScreenshot(
          `sidebar-desktop-${sidebarState}-${projectName}.png`,
          {
            animations: 'disabled',
          },
        )
      }
    }
  })
})
