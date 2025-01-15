import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import CancelSubscription from './CancelSubscription.component'
import { useState } from 'react'
import { useSubscription } from '@/services/context/SubscriptionContext'
import ReactivateSubscription from './ReactivateSubscription.component'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import ButtonCustomerPortal from './ButtonCustomerPortal.component'
import ButtonUpdatePlan from './ButtonUpdatePlan.component'
import ButtonCheckoutMonthly from './ButtonCheckoutMonthly.component'
import ButtonCheckoutYearly from './ButtonCheckoutYearly.component'
import ButtonCheckoutLifetime from './ButtonCheckoutLifetime.component'

export function SubscriptionInfos() {
  const {
    periodStartLocalized,
    periodEndLocalized,
    subscriptionIsActive,
    plan,
    isTrial,
    subscription,
  } = useSubscription()
  const [modalOpen, setModalOpen] = useState<
    'CANCEL' | 'REACTIVATE' | 'PAYMENT_METHODS' | null
  >(null)

  let badgeVariant: 'default' | 'warning' | 'destructive' = 'default'
  let badgeLabel = 'Aktiv'
  if (
    subscriptionIsActive &&
    subscription?.subscription_status === 'canceled'
  ) {
    badgeLabel = 'Auslaufend'
    badgeVariant = 'warning'
  }
  if (!subscriptionIsActive) {
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
            <p>Laufzeit</p>
            <p className={cn(!subscriptionIsActive && 'text-warning')}>
              {periodStartLocalized} – {periodEndLocalized}
            </p>
          </div>
        </Card>
        {subscriptionIsActive &&
          !isTrial &&
          subscription?.subscription_status !== 'canceled' && (
            <Button
              size='sm'
              variant='destructive'
              onClick={() => setModalOpen('CANCEL')}
            >
              Abo beenden
            </Button>
          )}
        {subscription?.subscription_status === 'canceled' && (
          <Button
            size='sm'
            variant='default'
            onClick={() => setModalOpen('REACTIVATE')}
          >
            Abo wiederherstellen
          </Button>
        )}
        <ButtonCustomerPortal />
        <ButtonUpdatePlan />
        <ButtonCheckoutMonthly />
        <ButtonCheckoutYearly />
        <ButtonCheckoutLifetime />
      </div>
      <Dialog
        open={modalOpen === 'CANCEL'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DialogContent>
          <CancelSubscription onCloseModal={() => setModalOpen(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalOpen === 'REACTIVATE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DialogContent>
          <ReactivateSubscription onCloseModal={() => setModalOpen(null)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
