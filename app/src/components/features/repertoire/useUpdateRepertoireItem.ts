import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateRepertoireItemAPI } from '@/services/api/repertoire.api'
import type { RepertoireItem } from '@/types/types'

export function useUpdateRepertoireItem() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: updateRepertoireItem, isPending: isUpdating } = useMutation({
    mutationFn: updateRepertoireItemAPI,

    onMutate: (updatedItem) => {
      let holder = ''
      if (updatedItem.studentId) {
        holder = `s-${updatedItem.studentId}`
      } else {
        holder = `g-${updatedItem.groupId}`
      }

      const previousRepertoire = queryClient.getQueryData([
        'repertoire',
        { holder },
      ])

      queryClient.setQueryData(
        ['repertoire', { holder }],
        (prev: Array<RepertoireItem>) =>
          prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      )
      return { previousRepertoire }
    },

    onSuccess: (updatedItem) => {
      toast.success('Änderungen gespeichert.')
      queryClient.invalidateQueries({
        queryKey: ['repertoire', { studentId: updatedItem.studentId }],
      })
    },

    onError: (_, newItem, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        ['repertoire', { studentId: newItem.studentId }],
        context?.previousRepertoire,
      )
    },
  })
  return { updateRepertoireItem, isUpdating }
}
