import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { completeTodoApi } from '@/services/api/todos.api'
import type { TTodoItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCompleteTodo() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutateAsync: completeTodo, isPending: isCompleting } = useMutation({
    mutationFn: completeTodoApi,

    onMutate: (id) => {
      const previousTodos = queryClient.getQueryData([
        'todos',
      ]) as Array<TTodoItem>

      queryClient.setQueryData(['todos'], (prev: Array<TTodoItem>) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, archive: true } : todo,
        ),
      )

      return { previousTodos }
    },
    onSuccess: () => {
      toast.success('Todo erledigt.')

      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['todos'], context?.previousTodos)
    },
  })
  return { completeTodo, isCompleting }
}
