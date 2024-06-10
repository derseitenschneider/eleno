import fetchErrorToast from "@/hooks/fetchErrorToast"
import { createNoteAPI } from "@/services/api/notes.api"
import { useUser } from "@/services/context/UserContext"
import type { Note } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function duplicateNoteMutation(
  noteToDuplicate: Note,
  onClose?: () => void,
) {
  const queryClient = useQueryClient()
  const newNote: Note = {
    ...noteToDuplicate,
    id: new Date().getMilliseconds(),
    title: `Kopie ${noteToDuplicate?.title}`,
  }
  return useMutation({
    mutationFn: () => createNoteAPI(newNote),
    onMutate: async () => {
      // Cancel outgoing refetches so they dont overwrite optimistic update.
      await queryClient.cancelQueries({ queryKey: ["notes"] })

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
      toast.success("Notiz dupliziert.")
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
