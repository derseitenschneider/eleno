import './forgotPassword.style.scss'

import { useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useUser } from '../../../../contexts/UserContext'
import Button from '../../../common/button/Button.component'
import Loader from '../../../common/loader/Loader'

function ForgotPassword() {
  const [recoverSuccess, setRecoverSuccess] = useState(false)
  const [input, setInput] = useState('')
  const [isPending, setIsPending] = useState(false)
  const { recoverPassword } = useUser()

  const [, setSearchParams] = useSearchParams()

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsPending(true)
      await recoverPassword(input)
      setRecoverSuccess(true)
      setInput('')
      setIsPending(false)
    } catch (err) {
      throw new Error(err.message)
    }
  }
  if (isPending) return <Loader loading={isPending} />
  return (
    <div className="card-login">
      <div className="wrapper wrapper--forgot-pw">
        {!recoverSuccess ? (
          <>
            <h2 className="heading-2">Passwort zurücksetzen</h2>
            <form className="form form--forgot-pw" onSubmit={resetPassword}>
              <div className="form-item form-item--email">
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    id="email"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </label>
              </div>
              <Button
                type="submit"
                btnStyle="primary"
                label="Passwort zurücksetzen"
                handler={resetPassword}
              />
            </form>
            <button
              type="button"
              className="button--remembered"
              onClick={() => {
                setSearchParams({ page: 'login' })
              }}
            >
              ...jetzt ist&apos;s mir wieder eingefallen 🙈
            </button>
          </>
        ) : (
          <span className="reset-message">
            Du hast eine Email für&apos;s Zurücksetzen deines Passworts
            erhalten.
            <br />
            Überprüfe dein Postfach...
          </span>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
