import { useClosestStudent } from "../../../../services/context/ClosestStudentContext"

import { useStudents } from "../../../../services/context/StudentContext"
import { useTodos } from "../../../../services/context/TodosContext"
import { sortStudentsDateTime } from "../../../../utils/sortStudents"
import OverviewCard from "./OverviewCard.component"

function Overview() {
  const { activeStudents, inactiveStudents } =
    useStudents()
  const { todos } = useTodos()
  const { closestStudentIndex } =
    useClosestStudent()
  const { overdueTodos } = useTodos()

  const sortedStudents =
    (activeStudents &&
      sortStudentsDateTime(activeStudents)) ||
    null
  const closestStudent = sortedStudents
    ? sortedStudents[closestStudentIndex]
    : null

  const todosOpen = todos?.filter(
    (todo) => !todo.completed,
  )

  return (
    <div className='row-start-3 '>
      <h2>Übersicht</h2>
      <div className='sm:flex gap-5'>
        <OverviewCard
          to='/students'
          title='Schüler:innen'
        >
          <div>
            {activeStudents &&
            activeStudents?.length > 0 ? (
              <>
                <p className='mb-2'>
                  Nächste Lektion:{" "}
                  <b>
                    {closestStudent?.firstName}{" "}
                    {closestStudent?.lastName}
                  </b>
                </p>
                <p>
                  Aktive Schüler:innen:{" "}
                  <b>{activeStudents.length}</b>
                </p>
              </>
            ) : (
              <p>
                Keine aktiven Schüler:innen
                erfasst
              </p>
            )}
            {inactiveStudents?.length ? (
              <p>
                Archivierte Schüler:innen:{" "}
                <b>{inactiveStudents.length}</b>
              </p>
            ) : (
              <p>
                Keine archivierten Schüler:innen
              </p>
            )}
          </div>
        </OverviewCard>

        <OverviewCard to='/todos' title='Todos'>
          <div>
            {todosOpen?.length ? (
              <p className='mb-2'>
                Offene Todos:{" "}
                <b>{todosOpen.length}</b>
              </p>
            ) : (
              <p>Keine offenen Todos</p>
            )}
            {overdueTodos?.length ? (
              <p>
                Überfällige Todos:{" "}
                <b>{overdueTodos.length}</b>
              </p>
            ) : (
              <p>Keine Todos überfällig.</p>
            )}
          </div>
        </OverviewCard>
      </div>
    </div>
  )
}

export default Overview
