import { test } from '@playwright/test'
import { LessonsPOM } from '../pom/LessonsPOM'
import { createVisualTestHelper } from './helpers/visualTestHelpers'

test.describe('All Lessons Management Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    const lessonsPOM = new LessonsPOM(page, test.info())
    await lessonsPOM.goto()
    
    // Navigate to all lessons view
    const allLessonsLink = page.locator('[data-testid="all-lessons-link"], a:has-text("Alle Lektionen"), a:has-text("All Lessons")')
    if (await allLessonsLink.isVisible()) {
      await allLessonsLink.click()
      await page.waitForLoadState('networkidle')
    }
  })

  test('all lessons table - desktop layout', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Wait for lessons table
    await page.waitForSelector('[data-testid="lessons-table"], .lessons-table, table', { 
      state: 'visible', 
      timeout: 10000 
    })
    
    const lessonsTable = page.locator('[data-testid="lessons-table"], .lessons-table, table').first()
    
    // Test table layout
    await visual.takeScreenshot({
      name: 'all-lessons-table-desktop',
      clip: lessonsTable,
    })
    
    // Test with different data states
    await visual.testComponentStates(lessonsTable, 'all-lessons-table', [
      {
        name: 'with-sorting',
        action: async () => {
          // Click on a sortable header
          const sortableHeader = lessonsTable.locator('th[role="columnheader"], th button, .sortable-header').first()
          if (await sortableHeader.isVisible()) {
            await sortableHeader.click()
          }
        }
      },
      {
        name: 'with-selection',
        action: async () => {
          // Select table rows
          const checkboxes = lessonsTable.locator('input[type="checkbox"]')
          const count = await checkboxes.count()
          for (let i = 0; i < Math.min(count, 3); i++) {
            await checkboxes.nth(i).check()
          }
        }
      }
    ])
  })

  test('all lessons mobile cards - mobile layout', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await visual.waitForStability()
    
    // Wait for mobile card layout
    await page.waitForSelector('[data-testid="lesson-card"], .lesson-card, .mobile-card', { 
      state: 'visible', 
      timeout: 10000 
    })
    
    const lessonCards = page.locator('[data-testid="lesson-card"], .lesson-card, .mobile-card')
    
    if (await lessonCards.first().isVisible()) {
      const firstCard = lessonCards.first()
      
      // Test mobile card appearance
      await visual.takeScreenshot({
        name: 'all-lessons-mobile-card',
        clip: firstCard,
      })
      
      // Test card interactions
      await visual.testComponentStates(firstCard, 'lesson-mobile-card', [
        {
          name: 'expanded',
          action: async () => {
            // Try to expand card
            const expandButton = firstCard.locator('button, .expand-trigger')
            if (await expandButton.first().isVisible()) {
              await expandButton.first().click()
            }
          }
        }
      ])
    }
  })

  test('lessons filter controls - search and filter UI', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for filter controls
    const filterControls = page.locator('[data-testid="lessons-filter"], .filter-controls, .search-filter')
    
    if (await filterControls.first().isVisible()) {
      const controls = filterControls.first()
      
      // Test filter controls
      await visual.testComponentStates(controls, 'lessons-filter-controls', [
        {
          name: 'with-search-query',
          action: async () => {
            const searchInput = controls.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="Suche"]')
            if (await searchInput.isVisible()) {
              await searchInput.fill('piano lesson')
            }
          }
        },
        {
          name: 'with-date-filter',
          action: async () => {
            const dateFilter = controls.locator('input[type="date"], .date-filter')
            if (await dateFilter.isVisible()) {
              await dateFilter.fill('2024-01-01')
            }
          }
        },
        {
          name: 'with-status-filter',
          action: async () => {
            const statusFilter = controls.locator('select, .status-filter')
            if (await statusFilter.isVisible()) {
              await statusFilter.selectOption({ index: 1 }).catch(() => {
                // If select doesn't work, try clicking
                statusFilter.click()
              })
            }
          }
        }
      ])
      
      // Test responsive filter controls
      await visual.testResponsiveComponent(controls, 'lessons-filter-controls')
    }
  })

  test('lesson bulk actions - multi-select operations', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Select multiple lessons first
    const checkboxes = page.locator('input[type="checkbox"]')
    const count = await checkboxes.count()
    
    if (count > 0) {
      // Select a few lessons
      for (let i = 0; i < Math.min(count, 3); i++) {
        await checkboxes.nth(i).check()
      }
      
      // Look for bulk action toolbar
      const bulkActions = page.locator('[data-testid="bulk-actions"], .bulk-actions, .selected-actions')
      
      if (await bulkActions.isVisible()) {
        await visual.takeScreenshot({
          name: 'lessons-bulk-actions-toolbar',
          clip: bulkActions,
        })
        
        // Test different bulk action states
        const actionButtons = bulkActions.locator('button')
        const buttonCount = await actionButtons.count()
        
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = actionButtons.nth(i)
          await visual.testComponentStates(button, `bulk-action-button-${i}`, [
            {
              name: 'hover',
              action: async () => {
                await button.hover()
              }
            }
          ])
        }
      }
    }
  })

  test('lesson pagination - navigation controls', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for pagination controls
    const pagination = page.locator('[data-testid="pagination"], .pagination, nav[aria-label*="pagination"]')
    
    if (await pagination.first().isVisible()) {
      const paginationControl = pagination.first()
      
      await visual.takeScreenshot({
        name: 'lessons-pagination-controls',
        clip: paginationControl,
      })
      
      // Test pagination states
      await visual.testComponentStates(paginationControl, 'lessons-pagination', [
        {
          name: 'page-2',
          action: async () => {
            const nextButton = paginationControl.locator('button:has-text("2"), .page-2')
            if (await nextButton.isVisible()) {
              await nextButton.click()
              await visual.waitForStability()
            }
          }
        }
      ])
      
      // Test responsive pagination
      await visual.testResponsiveComponent(paginationControl, 'lessons-pagination')
    }
  })

  test('lesson export functionality - export UI', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for export button
    const exportButton = page.locator('[data-testid="export-lessons"], button:has-text("Export"), button:has-text("Exportieren")')
    
    if (await exportButton.first().isVisible()) {
      const button = exportButton.first()
      
      // Test export button
      await visual.takeScreenshot({
        name: 'lessons-export-button',
        clip: button,
      })
      
      await button.click()
      
      // Wait for export options modal/dropdown
      const exportOptions = page.locator('[data-testid="export-options"], .export-options, [role="dialog"]')
      if (await exportOptions.isVisible()) {
        await visual.takeScreenshot({
          name: 'lessons-export-options',
          clip: exportOptions,
        })
      }
    }
  })

  test('lesson table columns - customizable display', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for column customization controls
    const columnToggle = page.locator('[data-testid="column-toggle"], .column-settings, button:has-text("Columns")')
    
    if (await columnToggle.first().isVisible()) {
      await columnToggle.first().click()
      
      // Wait for column options
      const columnOptions = page.locator('[data-testid="column-options"], .column-options, [role="menu"]')
      if (await columnOptions.isVisible()) {
        await visual.takeScreenshot({
          name: 'lessons-column-options',
          clip: columnOptions,
        })
        
        // Test toggling columns
        const columnCheckboxes = columnOptions.locator('input[type="checkbox"]')
        const checkboxCount = await columnCheckboxes.count()
        
        if (checkboxCount > 0) {
          // Toggle a column off
          await columnCheckboxes.first().uncheck()
          await visual.takeScreenshot({
            name: 'lessons-column-options-modified',
            clip: columnOptions,
          })
        }
      }
    }
  })

  test('lesson details drawer - expanded view', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Click on a lesson to open details
    const lessonRow = page.locator('[data-testid="lesson-row"], tr, .lesson-item').first()
    
    if (await lessonRow.isVisible()) {
      await lessonRow.click()
      
      // Wait for details drawer/modal
      const detailsDrawer = page.locator('[data-testid="lesson-details"], .lesson-details, [role="dialog"]')
      
      if (await detailsDrawer.isVisible()) {
        await visual.takeScreenshot({
          name: 'lesson-details-drawer',
          clip: detailsDrawer,
        })
        
        // Test responsive details view
        await visual.testResponsiveComponent(detailsDrawer, 'lesson-details-drawer')
        
        // Test theme variations
        await visual.testComponentThemes(detailsDrawer, 'lesson-details-drawer')
      }
    }
  })

  test('lesson management empty state - no data UI', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Try to create an empty state by applying filters that return no results
    const searchInput = page.locator('input[type="search"], .search-input')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('nonexistent-lesson-query-12345')
      await page.keyboard.press('Enter')
      await visual.waitForStability()
      
      // Look for empty state
      const emptyState = page.locator('[data-testid="empty-state"], .empty-state, .no-results')
      
      if (await emptyState.isVisible()) {
        await visual.takeScreenshot({
          name: 'lessons-empty-state',
          clip: emptyState,
        })
        
        // Test empty state responsiveness
        await visual.testResponsiveComponent(emptyState, 'lessons-empty-state')
      }
    }
  })

  test('lesson status badges - visual indicators', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for status badges in the table
    const statusBadges = page.locator('[data-testid="lesson-status"], .status-badge, .badge')
    
    if (await statusBadges.first().isVisible()) {
      // Test different status badges
      const badgeCount = await statusBadges.count()
      
      for (let i = 0; i < Math.min(badgeCount, 5); i++) {
        const badge = statusBadges.nth(i)
        const statusText = await badge.textContent() || `status-${i}`
        
        await visual.takeScreenshot({
          name: `lesson-status-badge-${statusText.toLowerCase().replace(/\s+/g, '-')}`,
          clip: badge,
        })
      }
      
      // Test theme variations for status badges
      if (badgeCount > 0) {
        await visual.testComponentThemes(statusBadges.first(), 'lesson-status-badges')
      }
    }
  })
})