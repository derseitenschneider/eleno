import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { deleteRepertoireItemAPI } from '@/services/api/repertoire.api'
import type { Lesson, RepertoireItem } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export function useDeleteRepertoireItem() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { studentId } = useParams()
  const {
    mutate: deleteRepertoireItem,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: deleteRepertoireItemAPI,
    onMutate: (itemId) => {
      const previousRepertoire = queryClient.getQueryData([
        'repertoire',
        { studentId: Number(studentId) },
      ]) as Array<Lesson>

      queryClient.setQueryData(
        ['repertoire', { studentId: Number(studentId) }],
        (prev: Array<RepertoireItem>) =>
          prev?.filter((item) => item.id !== itemId),
      )

      return { previousRepertoire }
    },

    onSuccess: async () => {
      toast.success('Song gelöscht.')
      queryClient.invalidateQueries({
        queryKey: ['repertoire', { studentId }],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        ['repertoire', { studentId: Number(studentId) }],
        context?.previousRepertoire,
      )
    },
  })
  return { deleteRepertoireItem, isDeleting, isError }
}
