import { test as teardown } from '@playwright/test'

const authFile = 'tests/performance/.auth/user.json'

/**
 * Performance Test Teardown
 *
 * Cleans up after performance tests by removing authentication files
 * and clearing any test data that might affect subsequent test runs.
 */
teardown('cleanup performance tests', async ({ page }) => {
  console.log('🧹 Cleaning up performance test artifacts...')

  try {
    // Clear any performance test data from the browser
    await page.goto('/')

    await page.evaluate(() => {
      // Clear all session storage
      sessionStorage.clear()

      // Clear performance test specific items from localStorage
      const keysToRemove = [
        'performance_test_mode',
        'performance_test_lessons',
        'performance_metrics',
        'large_dataset_test',
        'memory_test_data',
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })
    })

    console.log('✅ Browser storage cleared')
  } catch (error) {
    console.log('⚠️ Could not clear browser storage:', error)
  }

  console.log('✅ Performance test cleanup completed')
})
