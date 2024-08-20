import { NavLink, useLocation } from "react-router-dom"

type NavbarMobileItemProps = {
  to: string
  icon: React.ReactNode
  notificationContent?: number
}
export default function NavbarMobileItem({
  to,
  icon,
  notificationContent,
}: NavbarMobileItemProps) {
  const { pathname } = useLocation()
  const isActive = pathname === to && pathname !== "/"

  return (
    <li>
      <NavLink
        to={to}
        className={`${isActive ? "text-white" : "text-foreground"
          } block size-[40px] p-1 relative`}
      >
        <span
          className={`${isActive ? "block" : "hidden"
            } absolute top-0 left-0 size-full bg-primary z-[-1] rounded-sm`}
        />
        {icon}
        {notificationContent ? (
          <div
            className='z-100 absolute bottom-0 right-0 flex aspect-square 
            !size-[16px] items-center justify-center rounded-full bg-warning'
          >
            <span className='text-[10px] text-white'>
              {notificationContent}
            </span>
          </div>
        ) : null}
      </NavLink>
    </li>
  )
}
