import { NavLink } from 'react-router-dom'
import './dashboard.style.scss'
import { IoSchoolSharp, IoPeopleCircleOutline, IoList } from 'react-icons/io5'

import { useEffect, useMemo } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useLoading } from '../../contexts/LoadingContext'
import Loader from '../../components/loader/Loader'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { useLessons } from '../../contexts/LessonsContext'

function Dashboard() {
  const { user } = useUser()
  const { students } = useStudents()
  const { lessons } = useLessons()
  const { loading, setLoading } = useLoading()
  const { closestStudentIndex } = useClosestStudent()

  useEffect(() => {
    user && setLoading(false)
  }, [user])

  const sortedStudents = (students && sortStudentsDateTime(students)) || null

  const filteredSortedStudents = sortedStudents?.filter(
    (student) => !student.archive || null
  )
  const closestStudent =
    (filteredSortedStudents && filteredSortedStudents[closestStudentIndex]) ||
    null

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
              {students.filter((student) => !student.archive).length ? (
                <>
                  <p>Nächste Lektion:</p>
                  <p>
                    {closestStudent?.firstName} {closestStudent?.lastName} -{' '}
                    {closestStudent?.dayOfLesson},{' '}
                    {closestStudent?.startOfLesson} Uhr
                  </p>
                </>
              ) : (
                <p>Aktuell keine aktiven Schüler:innen erfasst</p>
              )}
            </NavLink>
            <NavLink to={'students'} className="card">
              <IoPeopleCircleOutline className="icon" />
              <p className="card-title">Schüler:in hinzufügen</p>
              <hr />
              <p>Aktuell {students.length} aktive Schüler:innen erfasst</p>
              <p>0 Schüler:innen archiviert</p>
            </NavLink>
            <NavLink to={'todos'} className="card">
              <IoList className="icon" />
              <p className="card-title">To Do erfassen</p>
              <hr />
              <p>0 Todos offen</p>
              <p style={{ color: 'red' }}>0 davon überfällig</p>
            </NavLink>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
