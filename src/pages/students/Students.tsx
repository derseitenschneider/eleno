import './students.style.scss'

import { Outlet } from 'react-router-dom'
import { useStudents } from '../../contexts/StudentContext'
import Navbar from '../../layouts/navbar/Navbar.component'
import { useLoading } from '../../contexts/LoadingContext'
import { useUser } from '../../contexts/UserContext'
import Loader from '../../components/loader/Loader'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'

const navLinks = [
  { path: '', label: 'Aktive Schüler:innen', key: 1, end: true },
  { path: '/students/archive/', label: 'Archiv', key: 2 },
]

export default function Students() {
  const { students, setStudents } = useStudents()
  const { loading, setLoading } = useLoading()
  const { user } = useUser()
  const { setClosestStudentIndex } = useClosestStudent()
  return (
    <div className="container">
      <Navbar navLinks={navLinks} />
      {!loading ? (
        <Outlet
          context={{
            students,
            setStudents,
            loading,
            setLoading,
            user,
            setClosestStudentIndex,
          }}
        />
      ) : null}
    </div>
  )
}
