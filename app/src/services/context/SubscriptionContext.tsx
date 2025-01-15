import { createContext, useCallback, useContext, useState } from 'react'
import type { ContextTypeSubscription, Subscription } from '../../types/types'
import { getSubscriptionApi } from '../api/user.api'
import { useUserLocale } from './UserLocaleContext'

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
  getSubscription: async () => {},
  subscriptionIsActive: false,
})

export function SubscriptionProvider({
  children,
}: { children: React.ReactNode }) {
  const { userLocale } = useUserLocale()
  const [subscription, setSubscription] = useState<Subscription>()

  let plan = ''
  if (subscription?.subscription_status === 'trial') {
    plan = 'Testabo'
  } else if (subscription?.subscription_status === 'lifetime') {
    plan = 'Lifetime'
  } else if (subscription?.amount === 580) {
    plan = 'Monatlich'
  } else plan = 'Jährlich'

  const subscriptionStatus = subscription?.subscription_status || ''

  const isTrial = subscriptionStatus === 'trial'
  const isLifetime = subscriptionStatus === 'lifetime'
  const isCancelable = subscriptionStatus === 'active'
  const isSubscription =
    subscriptionStatus === 'active' || subscriptionStatus === 'canceled'

  let subscriptionIsActive: boolean
  let startDate = ''
  let endDate = ''

  if (isTrial) {
    startDate = subscription?.trial_start || ''
    endDate = subscription?.trial_end || ''
  } else if (plan === 'Monatlich') {
    startDate = subscription?.period_start || ''
    endDate = subscription?.period_end || ''
  }

  const periodStart = new Date(startDate)
  const periodEnd = new Date(endDate)
  if (
    periodEnd >= new Date() ||
    subscription?.subscription_status === 'lifetime'
  ) {
    subscriptionIsActive = true
  } else {
    subscriptionIsActive = false
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

  const value = {
    subscription,
    isLifetime,
    isCancelable,
    isSubscription,
    plan,
    getSubscription,
    subscriptionIsActive,
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
