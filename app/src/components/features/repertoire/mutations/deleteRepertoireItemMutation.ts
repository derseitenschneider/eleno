import fetchErrorToast from "@/hooks/fetchErrorToast"
import { deleteRepertoireItemAPI } from "@/services/api/repertoire.api"
import type { Lesson, RepertoireItem } from "@/types/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function deleteRepertoireItemMutation(
  itemId: number,
  studentId: number,
  onClose?: () => void,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteRepertoireItemAPI(itemId),
    onMutate: () => {
      const previousRepertoire = queryClient.getQueryData([
        "repertoire",
        { studentId },
      ]) as Array<Lesson>

      queryClient.setQueryData(
        [
          "repertoire",
          {
            studentId,
          },
        ],
        (prev: Array<RepertoireItem>) =>
          prev?.filter((item) => item.id !== itemId),
      )

      onClose?.()
      return { previousRepertoire }
    },

    onSuccess: async () => {
      toast.success("Song gelöscht.")
      queryClient.invalidateQueries({
        queryKey: ["repertoire", { studentId }],
      })
    },

    onError: (_, __, context) => {
      fetchErrorToast()
      queryClient.setQueryData(
        ["repertoire", { studentId }],
        context?.previousRepertoire,
      )
    },
  })
}
