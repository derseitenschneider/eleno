import { isDemoMode } from '@/config'
import useIsOnline from './useIsOnline'
import { useSubscription } from '@/services/context/SubscriptionContext'
import useFeatureFlag from './useFeatureFlag'

export default function useHasBanner() {
  const isOnline = useIsOnline()
  const isPaymentFlagEnabled = useFeatureFlag('stripe-payment')
  const { subscriptionState } = useSubscription()

  if (!isOnline) return true
  if (isDemoMode) return true

  if (!isPaymentFlagEnabled) return false

  if (
    subscriptionState === 'TRIAL_ACTIVE' ||
    subscriptionState === 'TRIAL_EXPIRED' ||
    subscriptionState === 'SUBSCRIPTION_ACTIVE_EXPIRED' ||
    subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED'
  ) {
    return true
  }

  return false
}
