import * as fs from 'node:fs'
import { expect, test } from '@playwright/test'

/**
 * Edge-case visual regression tests for Lessons pages
 * Tests problematic viewport sizes that could cause layout issues
 *
 * Test Coverage:
 * 1. Main lesson creation interface
 * 2. All lessons table view
 * 3. Group lessons interface
 * 4. Lesson form interaction and planning modal
 * 5. Mobile/desktop navigation differences
 * 6. Student/group selector navigation
 * 7. Previous lessons layout responsiveness
 * 8. Repertoire navigation integration (button/link presence)
 * 9. No students state handling
 *
 * @junior-dev-notes
 * These tests focus on the core lesson functionality across all device sizes.
 * Detailed notes and repertoire functionality are tested in separate dedicated test files,
 * but basic integration (navigation buttons/links) is still tested here.
 * The tests navigate to different students/groups to verify the lesson view updates.
 * Screenshots are taken at each viewport to catch visual regressions.
 *
 * Key points:
 * - Always check viewport.width to determine mobile/desktop behavior
 * - Use waitForSelector with generous timeouts for data loading
 * - Handle cases where features might not exist gracefully
 * - Log important state information for debugging
 * - Test lesson-specific functionality + basic navigation to notes/repertoire
 * - Detailed notes/repertoire testing is in separate dedicated test files
 */
