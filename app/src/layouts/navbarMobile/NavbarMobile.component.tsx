import Logo from '../../components/ui/Logo.component'

import NavbarMobileItem from './NavbarMobileItem.component'
import {
  CheckSquare2,
  Gauge,
  GaugeCircle,
  GraduationCap,
  Home,
  HomeIcon,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Settings,
} from 'lucide-react'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import useTodosQuery from '@/components/features/todos/todosQuery'
import { useUser } from '@/services/context/UserContext'

function NavbarMobile() {
  const { logout } = useUser()
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
    <nav className='bg-background50/65 backdrop-blur px-5 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] md:hidden md:pointer-events-none block pointer-events-auto visible z-50 fixed h-[58px] bottom-0 left-0 right-0 max-w-screen'>
      <ul className='flex justify-between items-center h-full w-full'>
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
          isActive={window.location.pathname.includes('lessons')}
          to={`/lessons/${currentHolderQuery}`}
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
            <Settings
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
