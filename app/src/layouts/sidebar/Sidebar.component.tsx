import { logEvent } from "@firebase/analytics"
import { useCallback, useState } from "react"
import { NavLink } from "react-router-dom"

import Logo from "../../components/ui/logo/Logo.component"
import { useNearestStudent } from "../../services/context/NearestStudentContext"
import { useStudents } from "../../services/context/StudentContext"
import { useUser } from "../../services/context/UserContext"
import calcNearestStudentIndex from "../../utils/getClosestStudentIndex"

import useOutsideClick from "@/hooks/useOutsideClick"
import SidebarElement from "@/layouts/sidebar/SidebarElement.component"
import SidebarToggle from "@/layouts/sidebar/SidebarToggle.component"
import { useTodos } from "@/services/context/TodosContext"
import {
  BookMarked,
  CalendarDays,
  CheckSquare2,
  GaugeCircle,
  GraduationCap,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import analytics from "../../services/analytics/firebaseAnalytics"
import useStudentsQuery from "@/components/features/students/studentsQueries"
import useTodosQuery from "@/components/features/todos/todosQuery"

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { setNearestStudentIndex: setClosestStudentIndex } = useNearestStudent()
  const students = useStudentsQuery().data
  const activeStudents = students?.filter((student) => !student.archive)
  const { currentStudentId } = useStudents()
  const todos = useTodosQuery().data
  const { logout } = useUser()
  const overdueTodos = todos?.filter(
    (todo) => todo.due && todo?.due <= new Date(),
  )

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
        setClosestStudentIndex(calcNearestStudentIndex(activeStudents ?? []))
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
          icon={<GaugeCircle strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to={`/lessons/${currentStudentId || "no-students"}`}
          name='Unterrichten'
          icon={<GraduationCap strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/students'
          name='Schüler:innen'
          icon={<Users strokeWidth={1.5} />}
        />
        <SidebarElement
          notificationContent={overdueTodos?.length}
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/todos'
          name='Todos'
          icon={<CheckSquare2 strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/timetable'
          name='Stundenplan'
          icon={<CalendarDays strokeWidth={1.5} />}
        />
      </ul>

      <ul className='mt-auto flex flex-col items-center justify-between border-t border-background200'>
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='https://manual.eleno.net'
          target={"_blank"}
          name='Anleitung'
          icon={<BookMarked strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/settings'
          name='Einstellungen'
          icon={<Settings strokeWidth={1.5} />}
        />
        <SidebarElement
          sidebarOpen={sidebarOpen}
          handleNav={handleLogEvent}
          to='/logout'
          name='Log out'
          icon={<LogOut strokeWidth={1.5} />}
        />
      </ul>
    </nav>
  )
}

export default Sidebar
