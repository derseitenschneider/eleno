import { useQuery } from '@tanstack/react-query'
import { fetchTodosApi } from '@/services/api/todos.api'
import { useUser } from '@/services/context/UserContext'

export default function useTodosQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetchTodosApi(user?.id || ''),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: Boolean(user),
  })
  return result
}
