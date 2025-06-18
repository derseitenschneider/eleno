/* eslint-disable react/jsx-no-target-blank */
import { useSearchParams } from 'react-router-dom'

import LoginHeader from '../login/LoginHeader.component'
import { SignupEmail } from './SignupEmail.component'

type SignupProps = {
  className: string
}
function Signup({ className }: SignupProps) {
  const [_, setSearchParams] = useSearchParams()

  return (
    <div className={className}>
      <SignupEmail />
    </div>
  )
}

export default Signup
