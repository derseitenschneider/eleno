import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { reactivateTodoApi } from '@/services/api/todos.api'
import type { TTodoItem } from '@/types/types'

export function useReactivateTodo() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutateAsync: reactivateTodo,
    isPending: isReactivating,
    isError,
  } = useMutation({
    mutationFn: reactivateTodoApi,
    onMutate: (id) => {
      const previousTodos = queryClient.getQueryData([
        'todos',
      ]) as Array<TTodoItem>

      queryClient.setQueryData(['todos'], (prev: Array<TTodoItem>) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, archive: false } : todo,
        ),
      )

      return { previousTodos }
    },

    onSuccess: () => {
      toast.success('Todo wiederhergestellt.')
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
  })
  return { reactivateTodo, isReactivating, isError }
}
