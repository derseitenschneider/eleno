import supabaseAdmin from './supabaseAdmin.ts'

export async function createSubscriptionRow(
  userId: string,
  stripeCustomerId: string,
) {
  console.log('Inserting new subscription row...')

  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + 30)

  const data = {
    user_id: userId,
    stripe_customer_id: stripeCustomerId,
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
