import * as fs from 'node:fs'
import * as path from 'node:path'
import { test as setup } from '@playwright/test'
import { loginUser } from '../utils/loginUser'
import { TestUser } from '../utils/TestUser'

/**
 * Cross-browser test setup
 * Creates authenticated user sessions for cross-browser testing
 * Uses TestUser class with lifetime subscription for reliable testing
 * Based on proven edge-case test setup pattern
 */
setup(
  'authenticate user for cross-browser tests',
  async ({ page, context, browser }) => {
    console.log(
      `Setting up cross-browser tests with ${browser.browserType().name()}`,
    )

    try {
      // Set consistent system time for reproducible test results
      // This ensures subscription badges show same remaining days
      await page.clock.install({ time: new Date('2025-08-15T12:00:00.000Z') })

      // Create a test user with lifetime subscription for cross-browser tests
      // This avoids trial expiration issues and provides consistent test data
      const testUser = new TestUser({
        userflow: 'lifetime-user',
        project: 'general',
      })

      // Initialize user with default student and test data
      await testUser.init()

      // Login with the created test user using proper utility
      await loginUser(page, {
        email: testUser.email,
        password: testUser.password,
        skipOnboarding: true,
      })

      // Wait for application to be fully loaded
      await page.waitForSelector('[data-testid="dashboard-header"]', {
        state: 'visible',
        timeout: 30000,
      })

      // Ensure stable state
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      // Store test data IDs for cleanup
      const authDir = './tests/cross-browser/.auth'
      fs.mkdirSync(authDir, { recursive: true })

      const testData = {
        userId: (testUser as any).user?.id,
        clockId: (testUser as any).customer?.test_clock,
        testUserEmail: testUser.email,
        defaultStudentId: testUser.studentId,
      }

      fs.writeFileSync(
        path.join(authDir, 'test-data.json'),
        JSON.stringify(testData, null, 2),
      )

      // Save authentication state
      await context.storageState({
        path: './tests/cross-browser/.auth/user.json',
      })

      console.log(
        `✅ Cross-browser authentication setup complete for ${browser.browserType().name()}`,
      )
    } catch (error) {
      console.error(
        `❌ Cross-browser setup failed for ${browser.browserType().name()}:`,
        error,
      )
      throw error
    }
  },
)

setup.describe.configure({ mode: 'parallel' })
