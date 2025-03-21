import { test as teardown } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import deleteUser from '../utils/deleteUser'
import { stripeClient } from '../utils/stripeClient'

type UserData = {
  userId: string
  customerId: string
}

const dataPath = path.resolve(path.dirname('.'), './tests/subscriptions/data')

teardown('cleanup all trial users and customers', async () => {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith('.json'))

  for (const file of files) {
    const filePath = path.join(dataPath, file)
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      const { userId, customerId } = JSON.parse(data) as UserData

      await stripeClient.customers.del(customerId)
      await deleteUser(userId)
      fs.unlinkSync(filePath)
      console.log(`Cleanup completed for ${file}`)
    } catch (error) {
      console.error(`Error cleaning up ${file}:`, error)
    }
  }
  console.log('All cleanup tasks completed!')
})
