import { useSearchParams } from 'react-router-dom'
import { SignupCardEmail } from './SignupCardEmail.component'
import { SignupCardPassword } from './SignupCardPassword.component'
import SignupSuccess from './SignupSuccess.component'

export function SignupEmail() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const signupSuccess = searchParams.get('signup')

  if (!email) {
    return <SignupCardEmail />
  }
  if (email && !signupSuccess) {
    return <SignupCardPassword />
  }
  if (email && signupSuccess) {
    return <SignupSuccess />
  }
}
