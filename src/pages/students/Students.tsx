import './students.style.scss'

import { Outlet } from 'react-router-dom'
import { useStudents } from '../../contexts/StudentContext'
import Navbar from '../../layouts/navbar/navbar.component'
import { useLoading } from '../../contexts/LoadingContext'
import { useUser } from '../../contexts/UserContext'

const navLinks = [{ path: 'archive', label: 'Archiv', key: 2 }]

export default function Students() {
  const { students, setStudents } = useStudents()
  const { loading, setLoading } = useLoading()
  const { user } = useUser()
  return (
    <div className="container">
      <Navbar navLinks={navLinks} />
      <Outlet context={{ students, setStudents, loading, setLoading, user }} />
    </div>
  )
}
