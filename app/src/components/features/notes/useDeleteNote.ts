import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteNoteAPI } from "@/services/api/notes.api"
import type { Note } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useDeleteNote() {
  const queryClient = useQueryClient()
  const {
    mutate: deleteNote,
    isPending: isDeleting,
    isError,
  } = useMutation({
    mutationFn: deleteNoteAPI,
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] })
      const previousNotes = queryClient.getQueryData(["notes"]) as Array<Note>

      queryClient.setQueryData(["notes"], (prev: Array<Note>) =>
        prev?.filter((note) => note.id !== noteId),
      )

      return { previousNotes }
    },

    onSuccess: async () => {
      toast.success("Notiz gelöscht.")
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(["notes"], context?.previousNotes)
    },
  })
  return { deleteNote, isDeleting, isError }
}
