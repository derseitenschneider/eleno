import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useState } from 'react'
import ReactivateSubscription from '../ReactivateSubscription.component'

export default function ButtonReactivateSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { subscriptionState } = useSubscription()

  if (subscriptionState !== 'SUBSCRIPTION_ACTIVE_CANCELED') {
    return null
  }

  return (
    <>
      <Button size='sm' variant='default' onClick={() => setIsModalOpen(true)}>
        Abo wiederherstellen
      </Button>
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <ReactivateSubscription onCloseModal={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
