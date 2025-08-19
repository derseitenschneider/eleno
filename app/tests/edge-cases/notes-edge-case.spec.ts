import { test, expect } from '@playwright/test'
import * as fs from 'node:fs'

/**
 * Edge-case visual regression tests for Notes functionality
 * Tests problematic viewport sizes that could cause layout issues with notes display
 *
 * Test Coverage:
 * 1. Notes sidebar display in lesson context (desktop)
 * 2. Student-specific notes view within lessons
 * 3. Group notes view within group lessons
 * 4. Notes creation interface (sidebar modal/form)
 * 5. Notes ordering and drag-and-drop (desktop)
 * 6. Notes editing interface
 * 7. Mobile notes integration within lesson interface
 * 8. Color coding visibility and accessibility
 *
 * @junior-dev-notes
 * Notes are embedded within the lesson interface, not a standalone page.
 * They appear as a sidebar on desktop ("Notizen" with "+ NEU" button) and are
 * integrated differently on mobile (tabs, collapsible sections, or inline).
 * Notes can be student-specific, group-specific, or general.
 *
 * Key points:
 * - Notes are always accessed through lesson pages (/lessons/s-{id} or /lessons/g-{id})
 * - Desktop: Look for aside/sidebar with "Notizen" header
 * - Mobile: Look for tabs, collapsible sections, or inline integration
 * - Notes have color coding (blue, red, green, yellow) and drag-and-drop ordering
 * - All tests should navigate to lesson pages, not a standalone /notes route
 */
