import { TestUser } from './TestUser'

export async function setupMonthlyExpired() {
  const testUser = new TestUser({ userflow: 'monthly-expired' })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')

  await testUser.expireSubscription()

  // Add default failing payment method
  await testUser.addFailingPaymentMethod()

  // Move Stripe Clock forward
  await testUser.advanceClock({ days: 31, hours: 2 })

  return testUser
}
