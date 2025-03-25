import { TestUser } from './TestUser'

export async function setupTrialActive() {
  const testUser = new TestUser({ userflow: 'trial-active' })
  await testUser.init()

  return testUser
}

export async function setupTrialExpired() {
  const testUser = new TestUser({ userflow: 'trial-expired' })
  await testUser.init()
  await testUser.expireSubscription()

  return testUser
}

export async function setupMonthlyActive() {
  const testUser = new TestUser({ userflow: 'monthly-active' })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')

  return testUser
}

export async function setupMonthlyCanceled() {
  const testUser = new TestUser({ userflow: 'monthly-canceled' })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')
  await testUser.cancelAtPeriodEnd()

  return testUser
}

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
