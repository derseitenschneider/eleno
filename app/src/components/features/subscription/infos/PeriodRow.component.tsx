import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'

export default function PeriodRow() {
  const {
    subscriptionState,
    hasAccess,
    periodStartLocalized,
    periodEndLocalized,
  } = useSubscription()
  if (subscriptionState === 'LIFETIME') return null
  return (
    <>
      <p>Laufzeit:</p>
      {subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED' ? (
        '—'
      ) : (
        <p className={cn(!hasAccess && 'text-warning')}>
          <span
            className='text-[inherit]'
            data-testid='subscription-period-start'
          >
            {periodStartLocalized}
          </span>
          {' – '}
          <span
            className='text-[inherit]'
            data-testid='subscription-period-end'
          >
            {periodEndLocalized}
          </span>
        </p>
      )}
    </>
  )
}
