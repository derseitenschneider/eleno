import { TestUser } from './TestUser'

export async function setupTrialActive() {
  const testUser = new TestUser({
    userflow: 'trial-active',
    project: 'subscriptions',
  })
  await testUser.init()

  return testUser
}

export async function setupTrialExpired() {
  const testUser = new TestUser({
    userflow: 'trial-expired',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.expireSubscription()

  return testUser
}

export async function setupMonthlyActive() {
  const testUser = new TestUser({
    userflow: 'monthly-active',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')

  return testUser
}

export async function setupMonthlyMonthly() {
  const testUser = new TestUser({
    userflow: 'monthly-monthly',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')

  return testUser
}

export async function setupMonthlyLifetime() {
  const testUser = new TestUser({
    userflow: 'monthly-lifetime',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')
  await testUser.runStripeFixture('lifetime')

  return testUser
}

export async function setupMonthlyCanceled() {
  const testUser = new TestUser({
    userflow: 'monthly-canceled',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')
  await testUser.cancelAtPeriodEnd()

  return testUser
}

export async function setupMonthlyCanceledExpired() {
  const testUser = new TestUser({
    userflow: 'monthly-canceled-expired',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')
  await testUser.cancelAtPeriodEnd()
  await testUser.advanceClock({ days: 31, hours: 2 })
  await testUser.expireSubscription()

  return testUser
}

export async function setupMonthlyExpired() {
  const testUser = new TestUser({
    userflow: 'monthly-expired',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')

  await testUser.expireSubscription()

  // Add default failing payment method
  await testUser.addFailingPaymentMethod()

  // Move Stripe Clock forward
  await testUser.advanceClock({ days: 31, hours: 2 })

  return testUser
}

export async function setupMonthlyExpiredCanceled() {
  const testUser = new TestUser({
    userflow: 'monthly-expired-canceled',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')

  // Add default failing payment method
  await testUser.addFailingPaymentMethod()

  // Move Stripe Clock forward
  await testUser.advanceClock({ days: 40 })

  await testUser.expireSubscription()
  return testUser
}

export async function setupMonthlyExpiredPaid() {
  const testUser = new TestUser({
    userflow: 'monthly-expired-paid',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')

  await testUser.expireSubscription()

  // Add default failing payment method
  await testUser.addFailingPaymentMethod()

  // Move stripe clock forward
  await testUser.advanceClock({ days: 31, hours: 2 })

  // Add default succeeding payment method
  await testUser.addSucceedingPaymentMethod()

  // Move stripe clock forward
  await testUser.advanceClock({ days: 40, hours: 2 })

  return testUser
}

export async function setupTrialLifetime() {
  const testUser = new TestUser({
    userflow: 'trial-lifetime',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('lifetime')

  return testUser
}

export async function setupMonthlyYearly() {
  const testUser = new TestUser({
    userflow: 'monthly-yearly',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('monthly-checkout')
  await testUser.upgradeToYearly()

  return testUser
}

export async function setupYearlyMonthly() {
  const testUser = new TestUser({
    userflow: 'yearly-monthly',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')
  await testUser.downGradeToMonthly()

  return testUser
}

export async function setupYearlyActive() {
  const testUser = new TestUser({
    userflow: 'yearly-active',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')

  return testUser
}

export async function setupYearlyYearly() {
  const testUser = new TestUser({
    userflow: 'yearly-yearly',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')

  return testUser
}

export async function setupYearlyLifetime() {
  const testUser = new TestUser({
    userflow: 'yearly-lifetime',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')
  await testUser.runStripeFixture('lifetime')

  return testUser
}

export async function setupYearlyCanceled() {
  const testUser = new TestUser({
    userflow: 'yearly-canceled',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')
  await testUser.cancelAtPeriodEnd()

  return testUser
}

export async function setupYearlyCanceledExpired() {
  const testUser = new TestUser({
    userflow: 'yearly-canceled-expired',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')
  await testUser.cancelAtPeriodEnd()
  await testUser.advanceClock({ days: 366, hours: 2 })
  await testUser.expireSubscription()

  return testUser
}

export async function setupYearlyExpired() {
  const testUser = new TestUser({
    userflow: 'yearly-expired',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')

  await testUser.expireSubscription()

  // Add default failing payment method
  await testUser.addFailingPaymentMethod()

  // Move Stripe Clock forward one year.
  await testUser.advanceClock({ days: 366, hours: 2 })

  return testUser
}

export async function setupYearlyExpiredCanceled() {
  const testUser = new TestUser({
    userflow: 'yearly-expired-canceled',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')

  // Add default failing payment method
  await testUser.addFailingPaymentMethod()

  // Move Stripe Clock forward
  await testUser.advanceClock({ days: 425 })

  await testUser.expireSubscription()
  return testUser
}

export async function setupYearlyExpiredPaid() {
  const testUser = new TestUser({
    userflow: 'yearly-expired-paid',
    project: 'subscriptions',
  })
  await testUser.init()
  await testUser.runStripeFixture('yearly-checkout')

  await testUser.expireSubscription()

  // Add default failing payment method
  await testUser.addFailingPaymentMethod()

  // Move stripe clock forward
  await testUser.advanceClock({ days: 366, hours: 2 })

  // Add default succeeding payment method
  await testUser.addSucceedingPaymentMethod()

  // Move stripe clock forward
  await testUser.advanceClock({ days: 375, hours: 2 })

  return testUser
}
