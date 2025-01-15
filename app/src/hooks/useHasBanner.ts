import { isDemoMode } from '@/config'
import useIsOnline from './useIsOnline'
import { useSubscription } from '@/services/context/SubscriptionContext'

export default function useHasBanner() {
  const isOnline = useIsOnline()
  const { isTrial } = useSubscription()
  return !isOnline || isDemoMode || isTrial
}
