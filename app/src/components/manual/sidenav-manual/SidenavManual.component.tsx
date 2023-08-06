import { useEffect, useRef, useState } from 'react'
import './sidenavManual.style.scss'

import {
  IoPersonCircleOutline,
  IoFlashOutline,
  IoCompassOutline,
  IoSchoolOutline,
  IoPeopleCircleOutline,
  IoCalendarOutline,
  IoCheckboxOutline,
  IoSettingsOutline,
  IoArrowBackOutline,
  IoMenuOutline,
  IoCloseOutline,
} from 'react-icons/io5'
import { NavLink, Link, useLocation } from 'react-router-dom'

import Logo from '../../common/logo/Logo.component'

const SidenavManual = () => {
  const [openPanel, setOpenPanel] = useState('')
  const [navOpen, setNavOpen] = useState(false)

  // const location = useLocation()

  // useEffect(() => {
  //   setNavOpen(false)
  // }, [location])

  function handleLink(e: React.MouseEvent) {
    const link = e.target as HTMLElement
    setOpenPanel((prev) => {
      if (prev === link.id) {
        return ''
      }
      return link.id
    })
  }

  return (
    <>
      <button className="toggle-sidenav open" onClick={() => setNavOpen(true)}>
        <IoMenuOutline />
      </button>
      <div className={`container sidenav${navOpen ? ' open' : ''}`}>
        <button
          className="toggle-sidenav close"
          onClick={() => setNavOpen(false)}
        >
          <IoCloseOutline />
        </button>
        <ul className="primary-nav">
          <li>
            <NavLink to={''} className="nav-logo">
              <Logo />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="create-account"
              id="create-account"
              onClick={handleLink}
            >
              <IoPersonCircleOutline />
              Account einrichten
            </NavLink>
          </li>
          <li>
            <NavLink to="quick-start" id="quick-start" onClick={handleLink}>
              <IoFlashOutline />
              Quick-Start
            </NavLink>
            {openPanel === 'quick-start' && (
              <ul>
                <li>
                  <a href="#quick-create">Schüler:innen erfassen</a>
                </li>
                <li>
                  <a href="#quick-teaching">Unterrichten</a>
                </li>
                <li>
                  <a href="#quick-notes">Notizen erfassen</a>
                </li>
                <li>
                  <a href="#quick-todos">Todos erfassen</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="dashboard" id="dashboard" onClick={handleLink}>
              <IoCompassOutline />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="teaching" id="teaching" onClick={handleLink}>
              <IoSchoolOutline />
              Unterrichten
            </NavLink>
            {openPanel === 'teaching' && (
              <ul>
                <li>
                  <a href="#teaching-header">Kopfleiste</a>
                  <ul>
                    <li>
                      <a href="#teaching-header-edit-student">
                        Schüler:in bearbeiten
                      </a>
                    </li>
                    <li>
                      <a href="#teaching-header-todo">Todo erfassen</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#teaching-previous-lessons">Vergangene Lektionen</a>
                  <ul>
                    <li>
                      <a href="#teaching-edit-lesson">Lektion bearbeiten</a>
                    </li>
                    <li>
                      <a href="#teaching-delete-lesson">Lektion löschen</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#teaching-new-lesson">Neue Lektion erfassen</a>
                </li>
                <li>
                  <a href="#teaching-notes">Notizen</a>
                  <ul>
                    <li>
                      <a href="#teaching-new-note">Notiz erstellen</a>
                    </li>
                    <li>
                      <a href="#teaching-edit-notes">Notiz bearbeiten</a>
                    </li>
                    <li>
                      <a href="#teaching-delete-notes">Notiz löschen</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#teaching-navigation">Navigation</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="students" id="students" onClick={handleLink}>
              <IoPeopleCircleOutline />
              Schüler:innen
            </NavLink>
            {openPanel === 'students' && (
              <ul>
                <li>
                  <a href="#students-active">Aktive Schüler:innen</a>
                  <ul>
                    <li>
                      <a href="#students-new">Neue Schüler:innen erfassen</a>
                    </li>
                    <li>
                      <a href="#students-edit">Schüler:in bearbeiten</a>
                    </li>
                    <li>
                      <a href="#students-archivate">Schüler:in archivieren</a>
                    </li>
                    <li>
                      <a href="#students-to-lesson">...zum Lektionsblatt</a>
                    </li>
                    <li>
                      <a href="#students-archivate-bulk">
                        Archivieren (Massenbearbeitung)
                      </a>
                    </li>
                    <li>
                      <a href="#students-reset-bulk">
                        Zurücksetzen (Massenbearbeitung)
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="schedule" id="schedule" onClick={handleLink}>
              <IoCalendarOutline />
              Stundenplan
            </NavLink>
          </li>
          <li>
            <NavLink to="todos" id="todos" onClick={handleLink}>
              <IoCheckboxOutline />
              Todos
            </NavLink>
            {openPanel === 'todos' && (
              <ul>
                <li>
                  <a href="#todos-new">Todo erfassen</a>
                </li>
                <li>
                  <a href="#todos-edit">Todo bearbeiten</a>
                </li>
                <li>
                  <a href="#todos-complete">Todos erledigen</a>
                </li>
                <li>
                  <a href="#todos-reactivate">Todo löschen</a>
                </li>
                <li>
                  <a href="#todos-delete-all">Alle erledigten Todos löschen</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="settings" onClick={handleLink} id="settings">
              <IoSettingsOutline />
              Einstellungen
            </NavLink>
            {openPanel === 'settings' && (
              <ul>
                <li>
                  <a href="#profile">Profil</a>
                </li>
                <li>
                  <a href="#login-data">Logindaten</a>
                </li>
                <li>
                  <a href="#delete-account">Benutzerkonto löschen</a>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <Link to={'/'} className="link-back">
          <IoArrowBackOutline />
          <span>Zurück zur App</span>
        </Link>
      </div>
    </>
  )
}

export default SidenavManual
