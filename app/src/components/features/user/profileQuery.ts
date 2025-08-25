import { useQuery } from '@tanstack/react-query'
import { getProfileApi } from '@/services/api/user.api'
import { useUser } from '@/services/context/UserContext'

export default function useProfileQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfileApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
