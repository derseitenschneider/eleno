import type { Group, Student } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GroupSchema } from '../groups/CreateGroup.component'
import { convertStudentToGroupApi } from '@/services/api/students.api'
import useFetchErrorToast from '@/hooks/fetchErrorToast'

export function useConvertStudentToGroup() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()

  const { mutate: convertToGroup, isPending: isConverting } = useMutation({
    mutationFn: ({
      student,
      groupData,
    }: { student: Student; groupData: GroupSchema }) =>
      convertStudentToGroupApi(student, groupData),
    onSuccess: (newGroup, context) => {
      // Update the groups cache
      queryClient.setQueryData(['groups'], (oldGroups: Group[] | undefined) =>
        oldGroups ? [...oldGroups, newGroup] : [newGroup],
      )

      // Remove the student from the students cache
      queryClient.setQueryData(
        ['students'],
        (oldStudents: Student[] | undefined) =>
          oldStudents?.filter((s) => s.id !== context.student.id),
      )

      // Invalidate and refetch affected queries
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['repertoire'] })
      queryClient.invalidateQueries({ queryKey: ['latest-3-lessons'] })
    },
    onError: (error) => {
      console.error('Error during student to group conversion:', error)
      fetchErrorToast()
    },
  })

  return { convertToGroup, isConverting }
}
