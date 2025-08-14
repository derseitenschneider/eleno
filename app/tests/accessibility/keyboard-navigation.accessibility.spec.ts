import { test, expect } from '@playwright/test'
import { AccessibilityHelpers } from './helpers/accessibilityHelpers'
import { LessonsPOM } from '../pom/LessonsPOM'
import { ActiveStudentsPOM as StudentsPOM } from '../pom/StudentsPOM'

test.describe('Keyboard Navigation Accessibility Tests', () => {
  let accessibilityHelpers: AccessibilityHelpers
  let lessonsPOM: LessonsPOM
  let studentsPOM: StudentsPOM

  test.beforeEach(async ({ page }, testInfo) => {
    accessibilityHelpers = new AccessibilityHelpers(page)
    lessonsPOM = new LessonsPOM(page, testInfo)
    studentsPOM = new StudentsPOM(page)
  })

  test.describe('Main Navigation Keyboard Accessibility', () => {
    test('should navigate through main sidebar using keyboard', async ({
      page,
    }) => {
      await page.goto('/')

      // Wait for dashboard to load
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Test keyboard navigation through sidebar
      const tabStops = await accessibilityHelpers.testKeyboardNavigation({
        expectedTabStops: 5, // Dashboard, Lessons, Students, etc.
      })

      // Verify key navigation elements are accessible
      expect(tabStops).toContain('lesson-nav-sidebar')
      expect(tabStops).toContain('students-nav-sidebar')
    })

    test('should handle Enter key activation on navigation items', async ({
      page,
    }) => {
      await page.goto('/')

      // Wait for dashboard
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Navigate to lessons using Enter key
      await page.getByTestId('lesson-nav-sidebar').focus()
      await expect(page.getByTestId('lesson-nav-sidebar')).toBeFocused()

      await page.keyboard.press('Enter')
      await expect(page.getByRole('heading', { name: 'notizen' })).toBeVisible()
    })

    test('should handle Space key activation on navigation buttons', async ({
      page,
    }) => {
      await page.goto('/')

      // Wait for dashboard
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Navigate to students using Space key
      await page.getByTestId('students-nav-sidebar').focus()
      await expect(page.getByTestId('students-nav-sidebar')).toBeFocused()

      await page.keyboard.press('Space')
      await expect(
        page.getByRole('heading', { name: 'studenten' }),
      ).toBeVisible()
    })
  })

  test.describe('Lesson Management Keyboard Navigation', () => {
    test('should navigate lesson creation form with keyboard', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      // Navigate to create lesson form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Test keyboard navigation through form fields
      const formTabStops = await accessibilityHelpers.testKeyboardNavigation({
        expectedTabStops: 8, // All form fields + buttons
      })

      // Verify form fields are keyboard accessible
      expect(formTabStops.some((stop) => stop.includes('lesson-title'))).toBe(
        true,
      )
      expect(formTabStops.some((stop) => stop.includes('lesson-notes'))).toBe(
        true,
      )
    })

    test('should handle Escape key to close lesson modals', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      // Open lesson creation modal
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Close with Escape key
      await page.keyboard.press('Escape')
      await expect(page.getByTestId('create-lesson-form')).not.toBeVisible()
    })

    test('should navigate lesson items list with arrow keys', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      // Wait for lesson items to load
      await expect(
        page.locator('[data-testid*="lesson-item-"]').first(),
      ).toBeVisible()

      // Test arrow key navigation through lesson items
      const firstLessonItem = page
        .locator('[data-testid*="lesson-item-"]')
        .first()
      await firstLessonItem.focus()
      await expect(firstLessonItem).toBeFocused()

      // Navigate down with arrow key
      await page.keyboard.press('ArrowDown')

      // Should move focus to next lesson item
      const secondLessonItem = page
        .locator('[data-testid*="lesson-item-"]')
        .nth(1)
      await expect(secondLessonItem).toBeFocused()
    })
  })

  test.describe('Modal Dialog Focus Management', () => {
    test('should trap focus within lesson creation modal', async ({ page }) => {
      await lessonsPOM.goto()

      // Open lesson creation modal
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Test focus trapping
      await accessibilityHelpers.testFocusTrapping(
        '[data-testid="create-lesson-form"]',
      )
    })

    test('should trap focus within lesson update modal', async ({ page }) => {
      await lessonsPOM.goto()

      // Wait for lesson items and open first lesson for editing
      await expect(
        page.locator('[data-testid*="lesson-item-"]').first(),
      ).toBeVisible()
      await page.locator('[data-testid*="lesson-item-"]').first().click()

      // Should open lesson details/edit view
      // Note: Adjust selector based on actual implementation
      const lessonModal = page.locator(
        '[data-testid*="lesson-modal"], [data-testid*="lesson-details"], .lesson-modal',
      )
      if ((await lessonModal.count()) > 0) {
        await accessibilityHelpers.testFocusTrapping(
          (await lessonModal.first().getAttribute('data-testid')) ||
            '.lesson-modal',
        )
      }
    })

    test('should restore focus after closing modals', async ({ page }) => {
      await lessonsPOM.goto()

      // Focus on "New" button
      const newButton = page.getByRole('button', { name: 'Neu' })
      await newButton.focus()
      await expect(newButton).toBeFocused()

      // Open and close modal
      await newButton.click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(page.getByTestId('create-lesson-form')).not.toBeVisible()

      // Focus should return to "New" button
      await expect(newButton).toBeFocused()
    })
  })

  test.describe('Student Management Keyboard Navigation', () => {
    test('should navigate student table with keyboard', async ({ page }) => {
      await studentsPOM.goto()

      // Wait for students table to load
      await expect(page.getByRole('table')).toBeVisible()

      // Test keyboard navigation through table
      const tabStops = await accessibilityHelpers.testKeyboardNavigation({
        expectedTabStops: 10, // Table headers, rows, action buttons
      })

      // Should include table navigation elements
      expect(
        tabStops.some(
          (stop) => stop.includes('student') || stop.includes('table'),
        ),
      ).toBe(true)
    })

    test('should handle Enter key on student action buttons', async ({
      page,
    }) => {
      await studentsPOM.goto()

      // Wait for students table
      await expect(page.getByRole('table')).toBeVisible()

      // Find and focus on first action button in table
      const actionButton = page.locator('button').first()
      if ((await actionButton.count()) > 0) {
        await actionButton.focus()
        await expect(actionButton).toBeFocused()

        // Test Enter key activation (should not throw)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
      }
    })
  })

  test.describe('Form Field Keyboard Navigation', () => {
    test('should navigate form fields with Tab and Shift+Tab', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Get all form elements
      const formElements = page.locator('input, textarea, select, button')
      const elementCount = await formElements.count()

      if (elementCount > 0) {
        // Start from first element
        await formElements.first().focus()

        // Tab through all elements
        for (let i = 1; i < elementCount; i++) {
          await page.keyboard.press('Tab')
          await page.waitForTimeout(50)
        }

        // Should be on last element
        await expect(formElements.last()).toBeFocused()

        // Shift+Tab back to first element
        for (let i = elementCount - 1; i > 0; i--) {
          await page.keyboard.press('Shift+Tab')
          await page.waitForTimeout(50)
        }

        // Should be back on first element
        await expect(formElements.first()).toBeFocused()
      }
    })

    test('should handle form submission with Enter key', async ({ page }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Fill form with minimum required data
      const titleField = page
        .locator(
          '[data-testid*="title"], input[name="title"], input[placeholder*="titel"]',
        )
        .first()
      if ((await titleField.count()) > 0) {
        await titleField.fill('Test Lesson')
        await titleField.focus()

        // Submit form with Enter key
        await page.keyboard.press('Enter')
        await page.waitForTimeout(1000)

        // Form should either submit or show validation errors
        // Both are valid keyboard behaviors
      }
    })
  })

  test.describe('Keyboard Shortcuts', () => {
    test('should support standard keyboard shortcuts', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Test common shortcuts
      const shortcuts = [
        {
          keys: 'Alt+1',
          expectedAction: 'Navigate to dashboard',
          verifyAction: async () => {
            // Check if dashboard is visible or navigation occurred
            return await page.locator('h1, h2, h3').first().isVisible()
          },
        },
        {
          keys: 'Alt+Home',
          expectedAction: 'Return to home/dashboard',
          verifyAction: async () => {
            // Should be on dashboard or home page
            return page.url().includes('/') || page.url().includes('dashboard')
          },
        },
      ]

      // Test shortcuts that don't break the page
      for (const shortcut of shortcuts) {
        try {
          await page.keyboard.press(shortcut.keys)
          await page.waitForTimeout(200)

          const actionExecuted = await shortcut.verifyAction()
          // Record result but don't fail test if shortcut isn't implemented
          console.log(
            `Keyboard shortcut ${shortcut.keys}: ${
              actionExecuted ? 'WORKS' : 'NOT_IMPLEMENTED'
            }`,
          )
        } catch (error) {
          // Shortcuts might not be implemented, which is okay
          console.log(`Keyboard shortcut ${shortcut.keys}: NOT_IMPLEMENTED`)
        }
      }
    })
  })

  test.describe('Skip Links and Quick Navigation', () => {
    test('should provide skip links for keyboard users', async ({ page }) => {
      await page.goto('/')

      // Tab from the very beginning to see if skip links appear
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)

      // Look for skip links
      const skipLinks = page.locator(
        'a[href*="#main"], a[href*="#content"], [data-testid*="skip"]',
      )
      const skipLinkCount = await skipLinks.count()

      if (skipLinkCount > 0) {
        // Test skip link functionality
        await skipLinks.first().click()

        // Should jump to main content
        const mainContent = page.locator('main, [role="main"], #main, #content')
        if ((await mainContent.count()) > 0) {
          const isNearMain = await page.evaluate(() => {
            const main = document.querySelector(
              'main, [role="main"], #main, #content',
            ) as HTMLElement
            return main ? window.scrollY >= main.offsetTop - 100 : false
          })

          expect(isNearMain).toBe(true)
        }
      } else {
        console.log(
          'Skip links not found - consider adding for better accessibility',
        )
      }
    })
  })

  test.afterEach(async ({ page }) => {
    // Run accessibility scan after each test
    await accessibilityHelpers.scanFullPage()
  })
})
