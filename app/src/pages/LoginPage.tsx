import ForgotPassword from '@/components/features/user/login/PasswordRecovery.component'
import { useSearchParams } from 'react-router-dom'
import Login from '../components/features/user/login/Login.component'
import Signup from '../components/features/user/login/Signup.component'

type LoginPageProps = {
  className?: string
}
function LoginPage({ className = '' }: LoginPageProps) {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page')
  if (!page || 'login' === page) return <Login className={className} />
  if ('signup' === page) return <Signup className={className} />
  if ('reset' === page) return <ForgotPassword className={className} />
  return null
}

export default LoginPage
