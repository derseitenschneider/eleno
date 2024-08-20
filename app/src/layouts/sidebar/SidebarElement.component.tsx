import type { HTMLAttributeAnchorTarget } from 'react'
import { NavLink } from 'react-router-dom'

type TSidebarProps = {
  to: string
  icon: React.ReactNode
  name: string
  target?: HTMLAttributeAnchorTarget
  sidebarOpen: boolean
  notificationContent?: number
  onClick?: () => void
}

export default function SidebarElement({
  to,
  onClick,
  icon,
  name,
  target,
  sidebarOpen,
  notificationContent,
}: TSidebarProps) {
  const isActive = window.location.pathname === to

  return (
    <li className='h-full w-full p-2'>
      <NavLink
        onClick={() => onClick?.()}
        title={name}
        to={to}
        target={target}
        className={`${!isActive
            ? 'text-foreground before:hidden'
            : 'text-white after:hidden'
          }
        align-center z-1 relative flex items-center gap-4 p-1.5 text-foreground
        before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full
        before:w-full before:rounded-md before:bg-primary after:absolute after:left-0
        after:top-0 after:z-[-1] after:h-full after:w-full after:rounded-md
        after:bg-transparent hover:no-underline hover:after:bg-background100`}
      >
        <div className='relative z-10 h-full w-full max-w-[22px] shrink-0 *:h-full *:w-full'>
          {icon}
          {notificationContent ? (
            <div
              className='z-100 absolute bottom-0 right-0 flex
            aspect-square !size-[15px] translate-x-[25%] translate-y-[25%]
            items-center justify-center rounded-full bg-warning'
            >
              <span className='text-[10px] text-white'>
                {notificationContent}
              </span>
            </div>
          ) : null}
        </div>
        <span
          className={`${!sidebarOpen ? 'hidden opacity-0' : 'opacity-1'} ${isActive ? 'text-white' : ''
            } whitespace-nowrap text-sm
          leading-none transition-opacity delay-500 duration-1000`}
        >
          {name}
        </span>
      </NavLink>
    </li>
  )
}
