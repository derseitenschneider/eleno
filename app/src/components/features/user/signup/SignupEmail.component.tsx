import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SignupCardEmail } from './SignupCardEmail.component'
import { SignupCardPassword } from './SignupCardPassword.component'

export function SignupEmail() {
  const [searchParams, setSearchParams] = useSearchParams()

  if (!searchParams.get('email')) {
    return <SignupCardEmail />
  }
  if (searchParams.get('email')) {
    return <SignupCardPassword />
  }
}
