import './loginPage.style.scss'

import Login from '../../components/features/user/login/Login.component'

import Signup from '../../components/features/user/singup/Signup.component'
import ForgotPassword from '../../components/features/user/forgotPassword/ForgotPassword.component'
import { useSearchParams } from 'react-router-dom'
import AnimatedLogo from '../../components/common/logo/AnimatedLogo.component'

const LoginPage = () => {
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
