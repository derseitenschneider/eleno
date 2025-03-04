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
          {periodStartLocalized} – {periodEndLocalized}
        </p>
      )}
    </>
  )
}
