import { fetchRepertoireAPI } from '@/services/api/repertoire.api'
import { useQuery } from '@tanstack/react-query'

export function useRepertoireQuery(holderId: number, holderType: 's' | 'g') {
  const result = useQuery({
    queryKey: ['repertoire', { holder: `${holderType}-${holderId}` }],
    queryFn: () => fetchRepertoireAPI(holderId, holderType),
    staleTime: 1000 * 60 * 60 * 24,
  })

  return result
}
