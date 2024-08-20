import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteLessonAPI } from "@/services/api/lessons.api"
import { deactivateStudentApi } from "@/services/api/students.api"
import type { Lesson, Student } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

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
        "students",
      ]) as Array<Student>

      queryClient.setQueryData(["students"], (prev: Array<Student>) =>
        prev.map((student) => {
          if (student.id in data) return { ...student, archive: true }
          return student
        }),
      )

      return { previousStudents }
    },

    onSuccess: () => {
      toast.success("Schüler:in archiviert.")
      queryClient.invalidateQueries({
        queryKey: ["students"],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["students"], context?.previousStudents)
    },
  })
  return { deactivateStudents, isDeactivating, isError }
}
