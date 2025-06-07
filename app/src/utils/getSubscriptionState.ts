import type { Subscription } from '@/types/types'

export type TSubscriptionState =
  | 'TRIAL_ACTIVE'
  | 'TRIAL_EXPIRED'
  | 'SUBSCRIPTION_ACTIVE'
  | 'SUBSCRIPTION_ACTIVE_EXPIRED'
  | 'SUBSCRIPTION_ACTIVE_CANCELED'
  | 'SUBSCRIPTION_CANCELED_EXPIRED'
  | 'LIFETIME'
  | 'LICENSED_ACTIVE'
  | 'INACTIVE'
  | ''

export const getSubscriptionState = (
  subscription: Subscription | null | undefined,
): TSubscriptionState => {
  if (!subscription) {
    return '' // No subscription, return empty state
  }
  if (subscription.plan === null) {
    return 'INACTIVE'
  }

  if (subscription.plan === 'lifetime') {
    return 'LIFETIME'
  }
  if (subscription.plan === 'licensed') {
    if (subscription.subscription_status === 'active') {
      return 'LICENSED_ACTIVE'
    }
  }

  const periodEnd = subscription.period_end
    ? new Date(subscription.period_end)
    : null
  if (periodEnd) {
    periodEnd.setDate(periodEnd.getDate() + 1) // Add one day to match your logic
  }
  const now = new Date()

  switch (subscription.subscription_status) {
    case 'trial':
      if (periodEnd && periodEnd < now) {
        return 'TRIAL_EXPIRED'
      }
      return 'TRIAL_ACTIVE'
    case 'active':
      if (periodEnd && periodEnd < now) {
        return 'SUBSCRIPTION_ACTIVE_EXPIRED'
      }
      return 'SUBSCRIPTION_ACTIVE'
    case 'canceled':
      if (periodEnd && periodEnd < now) {
        return 'SUBSCRIPTION_CANCELED_EXPIRED'
      }
      return 'SUBSCRIPTION_ACTIVE_CANCELED'
    case 'expired':
      return 'SUBSCRIPTION_ACTIVE_EXPIRED'
    default:
      return ''
  }
}
