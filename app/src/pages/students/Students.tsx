import { Outlet } from 'react-router-dom'
import Navbar from '../../layouts/navbar/Navbar.component'

const navLinks = [
  { path: '', label: 'Aktive Schüler:innen', key: 1, end: true },
  { path: '/students/groups/', label: 'Gruppen', key: 2 },
  { path: '/students/archive/', label: 'Archiv', key: 3 },
]
export default function Students() {
  return (
    <div className="container">
      <h1 className="heading-1">Schüler:innen</h1>
      <Navbar navLinks={navLinks} />
      <Outlet />
    </div>
  )
}
