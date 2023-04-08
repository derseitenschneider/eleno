import './students.style.scss'

import { Outlet } from 'react-router-dom'
import Navbar from '../../layouts/navbar/Navbar.component'
import { useLoading } from '../../contexts/LoadingContext'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'

const navLinks = [
  { path: '', label: 'Aktive Schüler:innen', key: 1, end: true },
  { path: '/students/archive/', label: 'Archiv', key: 2 },
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
