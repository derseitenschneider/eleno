import { IoCheckboxOutline } from "react-icons/io5"
import { NavLink } from "react-router-dom"

type NavbarMobileItemProps = {
  path: string
  icon: React.ReactNode
  notificationContent?: string
}
export default function NavbarMobileItem({
  path,
  icon,
  notificationContent,
}: NavbarMobileItemProps) {
  const isActive =
    window.location.pathname === path && window.location.pathname !== "/"

  return (
    <li>
      <NavLink
        to={path}
        className={`${
          isActive ? "text-white" : "text-foreground"
        } block relative active:text-primary size-[40px] p-1`}
      >
        <span
          className={`${
            isActive ? "block" : "hidden"
          } absolute top-0 left-0 size-full bg-primary z-[-1] rounded-sm`}
        />
        {icon}
      </NavLink>
    </li>
  )
}
