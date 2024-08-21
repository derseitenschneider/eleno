import fetchErrorToast from '@/hooks/fetchErrorToast'
import { createTodoApi } from '@/services/api/todos.api'
import type { TTodoItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateTodoItem() {
  const queryClient = useQueryClient()
  const { mutate: createTodoItem, isPending: isCreating } = useMutation({
    mutationFn: createTodoApi,

    onSuccess: (newItem) => {
      toast.success('Todo erstellt.')
      queryClient.setQueryData(['todos'], (prev: Array<TTodoItem>) => [
        ...prev,
        newItem,
      ])

      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },

    onError: (e) => {
      fetchErrorToast(e.message)
    },
  })
  return { createTodoItem, isCreating }
}
