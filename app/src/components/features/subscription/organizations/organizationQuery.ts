import { useQuery } from '@tanstack/react-query'
import { getOrganizationApi } from '@/services/api/organisations.api'
import { useUser } from '@/services/context/UserContext'
import useProfileQuery from '../../user/profileQuery'

export default function useOrganizationQuery() {
  const { user } = useUser()
  const { data } = useProfileQuery()
  const result = useQuery({
    queryKey: ['organization'],
    queryFn: () => getOrganizationApi(data?.organization_id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user) && Boolean(data?.organization_id),
  })
  return result
}
