import fetchErrorToast from "@/hooks/fetchErrorToast"
import { createNoteAPI, updateNoteAPI } from "@/services/api/notes.api"
import type { Note } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function createNoteMutation(newNote: Note, onClose?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => createNoteAPI(newNote),
    onMutate: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] })

      // Snapshot in case of a rollback.
      const oldNotes = queryClient.getQueryData(["notes"]) as
        | Array<Note>
        | undefined

      queryClient.setQueryData(["notes"], (prev: Array<Note> | undefined) => {
        if (!prev) return [newNote]
        return [...prev, newNote]
      })
      onClose?.()
      return { oldNotes }
    },

    onSuccess: async () => {
      toast.success("Neue Notiz gespeichert.")
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(["notes"], context?.oldNotes)
    },
  })
}
