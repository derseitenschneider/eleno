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
  periodStartLocalized: '',
  periodEndLocalized: '',
  getSubscription: async () => { },
  whichPlan: () => '',
  hasAccess: () => false
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

  function hasAccess(): boolean {
    // Always false without subscription object.
    if (!subscription) return false

    // Always true with lifetime.
    if (isLifetime) return true;

    // False if subscription is cancelled and periodEnd is after today.
    const periodEnd = new Date(subscription.period_end || '')
    if (periodEnd < new Date() && subscription.subscription_status === 'canceled') {
      return false
    }

    // When in doubt, return false.
    return false
  }

  function whichPlan(): string {
    if (isLifetime) return 'Lifetime 🚀'
    if (isTrial) return 'Testabo'
    if (subscription?.plan === 'month') return 'Monatlich'

    return 'Jährlich'

  }

  const periodStartLocalized = new Date(subscription?.period_start || '').toLocaleString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const periodEndLocalized = new Date(subscription?.period_end || '').toLocaleString(userLocale, {
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
    hasAccess,
    whichPlan,
    isSubscription,
    getSubscription,
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
