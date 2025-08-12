import { test } from '@playwright/test'
import { LessonsPOM } from '../pom/LessonsPOM'
import { createVisualTestHelper } from './helpers/visualTestHelpers'

test.describe('Lesson Components Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    const lessonsPOM = new LessonsPOM(page, test.info())
    
    // Get stored student ID for direct navigation
    const studentId = LessonsPOM.getStoredStudentId()
    
    if (studentId) {
      // Navigate directly to lessons page using student ID
      await lessonsPOM.goto(studentId)
    } else {
      // Fallback to original navigation method
      console.warn('No student ID found, using fallback navigation')
      await lessonsPOM.goto()
    }
  })

  test('lesson header component - navigation and title', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Wait for lesson header
    await page.waitForSelector('[data-testid="lesson-header"], .lesson-header, h1, .page-title', { 
      state: 'visible', 
      timeout: 10000 
    })
    
    const headerLocator = page.locator('[data-testid="lesson-header"], .lesson-header').first()
    if (!await headerLocator.isVisible()) {
      // Fallback to page title area
      const titleArea = page.locator('header, .page-header, h1').first()
      if (await titleArea.isVisible()) {
        await visual.takeScreenshot({
          name: 'lesson-header-title-area',
          clip: titleArea,
        })
      }
    } else {
      await visual.testResponsiveComponent(headerLocator, 'lesson-header')
      await visual.testComponentThemes(headerLocator, 'lesson-header')
    }
  })

  test('lesson navigation sidebar - states and responsiveness', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Initialize theme based on test configuration
    await page.evaluate(() => {
      const html = document.documentElement
      // Check if this is a dark theme test (colorScheme is set to 'dark')
      const isDarkTest = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (isDarkTest) {
        html.classList.add('dark-mode')
        html.classList.remove('light-mode')
        // Set localStorage to match
        localStorage.setItem('isDarkMode', 'true')
      } else {
        html.classList.add('light-mode')
        html.classList.remove('dark-mode')
        // Set localStorage to match
        localStorage.setItem('isDarkMode', 'false')
      }
    })
    
    // Check if we're running in a mobile test configuration
    const viewport = page.viewportSize()
    const isMobileTest = viewport && viewport.width < 768
    
    if (isMobileTest) {
      // Test mobile navigation (< md screens)  
      const mobileNav = page.locator('nav.fixed.bottom-0')
      
      if (await mobileNav.isVisible()) {
        await visual.testComponentStates(mobileNav, 'lesson-nav-mobile', [
          {
            name: 'default',
            action: async () => {
              // No action needed for mobile nav default state
            }
          }
        ])
      }
    } else {
      // Test desktop sidebar (md+ screens)
      const desktopSidebar = page.locator('[data-sidebar="sidebar"]')
      
      if (await desktopSidebar.first().isVisible()) {
        const nav = desktopSidebar.first()
        
        // Test navigation states
        await visual.testComponentStates(nav, 'lesson-nav-sidebar', [
          {
            name: 'default',
            action: async () => {
              // No action needed for default state
            }
          }
        ])
      }
    }
  })

  test('lesson item component - individual lesson display', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Wait for lesson items to load
    await page.waitForSelector('[data-testid="lesson-item"], .lesson-item, .lesson-card', { 
      state: 'visible', 
      timeout: 10000 
    })
    
    const lessonItems = page.locator('[data-testid="lesson-item"], .lesson-item, .lesson-card')
    
    if (await lessonItems.first().isVisible()) {
      const firstItem = lessonItems.first()
      
      // Test lesson item states
      await visual.testComponentStates(firstItem, 'lesson-item', [
        {
          name: 'hover',
          action: async () => {
            await firstItem.hover()
          }
        },
        {
          name: 'selected',
          action: async () => {
            await firstItem.click()
          }
        }
      ])
      
      // Test responsive design
      await visual.testResponsiveComponent(firstItem, 'lesson-item')
    }
  })

  test('lesson mobile drawer - mobile-specific UI', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await visual.waitForStability()
    
    // Look for mobile drawer trigger
    const drawerTrigger = page.locator('[data-testid="mobile-drawer-trigger"], .mobile-menu-button, .hamburger-menu')
    
    if (await drawerTrigger.first().isVisible()) {
      await drawerTrigger.first().click()
      
      // Wait for mobile drawer
      const mobileDrawer = page.locator('[data-testid="mobile-drawer"], .mobile-drawer, [role="dialog"]')
      if (await mobileDrawer.isVisible()) {
        await visual.takeScreenshot({
          name: 'lesson-mobile-drawer',
          clip: mobileDrawer,
        })
      }
    }
  })

  test('lesson content display - rich text and formatting', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for lesson content area
    const contentArea = page.locator('[data-testid="lesson-content-display"], .lesson-content, .content-display')
    
    if (await contentArea.first().isVisible()) {
      const content = contentArea.first()
      
      await visual.takeScreenshot({
        name: 'lesson-content-display',
        clip: content,
      })
      
      // Test with different content lengths
      await visual.testComponentStates(content, 'lesson-content-display', [
        {
          name: 'long-content',
          action: async () => {
            // Simulate long content by expanding or scrolling
            await content.evaluate((el) => {
              if (el.scrollHeight > el.clientHeight) {
                el.scrollTop = el.scrollHeight
              }
            })
          }
        }
      ])
    }
  })

  test('homework display section - homework visualization', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for homework display area
    const homeworkDisplay = page.locator('[data-testid="homework-display"], .homework-display, .homework-section')
    
    if (await homeworkDisplay.first().isVisible()) {
      const homework = homeworkDisplay.first()
      
      await visual.takeScreenshot({
        name: 'homework-display',
        clip: homework,
      })
      
      // Test theme variations
      await visual.testComponentThemes(homework, 'homework-display')
    }
  })

  test('lesson notes component - note-taking interface', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for notes section
    const notesSection = page.locator('[data-testid="lesson-notes"], .notes-section, .notes')
    
    if (await notesSection.first().isVisible()) {
      const notes = notesSection.first()
      
      // Test notes component states
      await visual.testComponentStates(notes, 'lesson-notes', [
        {
          name: 'empty',
          action: async () => {
            // Ensure notes are empty
            const noteInput = notes.locator('textarea, input, [contenteditable]')
            if (await noteInput.isVisible()) {
              await noteInput.clear()
            }
          }
        },
        {
          name: 'with-notes',
          action: async () => {
            // Add sample notes
            const noteInput = notes.locator('textarea, input, [contenteditable]')
            if (await noteInput.isVisible()) {
              await noteInput.fill('Student showed improvement in rhythm. Work more on dynamics.')
            }
          }
        }
      ])
    }
  })

  test('lesson action buttons - CRUD operations', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for action buttons
    const actionButtons = page.locator('[data-testid="lesson-actions"], .lesson-actions, .action-buttons')
    
    if (await actionButtons.first().isVisible()) {
      const buttons = actionButtons.first()
      
      await visual.takeScreenshot({
        name: 'lesson-action-buttons',
        clip: buttons,
      })
      
      // Test button states
      const individualButtons = buttons.locator('button')
      const count = await individualButtons.count()
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = individualButtons.nth(i)
        const buttonText = await button.textContent() || `button-${i}`
        
        await visual.testComponentStates(button, `lesson-action-${buttonText.toLowerCase().replace(/\s+/g, '-')}`, [
          {
            name: 'hover',
            action: async () => {
              await button.hover()
            }
          }
        ])
      }
    }
  })

  test('lesson status indicators - visual feedback', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for status indicators
    const statusIndicators = page.locator('[data-testid="lesson-status"], .status-indicator, .lesson-status, .badge')
    
    if (await statusIndicators.first().isVisible()) {
      const status = statusIndicators.first()
      
      await visual.takeScreenshot({
        name: 'lesson-status-indicators',
        clip: status,
      })
      
      // Test different status variations if multiple exist
      const allStatuses = await statusIndicators.all()
      for (let i = 0; i < Math.min(allStatuses.length, 3); i++) {
        await visual.takeScreenshot({
          name: `lesson-status-variant-${i + 1}`,
          clip: allStatuses[i],
        })
      }
    }
  })

  test('lesson search and filter - interface controls', async ({ page }) => {
    const visual = createVisualTestHelper(page)
    
    // Look for search/filter controls
    const searchFilter = page.locator('[data-testid="lesson-search"], .search-input, input[type="search"], .filter-controls')
    
    if (await searchFilter.first().isVisible()) {
      const controls = searchFilter.first()
      
      // Test search/filter states
      await visual.testComponentStates(controls, 'lesson-search-filter', [
        {
          name: 'focused',
          action: async () => {
            await controls.focus()
          }
        },
        {
          name: 'with-query',
          action: async () => {
            await controls.fill('lesson search query')
          }
        }
      ])
    }
  })
})