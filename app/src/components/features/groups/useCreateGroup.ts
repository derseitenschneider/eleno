import { isDemoMode } from '@/config'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { createGroupApi } from '@/services/api/groups.api'
import type { Group } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateGroup() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutate: createGroup,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: createGroupApi,

    onSuccess: (newGroup) => {
      if (!isDemoMode) {
        queryClient.setQueryData(['groups'], (prev: Array<Group>) => [
          ...prev,
          ...newGroup,
        ])
      }
    },

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createGroup, isCreating, isError }
}
