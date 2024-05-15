import { useSearchParams } from "react-router-dom"
import LoginHeader from "./LoginHeader.component"
import ResetCard from "./ResetCard.component"

type ForgotPasswordProps = {
  className: string
}

function ForgotPassword({ className }: ForgotPasswordProps) {
  const [, setSearchParams] = useSearchParams()

  return (
    <div className={className}>
      <LoginHeader
        preText='Noch kein Benutzerkonto?'
        buttonText='Sign up'
        onClick={() => setSearchParams({ page: "signup" })}
      />

      <ResetCard />
    </div>
  )
}

export default ForgotPassword
