import { stripeClient } from './stripeClient.ts'
export async function createCustomer(email: string, userId: string) {
  console.log('Creating new stripe customer...')
  const customer = await stripeClient.customers.create({
    email,
    metadata: {
      uid: userId,
    },
  })

  return customer
}
