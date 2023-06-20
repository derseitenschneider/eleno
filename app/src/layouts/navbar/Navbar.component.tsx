import { NavLink } from 'react-router-dom'
import './navbar.styles.scss'

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
    <div className="navbar">
      <ul className="navlist">
        {navLinks.map((link) => (
          <li key={link.key} className="nav-item">
            <NavLink to={link.path} end={link.end} className="navlink">
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Navbar
