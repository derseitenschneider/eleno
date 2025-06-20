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
      break
    case 'LICENSED_ACTIVE':
      badgeLabel = 'Aktiv'
      badgeVariant = 'default'
      break
    case 'INACTIVE':
      badgeLabel = 'Inaktiv'
      badgeVariant = 'inactive'
      break
  }
  return (
    <>
      <p>Status:</p>
      <Badge
        data-testid='subscription-status-badge'
        variant={badgeVariant}
        className='w-fit'
      >
        {badgeLabel}
      </Badge>
    </>
  )
}
