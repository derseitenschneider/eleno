import { type Page, type Locator, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

/**
 * Accessibility testing helper utilities for WCAG compliance
 */
export class AccessibilityHelpers {
  private page: Page
  constructor(page: Page) {
    this.page = page
  }

  /**
   * Run comprehensive accessibility scan on entire page
   */
  async scanFullPage(): Promise<void> {
    const accessibilityScanResults = await new AxeBuilder({ page: this.page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  }

  /**
   * Scan specific component for accessibility violations
   */
  async scanComponent(selector: string): Promise<void> {
    const accessibilityScanResults = await new AxeBuilder({ page: this.page })
      .include(selector)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  }

  /**
   * Test keyboard navigation through interactive elements
   */
  async testKeyboardNavigation(options?: {
    startFromTop?: boolean
    expectedTabStops?: number
    skipElements?: string[]
  }) {
    const { startFromTop = true, expectedTabStops, skipElements = [] } = options || {}
    
    if (startFromTop) {
      // Start from top of page
      await this.page.keyboard.press('Control+Home')
      await this.page.waitForTimeout(100)
    }

    const tabStops: string[] = []
    let currentElement = await this.page.locator(':focus')
    let iterations = 0
    const maxIterations = 50 // Prevent infinite loops

    while (iterations < maxIterations) {
      await this.page.keyboard.press('Tab')
      await this.page.waitForTimeout(50)
      
      const newFocusedElement = await this.page.locator(':focus')
      const elementId = await newFocusedElement.getAttribute('data-testid') || 
                      await newFocusedElement.getAttribute('id') ||
                      await newFocusedElement.getAttribute('aria-label') ||
                      'unknown-element'
      
      if (!skipElements.includes(elementId)) {
        tabStops.push(elementId)
      }

      // Check if we've cycled back to the first element
      const isFirstElement = tabStops.length > 1 && tabStops[0] === elementId
      if (isFirstElement) break
      
      iterations++
    }

    if (expectedTabStops) {
      expect(tabStops.length).toBeGreaterThanOrEqual(expectedTabStops)
    }

    return tabStops
  }

  /**
   * Test focus management in modals and dialogs
   */
  async testFocusTrapping(dialogSelector: string) {
    const dialog = this.page.locator(dialogSelector)
    await expect(dialog).toBeVisible()

    // Find all focusable elements within the dialog
    const focusableElements = dialog.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const count = await focusableElements.count()
    
    if (count === 0) {
      throw new Error(`No focusable elements found in dialog: ${dialogSelector}`)
    }

    // Test that focus stays within the dialog
    const firstElement = focusableElements.first()
    const lastElement = focusableElements.last()

    // Focus should be on first element initially
    await firstElement.focus()
    await expect(firstElement).toBeFocused()

    // Tab to last element
    for (let i = 0; i < count - 1; i++) {
      await this.page.keyboard.press('Tab')
      await this.page.waitForTimeout(50)
    }
    await expect(lastElement).toBeFocused()

    // Tab beyond last element should return to first
    await this.page.keyboard.press('Tab')
    await this.page.waitForTimeout(50)
    await expect(firstElement).toBeFocused()

    // Shift+Tab from first element should go to last
    await this.page.keyboard.press('Shift+Tab')
    await this.page.waitForTimeout(50)
    await expect(lastElement).toBeFocused()
  }

  /**
   * Test ARIA labels and descriptions
   */
  async validateAriaLabels(selector: string) {
    const elements = await this.page.locator(selector).all()
    
    for (const element of elements) {
      const tagName = await element.evaluate(el => el.tagName.toLowerCase())
      const hasAriaLabel = await element.getAttribute('aria-label')
      const hasAriaLabelledBy = await element.getAttribute('aria-labelledby')
      const hasAriaDescribedBy = await element.getAttribute('aria-describedby')
      const role = await element.getAttribute('role')

      // Interactive elements should have accessible names
      if (['button', 'link', 'input', 'select', 'textarea'].includes(tagName) || 
          ['button', 'link', 'textbox', 'combobox', 'listbox'].includes(role || '')) {
        
        const hasLabel = hasAriaLabel || hasAriaLabelledBy || 
                        await element.textContent() ||
                        await element.getAttribute('alt') ||
                        await element.getAttribute('title')

        if (!hasLabel) {
          const elementInfo = await element.evaluate(el => ({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            outerHTML: el.outerHTML.substring(0, 200)
          }))
          throw new Error(`Interactive element missing accessible name: ${JSON.stringify(elementInfo)}`)
        }
      }
    }
  }

  /**
   * Test color contrast ratios
   */
  async testColorContrast(elements?: string[]) {
    const defaultElements = [
      'body', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'button', 'a', 'input', 'label', 'span'
    ]
    
    const elementsToCheck = elements || defaultElements
    
    for (const selector of elementsToCheck) {
      const elementExists = await this.page.locator(selector).count() > 0
      if (elementExists) {
        await this.scanComponent(selector)
      }
    }
  }

  /**
   * Test screen reader announcements and live regions
   */
  async testScreenReaderAnnouncements() {
    // Check for aria-live regions
    const liveRegions = this.page.locator('[aria-live]')
    const liveRegionCount = await liveRegions.count()
    
    const announcements = []
    
    if (liveRegionCount > 0) {
      for (let i = 0; i < liveRegionCount; i++) {
        const region = liveRegions.nth(i)
        const liveValue = await region.getAttribute('aria-live')
        const content = await region.textContent()
        const atomic = await region.getAttribute('aria-atomic')
        
        announcements.push({
          liveValue,
          content,
          atomic: atomic === 'true',
          selector: await region.evaluate(el => el.tagName + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''))
        })
      }
    }

    return announcements
  }

  /**
   * Test semantic HTML structure
   */
  async validateSemanticStructure() {
    // Check for proper heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all()
    const headingLevels: number[] = []
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const level = parseInt(tagName.substring(1))
      headingLevels.push(level)
    }

    // Validate heading hierarchy (should not skip levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i]
      const previousLevel = headingLevels[i - 1]
      
      if (currentLevel > previousLevel + 1) {
        throw new Error(`Heading hierarchy violation: h${previousLevel} followed by h${currentLevel}`)
      }
    }

    // Check for landmark roles
    const landmarks = {
      main: await this.page.locator('main, [role="main"]').count(),
      nav: await this.page.locator('nav, [role="navigation"]').count(),
      banner: await this.page.locator('header, [role="banner"]').count(),
      contentinfo: await this.page.locator('footer, [role="contentinfo"]').count(),
    }

    return { headingLevels, landmarks }
  }

  /**
   * Simulate screen reader navigation
   */
  async simulateScreenReaderNavigation() {
    const navigationCommands = [
      'ArrowDown', // Next element
      'ArrowUp',   // Previous element
      'Tab',       // Next focusable
      'Shift+Tab', // Previous focusable
    ]

    const navigationResults = []

    for (const command of navigationCommands) {
      const beforeElement = await this.page.locator(':focus').textContent()
      
      await this.page.keyboard.press(command)
      await this.page.waitForTimeout(100)
      
      const afterElement = await this.page.locator(':focus').textContent()
      
      navigationResults.push({
        command,
        beforeElement,
        afterElement,
        navigationSuccessful: beforeElement !== afterElement
      })
    }

    return navigationResults
  }

  /**
   * Test keyboard shortcuts functionality
   */
  async testKeyboardShortcuts(shortcuts: Array<{
    keys: string
    expectedAction: string
    verifyAction: () => Promise<boolean>
  }>) {
    const results = []
    
    for (const shortcut of shortcuts) {
      await this.page.keyboard.press(shortcut.keys)
      await this.page.waitForTimeout(200)
      
      const actionExecuted = await shortcut.verifyAction()
      
      results.push({
        keys: shortcut.keys,
        expectedAction: shortcut.expectedAction,
        actionExecuted
      })
      
      if (!actionExecuted) {
        throw new Error(`Keyboard shortcut failed: ${shortcut.keys} for ${shortcut.expectedAction}`)
      }
    }
    
    return results
  }
}