test.describe('Notes - Edge Case Visual Regression', () => {
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
      window.Date = class extends OriginalDate {
        constructor(...args) {
          if (args.length === 0) {
            super('2025-08-13T10:00:00Z')
          } else {
            super(...args)
          }
        }
        static now() {
          return new Date('2025-08-13T10:00:00Z').getTime()
        }
      }
      Object.setPrototypeOf(window.Date, OriginalDate)
      Object.setPrototypeOf(window.Date.prototype, OriginalDate.prototype)
      
      // Set theme
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
    })
  })

  /**
   * Test 1: Notes Sidebar in Lesson Context - Desktop
   * Tests the notes sidebar displayed in the lesson interface on desktop
   */
  test('Notes Sidebar in Lesson - Desktop viewports only', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()

    // Skip for mobile viewports since notes are handled differently
    if (!viewport || viewport.width < 768) {
      console.log(
        `${projectName}: Skipping notes sidebar test for mobile viewport`,
      )
      return
    }

    const studentId = testData.defaultStudentId
    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for notes sidebar
    const notesSidebar = page.locator('aside, [data-testid="notes-sidebar"]')

    if ((await notesSidebar.count()) > 0 && (await notesSidebar.isVisible())) {
      // Check for notes presence in sidebar
      const noteItems = notesSidebar.locator(
        '[data-testid="note-item"], .note-item, .note',
      )
      const noteCount = await noteItems.count()
      console.log(`${projectName}: Notes in sidebar: ${noteCount}`)

      // Look for "Notizen" header and "+ NEU" button
      const notesHeader = notesSidebar.locator(
        ':has-text("Notizen"), :has-text("Notes")',
      )
      const addButton = notesSidebar.locator(
        'button:has-text("NEU"), button:has-text("New"), [data-testid="add-note"]',
      )

      console.log(
        `${projectName}: Notes header: ${await notesHeader.count()}, Add button: ${await addButton.count()}`,
      )

      // Check color coding if notes exist
      if (noteCount > 0) {
        const coloredNotes = await notesSidebar.evaluate((sidebar) => {
          const notes = Array.from(
            sidebar.querySelectorAll(
              '[data-testid="note-item"], .note-item, .note',
            ),
          )
          return notes.map((note) => {
            const element = note as HTMLElement
            const computedStyle = window.getComputedStyle(element)
            return {
              backgroundColor: computedStyle.backgroundColor,
              borderColor: computedStyle.borderColor,
              hasColorClass:
                element.className.includes('blue') ||
                element.className.includes('red') ||
                element.className.includes('green') ||
                element.className.includes('yellow'),
            }
          })
        })
        console.log(
          `${projectName}: Color coding detected:`,
          coloredNotes.length,
        )
      }

      // Take screenshot of notes sidebar
      await expect(notesSidebar).toHaveScreenshot(
        `notes-sidebar-context-${projectName}.png`,
        {
          animations: 'disabled',
        },
      )
    } else {
      console.log(`${projectName}: No notes sidebar found`)
    }
  })

  /**
   * Test 2: Student-Specific Notes View
   * Tests notes displayed in the context of a specific student
   */
  test('Student Notes View - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    // Navigate to student's lesson page where notes should be visible
    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for notes in lesson context
    if (viewport && viewport.width < 768) {
      // Mobile: Notes might be in a tab or collapsible section
      const notesSection = page.locator(
        '[data-testid="notes-section"], .notes-section, .student-notes',
      )

      if ((await notesSection.count()) > 0) {
        // Try to expand notes if they're collapsed
        const notesToggle = page.locator(
          '[data-testid="notes-toggle"], button:has-text("Notes"), .notes-toggle',
        )
        if (
          (await notesToggle.count()) > 0 &&
          (await notesToggle.isVisible())
        ) {
          await notesToggle.click()
          await page.waitForTimeout(500)
        }

        await expect(page).toHaveScreenshot(
          `mobile-student-notes-${projectName}.png`,
          {
            fullPage: true,
            animations: 'disabled',
          },
        )
      }
    } else {
      // Desktop: Notes should be in sidebar
      const notesSidebar = page.locator(
        'aside, [data-testid="notes-sidebar"], .notes-sidebar',
      )

      if (
        (await notesSidebar.count()) > 0 &&
        (await notesSidebar.isVisible())
      ) {
        // Count student-specific notes
        const studentNotes = notesSidebar.locator(
          '[data-testid="note-item"], .note-item, .note',
        )
        const studentNoteCount = await studentNotes.count()
        console.log(
          `${projectName}: Student notes in sidebar: ${studentNoteCount}`,
        )

        await expect(notesSidebar).toHaveScreenshot(
          `desktop-student-notes-sidebar-${projectName}.png`,
          {
            animations: 'disabled',
          },
        )
      }
    }

    console.log(
      `${projectName}: Student notes view captured at ${viewport?.width}x${viewport?.height}`,
    )
  })

  /**
   * Test 3: Group Notes View
   * Tests notes displayed in the context of a group
   */
  test('Group Notes View - All viewports', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const groupId = testData.groupId

    if (!groupId) {
      console.log(`${projectName}: No group created, skipping group notes test`)
      return
    }

    await page.goto(`/lessons/g-${groupId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for group notes
    if (viewport && viewport.width < 768) {
      // Mobile group notes
      const groupNotesSection = page.locator(
        '[data-testid="group-notes"], .group-notes, .notes-section',
      )

      if ((await groupNotesSection.count()) > 0) {
        await expect(page).toHaveScreenshot(
          `mobile-group-notes-${projectName}.png`,
          {
            fullPage: true,
            animations: 'disabled',
          },
        )
      }
    } else {
      // Desktop group notes sidebar
      const notesSidebar = page.locator('aside, [data-testid="notes-sidebar"]')

      if (
        (await notesSidebar.count()) > 0 &&
        (await notesSidebar.isVisible())
      ) {
        const groupNotes = notesSidebar.locator(
          '[data-testid="note-item"], .note-item',
        )
        const groupNoteCount = await groupNotes.count()
        console.log(`${projectName}: Group notes in sidebar: ${groupNoteCount}`)

        await expect(notesSidebar).toHaveScreenshot(
          `desktop-group-notes-sidebar-${projectName}.png`,
          {
            animations: 'disabled',
          },
        )
      }
    }

    console.log(`${projectName}: Group notes view captured`)
  })

  /**
   * Test 4: Notes Creation Interface
   * Tests the interface for creating new notes within lesson context
   */
  test('Notes Creation Interface - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for add note button in sidebar (desktop) or mobile equivalent
    let addNoteButton

    if (viewport && viewport.width >= 768) {
      // Desktop: Look in notes sidebar
      const notesSidebar = page.locator('aside, [data-testid="notes-sidebar"]')
      addNoteButton = notesSidebar.locator(
        'button:has-text("NEU"), button:has-text("New"), [data-testid="add-note"]',
      )
    } else {
      // Mobile: Look for notes section or tab
      addNoteButton = page.locator(
        'button:has-text("NEU"), button:has-text("New Note"), [data-testid="add-note"]',
      )
    }

    if (
      (await addNoteButton.count()) > 0 &&
      (await addNoteButton.isVisible())
    ) {
      // Take screenshot before opening form
      await expect(page).toHaveScreenshot(
        `notes-creation-closed-${projectName}.png`,
        {
          fullPage: viewport ? viewport.width < 768 : false,
          animations: 'disabled',
        },
      )

      await addNoteButton.click()
      await page.waitForTimeout(500)

      // Check for note creation form/modal
      const noteForm = page.locator(
        '[data-testid="note-form"], .note-form, [role="dialog"], .modal',
      )

      if ((await noteForm.count()) > 0 && (await noteForm.isVisible())) {
        // Look for form fields
        const titleField = noteForm.locator(
          'input[placeholder*="title" i], input[name*="title" i]',
        )
        const textField = noteForm.locator('textarea, [role="textbox"]')
        const colorPicker = noteForm.locator(
          '[data-testid="color-picker"], .color-picker, .color-selector',
        )

        console.log(
          `${projectName}: Note form fields - Title: ${await titleField.count()}, Text: ${await textField.count()}, Color: ${await colorPicker.count()}`,
        )

        // Fill form to test layout
        if ((await titleField.count()) > 0) {
          await titleField.fill('Test Note Title for Visual Regression')
        }
        if ((await textField.count()) > 0) {
          await textField.fill(
            'This is a test note content to verify the layout and text wrapping behavior across different viewport sizes.',
          )
        }

        // Take screenshot with form filled
        await expect(page).toHaveScreenshot(
          `notes-creation-form-${projectName}.png`,
          {
            fullPage: viewport ? viewport.width < 768 : false,
            animations: 'disabled',
          },
        )

        // Test color picker if visible
        if (
          (await colorPicker.count()) > 0 &&
          (await colorPicker.isVisible())
        ) {
          await colorPicker.click()
          await page.waitForTimeout(300)

          await expect(page).toHaveScreenshot(
            `notes-color-picker-${projectName}.png`,
            {
              fullPage: viewport ? viewport.width < 768 : false,
              animations: 'disabled',
            },
          )
        }

        // Close form/modal
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
      console.log(`${projectName}: No add note button found`)
    }
  })

  /**
   * Test 5: Notes Ordering and Drag-and-Drop
   * Tests drag-and-drop functionality on desktop viewports within lesson context
   */
  test('Notes Ordering - Desktop viewports only', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()

    // Skip for mobile viewports
    if (!viewport || viewport.width < 768) {
      console.log(
        `${projectName}: Skipping drag-and-drop test for mobile viewport`,
      )
      return
    }

    const studentId = testData.defaultStudentId
    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for notes sidebar first
    const notesSidebar = page.locator('aside, [data-testid="notes-sidebar"]')

    if ((await notesSidebar.count()) > 0 && (await notesSidebar.isVisible())) {
      // Look for draggable notes within the sidebar
      const noteItems = notesSidebar.locator(
        '[data-testid="note-item"], .note-item, .note',
      )
      const noteCount = await noteItems.count()

      if (noteCount > 1) {
        // Look for drag handles within the sidebar
        const dragHandles = notesSidebar.locator(
          '[data-testid="drag-handle"], .drag-handle, .grip, [draggable="true"]',
        )
        const handleCount = await dragHandles.count()

        console.log(
          `${projectName}: Found ${noteCount} notes with ${handleCount} drag handles in sidebar`,
        )

        // Take screenshot showing drag handles in sidebar
        await expect(notesSidebar).toHaveScreenshot(
          `notes-drag-handles-sidebar-${projectName}.png`,
          {
            animations: 'disabled',
          },
        )

        // Test hover state on drag handle if available
        if (handleCount > 0) {
          await dragHandles.first().hover()
          await page.waitForTimeout(300)

          await expect(notesSidebar).toHaveScreenshot(
            `notes-drag-hover-sidebar-${projectName}.png`,
            {
              animations: 'disabled',
            },
          )
        }
      } else {
        console.log(
          `${projectName}: Not enough notes for drag-and-drop testing (${noteCount} notes)`,
        )
      }
    } else {
      console.log(
        `${projectName}: No notes sidebar found for drag-and-drop testing`,
      )
    }
  })

  /**
   * Test 6: Notes Editing Interface
   * Tests inline editing or edit modal for notes within lesson context
   */
  test('Notes Editing Interface - All viewports', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()
    const studentId = testData.defaultStudentId

    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for notes in appropriate location based on viewport
    let noteItems
    if (viewport && viewport.width >= 768) {
      // Desktop: Look in sidebar
      const notesSidebar = page.locator('aside, [data-testid="notes-sidebar"]')
      if ((await notesSidebar.count()) > 0) {
        noteItems = notesSidebar.locator(
          '[data-testid="note-item"], .note-item, .note',
        )
      }
    } else {
      // Mobile: Look in main content area
      noteItems = page.locator('[data-testid="note-item"], .note-item, .note')
    }

    if (noteItems) {
      const noteCount = await noteItems.count()

      if (noteCount > 0) {
        const firstNote = noteItems.first()

        // Look for edit button (three dots menu or direct edit button)
        const menuButton = firstNote.locator(
          '[data-testid="note-menu"], button:has([data-testid="three-dots"]), button:has-text("⋮")',
        )
        const editButton = firstNote.locator(
          '[data-testid="edit-note"], .edit-btn, button:has-text("Edit")',
        )

        if ((await menuButton.count()) > 0 && (await menuButton.isVisible())) {
          await menuButton.click()
          await page.waitForTimeout(300)

          // Look for edit option in menu
          const editOption = page.locator(
            'button:has-text("Edit"), [data-testid="edit-option"]',
          )
          if ((await editOption.count()) > 0) {
            await editOption.click()
          }
        } else if (
          (await editButton.count()) > 0 &&
          (await editButton.isVisible())
        ) {
          await editButton.click()
        } else {
          // Try double-click to edit
          await firstNote.dblclick()
        }

        await page.waitForTimeout(500)

        // Check for edit mode (modal or inline editing)
        const editForm = page.locator(
          '[data-testid="edit-note-form"], .edit-form, .note-edit, [role="dialog"]',
        )

        if ((await editForm.count()) > 0 && (await editForm.isVisible())) {
          console.log(`${projectName}: Edit form opened`)

          await expect(page).toHaveScreenshot(
            `notes-edit-form-${projectName}.png`,
            {
              fullPage: viewport ? viewport.width < 768 : false,
              animations: 'disabled',
            },
          )

          // Test save/cancel buttons
          const saveButton = page.locator(
            'button:has-text("Save"), [data-testid="save-note"]',
          )
          const cancelButton = page.locator(
            'button:has-text("Cancel"), [data-testid="cancel-edit"]',
          )

          console.log(
            `${projectName}: Edit buttons - Save: ${await saveButton.count()}, Cancel: ${await cancelButton.count()}`,
          )

          // Close edit form
          if ((await cancelButton.count()) > 0) {
            await cancelButton.click()
          } else {
            await page.keyboard.press('Escape')
          }
          await page.waitForTimeout(300)
        } else {
          console.log(
            `${projectName}: No edit form found after attempting to edit`,
          )
        }
      } else {
        console.log(`${projectName}: No notes available for editing test`)
      }
    } else {
      console.log(`${projectName}: No notes container found`)
    }
  })

  /**
   * Test 7: Notes Mobile Integration
   * Tests how notes are integrated into the mobile lesson interface
   */
  test('Notes Mobile Integration - Mobile viewports only', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()

    // Skip for desktop viewports
    if (!viewport || viewport.width >= 768) {
      console.log(
        `${projectName}: Skipping notes mobile integration test for desktop viewport`,
      )
      return
    }

    const studentId = testData.defaultStudentId
    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for mobile notes integration - could be tabs, collapsible sections, etc.
    const notesTab = page.locator(
      '[data-testid="notes-tab"], .notes-tab, button:has-text("Notizen")',
    )
    const notesSection = page.locator(
      '[data-testid="notes-section"], .notes-section',
    )
    const notesCollapsible = page.locator(
      '[data-testid="notes-collapsible"], .notes-collapsible',
    )

    console.log(
      `${projectName}: Mobile notes elements - Tab: ${await notesTab.count()}, Section: ${await notesSection.count()}, Collapsible: ${await notesCollapsible.count()}`,
    )

    // Try to interact with notes in mobile context
    if ((await notesTab.count()) > 0 && (await notesTab.isVisible())) {
      await notesTab.click()
      await page.waitForTimeout(500)

      await expect(page).toHaveScreenshot(
        `notes-mobile-tab-active-${projectName}.png`,
        {
          fullPage: true,
          animations: 'disabled',
        },
      )
    } else if ((await notesCollapsible.count()) > 0) {
      await notesCollapsible.click()
      await page.waitForTimeout(500)

      await expect(page).toHaveScreenshot(
        `notes-mobile-expanded-${projectName}.png`,
        {
          fullPage: true,
          animations: 'disabled',
        },
      )
    } else {
      // Take screenshot of default mobile lesson view
      await expect(page).toHaveScreenshot(
        `notes-mobile-default-${projectName}.png`,
        {
          fullPage: true,
          animations: 'disabled',
        },
      )
    }

    console.log(`${projectName}: Mobile notes integration captured`)
  })

  /**
   * Test 8: Notes Color Coding Visibility
   * Tests visibility and accessibility of different note colors in lesson context
   */
  test('Notes Color Coding - Desktop viewports only', async ({
    page,
  }, testInfo) => {
    const projectName = testInfo.project.name
    const viewport = page.viewportSize()

    // Skip for mobile viewports since color coding is better visible on desktop
    if (!viewport || viewport.width < 768) {
      console.log(
        `${projectName}: Skipping color coding test for mobile viewport`,
      )
      return
    }

    const studentId = testData.defaultStudentId
    await page.goto(`/lessons/s-${studentId}`)

    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Look for notes sidebar
    const notesSidebar = page.locator('aside, [data-testid="notes-sidebar"]')

    if ((await notesSidebar.count()) > 0 && (await notesSidebar.isVisible())) {
      // Analyze color coding within the sidebar
      const colorAnalysis = await notesSidebar.evaluate((sidebar) => {
        const notes = Array.from(
          sidebar.querySelectorAll(
            '[data-testid="note-item"], .note-item, .note',
          ),
        )
        const colors = ['blue', 'red', 'green', 'yellow']
        const colorInfo: any = {}

        colors.forEach((color) => {
          const coloredNotes = notes.filter(
            (note) =>
              note.className.includes(color) ||
              note.querySelector(`[class*="${color}"]`) ||
              (note as HTMLElement).style.backgroundColor.includes(color) ||
              (note as HTMLElement).style.borderColor.includes(color),
          )
          colorInfo[color] = {
            count: coloredNotes.length,
            elements: coloredNotes.map((note) => ({
              text: note.textContent?.substring(0, 50),
              backgroundColor: window.getComputedStyle(note as HTMLElement)
                .backgroundColor,
              borderColor: window.getComputedStyle(note as HTMLElement)
                .borderColor,
              borderLeft: window.getComputedStyle(note as HTMLElement)
                .borderLeftColor,
            })),
          }
        })

        return colorInfo
      })

      console.log(
        `${projectName}: Color analysis:`,
        JSON.stringify(colorAnalysis, null, 2),
      )

      // Take screenshot of notes sidebar with color coding
      await expect(notesSidebar).toHaveScreenshot(
        `notes-color-coding-sidebar-${projectName}.png`,
        {
          animations: 'disabled',
        },
      )
    } else {
      console.log(
        `${projectName}: No notes sidebar found for color coding test`,
      )
    }
  })
})
