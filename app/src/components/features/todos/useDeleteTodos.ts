import fetchErrorToast from '@/hooks/fetchErrorToast'
import { deleteTodosApi } from '@/services/api/todos.api'
import type { TTodoItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeleteTodos() {
  const queryClient = useQueryClient()
  const {
    mutateAsync: deleteTodos,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: deleteTodosApi,
    onMutate: (deletedTodos) => {
      const previousTodos = queryClient.getQueryData([
        'todos',
      ]) as Array<TTodoItem>

      queryClient.setQueryData(['todos'], (prev: Array<TTodoItem>) =>
        prev.filter((todo) => !(todo.id in deletedTodos)),
      )

      return { previousTodos }
    },

    onSuccess: (_, todoIds) => {
      toast.success(`Todo${todoIds.length > 1 ? 's' : ''} gelöscht.`)
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['students'], context?.previousTodos)
    },
  })
  return { deleteTodos, isDeleting, isError }
}
