import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { reactivateGroupsApi } from '@/services/api/groups.api'
import type { Group } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useReactivateGroups() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutateAsync: reactivateGroups,
    isPending: isReactivating,
    isError,
  } = useMutation({
    mutationFn: reactivateGroupsApi,
    onMutate: (reactivatedGroups) => {
      const previousGroups = queryClient.getQueryData([
        'groups',
      ]) as Array<Group>

      queryClient.setQueryData(['groups'], (prev: Array<Group>) =>
        prev.map((group) =>
          group.id in reactivatedGroups ? { ...group, archive: false } : group,
        ),
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
      queryClient.setQueryData(['groups'], context?.previousGroups)
    },
  })
  return { reactivateGroups, isReactivating, isError }
}
