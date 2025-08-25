import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateSettingsApi } from '@/services/api/settings.api'

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingsApi,
    onMutate: (newSettings) => {
      const oldSettings = queryClient.getQueryData(['settings'])
      queryClient.setQueryData(['settings'], newSettings)

      return { oldSettings }
    },

    onSuccess: () => {
      toast.success('Einstellungen gespeichert')
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['settings'], context?.oldSettings)
    },
  })
  return { updateSettings, isUpdating }
}
