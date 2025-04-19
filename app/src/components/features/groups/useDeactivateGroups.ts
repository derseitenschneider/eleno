import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { deactivateGroupApi } from '@/services/api/groups.api'
import type { Group } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeactivateGroups() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutate: deactivateGroups,
    isPending: isDeactivating,
    isError,
  } = useMutation({
    mutationFn: deactivateGroupApi,
    onMutate: (groupIds) => {
      const previousGroups = queryClient.getQueryData([
        'groups',
      ]) as Array<Group>

      queryClient.setQueryData(['groups'], (prev: Array<Group>) =>
        prev.map((group) => {
          if (group.id in groupIds) return { ...group, archive: true }
          return group
        }),
      )
      return { previousGroups }
    },

    onSuccess: () => {
      toast.success('Gruppen archiviert.')
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['groups'], context?.previousGroups)
    },
  })
  return { deactivateGroups, isDeactivating, isError }
}
