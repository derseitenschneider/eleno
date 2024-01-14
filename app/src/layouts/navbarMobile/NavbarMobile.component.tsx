import './navbarMobile.style.scss'

import {
  IoCheckboxOutline,
  IoLogOutOutline,
  IoSchoolOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import { NavLink } from 'react-router-dom'
import Logo from '../../components/ui/logo/Logo.component'

import { useUser } from '../../services/context/UserContext'
import CountOverdueTodos from '../../components/ui/countOverdueTodos/CountOverdueTodos.component'

function NavbarMobile() {
  const { logout } = useUser()

  return (
    <nav className="navbar--mobile">
      <ul className="navlist--mobile">
        <li>
          <NavLink to="/" className="navlist--mobile__navlink">
            <Logo />
          </NavLink>
        </li>
        <li>
          <NavLink to="todos" className="navlist--mobile__navlink">
            <div className="navbar--icon">
              <CountOverdueTodos />

              <IoCheckboxOutline className="icon" />
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="lessons" className="navlist--mobile__navlink">
            <div className="navbar--icon">
              <IoSchoolOutline className="icon" />
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="settings" className="navlist--mobile__navlink">
            <div className="navbar--icon">
              <IoSettingsOutline className="icon" />
            </div>
          </NavLink>
        </li>
        <li>
          <button
            type="button"
            className="navlist--mobile__navlink"
            onClick={logout}
          >
            <IoLogOutOutline className="icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarMobile
