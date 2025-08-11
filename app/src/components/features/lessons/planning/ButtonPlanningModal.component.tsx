import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { Button } from '@/components/ui/button'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import { usePlanLessons } from '@/services/context/LessonPlanningContext'
import { CalendarClockIcon, X } from 'lucide-react'
import { useState } from 'react'
import useCurrentHolder from '../useCurrentHolder'
import { CreatePlannedLessonForm } from './CreatePlannedLessonForm.component'

export function ButtonPlanningModal() {
  const [modalOpen, setModalOpen] = useState<'PLAN' | null>(null)
  const isPlanningEnabled = useFeatureFlag('lesson-planning')
  const { setSelectedForUpdating } = usePlanLessons()
  const { currentLessonHolder } = useCurrentHolder()
  let holderName = ''

  if (currentLessonHolder?.type === 's') {
    holderName = `${currentLessonHolder.holder.firstName} ${currentLessonHolder.holder.lastName}`
  } else if (currentLessonHolder?.type === 'g') {
    holderName = currentLessonHolder.holder.name
  }

  function closeModal() {
    setModalOpen(null)
    setSelectedForUpdating(null)
  }

  if (!isPlanningEnabled) return null

  return (
    <>
      <Button
        onClick={() => setModalOpen('PLAN')}
        variant='ghost'
        size='sm'
        className='gap-2 font-normal'
      >
        <CalendarClockIcon className='size-4 text-primary' />
        Lektionsplanung
      </Button>
      <DrawerOrDialog open={modalOpen === 'PLAN'} onOpenChange={closeModal}>
        <DrawerOrDialogContent className='md:max-h-[80vh] lg:overflow-hidden'>
          <DrawerOrDialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerOrDialogClose>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>
              Lektionen für {holderName} planen
            </DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Bereite eine Lektion vor
          </DrawerOrDialogDescription>
          <div className='md:w-[80vw]'>
            <CreatePlannedLessonForm onClose={closeModal} />
          </div>
        </DrawerOrDialogContent>
      </DrawerOrDialog>
    </>
  )
}
