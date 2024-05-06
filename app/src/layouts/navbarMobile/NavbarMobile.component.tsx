import {
  IoCheckboxOutline,
  IoLogOutOutline,
  IoSchoolOutline,
  IoSettingsOutline,
} from "react-icons/io5"
import Logo from "../../components/ui/logo/Logo.component"

import NavbarMobileItem from "./NavbarMobileItem.component"

function NavbarMobile() {
  return (
    <nav className='bg-background50 px-4 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] sm:hidden sm:pointer-events-none block pointer-events-auto visible z-50 fixed h-[58px] bottom-0 left-0 right-0 max-w-screen'>
      <ul className='flex justify-between items-center h-full w-full'>
        <NavbarMobileItem path='/' icon={<Logo />} />
        <NavbarMobileItem path='todos' icon={<IoCheckboxOutline />} />
        <NavbarMobileItem path='lessons' icon={<IoSchoolOutline />} />
        <NavbarMobileItem path='settings' icon={<IoSettingsOutline />} />
        <NavbarMobileItem path='logout' icon={<IoLogOutOutline />} />
      </ul>
    </nav>
  )
}

export default NavbarMobile
