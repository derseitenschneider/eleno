import { useQuery } from '@tanstack/react-query'
import { fetchStudentsApi } from '@/services/api/students.api'
import { useUser } from '@/services/context/UserContext'

export default function useStudentsQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchStudentsApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
