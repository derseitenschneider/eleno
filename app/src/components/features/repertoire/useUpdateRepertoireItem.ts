import fetchErrorToast from "@/hooks/fetchErrorToast"
import {
  createRepertoireItemAPI,
  updateRepertoireItemAPI,
} from "@/services/api/repertoire.api"
import type { RepertoireItem } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdateRepertoireItem() {
  const queryClient = useQueryClient()
  const { mutate: updateRepertoireItem, isPending: isUpdating } = useMutation({
    mutationFn: updateRepertoireItemAPI,

    onMutate: (updatedItem) => {
      // Snapshot in case of a rollback.
      const previousRepertoire = queryClient.getQueryData([
        "repertoire",
        { studentId: updatedItem.studentId },
      ])
      queryClient.setQueryData(
        ["repertoire", { studentId: updatedItem.studentId }],
        (prev: Array<RepertoireItem>) =>
          prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      )
      return { previousRepertoire }
    },

    onSuccess: (updatedItem) => {
      toast.success("Änderungen gespeichert.")
      queryClient.invalidateQueries({
        queryKey: ["repertoire", { studentId: updatedItem.studentId }],
      })
    },

    onError: (_, newItem, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        ["repertoire", { studentId: newItem.studentId }],
        context?.previousRepertoire,
      )
    },
  })
  return { updateRepertoireItem, isUpdating }
}
