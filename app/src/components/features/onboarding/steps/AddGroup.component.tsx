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
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function AddGroup({ onSuccess }: { onSuccess: () => void }) {
  const [modalOpen, setModalOpen] = useState<'CREATE' | 'UPDATE' | null>(null)
  const isMobile = useIsMobileDevice()
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
              Unterrichtest du Ensembles, Bands oder andere Gruppen? Dann kannst
              du sie hier in Eleno eintragen. So behältst du nicht nur bei
              Einzel-, sondern auch bei Gruppenstunden immer den perfekten
              Überblick und sparst wertvolle Zeit bei der Organisation.
            </p>

            <Button
              type='button'
              size='sm'
              onClick={() => setModalOpen('CREATE')}
              className='ml-auto w-full sm:w-auto'
            >
              Gruppe erfassen
            </Button>
          </>
        ) : (
          <div className='flex flex-col space-y-4'>
            <p>
              Super, du hast {groups.length}{' '}
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
                    className='hidden w-fit items-center gap-1 text-primary sm:flex'
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
              className='ml-auto w-full sm:w-auto'
              size='sm'
              onClick={() => setModalOpen('CREATE')}
            >
              Weitere erfassen
            </Button>
          </div>
        )}
      </div>
      {isMobile ? (
        <Drawer
          open={modalOpen === 'CREATE'}
          onOpenChange={() => setModalOpen(null)}
        >
          <DrawerContent>
            <DrawerHeader className='text-left'>
              <DrawerTitle>Gruppe erfassen</DrawerTitle>
              <DrawerDescription className='hidden'>
                Erfasse eine neue Gruppe
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea>
              <CreateGroup onSuccess={() => setModalOpen(null)} />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      ) : (
        <>
          <Dialog
            open={modalOpen === 'CREATE'}
            onOpenChange={() => setModalOpen(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gruppe erfassen</DialogTitle>
              </DialogHeader>
              <DialogDescription className='hidden'>
                Erfasse eine neue Gruppe
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
      )}
    </>
  )
}
