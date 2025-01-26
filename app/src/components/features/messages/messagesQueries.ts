import { getMessagesApi } from '@/services/api/messages.api'
import { useUser } from '@/services/context/UserContext'
import { useQuery } from '@tanstack/react-query'

export default function useMessagesQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessagesApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
