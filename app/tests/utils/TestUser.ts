import fs from 'node:fs'
import supabaseAdmin from './supabaseAdmin'
import { StripeService } from './StripeService'
import { type User } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { resolveJoin } from './resolveJoin'

export type UserFlow =
  | 'trial-active'
  | 'trial-expired'
  | 'monthly-active'
  | 'monthly-canceled'
  | 'monthly-canceled-expired'
  | 'monthly-expired'
  | 'monthly-expired-paid'
  | 'monthly-expired-canceled'
  | 'trial-lifetime'
  | 'monthly-yearly'
  | 'yearly-active'
  | 'yearly-canceled'
  | 'yearly-expired'
  | 'yearly-expired-canceled'
  | 'yearly-expired-paid'

type StripeFixture =
  | 'monthly-checkout'
  | 'yearly-checkout'
  | 'lifetime'
  | 'upgrade-yearly'
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

  /**
   * @protected
   *
   * Helper class with all methods related to stripe.
   */
  protected stripeService: StripeService

  public constructor(options: Options) {
    this.stripeService = new StripeService()
    this.userflow = options.userflow

    this.dataPath = resolveJoin('../subscriptions/data')
    this.authFile = resolveJoin(`../../playwright/.auth/${this.userflow}.json`)

    this.email = `pw-test-${this.userflow}-${Date.now()}@example.com`
    this.password = 'password123'
  }

  public async init() {
    console.log('===================================================')
    console.log(':::::::::: USER ::::::::::\n')

    console.log(`Start testUser setup for ${this.userflow}...`)

    this.user = await this.createUser()
    this.customer = await this.stripeService.createCustomer(
      this.user,
      this.userflow,
    )

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
    return user.user
  }

  private writeData() {
    if (!this.user || !this.customer) {
      throw new Error('No data present to write.')
    }
    const data = {
      userId: this.user.id,
      customerId: this.customer.id,
      clockId: this.customer.test_clock,
    }

    const fullPath = `${this.dataPath}/${this.userflow}.json`

    fs.mkdirSync(this.dataPath, { recursive: true })

    fs.writeFileSync(fullPath, JSON.stringify(data), {
      encoding: 'utf8',
    })

    console.log(`Data created: ${fullPath}`)
  }

  public async cancelAtPeriodEnd() {
    if (!this.customer) {
      throw new Error('No data present to cancel a subscription.')
    }
    console.log('Canceling subscription on period end...')
    await this.stripeService.cancelAtPeriodEnd(this.customer.id)
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

  public async runStripeFixture(fixtureName: StripeFixture) {
    if (!this.user || !this.customer) {
      throw new Error("Can't run fixture without user and customer")
    }

    await this.stripeService.runFixture(
      fixtureName,
      this.user.id,
      this.customer.id,
    )
  }

  public async expireSubscription() {
    if (!this.user) {
      throw new Error("Can't run fixture without user and customer")
    }
    console.log('Expiring user subscription...')

    const today = new Date()
    const yesterday = new Date(today)
    const pastDate = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    pastDate.setDate(today.getDate() - 31)

    const data = {
      period_start: pastDate.toISOString(),
      period_end: yesterday.toISOString(),
    }

    const { error } = await supabaseAdmin
      .from('stripe_subscriptions')
      .update(data)
      .eq('user_id', this.user.id)

    console.log(
      `Expired subscription for user ${this.user.id}: ${data.period_start} - ${data.period_end}`,
    )
    if (error) {
      throw new Error(error.message)
    }
  }

  public async addFailingPaymentMethod() {
    if (!this.customer) {
      throw new Error("Can't run method without customer")
    }
    console.log('Adding failing payment method...')
    await this.stripeService.attachNewPaymentMethod(
      this.customer.id,
      'pm_card_chargeCustomerFail',
    )
    console.log('Failing payment method added.')
  }

  public async addSucceedingPaymentMethod() {
    if (!this.customer) {
      throw new Error("Can't run method without customer")
    }
    console.log('Adding succeeding payment method...')
    await this.stripeService.attachNewPaymentMethod(
      this.customer.id,
      'pm_card_visa',
    )
    console.log('Succeeding payment method added.')
  }

  public async advanceClock(timeOptions: {
    days: number
    hours?: number
    minutes?: number
  }) {
    await this.stripeService.advanceClock(timeOptions)
  }
}
