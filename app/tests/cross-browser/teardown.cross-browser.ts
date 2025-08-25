import * as fs from 'node:fs'
import * as path from 'node:path'
import { test as teardown } from '@playwright/test'
import { stripeClient } from '../utils/stripeClient'
import supabaseAdmin from '../utils/supabaseAdmin'

/**
 * Cross-browser test cleanup
 * Removes authentication files and cleans up test data from Supabase
 * Uses CASCADE DELETE for efficient cleanup and Stripe test clock deletion
 */
teardown('cleanup cross-browser test data', async ({ browser }) => {
  console.log(
    `Cleaning up cross-browser tests for ${browser.browserType().name()}`,
  )

  const authDir = './tests/cross-browser/.auth'
  const testDataPath = path.join(authDir, 'test-data.json')

  if (fs.existsSync(testDataPath)) {
    try {
      const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'))
      console.log('Cleaning up test data for user:', testData.userId)

      // Step 1: Delete Stripe test clock (this also deletes the customer and subscriptions)
      if (testData.clockId) {
        try {
          await stripeClient.testHelpers.testClocks.del(testData.clockId)
          console.log('Deleted Stripe test clock:', testData.clockId)
        } catch (error) {
          console.warn('Error deleting Stripe test clock:', error)
        }
      }

      // Step 2: Delete user (CASCADE DELETE handles all related data automatically)
      if (testData.userId) {
        const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(
          testData.userId,
        )

        if (userError) {
          console.error('Error deleting user:', userError.message)
        } else {
          console.log(
            'Deleted test user successfully (CASCADE handled all related data)',
          )
        }
      }

      console.log('Cross-browser test data cleaned up successfully')
    } catch (error) {
      console.error('Error during cross-browser test cleanup:', error)
    }
  } else {
    console.log('No test data file found for cleanup')
  }

  // Clean up auth files and temporary directories
  try {
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true })
      console.log('Cleaned up auth directory')
    }

    // Clean up any browser-specific temporary files
    const tempPaths = [
      './tests/cross-browser/temp',
      './tests/cross-browser/downloads',
    ]

    tempPaths.forEach((tempPath) => {
      try {
        fs.rmSync(path.resolve(tempPath), { recursive: true, force: true })
      } catch (error) {
        // Ignore cleanup errors for non-existent paths
      }
    })

    console.log(
      `✅ Cross-browser cleanup complete for ${browser.browserType().name()}`,
    )
  } catch (error) {
    console.error(
      `⚠️ Cross-browser cleanup warning for ${browser.browserType().name()}:`,
      error,
    )
    // Don't fail the build for cleanup issues
  }
})

teardown.describe.configure({ mode: 'parallel' })
