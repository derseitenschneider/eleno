import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import CreateStudents from '../../students/CreateStudents.component'
import { Button } from '@/components/ui/button'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import UpdateStudents from '../../students/UpdateStudents.component'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'

export default function AddStudents() {
  const [modalOpen, setModalOpen] = useState<'CREATE' | 'EDIT' | null>(null)
  const isMobile = useIsMobileDevice()
  const { activeSortedHolders } = useLessonHolders()

  const students = activeSortedHolders.filter((holder) => holder.type === 's')

  return (
    <>
      <h2>Schüler:innen erfassen</h2>
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
              Schüler:innen erfassen
            </Button>
          </>
        ) : (
          <div className='flex flex-col space-y-4'>
            <p>
              Wunderbar, du hast nun {students.length}{' '}
              {students.length === 1 ? 'Schüler:in' : 'Schüler:innen'}{' '}
              erfolgreich erfasst! Dein Unterrichtsalltag wird so gleich viel
              übersichtlicher. Weiter geht's zum nächsten Schritt, um Eleno
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
                Mehr erfassen
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* {isMobile ? ( */}
      {/*   <Drawer */}
      {/*     open={modalOpen === 'CREATE'} */}
      {/*     onOpenChange={() => setModalOpen(null)} */}
      {/*   > */}
      {/*     <DrawerContent> */}
      {/*       <DrawerHeader className='text-left'> */}
      {/*         <DrawerTitle>Schüler:in erfassen</DrawerTitle> */}
      {/*         <DrawerDescription className='hidden'> */}
      {/*           Erfasse eine:n neue:n Schüler:in */}
      {/*         </DrawerDescription> */}
      {/*       </DrawerHeader> */}
      {/*       <ScrollArea> */}
      {/*         <CreateStudents onSuccess={() => setModalOpen(null)} /> */}
      {/*       </ScrollArea> */}
      {/*     </DrawerContent> */}
      {/*   </Drawer> */}
      {/* ) : ( */}
      {/*   <> */}
      {/*     <Dialog */}
      {/*       open={modalOpen === 'CREATE'} */}
      {/*       onOpenChange={() => setModalOpen(null)} */}
      {/*     > */}
      {/*       <DialogContent> */}
      {/*         <DialogHeader> */}
      {/*           <DialogTitle>Schüler:innen erfassen</DialogTitle> */}
      {/*         </DialogHeader> */}
      {/*         <DialogDescription className='hidden'> */}
      {/*           Erfasse neue Schüler:innen */}
      {/*         </DialogDescription> */}
      {/*         <CreateStudents onSuccess={() => setModalOpen(null)} /> */}
      {/*       </DialogContent> */}
      {/*     </Dialog> */}
      {/**/}
      <DrawerOrDialog
        open={modalOpen === 'CREATE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Schüler:in erfassen</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Erfasse neue Schüler:innen
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
      {/*   </> */}
      {/* )} */}
    </>
  )
}
