import {
  fetchAllLessonsAPI,
  fetchLatestLessons,
  fetchLessonYears,
} from "@/services/api/lessons.api"
import { useUser } from "@/services/context/UserContext"
import { useQuery } from "@tanstack/react-query"

export function useLatestLessonsQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ["latest-3-lessons"],
    queryFn: () => fetchLatestLessons(),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })

  return result
}

export function useLessonYearsQuery(studentId: number) {
  const result = useQuery({
    queryKey: ["lesson-years", { studentId }],
    queryFn: () => fetchLessonYears(studentId),
  })

  return result
}

export function useAllLessonsPerStudent(year: number, studentId: number) {
  const result = useQuery({
    queryKey: ["all-lessons", { year, studentId }],
    queryFn: () => fetchAllLessonsAPI(studentId, year),
    staleTime: 1000 * 60 * 60 * 24,
  })

  return result
}
