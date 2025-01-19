import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useSubscription } from '@/services/context/SubscriptionContext'
import { useState } from 'react'
import ReactivateSubscription from '../ReactivateSubscription.component'

export default function ButtonReactivateSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { subscription, isLifetime } = useSubscription()
  if (!subscription?.cancel_at_period_end || isLifetime) return null

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
