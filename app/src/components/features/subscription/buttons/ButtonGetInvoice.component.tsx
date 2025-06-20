import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useState } from 'react'

export default function ButtonGetInvoice() {
  const { subscription, subscriptionState } = useSubscription()
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
        `${appConfig.apiUrl}/stripe/customers/${subscription?.stripe_customer_id}/invoice`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoiceId: subscription?.stripe_invoice_id,
          }),
        },
      )

      const data = await res.json()
      if (data.status !== 'success') throw new Error()
      if (data.data?.invoiceUrl) {
        window.open(`${data.data.invoiceUrl}&locale=${userLocale}`, '_blank')
      }

      setStatus('IDLE')
    } catch (e) {
      setStatus('ERROR')
    }
  }
  if (subscriptionState !== 'LIFETIME' || !subscription?.needs_stripe_customer)
    return null
  return (
    <div className=''>
      <Button
        data-testid='button-invoice-lifetime'
        size='sm'
        className='flex gap-2'
        onClick={getPaymentUpdateLink}
        disabled={status === 'LOADING'}
        variant='outline'
      >
        Rechnung herunterladen
        {status === 'LOADING' && <MiniLoader />}
      </Button>
      {status === 'ERROR' && (
        <span className='mt-4 block text-sm text-warning'>
          Etwas ist schiefgelaufen. Bitte versuch's nochmal.
        </span>
      )}
    </div>
  )
}
