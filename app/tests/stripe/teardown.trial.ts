import { test as teardown, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import deleteUser from '../utils/deleteUser'
import { stripeClient } from '../utils/stripeClient'

type UserData = {
  userId: string
  customerId: string
}
const dataPath = path.resolve(path.dirname('.'), './tests/stripe/data')

teardown('create trial user and authenticate', async () => {
  const data = fs.readFileSync(`${dataPath}/trial-user.json`, 'utf8')
  const { userId, customerId } = JSON.parse(data) as UserData

  await stripeClient.customers.del(customerId)
  await deleteUser(userId)
  fs.unlinkSync(`${dataPath}/trial-user.json`)
  console.log('Cleanup completed!')
})
