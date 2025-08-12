import { test as setup } from '@playwright/test'
import { loginUser } from '../utils/loginUser'
import { TestUser } from '../utils/TestUser'

/**
 * Setup authentication for visual regression tests
 */
setup('authenticate for visual tests', async ({ page, context }) => {
  // Create a test user with subscription row for proper UI display
  const { email, password } = await TestUser.createGeneralUser()
  
  // Login with the created test user
  await loginUser(page, {
    email,
    password, 
    skipOnboarding: true
  })

  // Wait for application to be fully loaded
  await page.waitForSelector('[data-testid="dashboard"], .dashboard, main', { 
    state: 'visible',
    timeout: 30000 
  })

  // Ensure stable state for visual testing
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  // Save authentication state
  await context.storageState({ path: './tests/visual-regression/.auth/user.json' })
})