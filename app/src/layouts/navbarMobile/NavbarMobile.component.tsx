import Logo from '../../components/ui/Logo.component'

import NavbarMobileItem from './NavbarMobileItem.component'
import {
  CheckSquare2,
  GaugeCircle,
  GraduationCap,
  LogOut,
  Settings2,
} from 'lucide-react'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import useTodosQuery from '@/components/features/todos/todosQuery'
import { useUser } from '@/services/context/UserContext'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'

function NavbarMobile() {
  const { logout } = useUser()
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
    <nav className='padding-mobile-nav max-w-screen pointer-events-auto visible fixed bottom-0 left-0 right-0 z-50 block bg-background50/65 px-5 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] backdrop-blur md:pointer-events-none md:hidden'>
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
          isActive={window.location.pathname.includes('todos')}
          notificationContent={todosDue?.length}
          to='/todos'
          icon={
            <CheckSquare2
              strokeWidth={window.location.pathname.includes('todos') ? 1.3 : 1}
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
          isActive={window.location.pathname.includes('settings')}
          to='/settings'
          icon={
            <Settings2
              strokeWidth={
                window.location.pathname.includes('settings') ? 1.3 : 1
              }
            />
          }
        />
        <NavbarMobileItem
          onClick={logout}
          isButton
          icon={<LogOut strokeWidth={1} />}
        />
      </ul>
    </nav>
  )
}

export default NavbarMobile
