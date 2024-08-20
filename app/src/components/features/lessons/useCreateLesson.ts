import fetchErrorToast from '@/hooks/fetchErrorToast'
import { createLessonAPI } from '@/services/api/lessons.api'
import type { Lesson } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCreateLesson() {
  const queryClient = useQueryClient()
  const { mutate: createLesson, isPending: isCreating } = useMutation({
    mutationFn: createLessonAPI,

    onSuccess: (newLesson) => {
      queryClient.setQueryData(['latest-3-lessons'], (prev: Array<Lesson>) => [
        ...prev,
        newLesson,
      ])
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

    onError: () => {
      fetchErrorToast()
    },
  })
  return { createLesson, isCreating }
}
