import { appConfig } from '@/config'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { createStudentsApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateStudents() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutate: createStudents,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationFn: createStudentsApi,

    onSuccess: (newStudents) => {
      toast.success('Neue Schüler:innen hinzugefügt')
      queryClient.setQueryData(['students'], (prev: Array<Student>) => [
        ...prev,
        ...newStudents,
      ])
      if (false) {
        queryClient.invalidateQueries({ queryKey: ['students'] })
      }
    },

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createStudents, isCreating, isError }
}
