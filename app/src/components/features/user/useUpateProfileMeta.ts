import { useMutation, useQueryClient } from '@tanstack/react-query'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateUserMetaApi } from '@/services/api/user.api'
import type { Profile } from '@/types/types'

export function useUpdateProfileMeta() {
  const fetchErrorToast = useFetchErrorToast()
  const queryClient = useQueryClient()
  const { mutate: updateProfileMeta, isPending: isUpdating } = useMutation({
    mutationFn: updateUserMetaApi,
    onMutate: (newData) => {
      const oldData = queryClient.getQueryData(['profile']) as Profile

      queryClient.setQueryData(['profile'], (prev: Profile) => {
        return {
          ...prev,
          first_name: newData.firstName,
          last_name: newData.lastName,
        }
      })

      return { oldData }
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['notes'], context?.oldData)
    },
  })

  return { updateProfileMeta, isUpdating }
}
