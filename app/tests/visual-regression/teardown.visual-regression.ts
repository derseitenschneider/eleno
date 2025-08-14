import fs from 'node:fs'
import path from 'node:path'
import { test as teardown } from '@playwright/test'
import { rmdir } from 'fs/promises'
import { existsSync } from 'fs'
import { resolveJoin } from '../utils/resolveJoin'
import { stripeClient } from '../utils/stripeClient'
import supabaseAdmin from '../utils/supabaseAdmin'

type UserData = {
  userId: string
  customerId: string
  clockId: string
}

const dataPath = resolveJoin('../data/general')

/**
 * Cleanup visual regression test artifacts
 */
teardown('cleanup visual regression artifacts', async () => {
  // Clean up TestUser data
  if (existsSync(dataPath)) {
    const files = fs
      .readdirSync(dataPath)
      .filter((file) => file.endsWith('.json'))

    for (const file of files) {
      const filePath = path.join(dataPath, file)
      try {
        const data = fs.readFileSync(filePath, 'utf8')
        const { userId, clockId } = JSON.parse(data) as UserData

        // Deleting the clock will delete all customers and subscriptions
        // attached to it.
        await stripeClient.testHelpers.testClocks.del(clockId)

        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
        if (error) {
          throw new Error(
            `Could not delete db user ${userId}: ${error.message}`,
          )
        }

        fs.unlinkSync(filePath)
      } catch (error) {
        console.error(`Error cleaning up ${file}:`, error)
      }
    }
  }

  // Clean up authentication files
  const authDir = './tests/visual-regression/.auth'
  if (existsSync(authDir)) {
    await rmdir(authDir, { recursive: true }).catch(() => {
      // Ignore errors if directory doesn't exist
    })
  }
})
