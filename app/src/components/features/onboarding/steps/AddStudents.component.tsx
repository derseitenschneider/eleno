import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useState } from 'react'
import CreateStudents from '../../students/CreateStudents.component'
import UpdateStudents from '../../students/UpdateStudents.component'
import { ChevronLeft } from 'lucide-react'

export default function AddStudents() {
  const [modalOpen, setModalOpen] = useState<'CREATE' | 'EDIT' | null>(null)
  const { activeSortedHolders } = useLessonHolders()

  const students = activeSortedHolders.filter((holder) => holder.type === 's')

  return (
    <>
      <h2>Schüler:innen hinzufügen</h2>
      <div className='flex flex-col space-y-4'>
        {students.length === 0 ? (
          <>
            <p>
              Damit dein Unterricht reibungslos startet und du alle Infos sofort
              parat hast, ist es Zeit, deine Schüler:innen in Eleno einzutragen.
              So ist alles perfekt vorbereitet für eure nächste gemeinsame
              Stunde!
            </p>

            <Button
              type='button'
              size='sm'
              onClick={() => setModalOpen('CREATE')}
              className='ml-auto w-full'
            >
              Schüler:innen hinzufügen
            </Button>
          </>
        ) : (
          <div className='flex flex-col space-y-4'>
            <p>
              Wunderbar, du hast nun {students.length}{' '}
              {students.length === 1 ? 'Schüler:in' : 'Schüler:innen'}{' '}
              erfolgreich hinzugefügt! Dein Unterrichtsalltag wird so gleich
              viel übersichtlicher. Weiter geht's zum nächsten Schritt, um Eleno
              optimal für dich einzurichten.
            </p>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='hidden w-full sm:flex sm:w-auto'
                onClick={() => setModalOpen('EDIT')}
              >
                Schüler:innen bearbeiten
              </Button>
              <Button
                className='w-full sm:w-auto'
                size='sm'
                onClick={() => setModalOpen('CREATE')}
              >
                Mehr hinzufügen
              </Button>
            </div>
          </div>
        )}
      </div>

      <DrawerOrDialog
        open={modalOpen === 'CREATE'}
        onOpenChange={() => setModalOpen(null)}
        direction='right'
      >
        <DrawerOrDialogContent className='!w-screen sm:!w-auto'>
          <DrawerOrDialogClose asChild>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='size-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </DrawerOrDialogClose>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Schüler:in hinzufügen</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Füge neue Schüler:innen hinzu
          </DrawerOrDialogDescription>
          <CreateStudents onSuccess={() => setModalOpen(null)} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>

      <Dialog
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schüler:innen bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bearbeite bestehende Schüler:innen
          </DialogDescription>
          <UpdateStudents
            studentIds={students.map((student) => student.holder.id)}
            onSuccess={() => setModalOpen(null)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
