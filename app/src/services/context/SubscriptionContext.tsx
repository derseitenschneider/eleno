import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ContextTypeSubscription, Subscription } from '../../types/types'
import { getSubscriptionApi } from '../api/user.api'
import { useUserLocale } from './UserLocaleContext'
import supabase from '../api/supabase'
import type { RealtimePostgresUpdatePayload } from '@supabase/supabase-js'
import fetchErrorToast from '@/hooks/fetchErrorToast'
import { getSubscriptionState } from '@/utils/getSubscriptionState'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import { useUser } from '@/services/context/UserContext'
import useSubscriptionQuery from '@/components/features/subscription/subscriptionQuery'

export const SubscriptionContext = createContext<ContextTypeSubscription>({
  subscription: undefined,
  plan: '—',
  subscriptionState: '',
  hasAccess: false,
  periodStartLocalized: '',
  periodEndLocalized: '',
  getSubscription: async () => { },
})

export type TSubscriptionPlan =
  | 'Monatlich'
  | 'Jährlich'
  | 'Lifetime'
  | 'Testabo'
  | '—'

export function SubscriptionProvider({
  children,
}: { children: React.ReactNode }) {
  const isPaymentFeatureEnabled = useFeatureFlag('stripe-payment')
  const { userLocale } = useUserLocale()
  const { data: subscription } = useSubscriptionQuery()
  const [hasAccess, setHasAccess] = useState(true)

  const subscriptionState = useMemo(
    () => getSubscriptionState(subscription),
    [subscription],
  )

  // Determine plan
  let plan: TSubscriptionPlan = '—'
  if (subscriptionState === 'LIFETIME') {
    plan = 'Lifetime'
  } else if (subscription?.subscription_status === 'trial') {
    plan = 'Testabo'
  } else if (subscription?.plan === 'month') {
    plan = 'Monatlich'
  } else if (subscription?.plan === 'year') {
    plan = 'Jährlich'
  } else if (subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED') plan = '—'

  // Update hasAccess whenever isPaymentFeatureEnabled or subscriptionState changes
  useEffect(() => {
    let access = true
    if (isPaymentFeatureEnabled) {
      if (
        subscriptionState === 'TRIAL_EXPIRED' ||
        subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED'
      ) {
        access = false
      }
    }
    setHasAccess(access)
  }, [isPaymentFeatureEnabled, subscriptionState])
  const periodStartLocalized = useMemo(
    () =>
      new Date(subscription?.period_start || '').toLocaleString(userLocale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [subscription?.period_start, userLocale],
  )

  const periodEndLocalized = useMemo(
    () =>
      new Date(subscription?.period_end || '').toLocaleString(userLocale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [subscription?.period_end, userLocale],
  )

  // const getSubscription = useCallback(async (userId: string) => {
  //   try {
  //     const subscription = await getSubscriptionApi(userId)
  //     setSubscription(subscription)
  //   } catch (error) {
  //     if (error instanceof Error) throw new Error(error.message)
  //   }
  // }, [])

  // Load subscription when user is available
  // useEffect(() => {
  //   if (currentUser?.id) {
  //     getSubscription(currentUser.id)
  //   }
  // }, [currentUser?.id, getSubscription])

  const handleRealtime = useCallback(
    (data: RealtimePostgresUpdatePayload<Subscription>) => {
      if (data.errors) {
        return fetchErrorToast()
      }
      setSubscription(data.new)
    },
    [],
  )

  // Set up Supabase subscription
  useEffect(() => {
    const subscription = supabase
      .channel('stripe_subscriptions')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stripe_subscriptions',
        },
        handleRealtime,
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [handleRealtime])

  const value = {
    subscription,
    hasAccess,
    // getSubscription,
    periodStartLocalized,
    periodEndLocalized,
    subscriptionState,
    plan,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
