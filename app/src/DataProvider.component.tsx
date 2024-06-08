import { useEffect } from "react"
import useGroupsQuery from "./components/features/groups/groupsQuery"
import { useLatestLessonsQuery } from "./components/features/lessons/lessonsQueries"
import { useActiveNotesQuery } from "./components/features/notes/notesQueries"
import useStudentsQuery from "./components/features/students/studentsQuery"
import useTodosQuery from "./components/features/todos/todosQuery"
import OfflineBanner from "./components/ui/OfflineBanner.component"
import { useLoading } from "./services/context/LoadingContext"

interface DataProviderProps {
  children: React.ReactNode
}

function DataProvider({ children }: DataProviderProps) {
  const { setIsLoading } = useLoading()

  const { isLoading: isLoadingStudents } = useStudentsQuery()
  const { isLoading: isLoadingGroups } = useGroupsQuery()
  const { isLoading: isLoadingLatestLessons } = useLatestLessonsQuery()
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
      <div id='main'>{children}</div>
      <OfflineBanner />
    </>
  )
}

export default DataProvider
