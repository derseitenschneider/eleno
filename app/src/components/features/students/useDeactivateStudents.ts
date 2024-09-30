import { appConfig, isDemoMode } from '@/config'
import fetchErrorToast from '@/hooks/fetchErrorToast'
import mockStudents from '@/services/api/mock-db/mockStudents'
import { deactivateStudentApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDeactivateStudents() {
  const queryClient = useQueryClient()
  const {
    mutate: deactivateStudents,
    isPending: isDeactivating,
    isError,
  } = useMutation({
    mutationFn: deactivateStudentApi,
    onMutate: (data) => {
      const previousStudents = queryClient.getQueryData([
        'students',
      ]) as Array<Student>

      queryClient.setQueryData(['students'], (prev: Array<Student>) =>
        prev.map((student) => {
          if (student.id in data) return { ...student, archive: true }
          return student
        }),
      )

      return { previousStudents }
    },

    onSuccess: () => {
      toast.success('Schüler:in archiviert.')
      queryClient.invalidateQueries({
        queryKey: ['students'],
      })
      // if (isDemoMode) {
      //   queryClient.setQueryData(['students'], () => [...mockStudents])
      // }
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['students'], context?.previousStudents)
    },
  })
  return { deactivateStudents, isDeactivating, isError }
}
