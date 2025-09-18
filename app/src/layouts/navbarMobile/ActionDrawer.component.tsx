import { CheckSquare2, User, Users, X, BookOpen, StickyNote, Music } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CreateGroupDialogDrawer } from '@/components/features/groups/CreateGroupDialogDrawer.component'
import { CreateStudentDialogDrawer } from '@/components/features/students/CreateStudentDialogDrawer.component'
import { CreateTodoDialogDrawer } from '@/components/features/todos/CreateTodoDialogDrawer.component'
import { CreatePlannedLessonDrawer } from '@/components/features/lessons/planning/CreatePlannedLessonDrawer.component'
import { CreateNoteDrawer } from '@/components/features/notes/CreateNoteDrawer.component'
import { CreateRepertoireItemDrawer } from '@/components/features/repertoire/CreateRepertoireItemDrawer.component'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
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

export type ActionDrawerProps = {
  open: boolean
  onOpenChange: () => void
}

export function ActionDrawer({ open, onOpenChange }: ActionDrawerProps) {
  const location = useLocation()
  const { currentLessonHolder } = useCurrentHolder()
  const [modalOpen, setModalOpen] = useState<
    'CREATE_STUDENT' | 'CREATE_GROUP' | 'CREATE_TODO' | 
    'PLAN_LESSON' | 'CREATE_NOTE' | 'CREATE_REPERTOIRE' | null
  >(null)

  const isOnLessonsPage = location.pathname.includes('/lessons')

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
            <DrawerTitle>Erstellen</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>Erstellen</DrawerDescription>
          <div className='space-y-6'>
            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_STUDENT')
              }}
              icon={<User />}
              title='Schüler:in'
              description='Füge eine neue Schüler:in hinzu.'
            />

            <ActionItem
              onClick={() => {
                setModalOpen('CREATE_GROUP')
              }}
              icon={<Users />}
              title='Gruppe'
              description='Füge eine neue Gruppe hinzu.'
            />
          </div>
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
          {isOnLessonsPage && currentLessonHolder && (
            <>
              <Separator className='my-4' />
              <div className='space-y-6'>
                <ActionItem
                  onClick={() => {
                    setModalOpen('PLAN_LESSON')
                  }}
                  icon={<BookOpen />}
                  title='Lektion planen'
                  description='Plane eine neue Lektion.'
                />
                <ActionItem
                  onClick={() => {
                    setModalOpen('CREATE_NOTE')
                  }}
                  icon={<StickyNote />}
                  title='Notiz erfassen'
                  description='Erfasse eine neue Notiz.'
                />
                <ActionItem
                  onClick={() => {
                    setModalOpen('CREATE_REPERTOIRE')
                  }}
                  icon={<Music />}
                  title='Song erfassen (Repertoire)'
                  description='Füge einen neuen Song hinzu.'
                />
              </div>
            </>
          )}
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

      {isOnLessonsPage && currentLessonHolder && (
        <>
          <CreatePlannedLessonDrawer
            onSuccess={() => setModalOpen(null)}
            open={modalOpen === 'PLAN_LESSON'}
            onOpenChange={() => setModalOpen(null)}
          />

          <CreateNoteDrawer
            onSuccess={() => setModalOpen(null)}
            open={modalOpen === 'CREATE_NOTE'}
            onOpenChange={() => setModalOpen(null)}
            holderId={currentLessonHolder.holder.id}
            holderType={currentLessonHolder.type}
          />

          <CreateRepertoireItemDrawer
            onSuccess={() => setModalOpen(null)}
            open={modalOpen === 'CREATE_REPERTOIRE'}
            onOpenChange={() => setModalOpen(null)}
          />
        </>
      )}
    </>
  )
}
