import { useQuery } from '@tanstack/react-query'
import { getSubscriptionApi } from '@/services/api/user.api'
import { useUser } from '@/services/context/UserContext'

export default function useSubscriptionQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['subscription'],
    queryFn: () => getSubscriptionApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
