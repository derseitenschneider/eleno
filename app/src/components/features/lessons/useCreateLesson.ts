import fetchErrorToast from '@/hooks/fetchErrorToast'
import { createLessonAPI } from '@/services/api/lessons.api'
import type { Lesson } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateLesson() {
  const queryClient = useQueryClient()
  const { mutate: createLesson, isPending: isCreating } = useMutation({
    mutationFn: createLessonAPI,

    onMutate: (newLesson) => {
      // Snapshot in case of a rollback.
      const previousLessons = queryClient.getQueryData(['latest-3-lessons'])
      queryClient.setQueryData(['latest-3-lessons'], (prev: Array<Lesson>) => [
        ...prev,
        newLesson,
      ])
      return { previousLessons }
    },

    onSuccess: (newLesson) => {
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
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['latest-3-lessons'], context?.previousLessons)
    },
  })
  return { createLesson, isCreating }
}
