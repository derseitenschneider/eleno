import { useQuery } from '@tanstack/react-query'
import { fetchGroupsApi } from '@/services/api/groups.api'
import { useUser } from '@/services/context/UserContext'

export default function useGroupsQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['groups'],
    queryFn: () => fetchGroupsApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
