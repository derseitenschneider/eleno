import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { deleteMessageApi } from '@/services/api/messages.api'
import type { Message } from '@/types/types'

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
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

      return { prevMessages, id }
    },

    onSuccess: (_, __, context) => {
      const notifiedMessageIds = JSON.parse(
        localStorage.getItem('eleno_notifiedMessageIds') || '[]',
      ) as Array<string>

      const newMessageIds = notifiedMessageIds.filter((id) => id !== context.id)

      localStorage.setItem(
        'eleno_notifiedMessageIds',
        JSON.stringify(newMessageIds),
      )
      toast('Nachricht gelöscht.')
      queryClient.invalidateQueries({
        queryKey: ['messages'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['messages'], context?.prevMessages)
    },
  })
  return { deleteMessage, isDeleting }
}
