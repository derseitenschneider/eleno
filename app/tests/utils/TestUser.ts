import fs from 'node:fs'
import type { User } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import type { GroupPartial } from '../../src/types/types'
import { resolveJoin } from './resolveJoin'
import { StripeService } from './StripeService'
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
  | 'lifetime-user'

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

    // Check if this should be a lifetime subscription
    if (this.userflow === 'lifetime-user') {
      return this.createLifetimeSubscriptionRow()
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

  private async createLifetimeSubscriptionRow() {
    if (!this.user || !this.customer) {
      throw new Error(
        'No data present to create lifetime subscription row for.',
      )
    }

    const data = {
      user_id: this.user.id,
      stripe_customer_id: this.customer.id,
      stripe_subscription_id: null, // Lifetime is one-time payment, not recurring
      stripe_invoice_id: null, // Test environment doesn't need real invoice
      payment_status: 'paid',
      currency: 'chf',
      period_start: null, // Lifetime has no period
      period_end: null, // Never expires
      plan: 'lifetime',
      subscription_status: 'active',
      failed_payment_attempts: 0,
      needs_stripe_customer: true,
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
        date: '2025-08-01',
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

  /**
   * Static method to create a lifetime user for edge-case visual regression tests.
   * Creates a user with lifetime subscription to avoid trial expiration issues.
   */
  public static async createLifetimeUser(): Promise<{
    email: string
    password: string
    authFile: string
  }> {
    const testUser = new TestUser({
      userflow: 'lifetime-user',
      project: 'general',
    })

    await testUser.init()

    return {
      email: testUser.email,
      password: testUser.password,
      authFile: testUser.authFile,
    }
  }

  /**
   * Create multiple lessons for a specific student
   */
  public async createLessonsForStudent(studentId: string, count = 5) {
    if (!this.user) {
      throw new Error('No user data to create lessons')
    }

    const lessons = []
    const lessonTemplates = [
      {
        lessonContent: 'Scales and Arpeggios practice',
        homework: 'Practice C major scale 10 minutes daily',
        date: '2025-06-12',
      },
      {
        lessonContent: 'New piece introduction: Mozart Sonata',
        homework: 'Learn first 8 bars hands separately',
        date: '2025-06-19',
      },
      {
        lessonContent: 'Rhythm exercises and sight reading',
        homework: 'Complete rhythm worksheet pages 1-3',
        date: '2025-06-27',
      },
      {
        lessonContent: 'Technical work: finger independence',
        homework: 'Hanon exercises 1-5, slow tempo',
        date: '2025-07-03',
      },
      {
        lessonContent: 'Performance preparation and stage presence',
        homework: 'Record yourself playing the recital piece',
        date: '2025-07-10',
      },
    ]

    for (let i = 0; i < count && i < lessonTemplates.length; i++) {
      const { data, error } = await supabaseAdmin
        .from('lessons')
        .insert({
          user_id: this.user.id,
          studentId: Number.parseInt(studentId),
          ...lessonTemplates[i],
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error creating lesson: ${error.message}`)
      }
      lessons.push(data)
    }

    return lessons
  }

  /**
   * Create lessons for a group
   */
  public async createLessonsForGroup(groupId: string, count = 3) {
    if (!this.user) {
      throw new Error('No user data to create group lessons')
    }

    const lessons = []
    const groupLessonTemplates = [
      {
        lessonContent: 'Ensemble playing: timing and listening',
        homework: 'Practice your part with metronome at 80 BPM',
        date: '2025-06-01',
      },
      {
        lessonContent: 'Harmony and chord progressions',
        homework: 'Memorize chord changes for sections A and B',
        date: '2025-06-08',
      },
      {
        lessonContent: 'Group dynamics and balance',
        homework: 'Record your part and send to group chat',
        date: '2025-06-15',
      },
    ]

    for (let i = 0; i < count && i < groupLessonTemplates.length; i++) {
      const { data, error } = await supabaseAdmin
        .from('lessons')
        .insert({
          user_id: this.user.id,
          groupId: Number.parseInt(groupId),
          ...groupLessonTemplates[i],
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error creating group lesson: ${error.message}`)
      }
      lessons.push(data)
    }

    return lessons
  }

  /**
   * Create repertoire items for a student using current database schema
   */
  public async createRepertoireItems(studentId: string, count = 4) {
    if (!this.user) {
      throw new Error('No user data to create repertoire items')
    }

    const repertoire = []
    const pieces = [
      {
        title: 'Für Elise - Beethoven',
        startDate: '2025-06-01',
        endDate: '2025-06-08',
      },
      {
        title: 'Clair de Lune - Debussy',
        startDate: '2025-05-01',
        endDate: null,
      },
      {
        title: 'Prelude in C Major - Bach',
        startDate: '2025-03-01',
        endDate: '2025-04-15',
      },
      {
        title: 'River Flows in You - Yiruma',
        startDate: '2025-08-19', // Static date for consistent tests
        endDate: null, // Just started
      },
    ]

    try {
      for (let i = 0; i < count && i < pieces.length; i++) {
        const { data, error } = await supabaseAdmin
          .from('repertoire')
          .insert({
            user_id: this.user.id,
            studentId: Number.parseInt(studentId),
            title: pieces[i]?.title || '',
            startDate: pieces[i]?.startDate || null,
            endDate: pieces[i]?.endDate || null,
          })
          .select()
          .single()

        if (error) {
          console.warn(`Repertoire creation failed: ${error.message}`)
          break
        }
        repertoire.push(data)
      }
    } catch (error) {
      console.warn('Repertoire creation failed:', error)
    }

    return repertoire
  }

  /**
   * Create repertoire items for a group
   */
  public async createRepertoireForGroup(groupId: string, count = 3) {
    if (!this.user) {
      throw new Error('No user data to create group repertoire')
    }

    const repertoire = []
    const groupPieces = [
      {
        title: 'Canon in D - Pachelbel (Ensemble)',
        startDate: '2025-08-15',
        endDate: null,
      },
      {
        title: 'Eine kleine Nachtmusik - Mozart (Group)',
        startDate: '2025-06-13',
        endDate: '2025-07-20',
      },
      {
        title: 'Ode to Joy - Beethoven (Choir)',
        startDate: '2025-06-12',
        endDate: null,
      },
    ]

    try {
      for (let i = 0; i < count && i < groupPieces.length; i++) {
        const { data, error } = await supabaseAdmin
          .from('repertoire')
          .insert({
            user_id: this.user.id,
            groupId: Number.parseInt(groupId),
            title: groupPieces[i]?.title || '',
            startDate: groupPieces[i]?.startDate || null,
            endDate: groupPieces[i]?.endDate || null,
          })
          .select()
          .single()

        if (error) {
          console.warn(`Group repertoire creation failed: ${error.message}`)
          break
        }
        repertoire.push(data)
      }
    } catch (error) {
      console.warn('Group repertoire creation failed:', error)
    }

    return repertoire
  }

  /**
   * Create notes for a student with different colors and orders
   */
  public async createNotesForStudent(studentId: string, count = 3) {
    if (!this.user) {
      throw new Error('No user data to create notes')
    }

    const notes = []
    const noteTemplates = [
      {
        title: 'Practice Reminder',
        text: 'Remember to practice scales daily for finger strength and dexterity. Focus on maintaining steady tempo.',
        backgroundColor: 'blue',
        order: 1,
      },
      {
        title: 'Performance Notes',
        text: 'Great improvement in dynamics this week! Continue working on crescendo and diminuendo in the Bach piece.',
        backgroundColor: 'green',
        order: 2,
      },
      {
        title: 'Technical Work',
        text: 'Need to focus on left hand independence. Practice Hanon exercises 1-5 at slower tempo with metronome.',
        backgroundColor: 'yellow',
        order: 3,
      },
    ]

    try {
      for (let i = 0; i < count && i < noteTemplates.length; i++) {
        const { data, error } = await supabaseAdmin
          .from('notes')
          .insert({
            user_id: this.user.id,
            studentId: Number.parseInt(studentId),
            title: noteTemplates[i]?.title || '',
            text: noteTemplates[i]?.text || '',
            backgroundColor:
              (noteTemplates[i]?.backgroundColor as
                | 'blue'
                | 'red'
                | 'green'
                | 'yellow') || 'blue',
            order: noteTemplates[i]?.order || 1,
          })
          .select()
          .single()

        if (error) {
          console.warn(`Notes creation failed: ${error.message}`)
          break
        }
        notes.push(data)
      }
    } catch (error) {
      console.warn('Notes creation failed:', error)
    }

    return notes
  }

  /**
   * Create notes for a group
   */
  public async createNotesForGroup(groupId: string, count = 2) {
    if (!this.user) {
      throw new Error('No user data to create group notes')
    }

    const notes = []
    const groupNoteTemplates = [
      {
        title: 'Ensemble Coordination',
        text: 'Work on listening to each other and maintaining synchronized tempo. Practice with metronome in next session.',
        backgroundColor: 'blue',
        order: 1,
      },
      {
        title: 'Performance Preparation',
        text: 'Great progress on harmony! Next week we will focus on stage positioning and visual presentation for the concert.',
        backgroundColor: 'green',
        order: 2,
      },
    ]

    try {
      for (let i = 0; i < count && i < groupNoteTemplates.length; i++) {
        const { data, error } = await supabaseAdmin
          .from('notes')
          .insert({
            user_id: this.user.id,
            groupId: Number.parseInt(groupId),
            title: groupNoteTemplates[i]?.title || '',
            text: groupNoteTemplates[i]?.text || '',
            backgroundColor:
              (groupNoteTemplates[i]?.backgroundColor as
                | 'blue'
                | 'red'
                | 'green'
                | 'yellow') || 'blue',
            order: groupNoteTemplates[i]?.order || 1,
          })
          .select()
          .single()

        if (error) {
          console.warn(`Group notes creation failed: ${error.message}`)
          break
        }
        notes.push(data)
      }
    } catch (error) {
      console.warn('Group notes creation failed:', error)
    }

    return notes
  }

  /**
   * Create general notes not tied to students or groups
   */
  public async createGeneralNotes(count = 4) {
    if (!this.user) {
      throw new Error('No user data to create general notes')
    }

    const notes = []
    const generalNoteTemplates = [
      {
        title: 'Studio Policies',
        text: 'Updated lesson cancellation policy: 24-hour notice required for rescheduling. Emergency exceptions apply.',
        backgroundColor: 'red',
        order: 1,
      },
      {
        title: 'Recital Planning',
        text: 'Spring recital scheduled for May 15th. Start preparing solo pieces. Ensemble pieces will be assigned next month.',
        backgroundColor: 'blue',
        order: 2,
      },
      {
        title: 'New Equipment',
        text: 'Ordered new digital piano for studio. Delivery expected next week. Will help with recording practice sessions.',
        backgroundColor: 'green',
        order: 3,
      },
      {
        title: 'Teaching Resources',
        text: 'Found excellent online metronome app with advanced features. Will demonstrate in upcoming lessons.',
        backgroundColor: 'yellow',
        order: 4,
      },
    ]

    try {
      for (let i = 0; i < count && i < generalNoteTemplates.length; i++) {
        const { data, error } = await supabaseAdmin
          .from('notes')
          .insert({
            user_id: this.user.id,
            title: generalNoteTemplates[i]?.title || '',
            text: generalNoteTemplates[i]?.text || '',
            backgroundColor:
              (generalNoteTemplates[i]?.backgroundColor as
                | 'blue'
                | 'red'
                | 'green'
                | 'yellow') || 'blue',
            order: generalNoteTemplates[i]?.order || 1,
          })
          .select()
          .single()

        if (error) {
          console.warn(`General notes creation failed: ${error.message}`)
          break
        }
        notes.push(data)
      }
    } catch (error) {
      console.warn('General notes creation failed:', error)
    }

    return notes
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
        firstName: studentNames[i]?.firstName,
        lastName: studentNames[i]?.lastName,
        instrument: studentNames[i]?.instrument,
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
    const group: GroupPartial = {
      name,
      user_id: this.user.id,
      students: [],
      dayOfLesson: null,
      durationMinutes: null,
      startOfLesson: null,
      endOfLesson: null,
      homework_sharing_authorized: true,
      location: null,
    }

    const { data, error } = await supabaseAdmin
      .from('groups')
      .insert(group)
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating group: ${error.message}`)
    }

    return data
  }
}
