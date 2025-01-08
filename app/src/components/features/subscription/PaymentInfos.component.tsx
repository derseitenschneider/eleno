import { Button } from '@/components/ui/button'
import MiniLoader from '@/components/ui/MiniLoader.component'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useEffect, useState } from 'react'
import type { PaymentMethod } from '@stripe/stripe-js'
import PaymentDetail from './PaymentDetail.component'

interface PaymentInfosProps {
  onCloseModal?: () => void
}

function PaymentInfos({ onCloseModal }: PaymentInfosProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE')
  const [paymentMethods, setPaymentMethods] =
    useState<Array<PaymentMethod> | null>(null)
  const { subscription } = useSubscription()

  useEffect(() => {
    async function getPaymentMethods() {
      setStatus('LOADING')
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const token = session?.access_token

        const res = await fetch(
          `${appConfig.apiUrl}/customers/${subscription?.stripe_customer_id}/payment-methods`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        const data = await res.json()
        if (data.status !== 'success') throw new Error()
        setPaymentMethods(data.data.data)

        setStatus('IDLE')
      } catch (e) {
        setStatus('ERROR')
      }
    }
    getPaymentMethods()
  }, [subscription?.stripe_customer_id])

  return (
    <div className='w-[75vw]'>
      <DialogHeader>
        <DialogTitle>Zahlungsmethoden</DialogTitle>
      </DialogHeader>

      <DialogDescription className='mb-4'>
        Nachfolgend findest du deine erfassten Zahlungsmittel:
      </DialogDescription>
      {status === 'ERROR' && (
        <p className='mt-4 text-center text-sm text-warning'>
          Es ist etwas schiefgelaufen. Versuch's nochmal.
        </p>
      )}

      {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
      {paymentMethods !== null &&
        paymentMethods.map((method) => (
          <PaymentDetail key={method.id} paymentMethod={method} />
        ))}
    </div>
  )
}

export default PaymentInfos
