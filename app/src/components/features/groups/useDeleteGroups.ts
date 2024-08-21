import fetchErrorToast from '@/hooks/fetchErrorToast'
import { deleteGroupsApi } from '@/services/api/groups.api'
import type { Group } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteGroups() {
  const queryClient = useQueryClient()
  const {
    mutateAsync: deleteGroups,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: deleteGroupsApi,
    onMutate: (deletedGroups) => {
      const previousGroups = queryClient.getQueryData([
        'groups',
      ]) as Array<Group>

      queryClient.setQueryData(['groups'], (prev: Array<Group>) =>
        prev.filter((student) => !(student.id in deletedGroups)),
      )

      return { previousGroups }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['students'], context?.previousGroups)
    },
  })
  return { deleteGroups, isDeleting, isError }
}
