import type {
  RealtimePostgresChangesPayload,
  RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import useSubscriptionQuery from '@/components/features/subscription/subscriptionQuery'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import { getSubscriptionState } from '@/utils/getSubscriptionState'
import type { ContextTypeSubscription, Subscription } from '../../types/types'
import supabase from '../api/supabase'
import { useUserLocale } from './UserLocaleContext'

export const SubscriptionContext = createContext<ContextTypeSubscription>({
  subscription: undefined,
  plan: '—',
  subscriptionState: '',
  hasAccess: false,
  periodStartLocalized: '',
  periodEndLocalized: '',
})

export type TSubscriptionPlan =
  | 'Monatlich'
  | 'Jährlich'
  | 'Lifetime'
  | 'Testabo'
  | 'Schullizenz'
  | '—'

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
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
  } else if (subscriptionState === 'LICENSED_ACTIVE') {
    plan = 'Schullizenz'
  } else if (subscription?.subscription_status === 'trial') {
    plan = 'Testabo'
  } else if (subscription?.plan === 'month') {
    plan = 'Monatlich'
  } else if (subscription?.plan === 'year') {
    plan = 'Jährlich'
  } else if (
    subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED' ||
    subscriptionState === 'INACTIVE'
  )
    plan = '—'

  // Update hasAccess whenever isPaymentFeatureEnabled or subscriptionState changes
  useEffect(() => {
    let access = true
    if (isPaymentFeatureEnabled) {
      if (
        subscriptionState === 'TRIAL_EXPIRED' ||
        subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED' ||
        subscriptionState === 'INACTIVE'
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

  const handleRealtime = useCallback(
    (data: RealtimePostgresChangesPayload<Subscription>) => {
      if (data.errors) {
        return fetchErrorToast()
      }
      queryClient.setQueryData(['subscription'], data.new)
    },
    [queryClient.setQueryData, fetchErrorToast],
  )
  const channel = supabase.channel('schema-db-changes').on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'stripe_subscriptions',
    },
    handleRealtime,
  )
  // .subscribe()
  // Set up Supabase realtime channel
  useEffect(() => {
    const subscriptionsChannel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { schema: 'public', event: 'UPDATE', table: 'stripe_subscriptions' },
        handleRealtime,
      )
    subscriptionsChannel.subscribe()

    return () => {
      subscriptionsChannel.unsubscribe()
    }
    // channel.subscribe()

    // return () => {
    //   subscription.unsubscribe()
    // }
  }, [channel.subscribe, channel.state])

  const value = {
    subscription,
    hasAccess,
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
