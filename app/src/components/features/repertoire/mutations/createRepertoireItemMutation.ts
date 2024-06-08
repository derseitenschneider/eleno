import fetchErrorToast from "@/hooks/fetchErrorToast"
import { createRepertoireItemAPI } from "@/services/api/repertoire.api"
import type { RepertoireItem } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function createRepertoireItemMutation(
  newRepertoireItem: RepertoireItem,
  onSuccess: () => void,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => createRepertoireItemAPI(newRepertoireItem),

    onMutate: async () => {
      // Snapshot in case of a rollback.
      const previousRepertoire = queryClient.getQueryData([
        "repertoire",
        { studentId: newRepertoireItem.studentId },
      ])
      queryClient.setQueryData(
        ["repertoire", { studentId: newRepertoireItem.studentId }],
        (prev: Array<RepertoireItem>) => [...prev, newRepertoireItem],
      )
      return { previousRepertoire }
    },

    onSuccess: async () => {
      toast.success("Song hinzugefügt.")
      onSuccess()
      queryClient.invalidateQueries({
        queryKey: ["repertoire", { studentId: newRepertoireItem.studentId }],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        ["repertoire", { studentId: newRepertoireItem.studentId }],
        context?.previousRepertoire,
      )
    },
  })
}
