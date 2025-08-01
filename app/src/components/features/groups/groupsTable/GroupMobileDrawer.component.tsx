import { useState } from 'react'
import type { Group, Student } from '@/types/types'

import { Archive, ChevronRight, PencilIcon, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
// import { UpdateStudentsDialogDrawer } from '../../UpdateStudentDialogDrawer.component'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { useDeactivateGroups } from '../useDeactivateGroups'
import { UpdateGroupDialogDrawer } from '../UpdateGroupDialogDrawer.component'

interface GroupMobileDrawerProps {
  group: Group
}

export function GroupMobileDrawer({ group }: GroupMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | null>(null)
  const { isDeactivating, deactivateGroups } = useDeactivateGroups()

  return (
    <>
      <Drawer direction='right' open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
          <div className='flex w-full cursor-pointer items-center justify-between text-base'>
            <span>{group.name}</span>
            <ChevronRight className='size-4' />
          </div>
        </DrawerTrigger>
        <DrawerContent className='!w-screen p-4'>
          <DrawerClose>
            <X className='size-5' />
            <span className='sr-only'>Close</span>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>{group.name}</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>{group.name}</DrawerDescription>
          <Card>
            <CardContent>
              <div className='grid gap-4 py-6'>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold'>Tag</span>
                  <span>{group.dayOfLesson}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold'>Zeit</span>
                  <span>
                    {group.startOfLesson} - {group.endOfLesson}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold'>Ort</span>
                  <span>{group.location}</span>
                </div>

                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold'>
                    Schüler:innen
                  </span>
                  {group.students.length > 0 && (
                    <ul className='list-disc pl-4'>
                      {group.students.map((student) => (
                        <li key={student.name}>{student.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator className='my-6' />
          <div className='flex flex-col gap-3'>
            <Button
              onClick={() => setModalOpen('EDIT')}
              className='flex gap-2'
              size='sm'
            >
              <PencilIcon className='size-4' />
              Bearbeiten
            </Button>

            <div className='flex w-full items-center gap-2'>
              <Button
                className='flex w-full gap-2'
                size='sm'
                disabled={isDeactivating}
                variant='outline'
                onClick={() => deactivateGroups([group.id])}
              >
                <Archive className='h-4 w-4' />
                Archivieren
              </Button>
              {isDeactivating && <MiniLoader />}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <UpdateGroupDialogDrawer
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
        onSuccess={() => setModalOpen(null)}
        groupId={group.id}
      />
      {/* <UpdateStudentsDialogDrawer */}
      {/*   open={modalOpen === 'EDIT'} */}
      {/*   onOpenChange={() => setModalOpen(null)} */}
      {/*   onSuccess={() => setModalOpen(null)} */}
      {/*   studentIds={[student.id]} */}
      {/* /> */}
    </>
  )
}
