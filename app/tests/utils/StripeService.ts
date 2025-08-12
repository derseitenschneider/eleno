import { exec } from 'node:child_process'
import type { User } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { resolveJoin } from './resolveJoin'
import { stripeClient } from './stripeClient'

export type TestCard = 'pm_card_chargeCustomerFail' | 'pm_card_visa'

export class StripeService {
  private client: Stripe
  private clock: Stripe.Response<Stripe.TestHelpers.TestClock> | null = null
  private fixturesPath: string

  constructor() {
    this.client = stripeClient
    this.fixturesPath = resolveJoin('../subscriptions/fixtures/')
  }

  public async createCustomer(user: User | null, userflow: string) {
    if (!user) {
      throw new Error('No user present to create a stripe customer from.')
    }
    await this.createTestClock(userflow)
    const customer = await this.client.customers.create({
      email: user.email,
      test_clock: this.clock?.id,
      payment_method: 'pm_card_visa',
      invoice_settings: {
        default_payment_method: 'pm_card_visa',
      },
      metadata: {
        uid: user.id,
      },
    })
    return customer
  }

  private async createTestClock(userflow: string) {
    const testClock = await this.client.testHelpers.testClocks.create({
      frozen_time: Math.round(+new Date() / 1_000),
      name: userflow,
    })
    this.clock = testClock
  }

  private async getSubscriptions(customerId: string) {
    const subscriptions = await this.client.subscriptions.list({
      customer: customerId,
    })

    return subscriptions.data
  }

  public async cancelAtPeriodEnd(customerId: string) {
    const subscriptions = await this.getSubscriptions(customerId)

    for (const sub of subscriptions) {
      await this.client.subscriptions.update(sub.id, {
        cancel_at_period_end: true,
      })
    }
  }

  public async updateSubscription(customerId: string, priceId: string) {
    const subscriptions = await this.getSubscriptions(customerId)
    const activeSubscription = subscriptions.find(
      (sub) => sub.status === 'active',
    )

    if (!activeSubscription) {
      throw new Error(`Customer ${customerId} has no active subscription.`)
    }

    if (
      !activeSubscription.items ||
      activeSubscription.items.data.length === 0
    ) {
      throw new Error(
        `Customer ${customerId} active subscription has no items.`,
      )
    }

    const subscriptionItemId = activeSubscription.items.data[0]?.id

    await this.client.subscriptions.update(activeSubscription.id, {
      items: [
        {
          id: subscriptionItemId,
          price: priceId,
        },
      ],
    })
  }
  public async attachNewPaymentMethod(customerId: string, testCard: TestCard) {
    const newPaymentMethod = await this.client.paymentMethods.attach(testCard, {
      customer: customerId,
    })

    // Set new payment method as default on customer.
    await this.client.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: newPaymentMethod.id,
      },
    })

    // Set new payment method as default on all subscriptions.
    const subscriptions = await this.client.subscriptions.list({
      customer: customerId,
    })

    for (const sub of subscriptions.data) {
      await this.client.subscriptions.update(sub.id, {
        default_payment_method: newPaymentMethod.id,
      })
    }
  }

  public async advanceClock(timeOptions: {
    days: number
    hours?: number
    minutes?: number
  }) {
    if (!this.clock) {
      throw new Error('No clock set up to advance.')
    }
    const { days, hours, minutes } = timeOptions
    const today = new Date()
    const daysInMiliseconds = days * 24 * 60 * 60 * 1000
    const hoursInMiliseconds = hours ? hours * 60 * 60 * 1000 : 0
    const minutesInMiliseconds = minutes ? minutes * 60 * 1000 : 0
    const totalMiliseconds =
      daysInMiliseconds + hoursInMiliseconds + minutesInMiliseconds

    const futureDate = new Date(today.getTime() + totalMiliseconds)
    const unixTimestampSeconds = Math.floor(futureDate.getTime() / 1000)

    await this.client.testHelpers.testClocks.advance(this.clock.id, {
      frozen_time: unixTimestampSeconds,
    })

    await this.pollTestClock(this.clock.id)
  }

  private async pollTestClock(clockId: string, maxAttempts = 60, attempt = 0) {
    try {
      const testClock =
        await this.client.testHelpers.testClocks.retrieve(clockId)

      if (testClock.status === 'ready') {
        return // Clock is ready, exit the function
      }
      if (testClock.status === 'advancing') {
        if (attempt >= maxAttempts) {
          console.error('TestClock polling timed out.')
          return
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for 1 second
        await this.pollTestClock(clockId, maxAttempts, attempt + 1) // Recursive call
      } else {
        console.error(`Unexpected TestClock status: ${testClock.status}`)
      }
    } catch (error) {
      console.error('Error polling TestClock:', error)
    }
  }

  public async runFixture(
    fixtureName: string,
    userId: string,
    customerId: string,
  ) {
    return new Promise((resolve, reject) => {
      // Since we cannot login into stripe cli with ci/cd because stripe login
      // only works with interactions, we pass the stripe secret to every command
      // for authentication.
      const apiKeyString = `--api-key ${process.env.STRIPE_SECRET_KEY}`

      // Dynamic vars consumed by the fixture when running with the cli
      const envVarString = `USER_ID=${userId} CUSTOMER_ID=${customerId} LOCALE=de`

      // Final composition of the command.
      const command = `${envVarString}  stripe fixtures ${apiKeyString} ${this.fixturesPath}/${fixtureName}.json`

      const childProcess = exec(command)

      let stdoutData = ''
      let stderrData = ''

      childProcess.stdout?.on('data', (data) => {
        stdoutData += data
      })

      childProcess.stderr?.on('data', (data) => {
        stderrData += data
        console.error(data) // Log stderr in real-time
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(stdoutData)
        } else {
          reject(
            new Error(`Stripe CLI exited with code ${code}: ${stderrData}`),
          )
        }
      })
    })
  }
}
