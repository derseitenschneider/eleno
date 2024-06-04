import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteLessonAPI } from "@/services/api/lessons.api"
import type { Lesson } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// TODO: Make it work with latest-3-lessons and with all-lessons
export function deleteLessonMutation(lessonId: number, onClose?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteLessonAPI(lessonId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["all-lessons"] })
      const lesson = queryClient.getQueryData(["all-lessons"])

      // Snapshot in case of a rollback.
      const previousLessons = queryClient.getQueryData([
        "all-lessons",
        { studentId: lesson.studentId, year: lesson.date.getFullYear() },
      ])
      queryClient.setQueryData(
        [
          "all-lessons",
          { studentId: lesson.studentId, year: lesson.date.getFullYear() },
        ],
        (prev: Array<Lesson>) => {
          return prev?.filter((oldLesson) => oldLesson.id !== lesson.id)
        },
      )
      onClose?.()
      return { previousLessons }
    },
    onSuccess: async () => {
      toast.success("Lektion gelöscht.")
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
    },
    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        [
          "all-lessons",
          { studentId: lesson.studentId, year: lesson.date.getFullYear() },
        ],
        context?.previousLessons,
      )
    },
  })
}
