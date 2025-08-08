import { useState } from 'react'
import type { Student } from '@/types/types'

import { Archive, ChevronLeft, ChevronRight, PencilIcon, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UpdateStudentsDialogDrawer } from '../../UpdateStudentDialogDrawer.component'
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
import { useDeactivateStudents } from '../../useDeactivateStudents'

interface StudentMobileDrawerProps {
  student: Student
}

export function StudentMobileDrawer({ student }: StudentMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | null>(null)
  const { isDeactivating, deactivateStudents } = useDeactivateStudents()

  let timeString = ''
  if (student.startOfLesson && student.endOfLesson) {
    timeString = `${student.startOfLesson} – ${student.endOfLesson}`
  } else if (student.startOfLesson) {
    timeString = `${student.startOfLesson}`
  } else {
    timeString = '–'
  }

  return (
    <>
      <Drawer
        modal={false}
        direction='right'
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
          <div className='flex w-full cursor-pointer items-center justify-between text-base'>
            <span>
              {student.firstName} {student.lastName}
            </span>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
          </div>
        </DrawerTrigger>
        <DrawerContent className='!w-screen p-4'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='size-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>
              {student.firstName} {student.lastName}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>
            {student.firstName} {student.lastName}
          </DrawerDescription>
          <Card>
            <CardContent>
              <div className='grid gap-4 py-6'>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Vorname
                  </span>
                  <span>{student.firstName}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Nachname
                  </span>
                  <span>{student.lastName}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Instrument
                  </span>
                  <span>{student.instrument}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Tag
                  </span>
                  <span>{student.dayOfLesson || '–'}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Zeit
                  </span>
                  <span>{timeString}</span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Ort
                  </span>
                  <span>{student.location || '–'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className='mt-6 flex flex-col gap-3'>
            <Button
              onClick={() => setModalOpen('EDIT')}
              className='flex w-full gap-2'
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
                onClick={() => deactivateStudents([student.id])}
              >
                <Archive className='h-4 w-4' />
                Archivieren
              </Button>
              {isDeactivating && <MiniLoader />}
            </div>

            <Button
              className='w-full'
              size='sm'
              variant='ghost'
              onClick={() => setIsOpen(false)}
            >
              Abbrechen
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <UpdateStudentsDialogDrawer
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
        onSuccess={() => setModalOpen(null)}
        studentIds={[student.id]}
      />
    </>
  )
}
