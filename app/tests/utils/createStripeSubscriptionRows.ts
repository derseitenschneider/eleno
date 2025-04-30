/**
 * Create stripe subscription rows
 *
 * This file is responsible for creating stripe subscription rows based on the
 * auth table in supabase. It loops through all auth users and checks each
 * has a stripe subscription row. If not, it creates a new stripe client and
 * then an entry in the stripe_subscriptions table, setting the plan to trial,
 * the period_start to today and the period_end to today in 30 days.
 *
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

const { data: users } = await supabaseAdmin.from('profiles').select('id, email')
const { data: stripeSubscriptionEntries } = await supabaseAdmin
  .from('stripe_subscriptions')
  .select('user_id')

const entryIds = stripeSubscriptionEntries?.map((entry) => entry.user_id) || []

const usersWithoutEntry = users?.filter(
  (user) => !entryIds.find((id) => id === user.id),
)

usersWithoutEntry?.forEach(async (user) => {
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

  supabaseAdmin.from('stripe_subscriptions').insert(data)
})
