/**
 * E2E Test Template for Lesson Planning Features
 * 
 * This template provides a standardized structure for end-to-end testing
 * of lesson planning workflows using Playwright.
 */

import { test, expect, type Page } from '@playwright/test'
import { EnhancedLessonsPOM } from '../pom/lessons/LessonsPOM.enhanced'
import { TestUser } from '../utils/TestUser'

/**
 * Template for E2E testing of lesson planning workflows
 * 
 * Replace 'FeatureName' and 'workflow description' with actual values
 * Uncomment and modify sections as needed
 */
test.describe('FeatureName E2E Tests', () => {
  let lessonsPOM: EnhancedLessonsPOM
  let testUser: TestUser

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    // Initialize Page Object Model
    lessonsPOM = new EnhancedLessonsPOM(page)
    
    // Setup test user with proper subscription state
    testUser = new TestUser({
      userflow: 'monthly-active', // or appropriate flow
      project: 'lessons-testing',
    })
    await testUser.init()

    // Login and navigate to lessons page
    await lessonsPOM.login(testUser.email, testUser.password)
    await lessonsPOM.navigateToLessons()
  })

  // Cleanup after each test
  test.afterEach(async () => {
    // Cleanup test data if needed
    await testUser.cleanup?.()
  })

  test.describe('Happy Path Workflows', () => {
    test('complete workflow - create, update, delete lesson', async ({ page }) => {
      // Test data for the workflow
      const lessonData = {
        studentName: 'Test Student',
        date: '2025-08-09',
        content: 'Test lesson content for E2E testing',
        homework: 'Practice scales for 15 minutes daily',
      }

      // Step 1: Create lesson
      await test.step('Create new lesson', async () => {
        await lessonsPOM.createLesson(lessonData)
        
        // Verify lesson was created
        await expect(page.getByTestId('lesson-item')).toContainText(lessonData.content)
        
        // Take screenshot for visual verification
        await page.screenshot({ 
          path: 'test-results/lesson-created.png',
          fullPage: true 
        })
      })

      // Step 2: Update lesson
      await test.step('Update lesson content', async () => {
        const updatedContent = 'Updated lesson content after E2E test'
        
        await lessonsPOM.updateLesson(lessonData.studentName, {
          content: updatedContent
        })
        
        // Verify update
        await expect(page.getByTestId('lesson-item')).toContainText(updatedContent)
      })

      // Step 3: Share homework
      await test.step('Share homework via WhatsApp', async () => {
        await lessonsPOM.shareHomework(lessonData.studentName, 'whatsapp')
        
        // Verify homework sharing interface
        await expect(page.getByTestId('homework-share-success')).toBeVisible()
      })

      // Step 4: Delete lesson
      await test.step('Delete lesson', async () => {
        await lessonsPOM.deleteLesson(lessonData.studentName)
        
        // Verify deletion
        await expect(page.getByTestId('lesson-item')).not.toBeVisible()
      })
    })

    test('lesson planning workflow - plan and execute', async ({ page }) => {
      const plannedLessonData = {
        studentName: 'Test Student',
        content: 'Planned lesson content for future execution',
        homework: 'Review theory materials',
        planDate: '2025-08-15',
      }

      // Step 1: Create planned lesson
      await test.step('Create planned lesson', async () => {
        await lessonsPOM.createPlannedLesson(plannedLessonData)
        
        // Verify planned lesson appears in planning view
        await expect(page.getByTestId('planned-lesson-item')).toContainText(plannedLessonData.content)
      })

      // Step 2: Convert to documented lesson
      await test.step('Convert planned lesson to documented', async () => {
        await lessonsPOM.convertPlannedToDocumented(plannedLessonData.studentName)
        
        // Verify status change
        await expect(page.getByTestId('lesson-status')).toContainText('documented')
      })

      // Step 3: Complete lesson documentation
      await test.step('Complete lesson documentation', async () => {
        const completedContent = 'Completed lesson with additional notes'
        
        await lessonsPOM.updateLesson(plannedLessonData.studentName, {
          content: completedContent,
          actualDate: '2025-08-09'
        })
        
        // Verify completion
        await expect(page.getByTestId('lesson-item')).toContainText(completedContent)
      })
    })
  })

  test.describe('Error Handling and Edge Cases', () => {
    test('handles validation errors gracefully', async ({ page }) => {
      // Test empty form submission
      await test.step('Submit empty lesson form', async () => {
        await lessonsPOM.navigateToCreateLesson()
        await page.getByRole('button', { name: 'Save Lesson' }).click()
        
        // Verify validation errors are displayed
        await expect(page.getByTestId('validation-error')).toBeVisible()
        await expect(page.getByText('Lesson content or homework is required')).toBeVisible()
      })

      // Test invalid date handling
      await test.step('Handle invalid date input', async () => {
        await lessonsPOM.fillLessonForm({
          studentName: 'Test Student',
          date: 'invalid-date',
          content: 'Test content'
        })
        
        // Verify date validation
        await expect(page.getByTestId('date-error')).toBeVisible()
      })
    })

    test('handles network errors and retries', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/lessons', route => route.abort())
      
      await test.step('Handle lesson creation failure', async () => {
        const lessonData = {
          studentName: 'Test Student',
          content: 'Test content',
          homework: 'Test homework'
        }
        
        await lessonsPOM.createLesson(lessonData)
        
        // Verify error handling
        await expect(page.getByTestId('error-message')).toContainText('Failed to save lesson')
      })

      // Restore network and retry
      await page.unroute('**/api/lessons')
      
      await test.step('Retry after network restoration', async () => {
        await page.getByRole('button', { name: 'Retry' }).click()
        
        // Verify successful retry
        await expect(page.getByTestId('success-message')).toBeVisible()
      })
    })

    test('handles session expiration', async ({ page }) => {
      // Simulate session expiration
      await page.evaluate(() => {
        localStorage.removeItem('supabase.auth.token')
      })

      await test.step('Handle expired session during lesson creation', async () => {
        const lessonData = {
          studentName: 'Test Student',
          content: 'Test content after session expiry'
        }
        
        await lessonsPOM.createLesson(lessonData)
        
        // Verify redirect to login
        await expect(page).toHaveURL(/.*\/login/)
        await expect(page.getByText('Session expired')).toBeVisible()
      })
    })
  })

  test.describe('Performance and Load Testing', () => {
    test('handles large lesson datasets efficiently', async ({ page }) => {
      // Create multiple lessons for performance testing
      const lessonCount = 50
      
      await test.step('Create multiple lessons', async () => {
        for (let i = 0; i < lessonCount; i++) {
          await lessonsPOM.createLesson({
            studentName: 'Test Student',
            content: `Performance test lesson ${i + 1}`,
            date: `2025-08-${(i % 28) + 1}`
          })
        }
      })

      await test.step('Test navigation performance', async () => {
        const startTime = Date.now()
        
        await lessonsPOM.navigateToAllLessons()
        await expect(page.getByTestId('lessons-table')).toBeVisible()
        
        const loadTime = Date.now() - startTime
        expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
      })

      await test.step('Test filtering performance', async () => {
        const startTime = Date.now()
        
        await lessonsPOM.filterLessonsByYear(2025)
        await expect(page.getByTestId('filtered-results')).toBeVisible()
        
        const filterTime = Date.now() - startTime
        expect(filterTime).toBeLessThan(1000) // Should filter within 1 second
      })
    })

    test('measures page load performance', async ({ page }) => {
      // Start performance monitoring
      const startTime = Date.now()
      
      await test.step('Measure initial page load', async () => {
        await lessonsPOM.navigateToLessons()
        await expect(page.getByTestId('lessons-page')).toBeVisible()
        
        const loadTime = Date.now() - startTime
        
        // Log performance metrics
        console.log(`Lessons page load time: ${loadTime}ms`)
        expect(loadTime).toBeLessThan(2000) // Should load within 2 seconds
      })

      await test.step('Measure Time to Interactive', async () => {
        // Wait for all interactive elements to be ready
        await expect(page.getByRole('button', { name: 'Create Lesson' })).toBeEnabled()
        
        const ttiTime = Date.now() - startTime
        
        console.log(`Time to Interactive: ${ttiTime}ms`)
        expect(ttiTime).toBeLessThan(3000) // Should be interactive within 3 seconds
      })
    })
  })

  test.describe('Mobile and Responsive Behavior', () => {
    test('mobile lesson creation workflow', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      const lessonData = {
        studentName: 'Test Student Mobile',
        content: 'Mobile lesson content',
        homework: 'Mobile homework assignment'
      }

      await test.step('Create lesson on mobile', async () => {
        await lessonsPOM.createLesson(lessonData)
        
        // Verify mobile-specific UI elements
        await expect(page.getByTestId('mobile-lesson-item')).toBeVisible()
        
        // Take mobile screenshot
        await page.screenshot({ 
          path: 'test-results/mobile-lesson-created.png'
        })
      })

      await test.step('Test mobile navigation', async () => {
        // Test mobile-specific navigation patterns
        await page.getByTestId('mobile-menu-button').click()
        await expect(page.getByTestId('mobile-navigation')).toBeVisible()
        
        // Navigate to different sections
        await page.getByRole('link', { name: 'All Lessons' }).click()
        await expect(page.getByTestId('mobile-lessons-table')).toBeVisible()
      })
    })

    test('tablet responsive behavior', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })

      await test.step('Verify tablet layout', async () => {
        await lessonsPOM.navigateToLessons()
        
        // Verify tablet-specific layout elements
        await expect(page.getByTestId('tablet-lesson-grid')).toBeVisible()
        
        // Take tablet screenshot
        await page.screenshot({ 
          path: 'test-results/tablet-layout.png',
          fullPage: true
        })
      })
    })
  })

  test.describe('Accessibility Testing', () => {
    test('keyboard navigation works correctly', async ({ page }) => {
      await test.step('Navigate using keyboard only', async () => {
        // Start from first focusable element
        await page.keyboard.press('Tab')
        
        // Navigate through lesson creation form
        await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'student-select')
        
        await page.keyboard.press('Tab')
        await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'lesson-content-input')
        
        // Test form submission via keyboard
        await page.keyboard.press('Tab')
        await page.keyboard.press('Enter')
      })

      await test.step('Test modal keyboard trapping', async () => {
        // Open modal
        await page.getByRole('button', { name: 'Create Lesson' }).click()
        
        // Verify focus is trapped within modal
        const modal = page.getByRole('dialog')
        await expect(modal).toBeVisible()
        
        // Tab through modal elements
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        
        // Focus should stay within modal
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toBeVisible()
        
        // Close modal with Escape
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      })
    })

    test('screen reader compatibility', async ({ page }) => {
      await test.step('Verify ARIA labels and descriptions', async () => {
        await lessonsPOM.navigateToCreateLesson()
        
        // Check form labels
        const contentInput = page.getByLabelText('Lesson Content')
        await expect(contentInput).toHaveAttribute('aria-describedby')
        
        const homeworkInput = page.getByLabelText('Homework Assignment')
        await expect(homeworkInput).toHaveAttribute('aria-describedby')
        
        // Check button accessibility
        const submitButton = page.getByRole('button', { name: 'Save Lesson' })
        await expect(submitButton).toHaveAccessibleName('Save Lesson')
      })

      await test.step('Verify error announcements', async () => {
        // Trigger validation error
        await page.getByRole('button', { name: 'Save Lesson' }).click()
        
        // Verify error is announced to screen readers
        const errorRegion = page.getByRole('alert')
        await expect(errorRegion).toBeVisible()
        await expect(errorRegion).toContainText('Lesson content or homework is required')
      })
    })
  })

  test.describe('Visual Regression Testing', () => {
    test('lesson components visual consistency', async ({ page }) => {
      await test.step('Compare lesson creation form', async () => {
        await lessonsPOM.navigateToCreateLesson()
        
        // Wait for form to be fully loaded
        await expect(page.getByTestId('lesson-form')).toBeVisible()
        
        // Take screenshot and compare with baseline
        await expect(page.getByTestId('lesson-form')).toHaveScreenshot('lesson-form.png')
      })

      await test.step('Compare lesson list view', async () => {
        // Create sample data for consistent visual testing
        await lessonsPOM.createLesson({
          studentName: 'Visual Test Student',
          content: 'Sample lesson content for visual testing',
          date: '2025-08-09'
        })
        
        await lessonsPOM.navigateToLessons()
        await expect(page.getByTestId('lessons-list')).toBeVisible()
        
        // Compare with visual baseline
        await expect(page.getByTestId('lessons-list')).toHaveScreenshot('lessons-list.png')
      })
    })

    test('theme variations visual testing', async ({ page }) => {
      const testData = {
        studentName: 'Theme Test Student',
        content: 'Content for theme testing',
        homework: 'Homework for theme testing'
      }

      await test.step('Light theme screenshots', async () => {
        // Ensure light theme is active
        await page.emulateMedia({ colorScheme: 'light' })
        
        await lessonsPOM.createLesson(testData)
        await expect(page.getByTestId('lesson-item')).toHaveScreenshot('lesson-light-theme.png')
      })

      await test.step('Dark theme screenshots', async () => {
        // Switch to dark theme
        await page.emulateMedia({ colorScheme: 'dark' })
        
        await lessonsPOM.navigateToLessons()
        await expect(page.getByTestId('lesson-item')).toHaveScreenshot('lesson-dark-theme.png')
      })
    })
  })
})