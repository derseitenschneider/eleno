import { useQuery } from '@tanstack/react-query'
import { fetchRepertoireAPI } from '@/services/api/repertoire.api'
import { useUser } from '@/services/context/UserContext'

export function useRepertoireQuery(holderId: number, holderType: 's' | 'g') {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['repertoire', { holder: `${holderType}-${holderId}` }],
    queryFn: () => fetchRepertoireAPI(holderId, holderType, user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })

  return result
}
