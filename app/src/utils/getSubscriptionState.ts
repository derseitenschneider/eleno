import type { Subscription } from '@/types/types'

export type TSubscriptionState =
  | 'TRIAL_ACTIVE'
  | 'TRIAL_EXPIRED'
  | 'SUBSCRIPTION_ACTIVE'
  | 'SUBSCRIPTION_ACTIVE_EXPIRED'
  | 'SUBSCRIPTION_ACTIVE_CANCELED'
  | 'SUBSCRIPTION_CANCELED_EXPIRED'
  | 'LIFETIME'
  | ''

export const getSubscriptionState = (
  subscription: Subscription | null | undefined,
): TSubscriptionState => {
  if (!subscription) {
    return '' // No subscription, return empty state
  }

  if (subscription.is_lifetime) {
    return 'LIFETIME'
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
      if (subscription.payment_status === 'canceled') {
        if (periodEnd && periodEnd < now) {
          return 'SUBSCRIPTION_CANCELED_EXPIRED'
        }
        return 'SUBSCRIPTION_ACTIVE_CANCELED'
      }
      if (periodEnd && periodEnd < now) {
        return 'SUBSCRIPTION_ACTIVE_EXPIRED'
      }
      return 'SUBSCRIPTION_ACTIVE'
    case 'canceled':
      if (periodEnd && periodEnd < now) {
        return 'SUBSCRIPTION_CANCELED_EXPIRED'
      }
      break
    default:
      return ''
  }

  return '' // Default case, return empty state
}
