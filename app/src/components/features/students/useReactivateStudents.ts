import { useMutation, useQueryClient } from '@tanstack/react-query'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { reactivateStudentsApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'

export function useReactivateStudents() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutateAsync: reactivateStudents,
    isPending: isReactivating,
    isError,
  } = useMutation({
    mutationFn: reactivateStudentsApi,
    onMutate: (reactivatedStudents) => {
      const previousStudents = queryClient.getQueryData([
        'students',
      ]) as Array<Student>

      queryClient.setQueryData(['students'], (prev: Array<Student>) =>
        prev.map((student) =>
          student.id in reactivatedStudents
            ? { ...student, archive: false }
            : student,
        ),
      )

      return { previousStudents }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      })
      queryClient.invalidateQueries({ queryKey: ['latest-3-lessons'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['students'], context?.previousStudents)
    },
  })
  return { reactivateStudents, isReactivating, isError }
}
