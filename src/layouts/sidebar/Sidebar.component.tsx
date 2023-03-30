import './sidebar.style.scss'
import { useState } from 'react'
import { supabase } from '../../supabase/supabase'
import { NavLink } from 'react-router-dom'
import {
  IoCompassOutline,
  IoPeopleCircleOutline,
  IoCalendarClearOutline,
  IoSchoolOutline,
  IoListOutline,
  IoChevronForwardOutline,
  IoLogOutOutline,
} from 'react-icons/io5'

import Logo from '../../components/logo/Logo.component'

// [ ] close sidebar when clicked outside

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  // [ ] redirect to homepage
  const logout = async () => {
    let { error } = await supabase.auth.signOut()
  }

  return (
    <div>
      <div className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="sidebar__button--toggle" onClick={toggleSidebar}>
          <IoChevronForwardOutline className="chevron" />
        </button>
        <div className="container-top">
          <NavLink
            to="/"
            className="sidebar__logo"
            onClick={() => {
              setSidebarOpen(false)
            }}
          >
            <Logo />
          </NavLink>
          <nav className="sidebar__navigation">
            <ul className="sidebar__nav-list">
              <li className="sidebar__nav-el">
                <NavLink
                  to="/"
                  className="sidebar__nav-link"
                  onClick={() => {
                    setSidebarOpen(false)
                  }}
                >
                  <div className="sidebar__nav-icon">
                    <IoCompassOutline className="icon" />
                  </div>
                  <span className="sidebar__link-text">Dashboard</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink
                  to="students"
                  className="sidebar__nav-link"
                  onClick={() => {
                    setSidebarOpen(false)
                  }}
                >
                  <div className="sidebar__nav-icon">
                    <IoPeopleCircleOutline className="icon" />
                  </div>

                  <span className="sidebar__link-text">Schüler:innen</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink
                  to="lessons"
                  className="sidebar__nav-link"
                  onClick={() => {
                    setSidebarOpen(false)
                  }}
                >
                  <div className="sidebar__nav-icon">
                    <IoSchoolOutline className="icon" />
                  </div>
                  <span className="sidebar__link-text">Unterrichten</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink
                  to="timetable"
                  className="sidebar__nav-link"
                  onClick={() => {
                    setSidebarOpen(false)
                  }}
                >
                  <div className="sidebar__nav-icon">
                    <IoCalendarClearOutline className="icon" />
                  </div>

                  <span className="sidebar__link-text">Stundenplan</span>
                </NavLink>
              </li>

              <li className="sidebar__nav-el">
                <NavLink
                  to="todos"
                  className="sidebar__nav-link"
                  onClick={() => {
                    setSidebarOpen(false)
                  }}
                >
                  <div className="sidebar__nav-icon">
                    <IoListOutline className="icon" />
                  </div>

                  <span className="sidebar__link-text">To Dos</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="container-settings">
          <div className="sidebar__nav-el">
            <div className="sidebar__nav-link" onClick={logout}>
              <div className="sidebar__nav-icon">
                <IoLogOutOutline className="icon icon--logout" />
              </div>
              <span className="sidebar__link-text">Log out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
