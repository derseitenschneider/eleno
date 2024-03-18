/* eslint-disable react/jsx-no-target-blank */
import { useSearchParams } from 'react-router-dom'

import LoginHeader from './LoginHeader.component'
import SignupCard from './SingupCard.component'

function Signup() {
  const [_, setSearchParams] = useSearchParams()
  return (
    <>
      <LoginHeader
        preText="Bereits einen Benutzerkonto?"
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
