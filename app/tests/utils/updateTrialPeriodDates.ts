/**
 * Updates the period_start and period_end (dates only) for all trial
 * subscriptions in the stripe_subscriptions table.
 */
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'node:path'

const dotenvPath = path.resolve(path.dirname('.'), '../.env.test')
dotenv.config({
  path: dotenvPath,
})

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function updateTrialPeriodDates() {
  try {
    const { data: trialSubscriptions, error: fetchError } = await supabaseAdmin
      .from('stripe_subscriptions')
      .select('id')
      .eq('subscription_status', 'trial')

    if (fetchError) {
      console.error('Error fetching trial subscriptions:', fetchError)
      return
    }

    if (!trialSubscriptions || trialSubscriptions.length === 0) {
      console.log('No subscriptions with status "trial" found.')
      return
    }

    const newStartDate = '2025-05-12'
    const endDate = new Date('2025-05-12T00:00:00Z') // Use a Date object for calculation
    endDate.setDate(endDate.getDate() + 30)
    const newEndDate = endDate.toISOString().split('T')[0] // Extract only the date part

    console.log(`Updating ${trialSubscriptions.length} trial subscriptions...`)

    for (const subscription of trialSubscriptions) {
      const { error: updateError } = await supabaseAdmin
        .from('stripe_subscriptions')
        .update({
          period_start: newStartDate,
          period_end: newEndDate,
        })
        .eq('id', subscription.id)

      if (updateError) {
        console.error(
          `Error updating subscription with ID ${subscription.id}:`,
          updateError,
        )
      } else {
        console.log(`Updated subscription with ID ${subscription.id}`)
      }
    }

    console.log('Trial subscription dates updated successfully.')
  } catch (error: any) {
    console.error('An unexpected error occurred:', error.message)
  }
}

updateTrialPeriodDates()
