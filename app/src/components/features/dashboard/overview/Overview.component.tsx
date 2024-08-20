import { cn } from '@/lib/utils'
import { useLessonPointer } from '../../../../services/context/LessonPointerContext'

import { useStudents } from '../../../../services/context/StudentContext'
import { useTodos } from '../../../../services/context/TodosContext'
import useTodosQuery from '../../todos/todosQuery'
import OverviewCard from './OverviewCard.component'

function Overview() {
  const { activeStudents, inactiveStudents } = useStudents()
  const { nearestLessonHolder } = useLessonPointer()
  const { overdueTodos } = useTodos()

  const todos = useTodosQuery().data
  const todosOpen = todos?.filter((todo) => !todo.completed)
  let nearestLessonHolderName = ''
  if (nearestLessonHolder?.type === 's') {
    nearestLessonHolderName = `${nearestLessonHolder.holder?.firstName} ${nearestLessonHolder.holder.lastName}`
  }
  if (nearestLessonHolder?.type === 'g') {
    nearestLessonHolderName = nearestLessonHolder.holder.name
  }

  return (
    <div className={cn('px-3 py-6', 'md:p-4 md:pl-6', 'row-start-3 ')}>
      <h2>Übersicht</h2>
      <div className='lg:flex gap-5 space-y-5 lg:space-y-0'>
        <OverviewCard to='/students' title='Unterricht'>
          <div>
            {activeStudents && activeStudents?.length > 0 ? (
              <>
                <p className='mb-2'>
                  Nächste Lektion: <b>{nearestLessonHolderName}</b>
                </p>
                <p>
                  Aktive Schüler:innen: <b>{activeStudents.length}</b>
                </p>
              </>
            ) : (
              <p>Keine aktiven Schüler:innen erfasst</p>
            )}
            {inactiveStudents?.length ? (
              <p>
                Archivierte Schüler:innen: <b>{inactiveStudents.length}</b>
              </p>
            ) : (
              <p>Keine archivierten Schüler:innen</p>
            )}
          </div>
        </OverviewCard>

        <OverviewCard to='/todos' title='Todos'>
          <div>
            {todosOpen?.length ? (
              <p className='mb-2'>
                Offene Todos: <b>{todosOpen.length}</b>
              </p>
            ) : (
              <p>Keine offenen Todos</p>
            )}
            {overdueTodos?.length ? (
              <p>
                Überfällige Todos: <b>{overdueTodos.length}</b>
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
