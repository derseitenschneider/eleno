import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url' // Import fileURLToPath
import { createCustomer } from './createStripeCustomer.ts'
import { createSubscriptionRow } from './createSubscriptionRow.ts'
import createUser from './createUser.ts'

export async function setupBaseUser(userflow: string) {
  const __filename = fileURLToPath(import.meta.url) // Get the current file's path
  const __dirname = path.dirname(__filename) // Get the current directory

  const dataPath = path.resolve(__dirname, '..', 'stripe', 'data')
  const user = await createUser(userflow)
  const email = user.email || ''
  const password = 'password123'

  const stripeCustomer = await createCustomer(email, user.id)
  await createSubscriptionRow(user.id, stripeCustomer.id)

  const data = {
    userId: user.id,
    customerId: stripeCustomer.id,
  }

  fs.mkdirSync(dataPath, { recursive: true })

  fs.writeFileSync(`${dataPath}/${userflow}.json`, JSON.stringify(data), {
    encoding: 'utf8',
  })

  console.log(`Testuser setup for ${userflow} completed!`)
  return { email, password, userId: user.id, customerId: stripeCustomer.id }
}
