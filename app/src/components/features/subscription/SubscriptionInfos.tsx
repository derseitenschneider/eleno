import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/services/context/SubscriptionContext'
import ButtonUpdateSubscription from './buttons/ButtonCustomerPortal.component'
import ButtonCancelSubscription from './buttons/ButtonCancelSubscription.component'
import ButtonReactivateSubscription from './buttons/ButtonReactivateSubscription.component'
import ButtonGetInvoice from './buttons/ButtonGetInvoice.component'
import { Infinity as InfinityLogo } from 'lucide-react'
import PaymentFailedNotification from './PaymentFailedNotification.component'

export function SubscriptionInfos() {
  const {
    periodStartLocalized,
    periodEndLocalized,
    hasAccess,
    plan,
    subscriptionState,
  } = useSubscription()

  let badgeVariant: 'default' | 'warning' | 'destructive' | 'inactive' =
    'default'
  let badgeLabel: 'Aktiv' | 'Auslaufend' | 'Abgelaufen' | 'Inaktiv' = 'Aktiv'

  switch (subscriptionState) {
    case 'SUBSCRIPTION_ACTIVE_CANCELED':
      badgeLabel = 'Auslaufend'
      badgeVariant = 'warning'
      break
    case 'SUBSCRIPTION_CANCELED_EXPIRED':
      badgeLabel = 'Inaktiv'
      badgeVariant = 'inactive'
      break
    case 'TRIAL_EXPIRED':
      badgeLabel = 'Inaktiv'
      badgeVariant = 'inactive'
      break
    case 'SUBSCRIPTION_ACTIVE_EXPIRED':
      badgeLabel = 'Abgelaufen'
      badgeVariant = 'destructive'
  }

  return (
    <div className='py-7 border-b border-hairline'>
      <div className='sm:flex justify-between items-start'>
        <div className='grid items-start grid-cols-[150px_1fr] gap-4 w-fit'>
          <p>Status:</p>
          <Badge variant={badgeVariant} className='w-fit'>
            {badgeLabel}
          </Badge>
          <p>Plan:</p>
          <p>{plan}</p>
          <p>Laufzeit:</p>
          {subscriptionState === 'SUBSCRIPTION_CANCELED_EXPIRED' ? (
            '—'
          ) : subscriptionState === 'LIFETIME' ? (
            <InfinityLogo className='text-primary' />
          ) : (
            <p className={cn(!hasAccess && 'text-warning')}>
              {periodStartLocalized} – {periodEndLocalized}
            </p>
          )}
          <ButtonGetInvoice />
        </div>
        <div className='sm:flex flex-col items-end gap-5'>
          <PaymentFailedNotification />
          <div className='flex flex-col sm:flex-row gap-4 '>
            <ButtonUpdateSubscription />
            <ButtonCancelSubscription />
            <ButtonReactivateSubscription />
          </div>
        </div>
      </div>
    </div>
  )
}
