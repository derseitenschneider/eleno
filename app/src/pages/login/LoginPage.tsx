import { useSearchParams } from 'react-router-dom'

import Login from '../../components/features/user/login/Login.component'

import Signup from '../../components/features/user/login/Signup.component'
import ForgotPassword from '@/components/features/user/login/ForgotPassword.component'

type LoginPageProps = {
  className: string
}
function LoginPage({ className }: LoginPageProps) {
  const [searchParams] = useSearchParams()
  // TODO: No darkmode

  const page = searchParams.get('page')
  if (!page || 'login' === page) return <Login className={className} />
  if ('signup' === page) return <Signup className={className} />
  if ('reset' === page) return <ForgotPassword className={className} />
  return null
}

export default LoginPage
