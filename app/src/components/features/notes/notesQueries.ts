import { fetchActiveNotesAPI } from "@/services/api/notes.api"
import { useUser } from "@/services/context/UserContext"
import { useQuery } from "@tanstack/react-query"

export function useActiveNotesQuery() {
  const { user } = useUser()
  const result = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchActiveNotesAPI(),
    enabled: Boolean(user),
  })

  return result
}
