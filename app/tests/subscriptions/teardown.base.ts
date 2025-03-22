import { test as teardown } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { stripeClient } from '../utils/stripeClient'
import supabaseAdmin from '../utils/supabaseAdmin'

type UserData = {
  userId: string
  customerId: string
}

const dataPath = path.resolve(path.dirname('.'), './tests/subscriptions/data')

teardown('cleanup all trial users and customers', async () => {
  console.log('===================================================')
  console.log('Start cleanup...')
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith('.json'))

  for (const file of files) {
    const filePath = path.join(dataPath, file)
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      const { userId, customerId } = JSON.parse(data) as UserData

      await stripeClient.customers.del(customerId)
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
  console.log('All cleanup tasks completed!')
  console.log('===================================================')
})
