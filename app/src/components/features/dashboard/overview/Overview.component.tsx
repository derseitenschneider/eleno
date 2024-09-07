import { cn } from '@/lib/utils'
import { useLessonHolders } from '../../../../services/context/LessonHolderContext'
import useTodosQuery from '../../todos/todosQuery'
import OverviewCard from './OverviewCard.component'

function Overview() {
  const { activeSortedHolders, inactiveLessonHolders, nearestLessonHolder } =
    useLessonHolders()

  const todos = useTodosQuery().data
  const todosOpen = todos?.filter((todo) => !todo.completed)
  const todosDue = todosOpen?.filter((todo) => {
    if (!todo.due) return false
    if (todo.due < new Date()) return true
    return false
  })

  let nearestLessonHolderName = ''
  if (nearestLessonHolder?.type === 's') {
    nearestLessonHolderName = `${nearestLessonHolder.holder?.firstName} ${nearestLessonHolder.holder.lastName}`
  }
  if (nearestLessonHolder?.type === 'g') {
    nearestLessonHolderName = nearestLessonHolder.holder.name
  }

  return (
    <div
      className={cn('px-5 py-6', 'md:p-6', 'lg:p-4 lg:pl-6', 'row-start-3 ')}
    >
      <h2>Übersicht</h2>
      <div className='grid sm:grid-cols-2 content-stretch gap-5 sm:gap-5'>
        <OverviewCard title='Schüler:innen'>
          <div>
            {activeSortedHolders && activeSortedHolders?.length > 0 ? (
              <>
                <p className='mb-2'>
                  Nächste Lektion: <b>{nearestLessonHolderName}</b>
                </p>
                <p>
                  Aktive Schüler:innen/Gruppen:{' '}
                  <b>{activeSortedHolders.length}</b>
                </p>
              </>
            ) : (
              <p>Keine aktiven Schüler:innen/Gruppen erfasst</p>
            )}
            {inactiveLessonHolders?.length ? (
              <p>
                Archivierte Schüler:innen/Gruppen:{' '}
                <b>{inactiveLessonHolders.length}</b>
              </p>
            ) : (
              <p>Keine archivierten Schüler:innen/Gruppen</p>
            )}
          </div>
        </OverviewCard>

        <OverviewCard title='Todos'>
          <div>
            {todosOpen?.length ? (
              <p className=''>
                Offene Todos: <b>{todosOpen.length}</b>
              </p>
            ) : (
              <p>Keine offenen Todos</p>
            )}
            {todosDue?.length ? (
              <p className='text-warning'>
                Überfällige Todos: <b>{todosDue.length}</b>
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
