import fetchErrorToast from '@/hooks/fetchErrorToast'
import { completeTodoApi } from '@/services/api/todos.api'
import type { TTodoItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCompleteTodo() {
  const queryClient = useQueryClient()
  const { mutate: completeTodo, isPending: isCompleting } = useMutation({
    mutationFn: completeTodoApi,

    onMutate: (id) => {
      const prevTodos = queryClient.getQueryData(['todos']) as
        | Array<TTodoItem>
        | undefined
      queryClient.setQueryData(
        ['todos'],
        (prev: Array<TTodoItem> | undefined) => {
          const newTodos = prev?.filter((todo) => todo.id !== id)
          return newTodos
        },
      )
      return { prevTodos }
    },
    onSuccess: () => {
      toast.success('Todo erledigt.')

      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['todos'], () => context?.prevTodos)
    },
  })
  return { completeTodo, isCompleting }
}
