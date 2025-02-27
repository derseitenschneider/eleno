import { Badge } from '@/components/ui/badge'
import { useSubscription } from '@/services/context/SubscriptionContext'

export default function StatusRow() {
  const { subscriptionState } = useSubscription()

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
    <>
      <p>Status:</p>
      <Badge variant={badgeVariant} className='w-fit'>
        {badgeLabel}
      </Badge>
    </>
  )
}
