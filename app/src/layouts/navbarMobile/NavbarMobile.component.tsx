import './navbarMobile.style.scss'

import { NavLink } from 'react-router-dom'
import Logo from '../../components/common/logo/Logo.component'
import {
  IoSchoolOutline,
  IoLogOutOutline,
  IoSettingsOutline,
  IoCheckboxOutline,
} from 'react-icons/io5'

import { useUser } from '../../contexts/UserContext'

const NavbarMobile = () => {
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
          <button className="navlist--mobile__navlink" onClick={logout}>
            <IoLogOutOutline className="icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarMobile
