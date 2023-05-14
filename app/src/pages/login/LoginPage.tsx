import './loginPage.style.scss'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/button/Button.component'
import {
  signUpSupabase,
  recoverPasswordSupabase,
} from '../../supabase/users/users.supabase'
import Login from '../../components/login/Login.component'
import { TDisplayForm } from '../../types/types'
import Signup from '../../components/singup/Signup.component'
import ForgotPassword from '../../components/forgotPassword/ForgotPassword.component'
import Logo from '../../components/logo/Logo.component'

const dataRecover = {
  email: '',
}

const LoginPage = () => {
  const [displayForm, setDisplayForm] = useState<TDisplayForm>('login')

  return (
    <div className="login-page">
      <div className="container--logo">
        <Logo />
        {/* <h1 className="heading-logo">eleno</h1> */}
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
