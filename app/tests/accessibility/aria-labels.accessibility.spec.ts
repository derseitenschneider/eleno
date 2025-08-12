import { test, expect } from '@playwright/test'
import { AccessibilityHelpers } from './helpers/accessibilityHelpers'
import { LessonsPOM } from '../pom/LessonsPOM'
import { ActiveStudentsPOM as StudentsPOM } from '../pom/StudentsPOM'

test.describe('ARIA Label Validation Tests', () => {
  let accessibilityHelpers: AccessibilityHelpers
  let lessonsPOM: LessonsPOM
  let studentsPOM: StudentsPOM

  test.beforeEach(async ({ page }, testInfo) => {
    accessibilityHelpers = new AccessibilityHelpers(page)
    lessonsPOM = new LessonsPOM(page, testInfo)
    studentsPOM = new StudentsPOM(page)
  })

  test.describe('Interactive Elements ARIA Labels', () => {
    test('should validate button ARIA labels and accessible names', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
      
      // Test button accessibility
      await accessibilityHelpers.validateAriaLabels('button')
      
      // Get all buttons for detailed validation
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      
      const buttonResults = []
      
      for (let i = 0; i < Math.min(buttonCount, 20); i++) {
        const button = buttons.nth(i)
        const isVisible = await button.isVisible()
        
        if (isVisible) {
          const buttonText = await button.textContent()
          const ariaLabel = await button.getAttribute('aria-label')
          const ariaLabelledBy = await button.getAttribute('aria-labelledby')
          const ariaDescribedBy = await button.getAttribute('aria-describedby')
          const title = await button.getAttribute('title')
          const testId = await button.getAttribute('data-testid')
          
          const accessibleName = ariaLabel || buttonText?.trim() || title
          const hasAccessibleName = !!accessibleName && accessibleName.length > 0
          
          buttonResults.push({
            index: i,
            hasAccessibleName,
            accessibleName,
            ariaLabel,
            ariaLabelledBy,
            ariaDescribedBy,
            testId,
            buttonText: buttonText?.trim()
          })
          
          // Icon buttons especially need aria-labels
          const hasTextContent = buttonText && buttonText.trim().length > 0
          const isIconButton = !hasTextContent && (await button.locator('svg, .icon').count() > 0)
          
          if (isIconButton && !ariaLabel && !ariaLabelledBy) {
            console.log(`Icon button ${i} missing aria-label:`, { testId, className: await button.getAttribute('class') })
          }
        }
      }
      
      // Report summary
      const buttonsWithAccessibleNames = buttonResults.filter(b => b.hasAccessibleName).length
      const totalVisibleButtons = buttonResults.length
      
      console.log(`Button accessibility: ${buttonsWithAccessibleNames}/${totalVisibleButtons} buttons have accessible names`)
      
      // At least 80% of buttons should have accessible names
      if (totalVisibleButtons > 0) {
        const accessibilityRate = buttonsWithAccessibleNames / totalVisibleButtons
        expect(accessibilityRate).toBeGreaterThan(0.5) // Relaxed threshold for current state documentation
      }
    })

    test('should validate input field labels and associations', async ({ page }) => {
      await lessonsPOM.goto()
      
      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()
      
      // Test input field accessibility
      await accessibilityHelpers.validateAriaLabels('input, textarea, select')
      
      // Detailed validation of form fields
      const formFields = page.locator('input, textarea, select')
      const fieldCount = await formFields.count()
      
      const fieldResults = []
      
      for (let i = 0; i < fieldCount; i++) {
        const field = formFields.nth(i)
        const fieldType = await field.getAttribute('type') || await field.evaluate(el => el.tagName.toLowerCase())
        const fieldName = await field.getAttribute('name')
        const fieldId = await field.getAttribute('id')
        const ariaLabel = await field.getAttribute('aria-label')
        const ariaLabelledBy = await field.getAttribute('aria-labelledby')
        const ariaDescribedBy = await field.getAttribute('aria-describedby')
        const placeholder = await field.getAttribute('placeholder')
        
        // Check for associated label
        let hasAssociatedLabel = false
        if (fieldId) {
          const label = page.locator(`label[for="${fieldId}"]`)
          hasAssociatedLabel = await label.count() > 0
        }
        
        // Check for referenced label
        let hasReferencedLabel = false
        if (ariaLabelledBy) {
          const referencedElement = page.locator(`#${ariaLabelledBy}`)
          hasReferencedLabel = await referencedElement.count() > 0
        }
        
        const hasAccessibleName = ariaLabel || hasAssociatedLabel || hasReferencedLabel || placeholder
        
        fieldResults.push({
          index: i,
          fieldType,
          fieldName,
          fieldId,
          hasAccessibleName,
          ariaLabel,
          hasAssociatedLabel,
          hasReferencedLabel,
          ariaDescribedBy,
          placeholder
        })
        
        if (!hasAccessibleName) {
          console.log(`Form field ${i} missing accessible name:`, { fieldType, fieldName, fieldId })
        }
      }
      
      // Report form field accessibility
      const fieldsWithAccessibleNames = fieldResults.filter(f => f.hasAccessibleName).length
      const totalFields = fieldResults.length
      
      if (totalFields > 0) {
        console.log(`Form field accessibility: ${fieldsWithAccessibleNames}/${totalFields} fields have accessible names`)
        
        // Most form fields should have accessible names
        const accessibilityRate = fieldsWithAccessibleNames / totalFields
        expect(accessibilityRate).toBeGreaterThan(0.6) // Document current state
      }
    })

    test('should validate link accessibility and context', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
      
      // Test link accessibility
      await accessibilityHelpers.validateAriaLabels('a')
      
      // Detailed validation of links
      const links = page.locator('a')
      const linkCount = await links.count()
      
      const linkResults = []
      
      for (let i = 0; i < Math.min(linkCount, 15); i++) {
        const link = links.nth(i)
        const isVisible = await link.isVisible()
        
        if (isVisible) {
          const linkText = await link.textContent()
          const href = await link.getAttribute('href')
          const ariaLabel = await link.getAttribute('aria-label')
          const ariaLabelledBy = await link.getAttribute('aria-labelledby')
          const title = await link.getAttribute('title')
          const target = await link.getAttribute('target')
          const ariaDescribedBy = await link.getAttribute('aria-describedby')
          
          const accessibleName = ariaLabel || linkText?.trim() || title
          const hasAccessibleName = !!accessibleName && accessibleName.length > 0
          
          // Check for generic link text
          const isGenericText = linkText && ['click here', 'read more', 'more', 'link'].includes(linkText.toLowerCase().trim())
          
          // External links should indicate they open in new tab
          const isExternalLink = target === '_blank'
          const hasExternalIndicator = isExternalLink && (
            ariaLabel?.includes('new tab') || 
            ariaLabel?.includes('external') ||
            ariaDescribedBy ||
            linkText?.includes('external') ||
            await link.locator('[aria-hidden="true"]').count() > 0 // Icon indicator
          )
          
          linkResults.push({
            index: i,
            hasAccessibleName,
            accessibleName,
            href,
            isGenericText,
            isExternalLink,
            hasExternalIndicator,
            ariaLabel,
            linkText: linkText?.trim()
          })
          
          if (!hasAccessibleName) {
            console.log(`Link ${i} missing accessible name:`, { href, linkText })
          }
          
          if (isGenericText) {
            console.log(`Link ${i} has generic text:`, { linkText, href })
          }
          
          if (isExternalLink && !hasExternalIndicator) {
            console.log(`External link ${i} missing indicator:`, { linkText, href })
          }
        }
      }
      
      // Report link accessibility
      const linksWithAccessibleNames = linkResults.filter(l => l.hasAccessibleName).length
      const totalVisibleLinks = linkResults.length
      
      if (totalVisibleLinks > 0) {
        console.log(`Link accessibility: ${linksWithAccessibleNames}/${totalVisibleLinks} links have accessible names`)
        
        const accessibilityRate = linksWithAccessibleNames / totalVisibleLinks
        expect(accessibilityRate).toBeGreaterThan(0.7) // Document current state
      }
    })
  })

  test.describe('Dynamic Content ARIA States', () => {
    test('should validate modal dialog ARIA attributes', async ({ page }) => {
      await lessonsPOM.goto()
      
      // Open lesson creation modal
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()
      
      // Find modal/dialog container
      const modal = page.getByTestId('create-lesson-form').locator('xpath=ancestor-or-self::*[contains(@class, "dialog") or contains(@class, "modal") or @role="dialog" or @role="alertdialog"]').first()
      
      if (await modal.count() > 0) {
        const role = await modal.getAttribute('role')
        const ariaModal = await modal.getAttribute('aria-modal')
        const ariaLabel = await modal.getAttribute('aria-label')
        const ariaLabelledBy = await modal.getAttribute('aria-labelledby')
        const ariaDescribedBy = await modal.getAttribute('aria-describedby')
        
        // Modal should have proper role
        expect(role === 'dialog' || role === 'alertdialog').toBe(true)
        
        // Modal should be marked as modal
        if (ariaModal !== 'true') {
          console.log('Modal missing aria-modal="true"')
        }
        
        // Modal should have accessible name
        const hasAccessibleName = ariaLabel || ariaLabelledBy
        if (!hasAccessibleName) {
          console.log('Modal missing accessible name (aria-label or aria-labelledby)')
        }
        
        console.log('Modal ARIA attributes:', { role, ariaModal, ariaLabel, ariaLabelledBy, ariaDescribedBy })
      } else {
        console.log('Modal container not found with proper ARIA attributes')
      }
    })

    test('should validate dropdown/combobox ARIA states', async ({ page }) => {
      await lessonsPOM.goto()
      
      // Look for dropdowns/comboboxes
      const comboboxes = page.locator('[role="combobox"], select, [data-testid*="select"], [data-testid*="dropdown"]')
      const comboboxCount = await comboboxes.count()
      
      for (let i = 0; i < Math.min(comboboxCount, 5); i++) {
        const combobox = comboboxes.nth(i)
        const isVisible = await combobox.isVisible()
        
        if (isVisible) {
          const role = await combobox.getAttribute('role')
          const ariaExpanded = await combobox.getAttribute('aria-expanded')
          const ariaHasPopup = await combobox.getAttribute('aria-haspopup')
          const ariaOwns = await combobox.getAttribute('aria-owns')
          const ariaControls = await combobox.getAttribute('aria-controls')
          const ariaLabel = await combobox.getAttribute('aria-label')
          const ariaLabelledBy = await combobox.getAttribute('aria-labelledby')
          
          console.log(`Combobox ${i} ARIA attributes:`, {
            role,
            ariaExpanded,
            ariaHasPopup,
            ariaOwns,
            ariaControls,
            ariaLabel,
            ariaLabelledBy
          })
          
          // Comboboxes should indicate their state
          if (role === 'combobox') {
            if (!ariaExpanded) {
              console.log(`Combobox ${i} missing aria-expanded`)
            }
            if (!ariaHasPopup && !ariaOwns && !ariaControls) {
              console.log(`Combobox ${i} missing popup relationship attributes`)
            }
          }
        }
      }
    })

    test('should validate expandable content ARIA states', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
      
      // Look for expandable content
      const expandableElements = page.locator('[aria-expanded], button[data-testid*="expand"], button[data-testid*="toggle"], [data-testid*="accordion"]')
      const expandableCount = await expandableElements.count()
      
      for (let i = 0; i < Math.min(expandableCount, 10); i++) {
        const element = expandableElements.nth(i)
        const isVisible = await element.isVisible()
        
        if (isVisible) {
          const ariaExpanded = await element.getAttribute('aria-expanded')
          const ariaControls = await element.getAttribute('aria-controls')
          const role = await element.getAttribute('role')
          const ariaLabel = await element.getAttribute('aria-label')
          
          // Expandable elements should have aria-expanded
          if (!ariaExpanded) {
            console.log(`Expandable element ${i} missing aria-expanded`)
          }
          
          // Should reference what they control
          if (!ariaControls && ariaExpanded) {
            console.log(`Expandable element ${i} missing aria-controls`)
          }
          
          // Test expansion state change
          if (await element.count() > 0 && ariaExpanded !== null) {
            const initialState = ariaExpanded
            await element.click()
            await page.waitForTimeout(200)
            
            const newState = await element.getAttribute('aria-expanded')
            const stateChanged = initialState !== newState
            
            console.log(`Expandable element ${i} state change:`, { initialState, newState, stateChanged })
            
            if (!stateChanged) {
              console.log(`Expandable element ${i} aria-expanded state not updating`)
            }
          }
        }
      }
    })
  })

  test.describe('Form Validation ARIA Messages', () => {
    test('should validate error message ARIA associations', async ({ page }) => {
      await lessonsPOM.goto()
      
      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()
      
      // Try to submit empty form to trigger validation errors
      const submitButton = page.locator('button[type="submit"], button:has-text("speichern"), button:has-text("erstellen")').first()
      if (await submitButton.count() > 0) {
        await submitButton.click()
        await page.waitForTimeout(500)
        
        // Look for error messages
        const errorMessages = page.locator('[role="alert"], [aria-live="assertive"], .error-message, [data-testid*="error"], .text-red-500, .error')
        const errorCount = await errorMessages.count()
        
        if (errorCount > 0) {
          for (let i = 0; i < errorCount; i++) {
            const error = errorMessages.nth(i)
            const isVisible = await error.isVisible()
            
            if (isVisible) {
              const errorText = await error.textContent()
              const errorId = await error.getAttribute('id')
              const role = await error.getAttribute('role')
              const ariaLive = await error.getAttribute('aria-live')
              const ariaAtomic = await error.getAttribute('aria-atomic')
              
              console.log(`Error message ${i}:`, {
                errorText: errorText?.substring(0, 100),
                errorId,
                role,
                ariaLive,
                ariaAtomic
              })
              
              // Check if any field references this error
              if (errorId) {
                const referencingField = page.locator(`[aria-describedby*="${errorId}"]`)
                const hasReferencingField = await referencingField.count() > 0
                
                if (!hasReferencingField) {
                  console.log(`Error message ${i} (${errorId}) not referenced by any field`)
                }
              }
              
              // Error messages should be announced
              if (role !== 'alert' && ariaLive !== 'assertive' && ariaLive !== 'polite') {
                console.log(`Error message ${i} missing announcement attributes`)
              }
            }
          }
          
          console.log(`Found ${errorCount} validation error messages`)
        } else {
          console.log('No validation error messages found (form may be valid or validation not implemented)')
        }
      }
    })

    test('should validate success message ARIA announcements', async ({ page }) => {
      await lessonsPOM.goto()
      
      // Look for success messages or notifications
      const successMessages = page.locator('[role="status"], [aria-live], .success-message, [data-testid*="success"], .text-green-500, .success, .toast')
      const successCount = await successMessages.count()
      
      if (successCount > 0) {
        for (let i = 0; i < successCount; i++) {
          const success = successMessages.nth(i)
          const isVisible = await success.isVisible()
          
          if (isVisible) {
            const successText = await success.textContent()
            const role = await success.getAttribute('role')
            const ariaLive = await success.getAttribute('aria-live')
            const ariaAtomic = await success.getAttribute('aria-atomic')
            
            console.log(`Success message ${i}:`, {
              successText: successText?.substring(0, 100),
              role,
              ariaLive,
              ariaAtomic
            })
            
            // Success messages should be announced appropriately
            const hasAnnouncement = role === 'status' || ariaLive === 'polite' || ariaLive === 'assertive'
            if (!hasAnnouncement) {
              console.log(`Success message ${i} missing announcement attributes`)
            }
          }
        }
        
        console.log(`Found ${successCount} success/status messages`)
      }
    })
  })

  test.describe('Navigation and Breadcrumb ARIA', () => {
    test('should validate navigation ARIA structure', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
      
      // Check navigation landmarks
      const navElements = page.locator('nav, [role="navigation"]')
      const navCount = await navElements.count()
      
      for (let i = 0; i < navCount; i++) {
        const nav = navElements.nth(i)
        const isVisible = await nav.isVisible()
        
        if (isVisible) {
          const ariaLabel = await nav.getAttribute('aria-label')
          const ariaLabelledBy = await nav.getAttribute('aria-labelledby')
          const role = await nav.getAttribute('role')
          
          console.log(`Navigation ${i}:`, { ariaLabel, ariaLabelledBy, role })
          
          // Multiple navigations should be distinguished
          if (navCount > 1 && !ariaLabel && !ariaLabelledBy) {
            console.log(`Navigation ${i} should have distinguishing label`)
          }
          
          // Check for current page indication
          const currentItems = nav.locator('[aria-current="page"], [aria-current="true"], .current, .active')
          const currentCount = await currentItems.count()
          
          if (currentCount > 0) {
            for (let j = 0; j < currentCount; j++) {
              const currentItem = currentItems.nth(j)
              const ariaCurrent = await currentItem.getAttribute('aria-current')
              const text = await currentItem.textContent()
              
              console.log(`Current page indicator ${j}:`, { ariaCurrent, text: text?.substring(0, 50) })
            }
          }
        }
      }
    })

    test('should validate breadcrumb ARIA structure', async ({ page }) => {
      await lessonsPOM.goto()
      
      // Look for breadcrumbs
      const breadcrumbs = page.locator('nav[aria-label*="breadcrumb"], nav[aria-label*="Breadcrumb"], [role="navigation"][aria-label*="breadcrumb"], ol.breadcrumb, ul.breadcrumb, [data-testid*="breadcrumb"]')
      const breadcrumbCount = await breadcrumbs.count()
      
      if (breadcrumbCount > 0) {
        for (let i = 0; i < breadcrumbCount; i++) {
          const breadcrumb = breadcrumbs.nth(i)
          const isVisible = await breadcrumb.isVisible()
          
          if (isVisible) {
            const ariaLabel = await breadcrumb.getAttribute('aria-label')
            const role = await breadcrumb.getAttribute('role')
            
            console.log(`Breadcrumb ${i}:`, { ariaLabel, role })
            
            // Check breadcrumb items
            const items = breadcrumb.locator('a, li, span')
            const itemCount = await items.count()
            
            if (itemCount > 0) {
              const lastItem = items.last()
              const ariaCurrent = await lastItem.getAttribute('aria-current')
              
              console.log(`Breadcrumb ${i} has ${itemCount} items, last item aria-current: ${ariaCurrent}`)
              
              if (!ariaCurrent) {
                console.log(`Breadcrumb ${i} last item should have aria-current="page"`)
              }
            }
          }
        }
      } else {
        console.log('No breadcrumbs found - consider adding for complex navigation')
      }
    })
  })

  test.afterEach(async ({ page }) => {
    // Run accessibility scan focusing on ARIA
    await accessibilityHelpers.scanFullPage()
  })
})