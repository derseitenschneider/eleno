import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

import Logo from '../../components/ui/logo/Logo.component'
import { useLessonHolders } from '../../services/context/LessonPointerContext'
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

  // TODO: Fix opacity delay link names

  return (
    <nav
      ref={sidebarRef}
      className={`hidden md:flex fixed left-0 top-0 z-50  min-h-screen flex-col items-stretch justify-start
      bg-background50 shadow-lg transition-width duration-150 ${
        sidebarOpen ? 'w-[180px]' : 'w-[50px]'
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
          sidebarOpen={sidebarOpen}
          to='/'
          name='Dashboard'
          icon={<GaugeCircle strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          to={`/lessons/${lessonSlug}`}
          name='Unterrichten'
          icon={<GraduationCap strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          to='/students'
          name='Schüler:innen'
          icon={<Users strokeWidth={1.5} />}
        />
        <SidebarElement
          notificationContent={overdueTodos?.length}
          sidebarOpen={sidebarOpen}
          to='/todos'
          name='Todos'
          icon={<CheckSquare2 strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          to='/timetable'
          name='Stundenplan'
          icon={<CalendarDays strokeWidth={1.5} />}
        />
      </ul>

      <ul className='mt-auto flex flex-col items-center justify-between border-t border-background200'>
        <SidebarElement
          sidebarOpen={sidebarOpen}
          to='/settings'
          name='Einstellungen'
          icon={<Settings strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          to='https://manual.eleno.net'
          target={'_blank'}
          name='Anleitung'
          icon={<BookMarked strokeWidth={1.5} />}
        />
        <SidebarElement
          onClick={() => logout()}
          sidebarOpen={sidebarOpen}
          to='/logout'
          name='Log out'
          icon={<LogOut strokeWidth={1.5} />}
        />
      </ul>
    </nav>
  )
}

export default Sidebar
