import { isDemoMode } from '@/config'
import { useSubscription } from '@/services/context/SubscriptionContext'
import useFeatureFlag from './useFeatureFlag'
import useIsMobileDevice from './useIsMobileDevice'
import useIsOnline from './useIsOnline'

export default function useHasBanner() {
  const isOnline = useIsOnline()
  const isMobile = useIsMobileDevice()
  const isPaymentFlagEnabled = useFeatureFlag('stripe-payment')
  const { subscriptionState } = useSubscription()
  return false

  if (!isOnline) return true
  if (isDemoMode) return true

  if (!isPaymentFlagEnabled) return false

  if (
    !isMobile &&
    (subscriptionState === 'TRIAL_ACTIVE' ||
      subscriptionState === 'TRIAL_EXPIRED' ||
      subscriptionState === 'SUBSCRIPTION_ACTIVE_EXPIRED' ||
      subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED')
  ) {
    return true
  }

  return false
}
