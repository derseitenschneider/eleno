import { test, expect } from '@playwright/test'
import { AccessibilityHelpers } from './helpers/accessibilityHelpers'
import { LessonsPOM } from '../pom/LessonsPOM'
import { ActiveStudentsPOM as StudentsPOM } from '../pom/StudentsPOM'

test.describe('Comprehensive Accessibility Tests', () => {
  let accessibilityHelpers: AccessibilityHelpers
  let lessonsPOM: LessonsPOM
  let studentsPOM: StudentsPOM

  test.beforeEach(async ({ page }, testInfo) => {
    accessibilityHelpers = new AccessibilityHelpers(page)
    lessonsPOM = new LessonsPOM(page, testInfo)
    studentsPOM = new StudentsPOM(page, testInfo)
    
    await accessibilityHelpers.setupAxe()
  })

  test.describe('Lesson Planning Workflow Accessibility', () => {
    test('should provide accessible lesson planning interface', async ({ page }) => {
      await lessonsPOM.goto()
      
      console.log('=== LESSON PLANNING ACCESSIBILITY AUDIT ===')
      
      // 1. Test main lesson page accessibility
      await accessibilityHelpers.scanFullPage()
      
      // 2. Test lesson creation form accessibility
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()
      
      // Test form accessibility
      await accessibilityHelpers.scanComponent('[data-testid="create-lesson-form"]')
      
      // 3. Test keyboard navigation through lesson form
      const formTabStops = await accessibilityHelpers.testKeyboardNavigation({
        expectedTabStops: 3,
      })
      console.log('Lesson form tab stops:', formTabStops)
      
      // 4. Test form field labels and associations
      await accessibilityHelpers.validateAriaLabels('input, textarea, select')
      
      // 5. Test modal focus trapping
      if (await page.getByTestId('create-lesson-form').count() > 0) {
        await accessibilityHelpers.testFocusTrapping('[data-testid="create-lesson-form"]')
      }
      
      // 6. Test semantic structure
      const structure = await accessibilityHelpers.validateSemanticStructure()
      console.log('Lesson planning semantic structure:', structure)
      
      console.log('=== LESSON PLANNING AUDIT COMPLETE ===')
    })

    test('should provide accessible lesson planning components', async ({ page }) => {
      await lessonsPOM.goto()
      
      console.log('=== LESSON PLANNING COMPONENTS AUDIT ===')
      
      // Wait for lesson items to load
      await page.waitForTimeout(2000)
      
      // Test lesson item accessibility
      const lessonItems = page.locator('[data-testid*="lesson-item"]')
      const itemCount = await lessonItems.count()
      
      if (itemCount > 0) {
        console.log(`Found ${itemCount} lesson items for accessibility testing`)
        
        // Test first few lesson items
        for (let i = 0; i < Math.min(itemCount, 3); i++) {
          const lessonItem = lessonItems.nth(i)
          
          if (await lessonItem.isVisible()) {
            // Test individual lesson item accessibility
            const testId = await lessonItem.getAttribute('data-testid')
            if (testId) {
              await accessibilityHelpers.scanComponent(`[data-testid="${testId}"]`)
            }
            
            // Test lesson item keyboard interaction
            await lessonItem.focus()
            await expect(lessonItem).toBeFocused()
            
            // Test lesson item ARIA attributes
            const hasAriaLabel = await lessonItem.getAttribute('aria-label')
            const hasRole = await lessonItem.getAttribute('role')
            const hasTabIndex = await lessonItem.getAttribute('tabindex')
            
            console.log(`Lesson item ${i}:`, { hasAriaLabel, hasRole, hasTabIndex, testId })
          }
        }
      } else {
        console.log('No lesson items found for accessibility testing')
      }
      
      console.log('=== LESSON PLANNING COMPONENTS AUDIT COMPLETE ===')
    })
  })

  test.describe('Homework Sharing Interface Accessibility', () => {
    test('should provide accessible homework sharing modals', async ({ page }) => {
      await lessonsPOM.goto()
      
      console.log('=== HOMEWORK SHARING ACCESSIBILITY AUDIT ===')
      
      // Wait for lesson content to load
      await page.waitForTimeout(2000)
      
      // Look for homework sharing buttons/features
      const homeworkButtons = page.locator('button:has-text("homework"), button[data-testid*="homework"], button:has-text("share"), [data-testid*="share"]')
      const homeworkButtonCount = await homeworkButtons.count()
      
      if (homeworkButtonCount > 0) {
        console.log(`Found ${homeworkButtonCount} homework-related buttons`)
        
        // Test first homework button
        const firstHomeworkButton = homeworkButtons.first()
        await firstHomeworkButton.click()
        await page.waitForTimeout(500)
        
        // Look for homework sharing modal/interface
        const homeworkModal = page.locator('[data-testid*="homework"], [data-testid*="share"], .homework-modal, .share-modal')
        
        if (await homeworkModal.count() > 0) {
          console.log('Homework sharing interface found')
          
          // Test homework modal accessibility
          await accessibilityHelpers.scanComponent(await homeworkModal.first().getAttribute('data-testid') || '.homework-modal')
          
          // Test modal focus management
          if (await homeworkModal.first().getAttribute('data-testid')) {
            await accessibilityHelpers.testFocusTrapping(`[data-testid="${await homeworkModal.first().getAttribute('data-testid')}"]`)
          }
          
          // Test homework sharing form fields if present
          const formFields = homeworkModal.locator('input, textarea, select, button')
          const fieldCount = await formFields.count()
          
          if (fieldCount > 0) {
            console.log(`Found ${fieldCount} form fields in homework interface`)
            await accessibilityHelpers.validateAriaLabels('input, textarea, select')
          }
        } else {
          console.log('Homework sharing interface not found after clicking button')
        }
      } else {
        console.log('No homework sharing buttons found - this may be expected based on current lesson state')
      }
      
      console.log('=== HOMEWORK SHARING AUDIT COMPLETE ===')
    })
  })

  test.describe('All Lessons Management Accessibility', () => {
    test('should provide accessible lessons management table', async ({ page }) => {
      // Navigate to all lessons view
      await page.goto('/lessons/all')
      
      console.log('=== ALL LESSONS MANAGEMENT ACCESSIBILITY AUDIT ===')
      
      // Wait for all lessons page to load
      await page.waitForTimeout(2000)
      
      // Test table accessibility
      const tables = page.locator('table, [role="table"]')
      const tableCount = await tables.count()
      
      if (tableCount > 0) {
        console.log(`Found ${tableCount} data tables`)
        
        for (let i = 0; i < tableCount; i++) {
          const table = tables.nth(i)
          
          // Test table structure
          const headers = table.locator('th')
          const headerCount = await headers.count()
          const rows = table.locator('tr')
          const rowCount = await rows.count()
          
          console.log(`Table ${i}: ${headerCount} headers, ${rowCount} rows`)
          
          // Test table accessibility
          await accessibilityHelpers.scanComponent('table')
          
          // Validate table headers
          if (headerCount > 0) {
            for (let j = 0; j < Math.min(headerCount, 5); j++) {
              const header = headers.nth(j)
              const scope = await header.getAttribute('scope')
              const headerText = await header.textContent()
              
              console.log(`Header ${j}: "${headerText}", scope: ${scope}`)
              
              if (!scope) {
                console.log(`Table header ${j} missing scope attribute`)
              }
            }
          }
          
          // Test table caption or aria-label
          const caption = table.locator('caption')
          const hasCaption = await caption.count() > 0
          const ariaLabel = await table.getAttribute('aria-label')
          const ariaLabelledBy = await table.getAttribute('aria-labelledby')
          
          console.log(`Table ${i} accessibility:`, { hasCaption, ariaLabel, ariaLabelledBy })
        }
      } else {
        console.log('No data tables found on all lessons page')
      }
      
      // Test lessons management controls
      const controls = page.locator('button, [role="button"], input[type="search"], select')
      const controlCount = await controls.count()
      
      if (controlCount > 0) {
        console.log(`Found ${controlCount} management controls`)
        
        // Test control accessibility
        await accessibilityHelpers.validateAriaLabels('button, input, select')
        
        // Test keyboard navigation through controls
        const controlTabStops = await accessibilityHelpers.testKeyboardNavigation({
          expectedTabStops: Math.min(controlCount, 10),
        })
        
        console.log('Management controls tab stops:', controlTabStops)
      }
      
      console.log('=== ALL LESSONS MANAGEMENT AUDIT COMPLETE ===')
    })

    test('should provide accessible lessons table sorting and filtering', async ({ page }) => {
      await page.goto('/lessons/all')
      
      console.log('=== LESSONS TABLE INTERACTIONS ACCESSIBILITY AUDIT ===')
      
      await page.waitForTimeout(2000)
      
      // Test sortable column headers
      const sortableHeaders = page.locator('th[role="columnheader"], th button, th[aria-sort]')
      const sortableCount = await sortableHeaders.count()
      
      if (sortableCount > 0) {
        console.log(`Found ${sortableCount} sortable headers`)
        
        for (let i = 0; i < Math.min(sortableCount, 3); i++) {
          const header = sortableHeaders.nth(i)
          const ariaSort = await header.getAttribute('aria-sort')
          const role = await header.getAttribute('role')
          const headerText = await header.textContent()
          
          console.log(`Sortable header ${i}: "${headerText}", aria-sort: ${ariaSort}, role: ${role}`)
          
          // Test sorting interaction
          if (await header.isVisible()) {
            await header.click()
            await page.waitForTimeout(200)
            
            const newAriaSort = await header.getAttribute('aria-sort')
            console.log(`Sort state changed to: ${newAriaSort}`)
          }
        }
      }
      
      // Test filter/search controls
      const searchInputs = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="filter"]')
      const searchCount = await searchInputs.count()
      
      if (searchCount > 0) {
        console.log(`Found ${searchCount} search/filter inputs`)
        
        for (let i = 0; i < searchCount; i++) {
          const searchInput = searchInputs.nth(i)
          const ariaLabel = await searchInput.getAttribute('aria-label')
          const placeholder = await searchInput.getAttribute('placeholder')
          const associatedLabel = await page.locator(`label[for="${await searchInput.getAttribute('id')}"]`).count()
          
          console.log(`Search input ${i}:`, { ariaLabel, placeholder, hasLabel: associatedLabel > 0 })
        }
      }
      
      console.log('=== LESSONS TABLE INTERACTIONS AUDIT COMPLETE ===')
    })
  })

  test.describe('Navigation and Sidebar Accessibility', () => {
    test('should provide accessible main navigation', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
      
      console.log('=== NAVIGATION ACCESSIBILITY AUDIT ===')
      
      // Test main navigation structure
      const navElements = page.locator('nav, [role="navigation"]')
      const navCount = await navElements.count()
      
      console.log(`Found ${navCount} navigation regions`)
      
      for (let i = 0; i < navCount; i++) {
        const nav = navElements.nth(i)
        const isVisible = await nav.isVisible()
        
        if (isVisible) {
          const ariaLabel = await nav.getAttribute('aria-label')
          const ariaLabelledBy = await nav.getAttribute('aria-labelledby')
          const role = await nav.getAttribute('role')
          
          console.log(`Navigation ${i}:`, { ariaLabel, ariaLabelledBy, role })
          
          // Test navigation accessibility
          await accessibilityHelpers.scanComponent(`nav:nth-child(${i + 1})`)
          
          // Test navigation keyboard accessibility
          const navLinks = nav.locator('a, button, [role="button"]')
          const linkCount = await navLinks.count()
          
          console.log(`Navigation ${i} has ${linkCount} interactive elements`)
          
          // Test first few navigation items
          for (let j = 0; j < Math.min(linkCount, 5); j++) {
            const navItem = navLinks.nth(j)
            
            if (await navItem.isVisible()) {
              const itemText = await navItem.textContent()
              const ariaCurrent = await navItem.getAttribute('aria-current')
              const href = await navItem.getAttribute('href')
              const testId = await navItem.getAttribute('data-testid')
              
              console.log(`Nav item ${j}: "${itemText}", aria-current: ${ariaCurrent}, href: ${href}, testId: ${testId}`)
              
              // Test keyboard interaction
              await navItem.focus()
              await expect(navItem).toBeFocused()
            }
          }
        }
      }
      
      // Test sidebar navigation specifically
      const sidebarElements = page.locator('[data-testid*="sidebar"], [data-testid*="nav"], .sidebar')
      const sidebarCount = await sidebarElements.count()
      
      if (sidebarCount > 0) {
        console.log(`Found ${sidebarCount} sidebar elements`)
        
        // Test sidebar keyboard navigation
        const sidebarTabStops = await accessibilityHelpers.testKeyboardNavigation({
          expectedTabStops: 5,
        })
        
        console.log('Sidebar navigation tab stops:', sidebarTabStops)
      }
      
      console.log('=== NAVIGATION AUDIT COMPLETE ===')
    })

    test('should provide accessible sidebar interactions', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
      
      console.log('=== SIDEBAR INTERACTIONS ACCESSIBILITY AUDIT ===')
      
      // Test sidebar navigation items
      const sidebarNavItems = page.locator('[data-testid*="nav-sidebar"], [data-testid*="sidebar"]')
      const sidebarItemCount = await sidebarNavItems.count()
      
      console.log(`Found ${sidebarItemCount} sidebar navigation items`)
      
      for (let i = 0; i < Math.min(sidebarItemCount, 5); i++) {
        const sidebarItem = sidebarNavItems.nth(i)
        
        if (await sidebarItem.isVisible()) {
          const testId = await sidebarItem.getAttribute('data-testid')
          const ariaLabel = await sidebarItem.getAttribute('aria-label')
          const role = await sidebarItem.getAttribute('role')
          const text = await sidebarItem.textContent()
          
          console.log(`Sidebar item ${i}:`, { testId, ariaLabel, role, text: text?.substring(0, 30) })
          
          // Test sidebar item keyboard interaction
          await sidebarItem.focus()
          await expect(sidebarItem).toBeFocused()
          
          // Test activation with Enter key
          await sidebarItem.press('Enter')
          await page.waitForTimeout(500)
          
          // Verify navigation occurred (basic check)
          const currentUrl = page.url()
          console.log(`After activating sidebar item ${i}, URL: ${currentUrl}`)
        }
      }
      
      console.log('=== SIDEBAR INTERACTIONS AUDIT COMPLETE ===')
    })
  })

  test.describe('Form and Input Accessibility', () => {
    test('should provide accessible form interactions across the application', async ({ page }) => {
      console.log('=== COMPREHENSIVE FORM ACCESSIBILITY AUDIT ===')
      
      // Test student form accessibility
      await studentsPOM.goto()
      await page.waitForTimeout(1000)
      
      console.log('--- Testing Students Form Accessibility ---')
      
      // Look for student creation/management forms
      const studentButtons = page.locator('button:has-text("New"), button:has-text("Neu"), button[data-testid*="create"]')
      if (await studentButtons.count() > 0) {
        await studentButtons.first().click()
        await page.waitForTimeout(500)
        
        const studentForm = page.locator('form, [data-testid*="form"], .form')
        if (await studentForm.count() > 0) {
          await accessibilityHelpers.scanComponent('form')
          await accessibilityHelpers.validateAriaLabels('input, textarea, select')
        }
      }
      
      // Test lesson form accessibility
      console.log('--- Testing Lessons Form Accessibility ---')
      await lessonsPOM.goto()
      await page.waitForTimeout(1000)
      
      const lessonButton = page.getByRole('button', { name: 'Neu' })
      if (await lessonButton.count() > 0) {
        await lessonButton.click()
        await expect(page.getByTestId('create-lesson-form')).toBeVisible()
        
        await accessibilityHelpers.scanComponent('[data-testid="create-lesson-form"]')
        await accessibilityHelpers.validateAriaLabels('input, textarea, select')
        
        // Test form submission accessibility
        const submitButtons = page.locator('button[type="submit"], button:has-text("save"), button:has-text("create")')
        if (await submitButtons.count() > 0) {
          const submitButton = submitButtons.first()
          const ariaLabel = await submitButton.getAttribute('aria-label')
          const buttonText = await submitButton.textContent()
          const isDisabled = await submitButton.isDisabled()
          
          console.log('Submit button accessibility:', { ariaLabel, buttonText, isDisabled })
        }
      }
      
      console.log('=== COMPREHENSIVE FORM AUDIT COMPLETE ===')
    })
  })

  test.describe('Mobile and Responsive Accessibility', () => {
    test('should maintain accessibility on mobile viewports', async ({ page }) => {
      console.log('=== MOBILE ACCESSIBILITY AUDIT ===')
      
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible()
      
      // Test mobile navigation accessibility
      const mobileNavButtons = page.locator('[data-testid*="mobile"], button[aria-expanded], .hamburger, .menu-toggle')
      const mobileNavCount = await mobileNavButtons.count()
      
      if (mobileNavCount > 0) {
        console.log(`Found ${mobileNavCount} mobile navigation elements`)
        
        const mobileNav = mobileNavButtons.first()
        const ariaExpanded = await mobileNav.getAttribute('aria-expanded')
        const ariaLabel = await mobileNav.getAttribute('aria-label')
        
        console.log('Mobile nav button:', { ariaExpanded, ariaLabel })
        
        // Test mobile navigation interaction
        await mobileNav.click()
        await page.waitForTimeout(300)
        
        const newAriaExpanded = await mobileNav.getAttribute('aria-expanded')
        console.log('Mobile nav expanded state changed to:', newAriaExpanded)
        
        // Test mobile navigation accessibility
        await accessibilityHelpers.scanFullPage()
      }
      
      // Test mobile form accessibility
      await lessonsPOM.goto()
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()
      
      // Mobile forms should still be accessible
      await accessibilityHelpers.validateAriaLabels('input, textarea, select')
      await accessibilityHelpers.testKeyboardNavigation({ expectedTabStops: 3 })
      
      console.log('=== MOBILE ACCESSIBILITY AUDIT COMPLETE ===')
    })
  })

  test.afterEach(async ({ page }) => {
    // Comprehensive accessibility scan after each test
    console.log('=== FINAL ACCESSIBILITY SCAN ===')
    await accessibilityHelpers.scanFullPage()
    console.log('=== ACCESSIBILITY TEST COMPLETED ===')
  })
})