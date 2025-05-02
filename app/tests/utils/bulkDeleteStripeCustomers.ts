/**
 * Delete Stripe customers created on a specific date.
 *
 * This script retrieves all Stripe customers created on April 30th, 2025,
 * and then deletes them. It includes rate limit handling to avoid API errors.
 */
import dotenv from 'dotenv'
import path from 'node:path'
import Stripe from 'stripe'

const dotenvPath = path.resolve(path.dirname('.'), '../.env.test')
dotenv.config({
  path: dotenvPath,
})

const stripeSecretKey = process.env.STRIPE_LIVE_KEY || ''
const stripeClient = new Stripe(stripeSecretKey)

// Function to introduce a delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

async function deleteStripeCustomersByDate(
  year: number,
  month: number,
  day: number,
) {
  // Calculate the timestamps for the beginning and end of the target date
  const startDate = new Date(year, month - 1, day, 0, 0, 0).getTime() / 1000 // Month is 0-indexed
  const endDate = new Date(year, month - 1, day, 23, 59, 59).getTime() / 1000

  console.log(
    `Fetching Stripe customers created between ${new Date(startDate * 1000)} and ${new Date(endDate * 1000)}`,
  )

  try {
    const customers = await stripeClient.customers.list({
      created: {
        gte: startDate,
        lte: endDate,
      },
      limit: 100, // Adjust the limit as needed, Stripe's max is 100
    })

    const customerIdsToDelete: string[] = customers.data.map(
      (customer) => customer.id,
    )

    if (customerIdsToDelete.length === 0) {
      console.log(
        `No Stripe customers found created on ${year}-${month}-${day}.`,
      )
      return
    }

    console.log(
      `Found ${customerIdsToDelete.length} customers created on ${year}-${month}-${day}. Starting deletion process.`,
    )

    const batchSize = 10 // Adjust as needed
    for (let i = 0; i < customerIdsToDelete.length; i += batchSize) {
      const batch = customerIdsToDelete.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async (customerId) => {
          try {
            const deletedCustomer = await stripeClient.customers.del(customerId)
            console.log(`Successfully deleted customer: ${deletedCustomer.id}`)
          } catch (error: any) {
            console.error(
              `Error deleting customer ${customerId}:`,
              error.message,
            )
            // Consider adding more sophisticated error handling
          }
        }),
      )

      await delay(1000) // Adjust the delay as needed
      console.log(
        `Batch ${i / batchSize + 1} of deletions complete. Waiting...`,
      )
    }

    console.log('Stripe customer deletion process complete.')

    // Handle pagination if there are more than 'limit' customers
    if (customers.has_more) {
      console.warn(
        'There are more customers created on this date. Consider implementing pagination to delete all.',
      )
    }
  } catch (error: any) {
    console.error('Error listing Stripe customers:', error.message)
  }
}

// Specify the date for which you want to delete customers (April 30th, 2025)
const targetYear = 2025
const targetMonth = 4 // April is month 4
const targetDay = 30

deleteStripeCustomersByDate(targetYear, targetMonth, targetDay)
