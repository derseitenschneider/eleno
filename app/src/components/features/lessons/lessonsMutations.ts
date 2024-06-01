import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteLessonAPI } from "@/services/api/lessons.api"
import type { Lesson } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// TODO: Dynamicly set studentId and year either via props or via infos from
// former lesson
export function deleteLessonMutation(lessonId: number, onClose?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteLessonAPI(lessonId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["all-lessons"] })
      // Snapshot in case of a rollback.
      const previousLessons = queryClient.getQueryData([
        "all-lessons",
        { studentId: 48, year: 2024 },
      ])
      queryClient.setQueryData(
        ["all-lessons", { studentId: 48, year: 2024 }],
        (prev: Array<Lesson>) => {
          return prev?.filter((lesson) => lesson.id !== lessonId)
        },
      )

      onClose?.()
      return { previousLessons }
    },
    onSuccess: () => {
      toast.success("Lektion gelöscht.")
    },
    onError: (err, newLesson, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        ["all-lessons", { studentId: 48, year: 2024 }],
        context?.previousLessons,
      )
    },
  })
}
