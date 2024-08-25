import fetchErrorToast from '@/hooks/fetchErrorToast'
import { createRepertoireItemAPI } from '@/services/api/repertoire.api'
import type { RepertoireItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateRepertoireItem() {
  const queryClient = useQueryClient()
  const { mutate: createRepertoireItem, isPending: isCreating } = useMutation({
    mutationFn: createRepertoireItemAPI,

    onSuccess: (newItem) => {
      toast.success('Song hinzugefügt.')
      queryClient.setQueryData(
        [
          'repertoire',
          {
            holder: newItem.studentId
              ? `s-${newItem.studentId}`
              : `g-${newItem.groupId}`,
          },
        ],
        (prev: Array<RepertoireItem>) => [...prev, newItem],
      )
      queryClient.invalidateQueries({
        queryKey: [
          'repertoire',
          {
            holder: newItem.studentId
              ? `s-${newItem.studentId}`
              : `g-${newItem.groupId}`,
          },
        ],
      })
    },

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createRepertoireItem, isCreating }
}
