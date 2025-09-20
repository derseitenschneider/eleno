import {
  CalendarPlus,
  CheckSquare2,
  Music,
  StickyNote,
  User,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CreateGroupDialogDrawer } from '@/components/features/groups/CreateGroupDialogDrawer.component'
import { CreatePlannedLessonModal } from '@/components/features/lessons/planning/CreatePlannedLessonModal.component'
import { CreateNoteModal } from '@/components/features/notes/CreateNoteModal.component'
import { CreateRepertoireModal } from '@/components/features/repertoire/CreateRepertoireModal.component'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
import { CreateStudentDialogDrawer } from '@/components/features/students/CreateStudentDialogDrawer.component'
import { CreateTodoDialogDrawer } from '@/components/features/todos/CreateTodoDialogDrawer.component'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { ActionItem } from './ActionItem.component'
import useFeatureFlag from '@/hooks/useFeatureFlag'

export type ActionDrawerProps = {
  open: boolean
  onOpenChange: () => void
}

export function ActionDrawer({ open, onOpenChange }: ActionDrawerProps) {
  const isPlanningEnabled = useFeatureFlag('lesson-planning')
  const location = useLocation()
  const { currentLessonHolder } = useCurrentHolder()
  const [modalOpen, setModalOpen] = useState<
    | 'CREATE_STUDENT'
    | 'CREATE_GROUP'
    | 'CREATE_TODO'
    | 'PLAN_LESSON'
    | 'CREATE_NOTE'
    | 'CREATE_REPERTOIRE'
    | null
  >(null)

  // Check if we're on the lessons page
  const isOnLessonsPage = location.pathname.startsWith('/lessons')

  // Get holder name for dynamic descriptions
  let holderName = ''
  if (currentLessonHolder?.type === 's') {
    holderName = `${currentLessonHolder.holder.firstName} ${currentLessonHolder.holder.lastName}`
  } else if (currentLessonHolder?.type === 'g') {
    holderName = currentLessonHolder.holder.name
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle className='hidden'>Erstellen</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>Erstellen</DrawerDescription>
          <div className='space-y-6'>
            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_STUDENT')
              }}
              icon={<User />}
              title='Schüler:in hinzufügen'
              description='Füge eine neue Schüler:in hinzu.'
            />

            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_GROUP')
              }}
              icon={<Users />}
              title='Gruppe hinzufügen'
              description='Füge eine neue Gruppe hinzu.'
            />
          </div>

          {isOnLessonsPage && (
            <>
              <Separator className='my-4' />
              <div className='space-y-6'>
                {isPlanningEnabled && (
                  <ActionItem
                    onClick={() => {
                      setModalOpen('PLAN_LESSON')
                    }}
                    icon={<CalendarPlus />}
                    title='Lektion planen'
                    description={`Plane eine neue Lektion für ${holderName}.`}
                    bgColor='bg-[#6E6ED6]'
                  />
                )}

                <ActionItem
                  onClick={() => {
                    setModalOpen('CREATE_NOTE')
                  }}
                  icon={<StickyNote />}
                  title='Notiz erstellen'
                  description='Neue Notiz erstellen'
                  bgColor='bg-[#6E6ED6]'
                />

                <ActionItem
                  onClick={() => {
                    setModalOpen('CREATE_REPERTOIRE')
                  }}
                  icon={<Music />}
                  title='Song erfassen (Repertoire)'
                  description={`Füge einen neuen Song für ${holderName} hinzu.`}
                  bgColor='bg-[#6E6ED6]'
                />
              </div>
            </>
          )}

          <Separator className='my-4' />
          <div className='space-y-6'>
            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_TODO')
              }}
              icon={<CheckSquare2 />}
              title='Todo'
              description='Erfasse eine neue Todo.'
            />
          </div>
        </DrawerContent>
      </Drawer>

      <CreateStudentDialogDrawer
        onSuccess={() => setModalOpen(null)}
        open={modalOpen === 'CREATE_STUDENT'}
        onOpenChange={() => setModalOpen(null)}
      />

      <CreateGroupDialogDrawer
        onSuccess={() => setModalOpen(null)}
        open={modalOpen === 'CREATE_GROUP'}
        onOpenChange={() => setModalOpen(null)}
      />

      <CreateTodoDialogDrawer
        onSuccess={() => setModalOpen(null)}
        open={modalOpen === 'CREATE_TODO'}
        onOpenChange={() => setModalOpen(null)}
      />

      <CreatePlannedLessonModal
        open={modalOpen === 'PLAN_LESSON'}
        onOpenChange={() => setModalOpen(null)}
        onClose={() => setModalOpen(null)}
      />

      <CreateNoteModal
        open={modalOpen === 'CREATE_NOTE'}
        onOpenChange={() => setModalOpen(null)}
        onClose={() => setModalOpen(null)}
      />

      <CreateRepertoireModal
        open={modalOpen === 'CREATE_REPERTOIRE'}
        onOpenChange={() => setModalOpen(null)}
        onClose={() => setModalOpen(null)}
      />
    </>
  )
}
