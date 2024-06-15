import {
  fetchLessonsByYearApi,
  fetchLatestLessons,
  fetchLessonYears,
  fetchAllLessonsApi,
} from "@/services/api/lessons.api"
import { useUser } from "@/services/context/UserContext"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export function useLessonYearsQuery(studentId: number) {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ["lesson-years", { studentId }],
    queryFn: () => fetchLessonYears(studentId),
    enabled: Boolean(user),
  })

  return result
}

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

export function useAllLessonsPerYear(year: number, studentId: number) {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ["all-lessons", { year, studentId }],
    queryFn: () => fetchLessonsByYearApi(studentId, year),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
    placeholderData: keepPreviousData,
  })

  return result
}

export function useAllLessons(studentId: number, enabled: boolean) {
  const result = useQuery({
    queryKey: ["all-lessons", { studentId }],
    queryFn: () => fetchAllLessonsApi(studentId),
    staleTime: 0,
    enabled,
    placeholderData: keepPreviousData,
  })

  return result
}
