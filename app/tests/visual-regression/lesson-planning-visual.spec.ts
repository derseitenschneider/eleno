import { test } from '@playwright/test'
import { LessonsPOM } from '../pom/LessonsPOM'
import { createVisualTestHelper } from './helpers/visualTestHelpers'

test.describe('Lesson Planning Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to lessons page and wait for it to load
    const lessonsPOM = new LessonsPOM(page, test.info())
    await lessonsPOM.goto()
  })

  test('lesson planning form - responsive design', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Wait for the lesson planning form to be visible
    await page.waitForSelector('[data-testid="lesson-planning-form"]', {
      state: 'visible',
      timeout: 10000,
    })

    const formLocator = page.locator('[data-testid="lesson-planning-form"]')

    // Test responsive breakpoints
    await visual.testResponsiveComponent(formLocator, 'lesson-planning-form')
  })

  test('lesson planning form - theme variations', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Wait for the lesson planning form to be visible
    await page.waitForSelector('[data-testid="lesson-planning-form"]', {
      state: 'visible',
      timeout: 10000,
    })

    const formLocator = page.locator('[data-testid="lesson-planning-form"]')

    // Test light and dark themes
    await visual.testComponentThemes(formLocator, 'lesson-planning-form')
  })

  test('lesson planning modal - complete workflow', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Look for the planning modal button
    const planningButton = page.locator(
      '[data-testid="planning-modal-button"], button:has-text("Planen")',
    )
    if (await planningButton.isVisible()) {
      await planningButton.click()

      // Wait for modal to open
      await page.waitForSelector('[role="dialog"]', { state: 'visible' })

      const modalLocator = page.locator('[role="dialog"]')

      // Test modal in different states
      await visual.testComponentStates(modalLocator, 'lesson-planning-modal', [
        {
          name: 'form-filled',
          action: async () => {
            // Fill out the form
            const dateInput = page.locator('input[type="date"]')
            if (await dateInput.isVisible()) {
              await dateInput.fill('2024-12-25')
            }

            const contentArea = page
              .locator(
                '[data-testid="lesson-content"], textarea, [contenteditable="true"]',
              )
              .first()
            if (await contentArea.isVisible()) {
              await contentArea.fill('Sample lesson content for visual testing')
            }
          },
        },
        {
          name: 'with-validation-error',
          action: async () => {
            // Clear required fields to show validation
            const contentArea = page
              .locator(
                '[data-testid="lesson-content"], textarea, [contenteditable="true"]',
              )
              .first()
            if (await contentArea.isVisible()) {
              await contentArea.clear()
            }
          },
        },
      ])
    }
  })

  test('planned lesson items - list view', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Wait for planned lessons list
    await page.waitForSelector(
      '[data-testid="planned-lessons-list"], .planned-lessons',
      {
        state: 'visible',
        timeout: 10000,
      },
    )

    const listLocator = page
      .locator('[data-testid="planned-lessons-list"], .planned-lessons')
      .first()

    // Test list view
    await visual.takeScreenshot({
      name: 'planned-lessons-list',
      clip: listLocator,
    })

    // Test responsive design
    await visual.testResponsiveComponent(listLocator, 'planned-lessons-list')
  })

  test('lesson planning dropdown - states', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Look for dropdown trigger
    const dropdownTrigger = page.locator(
      '[data-testid="lesson-dropdown"], [role="button"]:has-text("⋮"), .dropdown-trigger',
    )

    if (await dropdownTrigger.first().isVisible()) {
      const trigger = dropdownTrigger.first()

      // Test dropdown states
      await visual.testComponentStates(trigger, 'lesson-planning-dropdown', [
        {
          name: 'opened',
          action: async () => {
            await trigger.click()
            // Wait for dropdown menu to appear
            await page.waitForSelector('[role="menu"], .dropdown-menu', {
              state: 'visible',
            })
          },
        },
      ])
    }
  })

  test('lesson content editor - visual states', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Look for content editor
    const editorLocator = page.locator(
      '[data-testid="lesson-content"], .editor, [contenteditable="true"]',
    )

    if (await editorLocator.first().isVisible()) {
      const editor = editorLocator.first()

      // Test editor states
      await visual.testComponentStates(editor, 'lesson-content-editor', [
        {
          name: 'focused',
          action: async () => {
            await editor.focus()
          },
        },
        {
          name: 'with-content',
          action: async () => {
            await editor.fill(
              'This is sample lesson content for testing the visual appearance of the editor component.',
            )
          },
        },
      ])
    }
  })

  test('lesson date picker - calendar component', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Look for date picker
    const datePickerTrigger = page.locator(
      'input[type="date"], [data-testid="date-picker"], button:has-text("Datum")',
    )

    if (await datePickerTrigger.first().isVisible()) {
      const datePicker = datePickerTrigger.first()

      await visual.takeScreenshot({
        name: 'lesson-date-picker-input',
        clip: datePicker,
      })

      // If it's a button that opens a calendar, click it
      if ((await datePicker.getAttribute('type')) !== 'date') {
        await datePicker.click()

        // Wait for calendar to open
        const calendar = page.locator(
          '[role="dialog"] .calendar, .date-picker-calendar',
        )
        if (await calendar.isVisible()) {
          await visual.takeScreenshot({
            name: 'lesson-date-picker-calendar',
            clip: calendar,
          })
        }
      }
    }
  })

  test('lesson planning toolbar - action buttons', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Look for toolbar with action buttons
    const toolbar = page.locator(
      '[data-testid="lesson-toolbar"], .lesson-actions, .toolbar',
    )

    if (await toolbar.first().isVisible()) {
      const toolbarElement = toolbar.first()

      // Test toolbar appearance
      await visual.takeScreenshot({
        name: 'lesson-planning-toolbar',
        clip: toolbarElement,
      })

      // Test responsive design
      await visual.testResponsiveComponent(
        toolbarElement,
        'lesson-planning-toolbar',
      )
    }
  })

  test('homework assignment section - visual layout', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Look for homework section
    const homeworkSection = page.locator(
      '[data-testid="homework"], .homework-section, textarea[placeholder*="Homework"], textarea[placeholder*="Hausaufgabe"]',
    )

    if (await homeworkSection.first().isVisible()) {
      const homework = homeworkSection.first()

      // Test homework section states
      await visual.testComponentStates(homework, 'homework-section', [
        {
          name: 'empty',
          action: async () => {
            await homework.clear()
          },
        },
        {
          name: 'filled',
          action: async () => {
            await homework.fill(
              'Practice scales: C major, G major, and D major. Focus on proper fingering and tempo control.',
            )
          },
        },
      ])
    }
  })

  test('lesson planning mobile layout - complete view', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await visual.waitForStability()

    // Test complete mobile layout
    await visual.takeScreenshot({
      name: 'lesson-planning-mobile-complete',
      fullPage: true,
    })

    // Test mobile modal if exists
    const mobileModal = page.locator('[role="dialog"], .mobile-modal')
    if (await mobileModal.isVisible()) {
      await visual.takeScreenshot({
        name: 'lesson-planning-mobile-modal',
        clip: mobileModal,
      })
    }
  })
})
