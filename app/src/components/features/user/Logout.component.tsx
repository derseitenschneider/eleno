import { useUser } from '@/services/context/UserContext'
import { useQueryClient } from '@tanstack/react-query'

export default function Logout() {
  const { logout } = useUser()
  const queryClient = useQueryClient()
  queryClient.clear()
  logout()
  return <div />
}
