import fetchErrorToast from "@/hooks/fetchErrorToast"
import { updateNoteAPI } from "@/services/api/notes.api"
import { updateRepertoireItemAPI } from "@/services/api/repertoire.api"
import type { Note, RepertoireItem } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function updateNoteMutation(updatedNote: Note, onClose?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => updateNoteAPI(updatedNote),
    onMutate: () => {
      // Snapshot in case of a rollback.
      const oldNotes = queryClient.getQueryData(["notes"]) as
        | Array<Note>
        | undefined

      queryClient.setQueryData(["notes"], (prev: Array<Note> | undefined) => {
        return prev?.map((prevNote) =>
          prevNote.id === updatedNote.id ? updatedNote : prevNote,
        )
      })
      onClose?.()
      return { oldNotes }
    },

    onSuccess: async () => {
      toast.success("Änderungen gespeichert.")
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
