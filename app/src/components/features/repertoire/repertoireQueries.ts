import { fetchLessonYears } from "@/services/api/lessons.api"
import { fetchRepertoireAPI } from "@/services/api/repertoire.api"
import { useQuery } from "@tanstack/react-query"

export function useRepertoireQuery(studentId: number) {
  const result = useQuery({
    queryKey: ["repertoire", { studentId }],
    queryFn: () => fetchRepertoireAPI(studentId),
    staleTime: 1000 * 60 * 60 * 24,
  })

  return result
}
