import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { deleteMessageApi } from '@/services/api/messages.api'
import type { Message } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  const errorToast = useFetchErrorToast()
  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: deleteMessageApi,

    onMutate: (id: string) => {
      const prevMessages = queryClient.getQueryData(['messages']) as
        | Array<Message>
        | undefined

      queryClient.setQueryData(
        ['messages'],
        (prev: Array<Message> | undefined) => {
          return prev?.filter((prevMessage) => prevMessage.id !== id)
        },
      )

      return { prevMessages }
    },

    onSuccess: () => {
      toast('Nachricht gelöscht.')
      queryClient.invalidateQueries({
        queryKey: ['messages'],
      })
    },

    onError: (_, __, context) => {
      errorToast()

      queryClient.setQueryData(['messages'], context?.prevMessages)
    },
  })
  return { deleteMessage, isDeleting }
}
