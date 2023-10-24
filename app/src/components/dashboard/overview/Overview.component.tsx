import './overview.style.scss'

import { useClosestStudent } from '../../../contexts/ClosestStudentContext'
import { useDateToday } from '../../../contexts/DateTodayContext'
import { useStudents } from '../../../contexts/StudentContext'
import { useTodos } from '../../../contexts/TodosContext'
import { formatDateToDatabase } from '../../../utils/formateDate'
import { sortStudentsDateTime } from '../../../utils/sortStudents'

const Overview = () => {
  const { activeStudents, inactiveStudents } = useStudents()
  const { todos } = useTodos()
  const { closestStudentIndex } = useClosestStudent()
  const { dateToday } = useDateToday()

  const sortedStudents =
    (activeStudents && sortStudentsDateTime(activeStudents)) || null
  const closestStudent =
    (sortedStudents && sortedStudents[closestStudentIndex]) || null

  const todosOpen = todos.filter((todo) => !todo.completed)

  const todosOverdue = todosOpen.filter(
    (todo) => todo.due < formatDateToDatabase(dateToday),
  )

  return (
    <div className="overview">
      <h2 className="heading-2">Übersicht</h2>
      <div className="overview__content">
        <div className="card overview__students">
          <h5 className="heading-3">Schüler:innen</h5>
          {activeStudents.length > 0 ? (
            <>
              <p>
                Aktive Schüler:innen: <b>{activeStudents.length}</b>
              </p>
              <p>
                Nächste Lektion:{' '}
                <b>
                  {closestStudent?.firstName} {closestStudent?.lastName}
                </b>
              </p>
            </>
          ) : (
            <p>Keine aktiven Schüler:innen erfasst</p>
          )}
          {inactiveStudents.length ? (
            <p>
              Archivierte Schüler:innen: <b>{inactiveStudents.length}</b>
            </p>
          ) : (
            <p>Keine archivierten Schüler:innen</p>
          )}
        </div>

        <div className="card overview__todos">
          <h3 className="heading-3">Todos</h3>
          {todosOpen.length ? (
            <p>
              Offene Todos: <b>{todosOpen.length}</b>
            </p>
          ) : (
            <p>Keine offenen Todos</p>
          )}
          {todosOverdue.length > 0 ? (
            <p className="todos-overdue">
              Überfällige Todos: <b>{todosOverdue.length}</b>
            </p>
          ) : (
            <p>Keine Todos überfällig.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview
