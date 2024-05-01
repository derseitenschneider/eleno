import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router-dom"
import LoginCard from "./LoginCard.component"
import LoginHeader from "./LoginHeader.component"

type LoginHeaderProps = {
  className: string
}
export default function Login({ className }: LoginHeaderProps) {
  const [_, setSearchParams] = useSearchParams()

  return (
    <div className={`${className}`}>
      <LoginHeader
        preText='Noch keinen Benutzerkonto?'
        buttonText='Sign up'
        onClick={() => setSearchParams({ page: "signup" })}
      />
      <LoginCard />
    </div>
  )
}
