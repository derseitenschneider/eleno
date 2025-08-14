import { test as teardown } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

teardown('cleanup accessibility test artifacts', async ({ page }) => {
  console.log('Starting accessibility test cleanup...')

  try {
    // Clear any test data that may have been created during accessibility tests
    await page.goto('/')

    // Clear localStorage and sessionStorage
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })

    // Clear cookies
    const context = page.context()
    await context.clearCookies()

    console.log('Browser storage cleared successfully')
  } catch (error) {
    console.log('Error clearing browser storage:', error)
  }

  try {
    // Generate accessibility test report
    const reportData = {
      timestamp: new Date().toISOString(),
      testSuite: 'accessibility',
      summary:
        'Accessibility tests completed. Check individual test outputs for detailed findings.',
      recommendations: [
        'Review console logs for specific accessibility improvements',
        'Address any ARIA label issues identified in tests',
        'Verify color contrast meets WCAG AA standards',
        'Ensure keyboard navigation works across all interactive elements',
        'Add skip links for better keyboard navigation',
        'Implement proper focus management in modal dialogs',
        'Ensure form validation errors are announced to screen readers',
      ],
      wcagGuidelines: {
        Perceivable:
          'Text alternatives, captions, color contrast, resizable text',
        Operable: 'Keyboard accessible, no seizures, user control of timing',
        Understandable:
          'Readable text, predictable functionality, input assistance',
        Robust: 'Compatible with assistive technologies',
      },
    }

    // Write accessibility report
    const reportPath = path.join(__dirname, 'accessibility-test-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))

    console.log(`Accessibility test report saved to: ${reportPath}`)
  } catch (error) {
    console.log('Error generating accessibility report:', error)
  }

  console.log('Accessibility test cleanup completed')
})

// Helper function to clean up authentication files if needed
teardown('cleanup accessibility auth files', async () => {
  try {
    const authDir = path.join(__dirname, '.auth')
    const authFile = path.join(authDir, 'user.json')

    if (fs.existsSync(authFile)) {
      // Keep auth file for future tests, just log its existence
      console.log('Accessibility auth file maintained for future test runs')
    }
  } catch (error) {
    console.log('Error handling auth cleanup:', error)
  }
})
