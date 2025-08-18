import { test as teardown } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import supabaseAdmin from '../utils/supabaseAdmin'
import { stripeClient } from '../utils/stripeClient'

/**
 * Cleanup test data created for edge-case visual regression tests
 * Uses CASCADE DELETE for efficient cleanup and Stripe test clock deletion
 */
teardown('cleanup edge-case test data', async () => {
  const authDir = './tests/edge-cases/.auth'
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
          console.log('Deleted test user successfully (CASCADE handled all related data)')
        }
      }

      console.log('Edge-case test data cleaned up successfully')
    } catch (error) {
      console.error('Error during edge-case test cleanup:', error)
    }
  } else {
    console.log('No test data file found for cleanup')
  }

  // Clean up auth files
  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true })
    console.log('Cleaned up auth directory')
  }
})
