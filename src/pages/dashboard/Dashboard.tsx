import { NavLink } from 'react-router-dom'
import './dashboard.style.scss'
import { IoSchoolSharp, IoPeopleCircleOutline, IoList } from 'react-icons/io5'

import { useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useLoading } from '../../contexts/LoadingContext'
import Loader from '../../components/loader/Loader'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudentsDateTime } from '../../utils/sortStudents'

function Dashboard() {
  const { user } = useUser()
  const { students } = useStudents()
  const { loading, setLoading } = useLoading()
  const { closestStudentIndex } = useClosestStudent()

  useEffect(() => {
    user && setLoading(false)
  }, [user])

  useEffect(() => {}, [])

  const filteredSortedStudents = sortStudentsDateTime(students).filter(
    (student) => !student.archive
  )

  const closestStudent = filteredSortedStudents[closestStudentIndex]

  return (
    <div className="dashboard">
      <header className="container container--header">
        <h1 className="heading-1">Dashboard</h1>
      </header>
      <Loader loading={loading} />
      {!loading && user && (
        <>
          <div className="container container-message">
            <h4 className="heading-4">
              👋 Hey {user.firstName}, schön dich zu sehen!{' '}
            </h4>
          </div>
          <div className="grid-container container">
            <NavLink to={'lessons'} className="card">
              <IoSchoolSharp className="icon" />
              <p className="card-title">Unterricht starten</p>
              <hr />
              <p>Nächste Lektion:</p>
              <p>
                {closestStudent.firstName} {closestStudent.lastName} -{' '}
                {closestStudent.dayOfLesson}, {closestStudent.startOfLesson} Uhr
              </p>
            </NavLink>
            <NavLink to={'students'} className="card">
              <IoPeopleCircleOutline className="icon" />
              <p className="card-title">Schüler:in hinzufügen</p>
              <hr />
              <p>Aktuell 27 Schüler:innen erfasst</p>
            </NavLink>
            <NavLink to={'todos'} className="card">
              <IoList className="icon" />
              <p className="card-title">To Do erfassen</p>
            </NavLink>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
