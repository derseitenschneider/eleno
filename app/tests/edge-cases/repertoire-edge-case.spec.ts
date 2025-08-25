import * as fs from 'node:fs'
import { expect, test } from '@playwright/test'

/**
 * Edge-case visual regression tests for Repertoire functionality
 * Tests problematic viewport sizes that could cause layout issues with repertoire display
 *
 * Test Coverage:
 * 1. Repertoire list view (table/card layouts)
 * 2. Repertoire creation interface
 * 3. Repertoire details and editing
 * 4. Date handling and formatting
 * 5. Student/group repertoire filtering
 * 6. Empty state handling
 * 7. Table responsiveness (column visibility)
 * 8. Mobile vs desktop layout differences
 * 9. Progress tracking and status indicators
 *
 * @junior-dev-notes
 * Repertoire tracks musical pieces that students/groups are working on or have completed.
 * Each piece has a title, start date, end date (optional), and can be tied to students or groups.
 * The interface adapts between table view (desktop) and card view (mobile).
 *
 * Key points:
 * - Repertoire appears in lesson pages and has its own dedicated view
 * - Check viewport.width to determine table vs card layout
 * - Handle date formatting consistently across viewports
 * - Test empty states when no pieces are assigned
 * - Verify responsive table column hiding on smaller screens
 * - Status is determined by presence/absence of end dates
 */
