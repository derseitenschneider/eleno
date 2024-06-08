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
    onMutate: () => {
      // Snapshot in case of a rollback.
      const allLessons = queryClient.getQueryData([
        "all-lessons",
        {
          studentId: updatedLesson.studentId,
          year: updatedLesson.date.getFullYear(),
        },
      ]) as Array<Lesson> | undefined

      const latestLessons = queryClient.getQueryData(["latest-3-lessons"]) as
        | Array<Lesson>
        | undefined

      const combinedLessons: Array<Lesson> = []

      if (allLessons) combinedLessons.push(...allLessons)
      if (latestLessons) combinedLessons.push(...latestLessons)

      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        (prev: Array<Lesson> | undefined) => {
          return prev?.map((oldLesson) =>
            oldLesson.id === updatedLesson.id ? updatedLesson : oldLesson,
          )
        },
      )

      queryClient.setQueryData(
        ["latest-3-lessons"],
        (prev: Array<Lesson> | undefined) => {
          return prev?.map((oldLesson) =>
            oldLesson.id === updatedLesson.id ? updatedLesson : oldLesson,
          )
        },
      )

      onClose?.()
      return { allLessons, latestLessons }
    },

    onSuccess: async () => {
      toast.success("Änderungen gespeichert.")
      queryClient.invalidateQueries({
        queryKey: ["latest-3-lessons"],
      })
    },

    onError: (error, __, context) => {
      fetchErrorToast()

      console.log(error)
      queryClient.setQueryData(
        [
          "all-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        context?.allLessons,
      )
      queryClient.setQueryData(
        [
          "latest-3-lessons",
          {
            studentId: updatedLesson.studentId,
            year: updatedLesson.date.getFullYear(),
          },
        ],
        context?.latestLessons,
      )
    },
  })
}
