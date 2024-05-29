import { useEffect } from "react"
import useGroupsQuery from "./components/features/groups/groupsQuery"
import {
  useLatestLessonsQuery,
  useLessonYearsQuery,
} from "./components/features/lessons/lessonsQuery"
import useStudentsQuery from "./components/features/students/studentsQuery"
import useTodosQuery from "./components/features/todos/todosQuery"
import OfflineBanner from "./components/ui/offlineBanner/OfflineBanner.component"
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
  const { isLoading: isLoadingLessonYears } = useLessonYearsQuery()

  useEffect(() => {
    const compoundIsLoading =
      isLoadingStudents ||
      isLoadingGroups ||
      isLoadingLatestLessons ||
      isLoadingTodos ||
      isLoadingLessonYears

    setIsLoading(compoundIsLoading)
  }, [
    setIsLoading,
    isLoadingStudents,
    isLoadingGroups,
    isLoadingLatestLessons,
    isLoadingTodos,
    isLoadingLessonYears,
  ])

  return (
    <>
      <div id='main'>{children}</div>
      <OfflineBanner />
    </>
  )
}

export default DataProvider
