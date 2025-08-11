import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button } from '@/components/ui/button'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useState } from 'react'

export default function ButtonUpdatePlan() {
  const { subscription } = useSubscription()
  const { userLocale } = useUserLocale()
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE')

  async function getPaymentUpdateLink() {
    setStatus('LOADING')
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch(
        `${appConfig.apiUrl}/subscriptions/${subscription?.stripe_subscription_id}/update`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locale: userLocale,
            customer_id: subscription?.stripe_customer_id,
          }),
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
    <div>
      <Button
        size='sm'
        className='flex gap-2'
        onClick={getPaymentUpdateLink}
        disabled={status === 'LOADING'}
        variant='outline'
      >
        Plan ändern
        {status === 'LOADING' && <MiniLoader />}
      </Button>
    </div>
  )
}
