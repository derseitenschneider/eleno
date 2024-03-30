import { Analytics, logEvent } from '@firebase/analytics'
import { useCallback, useEffect, useState } from 'react'

import {
  IoBookOutline,
  IoCalendarOutline,
  IoCheckboxOutline,
  IoCompassOutline,
  IoLogOutOutline,
  IoPeopleCircleOutline,
  IoSchoolOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import {  NavLink } from 'react-router-dom'

import Logo from '../../components/ui/logo/Logo.component'
import { useClosestStudent } from '../../services/context/ClosestStudentContext'
import { useStudents } from '../../services/context/StudentContext'
import { useUser } from '../../services/context/UserContext'
import getClosestStudentIndex from '../../utils/getClosestStudentIndex'

import CountOverdueTodos from '../../components/ui/countOverdueTodos/CountOverdueTodos.component'
import analytics from '../../services/analytics/firebaseAnalytics'
import SidebarElement from '@/components/ui/SidebarElement.component'
import SidebarToggle from '@/components/ui/SidebarToggle.component'

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { setClosestStudentIndex } = useClosestStudent()
  const { activeStudents } = useStudents()
  const { logout } = useUser()

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const closeSidebarOnWindowClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element
      if (
        !target
          ?.closest('button')
          ?.classList.contains('sidebar__button--toggle')
      )
        toggleSidebar()
    },
    [toggleSidebar],
  )

  const handleLogEvent = (e: React.MouseEvent):void => {
    const target = e.target as HTMLElement
    const path = target.closest('a')?.pathname

    switch (path) {
      case '/':
        if (target.closest('a')?.target === '_blank')
          return logEvent(analytics, 'page_view', { page_title: 'manual' })

        setClosestStudentIndex(getClosestStudentIndex(activeStudents ?? []))
        return logEvent(analytics, 'page_view', { page_title: 'dashboard' })

      case '/lessons':
        return logEvent(analytics, 'page_view', { page_title: 'lessons' })

      case '/students':
        return logEvent(analytics, 'page_view', { page_title: 'students' })

      case '/timetable':
        return logEvent(analytics, 'page_view', { page_title: 'timetable' })

      case '/todos':
        return logEvent(analytics, 'page_view', { page_title: 'todos' })

      case '/settings':
        return logEvent(analytics, 'page_view', { page_title: 'todos' })

      default:
        return logEvent(analytics, 'page_view', {page_title: 'undefined'})
    }
  }
/*
  useEffect(() => {
    if (sidebarOpen) {
      window.addEventListener('click', closeSidebarOnWindowClick)
    }
    return () => {
      window.removeEventListener('click', closeSidebarOnWindowClick)
    }
  }, [closeSidebarOnWindowClick, sidebarOpen]) */

  return (
    <nav
      className={`bg-background50 fixed left-0 top-0 z-50 flex min-h-screen flex-col items-stretch
justify-start shadow-lg ${sidebarOpen ? 'w-[250px]' : 'w-[50px]'}`}
    >
      <SidebarToggle sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
      <NavLink to="/" className="block w-full">
        <div className='p-2 mb-8'>
          <Logo  />
        </div>
      </NavLink>
        <ul className="flex flex-col items-center justify-between">
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='/' name='Dashboard' icon={<IoCompassOutline/>} />
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='/lessons' name='Unterrichten' icon={<IoSchoolOutline/>} />
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='/students' name='Schüler:innen' icon={<IoPeopleCircleOutline
          />} />
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='/todos' name='Todos' icon={<IoCheckboxOutline/>} />
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='/timetable' name='Stundenplan' icon={<IoCalendarOutline/>} />
        </ul>

        <ul className='mt-auto border-t border-background200 flex flex-col items-center justify-between'>
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='https://manual.eleno.net' target={'_blank'} name='Anleitung' icon={<IoBookOutline/>} />
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='/settings' name='Einstellungen' icon={<IoSettingsOutline/>} />
          <SidebarElement sidebarOpen={sidebarOpen} handleNav={handleLogEvent} to='/logout' name='Log out' icon={<IoLogOutOutline/>} />
        </ul>
    </nav>
  )
}

export default Sidebar
