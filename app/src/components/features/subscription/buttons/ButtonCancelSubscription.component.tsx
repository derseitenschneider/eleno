import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useState } from 'react'
import CancelSubscription from '../CancelSubscription.component'

export default function ButtonCancelSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { hasAccess, isTrial, isLifetime, subscription } =
    useSubscription()
  if (
    !hasAccess ||
    isTrial ||
    isLifetime ||
    subscription?.cancel_at_period_end
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
