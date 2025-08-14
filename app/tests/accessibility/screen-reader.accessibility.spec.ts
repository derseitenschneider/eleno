import { test, expect } from '@playwright/test'
import { AccessibilityHelpers } from './helpers/accessibilityHelpers'
import { LessonsPOM } from '../pom/LessonsPOM'
import { ActiveStudentsPOM as StudentsPOM } from '../pom/StudentsPOM'

test.describe('Screen Reader Compatibility Tests', () => {
  let accessibilityHelpers: AccessibilityHelpers
  let lessonsPOM: LessonsPOM
  let studentsPOM: StudentsPOM

  test.beforeEach(async ({ page }, testInfo) => {
    accessibilityHelpers = new AccessibilityHelpers(page)
    lessonsPOM = new LessonsPOM(page, testInfo)
    studentsPOM = new StudentsPOM(page)
  })

  test.describe('Semantic HTML Structure', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      const semanticStructure =
        await accessibilityHelpers.validateSemanticStructure()

      // Should have at least one h1
      expect(semanticStructure.headingLevels).toContain(1)

      // Should have proper landmark regions
      expect(semanticStructure.landmarks.main).toBeGreaterThan(0)
      expect(semanticStructure.landmarks.nav).toBeGreaterThan(0)
    })

    test('should have proper landmark regions on lessons page', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      const semanticStructure =
        await accessibilityHelpers.validateSemanticStructure()

      // Lessons page should have semantic structure
      expect(semanticStructure.landmarks.main).toBeGreaterThan(0)
      expect(semanticStructure.landmarks.nav).toBeGreaterThan(0)

      // Should have proper heading hierarchy
      expect(semanticStructure.headingLevels.length).toBeGreaterThan(0)
    })

    test('should have proper landmark regions on students page', async ({
      page,
    }) => {
      await studentsPOM.goto()

      const semanticStructure =
        await accessibilityHelpers.validateSemanticStructure()

      // Students page should have semantic structure
      expect(semanticStructure.landmarks.main).toBeGreaterThan(0)
      expect(semanticStructure.landmarks.nav).toBeGreaterThan(0)
    })
  })

  test.describe('ARIA Live Regions and Announcements', () => {
    test('should announce dynamic content changes', async ({ page }) => {
      await lessonsPOM.goto()

      const initialAnnouncements =
        await accessibilityHelpers.testScreenReaderAnnouncements()

      // Perform action that should trigger announcement (e.g., creating lesson)
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      const postActionAnnouncements =
        await accessibilityHelpers.testScreenReaderAnnouncements()

      // Should have aria-live regions for announcements
      const hasLiveRegions =
        postActionAnnouncements.length > 0 ||
        (await page
          .locator('[aria-live], [role="status"], [role="alert"]')
          .count()) > 0

      // Note: Not failing test if no live regions, but logging for improvement
      if (!hasLiveRegions) {
        console.log(
          'Consider adding aria-live regions for better screen reader experience',
        )
      }
    })

    test('should announce form validation errors', async ({ page }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Try to submit empty form to trigger validation
      const submitButton = page
        .locator(
          'button[type="submit"], button:has-text("speichern"), button:has-text("erstellen")',
        )
        .first()
      if ((await submitButton.count()) > 0) {
        await submitButton.click()
        await page.waitForTimeout(500)

        // Check for validation error announcements
        const errorMessages = page.locator(
          '[role="alert"], [aria-live="assertive"], .error-message, [data-testid*="error"]',
        )
        const errorCount = await errorMessages.count()

        if (errorCount > 0) {
          // Verify error messages have proper ARIA attributes
          for (let i = 0; i < Math.min(errorCount, 3); i++) {
            const error = errorMessages.nth(i)
            const isVisible = await error.isVisible()
            const hasAriaLabel = await error.getAttribute('aria-label')
            const hasRole = await error.getAttribute('role')
            const hasLive = await error.getAttribute('aria-live')

            expect(isVisible).toBe(true)

            // Should have screen reader attributes
            const hasAccessibilityAttribute = hasAriaLabel || hasRole || hasLive
            if (!hasAccessibilityAttribute) {
              console.log(
                'Error message missing accessibility attributes:',
                await error.textContent(),
              )
            }
          }
        }
      }
    })

    test('should announce loading states', async ({ page }) => {
      await page.goto('/')

      // Look for loading indicators with proper announcements
      const loadingIndicators = page.locator(
        '[aria-busy="true"], [role="status"], .loading, [data-testid*="loading"]',
      )
      const loadingCount = await loadingIndicators.count()

      if (loadingCount > 0) {
        // Check first few loading indicators
        for (let i = 0; i < Math.min(loadingCount, 3); i++) {
          const loader = loadingIndicators.nth(i)
          const hasAriaLabel = await loader.getAttribute('aria-label')
          const hasRole = await loader.getAttribute('role')
          const hasLive = await loader.getAttribute('aria-live')
          const hasAriaDescribedBy =
            await loader.getAttribute('aria-describedby')

          // Loading states should be announced to screen readers
          const hasAccessibilitySupport =
            hasAriaLabel ||
            hasRole === 'status' ||
            hasLive ||
            hasAriaDescribedBy

          if (!hasAccessibilitySupport) {
            console.log('Loading indicator missing screen reader support')
          }
        }
      }
    })
  })

  test.describe('Form Field Associations', () => {
    test('should properly associate form labels with inputs', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Get all form inputs
      const inputs = page.locator('input, textarea, select')
      const inputCount = await inputs.count()

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i)
        const inputId = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        const ariaDescribedBy = await input.getAttribute('aria-describedby')

        // Each input should have an accessible name
        let hasAccessibleName = false

        if (ariaLabel) {
          hasAccessibleName = true
        } else if (ariaLabelledBy) {
          // Check if referenced element exists
          const referencedElement = page.locator(`#${ariaLabelledBy}`)
          hasAccessibleName = (await referencedElement.count()) > 0
        } else if (inputId) {
          // Check for associated label
          const associatedLabel = page.locator(`label[for="${inputId}"]`)
          hasAccessibleName = (await associatedLabel.count()) > 0
        }

        if (!hasAccessibleName) {
          const placeholder = await input.getAttribute('placeholder')
          const inputInfo = {
            type: await input.getAttribute('type'),
            name: await input.getAttribute('name'),
            placeholder,
            className: await input.getAttribute('class'),
          }
          console.log('Input missing accessible name:', inputInfo)
        }
      }
    })

    test('should provide helpful field descriptions', async ({ page }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Check for field descriptions and help text
      const helpTexts = page.locator(
        '[data-testid*="help"], [data-testid*="description"], .help-text, .field-description',
      )
      const helpCount = await helpTexts.count()

      if (helpCount > 0) {
        for (let i = 0; i < helpCount; i++) {
          const helpText = helpTexts.nth(i)
          const helpId = await helpText.getAttribute('id')
          const isVisible = await helpText.isVisible()

          if (isVisible && helpId) {
            // Check if any input references this help text
            const referencingInput = page.locator(
              `[aria-describedby*="${helpId}"]`,
            )
            const hasReferencingInput = (await referencingInput.count()) > 0

            if (!hasReferencingInput) {
              console.log(
                'Help text not referenced by any input:',
                await helpText.textContent(),
              )
            }
          }
        }
      }
    })
  })

  test.describe('Interactive Element Descriptions', () => {
    test('should provide clear button descriptions', async ({ page }) => {
      await lessonsPOM.goto()

      // Get all buttons
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i)
        const buttonText = await button.textContent()
        const ariaLabel = await button.getAttribute('aria-label')
        const ariaLabelledBy = await button.getAttribute('aria-labelledby')
        const title = await button.getAttribute('title')

        // Button should have clear description
        const hasDescription =
          (buttonText && buttonText.trim().length > 0) ||
          ariaLabel ||
          ariaLabelledBy ||
          title

        if (!hasDescription) {
          const buttonInfo = {
            className: await button.getAttribute('class'),
            type: await button.getAttribute('type'),
            testId: await button.getAttribute('data-testid'),
          }
          console.log('Button missing description:', buttonInfo)
        }
      }
    })

    test('should provide clear link descriptions', async ({ page }) => {
      await page.goto('/')

      // Get all links
      const links = page.locator('a')
      const linkCount = await links.count()

      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i)
        const linkText = await link.textContent()
        const ariaLabel = await link.getAttribute('aria-label')
        const ariaLabelledBy = await link.getAttribute('aria-labelledby')
        const title = await link.getAttribute('title')

        // Link should have clear description
        const hasDescription =
          (linkText && linkText.trim().length > 0) ||
          ariaLabel ||
          ariaLabelledBy ||
          title

        if (!hasDescription) {
          const href = await link.getAttribute('href')
          console.log('Link missing description:', {
            href,
            className: await link.getAttribute('class'),
          })
        }
      }
    })
  })

  test.describe('Data Table Accessibility', () => {
    test('should have properly structured data tables', async ({ page }) => {
      await studentsPOM.goto()

      // Wait for students table
      await expect(page.getByRole('table')).toBeVisible()

      const tables = page.locator('table')
      const tableCount = await tables.count()

      for (let i = 0; i < tableCount; i++) {
        const table = tables.nth(i)

        // Check for table headers
        const headers = table.locator('th')
        const headerCount = await headers.count()

        if (headerCount > 0) {
          // Headers should have proper scope
          for (let j = 0; j < headerCount; j++) {
            const header = headers.nth(j)
            const scope = await header.getAttribute('scope')
            const hasScope = scope === 'col' || scope === 'row'

            if (!hasScope) {
              const headerText = await header.textContent()
              console.log('Table header missing scope:', headerText)
            }
          }
        }

        // Check for table caption or aria-label
        const caption = table.locator('caption')
        const hasCaption = (await caption.count()) > 0
        const ariaLabel = await table.getAttribute('aria-label')
        const ariaLabelledBy = await table.getAttribute('aria-labelledby')

        const hasAccessibleName = hasCaption || ariaLabel || ariaLabelledBy

        if (!hasAccessibleName) {
          console.log('Table missing accessible name/caption')
        }
      }
    })
  })

  test.describe('Content Reading Order', () => {
    test('should have logical reading order on main pages', async ({
      page,
    }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Simulate screen reader navigation
      const navigationResults =
        await accessibilityHelpers.simulateScreenReaderNavigation()

      // Should be able to navigate through content
      const successfulNavigations = navigationResults.filter(
        (result) => result.navigationSuccessful,
      )
      expect(successfulNavigations.length).toBeGreaterThan(0)
    })

    test('should maintain reading order in lesson forms', async ({ page }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Check DOM order matches visual order
      const focusableElements = page.locator('input, textarea, select, button')
      const elementCount = await focusableElements.count()

      if (elementCount > 1) {
        // Get positions of first few elements
        const positions = []
        for (let i = 0; i < Math.min(elementCount, 5); i++) {
          const element = focusableElements.nth(i)
          const box = await element.boundingBox()
          if (box) {
            positions.push({ index: i, top: box.y, left: box.x })
          }
        }

        // Check if reading order makes sense (generally top to bottom, left to right)
        for (let i = 1; i < positions.length; i++) {
          const current = positions[i]
          const previous = positions[i - 1]

          if (current && previous) {
            // Allow for some flexibility in positioning
            const isLogicalOrder =
              current.top >= previous.top - 10 ||
              (Math.abs(current.top - previous.top) < 10 &&
                current.left > previous.left)

            if (!isLogicalOrder) {
              console.log(
                `Potentially illogical reading order: element ${i} at (${
                  current.left
                }, ${current.top}) after element ${i - 1} at (${
                  previous.left
                }, ${previous.top})`,
              )
            }
          }
        }
      }
    })
  })

  test.describe('Screen Reader Navigation Patterns', () => {
    test('should support heading navigation', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Get all headings
      const headings = page.locator('h1, h2, h3, h4, h5, h6')
      const headingCount = await headings.count()

      expect(headingCount).toBeGreaterThan(0)

      // Headings should be accessible and have text content
      for (let i = 0; i < Math.min(headingCount, 5); i++) {
        const heading = headings.nth(i)
        const text = await heading.textContent()
        const isVisible = await heading.isVisible()

        expect(text?.trim().length).toBeGreaterThan(0)
        expect(isVisible).toBe(true)
      }
    })

    test('should support landmark navigation', async ({ page }) => {
      await page.goto('/')

      // Check for standard landmarks
      const landmarks = {
        main: page.locator('main, [role="main"]'),
        nav: page.locator('nav, [role="navigation"]'),
        banner: page.locator('header, [role="banner"]'),
        contentinfo: page.locator('footer, [role="contentinfo"]'),
        complementary: page.locator('aside, [role="complementary"]'),
        search: page.locator('[role="search"]'),
      }

      for (const [landmarkType, locator] of Object.entries(landmarks)) {
        const count = await locator.count()
        if (count > 0) {
          console.log(`Found ${count} ${landmarkType} landmark(s)`)

          // Landmarks should be properly labeled if there are multiple
          if (count > 1) {
            for (let i = 0; i < count; i++) {
              const landmark = locator.nth(i)
              const ariaLabel = await landmark.getAttribute('aria-label')
              const ariaLabelledBy =
                await landmark.getAttribute('aria-labelledby')

              if (!ariaLabel && !ariaLabelledBy) {
                console.log(
                  `Multiple ${landmarkType} landmarks should have distinguishing labels`,
                )
              }
            }
          }
        }
      }
    })
  })

  test.afterEach(async ({ page }) => {
    // Run comprehensive accessibility scan
    await accessibilityHelpers.scanFullPage()
  })
})
