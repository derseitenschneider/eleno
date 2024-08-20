import { fetchGroupsApi } from '@/services/api/groups.api'
import { useQuery } from '@tanstack/react-query'

export default function useGroupsQuery() {
  const result = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroupsApi,
    staleTime: 1000 * 60 * 60 * 24,
  })
  return result
}
