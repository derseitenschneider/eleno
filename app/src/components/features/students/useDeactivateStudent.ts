import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteLessonAPI } from "@/services/api/lessons.api"
import { deactivateStudentApi } from "@/services/api/students.api"
import type { Lesson, Student } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export function useDeactivateStudent(studentIds: Array<number>) {
  const queryClient = useQueryClient()
  const {
    mutate: deactivateStudent,
    isPending: isDeactivating,
    isError,
  } = useMutation({
    mutationFn: () => deactivateStudentApi(studentIds),
    onMutate: () => {
      const previousStudents = queryClient.getQueryData([
        "students",
      ]) as Array<Student>

      queryClient.setQueryData(["students"], (prev: Array<Student>) =>
        prev.map((student) => {
          if (student.id in studentIds) return { ...student, archive: true }
          return student
        }),
      )

      return { previousStudents }
    },

    onSuccess: () => {
      toast.success("Lektion gelöscht.")
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
      queryClient.invalidateQueries({
        queryKey: ["all-lessons"],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["students"], context?.previousStudents)
    },
  })
  return { deactivateStudent, isDeactivating, isError }
}
