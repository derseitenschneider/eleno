import MiniLoader from '@/components/ui/MiniLoader.component'
import { Button, type ButtonProps } from '@/components/ui/button'
import { appConfig } from '@/config'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import supabase from '@/services/api/supabase'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useEffect, useState } from 'react'

type ButtonCheckoutMonthlyProps = ButtonProps & {
  currency: string
}

export default function ButtonCheckoutMonthly({
  children,
  currency,
  ...props
}: ButtonCheckoutMonthlyProps) {
  const { subscription } = useSubscription()
  const { userLocale } = useUserLocale()
  const fetchErrorToast = useFetchErrorToast()
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR'>('IDLE')

  useEffect(() => {
    if (status === 'ERROR') {
      fetchErrorToast()
      setStatus('IDLE')
    }
  }, [fetchErrorToast, status])

  async function getCheckoutSessionLink() {
    setStatus('LOADING')
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch(`${appConfig.apiUrl}/stripe/session/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: appConfig.priceIdMonthly,
          mode: 'subscription',
          user_id: subscription?.user_id,
          stripe_customer_id: subscription?.stripe_customer_id,
          locale: userLocale,
          currency,
        }),
      })

      const data = await res.json()
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
        data-testid='pricing-checkout-monthly'
        className='flex w-full gap-2'
        onClick={getCheckoutSessionLink}
        disabled={status === 'LOADING'}
        {...props}
      >
        {children}
        {status === 'LOADING' && (
          <MiniLoader
            color={
              props.variant === 'default' ? 'text-white' : 'text-primary/50'
            }
          />
        )}
      </Button>
    </div>
  )
}
