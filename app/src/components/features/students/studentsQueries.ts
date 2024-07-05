import { fetchStudentsApi } from '@/services/api/students.api'
import { useQuery } from '@tanstack/react-query'

export default function useStudentsQuery() {
  const result = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchStudentsApi(),
    staleTime: 1000 * 60 * 60 * 24,
  })
  return result
}
