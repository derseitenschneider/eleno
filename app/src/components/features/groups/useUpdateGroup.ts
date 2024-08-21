import fetchErrorToast from '@/hooks/fetchErrorToast'
import { updateGroupApi } from '@/services/api/groups.api'
import type { Group, Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateGroup() {
  const queryClient = useQueryClient()
  const {
    mutate: updateGroup,
    isPending: isUpdating,
    isSuccess,
  } = useMutation({
    mutationFn: updateGroupApi,
    onMutate: (updatedGroup) => {
      const previousGroups = queryClient.getQueryData(['students']) as
        | Array<Student>
        | undefined

      queryClient.setQueryData(['groups'], (prev: Array<Group>) =>
        prev.map((group) =>
          group.id === updatedGroup.id ? updatedGroup : group,
        ),
      )

      return { previousGroups }
    },

    onSuccess: () => {
      toast.success('Änderungen gespeichert.')
      queryClient.invalidateQueries({
        queryKey: ['groups'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['groups'], context?.previousGroups)
    },
  })
  return { updateGroup, isUpdating, isSuccess }
}
