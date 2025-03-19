import supabaseAdmin from './supabaseAdmin.ts'

export async function expireSubscription(userId: string) {
  console.log('Expiring user subscription')

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
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}
