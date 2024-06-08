import fetchErrorToast from "@/hooks/fetchErrorToast"
import { updateRepertoireItemAPI } from "@/services/api/repertoire.api"
import type { RepertoireItem } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function updateRepertoireItemMutation(
  updatedRepertoireItem: RepertoireItem,
  onClose?: () => void,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => updateRepertoireItemAPI(updatedRepertoireItem),
    onMutate: () => {
      // Snapshot in case of a rollback.
      const oldRepertoire = queryClient.getQueryData([
        "repertoire",
        { studentId: updatedRepertoireItem.studentId },
      ]) as Array<RepertoireItem> | undefined

      queryClient.setQueryData(
        [
          "repertoire",
          {
            studentId: updatedRepertoireItem.studentId,
          },
        ],
        (prev: Array<RepertoireItem> | undefined) => {
          return prev?.map((prevRepertoireItem) =>
            prevRepertoireItem.id === updatedRepertoireItem.id
              ? updatedRepertoireItem
              : prevRepertoireItem,
          )
        },
      )
      onClose?.()
      return { oldRepertoire }
    },

    onSuccess: async () => {
      toast.success("Änderungen gespeichert.")
      queryClient.invalidateQueries({
        queryKey: [
          "repertoire",
          { studentId: updatedRepertoireItem.studentId },
        ],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()

      queryClient.setQueryData(
        [
          "repertoire",
          {
            studentId: updatedRepertoireItem.studentId,
          },
        ],
        context?.oldRepertoire,
      )
    },
  })
}
