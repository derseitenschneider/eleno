import fetchErrorToast from "@/hooks/fetchErrorToast"
import { createRepertoireItemAPI } from "@/services/api/repertoire.api"
import type { RepertoireItem } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useCreateRepertoireItem() {
  const queryClient = useQueryClient()
  const { mutate: createRepertoireItem, isPending: isCreating } = useMutation({
    mutationFn: createRepertoireItemAPI,

    onMutate: (newItem) => {
      // Snapshot in case of a rollback.
      const previousRepertoire = queryClient.getQueryData([
        "repertoire",
        { studentId: newItem.studentId },
      ])
      queryClient.setQueryData(
        ["repertoire", { studentId: newItem.studentId }],
        (prev: Array<RepertoireItem>) => [...prev, newItem],
      )
      return { previousRepertoire }
    },

    onSuccess: (newItem) => {
      toast.success("Song hinzugefügt.")
      queryClient.invalidateQueries({
        queryKey: ["repertoire", { studentId: newItem.studentId }],
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
  return { createRepertoireItem, isCreating }
}
