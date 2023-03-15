import './login.style.scss'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../components/button/Button.component'
import {
  signUpSupabase,
  loginSupabase,
  recoverPasswordSupabase,
} from '../../supabase/users/users.supabase'
import { supabase } from '../../supabase/supabase'
import Loader from '../../components/loader/Loader'

const dataLogin = {
  email: '',
  password: '',
}

const dataSignup = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password2: '',
}

const dataRecover = {
  email: '',
}

const LoginPage = () => {
  const LOGIN = 1
  const SIGNUP = 2
  const FORGOT_PASSWORD = 3

  const [loading, setLoading] = useState(false)
  const [displayForm, setDisplayForm] = useState(LOGIN)
  const [inputLogin, setInputLogin] = useState(dataLogin)
  const [inputSignup, setInputSignup] = useState(dataSignup)
  const [inputRecover, setInputRecover] = useState(dataRecover)

  const [recoverSuccess, setRecoverSuccess] = useState(false)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [])

  const signUp = async (e: React.FormEvent) => {
    // [ ] error meassage for duplicate email-adress
    e.preventDefault()
    const { email, password, firstName, lastName } = inputSignup
    // Check if both passwords are identical
    if (password !== inputSignup.password2) {
      toast('Deine Passwörter stimmen nicht überein', {
        type: 'error',
        autoClose: 5000,
      })
      setInputSignup({ ...inputSignup, password: '', password2: '' })
      return
    }

    // Check if password is at least 6ch long
    if (password.length < 6) {
      toast('Dein Passwort muss mindestens 6 Zeichen beinhalten', {
        type: 'error',
        autoClose: 5000,
      })
      setInputSignup({ ...inputSignup, password: '', password2: '' })
      return
    }
    setLoading(true)
    const user = await signUpSupabase(email, password, firstName, lastName)
    setConfirmEmailSent(true)
    setLoading(false)
  }

  const logIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const error = await loginSupabase(inputLogin.email, inputLogin.password)
      if (error) throw error
    } catch (error) {
      toast('Email und/oder passwort inkorrekt!', { type: 'error' })
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setInputRecover({ email: '' })
    setRecoverSuccess(true)
    await recoverPasswordSupabase(inputRecover.email)
  }

  // Input controls
  const handlerInputLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name
    setInputLogin({ ...inputLogin, [name]: value })
  }

  const handlerInputSignup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name
    setInputSignup({ ...inputSignup, [name]: value })
  }
  return (
    <div className="login-page">
      <Loader loading={loading} />
      {displayForm === LOGIN && !loading && (
        <div className="card-login">
          <div className="wrapper wrapper--login">
            <h2 className="heading-2">Login</h2>
            <form action="" className="form form--login" onSubmit={logIn}>
              <div className="form-item">
                <label htmlFor="email">Email</label>
                <input
                  required
                  name="email"
                  type="text"
                  id="email"
                  value={inputLogin.email}
                  onChange={handlerInputLogin}
                />
              </div>
              <div className="form-item">
                <label htmlFor="password">Passwort</label>
                <input
                  required
                  type="password"
                  id="password"
                  name="password"
                  value={inputLogin.password}
                  onChange={handlerInputLogin}
                />
              </div>
              <Button
                type="submit"
                btnStyle="primary"
                label="Anmelden"
                className="button--login"
              />
            </form>
            <div className="container--links">
              <button onClick={() => setDisplayForm(SIGNUP)}>
                🤲 Noch kein Benutzerkonto?
              </button>
              <button onClick={() => setDisplayForm(FORGOT_PASSWORD)}>
                😅 Passwort vergessen?
              </button>
            </div>
          </div>
        </div>
      )}
      {/* // [ ] Add privacy policy checkbox */}
      {displayForm === SIGNUP && !loading && (
        <div className="card-login">
          <div className="wrapper wrapper--signup">
            {confirmEmailSent ? (
              <p>Der Aktivierungslink wurde an deine Email-Adresse gesendet</p>
            ) : (
              <>
                <h2 className="heading-2">Neues Benutzerkonto erstellen</h2>
                <form className="form form--signup" onSubmit={signUp}>
                  <div className="form-item form-item--firstName">
                    <label htmlFor="firstName">Vorname</label>
                    <input
                      required
                      name="firstName"
                      type="text"
                      id="firstName"
                      value={inputSignup.firstName}
                      onChange={handlerInputSignup}
                    />
                  </div>
                  <div className="form-item form-item--lastName">
                    <label htmlFor="lastName">Nachname</label>
                    <input
                      required
                      name="lastName"
                      type="text"
                      id="lastName"
                      value={inputSignup.lastName}
                      onChange={handlerInputSignup}
                    />
                  </div>
                  <div className="form-item form-item--email">
                    <label htmlFor="email">Email</label>
                    <input
                      required
                      name="email"
                      type="email"
                      id="email"
                      value={inputSignup.email}
                      onChange={handlerInputSignup}
                    />
                  </div>
                  <div className="form-item form-item--pw1">
                    <label htmlFor="password">Passwort</label>
                    <input
                      required
                      name="password"
                      type="password"
                      id="password"
                      value={inputSignup.password}
                      onChange={handlerInputSignup}
                    />
                  </div>
                  <div className="form-item form-item--pw2">
                    <label htmlFor="password2">Passwort-Wiederholung</label>
                    <input
                      required
                      name="password2"
                      type="password"
                      id="password2"
                      value={inputSignup.password2}
                      onChange={handlerInputSignup}
                    />
                  </div>
                  <Button
                    type="submit"
                    btnStyle="primary"
                    label="Erstellen"
                    className="button--signup"
                  />
                  <button
                    className="button button--account-exists"
                    onClick={() => {
                      setDisplayForm(LOGIN)
                    }}
                  >
                    ☝️ Ich habe bereits ein Benutzerkonto
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      {displayForm === FORGOT_PASSWORD && !loading && (
        <div className="card-login">
          <div className="wrapper wrapper--forgot-pw">
            {!recoverSuccess ? (
              <>
                <h2 className="heading-2">Passwort zurücksetzen</h2>
                <form className="form form--forgot-pw" onSubmit={resetPassword}>
                  <div className="form-item form-item--email">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={inputRecover.email}
                      onChange={(e) =>
                        setInputRecover({
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    btnStyle="primary"
                    label="Passwort zurücksetzen"
                    handler={resetPassword}
                  />
                  <button
                    className="button"
                    onClick={() => {
                      setDisplayForm(LOGIN)
                    }}
                  >
                    ...jetzt ist's mir wieder eingefallen 🙈
                  </button>
                </form>
              </>
            ) : (
              <p>
                Du hast eine Email fürs Zurücksetzen deines Passworts erhalten.
                Überprüfe dein Postfach...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
