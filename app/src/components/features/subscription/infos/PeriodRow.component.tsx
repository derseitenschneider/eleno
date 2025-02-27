import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { InfinityIcon } from 'lucide-react'

export default function PeriodRow() {
  const {
    subscriptionState,
    hasAccess,
    periodStartLocalized,
    periodEndLocalized,
  } = useSubscription()
  return (
    <>
      <p>Laufzeit:</p>
      {subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED' ? (
        '—'
      ) : subscriptionState === 'LIFETIME' ? (
        <InfinityIcon className='text-primary' />
      ) : (
        <p className={cn(!hasAccess && 'text-warning')}>
          {periodStartLocalized} – {periodEndLocalized}
        </p>
      )}
    </>
  )
}
