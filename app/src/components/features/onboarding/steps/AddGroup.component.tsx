import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import CreateGroup from '../../groups/CreateGroup.component'
import { useState } from 'react'

export default function AddGroup({ onSuccess }: { onSuccess: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <h2>Gruppe erfassen</h2>
      <div className='flex flex-col space-y-4'>
        <p>
          Falls du Gruppe, Ensembles, Bands etc. unterrichtest kannst du die
          auch gleich zu Beginn erfassen.
        </p>

        <Button
          type='button'
          size='sm'
          onClick={() => setIsModalOpen(true)}
          className='ml-auto'
        >
          Gruppe erfassen
        </Button>
      </div>
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gruppe erfassen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Erfasse neue Gruppe
          </DialogDescription>
          <CreateGroup onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
