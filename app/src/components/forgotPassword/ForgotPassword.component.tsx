import './forgotPassword.style.scss'

import { useState } from 'react'

import Button from '../common/button/Button.component'
import Loader from '../common/loader/Loader'
import { useUser } from '../../contexts/UserContext'
import { useSearchParams } from 'react-router-dom'

const ForgotPassword = () => {
  const [recoverSuccess, setRecoverSuccess] = useState(false)
  const [input, setInput] = useState('')
  const [isPending, setIsPending] = useState(false)
  const { recoverPassword } = useUser()

  const [_, setSearchParams] = useSearchParams()

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsPending(true)
      await recoverPassword(input)
      setRecoverSuccess(true)
      setInput('')
      setIsPending(false)
    } catch (err) {}
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
                    setSearchParams({ page: 'login' })
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
