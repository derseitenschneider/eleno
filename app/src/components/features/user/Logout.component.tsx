import { useUser } from "@/services/context/UserContext"

export default function Logout() {
  const { logout } = useUser()
  logout()
  return <div />
}
