import { useQuery } from '@tanstack/react-query'
import { fetchAllFeatureFlags } from '@/services/api/feature-flags.api'
import { useUser } from '@/services/context/UserContext'

export default function useFeatureFlagQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['feature-flags'],
    queryFn: () => fetchAllFeatureFlags(),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
