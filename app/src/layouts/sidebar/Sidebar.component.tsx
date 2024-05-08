import { logEvent } from "@firebase/analytics"
import { useCallback, useState } from "react"
import {
  IoBookOutline,
  IoCalendarOutline,
  IoCheckboxOutline,
  IoCompassOutline,
  IoLogOutOutline,
  IoPeopleCircleOutline,
  IoSchoolOutline,
  IoSettingsOutline,
} from "react-icons/io5"
import { NavLink } from "react-router-dom"

import Logo from "../../components/ui/logo/Logo.component"
import { useClosestStudent } from "../../services/context/ClosestStudentContext"
import { useStudents } from "../../services/context/StudentContext"
import { useUser } from "../../services/context/UserContext"
import getClosestStudentIndex from "../../utils/getClosestStudentIndex"

import analytics from "../../services/analytics/firebaseAnalytics"
import SidebarElement from "@/components/ui/SidebarElement.component"
import SidebarToggle from "@/components/ui/SidebarToggle.component"
import { useTodos } from "@/services/context/TodosContext"
import useOutsideClick from "@/hooks/useOutsideClick"

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { setClosestStudentIndex } = useClosestStudent()
  const { activeStudents, currentStudentId } = useStudents()
  const { logout } = useUser()
  const { overdueTodos } = useTodos()
  const sidebarRef = useOutsideClick(() => setSidebarOpen(false))

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const handleLogEvent = (e: React.MouseEvent): void | Promise<void> => {
    const target = e.target as HTMLElement
    const path = target.closest("a")?.pathname

    switch (path) {
      case "/":
        if (target.closest("a")?.target === "_blank") {
          setSidebarOpen(false)
          return logEvent(analytics, "page_view", { page_title: "manual" })
        }
        setSidebarOpen(false)
        setClosestStudentIndex(getClosestStudentIndex(activeStudents ?? []))
        return logEvent(analytics, "page_view", {
          page_title: "dashboard",
        })

      case "/lessons":
        setSidebarOpen(false)
        return logEvent(analytics, "page_view", {
          page_title: "lessons",
        })

      case "/students":
        setSidebarOpen(false)
        return logEvent(analytics, "page_view", {
          page_title: "students",
        })

      case "/timetable":
        setSidebarOpen(false)
        return logEvent(analytics, "page_view", {
          page_title: "timetable",
        })

      case "/todos":
        setSidebarOpen(false)
        return logEvent(analytics, "page_view", {
          page_title: "todos",
        })

      case "/settings":
        setSidebarOpen(false)
        return logEvent(analytics, "page_view", {
          page_title: "todos",
        })

      case "/logout":
        return logout()

      default:
        return logEvent(analytics, "page_view", {
          page_title: "undefined",
        })
    }
  }

  // TODO: Fix opacity delay link names

  return (
    <nav
      ref={sidebarRef}
      className={`hidden md:flex fixed left-0 top-0 z-50  min-h-screen flex-col items-stretch justify-start
      bg-background50 shadow-lg transition-width duration-150 ${sidebarOpen ? "w-[180px]" : "w-[50px]"
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
          handleNav={handleLogEvent}
          to='/'
          name='Dashboard'
          icon={<IoCompassOutline />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to={`/lessons/${currentStudentId}`}
          name='Unterrichten'
          icon={<IoSchoolOutline />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/students'
          name='Schüler:innen'
          icon={<IoPeopleCircleOutline />}
        />
        <SidebarElement
          notificationContent={overdueTodos?.length}
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/todos'
          name='Todos'
          icon={<IoCheckboxOutline />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/timetable'
          name='Stundenplan'
          icon={<IoCalendarOutline />}
        />
      </ul>

      <ul className='mt-auto flex flex-col items-center justify-between border-t border-background200'>
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='https://manual.eleno.net'
          target={"_blank"}
          name='Anleitung'
          icon={<IoBookOutline />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/settings'
          name='Einstellungen'
          icon={<IoSettingsOutline />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/logout'
          name='Log out'
          icon={<IoLogOutOutline />}
        />
      </ul>
    </nav>
  )
}

export default Sidebar
