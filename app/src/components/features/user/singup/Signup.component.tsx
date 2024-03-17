/* eslint-disable react/jsx-no-target-blank */
import { useSearchParams } from 'react-router-dom'
import './signup.style.scss'

import LoginHeader from '../login/LoginHeader.component'
import SignupCard from '../login/SingupCard.component'

function Signup() {
  const [_, setSearchParams] = useSearchParams()
  return (
    <>
      <LoginHeader
        preText="Bereits einen Account?"
        buttonText="Login"
        onClick={() => {
          setSearchParams({ page: 'login' })
        }}
      />
      <SignupCard />
    </>
  )
}

export default Signup
