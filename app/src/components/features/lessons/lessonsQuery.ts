import {
  fetchLatestLessons,
  fetchLessonYears,
} from "@/services/api/lessons.api"
import { useUser } from "@/services/context/UserContext"
import { useQuery } from "@tanstack/react-query"

export function useLatestLessonsQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ["latest-lessons"],
    queryFn: () => fetchLatestLessons(),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}

export function useLessonYearsQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ["lesson-years"],
    queryFn: () => fetchLessonYears(),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
