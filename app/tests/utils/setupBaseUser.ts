import fs from 'node:fs'
import path from 'node:path'
import { createCustomer } from './createStripeCustomer.ts'
import { createSubscriptionRow } from './createSubscriptionRow.ts'
import createUser from './createUser.ts'

export async function setupBaseUser(userflow: string) {
  const dataPath = path.resolve(path.dirname('.'), './tests/stripe/data')
  const user = await createUser()
  const email = user.email || ''
  const password = 'password123'

  const stripeCustomer = await createCustomer(email, user.id)
  await createSubscriptionRow(user.id, stripeCustomer.id)

  const data = {
    userId: user.id,
    customerId: stripeCustomer.id,
  }

  fs.writeFile(`${dataPath}/${userflow}.json`, JSON.stringify(data), (err) => {
    if (err) throw err
    console.log(`User data file created for ${userflow}.`)
  })

  console.log(`Testuser setup for ${userflow} completed!`)
  return { email, password, userId: user.id, customerId: stripeCustomer.id }
}
