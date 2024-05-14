import {
  IoCheckboxOutline,
  IoLogOutOutline,
  IoSchoolOutline,
  IoSettingsOutline,
} from "react-icons/io5"
import Logo from "../../components/ui/logo/Logo.component"

import NavbarMobileItem from "./NavbarMobileItem.component"
import { useTodos } from "@/services/context/TodosContext"
import { useRoutes } from "react-router-dom"
import { BookOpenCheck, ListChecks, LogOut, Settings } from "lucide-react"

function NavbarMobile() {
  const { overdueTodos } = useTodos()

  return (
    <nav className='bg-background50 px-4 shadow-[0_-1px_4px_rgba(0,0,0,0.1)] md:hidden md:pointer-events-none block pointer-events-auto visible z-50 fixed h-[58px] bottom-0 left-0 right-0 max-w-screen'>
      <ul className='flex justify-between items-center h-full w-full'>
        <NavbarMobileItem to='/' icon={<Logo />} />
        <NavbarMobileItem
          notificationContent={overdueTodos?.length}
          to='/todos'
          icon={<ListChecks strokeWidth={1.5} />}
        />
        <NavbarMobileItem
          to='/lessons'
          icon={<BookOpenCheck strokeWidth={1.5} />}
        />
        <NavbarMobileItem
          to='/settings'
          icon={<Settings strokeWidth={1.5} />}
        />
        <NavbarMobileItem to='/logout' icon={<LogOut strokeWidth={1.5} />} />
      </ul>
    </nav>
  )
}

export default NavbarMobile
