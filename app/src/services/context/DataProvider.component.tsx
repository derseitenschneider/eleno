import { useEffect } from 'react'
import useGroupsQuery from '../../components/features/groups/groupsQuery'
import { useLatestLessons } from '../../components/features/lessons/lessonsQueries'
import { useActiveNotesQuery } from '../../components/features/notes/notesQueries'
import useStudentsQuery from '../../components/features/students/studentsQueries'
import useTodosQuery from '../../components/features/todos/todosQuery'
import OfflineBanner from '../../components/ui/OfflineBanner.component'
import { useLoading } from './LoadingContext'

interface DataProviderProps {
  children: React.ReactNode
}

function DataProvider({ children }: DataProviderProps) {
  const { setIsLoading } = useLoading()

  const { isLoading: isLoadingStudents } = useStudentsQuery()
  const { isLoading: isLoadingGroups } = useGroupsQuery()
  const { isLoading: isLoadingLatestLessons } = useLatestLessons()
  const { isLoading: isLoadingTodos } = useTodosQuery()
  const { isLoading: isLoadingNotes } = useActiveNotesQuery()

  useEffect(() => {
    const compoundIsLoading =
      isLoadingStudents ||
      isLoadingGroups ||
      isLoadingLatestLessons ||
      isLoadingTodos ||
      isLoadingNotes ||
      false
    setIsLoading(compoundIsLoading)
  }, [
    setIsLoading,
    isLoadingStudents,
    isLoadingGroups,
    isLoadingLatestLessons,
    isLoadingTodos,
    isLoadingNotes,
  ])

  return (
    <>
      <OfflineBanner />
      <div id='main'>{children}</div>
    </>
  )
}

export default DataProvider
