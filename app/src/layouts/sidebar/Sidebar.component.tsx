import { useCallback, useEffect, useState } from 'react'
import './sidebar.style.scss'

import {
  IoBookOutline,
  IoCalendarOutline,
  IoCheckboxOutline,
  IoChevronForwardOutline,
  IoCompassOutline,
  IoLogOutOutline,
  IoPeopleCircleOutline,
  IoSchoolOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import { Link, NavLink } from 'react-router-dom'

import Logo from '../../components/ui/logo/Logo.component'
import { useClosestStudent } from '../../services/context/ClosestStudentContext'
import { useStudents } from '../../services/context/StudentContext'
import { useUser } from '../../services/context/UserContext'
import getClosestStudentIndex from '../../utils/getClosestStudentIndex'

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

  const resetClosestStudentIndex = () => {
    setClosestStudentIndex(getClosestStudentIndex(activeStudents))
  }

  useEffect(() => {
    if (sidebarOpen) {
      window.addEventListener('click', closeSidebarOnWindowClick)
    }
    return () => {
      window.removeEventListener('click', closeSidebarOnWindowClick)
    }
  }, [closeSidebarOnWindowClick, sidebarOpen])

  return (
    <div>
      <div className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
        <button
          type="button"
          className="sidebar__button--toggle"
          onClick={toggleSidebar}
        >
          <IoChevronForwardOutline className="chevron" />
        </button>
        <div className="container-top">
          <NavLink to="/" className="sidebar__logo">
            <Logo />
          </NavLink>
          <nav className="sidebar__navigation">
            <ul className="sidebar__nav-list">
              <li className="sidebar__nav-el">
                <NavLink
                  to="/"
                  className="sidebar__nav-link"
                  onClick={resetClosestStudentIndex}
                >
                  <div className="sidebar__nav-icon">
                    <IoCompassOutline className="icon" />
                  </div>
                  <span className="sidebar__link-text">Dashboard</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink to="lessons" className="sidebar__nav-link">
                  <div className="sidebar__nav-icon">
                    <IoSchoolOutline className="icon" />
                  </div>
                  <span className="sidebar__link-text">Unterrichten</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink to="students" className="sidebar__nav-link">
                  <div className="sidebar__nav-icon">
                    <IoPeopleCircleOutline className="icon" />
                  </div>

                  <span className="sidebar__link-text">Schüler:innen</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink to="timetable" className="sidebar__nav-link">
                  <div className="sidebar__nav-icon">
                    <IoCalendarOutline className="icon" />
                  </div>

                  <span className="sidebar__link-text">Stundenplan</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink to="todos" className="sidebar__nav-link">
                  <div className="sidebar__nav-icon">
                    <IoCheckboxOutline className="icon" />
                  </div>

                  <span className="sidebar__link-text">Todos</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="container-settings">
          <div className="sidebar__nav-el">
            <Link
              to="https://manual.eleno.net/"
              target="_blank"
              className="sidebar__nav-link"
            >
              <div className="sidebar__nav-icon">
                <IoBookOutline className="icon" />
              </div>
              <span className="sidebar__link-text">Anleitung</span>
            </Link>
          </div>
          <div className="sidebar__nav-el">
            <NavLink to="settings" className="sidebar__nav-link">
              <div className="sidebar__nav-icon">
                <IoSettingsOutline className="icon" />
              </div>
              <span className="sidebar__link-text">Einstellungen</span>
            </NavLink>
          </div>
          <div className="sidebar__nav-el">
            <button
              type="button"
              className="sidebar__nav-link"
              onClick={logout}
            >
              <div className="sidebar__nav-icon">
                <IoLogOutOutline className="icon icon--logout" />
              </div>
              <span className="sidebar__link-text">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
