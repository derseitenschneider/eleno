import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useState } from 'react'

export default function ButtonCheckoutMonthly() {
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

      const res = await fetch(`${appConfig.apiUrl}/sessions/create/monthly`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: subscription?.user_id,
          stripe_customer_id: subscription?.stripe_customer_id,
          locale: userLocale,
        }),
      })

      const data = await res.json()
      console.log(data)
      if (data.status !== 'success') throw new Error()
      const url = data.data.url
      if (url) {
        window.location.href = url
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
        Monatsabo
        {status === 'LOADING' && <MiniLoader />}
      </Button>
    </div>
  )
}
