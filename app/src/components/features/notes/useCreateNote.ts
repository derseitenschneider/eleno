import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { createNoteAPI } from '@/services/api/notes.api'
import type { Note } from '@/types/types'

export function useCreateNote() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: createNote, isPending: isCreating } = useMutation({
    mutationFn: createNoteAPI,
    onMutate: async (newNote) => {
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
      toast.success('Neue Notiz gespeichert.')
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(['notes'], context?.oldNotes)
    },
  })

  return { createNote, isCreating }
}
