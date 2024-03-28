import { HTMLAttributeAnchorTarget } from 'react'
import { NavLink } from 'react-router-dom'

type TSidebarProps = {
  handleNav: (e: React.MouseEvent) => void
  to: string
  icon: React.ReactNode
  name: string
  target?: HTMLAttributeAnchorTarget
}

// TODO: Add optional notification circle (e.g. overdue todos)

export default function SidebarElement({
  handleNav,
  to,
  icon,
  name,
  target
}: TSidebarProps) {
  return (
    <li className="*:w-full p-2 *:h-auto flex h-full w-full">
      <NavLink title={name} to={to} target={target} className='after:z-[-1] after:bg-transparent hover:after:bg-background100 after:h-full after:w-full after:absolute after:top-0 after:left-0 after:rounded-md p-1.5 z-1  relative before:z-[-1] before:bg-primary before:h-full before:w-full before:absolute before:top-0 before:rounded-md before:hidden before:left-0'  onClick={handleNav}>
        <div className='*:w-full text-foreground *:h-auto z-10' >{icon}</div>
        <span className="hidden">{name}</span>
      </NavLink>
    </li>
  )
}
