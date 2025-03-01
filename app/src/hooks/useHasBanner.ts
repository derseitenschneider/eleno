import { isDemoMode } from '@/config'
import useIsOnline from './useIsOnline'
import { useSubscription } from '@/services/context/SubscriptionContext'

export default function useHasBanner() {
  const isOnline = useIsOnline()
  const { subscriptionState } = useSubscription()
  return (
    !isOnline ||
    isDemoMode ||
    subscriptionState === 'TRIAL_ACTIVE' ||
    subscriptionState === 'TRIAL_EXPIRED' ||
    subscriptionState === 'SUBSCRIPTION_ACTIVE_EXPIRED' ||
    subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED'
  )
}
