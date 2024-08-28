import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

import Logo from '../../components/ui/Logo.component'
import { useLessonHolders } from '../../services/context/LessonHolderContext'
import { useUser } from '../../services/context/UserContext'

import useOutsideClick from '@/hooks/useOutsideClick'
import SidebarElement from '@/layouts/sidebar/SidebarElement.component'
import SidebarToggle from '@/layouts/sidebar/SidebarToggle.component'
import {
  BookMarked,
  CalendarDays,
  CheckSquare2,
  GaugeCircle,
  GraduationCap,
  LogOut,
  Settings,
  Users,
} from 'lucide-react'
import useTodosQuery from '@/components/features/todos/todosQuery'

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentLessonHolder } = useLessonHolders()
  const todos = useTodosQuery().data
  const { logout } = useUser()
  const overdueTodos = todos?.filter(
    (todo) => todo.due && todo?.due <= new Date() && !todo.completed,
  )

  let lessonSlug = 'no-student'

  if (currentLessonHolder) {
    lessonSlug = `${currentLessonHolder.type}-${currentLessonHolder.holder.id}`
  }

  const sidebarRef = useOutsideClick(() => setSidebarOpen(false))

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  return (
    <nav
      ref={sidebarRef}
      className={`hidden md:flex fixed left-0 top-0 z-50  min-h-screen flex-col items-stretch justify-start
      bg-background100 shadow-lg transition-width duration-150 ${sidebarOpen ? 'w-[180px]' : 'w-[50px]'
        }`}
    >
      <SidebarToggle sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <NavLink
        to='/'
        onClick={() => setSidebarOpen(false)}
        className='block w-full'
      >
        <div className='flex items-center justify-center mt-3 mb-8'>
          <Logo />
        </div>
      </NavLink>
      <ul className='flex flex-col items-center justify-between'>
        <SidebarElement
          isActive={window.location.pathname === '/'}
          sidebarOpen={sidebarOpen}
          onClick={() => setSidebarOpen(false)}
          to='/'
          name='Dashboard'
          icon={
            <GaugeCircle
              strokeWidth={window.location.pathname === '/' ? 2 : 1.5}
            />
          }
        />
        <SidebarElement
          isActive={window.location.pathname.includes('lessons')}
          onClick={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          to={`/lessons/${lessonSlug}`}
          name='Unterrichten'
          icon={
            <GraduationCap
              strokeWidth={
                window.location.pathname.includes('lessons') ? 2 : 1.5
              }
            />
          }
        />
        <SidebarElement
          isActive={window.location.pathname.includes('students')}
          onClick={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          to='/students'
          name='Schüler:innen'
          icon={
            <Users
              strokeWidth={
                window.location.pathname.includes('students') ? 2 : 1.5
              }
            />
          }
        />
        <SidebarElement
          isActive={window.location.pathname.includes('todos')}
          onClick={() => setSidebarOpen(false)}
          notificationContent={overdueTodos?.length}
          sidebarOpen={sidebarOpen}
          to='/todos'
          name='Todos'
          icon={
            <CheckSquare2
              strokeWidth={window.location.pathname.includes('todos') ? 2 : 1.5}
            />
          }
        />
        <SidebarElement
          isActive={window.location.pathname.includes('timetable')}
          onClick={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          to='/timetable'
          name='Stundenplan'
          icon={
            <CalendarDays
              strokeWidth={
                window.location.pathname.includes('timetable') ? 2 : 1.5
              }
            />
          }
        />
      </ul>

      <ul className='mt-auto flex flex-col items-center justify-between border-t border-background200'>
        <SidebarElement
          isActive={window.location.pathname.includes('settings')}
          onClick={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
          to='/settings'
          name='Einstellungen'
          icon={
            <Settings
              strokeWidth={
                window.location.pathname.includes('settings') ? 2 : 1.5
              }
            />
          }
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          onClick={() => setSidebarOpen(false)}
          to='https://manual.eleno.net'
          target={'_blank'}
          name='Anleitung'
          icon={<BookMarked strokeWidth={1.5} />}
        />
        <SidebarElement
          isButton
          onClick={() => logout()}
          sidebarOpen={sidebarOpen}
          name='Log out'
          icon={<LogOut strokeWidth={1.5} />}
        />
      </ul>
    </nav>
  )
}

export default Sidebar