test.describe('Lessons Page - Edge Case Visual Regression', () => {
  let testData: any

  test.beforeAll(async () => {
    // Load test data created during setup
    try {
      const testDataPath = './tests/edge-cases/.auth/test-data.json'
      const testDataContent = fs.readFileSync(testDataPath, 'utf8')
      testData = JSON.parse(testDataContent)
    } catch (error) {
      console.error('Failed to load test data:', error)
      throw new Error('Test data not available. Make sure setup has run.')
    }
  })

  test.beforeEach(async ({ page }) => {
    // Set consistent theme and date for visual testing
    await page.addInitScript(() => {
      // Mock Date to return consistent date for tests
      const OriginalDate = Date
      const MockDate = class extends OriginalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super('2025-08-13T10:00:00Z')
          } else {
            super(...(args as [string | number | Date]))
          }
        }
        static now() {
          return new OriginalDate('2025-08-13T10:00:00Z').getTime()
        }
      } as any

      // Properly assign all Date static methods
      Object.setPrototypeOf(MockDate, OriginalDate)
      Object.getOwnPropertyNames(OriginalDate).forEach((name) => {
        if (name !== 'prototype' && name !== 'name' && name !== 'length') {
          ;(MockDate as any)[name] = (OriginalDate as any)[name]
        }
      })

      window.Date = MockDate
      Object.setPrototypeOf(window.Date, OriginalDate)
      Object.setPrototypeOf(window.Date.prototype, OriginalDate.prototype)

      // Set theme
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
    })
  })

  /**
   * Test 1: Main Lesson Interface
   * Tests the primary lesson creation and viewing interface
   */
  test('Main Lesson Interface - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}`)

    // Wait for lesson interface to load - look for the lesson header and main container
    await page.waitForSelector(
      '[data-testid="lesson-header"], h5:has-text("Neue Lektion"), main',
      {
        state: 'visible',
        timeout: 15000,
      },
    )

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Check viewport-specific elements
    if (viewport && viewport.width < 768) {
      // Mobile: Check for mobile navigation
      const mobileNav = page.locator(
        '[data-testid="lesson-nav-mobile"], .lesson-nav-mobile',
      )
      if ((await mobileNav.count()) > 0) {
        console.log(`${projectName}: Mobile lesson navigation present`)
      }

      // Check for mobile-specific lesson layout
      const mobileLayout = page.locator('.lesson-mobile, [data-mobile="true"]')
      console.log(
        `${projectName}: Mobile layout elements: ${await mobileLayout.count()}`,
      )
    } else {
      // Desktop: Check for sidebar notes
      const notesSidebar = page.locator('aside, [data-testid="notes-sidebar"]')
      if ((await notesSidebar.count()) > 0) {
        const sidebarVisible = await notesSidebar.isVisible()
        console.log(`${projectName}: Notes sidebar visible: ${sidebarVisible}`)
      }
    }

    // Log lesson elements visibility
    const lessonForm = page.locator(
      'h5:has-text("Neue Lektion"), .rsw-editor, [role="textbox"]',
    )
    const previousLessons = page.locator('[data-testid="lesson-item"]')

    console.log(
      `${projectName}: Lesson form elements: ${await lessonForm.count()}`,
    )
    console.log(
      `${projectName}: Previous lessons count: ${await previousLessons.count()}`,
    )

    // Take screenshot of main interface
    await expect(page).toHaveScreenshot(`lesson-main-${projectName}.png`, {
      fullPage: true,
      animations: 'disabled',
    })
  })

  /**
   * Test 2: All Lessons Table View
   * Tests the table view showing all lessons
   */
  test('All Lessons Table - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    // Navigate to all lessons view with current year parameter
    const currentYear = new Date().getFullYear()
    await page.goto(`/lessons/s-${studentId}/all?year=${currentYear}`)

    // Wait for the AllLessons component to load - use a more robust selector
    // First wait for page to be ready, then check for components
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(2000) // Give extra time for very small viewports

    // The page should at least have loaded some content by now

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Check if we have a table or empty state
    const hasTable = (await page.locator('table').count()) > 0
    const hasEmptyState =
      (await page
        .locator('[data-testid="empty-state"], .empty-state')
        .count()) > 0

    if (hasTable) {
      // Check table responsiveness
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

      // Check for lesson data
      const lessonRows = await page.locator('tbody tr').count()
      console.log(`${projectName}: Lesson rows visible: ${lessonRows}`)

      // Mobile should show condensed columns
      if (viewport && viewport.width < 768) {
        expect(visibleColumns.length).toBeLessThanOrEqual(4)
        console.log('Mobile view: Showing condensed lesson columns')
      } else {
        expect(visibleColumns.length).toBeGreaterThanOrEqual(3)
        console.log('Desktop view: Showing lesson table columns')
      }
    } else if (hasEmptyState) {
      console.log(
        `${projectName}: All lessons table showing empty state (no lessons for ${currentYear})`,
      )
    } else {
      console.log(
        `${projectName}: All lessons page loaded but no table or empty state found`,
      )
    }

    // Take screenshot
    await expect(page).toHaveScreenshot(
      `all-lessons-table-${projectName}.png`,
      {
        fullPage: true,
        animations: 'disabled',
      },
    )
  })

  /**
   * Test 3: Group Lessons View
   * Tests lesson interface for groups
   */
  test('Group Lessons - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name
    const groupId = testData.groupId

    if (!groupId) {
      console.log(
        `${projectName}: No group created, skipping group lesson test`,
      )
      return
    }

    await page.goto(`/lessons/g-${groupId}`)

    await page.waitForSelector(
      '[data-testid="lesson-header"], h5:has-text("Neue Lektion"), main',
      {
        state: 'visible',
        timeout: 15000,
      },
    )

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Check for group-specific elements
    const groupIndicator = page.locator(
      '[data-testid="group-indicator"], .group-lesson, .group-title',
    )
    console.log(
      `${projectName}: Group lesson indicators: ${await groupIndicator.count()}`,
    )

    // Take screenshot of group lesson interface
    await expect(page).toHaveScreenshot(`group-lesson-${projectName}.png`, {
      fullPage: true,
      animations: 'disabled',
    })

    console.log(`${projectName}: Group lesson interface captured`)
  })

  /**
   * Test 4: Lesson Form Interaction
   * Tests form elements and their responsive behavior
   */
  test('Lesson Form Interaction - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForSelector(
      '[data-testid="lesson-header"], h5:has-text("Neue Lektion"), main',
      {
        state: 'visible',
        timeout: 15000,
      },
    )

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Focus on lesson content editor - look for rich text editor elements
    const lessonEditor = page.locator('.rsw-editor [role="textbox"]').first()
    if ((await lessonEditor.count()) > 0) {
      await lessonEditor.click()
      await lessonEditor.fill(
        'Test lesson content for visual regression testing',
      )

      // Test homework field - second rich text editor
      const homeworkEditor = page.locator('.rsw-editor [role="textbox"]').nth(1)
      if ((await homeworkEditor.count()) > 0) {
        await homeworkEditor.click()
        await homeworkEditor.fill('Practice scales for 15 minutes daily')
      }

      // Take screenshot with filled form
      await expect(page).toHaveScreenshot(
        `lesson-form-filled-${projectName}.png`,
        {
          fullPage: viewport ? viewport.width < 768 : false, // Full page for mobile
          animations: 'disabled',
        },
      )
    }

    // Check if planning button is visible (desktop feature)
    const planningButton = page.locator(
      '[data-testid="planning-button"], button:has-text("Planning"), button:has-text("Plan")',
    )
    if (
      (await planningButton.count()) > 0 &&
      (await planningButton.isVisible())
    ) {
      console.log(`${projectName}: Planning button visible`)

      // Click to open planning modal
      await planningButton.click()
      await page.waitForTimeout(500) // Wait for modal animation

      // Check if modal opened
      const planningModal = page.locator(
        '[role="dialog"], [data-testid="planning-modal"], .modal',
      )
      if (
        (await planningModal.count()) > 0 &&
        (await planningModal.isVisible())
      ) {
        await expect(page).toHaveScreenshot(
          `planning-modal-${projectName}.png`,
          {
            fullPage: true,
            animations: 'disabled',
          },
        )

        // Close modal
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
      }
    }

    console.log(`${projectName}: Form interaction test completed`)
  })

  /**
   * Test 5: Mobile Navigation
   * Tests the mobile-specific lesson navigation
   */
  test('Mobile Lesson Navigation - Mobile viewports only', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()

    // Skip for desktop viewports
    if (!viewport || viewport.width >= 768) {
      console.log(
        `${projectName}: Skipping mobile navigation test for desktop viewport`,
      )
      return
    }

    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for mobile lesson navigation
    const mobileNavigation = page.locator(
      '[data-testid="lesson-nav"], .lesson-nav, .mobile-nav',
    )
    if ((await mobileNavigation.count()) > 0) {
      console.log(`${projectName}: Mobile lesson navigation found`)

      // Take screenshot of mobile navigation
      await expect(mobileNavigation).toHaveScreenshot(
        `mobile-lesson-nav-${projectName}.png`,
        {
          animations: 'disabled',
        },
      )
    }

    // Look for mobile toolbox trigger
    const toolboxTrigger = page.locator(
      '[data-testid="toolbox-trigger"], button:has-text("Tools"), .toolbox-trigger',
    )
    if (
      (await toolboxTrigger.count()) > 0 &&
      (await toolboxTrigger.isVisible())
    ) {
      await toolboxTrigger.click()
      await page.waitForTimeout(500)

      // Take screenshot of opened toolbox
      const toolbox = page.locator(
        '[data-testid="toolbox"], .toolbox, [role="dialog"]',
      )
      if ((await toolbox.count()) > 0 && (await toolbox.isVisible())) {
        await expect(page).toHaveScreenshot(
          `mobile-toolbox-${projectName}.png`,
          {
            fullPage: true,
            animations: 'disabled',
          },
        )

        console.log(`${projectName}: Mobile toolbox captured`)

        // Close toolbox
        await page.keyboard.press('Escape')
        await page.waitForTimeout(300)
      }
    }
  })

  /**
   * Test 6: Lesson Student Selector
   * Tests navigation between students/groups
   */
  test('Lesson Student Selector - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()

    // Start with main student
    await page.goto(`/lessons/s-${testData.defaultStudentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for student/group selector
    const holderSelector = page
      .locator(
        '[data-testid="holder-selector"], select, [role="combobox"], [data-testid="student-selector"]',
      )
      .first()

    if (
      (await holderSelector.count()) > 0 &&
      (await holderSelector.isVisible())
    ) {
      // Take screenshot before opening selector
      await expect(page).toHaveScreenshot(
        `lesson-selector-closed-${projectName}.png`,
        {
          fullPage: false,
          clip: { x: 0, y: 0, width: viewport?.width || 1280, height: 200 },
          animations: 'disabled',
        },
      )

      await holderSelector.click()
      await page.waitForTimeout(500)

      // Take screenshot of opened selector
      await expect(page).toHaveScreenshot(
        `lesson-selector-open-${projectName}.png`,
        {
          fullPage: viewport ? viewport.width < 768 : false, // Full page for mobile
          animations: 'disabled',
        },
      )

      console.log(`${projectName}: Student/group selector captured`)

      // Try to select a different student if available
      if (
        testData.additionalStudentIds &&
        testData.additionalStudentIds.length > 0
      ) {
        const otherStudentOption = page
          .locator(
            `[data-value="s-${testData.additionalStudentIds[0]}"], option, [data-student-id="${testData.additionalStudentIds[0]}"]`,
          )
          .first()

        if ((await otherStudentOption.count()) > 0) {
          await otherStudentOption.click()
          await page.waitForLoadState('networkidle')
          await page.waitForTimeout(1000)

          console.log(
            `${projectName}: Successfully navigated to different student`,
          )

          // Take screenshot with different student selected
          await expect(page).toHaveScreenshot(
            `lesson-different-student-${projectName}.png`,
            {
              fullPage: true,
              animations: 'disabled',
            },
          )
        }
      }
    } else {
      console.log(`${projectName}: No student selector found`)
    }
  })

  /**
   * Test 7: Previous Lessons Layout
   * Tests the previous lessons section responsiveness
   */
  test('Previous Lessons Layout - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for previous lessons section
    const previousLessons = page.locator(
      '[data-testid="previous-lessons"], .previous-lessons, .lessons-history',
    )

    if (
      (await previousLessons.count()) > 0 &&
      (await previousLessons.isVisible())
    ) {
      // Count lesson items
      const lessonItems = page.locator(
        '.lesson-item, [data-testid="lesson-item"], .previous-lesson',
      )
      const itemCount = await lessonItems.count()

      console.log(`${projectName}: Previous lesson items: ${itemCount}`)

      // Take focused screenshot of previous lessons section
      await expect(previousLessons).toHaveScreenshot(
        `previous-lessons-${projectName}.png`,
        {
          animations: 'disabled',
        },
      )

      // Test mobile vs desktop layout differences
      if (viewport && viewport.width < 768) {
        console.log(`${projectName}: Mobile previous lessons layout captured`)
      } else {
        console.log(`${projectName}: Desktop previous lessons layout captured`)
      }
    } else {
      console.log(`${projectName}: No previous lessons section found`)
    }
  })

  /**
   * Test 8: Repertoire Navigation Integration
   * Tests repertoire button/link integration within lesson interface
   */
  test('Repertoire Navigation Integration - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for repertoire navigation elements in the lesson interface
    const repertoireButton = page.locator(
      'button:has-text("Repertoire"), a:has-text("Repertoire"), [data-testid="repertoire-button"]',
    )
    const repertoireLink = page.locator(
      'a[href*="repertoire"], button[data-repertoire], [data-testid="repertoire-link"]',
    )

    console.log(
      `${projectName}: Repertoire button: ${await repertoireButton.count()}, Repertoire link: ${await repertoireLink.count()}`,
    )

    // Check if repertoire navigation is visible
    const hasRepertoireNav =
      (await repertoireButton.count()) > 0 || (await repertoireLink.count()) > 0

    if (hasRepertoireNav) {
      console.log(
        `${projectName}: Repertoire navigation found in lesson interface`,
      )

      // Take screenshot showing repertoire integration
      await expect(page).toHaveScreenshot(
        `lesson-repertoire-integration-${projectName}.png`,
        {
          fullPage: viewport ? viewport.width < 768 : false,
          animations: 'disabled',
        },
      )

      // Test clicking the repertoire navigation (but don't wait for full page load)
      const navElement =
        (await repertoireButton.count()) > 0
          ? repertoireButton.first()
          : repertoireLink.first()
      if (await navElement.isVisible()) {
        // Just test that the element is clickable
        const isClickable = await navElement.evaluate(
          (el) => !el.hasAttribute('disabled'),
        )
        console.log(
          `${projectName}: Repertoire navigation clickable: ${isClickable}`,
        )
      }
    } else {
      console.log(
        `${projectName}: No repertoire navigation found in lesson interface`,
      )
    }
  })

  /**
   * Test 9: No Students State
   * Tests the no students state of the lessons page
   */
  test('No Students State - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name

    // Navigate directly to the no-students lesson page
    await page.goto('/lessons/no-students')

    await page.waitForSelector(
      '[data-testid="no-students"], .no-students, main',
      {
        state: 'visible',
        timeout: 10000,
      },
    )

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Take screenshot of no students state
    await expect(page).toHaveScreenshot(`no-students-${projectName}.png`, {
      fullPage: true,
      animations: 'disabled',
    })

    console.log(`${projectName}: No students state captured`)
  })
})
