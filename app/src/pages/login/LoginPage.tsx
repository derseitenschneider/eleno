import './loginPage.style.scss'

import Login from '../../components/login/Login.component'

import Signup from '../../components/singup/Signup.component'
import ForgotPassword from '../../components/forgotPassword/ForgotPassword.component'
import Logo from '../../components/common/logo/Logo.component'
import { useSearchParams } from 'react-router-dom'

const LoginPage = () => {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page')

  return (
    <div className="login-page">
      <div className="container--logo">
        <Logo />
      </div>
      {page === null && <Login />}
      {page === 'login' && <Login />}
      {page === 'signup' && <Signup />}
      {page === 'reset-password' && <ForgotPassword />}
    </div>
  )
}

export default LoginPage
