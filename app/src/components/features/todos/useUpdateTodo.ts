import fetchErrorToast from '@/hooks/fetchErrorToast'
import { updateTodoApi } from '@/services/api/todos.api'
import type { TTodoItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationFn: updateTodoApi,
    onMutate: (updatedTodo) => {
      const prevTodos = queryClient.getQueryData(['todos']) as
        | Array<TTodoItem>
        | undefined

      queryClient.setQueryData(
        ['todos'],
        (prev: Array<TTodoItem> | undefined) => {
          return prev?.map((prevTodo) =>
            prevTodo.id === updatedTodo.id ? updatedTodo : prevTodo,
          )
        },
      )

      return { prevTodos }
    },

    onSuccess: () => {
      toast.success('Änderungen gespeichert.')
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['todos'], context?.prevTodos)
    },
  })
  return { updateTodo, isUpdating }
}
