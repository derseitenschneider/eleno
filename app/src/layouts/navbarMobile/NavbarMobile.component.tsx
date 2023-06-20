import './navbarMobile.style.scss'
import { FunctionComponent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../components/_reusables/logo/Logo.component'
import {
  IoSchoolOutline,
  IoLogOutOutline,
  IoSettingsOutline,
  IoCheckboxOutline,
} from 'react-icons/io5'
import { supabase } from '../../supabase/supabase'

interface NavbarMobileProps {}

const NavbarMobile: FunctionComponent<NavbarMobileProps> = () => {
  const navigate = useNavigate()
  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

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
