import { test as teardown } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { stripeClient } from '../utils/stripeClient'
import supabaseAdmin from '../utils/supabaseAdmin'
import { resolveJoin } from '../utils/resolveJoin'

type UserData = {
  userId: string
  customerId: string
  clockId: string
}

const dataPath = resolveJoin('../data/share-homework')

teardown('cleanup for share-homework project.', async () => {
  console.log('===================================================')
  console.log('Start cleanup...')
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
      console.log(`Cleanup completed for ${file}`)
    } catch (error) {
      console.error(`Error cleaning up ${file}:`, error)
    }
  }
  console.log('All cleanup tasks for share-homework project completed!')
  console.log('===================================================')
})
