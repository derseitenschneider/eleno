import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateGroupApi } from '@/services/api/groups.api'
import type { Group } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAuthorizeGroupHomeworkLink() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutate: authorizeGroup,
    isPending: isAuthorizingGroup,
    isSuccess,
  } = useMutation({
    mutationFn: updateGroupApi,

    onMutate: (updatedGroup) => {
      const previousGroups = queryClient.getQueryData(['groups']) as
        | Array<Group>
        | undefined

      queryClient.setQueryData(['groups'], (prev: Array<Group> | undefined) => {
        if (!prev) return updatedGroup
        return prev.map((prevGroup) => {
          if (prevGroup.id === updatedGroup.id) {
            return updatedGroup
          }
          return prevGroup
        })
      })
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
  return { authorizeGroup, isAuthorizingGroup, isSuccess }
}
