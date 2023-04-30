import { NavLink } from 'react-router-dom'
import './dashboard.style.scss'
import {
  IoSchoolSharp,
  IoPeopleCircleOutline,
  IoSettingsOutline,
  IoCheckboxOutline,
} from 'react-icons/io5'

import { useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useLoading } from '../../contexts/LoadingContext'
import { useClosestStudent } from '../../contexts/ClosestStudentContext'
import { useStudents } from '../../contexts/StudentContext'
import { sortStudentsDateTime } from '../../utils/sortStudents'
import { useTodos } from '../../contexts/TodosContext'
import { useDateToday } from '../../contexts/DateTodayContext'
import { formatDateToDatabase } from '../../utils/formateDate'

function Dashboard() {
  const { user } = useUser()
  const { students, activeStudents, archivedStudents } = useStudents()

  const { loading, setLoading } = useLoading()
  const { closestStudentIndex } = useClosestStudent()
  const { todos } = useTodos()
  const { dateToday } = useDateToday()

  // [ ] restyle dashboard

  useEffect(() => {
    user && setLoading(false)
  }, [user])

  const sortedStudents =
    (activeStudents && sortStudentsDateTime(activeStudents)) || null

  const closestStudent =
    (sortedStudents && sortedStudents[closestStudentIndex]) || null

  const todosOpen = todos.filter((todo) => !todo.completed)

  const todosOverdue = todosOpen.filter(
    (todo) => todo.due < formatDateToDatabase(dateToday)
  )

  // [ ] Einzahl/mehrzahl bei den cards berücksichtigen
  return (
    <div className="dashboard">
      {/* <Loader loading={loading} /> */}
      <header className="container header--dashboard">
        <h1 className="heading-1">Dashboard</h1>
      </header>
      {!loading && user && (
        <>
          <div className="container container-message">
            <h3 className="heading-3">
              👋 Hey {user.firstName}, schön dich zu sehen!{' '}
            </h3>
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
              <p>Aktuell {activeStudents.length} aktive Schüler:innen</p>
              <p>{archivedStudents.length} Schüler:innen archiviert</p>
            </NavLink>
            <NavLink to={'todos'} className="card">
              <IoCheckboxOutline className="icon" />
              <p className="card-title">To Do erfassen</p>
              <hr />
              <p>{todosOpen.length} Todos offen</p>
              {todosOverdue.length ? (
                <p className="card__details--warning">
                  {todosOverdue.length} davon überfällig
                </p>
              ) : null}
            </NavLink>

            <NavLink to={'settings'} className="card">
              <IoSettingsOutline className="icon" />
              <p className="card-title">Einstellungen</p>
              {/* <hr />
              <p>{todosOpen.length} Todos offen</p>
              {todosOverdue.length ? (
                <p className="card__details--warning">
                  {todosOverdue.length} davon überfällig
                </p>
              ) : null} */}
            </NavLink>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
