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
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import UpdateGroup from '../../groups/UpdateGroup.component'
import { PencilIcon } from 'lucide-react'

export default function AddGroup({ onSuccess }: { onSuccess: () => void }) {
  const [modalOpen, setModalOpen] = useState<'CREATE' | 'UPDATE' | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<number>()
  const { activeSortedHolders } = useLessonHolders()

  const groups = activeSortedHolders.filter((holder) => holder.type === 'g')

  function openUpdateModal(id: number) {
    setSelectedGroup(id)
    setModalOpen('UPDATE')
  }

  return (
    <>
      <h2>Gruppen erfassen</h2>
      <div className='flex flex-col space-y-4'>
        {groups.length === 0 ? (
          <>
            <p>
              Falls du Gruppen, Ensembles, Bands etc. unterrichtest, kannst du
              diese ebenfalls bereits erfassen.
            </p>

            <Button
              type='button'
              size='sm'
              onClick={() => setModalOpen('CREATE')}
              className='ml-auto'
            >
              Gruppe erfassen
            </Button>
          </>
        ) : (
          <div className='flex flex-col space-y-4'>
            <p>
              Gratulation, nun hast du {groups.length}{' '}
              {groups.length === 1 ? 'Gruppe' : 'Gruppen'} erfasst:
            </p>
            <ul className=''>
              {groups.map((group) => (
                <li
                  key={group.holder.id}
                  className='grid grid-cols-[180px_1fr] items-center'
                >
                  <span>- {group.holder.name}</span>
                  <Button
                    className='flex gap-1 items-center text-primary w-fit'
                    size='sm'
                    variant='ghost'
                    onClick={() => openUpdateModal(group.holder.id)}
                  >
                    <PencilIcon className='size-3' />
                    Bearbeiten
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              className='ml-auto'
              size='sm'
              onClick={() => setModalOpen('CREATE')}
            >
              Weitere erfassen
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={modalOpen === 'CREATE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schüler:innen erfassen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Erfasse neue Schüler:innen
          </DialogDescription>
          <CreateGroup onSuccess={() => setModalOpen(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalOpen === 'UPDATE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gruppe bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bearbeite eine Gruppe
          </DialogDescription>
          <UpdateGroup
            groupId={selectedGroup || 0}
            onSuccess={() => setModalOpen(null)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
