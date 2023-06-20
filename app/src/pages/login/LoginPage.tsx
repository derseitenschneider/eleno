import './loginPage.style.scss'
import { useState } from 'react'

import Login from '../../components/login/Login.component'
import { TDisplayForm } from '../../types/types'
import Signup from '../../components/singup/Signup.component'
import ForgotPassword from '../../components/forgotPassword/ForgotPassword.component'
import Logo from '../../components/_reusables/logo/Logo.component'

const LoginPage = () => {
  const [displayForm, setDisplayForm] = useState<TDisplayForm>('login')

  return (
    <div className="login-page">
      <div className="container--logo">
        <Logo />
      </div>
      {displayForm === 'login' && <Login setDisplayForm={setDisplayForm} />}
      {displayForm === 'signup' && <Signup setDisplayForm={setDisplayForm} />}
      {displayForm === 'forgotPassword' && (
        <ForgotPassword setDisplayForm={setDisplayForm} />
      )}
    </div>
  )
}

export default LoginPage
