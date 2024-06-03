import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteLessonAPI, updateLessonAPI } from "@/services/api/lessons.api"
import type { Lesson } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function updateLessonMutation(
  updatedLesson: Lesson,
  onClose?: () => void,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => updateLessonAPI(updatedLesson),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["all-lessons"] })

      // Snapshot in case of a rollback.
      const previousLessons = queryClient.getQueryData([
        "all-lessons",
        {
          studentId: updatedLesson.studentId,
          year: updatedLesson.date.getFullYear(),
        },
      ])

      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        (prev: Array<Lesson>) => {
          return prev.map((oldLesson) =>
            oldLesson.id === updatedLesson.id ? updatedLesson : oldLesson,
          )
        },
      )
      onClose?.()
      return { previousLessons }
    },
    onSuccess: async () => {
      toast.success("Änderungen gespeichert.")
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
    },
    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        context?.previousLessons,
      )
    },
  })
}
