import { useQuery } from '@tanstack/react-query'
import { getSettingsApi } from '@/services/api/settings.api'
import { useUser } from '@/services/context/UserContext'

export default function useSettingsQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettingsApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