test.describe('Repertoire - Edge Case Visual Regression', () => {
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
   * Test 1: Student Repertoire List View
   * Tests the repertoire interface for a specific student
   */
  test('Student Repertoire List - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}/repertoire`)

    // Wait for repertoire interface to load
    await page.waitForSelector(
      '[data-testid="repertoire"], .repertoire-list, .repertoire, table, .repertoire-cards',
      {
        state: 'visible',
        timeout: 15000,
      },
    )

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Check layout type based on viewport
    if (viewport && viewport.width < 768) {
      // Mobile: Should show card layout
      const repertoireCards = page.locator(
        '[data-testid="repertoire-card"], .repertoire-card, .piece-card',
      )
      const cardCount = await repertoireCards.count()
      console.log(`${projectName}: Mobile repertoire cards: ${cardCount}`)

      // Test card layout and content
      if (cardCount > 0) {
        const firstCard = repertoireCards.first()
        const cardInfo = await firstCard.evaluate((el) => ({
          title: el.querySelector(
            '[data-testid="piece-title"], .piece-title, .title',
          )?.textContent,
          startDate: el.querySelector(
            '[data-testid="start-date"], .start-date, .date',
          )?.textContent,
          endDate: el.querySelector('[data-testid="end-date"], .end-date')
            ?.textContent,
          status: el.querySelector('[data-testid="status"], .status')
            ?.textContent,
        }))
        console.log(`${projectName}: Card content:`, cardInfo)
      }
    } else {
      // Desktop: Should show table layout
      const repertoireTable = page.locator(
        'table, [data-testid="repertoire-table"]',
      )
      if ((await repertoireTable.count()) > 0) {
        // Check table columns
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

        console.log(`${projectName}: Repertoire table columns:`, visibleColumns)

        // Count repertoire rows
        const repertoireRows = await page.locator('tbody tr').count()
        console.log(`${projectName}: Repertoire pieces: ${repertoireRows}`)
      }
    }

    // Take screenshot of student repertoire
    await expect(page).toHaveScreenshot(
      `student-repertoire-${projectName}.png`,
      {
        fullPage: true,
        animations: 'disabled',
      },
    )

    console.log(
      `${projectName}: Student repertoire captured at ${viewport?.width}x${viewport?.height}`,
    )
  })

  /**
   * Test 2: Group Repertoire List View
   * Tests the repertoire interface for a group
   */
  test('Group Repertoire List - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const groupId = testData.groupId

    if (!groupId) {
      console.log(
        `${projectName}: No group created, skipping group repertoire test`,
      )
      return
    }

    await page.goto(`/lessons/g-${groupId}/repertoire`)

    await page.waitForSelector(
      '[data-testid="repertoire"], .repertoire-list, table, .repertoire-cards',
      {
        state: 'visible',
        timeout: 15000,
      },
    )

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Check for group-specific indicators
    const groupIndicators = page.locator(
      '[data-testid="group-repertoire"], .group-repertoire, .ensemble-pieces',
    )
    console.log(
      `${projectName}: Group repertoire indicators: ${await groupIndicators.count()}`,
    )

    // Count group pieces
    const repertoireItems = await page
      .locator('tbody tr, [data-testid="repertoire-card"], .repertoire-card')
      .count()
    console.log(`${projectName}: Group repertoire pieces: ${repertoireItems}`)

    // Take screenshot of group repertoire
    await expect(page).toHaveScreenshot(`group-repertoire-${projectName}.png`, {
      fullPage: true,
      animations: 'disabled',
    })

    console.log(`${projectName}: Group repertoire captured`)
  })

  /**
   * Test 3: Repertoire Creation Interface
   * Tests the interface for adding new repertoire pieces
   */
  test('Repertoire Creation Interface - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}/repertoire`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for add repertoire button
    const addButton = page.locator(
      '[data-testid="add-repertoire"], button:has-text("Add"), .add-piece-btn, button:has-text("New Piece")',
    )

    if ((await addButton.count()) > 0 && (await addButton.isVisible())) {
      // Take screenshot before opening form
      await expect(page).toHaveScreenshot(
        `repertoire-creation-closed-${projectName}.png`,
        {
          fullPage: viewport ? viewport.width < 768 : false,
          animations: 'disabled',
        },
      )

      await addButton.click()
      await page.waitForTimeout(500)

      // Check for creation form/modal
      const repertoireForm = page.locator(
        '[data-testid="repertoire-form"], .repertoire-form, [role="dialog"], .modal',
      )

      if (
        (await repertoireForm.count()) > 0 &&
        (await repertoireForm.isVisible())
      ) {
        // Identify form fields
        const titleField = repertoireForm.locator(
          'input[placeholder*="title" i], input[name*="title" i]',
        )
        const startDateField = repertoireForm.locator(
          'input[type="date"], input[name*="start" i]',
        )
        const endDateField = repertoireForm.locator(
          'input[name*="end" i], input[placeholder*="end" i]',
        )

        console.log(
          `${projectName}: Form fields - Title: ${await titleField.count()}, Start: ${await startDateField.count()}, End: ${await endDateField.count()}`,
        )

        // Fill form to test layout
        if ((await titleField.count()) > 0) {
          await titleField.fill('Test Piece - Visual Regression Suite')
        }
        if ((await startDateField.count()) > 0) {
          await startDateField.fill('2024-01-15')
        }

        // Take screenshot with form filled
        await expect(page).toHaveScreenshot(
          `repertoire-creation-form-${projectName}.png`,
          {
            fullPage: viewport ? viewport.width < 768 : false,
            animations: 'disabled',
          },
        )

        // Test date picker interaction
        if ((await endDateField.count()) > 0) {
          await endDateField.click()
          await page.waitForTimeout(300)

          // Check if date picker opened
          const datePicker = page.locator(
            '.date-picker, [role="dialog"]:has([role="grid"])',
          )
          if ((await datePicker.count()) > 0) {
            await expect(page).toHaveScreenshot(
              `repertoire-date-picker-${projectName}.png`,
              {
                fullPage: viewport ? viewport.width < 768 : false,
                animations: 'disabled',
              },
            )

            // Close date picker
            await page.keyboard.press('Escape')
            await page.waitForTimeout(200)
          }
        }

        // Close form
        const closeButton = page.locator(
          '[data-testid="close"], button:has-text("Cancel"), .close-btn',
        )
        if ((await closeButton.count()) > 0) {
          await closeButton.click()
        } else {
          await page.keyboard.press('Escape')
        }
        await page.waitForTimeout(300)
      }
    } else {
      console.log(`${projectName}: No add repertoire button found`)
    }
  })

  /**
   * Test 4: Repertoire Table Responsiveness
   * Tests how table columns adapt to different viewport sizes
   */
  test('Repertoire Table Responsiveness - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}/repertoire`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Only test table on desktop
    if (viewport && viewport.width >= 768) {
      const repertoireTable = page.locator(
        'table, [data-testid="repertoire-table"]',
      )

      if ((await repertoireTable.count()) > 0) {
        // Analyze column visibility
        const columnAnalysis = await page.evaluate(() => {
          const headers = Array.from(
            document.querySelectorAll('thead th, thead td'),
          )
          return headers.map((h, index) => {
            const style = window.getComputedStyle(h as HTMLElement)
            return {
              index,
              text: h.textContent?.trim(),
              visible:
                style.display !== 'none' && style.visibility !== 'hidden',
              width: style.width,
            }
          })
        })

        console.log(
          `${projectName} (${viewport.width}px) column analysis:`,
          columnAnalysis,
        )

        // Verify appropriate columns for viewport size
        const visibleColumns = columnAnalysis.filter((col) => col.visible)
        console.log(`${projectName}: ${visibleColumns.length} visible columns`)

        // Take focused screenshot of table
        await expect(repertoireTable).toHaveScreenshot(
          `repertoire-table-${projectName}.png`,
          {
            animations: 'disabled',
          },
        )
      }
    } else {
      console.log(
        `${projectName}: Mobile viewport - testing card layout instead`,
      )

      // Mobile card layout analysis
      const repertoireCards = page.locator(
        '[data-testid="repertoire-card"], .repertoire-card',
      )
      const cardCount = await repertoireCards.count()

      if (cardCount > 0) {
        // Test card content visibility
        const cardContent = await repertoireCards.first().evaluate((el) => {
          const title = el.querySelector('[data-testid="piece-title"], .title')
          const dates = el.querySelector('[data-testid="dates"], .dates')
          const status = el.querySelector('[data-testid="status"], .status')

          return {
            hasTitle: !!title,
            hasDates: !!dates,
            hasStatus: !!status,
            titleVisible: title
              ? window.getComputedStyle(title).display !== 'none'
              : false,
          }
        })

        console.log(`${projectName}: Mobile card content:`, cardContent)
      }
    }
  })

  /**
   * Test 5: Repertoire Details and Editing
   * Tests detailed view and editing of repertoire pieces
   */
  test('Repertoire Details and Editing - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}/repertoire`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for existing repertoire items to interact with
    const repertoireItems = page.locator(
      'tbody tr, [data-testid="repertoire-card"], .repertoire-card, .piece-item',
    )
    const itemCount = await repertoireItems.count()

    if (itemCount > 0) {
      const firstItem = repertoireItems.first()

      // Look for edit/details action
      const editButton = firstItem.locator(
        '[data-testid="edit"], .edit-btn, button:has-text("Edit")',
      )
      const detailsButton = firstItem.locator(
        '[data-testid="details"], .details-btn',
      )

      if ((await editButton.count()) > 0 && (await editButton.isVisible())) {
        await editButton.click()
      } else if (
        (await detailsButton.count()) > 0 &&
        (await detailsButton.isVisible())
      ) {
        await detailsButton.click()
      } else {
        // Try clicking the item itself
        await firstItem.click()
      }

      await page.waitForTimeout(500)

      // Check for edit/details modal or inline editing
      const editModal = page.locator(
        '[data-testid="edit-repertoire"], .edit-modal, [role="dialog"], .repertoire-details',
      )

      if ((await editModal.count()) > 0 && (await editModal.isVisible())) {
        console.log(`${projectName}: Repertoire edit/details modal opened`)

        // Check for editable fields
        const editableFields = await editModal
          .locator('input, textarea, select')
          .count()
        console.log(`${projectName}: Editable fields: ${editableFields}`)

        await expect(page).toHaveScreenshot(
          `repertoire-edit-modal-${projectName}.png`,
          {
            fullPage: viewport ? viewport.width < 768 : false,
            animations: 'disabled',
          },
        )

        // Test form interactions
        const titleInput = editModal.locator(
          'input[name*="title" i], input[placeholder*="title" i]',
        )
        if ((await titleInput.count()) > 0) {
          await titleInput.fill('Edited Test Piece Title')
          await page.waitForTimeout(200)

          await expect(page).toHaveScreenshot(
            `repertoire-edit-filled-${projectName}.png`,
            {
              fullPage: viewport ? viewport.width < 768 : false,
              animations: 'disabled',
            },
          )
        }

        // Close modal
        const closeButton = page.locator(
          'button:has-text("Cancel"), button:has-text("Close"), [data-testid="close"]',
        )
        if ((await closeButton.count()) > 0) {
          await closeButton.click()
        } else {
          await page.keyboard.press('Escape')
        }
        await page.waitForTimeout(300)
      }
    } else {
      console.log(
        `${projectName}: No repertoire items available for editing test`,
      )
    }
  })

  /**
   * Test 6: Repertoire Status and Progress Indicators
   * Tests visual indicators for piece status (in progress, completed, etc.)
   */
  test('Repertoire Status Indicators - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}/repertoire`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Analyze status indicators
    const statusAnalysis = await page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll(
          'tbody tr, [data-testid="repertoire-card"], .repertoire-card',
        ),
      )

      return items.map((item, index) => {
        const statusElement = item.querySelector(
          '[data-testid="status"], .status, .piece-status',
        )
        const endDateElement = item.querySelector(
          '[data-testid="end-date"], .end-date',
        )
        const progressElement = item.querySelector('.progress, .progress-bar')

        return {
          index,
          title: item
            .querySelector('[data-testid="piece-title"], .title, .piece-title')
            ?.textContent?.trim(),
          status: statusElement?.textContent?.trim() || 'No status',
          hasEndDate: !!endDateElement?.textContent?.trim(),
          hasProgress: !!progressElement,
          statusClasses: statusElement?.className || '',
          backgroundColor: statusElement
            ? window.getComputedStyle(statusElement).backgroundColor
            : 'none',
        }
      })
    })

    console.log(
      `${projectName}: Status analysis:`,
      JSON.stringify(statusAnalysis, null, 2),
    )

    // Group by status
    const statusGroups = statusAnalysis.reduce((groups: any, item) => {
      const status = item.hasEndDate ? 'completed' : 'in_progress'
      if (!groups[status]) groups[status] = []
      groups[status].push(item)
      return groups
    }, {})

    console.log(
      `${projectName}: Status groups:`,
      Object.keys(statusGroups).map(
        (key) => `${key}: ${statusGroups[key].length}`,
      ),
    )

    // Take screenshot highlighting status indicators
    await expect(page).toHaveScreenshot(
      `repertoire-status-indicators-${projectName}.png`,
      {
        fullPage: true,
        animations: 'disabled',
      },
    )
  })

  /**
   * Test 7: Empty Repertoire State
   * Tests the empty state when no repertoire pieces exist
   */
  test('Empty Repertoire State - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name

    // Use a student without repertoire or create a test scenario
    const studentIds = testData.additionalStudentIds
    const emptyStudentId =
      studentIds && studentIds.length > 2
        ? studentIds[2]
        : testData.defaultStudentId

    await page.goto(`/lessons/s-${emptyStudentId}/repertoire`)

    await page.waitForSelector(
      'main, [data-testid="repertoire-container"], .repertoire',
      {
        state: 'visible',
        timeout: 10000,
      },
    )

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Check for empty state
    const emptyState = page.locator(
      '[data-testid="empty-repertoire"], .empty-state, .no-repertoire, .empty-repertoire',
    )

    const hasEmptyState = (await emptyState.count()) > 0

    // Also check if table/cards are empty
    const repertoireItems = await page
      .locator('tbody tr, [data-testid="repertoire-card"]')
      .count()

    console.log(
      `${projectName}: Empty state found: ${hasEmptyState}, Repertoire items: ${repertoireItems}`,
    )

    if (hasEmptyState || repertoireItems === 0) {
      // Look for call-to-action
      const addFirstPieceButton = page.locator(
        'button:has-text("Add"), button:has-text("First"), [data-testid="add-first-piece"]',
      )

      console.log(
        `${projectName}: Add first piece button: ${await addFirstPieceButton.count()}`,
      )
    }

    await expect(page).toHaveScreenshot(
      `repertoire-empty-state-${projectName}.png`,
      {
        fullPage: true,
        animations: 'disabled',
      },
    )

    console.log(`${projectName}: Empty repertoire state captured`)
  })

  /**
   * Test 8: Repertoire Filtering and Search
   * Tests filtering functionality if available
   */
  test('Repertoire Filtering - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}/repertoire`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for filter/search functionality
    const searchInput = page.locator(
      '[data-testid="repertoire-search"], input[placeholder*="search" i], .search-input',
    )
    const filterButtons = page.locator(
      '[data-testid="filter"], .filter-btn, button:has-text("Filter")',
    )

    if ((await searchInput.count()) > 0 && (await searchInput.isVisible())) {
      console.log(`${projectName}: Repertoire search available`)

      await searchInput.click()
      await searchInput.fill('Bach')
      await page.waitForTimeout(500)

      await expect(page).toHaveScreenshot(
        `repertoire-search-active-${projectName}.png`,
        {
          fullPage: viewport ? viewport.width < 768 : false,
          animations: 'disabled',
        },
      )

      await searchInput.clear()
      await page.waitForTimeout(300)
    }

    if ((await filterButtons.count()) > 0) {
      console.log(
        `${projectName}: Filter options available: ${await filterButtons.count()}`,
      )

      const firstFilter = filterButtons.first()
      await firstFilter.click()
      await page.waitForTimeout(300)

      await expect(page).toHaveScreenshot(
        `repertoire-filter-active-${projectName}.png`,
        {
          fullPage: true,
          animations: 'disabled',
        },
      )
    }

    // Look for status filters (completed/in progress)
    const statusFilters = page.locator(
      'button:has-text("Completed"), button:has-text("In Progress"), button:has-text("All")',
    )

    if ((await statusFilters.count()) > 0) {
      console.log(
        `${projectName}: Status filters available: ${await statusFilters.count()}`,
      )

      await expect(page).toHaveScreenshot(
        `repertoire-status-filters-${projectName}.png`,
        {
          fullPage: true,
          animations: 'disabled',
        },
      )
    }
  })

  /**
   * Test 9: Repertoire Date Formatting
   * Tests date display consistency across viewports
   */
  test('Repertoire Date Formatting - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}/repertoire`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Analyze date formatting
    const dateAnalysis = await page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll('tbody tr, [data-testid="repertoire-card"]'),
      )

      return items.map((item, index) => {
        const startDateEl = item.querySelector(
          '[data-testid="start-date"], .start-date, td:nth-child(2)',
        )
        const endDateEl = item.querySelector(
          '[data-testid="end-date"], .end-date, td:nth-child(3)',
        )

        return {
          index,
          title: item
            .querySelector(
              '[data-testid="piece-title"], .title, td:first-child',
            )
            ?.textContent?.trim(),
          startDate: startDateEl?.textContent?.trim() || 'No start date',
          endDate: endDateEl?.textContent?.trim() || 'No end date',
          startDateFormat: startDateEl?.getAttribute('data-format'),
          endDateFormat: endDateEl?.getAttribute('data-format'),
        }
      })
    })

    console.log(
      `${projectName}: Date formatting analysis:`,
      JSON.stringify(dateAnalysis, null, 2),
    )

    // Check for consistent date formatting
    const dateFormats = dateAnalysis.map((item) => ({
      start: item.startDate,
      end: item.endDate,
    }))

    console.log(
      `${projectName}: Date formats by viewport (${viewport?.width}px):`,
      dateFormats,
    )

    await expect(page).toHaveScreenshot(
      `repertoire-date-formatting-${projectName}.png`,
      {
        fullPage: true,
        animations: 'disabled',
      },
    )
  })

  /**
   * Test 10: Repertoire Mobile Interactions
   * Tests mobile-specific interactions like swipe, long press
   */
  test('Repertoire Mobile Interactions - Mobile viewports only', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()

    // Skip for desktop viewports
    if (!viewport || viewport.width >= 768) {
      console.log(
        `${projectName}: Skipping mobile interactions test for desktop viewport`,
      )
      return
    }

    const studentId = testData.defaultStudentId
    await page.goto(`/lessons/s-${studentId}/repertoire`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Test mobile card interactions
    const repertoireCards = page.locator(
      '[data-testid="repertoire-card"], .repertoire-card',
    )
    const cardCount = await repertoireCards.count()

    if (cardCount > 0) {
      const firstCard = repertoireCards.first()

      // Test long press for context menu
      await firstCard.hover()
      await page.waitForTimeout(200)

      // Simulate long press (touchstart + delay + touchend)
      await firstCard.dispatchEvent('touchstart')
      await page.waitForTimeout(800)
      await firstCard.dispatchEvent('touchend')
      await page.waitForTimeout(300)

      // Check for context menu
      const contextMenu = page.locator(
        '[data-testid="context-menu"], .context-menu, [role="menu"]',
      )
      if ((await contextMenu.count()) > 0) {
        await expect(page).toHaveScreenshot(
          `repertoire-mobile-context-menu-${projectName}.png`,
          {
            fullPage: true,
            animations: 'disabled',
          },
        )

        // Close context menu
        await page.tap('body')
        await page.waitForTimeout(300)
      }

      // Test scrolling with many items
      if (cardCount > 3) {
        await page.evaluate(() => {
          window.scrollTo(0, 300)
        })
        await page.waitForTimeout(300)

        await expect(page).toHaveScreenshot(
          `repertoire-mobile-scroll-${projectName}.png`,
          {
            fullPage: true,
            animations: 'disabled',
          },
        )
      }
    }

    console.log(`${projectName}: Mobile repertoire interactions tested`)
  })
})
