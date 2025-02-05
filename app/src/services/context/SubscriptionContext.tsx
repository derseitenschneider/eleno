import { createContext, useCallback, useContext, useState } from 'react'
import type { ContextTypeSubscription, Subscription } from '../../types/types'
import { getSubscriptionApi } from '../api/user.api'
import { useUserLocale } from './UserLocaleContext'
import supabase from '../api/supabase'
import type { RealtimePostgresUpdatePayload } from '@supabase/supabase-js'
import fetchErrorToast from '@/hooks/fetchErrorToast'

export const SubscriptionContext = createContext<ContextTypeSubscription>({
  isTrial: true,
  isLifetime: true,
  isCancelable: true,
  isSubscription: true,
  subscription: undefined,
  plan: '',
  periodStart: new Date(),
  periodEnd: new Date(),
  periodStartLocalized: '',
  periodEndLocalized: '',
  getSubscription: async () => { },
  isActiveSubscription: false,
})

export function SubscriptionProvider({
  children,
}: { children: React.ReactNode }) {
  const { userLocale } = useUserLocale()
  const [subscription, setSubscription] = useState<Subscription>()

  const subscriptionStatus = subscription?.subscription_status || ''
  const isTrial = subscriptionStatus === 'trial'
  const isLifetime = subscription?.is_lifetime || false
  const isCancelable = subscriptionStatus === 'active'
  const isSubscription =
    (subscriptionStatus === 'active' || subscriptionStatus === 'canceled') &&
    !isLifetime

  let plan = ''
  if (subscription?.subscription_status === 'trial') {
    plan = 'Testabo'
  } else if (subscription?.is_lifetime) {
    plan = '🚀 Lifetime'
  } else if (subscription?.plan === 'month') {
    plan = 'Monatlich'
  } else plan = 'Jährlich'

  let isActiveSubscription: boolean
  let startDate = ''
  let endDate = ''

  if (isTrial) {
    startDate = subscription?.trial_start || ''
    endDate = subscription?.trial_end || ''
  } else if (!isLifetime) {
    startDate = subscription?.period_start || ''
    endDate = subscription?.period_end || ''
  }

  const periodStart = new Date(startDate)
  const periodEnd = new Date(endDate)

  if (periodEnd >= new Date() || subscription?.is_lifetime) {
    isActiveSubscription = true
  } else {
    isActiveSubscription = false
  }

  const periodStartLocalized = periodStart.toLocaleString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const periodEndLocalized = periodEnd.toLocaleString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const getSubscription = useCallback(async (userId: string) => {
    try {
      const subscription = await getSubscriptionApi(userId)
      setSubscription(subscription)
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  function handleRealtime(data: RealtimePostgresUpdatePayload<Subscription>) {
    if (data.errors) {
      return fetchErrorToast()
    }
    setSubscription(data.new)
  }

  supabase
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

  const value = {
    subscription,
    isLifetime,
    isCancelable,
    isSubscription,
    plan,
    getSubscription,
    isActiveSubscription,
    periodStart,
    periodEnd,
    periodStartLocalized,
    periodEndLocalized,
    isTrial,
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
