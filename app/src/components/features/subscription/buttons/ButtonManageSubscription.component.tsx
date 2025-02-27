import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { appConfig } from '@/config'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useEffect, useState } from 'react'

export default function ButtonManageSubscription() {
  const { subscription, subscriptionState } = useSubscription()
  const fetchErrorToast = useFetchErrorToast()
  const { userLocale } = useUserLocale()
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE')

  useEffect(() => {
    if (status === 'ERROR') {
      fetchErrorToast('test')
      setStatus('IDLE')
    }
  }, [fetchErrorToast, status])

  if (
    subscriptionState !== 'SUBSCRIPTION_ACTIVE' &&
    subscriptionState !== 'SUBSCRIPTION_ACTIVE_CANCELED' &&
    subscriptionState !== 'SUBSCRIPTION_ACTIVE_EXPIRED'
  )
    return null

  async function getPaymentUpdateLink() {
    setStatus('LOADING')
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch(
        `${appConfig.apiUrl}/stripe/customers/${subscription?.stripe_customer_id}/portal`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ locale: userLocale }),
        },
      )
      const data = await res.json()
      if (data.status !== 'success') throw new Error()
      const portalSession = data.data
      if (portalSession.url) {
        window.location.href = portalSession.url
      }

      setStatus('IDLE')
    } catch (e) {
      setStatus('ERROR')
    }
  }
  return (
    <div className='flex flex-col'>
      <Button
        size='sm'
        className='w-fit flex gap-2'
        onClick={getPaymentUpdateLink}
        disabled={status === 'LOADING'}
        variant='outline'
      >
        Abo verwalten
        {status === 'LOADING' && <MiniLoader />}
      </Button>
    </div>
  )
}
