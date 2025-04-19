import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateMessageApi } from '@/services/api/messages.api'
import type { Message, TTodoItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useReadMessage() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: readMessage, isPending: isReading } = useMutation({
    mutationFn: (message: Message) =>
      updateMessageApi({ ...message, status: 'read' }),

    onMutate: (updatedMessage: Message) => {
      const prevMessages = queryClient.getQueryData(['messages']) as
        | Array<Message>
        | undefined

      queryClient.setQueryData(
        ['messages'],
        (prev: Array<Message> | undefined) => {
          return prev?.map((prevMessage) =>
            prevMessage.id === updatedMessage.id
              ? { ...updatedMessage, status: 'read' }
              : prevMessage,
          )
        },
      )

      return { prevMessages }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['messages'], context?.prevMessages)
    },
  })
  return { readMessage, isReading }
}
