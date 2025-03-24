import { useSubscription } from '@/services/context/SubscriptionContext'

export default function PaymentFailedNotification() {
  const { subscriptionState } = useSubscription()
  if (subscriptionState !== 'SUBSCRIPTION_ACTIVE_EXPIRED') return null

  return (
    <div
      data-testid='notification-payment-failed'
      className='w-[400px] rounded-md border border-warning bg-warning/5 p-4'
    >
      <h5 className='text-warning'>Zahlung fehlgeschlagen</h5>
      <p className='mt-2 text-sm'>
        Bitte klicke auf <span className='font-medium'>"Abo verwalten"</span>{' '}
        und passe deine Zahlungsinformationen an, damit der nächste
        Zahlungsversuch funktioniert.
      </p>
    </div>
  )
}
