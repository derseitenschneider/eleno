import useFetchErrorToast from '@/hooks/fetchErrorToast'
import { updateNoteAPI } from '@/services/api/notes.api'
import type { Note } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUpdateNote() {
  const queryClient = useQueryClient()
  const fetchErrorToast = useFetchErrorToast()
  const { mutate: updateNotes, isPending: isUpdating } = useMutation({
    mutationFn: updateNoteAPI,
    onMutate: (updatedNotes) => {
      const oldNotes = queryClient.getQueryData(['notes']) as
        | Array<Note>
        | undefined

      for (const updatedNote of updatedNotes) {
        queryClient.setQueryData(['notes'], (prev: Array<Note> | undefined) => {
          return prev?.map((prevNote) =>
            prevNote.id === updatedNote.id ? updatedNote : prevNote,
          )
        })
      }
      return { oldNotes }
    },

    onSuccess: async () => {
      toast.success('Änderungen gespeichert.')
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(['notes'], context?.oldNotes)
    },
  })

  return { updateNotes, isUpdating }
}
