/**
 * Create stripe subscription rows with rate limit handling
 *
 * This file creates Stripe customer entries for users in your database
 * who do not yet have one, while implementing strategies to avoid Stripe
 * rate limits.
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'node:path'
import Stripe from 'stripe'

const dotenvPath = path.resolve(path.dirname('.'), '../.env.test')
dotenv.config({
  path: dotenvPath,
})

const stripeSecretKey = process.env.STRIPE_LIVE_KEY || ''
const stripeClient = new Stripe(stripeSecretKey)

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Define a function to introduce a delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// Define the batch size for processing users
const batchSize = 10 // Adjust this value as needed

async function createStripeCustomers() {
  const { data: users, error: usersError } = await supabaseAdmin
    .from('profiles')
    .select('id, email')

  if (usersError) {
    console.error('Error fetching users:', usersError)
    return
  }

  const { data: stripeSubscriptionEntries, error: stripeError } =
    await supabaseAdmin.from('stripe_subscriptions').select('user_id')

  if (stripeError) {
    console.error('Error fetching stripe subscriptions:', stripeError)
    return
  }

  const entryIds =
    stripeSubscriptionEntries?.map((entry) => entry.user_id) || []

  const usersWithoutEntry = users?.filter(
    (user) => !entryIds.find((id) => id === user.id),
  )

  if (!usersWithoutEntry || usersWithoutEntry.length === 0) {
    console.log('All users already have Stripe customer entries.')
    return
  }

  console.log(
    `Creating Stripe customers for ${usersWithoutEntry.length} users.`,
  )

  // Process users in batches with delays
  for (let i = 0; i < usersWithoutEntry.length; i += batchSize) {
    const batch = usersWithoutEntry.slice(i, i + batchSize)

    await Promise.all(
      batch.map(async (user) => {
        try {
          const customer = await stripeClient.customers.create({
            email: user.email,
            preferred_locales: ['de'],
            metadata: {
              uid: user.id,
            },
          })

          const today = new Date()
          const futureDate = new Date(today)
          futureDate.setDate(today.getDate() + 30)

          const data = {
            user_id: user.id,
            stripe_customer_id: customer.id,
            period_start: today.toISOString(),
            period_end: futureDate.toISOString(),
            subscription_status: 'trial',
          }

          const { error: insertError } = await supabaseAdmin
            .from('stripe_subscriptions')
            .insert(data)

          if (insertError) {
            console.error(
              `Error inserting subscription for user ${user.id}:`,
              insertError,
            )
          } else {
            console.log(
              `Stripe customer created and subscription added for user ${user.id}`,
            )
          }
        } catch (error: any) {
          console.error(
            `Error creating Stripe customer for user ${user.id}:`,
            error.message,
          )
          // Consider implementing more sophisticated error handling here,
          // such as retrying failed requests with exponential backoff.
        }
      }),
    )

    // Introduce a delay after each batch
    await delay(1000) // Adjust the delay time (in milliseconds) as needed
    console.log(
      `Batch ${i / batchSize + 1} processed. Waiting before next batch...`,
    )
  }

  console.log('Stripe customer creation and subscription process complete.')
}

createStripeCustomers()
