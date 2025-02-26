import {
  createContext,
  useCallback,
  useContext,
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

export const SubscriptionContext = createContext<ContextTypeSubscription>({
  subscription: undefined,
  plan: '',
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
  | 'Probeabo'
  | ''

export function SubscriptionProvider({
  children,
}: { children: React.ReactNode }) {
  const { userLocale } = useUserLocale()
  const [subscription, setSubscription] = useState<Subscription>()

  const subscriptionState = useMemo(
    () => getSubscriptionState(subscription),
    [subscription],
  )
  let plan: TSubscriptionPlan = ''

  if (subscriptionState === 'LIFETIME') plan = 'Lifetime'
  if (subscription?.subscription_status === 'trial') plan = 'Probeabo'
  if (subscription?.plan === 'month') plan = 'Monatlich'
  if (subscription?.plan === 'year') plan = 'Jährlich'

  const hasAccess =
    subscriptionState !== 'TRIAL_EXPIRED' &&
    subscriptionState !== 'SUBSCRIPTION_CANCELED_EXPIRED'

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

  const getSubscription = useCallback(async (userId: string) => {
    try {
      const subscription = await getSubscriptionApi(userId)
      setSubscription(subscription)
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  const handleRealtime = useCallback(
    (data: RealtimePostgresUpdatePayload<Subscription>) => {
      if (data.errors) {
        return fetchErrorToast()
      }
      setSubscription(data.new)
    },
    [],
  )

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
    hasAccess,
    getSubscription,
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
