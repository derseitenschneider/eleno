import fs from 'node:fs'
import type { User } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { StripeService } from './StripeService'
import { resolveJoin } from './resolveJoin'
import supabaseAdmin from './supabaseAdmin'

export type UserFlow =
  | 'trial-active'
  | 'trial-expired'
  | 'monthly-active'
  | 'monthly-monthly'
  | 'monthly-lifetime'
  | 'monthly-canceled'
  | 'monthly-canceled-expired'
  | 'monthly-expired'
  | 'monthly-expired-paid'
  | 'monthly-expired-canceled'
  | 'trial-lifetime'
  | 'monthly-yearly'
  | 'yearly-active'
  | 'yearly-yearly'
  | 'yearly-lifetime'
  | 'yearly-canceled'
  | 'yearly-canceled-expired'
  | 'yearly-expired'
  | 'yearly-expired-canceled'
  | 'yearly-expired-paid'
  | 'yearly-monthly'
  | 'share-homework'
  | 'general-user'

type StripeFixture =
  | 'monthly-checkout'
  | 'yearly-checkout'
  | 'lifetime'
  | 'upgrade-yearly'
type Options = {
  userflow: UserFlow
  project: 'subscriptions' | 'share-homework' | 'general'
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

  /**
   * @protected
   *
   * Id of the student created on init.
   */
  public studentId = ''

  public constructor(options: Options) {
    this.stripeService = new StripeService()
    this.userflow = options.userflow

    this.dataPath = resolveJoin(`../data/${options.project}`)
    this.authFile = resolveJoin(`../../playwright/.auth/${this.userflow}.json`)

    this.email = `pw-test-${this.userflow}-${Date.now()}@example.com`
    this.password = 'password123'
  }

  public async init() {
    this.user = await this.createUser()
    this.customer = await this.stripeService.createCustomer(
      this.user,
      this.userflow,
    )

    await this.populateStudents()
    await this.createSubscriptionRow()
    await this.createPaymentFeatureFlagRow()

    this.writeData()
  }

  private async createUser() {
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
  }

  public async cancelAtPeriodEnd() {
    if (!this.customer) {
      throw new Error('No data present to cancel a subscription.')
    }
    await this.stripeService.cancelAtPeriodEnd(this.customer.id)
  }

  private async createPaymentFeatureFlagRow() {
    if (!this.user) {
      throw new Error('No user data to create feature_flag_users row')
    }

    const { data: featureFlag, error: fetchFlagError } = await supabaseAdmin
      .from('feature_flags')
      .select('*')
      .eq('flag_name', 'stripe-payment')
      .single()

    if (fetchFlagError) {
      throw new Error(`Error fetching feature flags: ${fetchFlagError.message}`)
    }

    const { error: insertFlagUserError } = await supabaseAdmin
      .from('feature_flag_users')
      .insert({
        flag_id: featureFlag?.id,
        user_id: this.user.id,
      })

    if (insertFlagUserError) {
      throw new Error(
        `Error inserting feature_flag_users row: ${insertFlagUserError.message}`,
      )
    }
  }

  private async createSubscriptionRow() {
    if (!this.user || !this.customer) {
      throw new Error('No data present to create subscription row for.')
    }

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
    const { data: student, error } = await supabaseAdmin
      .from('students')
      .insert({
        user_id: this.user.id,
        firstName: 'Test',
        lastName: 'Student',
        instrument: 'Gitarre',
        homework_sharing_authorized: true,
      })
      .select('id')
      .single()

    this.studentId = student?.id
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
    if (error) {
      throw new Error(error.message)
    }
  }

  public async addFailingPaymentMethod() {
    if (!this.customer) {
      throw new Error("Can't run method without customer")
    }
    await this.stripeService.attachNewPaymentMethod(
      this.customer.id,
      'pm_card_chargeCustomerFail',
    )
  }

  public async addSucceedingPaymentMethod() {
    if (!this.customer) {
      throw new Error("Can't run method without customer")
    }
    await this.stripeService.attachNewPaymentMethod(
      this.customer.id,
      'pm_card_visa',
    )
  }

  public async upgradeToYearly() {
    if (!this.customer) {
      throw new Error("Can't run method without customer")
    }
    await this.stripeService.updateSubscription(
      this.customer.id,
      'price_1Qp7CXGqCC0x0XxsFFPDgzsa',
    )
  }

  public async downGradeToMonthly() {
    if (!this.customer) {
      throw new Error("Can't run method without customer")
    }
    await this.stripeService.updateSubscription(
      this.customer.id,
      'price_1Qp79yGqCC0x0XxstXJPUz84',
    )
  }
  public async advanceClock(timeOptions: {
    days: number
    hours?: number
    minutes?: number
  }) {
    await this.stripeService.advanceClock(timeOptions)
  }

  public async createLesson() {
    if (!this.user) {
      throw new Error("Can't run method without user")
    }
    const { data: lesson, error } = await supabaseAdmin
      .from('lessons')
      .insert({
        lessonContent: 'Test Lesson',
        homework: 'Test Homework',
        studentId: this.studentId,
        user_id: this.user.id,
        date: new Date(),
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(`Error inserting student: ${error.message}`)
    }

    return lesson
  }

  /**
   * Static method to create a general user for visual regression tests.
   * Creates a user with basic trial subscription and returns credentials.
   */
  public static async createGeneralUser(): Promise<{
    email: string
    password: string
    authFile: string
  }> {
    const testUser = new TestUser({
      userflow: 'general-user',
      project: 'general',
    })

    await testUser.init()

    return {
      email: testUser.email,
      password: testUser.password,
      authFile: testUser.authFile,
    }
  }

  // Methods for creating additional test data
  public async createAdditionalStudents(count = 4) {
    if (!this.user) {
      throw new Error('No user data to create additional students')
    }

    const students = []
    const studentNames = [
      { firstName: 'Emma', lastName: 'Johnson', instrument: 'Piano' },
      { firstName: 'Lucas', lastName: 'Martinez', instrument: 'Guitar' },
      { firstName: 'Sophie', lastName: 'Chen', instrument: 'Violin' },
      { firstName: 'Oliver', lastName: 'Williams', instrument: 'Drums' },
      { firstName: 'Mia', lastName: 'Anderson', instrument: 'Flute' },
    ]

    for (let i = 0; i < count && i < studentNames.length; i++) {
      students.push({
        user_id: this.user.id,
        firstName: studentNames[i].firstName,
        lastName: studentNames[i].lastName,
        instrument: studentNames[i].instrument,
        archive: false,
        homework_sharing_authorized: true,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('students')
      .insert(students)
      .select()

    if (error) {
      throw new Error(`Error creating additional students: ${error.message}`)
    }

    return data
  }

  public async createInactiveStudents(count = 2) {
    if (!this.user) {
      throw new Error('No user data to create inactive students')
    }

    const inactiveStudents = []
    const inactiveNames = [
      { firstName: 'Former', lastName: 'Student One', instrument: 'Cello' },
      { firstName: 'Former', lastName: 'Student Two', instrument: 'Saxophone' },
    ]

    for (let i = 0; i < count && i < inactiveNames.length; i++) {
      inactiveStudents.push({
        user_id: this.user.id,
        firstName: inactiveNames[i]?.firstName,
        lastName: inactiveNames[i]?.lastName,
        instrument: inactiveNames[i]?.instrument,
        archive: true, // Set to true for inactive students
        homework_sharing_authorized: false,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('students')
      .insert(inactiveStudents)
      .select()

    if (error) {
      throw new Error(`Error creating inactive students: ${error.message}`)
    }

    return data
  }

  public async createGroup(name = 'Advanced Guitar Group') {
    if (!this.user) {
      throw new Error('No user data to create group')
    }

    const { data, error } = await supabaseAdmin
      .from('groups')
      .insert({
        user_id: this.user.id,
        name,
        homework_sharing_authorized: true,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating group: ${error.message}`)
    }

    return data
  }
}
