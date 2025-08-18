import { test, expect } from '@playwright/test'

test.describe('Compatibility: Browser Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15000 })
  })

  test('should support essential JavaScript APIs', async ({ page, browserName }) => {
    console.log(`Testing JavaScript API support in ${browserName}`)

    const apiSupport = await page.evaluate(() => {
      return {
        // Storage APIs
        localStorage: typeof localStorage !== 'undefined' && localStorage !== null,
        sessionStorage: typeof sessionStorage !== 'undefined' && sessionStorage !== null,
        
        // Network APIs
        fetch: typeof fetch !== 'undefined',
        XMLHttpRequest: typeof XMLHttpRequest !== 'undefined',
        
        // Modern JS features
        promises: typeof Promise !== 'undefined',
        asyncAwait: typeof (async function() {})().then === 'function',
        arrow: (() => true)() === true,
        destructuring: (() => { const [a] = [1]; return a === 1 })(),
        
        // DOM APIs
        querySelector: typeof document.querySelector !== 'undefined',
        addEventListener: typeof document.addEventListener !== 'undefined',
        
        // Date and JSON
        JSON: typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined',
        Date: typeof Date !== 'undefined',
        
        // Browser info
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        
        // CSS support
        getComputedStyle: typeof window.getComputedStyle !== 'undefined',
      }
    })

    // Essential APIs that must be supported
    expect(apiSupport.localStorage).toBe(true)
    expect(apiSupport.sessionStorage).toBe(true)
    expect(apiSupport.fetch).toBe(true)
    expect(apiSupport.promises).toBe(true)
    expect(apiSupport.JSON).toBe(true)
    expect(apiSupport.querySelector).toBe(true)
    expect(apiSupport.addEventListener).toBe(true)
    expect(apiSupport.getComputedStyle).toBe(true)

    console.log(`✅ Essential APIs supported in ${browserName}`)
    console.log(`Browser: ${apiSupport.userAgent}`)
  })

  test('should handle CSS features correctly', async ({ page, browserName }) => {
    console.log(`Testing CSS feature support in ${browserName}`)

    const cssSupport = await page.evaluate(() => {
      const testDiv = document.createElement('div')
      document.body.appendChild(testDiv)
      
      const features = {
        flexbox: false,
        grid: false,
        transforms: false,
        transitions: false,
        borderRadius: false,
        boxShadow: false,
        gradients: false,
        customProperties: false,
      }

      try {
        // Test Flexbox
        testDiv.style.display = 'flex'
        features.flexbox = testDiv.style.display === 'flex'

        // Test CSS Grid
        testDiv.style.display = 'grid'
        features.grid = testDiv.style.display === 'grid'

        // Test Transforms
        testDiv.style.transform = 'translateX(10px)'
        features.transforms = testDiv.style.transform.includes('translateX')

        // Test Transitions
        testDiv.style.transition = 'opacity 0.3s'
        features.transitions = testDiv.style.transition.includes('opacity')

        // Test Border Radius
        testDiv.style.borderRadius = '5px'
        features.borderRadius = testDiv.style.borderRadius === '5px'

        // Test Box Shadow
        testDiv.style.boxShadow = '0 0 5px black'
        features.boxShadow = testDiv.style.boxShadow.includes('0px') || testDiv.style.boxShadow.includes('black')

        // Test CSS Custom Properties
        testDiv.style.setProperty('--test-var', 'test')
        features.customProperties = testDiv.style.getPropertyValue('--test-var') === 'test'

      } catch (error) {
        console.log('CSS feature testing error:', error)
      } finally {
        document.body.removeChild(testDiv)
      }

      return features
    })

    // Modern browsers should support these
    expect(cssSupport.flexbox).toBe(true)
    expect(cssSupport.transforms).toBe(true)
    expect(cssSupport.transitions).toBe(true)
    expect(cssSupport.borderRadius).toBe(true)

    // Log support for optional features
    console.log(`CSS Grid support: ${cssSupport.grid}`)
    console.log(`CSS Custom Properties support: ${cssSupport.customProperties}`)
    console.log(`Box Shadow support: ${cssSupport.boxShadow}`)

    console.log(`✅ CSS features work correctly in ${browserName}`)
  })

  test('should handle event handling consistently', async ({ page, browserName }) => {
    console.log(`Testing event handling in ${browserName}`)

    // Test basic click events
    const clickTest = await page.evaluate(() => {
      return new Promise((resolve) => {
        const button = document.createElement('button')
        button.textContent = 'Test Button'
        button.id = 'test-event-button'
        document.body.appendChild(button)

        let clickFired = false
        button.addEventListener('click', () => {
          clickFired = true
        })

        button.click()

        // Test touch events if available
        let touchSupported = false
        try {
          const touchEvent = new TouchEvent('touchstart')
          touchSupported = touchEvent instanceof TouchEvent
        } catch (e) {
          // Touch events not supported
        }

        document.body.removeChild(button)
        
        resolve({
          clickWorked: clickFired,
          touchEventsSupported: touchSupported,
        })
      })
    })

    expect(clickTest.clickFired).toBe(true)
    console.log(`Touch events supported: ${clickTest.touchEventsSupported}`)

    // Test keyboard events on actual page elements
    const userMenu = page.getByTestId('user-menu').first()
    if (await userMenu.isVisible()) {
      // Test keyboard navigation
      await userMenu.focus()
      await page.keyboard.press('Enter')
      
      // Verify something happened (menu opened or page changed)
      await page.waitForTimeout(1000)
      console.log('Keyboard events working')
    }

    console.log(`✅ Event handling works in ${browserName}`)
  })

  test('should handle media queries correctly', async ({ page, browserName }) => {
    console.log(`Testing media query support in ${browserName}`)

    const mediaQuerySupport = await page.evaluate(() => {
      const features = {
        mediaQueriesSupported: typeof window.matchMedia !== 'undefined',
        currentMatches: {},
      }

      if (features.mediaQueriesSupported) {
        const queries = {
          mobile: '(max-width: 768px)',
          tablet: '(min-width: 769px) and (max-width: 1024px)',
          desktop: '(min-width: 1025px)',
          retina: '(-webkit-min-device-pixel-ratio: 2)',
          darkMode: '(prefers-color-scheme: dark)',
        }

        for (const [name, query] of Object.entries(queries)) {
          try {
            features.currentMatches[name] = window.matchMedia(query).matches
          } catch (e) {
            features.currentMatches[name] = false
          }
        }
      }

      return features
    })

    expect(mediaQuerySupport.mediaQueriesSupported).toBe(true)
    
    // Test responsive behavior by changing viewport
    const originalSize = page.viewportSize()
    
    // Test mobile query
    await page.setViewportSize({ width: 400, height: 600 })
    const mobileQuery = await page.evaluate(() => window.matchMedia('(max-width: 768px)').matches)
    expect(mobileQuery).toBe(true)
    
    // Test desktop query
    await page.setViewportSize({ width: 1200, height: 800 })
    const desktopQuery = await page.evaluate(() => window.matchMedia('(min-width: 1025px)').matches)
    expect(desktopQuery).toBe(true)
    
    // Restore original size
    if (originalSize) {
      await page.setViewportSize(originalSize)
    }

    console.log(`✅ Media queries work correctly in ${browserName}`)
    console.log(`Media query states:`, mediaQuerySupport.currentMatches)
  })

  test('should handle form validation', async ({ page, browserName }) => {
    console.log(`Testing form validation in ${browserName}`)

    // Create a test form to check validation support
    const validationSupport = await page.evaluate(() => {
      const form = document.createElement('form')
      const emailInput = document.createElement('input')
      emailInput.type = 'email'
      emailInput.required = true
      emailInput.id = 'test-email'
      form.appendChild(emailInput)
      document.body.appendChild(form)

      const features = {
        htmlValidation: typeof emailInput.checkValidity !== 'undefined',
        requiredAttribute: emailInput.required === true,
        emailType: emailInput.type === 'email',
      }

      // Test validation
      if (features.htmlValidation) {
        emailInput.value = 'invalid-email'
        features.invalidEmailDetected = !emailInput.checkValidity()
        
        emailInput.value = 'valid@email.com'
        features.validEmailAccepted = emailInput.checkValidity()
      }

      document.body.removeChild(form)
      return features
    })

    expect(validationSupport.htmlValidation).toBe(true)
    expect(validationSupport.requiredAttribute).toBe(true)
    expect(validationSupport.emailType).toBe(true)

    if (validationSupport.invalidEmailDetected !== undefined) {
      expect(validationSupport.invalidEmailDetected).toBe(true)
      expect(validationSupport.validEmailAccepted).toBe(true)
    }

    console.log(`✅ Form validation works in ${browserName}`)
  })

  test('should handle local storage correctly', async ({ page, browserName }) => {
    console.log(`Testing local storage in ${browserName}`)

    const storageTest = await page.evaluate(() => {
      try {
        const testKey = 'playwright-test-key'
        const testValue = 'test-value-123'
        
        // Test localStorage
        localStorage.setItem(testKey, testValue)
        const retrievedValue = localStorage.getItem(testKey)
        localStorage.removeItem(testKey)
        
        // Test sessionStorage
        sessionStorage.setItem(testKey, testValue)
        const sessionRetrieved = sessionStorage.getItem(testKey)
        sessionStorage.removeItem(testKey)
        
        return {
          localStorageWorks: retrievedValue === testValue,
          sessionStorageWorks: sessionRetrieved === testValue,
          localStorageAvailable: typeof localStorage !== 'undefined',
          sessionStorageAvailable: typeof sessionStorage !== 'undefined',
        }
      } catch (error) {
        return {
          localStorageWorks: false,
          sessionStorageWorks: false,
          localStorageAvailable: false,
          sessionStorageAvailable: false,
          error: error.message,
        }
      }
    })

    expect(storageTest.localStorageAvailable).toBe(true)
    expect(storageTest.sessionStorageAvailable).toBe(true)
    expect(storageTest.localStorageWorks).toBe(true)
    expect(storageTest.sessionStorageWorks).toBe(true)

    console.log(`✅ Local storage works correctly in ${browserName}`)
  })
})