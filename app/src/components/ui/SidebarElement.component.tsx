import { HTMLAttributeAnchorTarget } from 'react'
import { NavLink } from 'react-router-dom'

type TSidebarProps = {
  handleNav: (e: React.MouseEvent) => void
  to: string
  icon: React.ReactNode
  name: string
  target?: HTMLAttributeAnchorTarget
  sidebarOpen: boolean
  notificationContent?: string
}

// TODO: Add optional notification circle (e.g. overdue todos)

export default function SidebarElement({
  handleNav,
  to,
  icon,
  name,
  target,
  sidebarOpen,
  notificationContent
}: TSidebarProps) {

const isActive = window.location.pathname === to

  return (
    <li className="p-2 h-full w-full">
      <NavLink title={name} to={to} target={target} className={ `${!isActive ? 'before:hidden text-foreground' : 'after:hidden text-white' } items-center hover:no-underline text-foreground after:z-[-1] flex align-center gap-4 after:bg-transparent hover:after:bg-background100 after:h-full after:w-full after:absolute after:top-0 after:left-0 after:rounded-md p-1.5 z-1  relative before:z-[-1] before:bg-primary before:h-full before:w-full before:absolute before:top-0 before:rounded-md  before:left-0` }  onClick={handleNav}>
        <div className='max-w-[22px] shrink-0 *:w-full h-full *:h-full z-10 w-full relative' >
          {icon}
          <div className={`${!notificationContent ? 'hidden' : ''} absolute text-[10px] text-white bg-warning flex items-center justify-center rounded-full max-h-[14px] max-w-[14px] bottom-0 right-0 translate-x-[25%] translate-y-[25%] z-100 aspect-square `}>
            <span>{notificationContent}</span>
          </div>

        </div>
        <span className={`${!sidebarOpen ? 'hidden opacity-0' : 'opacity-1'} whitespace-nowrap transition-opacity delay-500 duration-1000 text-sm leading-none`}>{name}</span>
      </NavLink>
    </li>
  )
}
