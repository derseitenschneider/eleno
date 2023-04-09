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

const dataRecover = {
  email: '',
}

const LoginPage = () => {
  const [displayForm, setDisplayForm] = useState<TDisplayForm>('login')

  const [inputRecover, setInputRecover] = useState(dataRecover)

  const [recoverSuccess, setRecoverSuccess] = useState(false)

  // useEffect(() => {
  //   setLoading(false)
  // }, [])

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setInputRecover({ email: '' })
    setRecoverSuccess(true)
    await recoverPasswordSupabase(inputRecover.email)
  }

  return (
    <div className="login-page">
      {/* <Loader loading={loading} /> */}
      {displayForm === 'login' && <Login setDisplayForm={setDisplayForm} />}
      {/* // [ ] Add privacy policy checkbox */}
      {displayForm === 'signup' && <Signup setDisplayForm={setDisplayForm} />}
      {displayForm === 'forgotPassword' && (
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
                </form>
                <button
                  className="button--remembered"
                  onClick={() => {
                    setDisplayForm('login')
                  }}
                >
                  ...jetzt ist's mir wieder eingefallen 🙈
                </button>
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
