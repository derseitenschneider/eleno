import useTodosQuery from '@/components/features/todos/todosQuery'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import { cn } from '@/lib/utils'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useLoading } from '@/services/context/LoadingContext'
import {
  CheckSquare2,
  GaugeCircle,
  GraduationCap,
  PlusIcon,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { ActionDrawer } from './ActionDrawer.component'
import NavbarMobileItem from './NavbarMobileItem.component'

function NavbarMobile() {
  const [modalOpen, setModalOpen] = useState<'ACTION' | null>(null)
  const { isLoading } = useLoading()
  const { navigateToCurrentHolder } = useNavigateToHolder()
  const todos = useTodosQuery().data

  const todosDue = todos
    ?.filter((todo) => !todo.completed)
    ?.filter((todo) => {
      if (!todo.due) return false
      if (todo.due < new Date()) return true
      return false
    })

  const {
    activeSortedHolders: lessonHolders,
    currentLessonPointer: lessonPointer,
  } = useLessonHolders()
  const currentLessonHolder = lessonHolders[lessonPointer]
  let currentHolderQuery = 'no-students'
  if (currentLessonHolder) {
    currentHolderQuery = `${currentLessonHolder.type}-${currentLessonHolder.holder.id}`
  }

  return (
    <>
      <nav
        data-testid='mobile-nav'
        className={cn(
          isLoading ? 'bg-background50' : 'bg-background50/65 backdrop-blur',
          'padding-mobile-nav max-w-screen pointer-events-auto visible fixed bottom-0 left-0 right-0 z-50 block px-5 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] md:pointer-events-none md:hidden',
        )}
      >
        <ul className='flex h-full w-full items-center justify-between'>
          <NavbarMobileItem
            isActive={window.location.pathname === '/'}
            to='/'
            icon={
              <GaugeCircle
                size={10}
                strokeWidth={window.location.pathname === '/' ? 1.3 : 1}
              />
            }
          />

          <NavbarMobileItem
            isActive={window.location.pathname.includes('students')}
            to='/students'
            icon={
              <Users
                strokeWidth={
                  window.location.pathname.includes('settings') ? 1.3 : 1
                }
              />
            }
          />
          <NavbarMobileItem
            isButton
            onClick={() => setModalOpen('ACTION')}
            icon={
              <PlusIcon
                className='rounded-full bg-background200'
                strokeWidth={1}
              />
            }
          />
          <NavbarMobileItem
            isButton
            onClick={navigateToCurrentHolder}
            isActive={window.location.pathname.includes('lessons')}
            icon={
              <GraduationCap
                strokeWidth={
                  window.location.pathname.includes('lessons') ? 1.3 : 1
                }
              />
            }
          />

          <NavbarMobileItem
            isActive={window.location.pathname.includes('todos')}
            notificationContent={todosDue?.length}
            to='/todos'
            icon={
              <CheckSquare2
                strokeWidth={
                  window.location.pathname.includes('todos') ? 1.3 : 1
                }
              />
            }
          />
        </ul>
      </nav>
      <ActionDrawer
        open={modalOpen === 'ACTION'}
        onOpenChange={() => setModalOpen(null)}
      />
    </>
  )
}

export default NavbarMobile
