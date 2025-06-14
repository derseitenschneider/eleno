/* eslint-disable react/jsx-no-target-blank */
import { useSearchParams } from 'react-router-dom'

import LoginHeader from '../login/LoginHeader.component'
import { SignupEmail } from './SignupEmail.component'
import { useState } from 'react'

type SignupProps = {
  className: string
}
function Signup({ className }: SignupProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [email, setEmail] = useState()
  return (
    <div className={className}>
      <LoginHeader
        preText='Bereits ein Benutzerkonto?'
        buttonText='Login'
        onClick={() => {
          setSearchParams({ page: 'login' })
        }}
      />
      <SignupEmail />
    </div>
  )
}

export default Signup
