import './loginPage.style.scss'
import { useSearchParams } from 'react-router-dom'

import Login from '../../components/features/user/login/Login.component'

import AnimatedLogo from '../../components/ui/logo/AnimatedLogo.component'
import ForgotPassword from '../../components/features/user/forgotPassword/ForgotPassword.component'
import Signup from '../../components/features/user/singup/Signup.component'

function LoginPage() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page')

  return (
    <div className="login-page">
      <div className="container--logo">
        <AnimatedLogo />
      </div>
      {page === null && <Login />}
      {page === 'login' && <Login />}
      {page === 'signup' && <Signup />}
      {page === 'reset-password' && <ForgotPassword />}
    </div>
  )
}

export default LoginPage
