import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import CancelSubscription from './CancelSubscription.component'
import { useState } from 'react'
import { useSubscription } from '@/services/context/SubscriptionContext'
import ReactivateSubscription from './ReactivateSubscription.component'
import ButtonUpdateSubscription from './buttons/ButtonCustomerPortal.component'
import PricingPlans from './PricingPlans.component'
import ButtonCancelSubscription from './buttons/ButtonCancelSubscription.component'
import ButtonReactivateSubscription from './buttons/ButtonReactivateSubscription.component'

export function SubscriptionInfos() {
  const {
    periodStartLocalized,
    periodEndLocalized,
    isActiveSubscription: isActiveSubscription,
    plan,
    isTrial,
    subscription,
    isLifetime,
  } = useSubscription()
  const [modalOpen, setModalOpen] = useState<
    'CANCEL' | 'REACTIVATE' | 'PAYMENT_METHODS' | null
  >(null)

  let badgeVariant: 'default' | 'warning' | 'destructive' = 'default'
  let badgeLabel = 'Aktiv'
  if (
    isActiveSubscription &&
    subscription?.subscription_status === 'canceled'
  ) {
    badgeLabel = 'Auslaufend'
    badgeVariant = 'warning'
  }
  if (!isActiveSubscription) {
    badgeVariant = 'destructive'
    badgeLabel = 'Abgelaufen'
  }

  return (
    <>
      <div className='py-7'>
        <Card className='py-4 px-6 mb-4 sm:w-fit'>
          <div className='grid grid-cols-[150px_1fr] gap-4 mb-6 w-fit'>
            <p>Status:</p>
            <Badge variant={badgeVariant} className='w-fit'>
              {badgeLabel}
            </Badge>
            <p>Plan:</p>
            <p>{plan}</p>
            <p>Laufzeit:</p>
            {subscription?.subscription_status === 'lifetime' ? (
              <p>&infin;</p>
            ) : (
              <p className={cn(!isActiveSubscription && 'text-warning')}>
                {periodStartLocalized} – {periodEndLocalized}
              </p>
            )}
          </div>
        </Card>
        <div className='flex gap-4 items-center'>
          <ButtonUpdateSubscription />
          <ButtonCancelSubscription />
          <ButtonReactivateSubscription />
        </div>
        <PricingPlans />
      </div>
    </>
  )
}
