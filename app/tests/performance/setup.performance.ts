import { test as setup, expect } from '@playwright/test'
import { loginUser } from '../utils/loginUser'

const authFile = 'tests/performance/.auth/user.json'

/**
 * Performance Test Setup
 *
 * Sets up authentication and initial state for performance testing.
 * This setup runs once before all performance tests.
 */
setup('authenticate for performance tests', async ({ page }) => {
  console.log('🚀 Setting up authentication for performance tests...')

  // Login user for performance tests
  await loginUser(page)

  // Wait for dashboard to be fully loaded
  await expect(page.getByRole('heading', { name: 'Quick Links' })).toBeVisible({
    timeout: 30000,
  })

  // Ensure all navigation elements are loaded
  await expect(page.getByTestId('lesson-nav-sidebar')).toBeEnabled({
    timeout: 30000,
  })

  // Save authentication state
  await page.context().storageState({ path: authFile })

  console.log('✅ Performance test authentication setup complete')
})

setup('clear performance data', async ({ page }) => {
  console.log('🧹 Clearing previous performance test data...')

  // Clear any existing performance test data
  await page.evaluate(() => {
    // Clear session storage
    sessionStorage.clear()

    // Clear any performance test flags
    localStorage.removeItem('performance_test_mode')
    localStorage.removeItem('performance_test_lessons')
    localStorage.removeItem('performance_metrics')
  })

  console.log('✅ Performance test data cleared')
})
