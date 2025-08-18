import { test as teardown } from '@playwright/test'
import { rmSync } from 'fs'
import path from 'path'

/**
 * Cross-browser test cleanup
 * Removes authentication files and temporary data
 */
teardown('cleanup cross-browser test data', async ({ browser }) => {
  console.log(`Cleaning up cross-browser tests for ${browser.browserType().name()}`)
  
  try {
    // Clean up authentication files
    const authPath = path.resolve('./tests/cross-browser/.auth/user.json')
    try {
      rmSync(authPath, { force: true })
      console.log('✅ Cleaned up cross-browser authentication files')
    } catch (error) {
      console.log('ℹ️ No authentication files to clean up')
    }
    
    // Clean up any browser-specific temporary files
    const tempPaths = [
      './tests/cross-browser/temp',
      './tests/cross-browser/downloads',
    ]
    
    tempPaths.forEach((tempPath) => {
      try {
        rmSync(path.resolve(tempPath), { recursive: true, force: true })
      } catch (error) {
        // Ignore cleanup errors for non-existent paths
      }
    })
    
    console.log(`✅ Cross-browser cleanup complete for ${browser.browserType().name()}`)
  } catch (error) {
    console.error(`⚠️ Cross-browser cleanup warning for ${browser.browserType().name()}:`, error)
    // Don't fail the build for cleanup issues
  }
})

teardown.describe.configure({ mode: 'parallel' })