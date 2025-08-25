import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { createLessonAPI } from '@/services/api/lessons.api'
import type { Lesson } from '@/types/types'

export function useCreateLesson() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: createLesson, isPending: isCreating } = useMutation({
    mutationFn: createLessonAPI,

    onSuccess: (newLesson) => {
      if (newLesson?.status === 'documented') {
        queryClient.setQueryData(
          ['latest-3-lessons'],
          (prev: Array<Lesson>) => [...prev, newLesson],
        )
        toast.success('Lektion gespeichert.')

        queryClient.invalidateQueries({
          queryKey: ['latest-3-lessons'],
        })

        queryClient.invalidateQueries({
          queryKey: [
            'all-lessons',
            {
              holder: newLesson?.studentId
                ? `s-${newLesson.studentId}`
                : `g-${newLesson?.groupId}`,
              year: newLesson?.date.getFullYear(),
            },
          ],
        })

        queryClient.invalidateQueries({
          queryKey: [
            'lesson-years',
            {
              holder: newLesson?.studentId
                ? `s-${newLesson.studentId}`
                : `g-${newLesson?.groupId}`,
              year: newLesson?.date.getFullYear(),
            },
          ],
        })
      }

      if (newLesson?.status === 'prepared') {
        queryClient.setQueryData(
          ['prepared-lessons'],
          (prev: Array<Lesson>) => [...prev, newLesson],
        )
        toast.success('Lektion gespeichert.')
      }
    },

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createLesson, isCreating }
}
