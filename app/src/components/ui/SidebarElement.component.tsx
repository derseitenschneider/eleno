import { HTMLAttributeAnchorTarget } from 'react'
import { NavLink } from 'react-router-dom'

type TSidebarProps = {
  handleNav: (e: React.MouseEvent) => void
  to: string
  icon: React.ReactNode
  name: string
  target?: HTMLAttributeAnchorTarget
}

export default function SidebarElement({
  handleNav,
  to,
  icon,
  name,
  target
}: TSidebarProps) {
  return (
    <li className="*:w-full p-2 *:h-auto flex h-full w-full">
      <NavLink to={to} target={target || null} className='p-1.5 z-1 before:hidden relative before:z-[-1] before:bg-primary before:h-full before:w-full before:absolute before:top-0 before:rounded-sm before:left-0'  onClick={handleNav}>
        <div className='*:w-full text-foreground *:h-auto z-10' >{icon}</div>
        <span className="hidden">{name}</span>
      </NavLink>
    </li>
  )
}
