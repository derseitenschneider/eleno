import "./navbarMobile.style.scss"

import {
  IoCheckboxOutline,
  IoLogOutOutline,
  IoSchoolOutline,
  IoSettingsOutline,
} from "react-icons/io5"
import { NavLink } from "react-router-dom"
import Logo from "../../components/ui/logo/Logo.component"

import { useUser } from "../../services/context/UserContext"
import CountOverdueTodos from "../../components/ui/countOverdueTodos/CountOverdueTodos.component"

function NavbarMobile() {
  const { logout } = useUser()

  return (
    <nav className='bg-background50 px-3 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] sm:hidden sm:pointer-events-none block pointer-events-auto visible z-50 fixed h-[58px] bottom-0 left-0 right-0'>
      <ul className='flex justify-between items-center h-full w-full'>
        <li>
          <NavLink to='/' className='block'>
            <Logo />
          </NavLink>
        </li>
        <li>
          <NavLink
            to='todos'
            className='block size-[28px]'
          >
            <div className='navlist--mobile__navlink'>
              <CountOverdueTodos />
              <IoCheckboxOutline className='size-[28px]' />
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='lessons'
            className='block size-[28px]'
          >
            <div className='navbar--icon'>
              <IoSchoolOutline />
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to='settings'
            className='navlist--mobile__navlink'
          >
            <div className='navbar--icon'>
              <IoSettingsOutline className='icon' />
            </div>
          </NavLink>
        </li>
        <li>
          <button
            type='button'
            className='navlist--mobile__navlink'
            onClick={logout}
          >
            <IoLogOutOutline className='icon' />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarMobile
