import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import supabaseAdmin from './supabaseAdmin'
import { stripeClient } from './stripeClient'
import { type User } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { exec } from 'node:child_process'

type UserFlow =
  | 'monthly-active'
  | 'monthly-canceled'
  | 'monthly-expired'
  | 'trial-active'

type StripeFixture = 'monthly-checkout' | 'yearly-checkout' | 'lifetime'
type Options = {
  userflow: UserFlow
}

export class TestUser {
  /**
   * @private
   *
   * The path to the temporary data storage.
   *
   * This is the path to the file where for the userdata is stored per userflow.
   * The cleanup after the tests uses this file to delete all test data in the
   * database and eventually delets also this file.
   */
  private dataPath: string

  /**
   * @private
   *
   * The path to the stripe fixture.
   *
   * This is the path to the fixture json that gets run by the stripe cli for
   * given userflow.
   */
  private fixturesPath: string

  /**
   * @readonly
   *
   * Fake email adress for test user.
   *
   * CAUTION: The email needs necessarily to contain the substring 'test',
   * otherwhise supabase auth kicks off creating a stripe customer on the live
   * stripe instance as well.
   */
  readonly email: string

  /**
   * @readonly
   *
   * Password for test user, usually "password123".
   */
  readonly password: string

  /**
   * @readonly
   *
   * The userflow to set for the testuser.
   */
  readonly userflow: UserFlow

  /**
   * @readonly
   *
   * The path to the authfile where auth data is stored for playwright for
   * easier login after the initial one.
   */
  readonly authFile: string

  /**
   * @protected
   *
   * The user created on init().
   */
  protected user: User | null = null

  /**
   * @protected
   *
   * The customer created on init().
   */
  protected customer: Stripe.Response<Stripe.Customer> | null = null

  constructor(options: Options) {
    this.userflow = options.userflow

    this.dataPath = this.resolveJoin('../subscriptions/data')
    this.fixturesPath = this.resolveJoin('../subscriptions/fixtures/')
    this.authFile = this.resolveJoin(
      `../../playwright/.auth/${this.userflow}.json`,
    )

    this.email = `pw-test-${this.userflow}-${Date.now()}@example.com`
    this.password = 'password123'
  }

  private resolveJoin(file: string) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    return path.resolve(path.join(__dirname, file))
  }

  async init() {
    console.log('===================================================')
    console.log(`Start testUser setup for ${this.userflow}...\n`)
    await this.createUser()
    await this.createCustomer()
    await this.populateStudents()
    await this.createSubscriptionRow()
    this.writeData()

    console.log(`Testuser setup for ${this.userflow} completed!`)
    console.log('===================================================')
  }

  private async createUser() {
    console.log('Creating new test user...')

    const email = this.email
    const password = this.password
    const { data: user, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { firstName: 'Test', lastName: 'User' },
      })
    if (createUserError) {
      throw new Error(`Error creating new user: ${createUserError.message}`)
    }
    console.log(`User ${user.user.id} created successfully.`)
    this.user = user.user
  }

  private async createCustomer() {
    if (!this.user) {
      throw new Error('No user present to create a stripe customer from.')
    }
    console.log('Creating new stripe customer...')
    const email = this.email
    const userId = this.user.id
    const customer = await stripeClient.customers.create({
      email,
      metadata: {
        uid: userId,
      },
    })

    console.log(`Customer ${customer.id} created successfully.`)
    this.customer = customer
  }

  private writeData() {
    if (!this.user || !this.customer) {
      throw new Error('No data present to write.')
    }
    const data = {
      userId: this.user.id,
      customerId: this.customer.id,
    }

    const fullPath = `${this.dataPath}/${this.userflow}.json`

    fs.mkdirSync(this.dataPath, { recursive: true })

    fs.writeFileSync(fullPath, JSON.stringify(data), {
      encoding: 'utf8',
    })

    console.log(`Data created: ${fullPath}`)
  }

  private async createSubscriptionRow() {
    if (!this.user || !this.customer) {
      throw new Error('No data present to create subscription row for.')
    }
    console.log('Inserting new subscription row...')

    const today = new Date()
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + 30)

    const data = {
      user_id: this.user.id,
      stripe_customer_id: this.customer.id,
      period_start: today.toISOString(),
      period_end: futureDate.toISOString(),
      subscription_status: 'trial',
    }
    const { error } = await supabaseAdmin
      .from('stripe_subscriptions')
      .insert(data)

    if (error) {
      throw new Error(error.message)
    }
  }
  private async populateStudents() {
    if (!this.user || !this.customer) {
      throw new Error('No data present to populate students for.')
    }
    console.log('Creating a student for user ', this.user.id)
    const { error } = await supabaseAdmin.from('students').insert({
      user_id: this.user.id,
      firstName: 'Test',
      lastName: 'Student',
      instrument: 'Gitarre',
    })

    if (error) {
      throw new Error(`Error inserting student: ${error.message}`)
    }
  }

  async runStripeFixture(fixtureName: StripeFixture) {
    console.log('===================================================')
    console.log(`Start running fixture for ${fixtureName}...`)
    return new Promise((resolve, reject) => {
      if (!this.user || !this.customer) {
        throw new Error("Can't run fixture without user and customer")
      }
      // Since we cannot login into stripe cli with ci/cd because stripe login
      // only works with interactions, we pass the stripe secret to every command
      // for authentication.
      const apiKeyString = `--api-key ${process.env.STRIPE_SECRET_KEY}`

      // Dynamic vars consumed by the fixture when running with the cli
      const envVarString = `USER_ID=${this.user.id} CUSTOMER_ID=${this.customer.id} LOCALE=de`

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
          console.log(`Fixture for ${fixtureName} competed.`)
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
