import { test as setup } from '@playwright/test'
import { loginUser } from '../utils/loginUser'

/**
 * Cross-browser test setup
 * Creates authenticated user sessions for cross-browser testing
 */
setup('authenticate user for cross-browser tests', async ({ page, browser }) => {
  console.log(`Setting up cross-browser tests with ${browser.browserType().name()}`)
  
  // Use a consistent test user for all cross-browser tests
  const testUser = {
    email: process.env.CROSS_BROWSER_TEST_EMAIL || 'cross-browser-test@eleno.net',
    password: process.env.CROSS_BROWSER_TEST_PASSWORD || 'crossbrowsertest123',
  }
  
  try {
    await loginUser(page, testUser.email, testUser.password)
    
    // Wait for the main dashboard to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="main-navigation"]', { timeout: 10000 })
    
    // Save authentication state
    await page.context().storageState({
      path: './tests/cross-browser/.auth/user.json',
    })
    
    console.log(`✅ Cross-browser authentication setup complete for ${browser.browserType().name()}`)
  } catch (error) {
    console.error(`❌ Cross-browser setup failed for ${browser.browserType().name()}:`, error)
    throw error
  }
})

setup.describe.configure({ mode: 'parallel' })