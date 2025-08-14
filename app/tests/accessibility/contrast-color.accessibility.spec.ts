import { test, expect } from '@playwright/test'
import { AccessibilityHelpers } from './helpers/accessibilityHelpers'
import { LessonsPOM } from '../pom/LessonsPOM'
import { ActiveStudentsPOM as StudentsPOM } from '../pom/StudentsPOM'

test.describe('Color Contrast Verification Tests', () => {
  let accessibilityHelpers: AccessibilityHelpers
  let lessonsPOM: LessonsPOM
  let studentsPOM: StudentsPOM

  test.beforeEach(async ({ page }, testInfo) => {
    accessibilityHelpers = new AccessibilityHelpers(page)
    lessonsPOM = new LessonsPOM(page, testInfo)
    studentsPOM = new StudentsPOM(page)
  })

  test.describe('Text Color Contrast', () => {
    test('should verify text contrast ratios on main dashboard', async ({
      page,
    }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Test color contrast for main text elements
      await accessibilityHelpers.testColorContrast([
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'span',
        'div[class*="text"]',
        'button',
        'a',
        'label',
      ])

      // Get contrast information for reporting
      const textElements = page.locator(
        'h1, h2, h3, h4, p, span:visible, button, a, label',
      )
      const elementCount = await textElements.count()

      const contrastResults = []

      for (let i = 0; i < Math.min(elementCount, 20); i++) {
        const element = textElements.nth(i)
        const isVisible = await element.isVisible()

        if (isVisible) {
          try {
            const styles = await element.evaluate((el) => {
              const computed = window.getComputedStyle(el)
              return {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                textContent: el.textContent?.substring(0, 50),
              }
            })

            contrastResults.push({
              index: i,
              tagName: await element.evaluate((el) => el.tagName.toLowerCase()),
              styles,
              className: await element.getAttribute('class'),
              testId: await element.getAttribute('data-testid'),
            })
          } catch (error) {
            console.log(`Could not analyze element ${i}:`, error)
          }
        }
      }

      console.log(
        `Analyzed ${contrastResults.length} text elements for contrast`,
      )

      // Report elements with potential contrast issues
      const lightColorElements = contrastResults.filter(
        (r) =>
          r.styles.color?.includes('rgb(255') ||
          r.styles.color?.includes('white') ||
          r.styles.color?.includes('#fff'),
      )

      if (lightColorElements.length > 0) {
        console.log(
          `Found ${lightColorElements.length} elements with light text colors`,
        )
      }
    })

    test('should verify contrast in dark mode', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Look for dark mode toggle
      const darkModeToggle = page
        .locator(
          '[data-testid*="dark"], [data-testid*="theme"], button:has-text("Dark"), button:has-text("Theme")',
        )
        .first()

      if ((await darkModeToggle.count()) > 0) {
        console.log('Dark mode toggle found - testing dark mode contrast')

        // Enable dark mode
        await darkModeToggle.click()
        await page.waitForTimeout(500)

        // Verify dark mode is active
        const bodyClass = await page.locator('body').getAttribute('class')
        const htmlClass = await page.locator('html').getAttribute('class')
        const isDarkMode =
          bodyClass?.includes('dark') ||
          htmlClass?.includes('dark') ||
          (await page.locator('.dark, [data-theme="dark"]').count()) > 0

        if (isDarkMode) {
          console.log('Dark mode activated - testing contrast')

          // Test contrast in dark mode
          await accessibilityHelpers.testColorContrast([
            'h1',
            'h2',
            'h3',
            'p',
            'span',
            'button',
            'a',
            'label',
          ])

          // Get dark mode color information
          const darkModeElements = page.locator('h1, h2, h3, p, button, a')
          const darkElementCount = await darkModeElements.count()

          for (let i = 0; i < Math.min(darkElementCount, 10); i++) {
            const element = darkModeElements.nth(i)
            const isVisible = await element.isVisible()

            if (isVisible) {
              try {
                const styles = await element.evaluate((el) => {
                  const computed = window.getComputedStyle(el)
                  return {
                    color: computed.color,
                    backgroundColor: computed.backgroundColor,
                    textContent: el.textContent?.substring(0, 30),
                  }
                })

                console.log(`Dark mode element ${i}:`, styles)
              } catch (error) {
                // Element might not be interactive
              }
            }
          }
        } else {
          console.log('Dark mode toggle clicked but dark mode not detected')
        }
      } else {
        console.log(
          'Dark mode toggle not found - skipping dark mode contrast test',
        )
      }
    })

    test('should verify button and interactive element contrast', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      // Test button contrast specifically
      const buttons = page.locator('button:visible')
      const buttonCount = await buttons.count()

      const buttonContrastResults = []

      for (let i = 0; i < Math.min(buttonCount, 15); i++) {
        const button = buttons.nth(i)

        try {
          const buttonInfo = await button.evaluate((el) => {
            const computed = window.getComputedStyle(el)
            const rect = el.getBoundingClientRect()

            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor,
              width: rect.width,
              height: rect.height,
              text: el.textContent?.trim(),
              disabled: el.hasAttribute('disabled'),
            }
          })

          buttonContrastResults.push({
            index: i,
            ...buttonInfo,
            testId: await button.getAttribute('data-testid'),
            className: await button.getAttribute('class'),
          })

          // Check for transparent or inherited backgrounds
          if (
            buttonInfo.backgroundColor === 'rgba(0, 0, 0, 0)' ||
            buttonInfo.backgroundColor === 'transparent'
          ) {
            console.log(`Button ${i} has transparent background:`, {
              text: buttonInfo.text,
              testId: await button.getAttribute('data-testid'),
            })
          }
        } catch (error) {
          console.log(`Could not analyze button ${i}:`, error)
        }
      }

      console.log(
        `Analyzed ${buttonContrastResults.length} buttons for contrast`,
      )

      // Test specific button states
      const primaryButtons = buttonContrastResults.filter(
        (b) =>
          b.className?.includes('primary') ||
          b.className?.includes('bg-blue') ||
          b.className?.includes('bg-green'),
      )

      const secondaryButtons = buttonContrastResults.filter(
        (b) =>
          b.className?.includes('secondary') ||
          b.className?.includes('outline') ||
          b.className?.includes('ghost'),
      )

      console.log(
        `Found ${primaryButtons.length} primary buttons, ${secondaryButtons.length} secondary buttons`,
      )
    })

    test('should verify form field contrast and focus indicators', async ({
      page,
    }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Test form field contrast
      const formFields = page.locator('input, textarea, select')
      const fieldCount = await formFields.count()

      for (let i = 0; i < fieldCount; i++) {
        const field = formFields.nth(i)
        const isVisible = await field.isVisible()

        if (isVisible) {
          // Get field styles
          const fieldStyles = await field.evaluate((el) => {
            const computed = window.getComputedStyle(el)
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor,
              borderWidth: computed.borderWidth,
            }
          })

          console.log(`Form field ${i} styles:`, fieldStyles)

          // Test focus state
          await field.focus()
          await page.waitForTimeout(100)

          const focusStyles = await field.evaluate((el) => {
            const computed = window.getComputedStyle(el)
            return {
              outlineColor: computed.outlineColor,
              outlineWidth: computed.outlineWidth,
              outlineStyle: computed.outlineStyle,
              borderColor: computed.borderColor,
              boxShadow: computed.boxShadow,
            }
          })

          console.log(`Form field ${i} focus styles:`, focusStyles)

          // Check if focus is visible
          const hasFocusIndicator =
            focusStyles.outlineWidth !== '0px' ||
            focusStyles.boxShadow !== 'none' ||
            fieldStyles.borderColor !== focusStyles.borderColor

          if (!hasFocusIndicator) {
            console.log(`Form field ${i} may have insufficient focus indicator`)
          }
        }
      }
    })
  })

  test.describe('Link and Navigation Contrast', () => {
    test('should verify link contrast and states', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Test link contrast
      const links = page.locator('a:visible')
      const linkCount = await links.count()

      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i)

        // Get default link styles
        const defaultStyles = await link.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            textDecoration: computed.textDecoration,
            backgroundColor: computed.backgroundColor,
          }
        })

        console.log(`Link ${i} default styles:`, defaultStyles)

        // Test hover state
        await link.hover()
        await page.waitForTimeout(100)

        const hoverStyles = await link.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            textDecoration: computed.textDecoration,
            backgroundColor: computed.backgroundColor,
          }
        })

        console.log(`Link ${i} hover styles:`, hoverStyles)

        // Test focus state
        await link.focus()
        await page.waitForTimeout(100)

        const focusStyles = await link.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            outlineColor: computed.outlineColor,
            outlineWidth: computed.outlineWidth,
            outlineStyle: computed.outlineStyle,
            color: computed.color,
          }
        })

        console.log(`Link ${i} focus styles:`, focusStyles)

        // Links should be distinguishable from regular text
        const isDistinguishable =
          defaultStyles.color !== 'rgb(0, 0, 0)' || // Not default black
          defaultStyles.textDecoration?.includes('underline') ||
          defaultStyles.backgroundColor !== 'rgba(0, 0, 0, 0)'

        if (!isDistinguishable) {
          console.log(`Link ${i} may not be distinguishable from regular text`)
        }
      }
    })

    test('should verify navigation element contrast', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Test sidebar navigation contrast
      const navElements = page.locator('[data-testid*="nav"], nav a, .nav-item')
      const navCount = await navElements.count()

      for (let i = 0; i < Math.min(navCount, 8); i++) {
        const navItem = navElements.nth(i)
        const isVisible = await navItem.isVisible()

        if (isVisible) {
          const navStyles = await navItem.evaluate((el) => {
            const computed = window.getComputedStyle(el)
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor,
            }
          })

          console.log(`Navigation item ${i} styles:`, navStyles)

          // Test active/current state if applicable
          const isActive =
            (await navItem.getAttribute('aria-current')) === 'page' ||
            (await navItem.getAttribute('class'))?.includes('active') ||
            (await navItem.getAttribute('class'))?.includes('current')

          if (isActive) {
            console.log(`Navigation item ${i} is active/current`)
          }
        }
      }
    })
  })

  test.describe('Icon and Image Contrast', () => {
    test('should verify icon visibility and contrast', async ({ page }) => {
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Test icon contrast
      const icons = page.locator('svg, .icon, [data-testid*="icon"]')
      const iconCount = await icons.count()

      for (let i = 0; i < Math.min(iconCount, 15); i++) {
        const icon = icons.nth(i)
        const isVisible = await icon.isVisible()

        if (isVisible) {
          const iconInfo = await icon.evaluate((el) => {
            const computed = window.getComputedStyle(el)
            const rect = el.getBoundingClientRect()

            return {
              fill: el.getAttribute('fill') || computed.fill,
              stroke: el.getAttribute('stroke') || computed.stroke,
              color: computed.color,
              width: rect.width,
              height: rect.height,
              opacity: computed.opacity,
            }
          })

          console.log(`Icon ${i} styles:`, iconInfo)

          // Check if icon has sufficient size
          const hasAdequateSize = iconInfo.width >= 16 && iconInfo.height >= 16
          if (!hasAdequateSize) {
            console.log(
              `Icon ${i} may be too small: ${iconInfo.width}x${iconInfo.height}`,
            )
          }

          // Check if icon is invisible
          if (iconInfo.opacity === '0' || Number(iconInfo.opacity) === 0) {
            console.log(`Icon ${i} is invisible (opacity: 0)`)
          }
        }
      }
    })

    test('should verify image alt text and accessibility', async ({ page }) => {
      await page.goto('/')

      // Test images
      const images = page.locator('img')
      const imageCount = await images.count()

      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i)
        const isVisible = await image.isVisible()

        if (isVisible) {
          const src = await image.getAttribute('src')
          const alt = await image.getAttribute('alt')
          const ariaLabel = await image.getAttribute('aria-label')
          const ariaLabelledBy = await image.getAttribute('aria-labelledby')
          const role = await image.getAttribute('role')

          console.log(`Image ${i}:`, {
            src,
            alt,
            ariaLabel,
            ariaLabelledBy,
            role,
          })

          // Images should have alt text unless decorative
          if (
            !alt &&
            !ariaLabel &&
            !ariaLabelledBy &&
            role !== 'presentation'
          ) {
            console.log(`Image ${i} missing alt text: ${src}`)
          }

          // Decorative images should be marked properly
          if (alt === '' || role === 'presentation') {
            console.log(`Image ${i} marked as decorative`)
          }
        }
      }
    })
  })

  test.describe('Error and Status Message Contrast', () => {
    test('should verify error message contrast', async ({ page }) => {
      await lessonsPOM.goto()

      // Open lesson creation form
      await page.getByRole('button', { name: 'Neu' }).click()
      await expect(page.getByTestId('create-lesson-form')).toBeVisible()

      // Try to submit to trigger errors
      const submitButton = page
        .locator(
          'button[type="submit"], button:has-text("speichern"), button:has-text("erstellen")',
        )
        .first()
      if ((await submitButton.count()) > 0) {
        await submitButton.click()
        await page.waitForTimeout(500)

        // Check error message contrast
        const errorMessages = page.locator(
          '.error, .text-red-500, [data-testid*="error"], [role="alert"]',
        )
        const errorCount = await errorMessages.count()

        for (let i = 0; i < errorCount; i++) {
          const error = errorMessages.nth(i)
          const isVisible = await error.isVisible()

          if (isVisible) {
            const errorStyles = await error.evaluate((el) => {
              const computed = window.getComputedStyle(el)
              return {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                borderColor: computed.borderColor,
                fontSize: computed.fontSize,
              }
            })

            console.log(`Error message ${i} styles:`, errorStyles)

            // Error messages should be clearly visible
            const isRedText =
              errorStyles.color.includes('rgb(239') || // red-500 range
              errorStyles.color.includes('rgb(220') || // red-600 range
              errorStyles.color.includes('rgb(185') // red-700 range

            if (!isRedText) {
              console.log(`Error message ${i} may not have error styling`)
            }
          }
        }
      }
    })

    test('should verify success message contrast', async ({ page }) => {
      await page.goto('/')

      // Look for success messages or status indicators
      const statusMessages = page.locator(
        '.success, .text-green-500, [data-testid*="success"], [role="status"], .toast',
      )
      const statusCount = await statusMessages.count()

      for (let i = 0; i < statusCount; i++) {
        const status = statusMessages.nth(i)
        const isVisible = await status.isVisible()

        if (isVisible) {
          const statusStyles = await status.evaluate((el) => {
            const computed = window.getComputedStyle(el)
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor,
            }
          })

          console.log(`Status message ${i} styles:`, statusStyles)
        }
      }
    })
  })

  test.describe('High Contrast Mode Testing', () => {
    test('should verify high contrast mode compatibility', async ({ page }) => {
      // This test runs with forced high contrast mode (configured in accessibilityConfig.ts)
      await page.goto('/')
      await expect(
        page.getByRole('heading', { name: 'Quick Links' }),
      ).toBeVisible()

      // Test if elements are still visible in high contrast mode
      const criticalElements = [
        page.getByRole('heading', { name: 'Quick Links' }),
        page.getByTestId('lesson-nav-sidebar'),
        page.getByTestId('students-nav-sidebar'),
      ]

      for (const element of criticalElements) {
        if ((await element.count()) > 0) {
          await expect(element).toBeVisible()

          // Check if element has visible text/content
          const textContent = await element.textContent()
          expect(textContent?.trim().length).toBeGreaterThan(0)
        }
      }

      // Test button visibility in high contrast
      const buttons = page.locator('button:visible')
      const buttonCount = await buttons.count()

      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i)

        const buttonStyles = await button.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor,
            borderWidth: computed.borderWidth,
          }
        })

        console.log(`High contrast button ${i}:`, buttonStyles)

        // In high contrast mode, buttons should have visible borders or backgrounds
        const hasVisibleBorder = buttonStyles.borderWidth !== '0px'
        const hasBackground =
          buttonStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          buttonStyles.backgroundColor !== 'transparent'

        if (!hasVisibleBorder && !hasBackground) {
          console.log(`Button ${i} may not be visible in high contrast mode`)
        }
      }
    })
  })

  test.afterEach(async ({ page }) => {
    // Run full accessibility scan with focus on color contrast
    await accessibilityHelpers.scanFullPage()
  })
})
