import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateStudentsApi } from '@/services/api/students.api'
import type { Student } from '@/types/types'

export function useUpdateStudents() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const {
    mutate: updateStudents,
    isPending: isUpdating,
    isSuccess,
  } = useMutation({
    mutationFn: updateStudentsApi,

    onMutate: (updatedStudents) => {
      const previousStudents = queryClient.getQueryData(['students']) as
        | Array<Student>
        | undefined
      queryClient.setQueryData(
        ['students'],
        (prev: Array<Student> | undefined) => {
          if (!prev) return updatedStudents
          return prev.map((prevStudent) => {
            const updatedStudent = updatedStudents.find(
              (student) => student.id === prevStudent.id,
            )
            return updatedStudent
              ? { ...prevStudent, ...updatedStudent }
              : prevStudent
          })
        },
      )
      return { previousStudents }
    },
    onSuccess: () => {
      toast.success('Änderungen gespeichert.')
      queryClient.invalidateQueries({
        queryKey: ['students'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['students'], context?.previousStudents)
    },
  })
  return { updateStudents, isUpdating, isSuccess }
}
