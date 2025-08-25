import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useSubscription } from '@/services/context/SubscriptionContext'
import CancelSubscription from '../CancelSubscription.component'

export default function ButtonCancelSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { subscriptionState } = useSubscription()
  if (
    subscriptionState !== 'SUBSCRIPTION_ACTIVE' &&
    subscriptionState !== 'SUBSCRIPTION_ACTIVE_EXPIRED'
  )
    return null

  return (
    <>
      <Button
        size='sm'
        variant='destructive'
        onClick={() => setIsModalOpen(true)}
      >
        Abo kündigen
      </Button>
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <CancelSubscription onCloseModal={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
