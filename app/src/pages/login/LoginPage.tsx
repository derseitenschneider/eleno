import { useSearchParams } from 'react-router-dom'
import './loginPage.style.scss'

import Login from '../../components/features/user/login/Login.component'

import Signup from '../../components/features/user/singup/Signup.component'
import ForgotPassword from '@/components/features/user/forgotPassword/ForgotPassword.component'

function LoginPage() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page')
  if (!page || 'login' === page) return <Login />
  if ('signup' === page) return <Signup />
  if ('reset' === page) return <ForgotPassword />
}

export default LoginPage
