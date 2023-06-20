import './forgotPassword.style.scss'

import { SetStateAction, FunctionComponent, useState } from 'react'
import { TDisplayForm } from '../../types/types'
import { recoverPasswordSupabase } from '../../supabase/users/users.supabase'
import Button from '../_reusables/button/Button.component'
import Loader from '../_reusables/loader/Loader'
interface ForgotPasswordProps {
  setDisplayForm: React.Dispatch<SetStateAction<TDisplayForm>>
}

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = ({
  setDisplayForm,
}) => {
  const [recoverSuccess, setRecoverSuccess] = useState(false)
  const [input, setInput] = useState('')
  const [isPending, setIsPending] = useState(false)

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsPending(true)
      await recoverPasswordSupabase(input)
      setRecoverSuccess(true)
      setInput('')
      setIsPending(false)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      {isPending ? (
        <Loader loading={isPending} />
      ) : (
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
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
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
              <span className="reset-message">
                Du hast eine Email für's Zurücksetzen deines Passworts erhalten.
                <br />
                Überprüfe dein Postfach...
              </span>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ForgotPassword
