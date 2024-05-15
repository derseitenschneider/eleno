/* eslint-disable react/jsx-no-target-blank */
import { useSearchParams } from "react-router-dom"

import LoginHeader from "./LoginHeader.component"
import SignupCard from "./SignupCard.component"

type SignupProps = {
  className: string
}
function Signup({ className }: SignupProps) {
  const [_, setSearchParams] = useSearchParams()
  return (
    <div className={className}>
      <LoginHeader
        preText='Bereits ein Benutzerkonto?'
        buttonText='Login'
        onClick={() => {
          setSearchParams({ page: "login" })
        }}
      />
      <SignupCard />
    </div>
  )
}

export default Signup
