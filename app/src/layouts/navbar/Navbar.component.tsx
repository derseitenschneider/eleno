import { NavLink } from "react-router-dom"

interface IProps {
  navLinks: {
    path: string
    label: string
    key: number
    end?: boolean
  }[]
}

function Navbar({ navLinks }: IProps) {
  return (
    <div className='text-base mb-6'>
      <ul className='p-0 flex justify-start gap-6'>
        {navLinks.map((link) => (
          <li key={link.key} className='px-1 relative overflow-hidden'>
            <NavLink to={link.path} end={link.end} className='text-foreground'>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Navbar
