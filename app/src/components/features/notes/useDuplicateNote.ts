import fetchErrorToast from '@/hooks/fetchErrorToast'
import { createNoteAPI } from '@/services/api/notes.api'
import type { Note } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDuplicateNote() {
  const queryClient = useQueryClient()
  const { mutate: duplicateNote, isPending: isDuplicating } = useMutation({
    mutationFn: createNoteAPI,
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] })

      const oldNotes = queryClient.getQueryData(['notes']) as
        | Array<Note>
        | undefined

      queryClient.setQueryData(['notes'], (prev: Array<Note> | undefined) => {
        if (!prev) return [newNote]
        return [...prev, newNote]
      })
      return { oldNotes }
    },

    onSuccess: async () => {
      toast.success('Notiz dupliziert.')
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['notes'], context?.oldNotes)
    },
  })

  return { duplicateNote, isDuplicating }
}
