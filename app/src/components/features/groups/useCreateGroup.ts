import { useMutation, useQueryClient } from '@tanstack/react-query'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { createGroupApi } from '@/services/api/groups.api'
import type { Group } from '@/types/types'

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
      queryClient.setQueryData(['groups'], (prev: Array<Group>) => [
        ...prev,
        ...newGroup,
      ])
    },

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createGroup, isCreating, isError }
}
