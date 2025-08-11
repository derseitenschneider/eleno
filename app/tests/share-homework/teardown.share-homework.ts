import fs from 'node:fs'
import path from 'node:path'
import { test as teardown } from '@playwright/test'
import { resolveJoin } from '../utils/resolveJoin'
import { stripeClient } from '../utils/stripeClient'
import supabaseAdmin from '../utils/supabaseAdmin'

type UserData = {
  userId: string
  customerId: string
  clockId: string
}

const dataPath = resolveJoin('../data/share-homework')

teardown('cleanup for share-homework project.', async () => {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith('.json'))

  for (const file of files) {
    const filePath = path.join(dataPath, file)
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      const { userId, clockId } = JSON.parse(data) as UserData

      // Deleting the clock will delete all customers and subscritions
      // attached to it.
      await stripeClient.testHelpers.testClocks.del(clockId)

      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error) {
        throw new Error(`Could not delete db user ${userId}: ${error.message}`)
      }

      fs.unlinkSync(filePath)
    } catch (error) {
      console.error(`Error cleaning up ${file}:`, error)
    }
  }
})
