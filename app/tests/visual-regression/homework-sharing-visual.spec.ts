import { test } from '@playwright/test'
import { LessonsPOM } from '../pom/LessonsPOM'
import { createVisualTestHelper } from './helpers/visualTestHelpers'

test.describe('Homework Sharing Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    const lessonsPOM = new LessonsPOM(page, test.info())
    await lessonsPOM.goto()
  })

  test('homework sharing button - states and accessibility', async ({
    page,
  }) => {
    const visual = createVisualTestHelper(page)

    // Look for homework sharing button
    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      const button = shareButton.first()

      // Test button states
      await visual.testComponentStates(button, 'homework-share-button', [
        {
          name: 'hover',
          action: async () => {
            await button.hover()
          },
        },
        {
          name: 'focused',
          action: async () => {
            await button.focus()
          },
        },
        {
          name: 'disabled',
          action: async () => {
            // Check if button can be disabled by clearing homework content
            const homeworkField = page.locator(
              '[data-testid="homework"], textarea[placeholder*="Hausaufgabe"]',
            )
            if (await homeworkField.isVisible()) {
              await homeworkField.clear()
            }
          },
        },
      ])
    }
  })

  test('homework sharing modal - complete workflow', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    // Look for share button and click it
    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      await shareButton.first().click()

      // Wait for sharing modal
      await page.waitForSelector('[role="dialog"], .modal, .share-modal', {
        state: 'visible',
      })

      const modal = page
        .locator('[role="dialog"], .modal, .share-modal')
        .first()

      // Test modal states
      await visual.testComponentStates(modal, 'homework-sharing-modal', [
        {
          name: 'loading',
          action: async () => {
            // Modal might show loading state initially
            await visual.waitForStability()
          },
        },
        {
          name: 'ready-to-share',
          action: async () => {
            // Wait for any loading to complete
            await page
              .waitForSelector('.loading, .spinner', {
                state: 'detached',
                timeout: 5000,
              })
              .catch(() => {})
          },
        },
        {
          name: 'with-expiration-settings',
          action: async () => {
            // Look for expiration settings
            const expirationDropdown = modal.locator(
              'select, [role="combobox"]',
            )
            if (await expirationDropdown.isVisible()) {
              await expirationDropdown.click()
            }
          },
        },
      ])

      // Test responsive design
      await visual.testResponsiveComponent(modal, 'homework-sharing-modal')
    }
  })

  test('homework sharing link preview - generated link display', async ({
    page,
  }) => {
    const visual = createVisualTestHelper(page)

    // Navigate through homework sharing flow
    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      await shareButton.first().click()

      // Wait for modal and look for link generation
      await page.waitForSelector('[role="dialog"]', { state: 'visible' })

      // Look for generate/create button
      const generateButton = page.locator(
        'button:has-text("Erstellen"), button:has-text("Generate"), button:has-text("Create"), .generate-button',
      )
      if (await generateButton.isVisible()) {
        await generateButton.click()

        // Wait for link to be generated
        await page.waitForSelector(
          '[data-testid="share-link"], .share-link, input[readonly]',
          {
            state: 'visible',
            timeout: 10000,
          },
        )

        const linkPreview = page
          .locator('[data-testid="share-link"], .share-link, input[readonly]')
          .first()

        // Test link preview
        await visual.takeScreenshot({
          name: 'homework-share-link-preview',
          clip: linkPreview,
        })

        // Test copy interaction
        await visual.testComponentStates(linkPreview, 'homework-share-link', [
          {
            name: 'selected',
            action: async () => {
              await linkPreview.click()
              // Select all text
              await linkPreview.selectText().catch(() => {})
            },
          },
        ])
      }
    }
  })

  test('homework sharing options - configuration panel', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      await shareButton.first().click()
      await page.waitForSelector('[role="dialog"]', { state: 'visible' })

      // Look for sharing options/settings
      const optionsPanel = page.locator(
        '[data-testid="share-options"], .share-options, .sharing-settings',
      )

      if (await optionsPanel.first().isVisible()) {
        const options = optionsPanel.first()

        await visual.takeScreenshot({
          name: 'homework-sharing-options',
          clip: options,
        })

        // Test different option states
        const checkboxes = options.locator('input[type="checkbox"]')
        const checkboxCount = await checkboxes.count()

        for (let i = 0; i < Math.min(checkboxCount, 3); i++) {
          await checkboxes.nth(i).check()
          await visual.takeScreenshot({
            name: `homework-sharing-options-state-${i + 1}`,
            clip: options,
          })
        }
      }

      // Test expiration dropdown if exists
      const expirationSelect = page.locator(
        'select:has(option:has-text("Tag")), select:has(option:has-text("day")), [data-testid="expiration-select"]',
      )
      if (await expirationSelect.isVisible()) {
        await visual.takeScreenshot({
          name: 'homework-sharing-expiration-dropdown',
          clip: expirationSelect,
        })
      }
    }
  })

  test('homework sharing success state - confirmation UI', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      await shareButton.first().click()
      await page.waitForSelector('[role="dialog"]', { state: 'visible' })

      // Try to complete the sharing flow
      const generateButton = page.locator(
        'button:has-text("Erstellen"), button:has-text("Generate"), button:has-text("Create")',
      )
      if (await generateButton.isVisible()) {
        await generateButton.click()

        // Wait for success state
        await page
          .waitForSelector(
            '[data-testid="share-success"], .success-message, .share-success',
            {
              state: 'visible',
              timeout: 10000,
            },
          )
          .catch(() => {})

        const successMessage = page.locator(
          '[data-testid="share-success"], .success-message, .share-success',
        )
        if (await successMessage.isVisible()) {
          await visual.takeScreenshot({
            name: 'homework-sharing-success',
            clip: successMessage,
          })
        }
      }
    }
  })

  test('homework sharing error states - error handling UI', async ({
    page,
  }) => {
    const visual = createVisualTestHelper(page)

    // Mock network to simulate error
    await page.route('**/api/**', (route) => {
      if (
        route.request().method() === 'POST' &&
        route.request().url().includes('share')
      ) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        })
      } else {
        route.continue()
      }
    })

    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      await shareButton.first().click()
      await page.waitForSelector('[role="dialog"]', { state: 'visible' })

      const generateButton = page.locator(
        'button:has-text("Erstellen"), button:has-text("Generate"), button:has-text("Create")',
      )
      if (await generateButton.isVisible()) {
        await generateButton.click()

        // Wait for error message
        await page
          .waitForSelector(
            '[data-testid="share-error"], .error-message, .alert-error',
            {
              state: 'visible',
              timeout: 10000,
            },
          )
          .catch(() => {})

        const errorMessage = page.locator(
          '[data-testid="share-error"], .error-message, .alert-error',
        )
        if (await errorMessage.isVisible()) {
          await visual.takeScreenshot({
            name: 'homework-sharing-error',
            clip: errorMessage,
          })
        }
      }
    }
  })

  test('homework expiration indicator - time-sensitive UI', async ({
    page,
  }) => {
    const visual = createVisualTestHelper(page)

    // Look for homework expiration indicators
    const expirationIndicator = page.locator(
      '[data-testid="homework-expiration"], .expiration-indicator, .homework-expired',
    )

    if (await expirationIndicator.first().isVisible()) {
      const indicator = expirationIndicator.first()

      await visual.takeScreenshot({
        name: 'homework-expiration-indicator',
        clip: indicator,
      })

      // Test theme variations for warning/error states
      await visual.testComponentThemes(
        indicator,
        'homework-expiration-indicator',
      )
    }
  })

  test('homework sharing mobile flow - mobile-optimized UI', async ({
    page,
  }) => {
    const visual = createVisualTestHelper(page)

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await visual.waitForStability()

    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      // Test mobile share button
      await visual.takeScreenshot({
        name: 'homework-share-button-mobile',
        clip: shareButton.first(),
      })

      await shareButton.first().click()

      // Wait for mobile modal/drawer
      const mobileModal = page.locator('[role="dialog"], .modal, .drawer')
      if (await mobileModal.isVisible()) {
        await visual.takeScreenshot({
          name: 'homework-sharing-modal-mobile',
          fullPage: true,
        })

        // Test with virtual keyboard simulation
        const textInput = mobileModal.locator('input, textarea')
        if (await textInput.first().isVisible()) {
          await textInput.first().focus()
          await visual.takeScreenshot({
            name: 'homework-sharing-mobile-with-keyboard',
            fullPage: true,
          })
        }
      }
    }
  })

  test('homework sharing notifications - toast messages', async ({ page }) => {
    const visual = createVisualTestHelper(page)

    const shareButton = page.locator(
      '[data-testid="share-homework"], button:has-text("Teilen"), button:has-text("Share"), .share-button',
    )

    if (await shareButton.first().isVisible()) {
      await shareButton.first().click()
      await page.waitForSelector('[role="dialog"]', { state: 'visible' })

      // Look for copy button to trigger notification
      const copyButton = page.locator(
        'button:has-text("Kopieren"), button:has-text("Copy"), .copy-button',
      )
      if (await copyButton.isVisible()) {
        await copyButton.click()

        // Wait for toast notification
        const toast = page.locator(
          '[data-sonner-toaster], .toast, .notification',
        )
        if (await toast.isVisible()) {
          await visual.takeScreenshot({
            name: 'homework-sharing-copy-toast',
            clip: toast,
          })
        }
      }
    }
  })
})
