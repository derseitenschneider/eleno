import { fetchTodosApi } from '@/services/api/todos.api'
import { useQuery } from '@tanstack/react-query'

export default function useTodosQuery() {
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetchTodosApi(),
    staleTime: 1000 * 60 * 60 * 24,
  })
  return result
}
