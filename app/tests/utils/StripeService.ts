import { type User } from '@supabase/supabase-js'
import { resolveJoin } from './resolveJoin'
import type Stripe from 'stripe'
import { stripeClient } from './stripeClient'
import { exec } from 'node:child_process'

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
    console.log('===================================================')
    console.log(':::::::::: STRIPE CUSTOMER ::::::::::\n')
    await this.createTestClock(userflow)
    console.log('Creating new stripe customer...')
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

    console.log(`Customer ${customer.id} created successfully.`)
    console.log('===================================================')
    return customer
  }

  private async createTestClock(userflow: string) {
    console.log('Creating a stripe testClock...')
    const testClock = await this.client.testHelpers.testClocks.create({
      frozen_time: Math.round(+new Date() / 1_000),
      name: userflow,
    })

    console.log(`Testclock created: ${testClock.id}`)
    this.clock = testClock
  }

  public async runFixture(
    fixtureName: string,
    userId: string,
    customerId: string,
  ) {
    console.log(':::::::::: STRIPE FIXTURE ::::::::::\n')
    console.log(`Start running fixture for ${fixtureName}...`)
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
        console.log(data) // Log stdout in real-time
      })

      childProcess.stderr?.on('data', (data) => {
        stderrData += data
        console.error(data) // Log stderr in real-time
      })

      childProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`Fixture for ${fixtureName} completed.`)
          console.log('===================================================')
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
