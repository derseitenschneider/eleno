import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'
import ButtonUpdateSubscription from './buttons/ButtonCustomerPortal.component'
import ButtonCancelSubscription from './buttons/ButtonCancelSubscription.component'
import ButtonReactivateSubscription from './buttons/ButtonReactivateSubscription.component'

export function SubscriptionInfos() {
  const {
    periodStartLocalized,
    periodEndLocalized,
    isActiveSubscription,
    plan,
    subscription,
  } = useSubscription()

  let badgeVariant: 'default' | 'warning' | 'destructive' = 'default'
  let badgeLabel = 'Aktiv'
  if (
    isActiveSubscription &&
    subscription?.cancel_at_period_end &&
    !subscription.is_lifetime
  ) {
    badgeLabel = 'Auslaufend'
    badgeVariant = 'warning'
  }
  if (!isActiveSubscription) {
    badgeVariant = 'destructive'
    badgeLabel = 'Abgelaufen'
  }

  return (
    <div className='py-7 border-b border-hairline'>
      <div className='flex justify-between items-end'>
        <div className='grid grid-cols-[150px_1fr] gap-4 w-fit'>
          <p>Status:</p>
          <Badge variant={badgeVariant} className='w-fit'>
            {badgeLabel}
          </Badge>
          <p>Plan:</p>
          <p>{plan}</p>
          <p>Laufzeit:</p>
          {subscription?.is_lifetime ? (
            <p>&infin;</p>
          ) : (
            <p className={cn(!isActiveSubscription && 'text-warning')}>
              {periodStartLocalized} – {periodEndLocalized}
            </p>
          )}
        </div>
        <div className='flex flex-col items-end gap-2'>
          <ButtonUpdateSubscription />
          <ButtonCancelSubscription />
          <ButtonReactivateSubscription />
        </div>
      </div>
    </div>
  )
}
