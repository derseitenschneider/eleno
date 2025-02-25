import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'
import ButtonUpdateSubscription from './buttons/ButtonCustomerPortal.component'
import ButtonCancelSubscription from './buttons/ButtonCancelSubscription.component'
import ButtonReactivateSubscription from './buttons/ButtonReactivateSubscription.component'
import ButtonGetInvoice from './buttons/ButtonGetInvoice.component'

export function SubscriptionInfos() {
  const {
    periodStartLocalized,
    periodEndLocalized,
    subscription,
    hasAccess,
    whichPlan,
    isLifetime,
  } = useSubscription()

  let badgeVariant: 'default' | 'warning' | 'destructive' = 'default'
  let badgeLabel = 'Aktiv'
  if (
    hasAccess() &&
    subscription?.subscription_status === 'canceled' &&
    !subscription.is_lifetime
  ) {
    badgeLabel = 'Auslaufend'
    badgeVariant = 'warning'
  }
  if (!hasAccess()) {
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
          <p>{whichPlan()}</p>
          <p>Laufzeit:</p>
          {subscription?.is_lifetime ? (
            <p>&infin;</p>
          ) : (
            <p className={cn(!hasAccess() && 'text-warning')}>
              {periodStartLocalized} – {periodEndLocalized}
            </p>
          )}
          {isLifetime && <ButtonGetInvoice />}
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
